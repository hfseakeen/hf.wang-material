
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring, useScroll, useMotionTemplate, Variants } from 'framer-motion';
import { createPortal } from 'react-dom'; 
import Spotlight3D from '../components/Spotlight3D';

// 🔒 DATA IMPORTED FROM SEPARATE FILE TO PREVENT OVERWRITING
import {
    ASSETS,
    MY_CUSTOM_LONG_IMAGE,
    CUSTOM_FOX_RABBIT_CONFIG,
    WAVE_IMAGES_CONFIG,
    GROUP_1_CARDS_DATA,
    CUSTOM_NEW_IMAGES,
    TOOL_ICONS,
    PROJECTS_DATA
} from '../data/vinylProjectData';

// ==========================================
// 🟢 CONFIGURATION: GLOBAL ZOOM & LAYOUT
// ==========================================

// 🟢 LEFT SIDE PREVIEW CARD CONFIGURATION (FOR USER ADJUSTMENT)
const LEFT_SIDE_CONFIG: Record<number, { top: string, left: string }> = {};

// 🟢 PREVIEW CARD ICONS LAYOUT (SCATTERED SOFTWARE ICONS)
// 💡 您可以在这里控制大卡片里每个软件图标的布局。
// 🔒 LOCKED DATA: Do not change without user request.
const PREVIEW_ICONS_LAYOUT = [
    { left: '86%', top: '88%', rotate: 15,  width: 90 },  // 1. 右上角突破 (Top Right Break)
    { left: '74%',top: '102%',  rotate: -8,  width: 88 },  // 2. 极右侧突破 (Far Right Break)
    { left: '59%', top: '97%',  rotate: 12,  width: 85 },  // 3. 右下角 (Bottom Right)
    { left: '46%', top: '105%',  rotate: -5,  width: 81 },  // 4. 中右下方 (Mid Right Low)
    { left: '33%', top: '92%',   rotate: 8,   width: 79 },  // 5. 中右上方 (Mid Right Top)
];

// 🟢 TINT CONFIGURATION FOR PROJECTS 2-8
const PROJECT_TINTS: Record<number, { id: string; r: number; g: number; b: number }> = {
    2: { id: 'tint-p2', r: 1, g: 0.647, b: 0 },         // #FFA500 (Orange)
    3: { id: 'tint-p3', r: 0.302, g: 0.651, b: 1 },     // #4DA6FF
    4: { id: 'tint-p4', r: 0.918, g: 0.184, b: 0.184 }, // #EA2F2F
    5: { id: 'tint-p5', r: 0.878, g: 0.133, b: 0.118 }, // #E0221E
    6: { id: 'tint-p6', r: 0.667, g: 0.533, b: 0.933 }, // #AA88EE
    7: { id: 'tint-p7', r: 0.306, g: 0.804, b: 0.769 }, // #4ECDC4
    8: { id: 'tint-p8', r: 0.482, g: 0.773, b: 1 },     // #7BC5FF (Updated)
};

// 🔒 LOCKED DATA START --------------------------------------

// 🟢 1. PROJECT 1 HOVER IMAGES CONFIGURATION
const PROJECT_1_HOVER_CONFIG = [
    {
        id: 'p1-slide-1',
        // 🇨🇳 CHINA OPTIMIZATION: Replaced raw.githubusercontent with jsd.cdn.zzko.cn
        url: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/tml/tml-ip.webp',
        x: 50,      
        y: 20,     
        scale: 1.25,  
        rotate: 0,  
        zIndex: 4,   
        z: -74,      
        delay: 0.1   
    },
    {
        id: 'p1-slide-2',
        url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E4%B8%8A%E4%BE%A7.png',
        x: 950,      
        y: 80,       
        scale: 5,
        rotate: 2,
        zIndex: 4,   
        z: -75,      
        delay: 0.2
    },
    {
        id: 'p1-slide-3',
        url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E4%B8%8B%E4%BE%A7.png',
        x: 400,      
        y: 80,       
        scale: 3.5,
        rotate: 2,
        zIndex: 4,   
        z: -76,      
        delay: 0.2
    },
    {
        id: 'p1-slide-4',
        url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E5%B7%A6%E4%BE%A7.png',
        x: 860,      
        y: 80,       
        scale: 3.5,
        rotate: 2,
        zIndex: 4,   
        z: -75,      
        delay: 0.2
    },
    {
        id: 'p1-slide-5',
        url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E5%B7%A6%E4%BE%A7.png',
        x: 800,      
        y: 80,       
        scale: 3.5,
        rotate: 2,
        zIndex: 4,   
        z: -75,      
        delay: 0.2
    }
];

const PROJECT_2_HOVER_CONFIG = [
    {
        id: 'p2-top',
        url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E4%B8%8A%E4%BE%A7.png',
        x: 1300,      
        y: -350,   // Top
        scale: 3,
        rotate: 0,
        zIndex: 4, 
        z: -75,    
        delay: 0.1
    },
    {
        id: 'p2-bottom',
        url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E4%B8%8B%E4%BE%A7.png',
        x: 100,      
        y: 350,    // Bottom
        scale: 3,
        rotate: 0,
        zIndex: 4, 
        z: -75,
        delay: 0.1
    },
    {
        id: 'p2-left',
        url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E5%B7%A6%E4%BE%A7.png',
        x: -600,      
        y: 0,      // Left
        scale: 3,
        rotate: 0,
        zIndex: 4, 
        z: -75,
        delay: 0.2
    },
    {
        id: 'p2-right',
        url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E5%8F%B3%E4%BE%A7.png',
        x: 400,      
        y: 0,      // Right
        scale: 3,
        rotate: 0,
        zIndex: 4, 
        z: -75,
        delay: 0.2
    },
    {
        id: 'p2-char',
        // 🇨🇳 CHINA OPTIMIZATION
        url: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/roys/roys-ip.webp',
        x: -61,
        y: -300,      // Center
        scale: 0.8, // Large central figure
        rotate: 0,
        zIndex: 10, // Bring forward slightly
        z: -74,
        delay: 0.15,
        noTint: true 
    }
];

