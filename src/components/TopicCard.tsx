'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { iconMap } from '@/lib/icon-map';
import { FileText, LucideIcon } from 'lucide-react';

interface TopicCardProps {
    id: string;
    title: string;
    description: string;
    icon?: string;
    color?: string;
    count?: number;
    countLabel?: string;
    href: string;
    index?: number;
    isAvailable?: boolean;
}

export function TopicCard({
    id,
    title,
    description,
    icon,
    color,
    count,
    countLabel = 'items',
    href,
    index = 0,
    isAvailable = true,
}: TopicCardProps) {
    const IconComponent = icon ? (iconMap[icon] || FileText) : FileText;

    // Fallback color if undefined
    const cardColor = color || 'oklch(0.6 0.2 240)';
    return (
        <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Link
                href={isAvailable ? href : '#'}
                className={!isAvailable ? 'cursor-not-allowed' : ''}
            >
                <div
                    className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden h-full bg-muted/30 ${isAvailable
                            ? 'hover:scale-105 hover:shadow-xl'
                            : 'opacity-60'
                        }`}
                    style={{
                        borderColor: `${cardColor}30`,
                    }}
                >
                    {/* Hover effect overlay */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            background: `linear-gradient(135deg, ${cardColor}08 0%, ${cardColor}05 100%)`,
                        }}
                    />

                    <div className="relative z-10 flex flex-col items-center text-center h-full">
                        {/* Icon */}
                        <div
                            className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                            style={{
                                background: cardColor,
                            }}
                        >
                            <IconComponent className="w-6 h-6 text-white" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold mb-2 text-foreground group-hover:translate-x-1 transition-transform">
                            {title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-4 flex-1">
                            {description}
                        </p>

                        {/* Count/Status */}
                        {count !== undefined && (
                            <div className="flex items-center justify-between w-full pt-4 border-t border-border">
                                <span
                                    className="text-sm font-medium px-3 py-1 rounded-full"
                                    style={{
                                        background: `${cardColor}15`,
                                        color: 'white',
                                    }}
                                >
                                    {count} {countLabel}
                                </span>
                                <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">
                                    →
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
