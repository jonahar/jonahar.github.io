/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { LEIZY_AVATAR, CONTACT_DATA, BIO_PARAGRAPHS } from '../data';

export default function About() {
  const octagonalClip = {
    clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
  };

  return (
    <section
      id="about"
      className="relative bg-stone-warm py-24 px-6 overflow-hidden border-b border-gold-antique/10"
    >
      {/* Top visually connecting alignment indicator vertical line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-16 w-[1px] bg-gradient-to-b from-transparent to-gold-antique/50" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-16 select-none">
          <p className="text-gold-antique font-sans font-semibold tracking-wider text-xs sm:text-sm uppercase mb-2">
            הסיפור שלי
          </p>
          <h2 className="text-basalt font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            אודות
          </h2>
          <div className="w-12 h-[2px] bg-gold-antique mx-auto mt-4" />
        </div>

        {/* Dynamic Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          
          {/* RIGHT COLUMN (Profile photo) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-5 flex justify-center w-full"
          >
            {/* Double-Octagon Container offset */}
            <div className="relative w-[260px] h-[260px] sm:w-[325px] sm:h-[325px]">
              {/* Floating Background Outline Octagon */}
              <div
                style={octagonalClip}
                className="absolute inset-0 border border-gold-antique/50 bg-transparent scale-102 translate-x-3 translate-y-3 pointer-events-none transition-transform duration-500 hover:scale-105"
              />
              
              {/* Primary Cropped Image Octagon */}
              <div
                style={octagonalClip}
                className="absolute inset-0 bg-basalt overflow-hidden shadow-2xl scale-[0.98]"
              >
                <img
                  src={LEIZY_AVATAR}
                  alt="Leizy Haris Jerusalem Professional Certified Tour Guide Portrait"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </motion.div>

          {/* LEFT COLUMN (Bio + Contacts info) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="lg:col-span-7 flex flex-col items-start text-right w-full"
          >
            <div className="space-y-6 text-olive-deep/90 max-w-2xl font-sans text-base sm:text-lg leading-relaxed text-right font-light">
              {BIO_PARAGRAPHS.map((paragraph, idx) => (
                <p key={idx} className="tracking-wide">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Contact Information Rows */}
            <div className="mt-10 sm:mt-12 space-y-4 w-full max-w-md">
              
              {/* Phone Row */}
              <a
                href={`tel:${CONTACT_DATA.phone.replace(/-/g, '')}`}
                className="group flex items-center justify-start gap-4 p-2 rounded-lg hover:bg-gold-antique/5 transition-all duration-300 pointer-events-auto"
              >
                {/* Badge Icon (Deepens on Hover) */}
                <div className="w-11 h-11 rounded-full bg-gold-antique/10 text-gold-antique flex items-center justify-center transition-all duration-300 group-hover:bg-gold-antique/25 group-hover:scale-105 shrink-0">
                  <Phone size={20} className="stroke-2" />
                </div>
                {/* Text Block displayed left-to-right (LTR) */}
                <span
                  style={{ direction: 'ltr' }}
                  className="font-sans font-medium text-basalt group-hover:text-gold-antique transition-colors duration-200 text-base"
                >
                  {CONTACT_DATA.phoneDisplay}
                </span>
              </a>

              {/* Email Row */}
              <a
                href={`mailto:${CONTACT_DATA.email}`}
                className="group flex items-center justify-start gap-4 p-2 rounded-lg hover:bg-gold-antique/5 transition-all duration-300 pointer-events-auto"
              >
                {/* Badge Icon */}
                <div className="w-11 h-11 rounded-full bg-gold-antique/10 text-gold-antique flex items-center justify-center transition-all duration-300 group-hover:bg-gold-antique/25 group-hover:scale-105 shrink-0">
                  <Mail size={18} className="stroke-2" />
                </div>
                {/* Text Block (LTR) */}
                <span
                  style={{ direction: 'ltr' }}
                  className="font-sans font-medium text-basalt group-hover:text-gold-antique transition-colors duration-200 text-base"
                >
                  {CONTACT_DATA.email}
                </span>
              </a>

              {/* Location/Address Row (Static) */}
              <div className="group flex items-center justify-start gap-4 p-2 select-none">
                {/* Badge Icon */}
                <div className="w-11 h-11 rounded-full bg-gold-antique/10 text-gold-antique flex items-center justify-center transition-all duration-300 group-hover:bg-gold-antique/20 shrink-0">
                  <MapPin size={20} className="stroke-2" />
                </div>
                {/* Text Block */}
                <span className="font-sans font-semibold text-olive-deep/80 text-base">
                  {CONTACT_DATA.address}
                </span>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
