
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { motion, useTransform, useMotionValue, useSpring, useScroll, AnimatePresence } from 'framer-motion';
import Spotlight3D from '../components/Spotlight3D';
import PatternPlaceholder from '../components/PatternPlaceholder';
import Magnetic from '../components/Magnetic';

// ==========================================
// 🟢 CONFIGURATION: GLOBAL ZOOM & LAYOUT
// ==========================================

// 🟢 1. GLOBAL SCALE: Adjusts the zoom level of the entire section
const HERO_SCALE = 0.8; 

// 🟢 2. CARD SIZE: Base dimensions
const CARD_SIZE_CLASSES = "w-[150px] sm:w-[200px] md:w-[300px]"; 

// 🟢 3. SCATTERED LAYOUT CONFIGURATION (随机洒落布局)
// The goal is to look naturally messy, not geometric.
const CARD_LAYOUT_CONFIG = [
    // 1. 主视觉 (Main Focus) - Slightly Right, Top of the pile
    { left: '39%',  top: '77%', zIndex: 32 }, 
    
    // 2. 左侧大卡 (Left Major) - Overlapping Main, slightly lower
    { left: '19%',  top: '76%', zIndex: 35 }, 
    
    // 3. 右侧大卡 (Right Major) - Tucked behind Main
    { left: '72%',  top: '77%', zIndex: 30 }, 
    
    // 4. 中间下方 (Bottom Center) - Small, connecting piece
    { left: '58%',  top: '75%', zIndex: 25 }, 
    
    // 5. 左边边缘 (Left Edge) - Lower, wider angle
    { left: '8%',   top: '78%', zIndex: 37 }, 
    
    // 6. 右边边缘 (Right Edge) - Lower
    { left: '89%',  top: '72%', zIndex: 36 }, 
    
    // 7. 极左底部 (Bottom Left) - Deep background
    { left: '-7%',  top: '82%', zIndex: 36 }, 
    
    // 8. 极右底部 (Bottom Right) - Deep background
    { left: '79%',  top: '88%', zIndex: 10 }, 
];

// --- DATA: Defined with RANDOMIZED SCALES (大小错落) & ROTATIONS (随机旋转) ---
const heroCards = [
  { 
      id: 1, 
      color: '#FF7F27', 
      rotate: -2,      
      scale: 1.4,       
      img: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpjx/01-ajly.webp',
      videoUrl: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/movie/ajly.mp4'
  }, 
  { 
      id: 2, 
      color: '#00A2E8', 
      rotate: 8,        
      scale: 1.2,      
      img: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpjx/02-gisou.webp',
      videoUrl: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/movie/gisou.mp4'
  }, 
  { 
      id: 3, 
      color: '#55FFFF', 
      rotate: 24,       
      scale: 1.15,       
      img: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpjx/03-vichy.webp',
      videoUrl: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/movie/vichy.mp4'
  }, 
  {   id: 4, 
      color: '#E0221E', 
      rotate: 12,       
      scale: 1.1,      
      img: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpjx/04-divine%20water.webp',
      videoUrl: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/movie/divine%20water.mp4'
  }, 
  { 
      id: 5, 
      color: '#E0221E', 
      rotate: 2,      
      scale: 1.0,      
      img: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpjx/05-love%20me%20do.webp',
      videoUrl: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/movie/love%20me%20do.mp4'
  }, 
  { 
      id: 6, 
      color: '#0044BA', 
      rotate: 15,       
      scale: 0.9,       
      img: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpjx/06-olaplex.webp',
      videoUrl: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/movie/olaplex.mp4'
  },
  { 
      id: 7, 
      color: '#AA88EE', 
      rotate: -15,       
      scale: 0.95,      
      img: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpjx/07-youphoria.webp',
      videoUrl: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/movie/youphoria.mp4'
  },
  { 
      id: 8, 
      color: '#4ECDC4', 
      rotate: -15,      
      scale: 0.01,       
      img: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpjx/01-ajly.webp',
      videoUrl: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/movie/ajly.mp4'
  }
];

