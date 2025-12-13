'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface FeatureSectionProps {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    illustration: ReactNode;
    imagePosition?: 'left' | 'right';
}

export function FeatureSection({
    title,
    description,
    buttonText,
    buttonLink,
    illustration,
    imagePosition = 'right',
}: FeatureSectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-card border border-border rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                    <div
                        className={`grid md:grid-cols-2 gap-0 items-center ${imagePosition === 'left' ? 'md:flex-row-reverse' : ''
                            }`}
                    >
                        {/* Text Content */}
                        <div
                            className={`p-8 sm:p-12 lg:p-16 ${imagePosition === 'left' ? 'md:order-2' : ''}`}
                        >
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                {title}
                            </h2>
                            <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
                                {description}
                            </p>
                            <Link
                                href={buttonLink}
                                className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                            >
                                {buttonText}
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        {/* Illustration with Overlay */}
                        <div
                            className={`relative bg-linear-to-br from-primary/5 to-accent/5 p-8 sm:p-12 lg:p-16 ${imagePosition === 'left' ? 'md:order-1' : ''
                                }`}
                        >
                            <div className="relative">
                                {/* Decorative overlay circles */}
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />

                                {/* Illustration */}
                                <div className="relative z-10">
                                    {illustration}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
