'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { CategoryInfo } from '@/data/flashcards';

interface CategorySelectorProps {
    categories: CategoryInfo[];
    cardCounts: Record<string, number>;
}

export function CategorySelector({ categories, cardCounts }: CategorySelectorProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
                <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link href={`/flashcards/${category.id}`}>
                        <div
                            className="group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer overflow-hidden"
                            style={{
                                borderColor: `${category.color}30`,
                                background: `linear-gradient(135deg, ${category.color}10 0%, ${category.color}05 100%)`,
                            }}
                        >
                            {/* Hover effect overlay */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{
                                    background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}08 100%)`,
                                }}
                            />

                            <div className="relative z-10">
                                {/* Icon placeholder - will be replaced with actual icons */}
                                <div
                                    className="w-full h-12 rounded-xl mb-4 flex items-center justify-center text-2xl"
                                    style={{
                                        background: `${category.color}20`,
                                        color: category.color,
                                    }}
                                >
                                    {category.icon === 'Database' && '🗄️'}
                                    {category.icon === 'Cpu' && '⚙️'}
                                    {category.icon === 'Network' && '🌐'}
                                    {category.icon === 'Boxes' && '📦'}
                                </div>

                                <h3 className="text-xl text-center font-bold mb-2 text-foreground group-hover:translate-x-1 transition-transform">
                                    {category.name}
                                </h3>
                                <p className="text-md text-center text-muted-foreground mb-4">
                                    {category.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span
                                        className="text-md font-medium px-3 py-1 rounded-full"
                                        style={{
                                            background: `${category.color}15`,
                                            color: 'white',
                                        }}
                                    >
                                        {cardCounts[category.id] || 0} cards
                                    </span>
                                    <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">
                                        →
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