// --- DEPTH CONFIG ---
const DEPTHS = {
    FLOOR: -300,
    PROPS: -290,
    CARDS: -50,
    TEXT: 10, 
};

const ImageRevealHeroTitle: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const REVEAL_IMAGE = "https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/grxx/zjz.webp";

    return (
        <div 
            className="relative flex items-center justify-center cursor-pointer select-none group h-[1.2em] w-full"
            onMouseEnter={() => !isMobile && setIsHovered(true)}
            onMouseLeave={() => !isMobile && setIsHovered(false)}
            onClick={() => isMobile && setIsHovered(!isHovered)}
        >
            <motion.h1 
                className="font-albert-black text-[15vw] md:text-[8vw] leading-none tracking-tighter whitespace-nowrap transform -skew-x-6 origin-right z-20 relative"
                animate={{ 
                    x: isHovered ? (isMobile ? '-3vw' : '-1vw') : '0%',
                    color: isHovered ? '#D40411' : '#000000',
                }}
                transition={{ type: "spring", stiffness: 150, damping: 16 }}
            >
                HF.
            </motion.h1>

            <motion.div
                className="absolute z-10 pointer-events-none rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl"
                animate={{
                    width: isHovered ? (isMobile ? '24vw' : '12vw') : '0vw',
                    height: isHovered ? (isMobile ? '30vw' : '16vw') : '0vw',
                    x: '-50%',
                    y: '-50%',
                    scale: isHovered ? 1 : 0,
                    rotate: isHovered ? 6 : -15,
                    opacity: isHovered ? 1 : 0
                }}
                style={{
                    top: '50%',
                    left: '50%',
                }}
                transition={{ 
                    type: "spring", 
                    stiffness: 180, 
                    damping: 14,
                    delay: isHovered ? 0.05 : 0 
                }}
            >
                <img 
                    src={REVEAL_IMAGE} 
                    alt="Magic Reveal" 
                    className="w-full h-full object-cover"
                />
            </motion.div>

            <motion.h1 
                className="font-albert-black text-[15vw] md:text-[8vw] leading-none tracking-tighter whitespace-nowrap transform -skew-x-6 origin-left z-20 relative ml-[2vw]"
                animate={{ 
                    x: isHovered ? (isMobile ? '22vw' : '12vw') : '0%',
                    color: isHovered ? '#D40411' : '#000000',
                }}
                transition={{ type: "spring", stiffness: 150, damping: 16 }}
            >
                WANG
            </motion.h1>
        </div>
    );
};

