import { Pool, QueryResult } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://admin:password@localhost:5434/postgres';

const pool = new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export const db = {
    query: <T extends Record<string, any> = any>(text: string, params?: any[]): Promise<QueryResult<T>> => {
        return pool.query<T>(text, params);
    },
    pool,
};
