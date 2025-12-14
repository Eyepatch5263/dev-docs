#!/usr/bin/env node

/**
 * Yjs WebSocket Server for Collaborative Editor
 * 
 * This server handles real-time document synchronization using Yjs.
 * Compatible with y-websocket v3 client.
 * Run with: node server/websocket-server.js
 */

const http = require('http');
const { WebSocketServer } = require('ws');
const Y = require('yjs');
const syncProtocol = require('y-protocols/sync');
const awarenessProtocol = require('y-protocols/awareness');
const encoding = require('lib0/encoding');
const decoding = require('lib0/decoding');

const PORT = process.env.WS_PORT || 1234;
const HOST = process.env.WS_HOST || 'localhost';

// Message types (must match y-websocket client)
const messageSync = 0;
const messageAwareness = 1;

// Document storage
const docs = new Map();

// Get or create a Yjs document with awareness
function getYDoc(docName) {
    if (!docs.has(docName)) {
        const doc = new Y.Doc();
        const awareness = new awarenessProtocol.Awareness(doc);

        docs.set(docName, {
            doc,
            awareness,
            conns: new Map(), // Map of conn -> Set of controlled client IDs
        });

        // Clean up awareness on document destroy
        doc.on('destroy', () => {
            docs.delete(docName);
        });
    }
    return docs.get(docName);
}

// Send a message to a client
function send(conn, message) {
    if (conn.readyState === 1) { // WebSocket.OPEN
        try {
            conn.send(message, (err) => {
                if (err) console.error('Send error:', err);
            });
        } catch (e) {
            console.error('Send exception:', e);
        }
    }
}

// Create HTTP server for health checks
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        status: 'ok',
        message: 'Yjs WebSocket Server is running',
        documents: docs.size,
        timestamp: new Date().toISOString(),
    }));
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (conn, req) => {
    const docName = req.url?.slice(1).split('?')[0] || 'default';
    console.log(`[${new Date().toISOString()}] Client connected to: ${docName}`);

    const { doc, awareness, conns } = getYDoc(docName);

    // Track this connection
    conns.set(conn, new Set());

    // Send sync step 1 (document state vector)
    {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, messageSync);
        syncProtocol.writeSyncStep1(encoder, doc);
        send(conn, encoding.toUint8Array(encoder));
    }

    // Send current awareness state
    {
        const awarenessStates = awareness.getStates();
        if (awarenessStates.size > 0) {
            const encoder = encoding.createEncoder();
            encoding.writeVarUint(encoder, messageAwareness);
            encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(
                awareness,
                Array.from(awarenessStates.keys())
            ));
            send(conn, encoding.toUint8Array(encoder));
        }
    }

    // Handle awareness updates and track which client IDs belong to this connection
    const awarenessChangeHandler = ({ added, updated, removed }, origin) => {
        const changedClients = added.concat(updated, removed);

        // Track client IDs that come FROM this connection
        if (origin === conn) {
            const controlledIds = conns.get(conn);
            if (controlledIds) {
                added.forEach(id => controlledIds.add(id));
                // Keep removed IDs for cleanup on disconnect
            }
        }

        // Broadcast to other clients (not the origin)
        if (origin !== conn && changedClients.length > 0) {
            const encoder = encoding.createEncoder();
            encoding.writeVarUint(encoder, messageAwareness);
            encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients));
            send(conn, encoding.toUint8Array(encoder));
        }
    };
    awareness.on('update', awarenessChangeHandler);

    // Handle document updates
    const updateHandler = (update, origin) => {
        if (origin !== conn) {
            const encoder = encoding.createEncoder();
            encoding.writeVarUint(encoder, messageSync);
            syncProtocol.writeUpdate(encoder, update);
            send(conn, encoding.toUint8Array(encoder));
        }
    };
    doc.on('update', updateHandler);

    // Handle incoming messages
    conn.on('message', (message) => {
        try {
            const data = new Uint8Array(message);
            const decoder = decoding.createDecoder(data);
            const messageType = decoding.readVarUint(decoder);

            switch (messageType) {
                case messageSync: {
                    const encoder = encoding.createEncoder();
                    encoding.writeVarUint(encoder, messageSync);
                    const syncMessageType = syncProtocol.readSyncMessage(decoder, encoder, doc, conn);

                    // If there's a response to send
                    if (encoding.length(encoder) > 1) {
                        send(conn, encoding.toUint8Array(encoder));
                    }
                    break;
                }
                case messageAwareness: {
                    const update = decoding.readVarUint8Array(decoder);

                    // Extract client IDs from the awareness update before applying
                    // The update format is: [len, clientId, clock, stateJson, ...]
                    try {
                        const updateDecoder = decoding.createDecoder(update);
                        const len = decoding.readVarUint(updateDecoder);
                        const controlledIds = conns.get(conn);

                        for (let i = 0; i < len; i++) {
                            const clientId = decoding.readVarUint(updateDecoder);
                            decoding.readVarUint(updateDecoder); // clock
                            const stateJson = decoding.readVarString(updateDecoder);

                            // Only track non-null states from this connection
                            if (controlledIds && stateJson.length > 0 && stateJson !== 'null') {
                                controlledIds.add(clientId);
                            }
                        }
                    } catch (e) {
                        // Parsing failed, fall back to normal apply
                    }

                    // Apply the update
                    awarenessProtocol.applyAwarenessUpdate(awareness, update, conn);
                    break;
                }
            }
        } catch (err) {
            console.error('Error processing message:', err);
        }
    });

    // Handle close
    conn.on('close', () => {
        console.log(`[${new Date().toISOString()}] Client disconnected from: ${docName}`);

        // First, remove awareness states for this connection
        const controlledIds = conns.get(conn);
        console.log(`[${new Date().toISOString()}] Controlled IDs to remove:`, controlledIds ? Array.from(controlledIds) : 'none');

        if (controlledIds && controlledIds.size > 0) {
            const idsToRemove = Array.from(controlledIds);
            console.log(`[${new Date().toISOString()}] Removing awareness states for:`, idsToRemove);
            awarenessProtocol.removeAwarenessStates(awareness, idsToRemove, null);
        }

        // Remove this connection from tracking
        conns.delete(conn);
        awareness.off('update', awarenessChangeHandler);
        doc.off('update', updateHandler);

        // Now find and remove orphaned awareness states
        // (states that don't belong to any active connection)
        const allControlledIds = new Set();
        conns.forEach((ids) => {
            ids.forEach(id => allControlledIds.add(id));
        });

        const orphanedIds = [];
        awareness.getStates().forEach((state, clientId) => {
            if (state !== null && !allControlledIds.has(clientId)) {
                orphanedIds.push(clientId);
            }
        });

        if (orphanedIds.length > 0) {
            console.log(`[${new Date().toISOString()}] Cleaning up orphaned awareness states:`, orphanedIds);
            awarenessProtocol.removeAwarenessStates(awareness, orphanedIds, null);
        }

        const remainingStates = awareness.getStates();
        console.log(`[${new Date().toISOString()}] Remaining awareness states after cleanup:`, remainingStates.size);
    });

    // Handle errors
    conn.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});

// Start the server
server.listen(PORT, HOST, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║         Yjs WebSocket Server for Collaborative Editor      ║
╠════════════════════════════════════════════════════════════╣
║  Status:    RUNNING                                        ║
║  Address:   ws://${HOST}:${PORT}                           ║
║  Health:    http://${HOST}:${PORT}                         ║
╚════════════════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down...');
    wss.close(() => {
        server.close(() => {
            console.log('Server closed.');
            process.exit(0);
        });
    });
});