const FloatingHeroCard: React.FC<{ card: any, index: number, hasEntered: boolean, onClick: () => void }> = ({ card, index, hasEntered, onClick }) => {
    const layout = CARD_LAYOUT_CONFIG[index] || { left: '50%', top: '50%', zIndex: 1 };
    const [isHovered, setIsHovered] = useState(false);

    // Random floating params
    const randomDuration = useMemo(() => 3 + Math.random() * 2, []);
    const randomOffset = useMemo(() => 5 + Math.random() * 5, []);
    const randomHoverRotate = useMemo(() => (Math.random() * 8 - 4), []); 

    return (
        <motion.div
            className={`absolute cursor-pointer ${CARD_SIZE_CLASSES} will-change-transform`}
            style={{
                top: layout.top,
                left: layout.left,
                aspectRatio: '1/1',
                zIndex: layout.zIndex, 
                transformStyle: "preserve-3d",
                z: DEPTHS.CARDS,
            }}
            // 🟢 UPDATED ENTRY: More random Y start to feel like a shuffle
            initial={{ opacity: 0, y: 1000 + Math.random() * 400, rotate: card.rotate + (Math.random() * 40 - 20) }}
            animate={hasEntered ? { opacity: 1, y: 0, rotate: card.rotate } : {}}
            transition={{ 
                duration: 1.5, 
                // Randomize delay slightly to break the "wave" pattern
                delay: 0.1 + (Math.random() * 0.4), 
                type: "spring", 
                stiffness: 45, 
                damping: 16,
                mass: 1.1
            }} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <motion.div
                animate={{
                    y: isHovered ? -60 : [0, -randomOffset, 0],
                    scale: isHovered ? (card.scale || 1) * 1.1 : (card.scale || 1),
                    rotate: isHovered ? card.rotate + randomHoverRotate : card.rotate, 
                }}
                transition={{
                    y: {
                        duration: isHovered ? 0.3 : randomDuration,
                        repeat: isHovered ? 0 : Infinity,
                        repeatType: "mirror", 
                        ease: "easeInOut"
                    },
                    scale: { 
                        type: "spring", 
                        stiffness: 200,
                        damping: 15
                    },
                    rotate: { 
                        type: "spring", 
                        stiffness: 150, 
                        damping: 20 
                    }
                }}
                className="w-full h-full relative origin-bottom"
            >
                <Magnetic strength={40}>
                    <Spotlight3D 
                        className="w-full h-full rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)]" 
                        color={card.color}
                        enableElasticScale={false} 
                        spotlightColor="rgba(255,255,255,0.5)"
                    >
                         <motion.div 
                            className="absolute inset-4 rounded-[2rem] blur-2xl opacity-0 transition-opacity duration-500 z-0"
                            animate={{ opacity: isHovered ? 0.6 : 0 }}
                            style={{ backgroundColor: card.color }}
                        />

                        <div className="w-full h-full relative p-3">
                            <div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-inner bg-white">
                                {card.img ? (
                                    <div className="w-full h-full relative group">
                                            <img 
                                            src={card.img} 
                                            alt={`Card ${card.id}`} 
                                            className="w-full h-full object-cover"
                                            decoding="async"
                                            />
                                            <motion.div 
                                                className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
                                                animate={{ opacity: isHovered ? 0.4 : 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{ backgroundColor: card.color }}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                    </div>
                                ) : (
                                    <PatternPlaceholder color={card.color} number={card.id} />
                                )}
                            </div>
                        </div>
                    </Spotlight3D>
                </Magnetic>
            </motion.div>
        </motion.div>
    );
};

const Hero: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasEntered, setHasEntered] = useState(false);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const floorY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
    
    // 🟢 NEW: Global Music & Navbar control Logic based on Modal State
    useEffect(() => {
        if (activeVideo) {
            window.dispatchEvent(new Event('pause-background-music'));
            window.dispatchEvent(new Event('hide-navbar'));
        } else {
            window.dispatchEvent(new Event('resume-background-music'));
            window.dispatchEvent(new Event('show-navbar'));
        }
    }, [activeVideo]);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 40, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 40, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const w = window.innerWidth;
        const h = window.innerHeight;
        x.set(clientX / w - 0.5);
        y.set(clientY / h - 0.5);
    };

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["30deg", "25deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
    const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-2%", "2%"]);

    return (
        <section 
            ref={containerRef}
            className="relative w-full bg-white overflow-hidden"
            onMouseMove={handleMouseMove}
            style={{ height: 'auto', minHeight: '100vh' }}
        >
            {/* --- MOBILE LAYOUT --- */}
            <div className="w-full h-screen bg-white flex flex-col items-center justify-center relative md:hidden py-12 px-6">
                <div className="text-center z-10 w-full mb-12 flex flex-col items-center mt-24">
                    <div className="w-full mb-6">
                        <ImageRevealHeroTitle />
                    </div>
                    <div className="flex flex-col items-center gap-2 mt-4">
                        <div className="font-albert-light text-xl text-gray-500 tracking-widest uppercase">王海锋</div>
                        <div className="w-10 h-[1px] bg-gray-300 my-1" />
                        <div className="font-albert-light text-sm text-gray-400 tracking-widest uppercase">资深摄影师 / 视觉设计师</div>
                    </div>
                </div>

                {/* Simplified Auto-Scrolling Carousels for Mobile */}
                <div className="w-full flex-1 flex flex-col gap-4 max-h-[50vh] overflow-hidden relative" style={{ perspective: '1000px' }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-20 pointer-events-none" />
                    
                    <motion.div 
                        className="flex gap-4 min-w-full"
                        animate={{ x: [0, -1000] }}
                        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                    >
                        {[...heroCards, ...heroCards].map((card, idx) => (
                            <div 
                                key={idx} 
                                className="w-[45vw] flex-shrink-0 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-gray-100 relative bg-gray-100 cursor-pointer"
                                onClick={() => setActiveVideo(card.videoUrl)}
                            >
                                <img src={card.img} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] pointer-events-none" />
                            </div>
                        ))}
                    </motion.div>
                    
                    <motion.div 
                        className="flex gap-4 min-w-full"
                        animate={{ x: [-1000, 0] }}
                        transition={{ duration: 25, ease: "linear", repeat: Infinity }}
                    >
                        {[...heroCards].reverse().concat([...heroCards].reverse()).map((card, idx) => (
                            <div 
                                key={idx} 
                                className="w-[45vw] flex-shrink-0 aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-gray-100 relative bg-gray-100 cursor-pointer"
                                onClick={() => setActiveVideo(card.videoUrl)}
                            >
                                <img src={card.img} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] pointer-events-none" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* --- DESKTOP LAYOUT --- */}
            <div className="hidden md:block w-full h-[140vh]">
                <motion.div 
                    className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center will-change-transform"
                    onViewportEnter={() => setHasEntered(true)}
                >
                    <div className="absolute inset-0 flex items-center justify-center perspective-2000">
                    <motion.div
                        className="relative w-full max-w-[1400px] will-change-transform transform-gpu"
                        style={{
                            scale: HERO_SCALE, 
                            rotateX,
                            rotateY,
                            x: translateX,
                            y: floorY,
                            aspectRatio: '16/9',
                            transformStyle: "preserve-3d",
                        }}
                    >
                        {/* Floor */}
                        <div className="absolute inset-[-50%] bg-white transform-preserve-3d" style={{ transform: `translateZ(${DEPTHS.FLOOR}px)` }} />
                        
                        {/* 1. Main Title - Moved UP slightly to 28% to balance the bottom card pile */}
                        <div className="absolute top-[20%] md:top-[28%] left-0 w-full text-center pointer-events-none" style={{ transform: `translateZ(${DEPTHS.TEXT}px) rotateX(-10deg)` }}>
                             <motion.div 
                                className="pointer-events-auto inline-block" 
                                initial={{ opacity: 0, y: 150 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                viewport={{ once: true }}
                             >
                                <ImageRevealHeroTitle />
                            </motion.div>

                            <motion.div 
                                className="mt-16 flex flex-col items-center gap-3"
                                initial={{ opacity: 0, y: 80 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                <div className="font-albert-light text-lg sm:text-2xl md:text-3xl text-gray-500 tracking-widest uppercase">王海锋</div>
                                <div className="w-8 md:w-12 h-[1px] bg-gray-300 my-1" />
                                <div className="font-albert-light text-sm sm:text-lg md:text-2xl text-gray-400 tracking-widest uppercase">资深摄影师 / 视觉设计师</div>
                            </motion.div>
                        </div>

                        {/* 2. Scattered Card Deck */}
                        {heroCards.map((card, idx) => (
                            <FloatingHeroCard 
                                key={card.id} 
                                card={card} 
                                index={idx} 
                                hasEntered={hasEntered} 
                                onClick={() => setActiveVideo(card.videoUrl)}
                            />
                        ))}

                    </motion.div>
                </div>
             </motion.div>
             </div>

             {/* Video Modal */}
             <AnimatePresence>
                 {activeVideo && (
                     <motion.div
                         className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         onClick={() => setActiveVideo(null)}
                     >
                         <motion.div
                             className="relative w-[90%] max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
                             initial={{ scale: 0.95, opacity: 0 }}
                             animate={{ scale: 1, opacity: 1 }}
                             exit={{ scale: 0.95, opacity: 0 }}
                             onClick={(e) => e.stopPropagation()}
                         >
                             <button 
                                 className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
                                 onClick={() => setActiveVideo(null)}
                             >
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                             </button>
                             <video 
                                 src={activeVideo} 
                                 className="w-full h-full object-contain"
                                 controls
                                 autoPlay
                             />
                         </motion.div>
                     </motion.div>
                 )}
             </AnimatePresence>
        </section>
    );
};

export default Hero;
