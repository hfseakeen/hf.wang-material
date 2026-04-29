
import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

const ScrollToTop: React.FC = () => {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 500);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial="hidden"
          animate="idle"
          whileHover="hover"
          whileTap="tap"
          exit="hidden"
          variants={{
            hidden: { 
                opacity: 0, 
                scale: 0.5, 
                y: 20, 
                filter: "blur(10px)" 
            },
            idle: { 
                opacity: 0.9, // 🟢 UPDATED: Increased opacity for better visibility
                scale: 1, 
                y: 0, 
                filter: "blur(0px)", // 🟢 UPDATED: Removed blur to make it sharp
                transition: { duration: 0.5, ease: "easeInOut" }
            },
            hover: { 
                opacity: 1, 
                scale: 1.15, 
                y: 0, 
                filter: "blur(0px)", 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                transition: { duration: 0.3, ease: "easeOut" }
            },
            tap: { scale: 0.9, filter: "blur(0px)" }
          }}
          onClick={scrollToTop}
          // 🟢 UPDATED: Reduced backdrop-blur-2xl to backdrop-blur-md, and increased bg-white opacity
          className="fixed bottom-10 right-10 z-[100] w-16 h-16 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md border border-white/40 text-black/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] overflow-hidden cursor-pointer"
          style={{
              WebkitBackdropFilter: "blur(12px)" // 🟢 UPDATED: Reduced blur amount
          }}
        >
          {/* Inner Gloss/Shine Layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
          
          {/* Restored SVG Arrow Icon */}
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="relative z-10 text-black/90"
          >
            <path d="M18 15l-6-6-6 6"/>
          </svg>
          
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
