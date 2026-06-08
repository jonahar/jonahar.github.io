/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
}

export default function NotFoundPage({ onGoHome }: NotFoundPageProps) {
  const octagonalClip = {
    clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
  };

  return (
    <main className="relative min-h-screen w-full bg-stone-warm py-16 px-6 flex flex-col items-center justify-between overflow-hidden font-sans">
      
      {/* Decorative Fixed Ambient blur blobs in top-right and bottom-left */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-gold-antique/10 blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-gold-antique/8 blur-3xl pointer-events-none z-0" />

      {/* Header spacing */}
      <div className="w-full max-w-sm flex items-center justify-between mb-6" />

      {/* Main Centered Content */}
      <div className="relative z-10 w-full max-w-md flex-grow flex flex-col items-center justify-center">
        
        {/* Visual Graphic Block */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col items-center text-center w-full mb-8 select-none"
        >
          {/* Cropped octagonal shape with location icon */}
          <div className="relative w-[128px] h-[128px] mb-6 flex items-center justify-center">
            <div
              style={octagonalClip}
              className="absolute inset-0 bg-gold-antique/20 scale-105 pointer-events-none"
            />
            <div
              style={octagonalClip}
              className="absolute inset-0 bg-basalt overflow-hidden border border-gold-antique/30 flex items-center justify-center"
            >
              <MapPin size={48} className="text-gold-antique animate-pulse" />
            </div>
          </div>

          <h1 className="font-serif text-4xl font-black text-basalt mb-4">
            העמוד לא נמצא...
          </h1>
          <p className="text-lg text-olive-muted font-medium tracking-wide max-w-xs">
            נראה שהלכתם לאיבוד בסמטאות של ירושלים העתיקה. הדף שחיפשתם לא קיים.
          </p>

          {/* Thin Gold Divider */}
          <div className="w-16 h-[1.5px] bg-gold-antique mt-6" />
        </motion.div>

        {/* CTA Button to Home */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 15 }}
          className="w-full max-w-xs"
        >
          <button
            onClick={onGoHome}
            className="relative flex items-center justify-center min-h-[56px] w-full px-6 py-4 rounded-xl font-semibold text-center transition-all duration-300 group bg-gold-antique text-basalt hover:bg-gold-light hover:scale-102 hover:shadow-gold-antique/20 border border-gold-antique/20 shadow-md hover:shadow-lg cursor-pointer"
          >
            {/* Visual Icon on the Left (RTL Flow) */}
            <span className="absolute left-5 text-current group-hover:-translate-x-1 transition-transform duration-300">
              <ArrowRight size={20} className="stroke-2" />
            </span>
            
            {/* Centered Label */}
            <span className="font-sans text-base tracking-wide flex-grow text-center">
              חזרה לעמוד הראשי
            </span>

            {/* Subtext overlay hover effect */}
            <span className="absolute inset-0 rounded-xl transition-opacity duration-300 bg-black/5 opacity-0 group-hover:opacity-100" />
          </button>
        </motion.div>

      </div>

      {/* FOOTER */}
      <div className="relative z-10 text-center select-none w-full mt-12">
        <p className="font-sans text-xs text-olive-muted/60 font-light">
          © 2026 לייזי הריס · כל הזכויות שמורות
        </p>
      </div>

    </main>
  );
}
