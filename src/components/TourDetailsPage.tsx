/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Users, MapPin, MessageCircle, ArrowRight, Sparkles, Image as ImageIcon, X } from 'lucide-react';
import { Tour } from '../types';

interface TourDetailsPageProps {
  tour: Tour;
  onGoBack: () => void;
}

export default function TourDetailsPage({ tour, onGoBack }: TourDetailsPageProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-basalt font-sans leading-relaxed selection:bg-gold-antique/30 select-none pb-24">
      
      {/* Visual Header / Banner Section */}
      <section className="relative h-[55vh] w-full flex items-end justify-start bg-basalt overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={tour.imageUrl}
            alt={tour.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-basalt/60 to-basalt/30" />
        </div>

        {/* Hero title container - offset from fixed navbar */}
        <div className="relative z-20 max-w-5xl mx-auto w-full px-6 sm:px-12 pb-12 pt-24 flex flex-col items-start text-right">
          {/* Back Breadcrumb Link */}
          <button
            onClick={onGoBack}
            className="group flex items-center gap-1.5 text-xs text-white/90 hover:text-gold-antique transition-all duration-300 mb-4 bg-basalt/40 hover:bg-basalt/60 border border-white/10 px-4 py-2 rounded-full cursor-pointer shadow-md backdrop-blur-xs"
          >
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            <span>חזרה לעמוד הראשי</span>
          </button>

          <span className="text-gold-antique font-sans font-bold text-xs uppercase tracking-widest mb-3 border-r-2 border-gold-antique pr-3">
            סיור בלתי נשכח בירושלים
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-md">
            {tour.title}
          </h1>
        </div>
      </section>

      {/* Detail info body */}
      <section className="max-w-5xl mx-auto px-6 sm:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* RIGHT COLUMN (Content, points of interest, etc. - in RTL, reads right to left) */}
        <div className="lg:col-span-8 flex flex-col items-start text-right space-y-10 order-2 lg:order-none">
          
          {/* Main Description Block */}
          <div className="space-y-6">
            <h3 className="font-serif text-2xl font-black text-basalt flex items-center gap-2">
              <Sparkles size={20} className="text-gold-antique" />
              <span>על הסיור</span>
            </h3>
            <p className="font-sans text-neutral-700 text-base sm:text-lg leading-relaxed font-light whitespace-pre-line">
              {tour.longDescription || tour.description}
            </p>
          </div>

          {/* Points of Interest Group */}
          {tour.interestPoints && tour.interestPoints.length > 0 && (
            <div className="space-y-6 w-full">
              <h3 className="font-serif text-2xl font-black text-basalt flex items-center gap-2">
                <MapPin size={22} className="text-gold-antique" />
                <span>מוקדי עניין בולטים בסיור</span>
              </h3>
              
              <div className="space-y-4">
                {tour.interestPoints.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="p-6 rounded-2xl bg-white border border-gold-antique/10 shadow-xs hover:border-gold-antique/30 transition-all duration-300"
                  >
                    <h4 className="font-sans font-bold text-basalt text-lg sm:text-xl mb-2 text-gold-antique">
                      {point.name}
                    </h4>
                    <p className="font-sans text-neutral-600 text-sm sm:text-base leading-relaxed font-light">
                      {point.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery block */}
          {tour.gallery && tour.gallery.length > 0 && (
            <div className="space-y-6 w-full">
              <h3 className="font-serif text-2xl font-black text-basalt flex items-center gap-2">
                <ImageIcon size={22} className="text-gold-antique" />
                <span>גלריית רגעים ונופים</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {tour.gallery.map((imgSrc, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setActiveImage(imgSrc)}
                    className="h-32 sm:h-40 rounded-xl overflow-hidden bg-neutral-100 border border-gold-antique/10 cursor-pointer shadow-xs relative group"
                  >
                    <img
                      src={imgSrc}
                      alt={`גלריית ${tour.title} חלק ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* LEFT COLUMN (Static Sidebar Stats + Sticky Book Container) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6 order-1 lg:order-none w-full">
          
          {/* Quick info specs card */}
          <div className="p-6 rounded-2xl bg-white border border-gold-antique/15 shadow-md space-y-4 text-right">
            <h4 className="font-serif text-xl font-bold text-basalt mb-4 border-b border-gold-antique/10 pb-2">
              פרטי המסלול
            </h4>
            
            <div className="space-y-4">
              {/* Duration */}
              <div className="flex items-center justify-start gap-4 p-2 rounded-lg hover:bg-gold-antique/5 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gold-antique/10 text-gold-antique flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-light">משך זמן</p>
                  <p className="text-base font-medium text-basalt">{tour.duration}</p>
                </div>
              </div>

              {/* Group Size */}
              <div className="flex items-center justify-start gap-4 p-2 rounded-lg hover:bg-gold-antique/5 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gold-antique/10 text-gold-antique flex items-center justify-center shrink-0">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-light">גודל קבוצה</p>
                  <p className="text-base font-medium text-basalt">{tour.groupSize}</p>
                </div>
              </div>

              {/* Meeting Point */}
              <div className="flex items-center justify-start gap-4 p-2 rounded-lg hover:bg-gold-antique/5 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gold-antique/10 text-gold-antique flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-light">נקודת מפגש</p>
                  <p className="text-base font-medium text-basalt">{tour.meetingPoint}</p>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="pt-4 border-t border-gold-antique/10">
              <a
                href={tour.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-gold-antique hover:bg-gold-light text-basalt font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-sans text-sm animate-shimmer"
              >
                <MessageCircle size={18} className="fill-basalt stroke-none" />
                <span>תיאום סיור ב-WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

      </section>

      {/* Lightbox full-screen view for the gallery */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-basalt/95 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 text-white p-2 hover:text-gold-antique transition-colors duration-200 cursor-pointer"
              aria-label="닫기"
            >
              <X size={32} />
            </button>
            
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: 'spring', damping: 25 }}
              className="max-w-4xl max-h-[80vh] rounded-xl overflow-hidden"
            >
              <img
                src={activeImage}
                alt="תמונה ברזולוציה מלאה מהסיור"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
