/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onNavigate: (path: string) => void;
  activePath: string;
}

export default function Navbar({ onNavigate, activePath }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (targetId: string) => {
    setIsMobileMenuOpen(false);
    
    // If we're not on the main page, navigate there first, then scroll
    if (activePath !== '/') {
      onNavigate('/');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out ${
        isScrolled
          ? 'bg-stone-warm/90 backdrop-blur-md shadow-md border-b border-gold-antique/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* RIGHT SIDE (Desktop): Links */}
        <div className="hidden md:flex items-center gap-8 font-sans text-sm font-medium tracking-wide">
          {activePath === '/' ? (
            <>
              <button
                onClick={() => handleSmoothScroll('about')}
                className={`cursor-pointer hover:text-gold-antique transition-colors duration-200 ${
                  isScrolled ? 'text-basalt/80' : 'text-white/90'
                }`}
              >
                אודות
              </button>
              <button
                onClick={() => handleSmoothScroll('tours')}
                className={`cursor-pointer hover:text-gold-antique transition-colors duration-200 ${
                  isScrolled ? 'text-basalt/80' : 'text-white/90'
                }`}
              >
                סיורים
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate('/')}
              className={`cursor-pointer hover:text-gold-antique transition-colors duration-200 ${
                isScrolled ? 'text-basalt/80' : 'text-white/90'
              }`}
            >
              חזרה לעמוד הראשי
            </button>
          )}
          <button
            onClick={() => onNavigate('/business-card')}
            className={`cursor-pointer bg-gold-antique px-4 py-1.5 rounded text-basalt hover:bg-gold-light hover:text-basalt transition-all duration-300 font-medium`}
          >
            צור קשר
          </button>
        </div>

        {/* MOBILE Right side: Hamburger trigger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded focus:outline-none transition-colors duration-300 ${
              isScrolled ? 'text-basalt' : 'text-white'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* MOBILE Dropdown Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 bg-stone-warm/95 backdrop-blur-md border-b border-gold-antique/30 shadow-lg md:hidden overflow-hidden"
          >
            <div className="flex flex-col py-4 px-6 text-right font-sans">
              {activePath === '/' ? (
                <>
                  <button
                    onClick={() => handleSmoothScroll('about')}
                    className="py-3 text-right text-basalt font-medium text-lg border-b border-gold-antique/10 hover:text-gold-antique transition-all"
                  >
                    אודות
                  </button>
                  <button
                    onClick={() => handleSmoothScroll('tours')}
                    className="py-3 text-right text-basalt font-medium text-lg border-b border-gold-antique/10 hover:text-gold-antique transition-all"
                  >
                    סיורים
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/');
                  }}
                  className="py-3 text-right text-basalt font-medium text-lg border-b border-gold-antique/10 hover:text-gold-antique transition-all"
                >
                  חזרה לעמוד הראשי
                </button>
              )}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('/business-card');
                }}
                className="py-3 text-right text-gold-antique font-bold text-lg hover:text-gold-light transition-all"
              >
                צור קשר
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
