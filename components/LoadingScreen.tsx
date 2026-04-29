
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  // Timer logic for loading duration
  useEffect(() => {
    const duration = 2000; // 2 seconds animation time
    
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, duration + 500); // 2.5s total time before unmount

    return () => {
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  // Particle Generation (Keeping background atmosphere)
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 2 + 3,
  }));

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} 
    >
        {/* Background Particles */}
        <div className="absolute inset-0 pointer-events-none">
            {particles.map((p) => (
                <motion.div 
                    key={p.id}
                    className="absolute bg-gray-200 rounded-full opacity-50"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                    }}
                    animate={{
                        y: [0, -50, 0],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>

        {/* 🟢 CRIME SCENE BODY OUTLINE ANIMATION (The only foreground element) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ perspective: '800px' }}>
            <motion.div
                className="opacity-80"
                style={{
                    // ⬇️ Reduced rotation (40deg) for less extreme perspective
                    // ⬇️ Reduced scale (0.9) to make it smaller
                    transform: "rotateX(40deg) rotateZ(-10deg) translateY(0px) scale(0.9)",
                    transformStyle: "preserve-3d",
                }}
            >
                <svg width="300" height="400" viewBox="0 0 240 360" fill="none" xmlns="http://www.w3.org/2000/svg">
                     {/* ⬇️ Chalk Texture Filter Definition */}
                     <defs>
                        <filter id="chalk-roughness">
                            {/* Creates noise to roughen the edges */}
                            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                            {/* Displaces the line based on the noise */}
                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                     </defs>

                     {/* The Drawing Path: Traces a crude human figure outline */}
                     <motion.path
                        d="M120 20 C140 20 155 35 155 55 C155 70 145 80 135 85 L170 95 L220 50 L230 60 L180 110 L185 210 L230 340 L200 350 L120 270 L40 350 L10 340 L55 210 L60 110 L10 60 L20 50 L70 95 L105 85 C95 80 85 70 85 55 C85 35 100 20 120 20 Z"
                        stroke="#8B0000" // Dark Red
                        strokeWidth="3" // Slightly thinner to look more like a sketch
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="transparent"
                        filter="url(#chalk-roughness)" // ⬇️ Applying the chalk texture
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.8 }}
                        transition={{ 
                            duration: 2.2, // Syncs with loading duration
                            ease: "easeInOut",
                        }}
                    />
                    
                    {/* Optional: Second subtle layer for uneven chalk density */}
                    <motion.path
                        d="M120 20 C140 20 155 35 155 55 C155 70 145 80 135 85 L170 95 L220 50 L230 60 L180 110 L185 210 L230 340 L200 350 L120 270 L40 350 L10 340 L55 210 L60 110 L10 60 L20 50 L70 95 L105 85 C95 80 85 70 85 55 C85 35 100 20 120 20 Z"
                        stroke="#8B0000"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="transparent"
                        opacity="0.5"
                        filter="url(#chalk-roughness)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.4 }}
                        transition={{ 
                            duration: 2.2, 
                            ease: "easeInOut",
                            delay: 0.1 
                        }}
                    />
                </svg>
            </motion.div>
        </div>

        {/* REMOVED: Progress Bar, Counter, and Loading Text */}
    </motion.div>
  );
};

export default LoadingScreen;