const PROJECT_3_HOVER_CONFIG = [
    { id: 'p3-1', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E4%B8%8A%E4%BE%A7.png', x: -450, y: -450, scale: 3.2, rotate: -20, zIndex: 4, z: -75, delay: 0.1 },  // Top Left High
    { id: 'p3-2', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E4%B8%8B%E4%BE%A7.png', x: 1250, y: 450, scale: 3.2, rotate: 20, zIndex: 4, z: -75, delay: 0.15 }, // Bottom Right Low
    { id: 'p3-3', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E5%B7%A6%E4%BE%A7.png', x: -50, y: 50, scale: 2.8, rotate: -10, zIndex: 4, z: -75, delay: 0.2 },   // Extreme Left
    { id: 'p3-4', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E5%8F%B3%E4%BE%A7.png', x: 950, y: -50, scale: 2.8, rotate: 10, zIndex: 4, z: -75, delay: 0.25 },   // Extreme Right
    { 
        id: 'p3-5', 
        // 🇨🇳 CHINA OPTIMIZATION
        url: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/ajly/ajly-ip.webp', 
        x: -364, 
        y: -50, 
        scale: 0.7, 
        rotate: -10, 
        zIndex: 4, 
        z: -74, 
        delay: 0.25, 
        noTint: true 
    },
];

const PROJECT_4_HOVER_CONFIG = [
    { id: 'p4-1', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E4%B8%8A%E4%BE%A7.png', x: 0, y: -500, scale: 3.5, rotate: 0, zIndex: 4, z: -75, delay: 0.1 },    // Top Center
    { id: 'p4-2', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E4%B8%8B%E4%BE%A7.png', x: 0, y: 500, scale: 3.5, rotate: 0, zIndex: 4, z: -75, delay: 0.1 },     // Bottom Center
    { id: 'p4-3', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E5%B7%A6%E4%BE%A7.png', x: -850, y: 100, scale: 4.0, rotate: -90, zIndex: 4, z: -75, delay: 0.2 },  // Extreme Left
    { id: 'p4-4', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E5%8F%B3%E4%BE%A7.png', x: 850, y: 100, scale: 4.0, rotate: 90, zIndex: 4, z: -75, delay: 0.2 },   // Extreme Right
    { 
        id: 'p4-5', 
        // 🇨🇳 CHINA OPTIMIZATION
        url: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/jd/jdjr-ip.webp', 
        x: 50, 
        y: -200, 
        scale: 1.0, 
        rotate: 0, 
        zIndex: 4, 
        z: -74, 
        delay: 0.25, 
        noTint: true 
    },
];

const PROJECT_5_HOVER_CONFIG = [
    { id: 'p5-1', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E4%B8%8A%E4%BE%A7.png', x: 950, y: 80, scale: 5, rotate: 2, zIndex: 2, z: -75, delay: 0.1 },
    { id: 'p5-2', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E4%B8%8B%E4%BE%A7.png', x: 1800, y: 80, scale: 3.5, rotate: 2, zIndex: 4, z: -75, delay: 0.15 },
    { id: 'p5-3', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E5%B7%A6%E4%BE%A7.png', x: 860, y: 80, scale: 3.5, rotate: 2, zIndex: 4, z: -75, delay: 0.2 },
    { id: 'p5-4', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E5%B7%A6%E4%BE%A7.png', x: 800, y: 80, scale: 3.5, rotate: 2, zIndex: 4, z: -75, delay: 0.25 },
    { 
        id: 'p5-5', 
        // 🇨🇳 CHINA OPTIMIZATION
        url: 'https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/zpj/farmacy/farmacy-ip.webp', 
        x: 0, 
        y: -450, 
        scale: 0.7, 
        rotate: 0, 
        zIndex: 4, 
        z: -76, 
        delay: 0.25, 
        noTint: true 
    },
];

const PROJECT_6_HOVER_CONFIG = [
    { id: 'p6-1', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E4%B8%8A%E4%BE%A7.png', x: 0, y: -380, scale: 3, rotate: 180, zIndex: 4, z: -75, delay: 0.1 },
    { id: 'p6-2', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E4%B8%8B%E4%BE%A7.png', x: 0, y: 380, scale: 3, rotate: 0, zIndex: 4, z: -75, delay: 0.1 },
    { id: 'p6-3', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E5%B7%A6%E4%BE%A7.png', x: -600, y: -100, scale: 2.8, rotate: -45, zIndex: 4, z: -75, delay: 0.2 },
    { id: 'p6-4', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E5%B7%A6%E4%BE%A7.png', x: 600, y: 100, scale: 2.8, rotate: 45, zIndex: 4, z: -75, delay: 0.2 },
];

const PROJECT_7_HOVER_CONFIG = [
    { id: 'p7-1', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E4%B8%8A%E4%BE%A7.png', x: 1200, y: -450, scale: 3.8, rotate: 20, zIndex: 4, z: -75, delay: 0.1 },   // Extreme Top Right
    { id: 'p7-2', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E4%B8%8B%E4%BE%A7.png', x: -400, y: 450, scale: 3.8, rotate: -20, zIndex: 4, z: -75, delay: 0.1 },  // Extreme Bottom Left
    { id: 'p7-3', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E5%B7%A6%E4%BE%A7.png', x: 50, y: 150, scale: 3.0, rotate: -10, zIndex: 4, z: -75, delay: 0.2 },   // Mid Left
    { id: 'p7-4', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E5%B7%A6%E4%BE%A7.png', x: 750, y: -150, scale: 3.0, rotate: 10, zIndex: 4, z: -75, delay: 0.2 },    // Mid Right
];

const PROJECT_8_HOVER_CONFIG = [
    { id: 'p8-1', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E4%B8%8A%E4%BE%A7.png', x: 0, y: -350, scale: 3.0, rotate: -30, zIndex: 4, z: -75, delay: 0.1 }, // Top Left
    { id: 'p8-2', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E4%B8%8B%E4%BE%A7.png', x: 1400, y: 350, scale: 3.0, rotate: -30, zIndex: 4, z: -75, delay: 0.1 },  // Bottom Right
    { id: 'p8-3', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E5%B7%A6%E4%BE%A7.png', x: 0, y: 350, scale: 3.0, rotate: 30, zIndex: 4, z: -75, delay: 0.2 },   // Bottom Left
    { id: 'p8-4', url: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/remain/%E5%B7%A6%E4%BE%A7.png', x: 1400, y: -350, scale: 3.0, rotate: 30, zIndex: 4, z: -75, delay: 0.2 },   // Top Right
];

// 🔒 LOCKED DATA END --------------------------------------

const HOVER_CONFIGS: Record<number, any[]> = {
    1: PROJECT_1_HOVER_CONFIG,
    2: PROJECT_2_HOVER_CONFIG,
    3: PROJECT_3_HOVER_CONFIG,
    4: PROJECT_4_HOVER_CONFIG,
    5: PROJECT_5_HOVER_CONFIG,
    6: PROJECT_6_HOVER_CONFIG,
    7: PROJECT_7_HOVER_CONFIG,
    8: PROJECT_8_HOVER_CONFIG,
};

// 🟢 2. GLOBAL SCALE: Adjusts the zoom level of the entire section
const PROJECTS_SCALE = 0.7;

// 🟢 3. CARD DIMENSIONS: Standard dimensions before scaling
const SQUARE_CARD_SIZE = '420px'; // 🟢 ENLARGED from 380px
const PREVIEW_CARD_WIDTH = '800px'; // 🟢 ENLARGED from 750px
const PREVIEW_CARD_HEIGHT = '300px'; // 🟢 ENLARGED from 280px

// 🟢 4. CARD POSITIONS (LOCKED AS REQUESTED)
const CARD_POSITIONS = [
    { left: '35%',    top: '65%',  rotate: -15, zIndex: 1, scale: 0.8 }, 
    { left: '52%',   top: '56%',  rotate: 8,   zIndex: 2, scale: 0.81 }, 
    { left: '68%',   top: '62%',  rotate: -8,  zIndex: 3, scale: 0.78 }, 
    { left: '84%',  top: '59%',  rotate: 12,  zIndex: 4, scale: 0.808 }, 
    { left: '104%',  top: '56%',  rotate: -5,  zIndex: 5, scale: 0.8 }, 
    { left: '120%',  top: '63%',  rotate: 15,  zIndex: 6, scale: 0.83 }, 
    { left: '138%',  top: '61%',  rotate: -10, zIndex: 7, scale: 0.77 }, 
    { left: '152%',  top: '58%',  rotate: 6,   zIndex: 8, scale: 0.81 },
];

// --- DEPTH CONFIGURATION ---
const DEPTHS = {
    FLOOR: -300,
    PROJECTS: -50, // Cards are here
};

// --- COMPONENTS ---

// 🟢 NEW: DEFINITIONS FOR MISSING COMPONENTS
const FloorMarquee: React.FC<{ direction: 'left' | 'right', text: string, className?: string, rotate?: number, style?: React.CSSProperties }> = React.memo(({ direction, text, className, rotate = 0, style }) => {
    return (
        <div 
            className="absolute left-[-20%] w-[140%] pointer-events-auto overflow-visible flex will-change-transform"
            style={{ 
                transform: `translateZ(-100px) rotate(${rotate}deg)`, 
                zIndex: 0,
                ...style,
            }}
        >
            <motion.div
                className={`flex whitespace-nowrap ${className}`}
                initial={{ x: direction === 'left' ? '0%' : '-50%' }}
                animate={{ x: direction === 'left' ? '-50%' : '0%' }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
                {[...Array(6)].map((_, i) => (
                    <span key={i} className="mx-4 transition-colors duration-300">
                        {text} <span className="mx-4 opacity-30">•</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
});

const HoverCard: React.FC<{
    img: string;
    style?: React.CSSProperties;
    borderRadius?: string;
    baseRotate?: number;
    popOnHover?: boolean;
}> = ({ img, style, borderRadius = '0px', baseRotate = 0, popOnHover = true }) => {
    return (
        <motion.div
            style={style}
            initial={{ rotate: baseRotate }}
            whileHover={popOnHover ? { scale: 1.05, rotate: 0, zIndex: 100 } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="origin-center"
        >
            <img 
                src={img} 
                alt="Decoration" 
                style={{ 
                    borderRadius: borderRadius, 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }} 
            />
        </motion.div>
    );
};

const ScrollImageSequence: React.FC<{ config: any, scrollContainerRef: React.RefObject<HTMLDivElement> }> = ({ config, scrollContainerRef }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const imgs: HTMLImageElement[] = [];
        let count = 0;
        for (let i = 0; i < config.frameCount; i++) {
            const img = new Image();
            const idx = config.startIndex + i;
            const idxStr = String(idx).padStart(config.digits, '0');
            img.src = `${config.baseUrl}${idxStr}${config.suffix}`;
            img.onload = () => {
                count++;
                if (count === config.frameCount) setLoaded(true);
            };
            imgs.push(img);
        }
        imagesRef.current = imgs;
    }, [config]);

    useEffect(() => {
        if (!loaded) return;
        
        const render = () => {
             if (!containerRef.current || !canvasRef.current || !scrollContainerRef.current) return;
             
             const containerRect = containerRef.current.getBoundingClientRect();
             const viewportHeight = window.innerHeight;
             
             let progress = (viewportHeight - containerRect.top) / (viewportHeight + containerRect.height);
             
             if (progress < 0) progress = 0;
             if (progress > 1) progress = 1;
             
             const frameIndex = Math.min(
                 config.frameCount - 1,
                 Math.floor(progress * config.frameCount)
             );
             
             const img = imagesRef.current[frameIndex];
             const ctx = canvasRef.current.getContext('2d');
             
             if (ctx && img) {
                 const canvas = canvasRef.current;
                 ctx.clearRect(0, 0, canvas.width, canvas.height);
                 
                 const imgRatio = img.width / img.height;
                 const canvasRatio = canvas.width / canvas.height;
                 
                 let renderW, renderH, offsetX, offsetY;
                 
                 if (imgRatio > canvasRatio) {
                     renderH = canvas.height;
                     renderW = renderH * imgRatio;
                     offsetX = (canvas.width - renderW) / 2;
                     offsetY = 0;
                 } else {
                     renderW = canvas.width;
                     renderH = renderW / imgRatio;
                     offsetX = 0;
                     offsetY = (canvas.height - renderH) / 2;
                 }
                 
                 ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
             }
             
             requestAnimationFrame(render);
        };
        
        const rafId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(rafId);
    }, [loaded, scrollContainerRef, config]);

    return (
        <div ref={containerRef} style={{ height: '400vh', position: 'relative' }}>
             <div className="sticky top-0 h-screen w-full flex items-center justify-center bg-black">
                 <canvas ref={canvasRef} width={1920} height={1080} className="w-full h-full object-contain" />
             </div>
        </div>
    );
};

// 🟢 NEW: Component for Project 2 Video Interaction (Flip to Play) - Now with Fullscreen support
const Project2FlipVideo: React.FC<{ config: any }> = ({ config }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
    const justHiddenRef = useRef(false);

    const handleFlip = (e: React.MouseEvent) => {
        if (justHiddenRef.current) return;
        e.stopPropagation();
        if (isHidden) return;
        setIsFlipped(true);
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFlipped(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            window.dispatchEvent(new Event('resume-background-music'));
            window.dispatchEvent(new Event('show-navbar'));
        }
    };

    const handleHide = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        justHiddenRef.current = true;
        setIsHidden(true);
        setTimeout(() => {
            justHiddenRef.current = false;
        }, 500);
    };

    const openFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFullscreen(true);
        window.dispatchEvent(new Event('pause-background-music'));
        window.dispatchEvent(new Event('hide-navbar'));
    };

    const closeFullscreen = (e?: any) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setIsFullscreen(false);
        window.dispatchEvent(new Event('resume-background-music'));
        window.dispatchEvent(new Event('show-navbar'));
    };

    useEffect(() => {
        if (isFlipped && videoRef.current) {
             window.dispatchEvent(new Event('pause-background-music'));
             window.dispatchEvent(new Event('hide-navbar'));
             videoRef.current.play().catch(err => console.log('Auto play video failed', err));
        }
    }, [isFlipped]);

    return (
        <>
            <div className="absolute top-0 left-0 w-full h-full flex justify-center pointer-events-none z-[60]">
                <motion.div
                    className="relative pointer-events-auto group"
                    initial={{ y: 400 }} 
                    animate={{ 
                        width: isFlipped ? 960 : (isHidden ? 50 : 320),
                        height: isFlipped ? 540 : (isHidden ? 50 : 320),
                        rotateY: isFlipped ? 180 : 0,
                        y: isFlipped ? 140 : (isHidden ? 80 : 380),
                        x: isFlipped ? 0 : (isHidden ? -440 : 0),
                        opacity: isHidden ? 0.6 : 1
                    }}
                    transition={{ type: "spring", stiffness: 60, damping: 14 }}
                    style={{ transformStyle: "preserve-3d" }}
                    onMouseEnter={() => {
                        if (isHidden && !justHiddenRef.current) setIsHidden(false);
                    }}
                >
                    {/* 1. FRONT FACE (Play Button) */}
                    <div 
                        className="absolute inset-0 backface-hidden bg-black"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div 
                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                            onClick={handleFlip}
                        >
                            <motion.div 
                                whileHover={{ scale: 1.1 }}
                                className="w-full h-full rounded-full bg-white/20 backdrop-blur-xl border border-white/50 flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
                            >
                                <div className={`rounded-full bg-white text-[#D40411] flex items-center justify-center shadow-inner transition-all duration-300 ${isHidden ? 'w-8 h-8' : 'w-24 h-24 group-hover:scale-110'}`}>
                                    <svg width={isHidden ? "14" : "32"} height={isHidden ? "14" : "32"} viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                </div>
                                {!isHidden && (
                                    <div className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-20" />
                                )}
                            </motion.div>
                        </div>

                        {!isFlipped && !isHidden && (
                            <div 
                                className="absolute -top-3 -right-3 w-10 h-10 z-[100] flex items-center justify-center cursor-pointer pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                onClick={handleHide}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <motion.div
                                    className="w-8 h-8 bg-white text-gray-500 hover:bg-gray-200 border border-gray-200 rounded-full flex items-center justify-center shadow-md"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </motion.div>
                            </div>
                        )}
                    </div>

                    {/* 2. BACK FACE (Video Player) */}
                    <div 
                        className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/20"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                            </div>
                        )}

                        <video 
                            ref={videoRef}
                            src={config.videoUrl}
                            className="w-full h-full object-cover"
                            controls
                            preload="metadata"
                            onWaiting={() => setIsLoading(true)}
                            onCanPlay={() => setIsLoading(false)}
                            onEnded={() => {
                                window.dispatchEvent(new Event('resume-background-music'));
                            }}
                            onClick={openFullscreen}
                        />
                        
                        {/* Fullscreen Hint Button */}
                        <button 
                            onClick={openFullscreen}
                            className="absolute top-4 left-4 w-10 h-10 bg-black/50 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors border border-white/10 z-20 shadow-lg"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <polyline points="9 21 3 21 3 15"></polyline>
                                <line x1="21" y1="3" x2="14" y2="10"></line>
                                <line x1="3" y1="21" x2="10" y2="14"></line>
                            </svg>
                        </button>

                        {/* Close Video Button */}
                        <button 
                            onClick={handleClose}
                            className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-[#D40411] text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors border border-white/10 z-20 shadow-lg"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* 🟢 FULLSCREEN PORTAL */}
            {isFullscreen && createPortal(
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <video 
                        ref={fullscreenVideoRef}
                        src={config.videoUrl}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay
                        onEnded={closeFullscreen}
                    />
                    <button 
                        onClick={closeFullscreen}
                        className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 transition-all z-[10000]"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </motion.div>,
                document.body
            )}
        </>
    );
};

// 🟢 NEW: Clickable Video Player for absolute positioning - Now with Fullscreen support
const AbsoluteClickableVideo: React.FC<{ url: string, scale?: number, style?: React.CSSProperties }> = ({ url, scale = 1, style }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const openFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFullscreen(true);
        window.dispatchEvent(new Event('pause-background-music'));
        window.dispatchEvent(new Event('hide-navbar'));
    };

    const closeFullscreen = (e?: any) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setIsFullscreen(false);
        setIsPlaying(false);
        // Resume background music only if we aren't in another video context
        window.dispatchEvent(new Event('resume-background-music'));
        window.dispatchEvent(new Event('show-navbar'));
    };

    // Auto play when fullscreen
    useEffect(() => {
        if (isFullscreen && fullscreenVideoRef.current) {
            fullscreenVideoRef.current.play().catch(e => console.error("Fullscreen play failed", e));
            setIsPlaying(true);
        }
    }, [isFullscreen]);

    return (
        <div 
            className="absolute left-0 right-0 mx-auto cursor-pointer group"
            style={{ 
                width: '800px', // Default width
                ...style, // Allow override
                transformOrigin: 'top center',
                transform: `scale(${scale})`
            }}
            onClick={openFullscreen}
        >
            <div className="relative w-full aspect-square overflow-hidden bg-black">
                {/* 🟢 LOADING SPINNER */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                )}
                
                <video 
                    ref={videoRef}
                    src={url}
                    className="w-full h-full object-cover block"
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    onWaiting={() => setIsLoading(true)}
                    onCanPlay={() => setIsLoading(false)}
                />
                
                {/* Play Overlay */}
                {!isLoading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm group-hover:bg-black/20 transition-all duration-300">
                        <div className="w-20 h-20 rounded-full bg-white/20 border border-white/50 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                             <svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="none">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {/* 🟢 FULLSCREEN OVERLAY PORTAL */}
            {isFullscreen && createPortal(
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <video 
                        ref={fullscreenVideoRef}
                        src={url}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay
                        onEnded={closeFullscreen}
                    />
                    
                    {/* EXIT BUTTON */}
                    <button 
                        onClick={closeFullscreen}
                        className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 transition-all z-[10000]"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </motion.div>,
                document.body
            )}
        </div>
    );
};

// 🟢 NEW: Flip Card Component for Project 6 (Updated with Dynamic Size, Spotlight Border & Fullscreen support)
const FlipVideoCard: React.FC<{ 
    item: any; 
    index: number; 
    color: string;
    activeVideoIndex: number | null; 
    setActiveVideoIndex: (idx: number) => void; 
}> = ({ item, index, color, activeVideoIndex, setActiveVideoIndex }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    
    // Mouse tracking for spotlight border
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const handleFlip = () => {
        const nextState = !isFlipped;
        setIsFlipped(nextState);
        
        // 🟢 Resume music explicitly when closing
        if (nextState === false) {
            window.dispatchEvent(new Event('resume-background-music'));
            window.dispatchEvent(new Event('show-navbar'));
        }
    };

    const openFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFullscreen(true);
        window.dispatchEvent(new Event('pause-background-music'));
        window.dispatchEvent(new Event('hide-navbar'));
    };

    const closeFullscreen = (e?: any) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setIsFullscreen(false);
        window.dispatchEvent(new Event('resume-background-music'));
        window.dispatchEvent(new Event('show-navbar'));
    };

    // Auto-play video when flipped
    useEffect(() => {
        if (isFlipped && videoRef.current) {
            // 🟢 1. Trigger Global Music Pause
            window.dispatchEvent(new Event('pause-background-music'));
            window.dispatchEvent(new Event('hide-navbar'));

            // 🟢 2. Set THIS card as the active audio source
            setActiveVideoIndex(index);

            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(e => console.log("Video play failed", e));
        } else if (!isFlipped && videoRef.current) {
            videoRef.current.pause();
        }
    }, [isFlipped]);

    // 🟢 3. Audio Exclusion Logic: Only the active index gets sound, others are muted
    useEffect(() => {
        if (videoRef.current) {
            // If I am the active index, unmute. Else, mute.
            videoRef.current.muted = activeVideoIndex !== index;
        }
    }, [activeVideoIndex, index]);

    // 🟢 DYNAMIC SIZING LOGIC
    const currentWidth = isFlipped ? (item.flippedWidth || item.width || 320) : (item.width || 320);
    const currentHeight = isFlipped ? (item.flippedHeight || item.height || 569) : (item.height || 569);

    return (
        <>
            <motion.div 
                ref={cardRef}
                className="relative shrink-0 perspective-1000 cursor-pointer group"
                style={{ 
                    marginTop: item.y ? `${item.y}px` : '0px',
                    marginLeft: item.x ? `${item.x}px` : '0px', 
                    transform: `scale(${item.scale || 1})`
                }}
                animate={{ width: currentWidth, height: currentHeight }}
                transition={{ type: "spring", stiffness: 60, damping: 12 }}
                onMouseMove={handleMouseMove}
                onClick={handleFlip}
            >
                {/* ... Intro text config ... */}
                {item.introConfig && (
                    <div 
                        className="absolute pointer-events-none z-0 hidden md:block" 
                        style={{
                            left: `${item.introConfig.x}px`,
                            top: `${item.introConfig.y}px`,
                            width: item.introConfig.width || '200px',
                            transform: `rotate(${item.introConfig.rotate || 0}deg)`,
                            textAlign: (item.introConfig.align as any) || 'right'
                        }}
                    >
                        <p 
                            className="font-albert-light text-white/70 whitespace-pre-line leading-relaxed"
                            style={{ fontSize: item.introConfig.fontSize || '14px' }}
                        >
                            {item.introConfig.text}
                        </p>
                    </div>
                )}

                <motion.div
                    className="w-full h-full relative"
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 12 }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* --- FRONT: IMAGE --- */}
                    <div 
                        className="absolute inset-0 backface-hidden overflow-hidden bg-white"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        {/* 🟢 SPOTLIGHT BORDER EFFECT */}
                        <motion.div
                            className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                                padding: '1px',
                                background: color,
                                maskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                                WebkitMaskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                            }}
                        >
                            <div className="w-full h-full bg-black" />
                        </motion.div>

                        <div className="absolute inset-0 overflow-hidden z-10 bg-white">
                            <img src={item.img} alt={item.title} className="w-full h-full object-cover relative" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="none">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none">
                            <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
                                点击播放
                            </span>
                        </div>
                    </div>

                    {/* --- BACK: VIDEO --- */}
                    <div 
                        className="absolute inset-0 backface-hidden overflow-hidden bg-black shadow-none border-none"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                            </div>
                        )}

                        <video 
                            ref={videoRef}
                            src={item.video} 
                            className="w-full h-full object-cover"
                            loop={false}
                            playsInline
                            preload="metadata"
                            onWaiting={() => setIsLoading(true)}
                            onCanPlay={() => setIsLoading(false)}
                            onEnded={() => {
                                window.dispatchEvent(new Event('resume-background-music'));
                            }}
                            onClick={openFullscreen}
                        />

                        {/* Fullscreen Hint Button */}
                        <div 
                            className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md p-2 rounded-lg text-white transition-all scale-75 group-hover:scale-100"
                            onClick={openFullscreen}
                        >
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <polyline points="9 21 3 21 3 15"></polyline>
                                <line x1="21" y1="3" x2="14" y2="10"></line>
                                <line x1="3" y1="21" x2="10" y2="14"></line>
                            </svg>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* 🟢 FULLSCREEN PORTAL */}
            {isFullscreen && createPortal(
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <video 
                        ref={fullscreenVideoRef}
                        src={item.video}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay
                        onEnded={closeFullscreen}
                    />
                    <button 
                        onClick={closeFullscreen}
                        className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 transition-all z-[10000]"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </motion.div>,
                document.body
            )}
        </>
    );
};

const HorizontalScrollGallery: React.FC<{ items: any[]; color: string }> = ({ items, color }) => {
    // 🟢 Needs to manage active video index
    const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // 🟢 Enable Horizontal Scroll via Mouse Wheel with INCREASED SPEED
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            if (e.deltaY === 0) return;
            // If scrolling vertically, translate to horizontal scroll
            e.preventDefault();
            
            // 🟢 INCREASED SCROLL SPEED MULTIPLIER
            const SCROLL_SPEED_MULTIPLIER = 1.5; 
            el.scrollLeft += e.deltaY * SCROLL_SPEED_MULTIPLIER;
        };

        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, []);

    return (
        <div className="relative w-full h-full bg-black overflow-hidden flex flex-col justify-center">
            
            {/* 🟢 SCROLLABLE AREA - EVERYTHING IS NOW IN FLOW */}
            <div 
                ref={scrollRef}
                className="w-full h-full overflow-x-auto overflow-y-hidden whitespace-nowrap flex items-center floating-scrollbar"
                style={{ scrollBehavior: 'auto' }} // Changed to 'auto' for direct wheel control
            >
                {/* 1. Large Left Spacer (Padding) */}
                {/* 🟢 Ensures big black space on the left */}
                <div className="w-[15vw] shrink-0 inline-block h-full" /> 

                {/* 2. Title Section (Now flows with scroll) */}
                {/* 🟢 INCREASED MARGIN RIGHT TO PUSH CARDS FURTHER AWAY */}
                <div className="inline-block align-middle mr-[25vw] shrink-0">
                     <div className="flex flex-col justify-center px-4">
                        <h2 className="text-5xl md:text-7xl font-hanchanyuanyuan text-white leading-none mb-6 tracking-tight">
                            视频中心
                        </h2>
                        {/* Decorative Line */}
                        <div className="w-12 h-1 mb-6" style={{ backgroundColor: color }} /> 
                        <p className="text-gray-400 text-sm font-opposans leading-relaxed max-w-xs whitespace-normal">
                            滚动探索系列作品。点击卡片播放视频。
                        </p>
                     </div>
                </div>

                {/* 3. Cards */}
                {items.map((item, index) => (
                    <div 
                        key={item.id} 
                        // 🟢 INCREASED MARGIN: mr-48 -> mr-80 (Significant increase)
                        className="inline-block align-middle mr-80 last:mr-40 pt-20 pb-20"
                    >
                        <FlipVideoCard 
                            item={item} 
                            index={index} 
                            color={color}
                            activeVideoIndex={activeVideoIndex}
                            setActiveVideoIndex={setActiveVideoIndex}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// 🟢 UPDATED PREVIEW CARD: Handles both LEFT and RIGHT positioning
const ProjectPreviewCard: React.FC<{
    project: any;
    side: 'left' | 'right';
    handleProjectEnter: () => void;
    handleProjectLeave: () => void;
    setSelectedProject: (p: any) => void;
}> = ({ project, side, handleProjectEnter, handleProjectLeave, setSelectedProject }) => {
    // Determine custom styles if present
    // 🟢 CHECK FOR LEFT SIDE CONFIG OVERRIDE
    const leftSideOverride = LEFT_SIDE_CONFIG[project.id];
    const customConfig = project.previewConfig || {};
    
    // Check side
    const isLeft = side === 'left';

    // 🟢 COLOR CONFIGURATION
    const textColors = project.previewTextColor || {
        year: '#000000',
        yearBg: 'rgba(0,0,0,0.05)',
        yearBorder: 'rgba(0,0,0,0.1)',
        label: '#999999',
        title: '#000000',
        description: '#444444',
        tools: '#000000',
        toolBg: 'rgba(0,0,0,0.05)',
        toolBorder: 'rgba(0,0,0,0.1)',
        arrow: '#000000',
        arrowBorder: 'rgba(0,0,0,0.2)',
        cardBorder: 'rgba(0,0,0,0.1)' // Default border for light mode
    };

    return (
        <motion.div
            className="absolute z-50 pointer-events-auto"
            style={{
                width: customConfig.width || PREVIEW_CARD_WIDTH,
                height: customConfig.height || PREVIEW_CARD_HEIGHT,
                
                // 🟢 USE CONFIG OVERRIDE IF AVAILABLE, ELSE DEFAULT TO TOP
                top: (isLeft && leftSideOverride) ? leftSideOverride.top : (customConfig.top || '15%'),
                
                // 🟢 CONDITIONAL POSITIONING
                left: (isLeft && leftSideOverride) ? leftSideOverride.left : (isLeft ? (customConfig.left || '5%') : 'auto'),
                right: !isLeft ? (customConfig.right || '5%') : 'auto',
                
                transformStyle: "preserve-3d",
                transform: `rotate(${customConfig.rotate || 0}deg) translateZ(100px)`, // Bring forward
            }}
            // 🟢 CONDITIONAL ENTRY ANIMATION (Left enters from -100, Right enters from 200)
            initial={{ opacity: 0, x: isLeft ? -100 : 200 }} 
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLeft ? -100 : 200 }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            onMouseEnter={handleProjectEnter}
            onMouseLeave={handleProjectLeave}
            onClick={() => setSelectedProject(project)}
        >
             {/* 
                🟢 UPDATED: TRANSPARENT CARD (No Fog)
                Removed: bg-white/40, backdrop-blur-2xl
                Added: bg-white/5 (barely visible tint) or transparent. 
                Using dynamic border color.
             */}
             <div 
                className="absolute inset-0 rounded-[3rem] shadow-2xl overflow-hidden transform-gpu"
                style={{
                    backgroundColor: 'rgba(255,255,255,0.01)', // Very subtle tint
                    borderColor: textColors.cardBorder,
                    borderWidth: '1px',
                    borderStyle: 'solid'
                }}
             >
                {/* Background Image - Reduced opacity further to keep it subtle on transparent bg */}
                {/* 🟢 CHECK FOR PREVIEW BG IMG OVERRIDE (e.g. Project 1) */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <img 
                        src={project.previewBgImg || project.img} 
                        className="w-full h-full object-cover grayscale" 
                        alt="Background"
                    />
                </div>
                
                {/* 
                    🟢 MOVED: SOFTWARE ICONS ARE NOW OUTSIDE THIS CLIP CONTAINER 
                    See below for the new position.
                */}

                {/* Custom Content Layout */}
                {project.previewContentConfig ? (
                    <div className="relative w-full h-full p-10">
                         {/* Dynamic Text Elements */}
                         {Object.entries(project.previewContentConfig).map(([key, cfg]: [string, any]) => {
                             let content = project[key === 'description' ? 'desc' : key];
                             if(!content) return null;
                             
                             return (
                                 <div 
                                    key={key}
                                    className="absolute"
                                    style={{
                                        left: cfg.x,
                                        top: cfg.y,
                                        width: cfg.width || 'auto',
                                        transform: `rotate(${cfg.rotate}deg)`,
                                        color: cfg.color, // Keeps existing custom colors
                                        fontSize: cfg.fontSize,
                                        lineHeight: cfg.lineHeight || 1.2,
                                        fontFamily: key === 'title' ? '"Albert Sans", sans-serif' : 'inherit',
                                        fontWeight: key === 'title' ? 900 : 400
                                    }}
                                 >
                                     {content}
                                 </div>
                             )
                         })}
                    </div>
                ) : (
                    /* Default Layout - NOW USING DYNAMIC COLORS */
                    <div className="relative w-full h-full p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-4">
                            <span 
                                className="px-3 py-1 rounded-full text-xs font-bold tracking-widest border"
                                style={{
                                    color: textColors.year,
                                    backgroundColor: textColors.yearBg,
                                    borderColor: textColors.yearBorder
                                }}
                            >
                                {project.year}
                            </span>
                            <span 
                                className="text-xs font-bold tracking-widest uppercase"
                                style={{ color: textColors.label }}
                            >
                                {project.label}
                            </span>
                        </div>
                        <h2 
                            className="text-5xl font-albert-black mb-4 leading-tight"
                            style={{ color: textColors.title }}
                        >
                            {project.title}
                        </h2>
                        <p 
                            className="text-lg line-clamp-3 w-2/3"
                            style={{ color: textColors.description }}
                        >
                            {project.desc}
                        </p>
                        
                        {/* 🟢 Removed generic dot list since we now have the big scattered glass icons */}
                    </div>
                )}
                
                {/* Click Hint */}
                <div className="absolute bottom-8 right-8 flex items-center gap-2">
                    <span 
                        className="text-xs font-bold tracking-widest"
                        style={{ color: textColors.arrow }}
                    >
                        查看作品
                    </span>
                    <div 
                        className="w-8 h-8 rounded-full border flex items-center justify-center"
                        style={{
                            borderColor: textColors.arrowBorder,
                            color: textColors.arrow
                        }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </div>
                </div>
             </div>

             {/* 
                🟢 NEW LOCATION: SCATTERED ICONS (UNCLIPPED)
                Moved here to be outside the overflow-hidden container but inside the motion card wrapper.
                Now supports negative positioning to break boundaries.
             */}
             {project.tools && project.tools.length > 0 && (
                <div className="absolute inset-0 pointer-events-none z-[60]" style={{ overflow: 'visible' }}>
                    {/* 🟢 LIMIT TO 5 ITEMS (slice 0,5) */}
                    {project.tools.slice(0, 5).map((toolName: string, idx: number) => {
                            // Lookup icon URL from the global map
                            const url = TOOL_ICONS[toolName];
                            if (!url) return null; // Skip if no matching icon

                            const layout = PREVIEW_ICONS_LAYOUT[idx % PREVIEW_ICONS_LAYOUT.length];
                            
                            // 🟢 Deterministic Randomness for "Throw" Effect
                            // We use idx to generate "random" looking but consistent start positions
                            const randomSeed = (idx + 1) * 111;
                            const startX = (randomSeed % 200) - 100; // -100 to 100
                            const startY = 150 + (randomSeed % 100); // 150 to 250 (Below)
                            const startRotate = layout.rotate + 60 + (randomSeed % 60); // Add 60-120deg extra rotation
                            const exitRotate = layout.rotate - 60 - (randomSeed % 60);  // Subtract 60-120deg on exit

                            return (
                                <motion.div
                                    key={`${project.id}-${toolName}-${idx}`} // Unique key to trigger animation on project change
                                    className="absolute flex items-center justify-center pointer-events-auto"
                                    style={{
                                        left: layout.left,
                                        top: layout.top,
                                        width: `${layout.width}px`, 
                                        height: `${layout.width}px`, // Square Aspect Ratio
                                        // We animate rotation via motion props, so removed static rotate here
                                    }}
                                    // 🟢 THROW IN ANIMATION
                                    initial={{ 
                                        opacity: 0, 
                                        scale: 0.2, 
                                        x: startX, 
                                        y: startY, 
                                        rotate: startRotate 
                                    }}
                                    animate={{ 
                                        opacity: 1, 
                                        scale: 1, 
                                        x: 0, 
                                        y: 0, 
                                        rotate: layout.rotate 
                                    }}
                                    // 🟢 THROW OUT / SPIN AWAY ANIMATION
                                    exit={{ 
                                        opacity: 0, 
                                        scale: 0.2, 
                                        x: startX * 0.5, // Move slightly back towards start direction
                                        y: startY * 0.5, // Fall down
                                        rotate: exitRotate,
                                        transition: { duration: 0.4, ease: "backIn" }
                                    }}
                                    transition={{ 
                                        delay: 0.3 + idx * 0.08, // Staggered entry
                                        type: 'spring', 
                                        stiffness: 180, // Snappy throw
                                        damping: 16 
                                    }}
                                >
                                {/* 🟢 OPTIMIZED: GLASS SQUIRCLE CARD STYLE (Clear Acrylic - No Blur) */}
                                {/* Removed backdrop-blur-xl, replaced bg-white/40 with gradient opacity */}
                                <div className="w-full h-full rounded-[1.2rem] bg-gradient-to-br from-white/40 to-white/10 border border-white/60 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.2)] flex items-center justify-center p-3 relative overflow-hidden group hover:scale-110 transition-transform duration-300">
                                    
                                    {/* Subtle Shine */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />
                                    
                                    {/* Icon Image */}
                                    <img 
                                        src={url} 
                                        alt={toolName} 
                                        className="w-full h-full object-contain drop-shadow-sm relative z-10" 
                                    />
                                </div>
                                </motion.div>
                            );
                    })}
                </div>
            )}

        </motion.div>
    );
};

const ProjectImageSquare: React.FC<{
    project: any;
    style: any;
    onClick: () => void;
    onHoverStart: () => void;
    onHoverEnd: () => void;
    isHovered: boolean;
    isAnyHovered: boolean;
}> = ({ project, style, onClick, onHoverStart, onHoverEnd, isHovered, isAnyHovered }) => {
    
    // Determine opacity: If any is hovered, dim others. If this is hovered, fully opaque.
    const opacity = isHovered ? 1 : (isAnyHovered ? 0.3 : 1);
    
    return (
        <motion.div
            className="absolute cursor-pointer will-change-transform"
            style={{
                left: style.left,
                top: style.top,
                width: SQUARE_CARD_SIZE,
                height: SQUARE_CARD_SIZE,
                zIndex: isHovered ? 100 : style.zIndex, // Bring to front on hover
                transformStyle: "preserve-3d"
            }}
            // Animate scale and rotation
            animate={{
                scale: isHovered ? 1.1 : style.scale,
                rotate: isHovered ? 0 : style.rotate,
                opacity: opacity,
                y: isHovered ? -50 : 0
            }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
            onClick={onClick}
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
        >
            <Spotlight3D
                color={project.color}
                spotlightColor="rgba(255,255,255,0.4)"
                className="w-full h-full rounded-[2.5rem] bg-white shadow-2xl overflow-hidden border-[6px] border-white"
            >
                {/* Image */}
                <div className="w-full h-full relative">
                    <img 
                        src={project.img} 
                        alt={project.title} 
                        className="w-full h-full object-cover" 
                    />
                    
                    {/* Overlay Tint on Hover */}
                    <div 
                        className="absolute inset-0 mix-blend-overlay opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                        style={{ backgroundColor: project.color }}
                    />
                    
                    {/* Number Badge */}
                    <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 text-white font-albert-black text-xl shadow-lg">
                        {project.id}
                    </div>
                </div>
            </Spotlight3D>
            
            {/* Reflection/Shadow on floor */}
            <div 
                className="absolute top-full left-0 w-full h-10 bg-black/20 blur-xl rounded-[50%]"
                style={{ transform: 'scale(0.8) translateY(20px)' }}
            />
        </motion.div>
    );
};

// --- UPDATED COMPONENT: Gallery Modal View ---
const GalleryModalView: React.FC<{ images: string[], projectId?: number, project?: any }> = ({ images, projectId, project }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollVal, setScrollVal] = useState(0);
    const [mouseVal, setMouseVal] = useState(0);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            setScrollVal(Math.round(scrollContainerRef.current.scrollTop));
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        setMouseVal(Math.round(e.clientX));
    };

    // 🟢 Special Render for Horizontal Scroll Project (Project 6)
    if (project?.layout === 'horizontal-scroll' && project.horizontalData) {
        return (
            // 🟢 UPDATED: Pass Project Color, let HorizontalScrollGallery handle the container
            <HorizontalScrollGallery items={project.horizontalData} color={project.color} />
        );
    }

    return (
        // 🟢 MODAL CONTENT WRAPPER
        <div className="relative w-full h-full bg-black">
            
            {/* 🟢 FIXED LAYER: Project 2 Video Interaction */}
            {/* Placed OUTSIDE the scrollable area, as an absolute overlay, to prevent scrolling */}
            {projectId === 2 && project?.project2Config?.videoInteraction && (
                 <Project2FlipVideo config={project.project2Config.videoInteraction} />
            )}

            {/* 🟢 SCROLLABLE AREA */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                onMouseMove={handleMouseMove}
                className="w-full h-full overflow-y-auto overflow-x-hidden floating-scrollbar relative z-10 p-0"
            >
                {/* Real-time Indicator removed */}

                <div 
                    className="flex flex-col w-full relative"
                    style={{ 
                        // Project 4: Needs specific height for absolute elements at ~16400px
                        minHeight: projectId === 4 ? '18000px' : (projectId === 5 ? '2000px' : 'auto')
                    }}
                >
                    
                    {projectId === 2 && project?.project2Config ? (
                        // 🟢 PROJECT 2 UPDATED LOGIC: Full Width Stack
                        <div className="relative w-full bg-black flex flex-col items-center">
                            {/* Phone Overlay (Sticky or Absolute on top) */}
                            {project.project2Config.phoneImage && (
                                <div 
                                    className="absolute z-20 pointer-events-none mix-blend-normal"
                                    style={{
                                        top: `${project.project2Config.phoneImage.y ?? 100}px`,
                                        left: `${project.project2Config.phoneImage.x ?? 650}px`,
                                        width: `${project.project2Config.phoneImage.width ?? 280}px`
                                    }}
                                >
                                    <img 
                                        src={project.project2Config.phoneImage.url} 
                                        alt="Phone" 
                                        className="w-full h-auto drop-shadow-2xl"
                                    />
                                </div>
                            )}

                            {/* 8 Existing Cards - Now Full Width Stack */}
                            {/* 🟢 DYNAMIC HEIGHT FIX: Apply negative margin based on last card's offset to collapse empty space */}
                            <div 
                                className="w-full flex flex-col relative z-10"
                                style={{
                                    marginBottom: project.project2Config.cards && project.project2Config.cards.length > 0
                                        ? `${project.project2Config.cards[project.project2Config.cards.length - 1].y}px`
                                        : '0px'
                                }}
                            >
                                {project.project2Config.cards && project.project2Config.cards.map((card: any) => {
                                    // 🟢 ANIMATION LOGIC: Cards 3-7 (Indices 2-6)
                                    const shouldAnimate = card.id >= 3 && card.id <= 7;
                                    const finalY = card.y ?? 0;

                                    return (
                                        <motion.img 
                                            key={card.id}
                                            src={card.url} 
                                            alt={`Card ${card.id}`}
                                            className="w-full h-auto block relative"
                                            loading="lazy"
                                            // Animation Properties
                                            initial={{ 
                                                opacity: shouldAnimate ? 0 : 1, 
                                                y: shouldAnimate ? finalY + 150 : finalY 
                                            }}
                                            whileInView={shouldAnimate ? { opacity: 1, y: finalY } : undefined}
                                            viewport={{ once: true, margin: "-100px" }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                        />
                                    );
                                })}
                            </div>

                            {/* 🟢 NEW: Extra Content Render (Absolute Positioning) */}
                            {project.project2Config.extraContent && project.project2Config.extraContent.map((item: any, idx: number) => (
                                <div 
                                    key={idx}
                                    className="absolute w-full flex justify-center pointer-events-auto"
                                    style={{ 
                                        top: `${item.y}px`, 
                                        zIndex: item.zIndex || 30 
                                    }}
                                >
                                    {item.type === 'image' && (
                                        <motion.img 
                                            src={item.url}
                                            className="block h-auto"
                                            style={{ 
                                                width: item.width ? `${item.width}px` : '100%',
                                                maxWidth: '100%'
                                            }}
                                            // 🟢 UPDATED: Added X and Rotate support
                                            // Apply X and Rotate. Since parent is flex-center, x acts as offset from center.
                                            initial={{ opacity: 0, y: 50, x: item.x || 0, rotate: item.rotate || 0 }}
                                            whileInView={{ opacity: 1, y: 0, x: item.x || 0, rotate: item.rotate || 0 }}
                                            transition={{ duration: 0.8 }}
                                        />
                                    )}

                                    {item.type === 'video' && (
                                        <AbsoluteClickableVideo 
                                            url={item.url} 
                                            scale={item.scale} 
                                        />
                                    )}
                                </div>
                            ))}

                        </div>
                    ) : (
                        // Default rendering for other projects
                        <>
                            {images.map((imgUrl, index) => (
                                <div key={index} className="w-full bg-black">
                                    <img 
                                        src={imgUrl} 
                                        className="w-full h-auto block" 
                                        loading="lazy" 
                                        decoding="async" 
                                        alt={`Project Detail ${index + 1}`} 
                                    />
                                </div>
                            ))}

                            {/* 🟢 NEW: Generic Extra Content Render (Absolute Positioning) */}
                            {project?.extraContent?.map((item: any, idx: number) => (
                                <div 
                                    key={`extra-${idx}`}
                                    className="absolute w-full flex justify-center pointer-events-auto"
                                    style={{ 
                                        top: `${item.y}px`, 
                                        zIndex: item.zIndex || 30 
                                    }}
                                >
                                    {item.type === 'image' && (
                                        <motion.img 
                                            src={item.url}
                                            className="block h-auto"
                                            style={{ 
                                                width: item.width ? `${item.width}px` : '100%',
                                                maxWidth: '100%'
                                            }}
                                            initial={{ opacity: 0, y: 50, x: item.x || 0, rotate: item.rotate || 0 }}
                                            whileInView={{ opacity: 1, y: 0, x: item.x || 0, rotate: item.rotate || 0 }}
                                            transition={{ duration: 0.8 }}
                                        />
                                    )}

                                    {item.type === 'video' && (
                                        <AbsoluteClickableVideo 
                                            url={item.url} 
                                            scale={item.scale || 1}
                                            style={{
                                                width: item.width ? `${item.width}px` : undefined,
                                                marginLeft: item.x ? `${item.x}px` : undefined
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </>
                    )}

                    <div className="w-full py-32 text-center bg-black">
                        <p className="text-white/30 text-sm">End of Project Gallery</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VinylProjects: React.FC = () => {
    // ... rest of VinylProjects component (unchanged) ...
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredProject, setHoveredProject] = useState<any>(null);
    const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 🟢 NEW: Global Music & Navbar control Logic based on Modal State
    useEffect(() => {
        if (selectedProject) {
            // Hide navbar and hide/pause music player when entering projects
            window.dispatchEvent(new Event('pause-background-music'));
            window.dispatchEvent(new Event('hide-navbar'));
        } else {
            // Show navbar and potentially resume music player when returning
            window.dispatchEvent(new Event('resume-background-music'));
            window.dispatchEvent(new Event('show-navbar'));
        }
    }, [selectedProject]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // 🟢 CHANGED: Map Vertical Scroll to Horizontal Movement (floorX)
    // Scroll [0, 1] maps to [0%, -300%] (Move Left)
    const floorX = useTransform(scrollYProgress, [0, 1], ["5%", "-300%"]);
    
    // Performance: springs
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 30, damping: 25 });
    const mouseYSpring = useSpring(y, { stiffness: 30, damping: 25 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const w = window.innerWidth;
        const h = window.innerHeight;
        x.set(clientX / w - 0.5);
        y.set(clientY / h - 0.5);
    };

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["45deg", "35deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);
    const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-3%", "3%"]);

    const handleProjectEnter = (proj: any) => {
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
        }
        setHoveredProject(proj);
    };

    const handleProjectLeave = () => {
        if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
        // REMOVED 3s DELAY: Immediate exit on mouse leave
        setHoveredProject(null);
    };

    const cardPositions = useMemo(() => CARD_POSITIONS, []);

    // Helper map for cleaner rendering
    const HOVER_CONFIGS: Record<number, any[]> = {
        1: PROJECT_1_HOVER_CONFIG,
        2: PROJECT_2_HOVER_CONFIG,
        3: PROJECT_3_HOVER_CONFIG,
        4: PROJECT_4_HOVER_CONFIG,
        5: PROJECT_5_HOVER_CONFIG,
        6: PROJECT_6_HOVER_CONFIG,
        7: PROJECT_7_HOVER_CONFIG,
        8: PROJECT_8_HOVER_CONFIG,
    };

    return (
        <section 
            ref={containerRef}
            className="w-full relative bg-white" 
            onMouseMove={handleMouseMove}
        >
             {/* --- MOBILE LAYOUT (Single Column) --- */}
             <div className="w-full bg-white px-6 py-20 flex flex-col items-center md:hidden relative z-50">
                <h2 className="text-4xl font-albert-black text-gray-200 tracking-tighter mb-8 self-start">项目案例</h2>

                <div className="flex flex-col gap-12 w-full">
                    {PROJECTS_DATA.map((project: any) => (
                        <div 
                            key={project.id}
                            className="w-full bg-white border border-gray-200 rounded-[1.5rem] overflow-hidden shadow-md flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => setSelectedProject(project)}
                        >
                            <div className="w-full aspect-[4/3] bg-gray-100 relative">
                                <img src={project.img} alt={project.title} className="w-full h-full object-cover" />
                                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-600 border border-gray-200 shadow-sm">
                                    {project.year}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col gap-3">
                                <h3 className="text-2xl font-albert-black leading-none text-black" style={{ color: project.color }}>
                                    {project.title}
                                </h3>
                                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest bg-gray-100 self-start px-2 py-1 rounded-md">
                                    {project.label}
                                </div>
                                <p className="text-sm text-gray-500 font-albert-light line-clamp-3">
                                    {project.desc}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    {project.tools.map((tool: string, i: number) => {
                                        const toolUrl = TOOL_ICONS[tool];
                                        return toolUrl ? (
                                            <div key={i} className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center p-1.5 shadow-sm">
                                                <img src={toolUrl} alt={tool} className="w-full h-full object-contain" />
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
             </div>

             {/* --- DESKTOP LAYOUT (3D) --- */}
             <div className="hidden md:block w-full h-[550vh]">
                 <div id="projects-deck" className="absolute top-0" />
                 
                 <style>{`
                    .floating-scrollbar::-webkit-scrollbar {
                        width: 6px;
                        height: 6px;
                    }
                    .floating-scrollbar::-webkit-scrollbar-track {
                        background: transparent; 
                    }
                    .floating-scrollbar::-webkit-scrollbar-thumb {
                        background-color: rgba(255, 255, 255, 0.3);
                        border-radius: 99px;
                    }
                    .floating-scrollbar::-webkit-scrollbar-thumb:hover {
                        background-color: rgba(255, 255, 255, 0.5);
                    }
                    .floating-scrollbar {
                        scrollbar-width: thin;
                        scrollbar-color: rgba(255,255,255,0.3) transparent;
                    }
                 `}</style>
                 
                 <svg style={{ width: 0, height: 0, position: 'absolute' }}>
                    {Object.values(PROJECT_TINTS).map(filter => (
                        <filter key={filter.id} id={filter.id} colorInterpolationFilters="sRGB">
                           <feColorMatrix 
                                type="matrix" 
                                values={`0 0 0 0 ${filter.r}   0 0 0 0 ${filter.g}   0 0 0 0 ${filter.b}   0 0 0 1 0`} 
                           />
                        </filter>
                    ))}
                 </svg>

                 <motion.div 
                    className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-white will-change-transform"
                 >
                     <div className="absolute inset-0 flex items-center justify-center perspective-2000">
                    <motion.div
                        className="relative w-full max-w-[1600px] will-change-transform transform-gpu"
                        style={{
                            scale: PROJECTS_SCALE, // 🟢 APPLIED GLOBAL SCALE
                            rotateX,
                            rotateY,
                            x: translateX,
                            aspectRatio: '16/9',
                            transformStyle: "preserve-3d",
                        }}
                    >
                         {/* --- RIGHT SIDE: RECTANGULAR INFO CARD (NOW CONDITIONAL LEFT/RIGHT) --- */}
                        <AnimatePresence mode="wait">
                            {hoveredProject && (
                                <ProjectPreviewCard 
                                    project={hoveredProject}
                                    side="right" 
                                    handleProjectEnter={() => handleProjectEnter(hoveredProject)}
                                    handleProjectLeave={handleProjectLeave}
                                    setSelectedProject={setSelectedProject}
                                />
                            )}
                        </AnimatePresence>

                        {/* 🟢 NEW: PROJECT 1 SPECIAL HOVER IMAGES (Unique entrance from Right) */}
                        <AnimatePresence>
                             {hoveredProject?.id === 1 && PROJECT_1_HOVER_CONFIG.map((img) => (
                                 <motion.img
                                    key={img.id}
                                    src={img.url}
                                    className="absolute pointer-events-none drop-shadow-2xl"
                                    style={{
                                        zIndex: img.zIndex, // 🟢 Updated Z-Index
                                        transformStyle: "preserve-3d",
                                        maxWidth: '500px', // Limit max width
                                        // 🟢 Apply static transform for initial render to prevent flash
                                        transform: `translateZ(${img.z}px)` 
                                    }}
                                    initial={{ 
                                        x: 1200, // 从屏幕右侧外进入
                                        y: img.y, 
                                        z: img.z, // 🟢 Apply Z Depth
                                        scale: img.scale, 
                                        rotate: img.rotate + 15, // 初始旋转稍微不同
                                        opacity: 0 
                                    }}
                                    animate={{ 
                                        x: img.x, 
                                        y: img.y, 
                                        z: img.z, // 🟢 Maintain Z Depth
                                        scale: img.scale, 
                                        rotate: img.rotate, 
                                        opacity: 1 
                                    }}
                                    exit={{ 
                                        x: 1200, // 离开时回到右侧
                                        z: img.z, // 🟢 Maintain Z Depth on exit
                                        opacity: 0, 
                                        rotate: img.rotate + 15,
                                        transition: { duration: 0.4, ease: "easeIn" }
                                    }}
                                    transition={{ 
                                        type: "spring", 
                                        stiffness: 60, 
                                        damping: 15, 
                                        delay: img.delay 
                                    }}
                                />
                             ))}
                        </AnimatePresence>

                        {/* 🟢 NEW: PROJECT 2-8 SPECIAL HOVER IMAGES (Explode from Center) */}
                        <AnimatePresence>
                             {hoveredProject && hoveredProject.id !== 1 && HOVER_CONFIGS[hoveredProject.id] && HOVER_CONFIGS[hoveredProject.id].map((img) => {
                                 // Determine the correct filter ID based on the project ID
                                 // 🟢 CHECK 'noTint' PROPERTY HERE
                                 const tintFilter = (hoveredProject && PROJECT_TINTS[hoveredProject.id] && !img.noTint) 
                                    ? `url(#${PROJECT_TINTS[hoveredProject.id].id})` 
                                    : 'none';

                                 return (
                                     <motion.img
                                        key={img.id}
                                        src={img.url}
                                        className="absolute pointer-events-none drop-shadow-2xl"
                                        style={{
                                            zIndex: img.zIndex, 
                                            transformStyle: "preserve-3d",
                                            transform: `translateZ(${img.z}px)`,
                                            // 🟢 APPLY DYNAMIC TINT FILTER
                                            filter: tintFilter
                                        }}
                                        initial={{ 
                                            x: 0, 
                                            y: 0,
                                            z: img.z,
                                            scale: 0.1, 
                                            opacity: 0,
                                            rotate: Math.random() * 20 - 10
                                        }}
                                        animate={{ 
                                            x: img.x, 
                                            y: img.y, 
                                            z: img.z,
                                            scale: img.scale, 
                                            opacity: 1,
                                            rotate: img.rotate
                                        }}
                                        exit={{ 
                                            scale: 0.1,
                                            opacity: 0,
                                            transition: { duration: 0.3 }
                                        }}
                                        transition={{ 
                                            type: "spring", 
                                            stiffness: 60, 
                                            damping: 15, 
                                            delay: img.delay 
                                        }}
                                    />
                                 );
                             })}
                        </AnimatePresence>

                        {/* FLOOR LAYER (Moves Horizontally) */}
                        <motion.div 
                            className="absolute inset-0 w-full h-full will-change-transform"
                            style={{ 
                                x: floorX, // 🟢 Using X for Horizontal Movement
                                transformStyle: "preserve-3d" 
                            }} 
                        >
                            {/* 🟢 EXTENDED BACKGROUND: Make it very wide to cover horizontal scroll */}
                            <div 
                                className="absolute top-[-50%] bottom-[-50%] bg-white transform-preserve-3d" 
                                style={{ 
                                    left: '-50%',
                                    width: '500%', // 🟢 Wide enough to cover 300% scroll
                                    transform: `translateZ(${DEPTHS.FLOOR}px)` 
                                }} 
                            />
                            
                            <FloorMarquee 
                                direction="left" 
                                text="PROJECTS" 
                                rotate={-10} 
                                className="text-[140px] font-albert-black text-gray-100 leading-none" 
                                style={{ top: '5%', left: '0%' }}
                            />

                            {/* 🟢 UPDATED: Raised zIndex to 60 to be above RightPreviewCard */}
                            <div className="absolute w-full h-full pointer-events-none" style={{ zIndex: 60, transformStyle: "preserve-3d", transform: `translateZ(${DEPTHS.PROJECTS}px)` }}>
                                {PROJECTS_DATA.map((proj, idx) => (
                                    <div key={proj.id} className="pointer-events-auto">
                                        <ProjectImageSquare 
                                            project={proj}
                                            style={cardPositions[idx] as any}
                                            onClick={() => setSelectedProject(proj)}
                                            onHoverStart={() => handleProjectEnter(proj)}
                                            onHoverEnd={handleProjectLeave}
                                            isHovered={hoveredProject?.id === proj.id}
                                            isAnyHovered={!!hoveredProject}
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                    </motion.div>
                 </div>
             </motion.div>
             </div>

             {/* MODAL WINDOW (Scaled to 60%) */}
             {createPortal(
                <AnimatePresence>
                    {selectedProject && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center perspective-2000 px-4 md:px-0">
                            {/* Backdrop - Lights Off Effect (Darker opacity) */}
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }} 
                                className="absolute inset-0 backdrop-blur-md bg-black/90"
                                onClick={() => setSelectedProject(null)}
                            />
                            <motion.div
                                initial={{ y: 50, opacity: 0, scale: 0.9 }} 
                                animate={{ y: 0, opacity: 1, scale: 1 }} 
                                exit={{ y: 50, opacity: 0, scale: 0.9 }} 
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                // 🟢 MODAL SIZE: Fixed 1000px on Desktop
                                className={`relative w-full max-w-[1000px] h-[90vh] md:h-[95vh] rounded-[2rem] overflow-hidden flex flex-col pointer-events-auto shadow-2xl ${
                                    selectedProject.layout === 'gallery' || selectedProject.layout === 'horizontal-scroll' 
                                        ? 'bg-black border border-white/20' 
                                        : 'bg-white/95 border border-white/50'
                                }`}
                                style={{
                                    boxShadow: selectedProject.layout === 'gallery' || selectedProject.layout === 'horizontal-scroll'
                                        ? '0 0 0 1px rgba(255,255,255,0.1) inset, 0 0 20px rgba(255,255,255,0.05) inset, 0 50px 100px -20px rgba(0,0,0,0.8)'
                                        : '0 0 0 1px rgba(255,255,255,0.5) inset, 0 0 20px rgba(255,255,255,0.2) inset, 0 50px 100px -20px rgba(0,0,0,0.3)'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute inset-0 rounded-[2rem] pointer-events-none z-50 border border-white/10" />
                                <button 
                                    onClick={() => setSelectedProject(null)} 
                                    className={`absolute top-4 right-4 md:top-6 md:right-6 z-[60] w-10 h-10 flex items-center justify-center rounded-full transition-colors border shadow-lg group ${
                                        selectedProject.layout === 'gallery' || selectedProject.layout === 'horizontal-scroll'
                                            ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                                            : 'bg-white/90 hover:bg-white border-gray-200 text-black'
                                    }`}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-90 transition-transform duration-300"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>

                                {selectedProject.layout === 'gallery' || selectedProject.layout === 'horizontal-scroll' ? (
                                    <GalleryModalView 
                                        images={selectedProject.detailImages || []} 
                                        projectId={selectedProject.id} 
                                        project={selectedProject} 
                                    />
                                ) : (
                                    <div className="w-full h-full overflow-y-auto floating-scrollbar relative z-10">
                                        {/* Reduced Header Height */}
                                        <div className="relative w-full h-[35vh] md:h-[40vh] bg-gray-100 flex items-center justify-center overflow-hidden">
                                            {selectedProject.img ? (
                                                <img src={selectedProject.img} className="w-full h-full object-cover" decoding="async" alt="Project Hero" />
                                            ) : (
                                                <div className="text-gray-400 font-bold tracking-widest text-xs">[ IMAGE CONTAINER ]</div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/90 via-white/40 to-transparent" />
                                        </div>
                                        {/* Reduced Padding and Margin */}
                                        <div className="relative z-10 -mt-20 px-6 md:px-10 pb-8">
                                            <div className="mx-auto max-w-5xl bg-white border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[2rem] p-6 md:p-10 overflow-hidden relative">
                                                <div className="mb-8 relative z-10">
                                                    {/* Scaled Down Fonts */}
                                                    <h1 className="text-3xl md:text-5xl font-albert-black text-black tracking-tight mb-3">{selectedProject.title}</h1>
                                                    <div className="flex items-center gap-2 md:gap-3 text-xs font-bold tracking-widest text-gray-500 uppercase flex-wrap">
                                                        <span className="px-2 py-0.5 bg-black text-white rounded-full">{selectedProject.year}</span>
                                                        <span>{selectedProject.client || 'Client'}</span>
                                                        <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                                        <span>{selectedProject.label}</span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                    <div className="md:col-span-2">
                                                        <h3 className="text-lg font-bold mb-3">Project Overview</h3>
                                                        <p className="text-lg text-gray-800 font-albert-regular leading-relaxed">{selectedProject.desc}</p>
                                                    </div>
                                                    <div className="md:col-span-1 space-y-6">
                                                        <div>
                                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tools</h4>
                                                            <div className="flex gap-2 flex-wrap">
                                                                {selectedProject.tools?.map((tool: string) => (
                                                                    <span key={tool} className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-md text-[10px] font-bold text-gray-600">{tool}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-12" />
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
             )}
        </section>
    );
};

export default VinylProjects;
