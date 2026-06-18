'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LeftConstellation } from './LeftConstellation';
import { RightConstellation } from './RightConstellation';
import { codeSnippets, techNodes } from '@/constants/hero';
import { CubeWireframe, OctahedronWireframe, SphereWireframe } from './HeroWireframe';
import { OrbitPlanet, SolarSystemOrbits } from './Orbit';


export function Hero() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="relative min-h-screen lg:h-full w-full flex items-center justify-center overflow-visible lg:overflow-hidden px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-accent/5 dark:from-primary/15 dark:via-background dark:to-accent/15" />

            {/* Constellation Background (Left and Right) */}
            <LeftConstellation />
            <RightConstellation />

            {/* Floating Wireframe Shapes (Slow Rotation + Float) */}
            <motion.div
                className="absolute pointer-events-none block scale-[0.6] sm:scale-75 md:scale-100"
                style={{ left: '8%', top: '28%' }}
                animate={{
                    y: [0, -12, 0],
                    rotate: [0, 360],
                }}
                transition={{
                    y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 30, repeat: Infinity, ease: "linear" }
                }}
            >
                <CubeWireframe />
            </motion.div>

            <motion.div
                className="absolute pointer-events-none block scale-[0.6] sm:scale-75 md:scale-100"
                style={{ right: '8%', top: '35%' }}
                animate={{
                    y: [0, 15, 0],
                    rotate: [0, -360],
                }}
                transition={{
                    y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 25, repeat: Infinity, ease: "linear" }
                }}
            >
                <OctahedronWireframe />
            </motion.div>

            <motion.div
                className="absolute pointer-events-none block scale-[0.6] sm:scale-75 md:scale-100"
                style={{ left: '35%', bottom: '15%' }}
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, 360],
                }}
                transition={{
                    y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 45, repeat: Infinity, ease: "linear" }
                }}
            >
                <SphereWireframe />
            </motion.div>

            {/* Glowing Tech Nodes (with pulses) */}
            {techNodes.map((node, i) => (
                <motion.div
                    key={node.name}
                    className={`absolute flex flex-col bg-white/60 dark:bg-slate-950/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/30 rounded-xl px-2.5 py-1.5 md:px-4 md:py-2.5 shadow-lg dark:shadow-xl select-none z-10 hover:border-primary/50 transition-colors duration-300 scale-75 md:scale-100 ${node.posClass}`}
                    animate={{
                        y: [0, i % 2 === 0 ? -8 : 8, 0],
                    }}
                    transition={{
                        duration: 5 + (i % 3),
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.4,
                    }}
                >
                    <span className="text-xs md:text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-100">
                        {node.name}
                    </span>
                    <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${node.color} opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 ${node.color}`}></span>
                        </span>
                        {node.status}
                    </span>
                </motion.div>
            ))}

            {/* Ephemeral Floating Code Snippets */}
            {codeSnippets.map((snippet, i) => (
                <motion.div
                    key={snippet.text}
                    className={`absolute font-mono text-[10px] md:text-xs text-slate-400/80 dark:text-slate-500/60 select-none pointer-events-none ${snippet.posClass}`}
                    animate={{
                        y: [0, i % 2 === 0 ? 10 : -10, 0],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                        y: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" },
                        opacity: { duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: snippet.delay }
                    }}
                >
                    {snippet.text}
                </motion.div>
            ))}

            {/* Technical Solar System (Revolving Orbit Design) */}
            {mounted && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-0 h-0 overflow-visible select-none block scale-[0.45] sm:scale-75 md:scale-100" style={{ zIndex: 1 }}>
                    <SolarSystemOrbits />
                    
                    {/* Orbit 1: rx=320, ry=110 */}
                    <OrbitPlanet rx={320} ry={110} duration={25} label="TCP" colorClass="bg-amber-400" initialAngle={0} />
                    <OrbitPlanet rx={320} ry={110} duration={25} label="UDP" colorClass="bg-amber-500" initialAngle={Math.PI} />

                    {/* Orbit 2: rx=400, ry=140 */}
                    <OrbitPlanet rx={400} ry={140} duration={35} label="DNS" colorClass="bg-blue-400" initialAngle={0} />
                    <OrbitPlanet rx={400} ry={140} duration={35} label="HTTP" colorClass="bg-emerald-400" initialAngle={(2 * Math.PI) / 3} />
                    <OrbitPlanet rx={400} ry={140} duration={35} label="TLS" colorClass="bg-rose-400" initialAngle={(4 * Math.PI) / 3} />

                    {/* Orbit 3: rx=480, ry=170 */}
                    <OrbitPlanet rx={480} ry={170} duration={45} label="Redis" colorClass="bg-red-500" initialAngle={0} />
                    <OrbitPlanet rx={480} ry={170} duration={45} label="Kafka" colorClass="bg-purple-400" initialAngle={Math.PI / 2} />
                    <OrbitPlanet rx={480} ry={170} duration={45} label="Docker" colorClass="bg-cyan-500" initialAngle={Math.PI} />
                    <OrbitPlanet rx={480} ry={170} duration={45} label="SQL" colorClass="bg-indigo-400" initialAngle={(3 * Math.PI) / 2} />

                    {/* Orbit 4: rx=560, ry=200 */}
                    <OrbitPlanet rx={560} ry={200} duration={60} label="OAuth 2.0" colorClass="bg-pink-500" initialAngle={0} />
                    <OrbitPlanet rx={560} ry={200} duration={60} label="Kubernetes" colorClass="bg-sky-500" initialAngle={Math.PI / 2} />
                    <OrbitPlanet rx={560} ry={200} duration={60} label="RAG Pipeline" colorClass="bg-teal-500" initialAngle={Math.PI} />
                    <OrbitPlanet rx={560} ry={200} duration={60} label="BGP" colorClass="bg-violet-500" initialAngle={(3 * Math.PI) / 2} />
                </div>
            )}

            {/* Center Content */}
            <div className="relative max-w-5xl mx-auto text-center z-10 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 bg-linear-to-br from-slate-900 to-slate-700 dark:from-white dark:via-white dark:to-slate-400 bg-clip-text text-transparent drop-shadow-sm">
                        Explain Bytes
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    className="text-sm hidden md:block sm:text-base md:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
                >
                    Learn systems, fundamentals, and deep engineering concepts <br />
                    - Explained simply.
                </motion.p>
            </div>
        </section>
    );
}
