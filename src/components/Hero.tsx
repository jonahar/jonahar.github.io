/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { HERO_BACKGROUND } from '../data';

interface HeroProps {
  onDiscoverTours: () => void;
}

export default function Hero({ onDiscoverTours }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-start overflow-hidden bg-basalt select-none"
    >
      {/* Background Image with Dark Left-to-Right Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BACKGROUND}
          alt="Jerusalem Scenic Ancient City Panoramic Wall at Golden Hour"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-[1.02]"
        />
        {/* Dark overlay: fades from dense charcoal dark (left) to semi-transparent (right) */}
        <div className="absolute inset-0 bg-gradient-to-r from-basalt/95 via-basalt/65 to-basalt/30 z-10" />
      </div>

      {/* Decorative architectural vertical gold line (positioned ~96px from the right edge, fades top/bottom) */}
      <div className="absolute top-0 bottom-0 right-[48px] md:right-[96px] w-[1px] bg-gradient-to-b from-transparent via-gold-antique/50 to-transparent z-20 pointer-events-none hidden sm:block" />

      {/* Content Container (Right-aligned under RTL flow) */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-24 flex justify-start text-right">
        <div className="max-w-2xl flex flex-col items-start">
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gold-antique font-sans font-semibold tracking-widest text-xs sm:text-sm uppercase mb-3 sm:mb-4 border-r-2 border-gold-antique/80 pr-3 leading-none"
          >
            מורה דרך מוסמך בירושלים
          </motion.p>

          {/* Large Name Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6 text-right"
          >
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight whitespace-nowrap">
              <span className="text-white">לייזי</span> <span className="text-gold-antique">הריס</span>
            </h1>
          </motion.div>

          {/* Description line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-stone-warm/90 font-sans text-base sm:text-lg lg:text-xl font-light leading-relaxed mb-8 max-w-lg text-right"
          >
            גלו את ירושלים דרך עיניים שמכירות כל אבן וסמטה. מסע בלתי נשכח אל מצולות ההיסטוריה והאמונות של בירת הנצח.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex gap-4 font-sans text-sm sm:text-base"
          >
            {/* Primary CTA with shimmer and smooth scroll scroll */}
            <button
              onClick={onDiscoverTours}
              className="bg-gold-antique hover:bg-gold-light text-basalt font-bold px-6 py-3.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-gold-antique/20 tracking-wide animate-shimmer cursor-pointer"
            >
              גלו את הסיורים
            </button>

            {/* Secondary CTA Outlined */}
            <a
              href="https://wa.me/972547887355"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/40 hover:border-gold-antique text-white hover:text-gold-antique font-semibold px-6 py-3.5 rounded-lg transition-all duration-300 hover:bg-white/5 tracking-wide flex items-center gap-2"
            >
              דברו איתי
            </a>
          </motion.div>
        </div>
      </div>

      {/* Floating Scroll Indicator Pill */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <div className="w-6 h-10 border-2 border-gold-antique/50 rounded-full flex justify-center items-start p-1.5 opacity-80 backdrop-blur-xs">
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-1.5 h-1.5 bg-gold-antique rounded-full"
          />
        </div>
      </div>
    </section>
  );
}
