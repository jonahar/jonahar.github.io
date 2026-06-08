# Instructions for AI Coding Agents

Welcome! This file outlines the architectural standards, code patterns, design system, and content conventions for the **Leizy Haris (לייזי הריס) - Jerusalem Tour Guide** web application. 

Please read and adhere strictly to these guidelines when making modifications or implementing new features.

---

## 🏗️ Project Architecture & Router

This application is built with **React (Vite) + TypeScript** and styled using **Tailwind CSS**.

### 1. Client-Side State Navigation (No External Routers)
The application uses a lightweight, client-side custom route state inside `src/App.tsx`:
- State: `currentPath` (e.g., `'/'`, `'/business-card'`, `'/tour/old-city'`).
- Navigation function: `handleNavigate(path)` which updates the path state, handles browser history `pushState`, and scrolls smoothly to the top.
- **Rules**: Do NOT install external router libraries (like React Router) unless explicitly requested. Always preserve the simple dynamic render condition in `App.tsx`:
  - `/business-card` → Renders the `LinksPage` dashboard.
  - `/tour/:id` → Renders the dynamic `TourDetailsPage`.
  - `/` → Renders the main marketing landing page (`Navbar`, `Hero`, `About`, `Tours`, `Testimonials`, `Footer`).

### 2. Single-Source Static Database (`src/data.ts`)
To make content management trivial for the owner, all text data, media paths, links, and content blocks **must** reside in `src/data.ts` and use the defined TypeScript interfaces in `src/types.ts`.
- **Available Data Arrays/Objects**:
  - `HERO_BACKGROUND`: Main background image path.
  - `LEIZY_AVATAR`: Personal avatar image path.
  - `CONTACT_DATA`: Deep phone numbers and email details.
  - `BIO_PARAGRAPHS`: Paragraph text arrays for the About section.
  - `TOURS_DATA`: Dynamic `Tour[]` list.
  - `TESTIMONIALS_DATA`: Dynamic `Testimonial[]` list.
  - `BIO_LINKS`: Links used on the `/business-card` landing page.
- **Rule**: Never hardcode reviews, tour specs, bio paragraphs, or links directly in the page layouts. Always define them in `src/data.ts` and import them.

---

## 🎨 Visual Identity & Tailwind Theme

The visual design is inspired by the ancient, warm, stone-carved spirit of Jerusalem.

*   **Color Palette**:
    *   **Basalt/Slate Dark** (`text-basalt` / `#2F4139` or similar): Used for deep headings, bodies, and contrast headers.
    *   **Old Antique Gold** (`text-gold-antique` / `bg-gold-antique`): Used for primary accents, decorative borders, highlights, and buttons.
    *   **Warm Off-White/Sand** (`#FDFBF7` / `#FAF7F1`): The primary background colors to keep the layout welcoming, soft, and readable.
*   **Typography**:
    *   Custom elegant serif text for display headings (`font-serif`) to reflect longevity.
    *   Clean sans-serif fonts for the main content body (`font-sans`).
    *   Monospace numeric values (`font-mono`) for times, dates, and capacities.
*   **RTL Orientation**:
    *   The app is strictly layout-oriented in RTL (`dir="rtl"`).
    *   Pay close attention to hover icons, chevron directions (`ChevronRight` goes backward, `ChevronLeft` goes forward in RTL slider context), and absolute overlays.

---

## 🧩 Key Component Specs

### 1. `TourDetailsPage.tsx`
*   Renders dynamic page details for a specific tour via `selectedTour` matching.
*   Shows specific specs (time, people limit, start location) in a cohesive sticky info card.
*   Integrates an interactive fullscreen lightbox gallery for the high-definition tour scenes.
*   Maintains a prominent CTA booking button connected to customized WhatsApp pre-filled text.

### 2. `Testimonials.tsx`
*   Features an auto-playing guest review carousel.
*   Each card features a star rating, quote text, metadata badges (date and associated tour name), and manual pagination dots.
*   Autoplay pauses seamlessly when a cursor hovers over the active testimonial to ensure a comfortable reading experience.

### 3. `Navbar.tsx`
*   Features a blurred-opacity backdrop that remains fixed during scrolling.
*   Recognizes the active view route and dynamically alters standard navigation triggers (showing "About" & "Tours" links on `/`, but auto-switching to a discrete "Back to Home Page" backlink on dynamic subpages).

---

## 🤖 Directives for Future AI Work

1.  **Strict Hebrew Language Rule**: All customer-facing strings, badges, titles, descriptions, and CTA labels **must** be written in authentic, culturally warm Hebrew.
2.  **Verify Types First**: Ensure all parameters match their respective typescript layout declarations in `src/types.ts` before writing edits.
3.  **HMR Behavior**: Hot Module Replacement is disabled in this platform's preview. Build and view updates will automatically sync safely on the next cycle, so code edits should be stable and verified with `lint_applet` & `compile_applet`.
4.  **No Mock Platforms**: Keep all contacts, calling keys, and CTA buttons bound to real URIs (e.g. `tel:0547887355` or WhatsApp pre-filled templates). No fake simulated console logs, terminal alerts, or system markers.
