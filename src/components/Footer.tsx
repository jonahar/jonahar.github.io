/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function Footer() {
  return (
    <footer className="bg-basalt text-stone-warm py-12 px-6 border-t border-gold-antique/10 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* RIGHT SIDE (Arabic / Hebrew text orientation: Hebrew reads right to left, so right side in desktop flex is rightmost, first/last depending on order) */}
        {/* Under RTL: we can place this first/second. Let's make it look balanced */}
        <div className="text-center md:text-right">
          <h4 className="font-serif text-lg font-bold tracking-wide text-white">
            לייזי הריס
          </h4>
          <p className="font-sans text-xs text-stone-warm/50 mt-1">
            מורה דרך מוסמך בירושלים · נשמה וסיפור בכל צעד
          </p>
        </div>

        {/* LEFT SIDE: Copyright notice with gold separator dots */}
        <div className="text-center md:text-left font-sans text-xs text-stone-warm/60 font-light">
          <span className="text-gold-antique mx-2">·</span>
          <span>כל הזכויות שמורות © 2026</span>
          <span className="text-gold-antique mx-2">·</span>
        </div>

      </div>
    </footer>
  );
}
