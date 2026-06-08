/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Phone, MessageCircle, Mail, Facebook, Instagram, ArrowRight, ArrowLeft } from 'lucide-react';
import { BIO_LINKS, LEIZY_AVATAR } from '../data';

interface LinksPageProps {
  onGoHome: () => void;
}

export default function LinksPage({ onGoHome }: LinksPageProps) {
  const octagonalClip = {
    clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
  };

  // Helper to map type to specific Icon
  const getIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return <Phone size={20} className="stroke-2" />;
      case 'whatsapp':
        return <MessageCircle size={20} className="stroke-2 fill-current" />;
      case 'email':
        return <Mail size={18} className="stroke-2" />;
      case 'facebook':
        return <Facebook size={18} className="stroke-2 fill-current" />;
      case 'instagram':
        return <Instagram size={18} className="stroke-2" />;
      default:
        return <Phone size={18} />;
    }
  };

  // Helper to resolve individual button styles accurately based on specifications
  const getButtonStyles = (type: string) => {
    switch (type) {
      case 'phone':
        return 'bg-gold-antique text-basalt hover:bg-gold-light hover:scale-102 hover:shadow-gold-antique/20 shadow-sm';
      case 'whatsapp':
        return 'bg-olive-deep text-white hover:bg-olive-muted hover:scale-102 hover:shadow-olive-deep/20 shadow-sm';
      case 'email':
        return 'bg-olive-deep text-white hover:bg-olive-muted hover:scale-102 hover:shadow-olive-deep/20 shadow-sm';
      case 'facebook':
        return 'bg-olive-deep/80 text-white hover:bg-olive-muted hover:scale-102 shadow-xs';
      case 'instagram':
        return 'bg-olive-deep/80 text-white hover:bg-olive-muted hover:scale-102 shadow-xs';
      default:
        return 'bg-stone-warm border border-gold-antique text-basalt hover:bg-gold-antique/10';
    }
  };

  // Stagger wrapper options
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  return (
    <main className="relative min-h-screen w-full bg-stone-warm py-16 px-6 flex flex-col items-center justify-between overflow-hidden font-sans">
      
      {/* Decorative Fixed Ambient blur blobs in top-right and bottom-left */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-gold-antique/10 blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-gold-antique/8 blur-3xl pointer-events-none z-0" />

      {/* Return Home Header Link */}
      <div className="relative z-10 w-full max-w-sm flex items-center justify-between mb-6">
        <button
          onClick={onGoHome}
          className="group flex items-center gap-1.5 text-xs text-olive-muted/80 hover:text-gold-antique transition-all duration-300 border border-gold-antique/10 px-3 py-1.5 rounded-full bg-stone-warm/50 backdrop-blur-xs cursor-pointer"
        >
          {/* We show an ArrowRight to indicate going back in RTL reading, but since it's going back to homepage, let's use the natural language flow arrow */}
          <ArrowRight size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>חזרה לאתר הבית</span>
        </button>
        <span className="text-xs text-olive-muted/50 font-light select-none">כרטיס ביקור דיגיטלי</span>
      </div>

      {/* Primary Nested Centered Link Column */}
      <div className="relative z-10 w-full max-w-sm flex-grow flex flex-col items-center justify-center">
        
        {/* PROFILE BLOCK */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col items-center text-center w-full mb-8 select-none"
        >
          {/* Cropped octagonal picture */}
          <div className="relative w-[128px] h-[128px] mb-4">
            <div
              style={octagonalClip}
              className="absolute inset-0 bg-gold-antique/20 scale-105 pointer-events-none"
            />
            <div
              style={octagonalClip}
              className="absolute inset-0 bg-basalt overflow-hidden border border-gold-antique/30"
            >
              <img
                src={LEIZY_AVATAR}
                alt="לייזי הריס"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          <h2 className="font-serif text-2xl font-black text-basalt mb-1.5">
            לייזי הריס
          </h2>
          <p className="text-sm text-olive-muted font-medium tracking-wide">
            מורה דרך מוסמך | ירושלים
          </p>

          {/* Thin Gold Divider */}
          <div className="w-16 h-[1.5px] bg-gold-antique mt-4" />
        </motion.div>

        {/* LINK BUTTONS STACK (Staggered Load) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full space-y-4"
        >
          {BIO_LINKS.map((link) => (
            <motion.div key={link.id} variants={itemVariants}>
              <a
                href={link.url}
                target={link.type !== 'phone' && link.type !== 'email' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`relative flex items-center justify-center min-h-[56px] w-full px-6 py-4 rounded-xl font-semibold text-center transition-all duration-300 group ${getButtonStyles(
                  link.type
                )} border border-gold-antique/20 shadow-md hover:shadow-lg`}
              >
                {/* Visual Icon on the Left */}
                <span className="absolute left-5 text-current group-hover:scale-110 transition-transform duration-300">
                  {getIcon(link.type)}
                </span>
                
                {/* Centered Label */}
                <span className="font-sans text-base tracking-wide flex-grow text-center">
                  {link.label}
                </span>

                {/* Subtext overlay hover effect */}
                <span className={`absolute inset-0 rounded-xl transition-opacity duration-300 bg-black/5 opacity-0 group-hover:opacity-100`} />
              </a>
            </motion.div>
          ))}
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
