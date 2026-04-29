
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Profile from './sections/Profile';
import Skills from './sections/Skills';
import VinylProjects from './sections/VinylProjects';
import Contact from './sections/Contact';
import LoadingScreen from './components/LoadingScreen';
import ScrollToTop from './components/ScrollToTop';
import MusicConsentModal from './components/MusicConsentModal';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);

  // Global Smooth Scroll Handler
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.origin === window.location.origin) {
        e.preventDefault();
        const elementId = anchor.hash.substring(1);

        // EXTRA: If clicking experience, we also want to open the second-level modal
        if (elementId === 'experience') {
           setIsExpModalOpen(true);
        }

        const element = document.getElementById(elementId);
        
        if (element) {
          const offset = 80; // Navbar height offset
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  const handleMusicConfirm = () => {
      setShowMusicModal(false);
      window.dispatchEvent(new Event('enable-background-music'));
  };

  const handleMusicDecline = () => {
      setShowMusicModal(false);
  };

  return (
    <div className="bg-white min-h-screen text-black selection:bg-black selection:text-white relative">
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onComplete={() => {
              setIsLoading(false);
              // Show music modal immediately after loading
              setTimeout(() => setShowMusicModal(true), 500); 
          }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
          {showMusicModal && (
              <MusicConsentModal 
                  onConfirm={handleMusicConfirm}
                  onDecline={handleMusicDecline}
              />
          )}
      </AnimatePresence>

      {!isLoading && (
        <>
          <Navbar />
          <main className="relative w-full">
            {/* 
              Z-INDEX STRATEGY:
              Increasing z-index for each section ensures the next section
              always sits conceptually "on top" of the previous one as it enters the viewport,
              preventing click-blocking or visual clipping issues.
            */}
            
            <div id="hero" className="relative z-10">
              <Hero />
            </div>
            
            <div id="experience" className="relative z-20">
                <Profile forceOpenModal={isExpModalOpen} setForceOpenModal={setIsExpModalOpen} />
            </div>
            
            <div id="capabilities" className="relative z-30">
                <Skills />
            </div>
            
            {/* Projects follows immediately, higher z-index to interact properly */}
            <div id="projects" className="relative z-40">
                <VinylProjects />
            </div>
            
            {/* New Contact Section */}
            <div id="contact" className="relative z-50">
                <Contact />
            </div>
          </main>
          
          <ScrollToTop />

          <motion.footer 
            id="contact-footer" 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="relative z-[60] py-24 bg-white border-t border-gray-100 flex items-center justify-center overflow-hidden"
          >
             {/* 
                🟢 STATIC CHALK FIGURE (Footer Signature) 
                Matching the LoadingScreen style but static and centered
             */}
             <div 
                className="opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                style={{
                    // Consistent with your requested adjusted perspective (smaller angle)
                    transform: "rotateX(40deg) rotateZ(-10deg) scale(0.6)", 
                    transformStyle: "preserve-3d",
                    perspective: "800px"
                }}
             >
                <svg width="300" height="400" viewBox="0 0 240 360" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <defs>
                        <filter id="chalk-roughness-footer">
                            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                     </defs>

                     {/* Main Line - Static (pathLength 1) */}
                     <path
                        d="M120 20 C140 20 155 35 155 55 C155 70 145 80 135 85 L170 95 L220 50 L230 60 L180 110 L185 210 L230 340 L200 350 L120 270 L40 350 L10 340 L55 210 L60 110 L10 60 L20 50 L70 95 L105 85 C95 80 85 70 85 55 C85 35 100 20 120 20 Z"
                        stroke="#8B0000"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="transparent"
                        filter="url(#chalk-roughness-footer)"
                        opacity="0.8"
                    />
                    
                    {/* Texture Layer - Static */}
                    <path
                        d="M120 20 C140 20 155 35 155 55 C155 70 145 80 135 85 L170 95 L220 50 L230 60 L180 110 L185 210 L230 340 L200 350 L120 270 L40 350 L10 340 L55 210 L60 110 L10 60 L20 50 L70 95 L105 85 C95 80 85 70 85 55 C85 35 100 20 120 20 Z"
                        stroke="#8B0000"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="transparent"
                        opacity="0.4"
                        filter="url(#chalk-roughness-footer)"
                    />
                </svg>
             </div>
          </motion.footer>
        </>
      )}
    </div>
  );
};

export default App;
