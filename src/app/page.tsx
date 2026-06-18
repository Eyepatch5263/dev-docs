'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Hero } from '@/components/Hero';
import { EngineeringTermsSlide } from '@/components/EngineeringTermsSlide';
import { CollaborativeEditorSlide } from '@/components/CollaborativeEditorSlide';
import { FlashDocsSection } from '@/components/FlashDocsSection';
import { FlashCardsSection } from '@/components/FlashCardsSection';
import { NewsletterForm } from '@/components/NewsletterForm';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const totalSections = 6;
  const isAnimating = useRef(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating.current) return;

      const threshold = 15; // ignore tiny scroll movements
      if (Math.abs(e.deltaY) < threshold) return;

      if (e.deltaY > 0) {
        // Scroll down
        if (index < totalSections - 1) {
          isAnimating.current = true;
          setIndex(prev => prev + 1);
          setTimeout(() => {
            isAnimating.current = false;
          }, 950); // matches transition duration + small gap
        }
      } else {
        // Scroll up
        if (index > 0) {
          isAnimating.current = true;
          setIndex(prev => prev - 1);
          setTimeout(() => {
            isAnimating.current = false;
          }, 950);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating.current) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY.current - touchEndY;
      const swipeThreshold = 40;

      if (Math.abs(diffY) < swipeThreshold) return;

      if (diffY > 0) {
        // Swipe up -> Scroll down
        if (index < totalSections - 1) {
          isAnimating.current = true;
          setIndex(prev => prev + 1);
          setTimeout(() => {
            isAnimating.current = false;
          }, 950);
        }
      } else {
        // Swipe down -> Scroll up
        if (index > 0) {
          isAnimating.current = true;
          setIndex(prev => prev - 1);
          setTimeout(() => {
            isAnimating.current = false;
          }, 950);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating.current) return;

      // Skip scroll snapping key events if user is currently typing in an input element
      const activeEl = document.activeElement;
      if (activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.getAttribute('contenteditable') === 'true'
      )) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        if (index < totalSections - 1) {
          isAnimating.current = true;
          setIndex(prev => prev + 1);
          setTimeout(() => {
            isAnimating.current = false;
          }, 950);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        if (index > 0) {
          isAnimating.current = true;
          setIndex(prev => prev - 1);
          setTimeout(() => {
            isAnimating.current = false;
          }, 950);
        }
      }
    };

    // Passive false is required to call e.preventDefault() on wheel to prevent native scrolling
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [index, isMobile]);

  return (
    <main className={`w-full relative bg-background ${isMobile ? 'min-h-screen overflow-y-auto overflow-x-hidden' : 'h-screen w-screen overflow-hidden'}`}>
      {/* Sidebar Pagination Dots - Desktop Only */}
      {!isMobile && (
        <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-4 hidden lg:flex">
          {Array.from({ length: totalSections }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (isAnimating.current || index === i) return;
                isAnimating.current = true;
                setIndex(i);
                setTimeout(() => {
                  isAnimating.current = false;
                }, 950);
              }}
              className="group relative flex items-center justify-center w-8 h-8 rounded-full focus:outline-none cursor-pointer"
              aria-label={`Navigate to section ${i + 1}`}
            >
              {/* Inner Dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === i 
                    ? 'bg-primary scale-125 ring-4 ring-primary/20' 
                    : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-400 dark:group-hover:bg-slate-500'
                }`}
              />
              {/* Tooltip */}
              <span className="absolute right-10 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/90 dark:bg-slate-900/90 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xs text-slate-600 dark:text-slate-400 shadow-xs whitespace-nowrap">
                {i === 0 && 'Intro'}
                {i === 1 && 'Flash Docs'}
                {i === 2 && 'Flash Cards'}
                {i === 3 && 'Engineering Terms'}
                {i === 4 && 'Collaborative'}
                {i === 5 && 'Newsletter'}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Snap Slides Wrapper */}
      <motion.div
        className="w-full h-full"
        animate={isMobile ? { y: 0 } : { y: `-${index * 100}vh` }}
        transition={isMobile ? { duration: 0 } : { duration: 0.85, ease: [0.16, 1, 0.3, 1] }} // smooth easeOutExpo
      >
        {/* Slide 1: Hero */}
        <div className="min-h-screen lg:h-screen w-full shrink-0">
          <Hero />
        </div>

        {/* Slide 2: Flash Docs */}
        <div className="min-h-screen lg:h-screen w-full shrink-0 flex items-center justify-center">
          <FlashDocsSection />
        </div>

        {/* Slide 3: Flash Cards */}
        <div className="min-h-screen lg:h-screen w-full shrink-0 flex items-center justify-center">
          <FlashCardsSection />
        </div>

        {/* Slide 4: Engineering Terms */}
        <div className="min-h-screen lg:h-screen w-full shrink-0">
          <EngineeringTermsSlide />
        </div>

        {/* Slide 5: Collaborative Editor */}
        <div className="min-h-screen lg:h-screen w-full shrink-0">
          <CollaborativeEditorSlide />
        </div>

        {/* Slide 6: Newsletter & Footer Combined */}
        <div className="min-h-screen lg:h-screen w-full shrink-0 flex flex-col justify-between bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
          <div className="flex-1 flex items-center justify-center w-full">
            <NewsletterForm />
          </div>
          <Footer />
        </div>
      </motion.div>
    </main>
  );
}
