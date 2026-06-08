/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, Star, ChevronLeft, ChevronRight, Calendar, Landmark } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data';


export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for right (next in RTL), 1 for left (prev)
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoplay) {
      autoplayRef.current = setInterval(() => {
        handleNext();
      }, 7000);
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [currentIndex, isAutoplay]);

  const handleNext = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === TESTIMONIALS_DATA.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <section
      id="testimonials"
      className="py-24 bg-[#FAF7F1] text-basalt border-t border-gold-antique/10 text-right overflow-hidden select-none"
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-12 relative">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16 space-y-3">
          <span className="text-gold-antique font-sans font-bold text-xs uppercase tracking-widest bg-gold-antique/10 px-3.5 py-1.5 rounded-full">
            המלצות ומשובים
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-basalt tracking-tight">
            מה מטיילים מספרים
          </h2>
          <div className="w-16 h-1 bg-gold-antique rounded-full mt-2" />
        </div>

        {/* Carousel Container */}
        <div 
          className="relative min-h-[340px] md:min-h-[290px] flex items-center justify-center bg-white border border-gold-antique/15 rounded-3xl p-8 sm:p-12 shadow-sm hover:shadow-md transition-shadow duration-300"
          onMouseEnter={() => setIsAutoplay(false)}
          onMouseLeave={() => setIsAutoplay(true)}
        >
          {/* Decorative Big background Quote Icon */}
          <div className="absolute top-6 right-6 text-gold-antique/10 pointer-events-none">
            <Quote size={96} className="rotate-180 transform scale-x-[-1]" />
          </div>

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full flex flex-col items-start justify-between h-full space-y-6"
            >
              {/* Stars rating Display */}
              <div className="flex items-center gap-1">
                {[...Array(TESTIMONIALS_DATA[currentIndex].rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-gold-antique text-gold-antique" />
                ))}
              </div>

              {/* Testimonial Quote */}
              <p className="font-sans text-stone-700 text-base sm:text-lg md:text-xl font-light italic leading-relaxed text-right w-full">
                "{TESTIMONIALS_DATA[currentIndex].quote}"
              </p>

              {/* Author & Tour Info Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full border-t border-gold-antique/10 pt-4 gap-4">
                {/* Author Metadata */}
                <div>
                  <h4 className="font-sans font-extrabold text-[#2F4139] text-base sm:text-lg">
                    {TESTIMONIALS_DATA[currentIndex].name}
                  </h4>
                  <p className="text-xs text-gold-antique font-medium">
                    {TESTIMONIALS_DATA[currentIndex].category}
                  </p>
                </div>

                {/* Tour Badge & Date */}
                <div className="flex flex-wrap gap-3 items-center text-xs text-neutral-500 font-sans">
                  <span className="flex items-center gap-1 bg-gold-antique/10 text-basalt px-2.5 py-1 rounded-full border border-gold-antique/20">
                    <Landmark size={12} className="text-gold-antique" />
                    <span>{TESTIMONIALS_DATA[currentIndex].tourName}</span>
                  </span>
                  <span className="flex items-center gap-1 text-neutral-400">
                    <Calendar size={12} />
                    <span>{TESTIMONIALS_DATA[currentIndex].date}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Micro Controllers */}
        <div className="flex items-center justify-between mt-8 w-full">
          
          {/* Previous Slide Button (Left Arrow in RTL points right/back in order) */}
          <button
            onClick={handlePrev}
            aria-label="המלצה קודמת"
            className="w-12 h-12 rounded-full border border-gold-antique/20 hover:border-gold-antique bg-white text-basalt flex items-center justify-center hover:bg-gold-antique/5 active:scale-95 transition-all duration-300 cursor-pointer shadow-xs"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots Indicators */}
          <div className="flex items-center gap-2">
            {TESTIMONIALS_DATA.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? -1 : 1);
                  setCurrentIndex(idx);
                }}
                aria-label={`עבור לשקופית ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx 
                    ? 'w-6 bg-gold-antique' 
                    : 'w-2.5 bg-gold-antique/30 hover:bg-gold-antique/65'
                }`}
              />
            ))}
          </div>

          {/* Next Slide Button */}
          <button
            onClick={handleNext}
            aria-label="המלצה הבאה"
            className="w-12 h-12 rounded-full border border-gold-antique/20 hover:border-gold-antique bg-white text-basalt flex items-center justify-center hover:bg-gold-antique/5 active:scale-95 transition-all duration-300 cursor-pointer shadow-xs"
          >
            <ChevronLeft size={24} />
          </button>

        </div>

      </div>
    </section>
  );
}
