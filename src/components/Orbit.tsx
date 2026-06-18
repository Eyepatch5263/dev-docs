"use client"
import { useEffect } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';

interface OrbitPlanetProps {
    rx: number;
    ry: number;
    duration: number;
    delay?: number;
    label: string;
    colorClass?: string;
    initialAngle?: number;
}

export const OrbitPlanet = ({ rx, ry, duration, delay = 0, label, colorClass = "bg-primary", initialAngle = 0 }: OrbitPlanetProps) => {
    const angle = useMotionValue(initialAngle);
    
    useEffect(() => {
        const controls = animate(angle, initialAngle + 2 * Math.PI, {
            ease: "linear",
            duration: duration,
            repeat: Infinity,
            delay: delay
        });
        return controls.stop;
    }, [angle, duration, delay, initialAngle]);
    
    const x = useTransform(angle, a => Math.cos(a) * rx);
    const y = useTransform(angle, a => Math.sin(a) * ry);
    
    return (
        <motion.div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 rounded-full border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-400 shadow-xs select-none pointer-events-none hover:scale-105 hover:border-primary/50 dark:hover:border-primary/50 transition-transform duration-200"
            style={{ x, y }}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />
            {label}
        </motion.div>
    );
};

export const SolarSystemOrbits = () => (
    <svg 
        viewBox="-500 -500 1000 1000" 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] pointer-events-none opacity-60 dark:opacity-85"
        style={{ overflow: 'visible' }}
    >
        {/* Glow behind the center */}
        <defs>
            <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
        </defs>
        <circle cx="0" cy="0" r="150" fill="url(#sun-glow)" />

        {/* Orbit Ellipses */}
        {/* Orbit 1 */}
        <ellipse cx="0" cy="0" rx="320" ry="110" className="stroke-slate-400/50 dark:stroke-slate-700/80 fill-none" strokeWidth="1" strokeDasharray="3 3" />
        
        {/* Orbit 2 */}
        <ellipse cx="0" cy="0" rx="400" ry="140" className="stroke-slate-400/50 dark:stroke-slate-700/80 fill-none" strokeWidth="1" strokeDasharray="4 4" />
        
        {/* Orbit 3 */}
        <ellipse cx="0" cy="0" rx="480" ry="170" className="stroke-slate-400/50 dark:stroke-slate-700/80 fill-none" strokeWidth="1" strokeDasharray="3 3" />
        
        {/* Orbit 4 */}
        <ellipse cx="0" cy="0" rx="560" ry="200" className="stroke-slate-400/50 dark:stroke-slate-700/80 fill-none" strokeWidth="1" strokeDasharray="5 5" />
    </svg>
);