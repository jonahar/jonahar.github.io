/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Clock, Users, MapPin, MessageCircle } from 'lucide-react';
import { TOURS_DATA } from '../data';

interface ToursProps {
  onSelectTour: (id: string) => void;
}

export default function Tours({ onSelectTour }: ToursProps) {
  return (
    <section
      id="tours"
      className="bg-[#FAF7F2] py-24 px-6 overflow-hidden border-b border-gold-antique/5"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mb-16 select-none">
          <p className="text-gold-antique font-sans font-semibold tracking-wider text-xs sm:text-sm uppercase mb-2">
            מה אנחנו מציעים
          </p>
          <h2 className="text-basalt font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            הסיורים שלנו
          </h2>
          <div className="w-12 h-[2px] bg-gold-antique mx-auto mt-4" />
        </div>

        {/* Tour Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full max-w-5xl">
          {TOURS_DATA.map((tour, idx) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: idx * 0.15 }}
              onClick={() => onSelectTour(tour.id)}
              className="group relative bg-white border border-gold-antique/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Tour Top Image Container */}
              <div className="h-56 relative overflow-hidden bg-basalt">
                <img
                  src={tour.imageUrl}
                  alt={tour.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Card Body content */}
              <div className="p-6 sm:p-8 flex-grow flex flex-col text-right justify-between">
                
                <div>
                  {/* Title */}
                  <h3 className="font-serif text-2xl font-bold text-basalt mb-1 group-hover:text-gold-antique transition-colors">
                    {tour.title}
                  </h3>
                  <p className="text-xs text-gold-antique font-sans font-medium mb-3">לחצו לפרטים מלאים ותמונות מהסיור ←</p>

                  {/* Description */}
                  <p className="font-sans text-stone-600 font-light text-sm sm:text-base leading-relaxed mb-6">
                    {tour.description}
                  </p>

                  {/* Metadata Stats row (duration, group size, meeting point) */}
                  <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-stone-warm/60 border border-gold-antique/5 rounded-xl text-neutral-600 font-sans text-xs sm:text-sm mb-6">
                    
                    {/* Duration */}
                    <div className="flex flex-col items-center justify-center text-center">
                      <Clock size={16} className="text-gold-antique mb-1 shrink-0" />
                      <span className="font-light text-neutral-500 text-[11px] sm:text-xs">משך זמן</span>
                      <span className="font-medium text-basalt text-[12px] sm:text-sm mt-0.5">{tour.duration}</span>
                    </div>

                    {/* Group Size */}
                    <div className="flex flex-col items-center justify-center text-center border-x border-gold-antique/10">
                      <Users size={16} className="text-gold-antique mb-1 shrink-0" />
                      <span className="font-light text-neutral-500 text-[11px] sm:text-xs">משתתפים</span>
                      <span className="font-medium text-basalt text-[12px] sm:text-sm mt-0.5">{tour.groupSize}</span>
                    </div>

                    {/* Meeting Point */}
                    <div className="flex flex-col items-center justify-center text-center">
                      <MapPin size={16} className="text-gold-antique mb-1 shrink-0" />
                      <span className="font-light text-neutral-500 text-[11px] sm:text-xs">מפגש</span>
                      <span className="font-medium text-basalt text-[12px] sm:text-sm mt-0.5">{tour.meetingPoint}</span>
                    </div>

                  </div>

                  {/* Highlights Bulleted List */}
                  <div className="mb-8">
                    <p className="font-sans font-semibold text-basalt text-sm mb-3">נקודות ציון מרכזיות:</p>
                    <ul className="space-y-2 text-right">
                      {tour.highlights.map((highlight) => (
                        <li
                          key={highlight.id}
                          className="flex items-start justify-start gap-2 text-neutral-600 font-sans text-xs sm:text-sm leading-relaxed"
                        >
                          {/* Gold diamond bullet */}
                          <span className="text-gold-antique text-xs shrink-0 select-none mt-1">◆</span>
                          <span className="font-light">{highlight.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* WhatsApp Order Button */}
                <div className="mt-auto">
                  <a
                    href={tour.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-2 w-full bg-gold-antique hover:bg-gold-light text-basalt font-bold py-3.5 px-6 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 font-sans text-sm sm:text-base animate-shimmer"
                  >
                    <MessageCircle size={18} className="fill-basalt stroke-none" />
                    <span>הזמינו דרך WhatsApp</span>
                  </a>
                </div>

              </div>

              {/* Decorative underline border revealing from right to left on hover */}
              <div className="absolute bottom-0 right-0 h-[3px] bg-gold-antique w-full scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500 ease-out" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
