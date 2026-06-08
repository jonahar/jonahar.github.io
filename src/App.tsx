/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Tours from './components/Tours';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import LinksPage from './components/LinksPage';
import TourDetailsPage from './components/TourDetailsPage';
import NotFoundPage from './components/NotFoundPage';
import { TOURS_DATA } from './data';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Sync routing state on forward/backward interactions
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update logic to navigate paths cleanly on client-side
  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0 });
  };

  const handleDiscoverTours = () => {
    const toursSection = document.getElementById('tours');
    if (toursSection) {
      toursSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isHomePage = currentPath === '/';
  const isLinksPage = currentPath === '/business-card';
  const isTourPage = currentPath.startsWith('/tour/');
  const tourId = isTourPage ? currentPath.split('/tour/')[1] : null;
  const selectedTour = tourId ? TOURS_DATA.find((t) => t.id === tourId) : null;
  const isNotFound = !isHomePage && !isLinksPage && !(isTourPage && selectedTour);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-stone-warm text-basalt font-sans antialiased selection:bg-gold-antique/30 selection:text-basalt overflow-x-hidden"
    >
      {isLinksPage ? (
        <LinksPage onGoHome={() => handleNavigate('/')} />
      ) : isTourPage && selectedTour ? (
        <div className="flex flex-col min-h-screen">
          <Navbar onNavigate={handleNavigate} activePath={currentPath} />
          <TourDetailsPage tour={selectedTour} onGoBack={() => handleNavigate('/')} />
          <Footer />
        </div>
      ) : isNotFound ? (
        <NotFoundPage onGoHome={() => handleNavigate('/')} />
      ) : (
        <div className="flex flex-col min-h-screen">
          <Navbar onNavigate={handleNavigate} activePath={currentPath} />
          <Hero onDiscoverTours={handleDiscoverTours} />
          <About />
          <Tours onSelectTour={(id) => handleNavigate(`/tour/${id}`)} />
          <Testimonials />
          <Footer />
        </div>
      )}
    </div>
  );
}
