
import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring, useScroll, useMotionTemplate } from 'framer-motion';
import { createPortal } from 'react-dom';
import ExperienceModal from '../components/ExperienceModal';
import Magnetic from '../components/Magnetic';

// ==========================================
// 🟢 CONFIGURATION: GLOBAL ZOOM & LAYOUT
// ==========================================

// 🟢 1. GLOBAL SCALE: Adjusts the zoom level of the entire section
const PROFILE_SCALE = 0.7;

// 🟢 2. CARD DIMENSIONS: Standard dimensions before scaling
const CARD_WIDTH = '550px';
const CARD_HEIGHT = '180px';

// 🟢 3. CARD POSITIONS: Adjust each timeline card's Top, Left, and Rotation
const CARD_POSITIONS = [
    { top: '0%',  left: '55%', rotate: '-2deg' }, 
    { top: '23%', left: '60%', rotate: '1deg' },  
    { top: '46%', left: '56%', rotate: '-1deg' }, 
    { top: '69%', left: '59%', rotate: '2deg' },  
    { top: '92%', left: '55%', rotate: '-1deg' }, 
];

// --- DATA ---
const experienceData = [
  { 
      id: '1', 
      year: '2024.02 - 至今', 
      role: '摄影师 / 摄像师', 
      company: '杭州六美传媒有限公司', 
      color: '#FF7F27', 
      desc: '创立摄影工作室是想要构建纯粹的视觉美学。在企业里，视觉往往需要向多方业务线妥协；但在自己的工作室，我可以将极致的光影控制、以及对产品严苛的精修标准，毫无保留地应用到每一次商业拍摄中。工作室将我从专业核心向“六边形主理人”升维，不仅输出极致视觉，更打通了商业闭环（成本核算、流量运营、客户维系），完成从执行者到商业操盘手的身份转换。',
      tags: ['摄影工作室', '直播间搭建', '产品摄影']
  },
  { 
      id: '2', 
      year: '2019.06 - 2024.02', 
      role: '资深设计师 (D6)', 
      company: '观澜网络（杭州）有限公司 / 丁香园', 
      color: '#005C4B', 
      desc: '深耕电商摄影业务内核，从0到1搭建全品类摄影体系。通过极致的光影控制与后期，将高级视觉直接转化为商业杠杆，助力爆款打造（提升电商转化率 &GMV），完成了从视觉专家到主导者的升维。我意识到，是时候打破企业的框架，去构建完全属于自己的品牌阵地了。',
      tags: ['UED负责人', '视觉体系', '电商摄影'] 
  },
  { 
      id: '3', 
      year: '2018.08 - 2019.05', 
      role: '视觉设计师', 
      company: 'K3 SPACE', 
      color: '#FFCC00',
      desc: '拥抱顶尖审美与国际化视野，参与京东、原研哉合作项目打磨极简美学。完成了从“做图”到“做系统”的思维转变，深刻理解了品牌全案控盘下，视觉语言在多端保持高度统一性与延展性的逻辑。但同时我也想系统化的了解一个品牌或者领域如何从0到1的一个过程。',
      tags: ['品牌设计', 'VI系统', '视觉策划'] 
  },
  { 
      id: '4', 
      year: '2018.04 - 2018.08', 
      role: '品牌设计师', 
      company: '正邦', 
      color: '#FFCC00',
      desc: '选择正邦旨在探寻顶尖的系统化设计逻辑。这段短暂经历开启了我从“感性创作”到“理性商业设计”的启蒙，学会了严谨的VI规范，建立了高标准的品牌系统观，但大公司高度细分的流水线作业，也让我明确了渴望的是拥有更高项目掌控权。',
      tags: ['品牌设计', 'VI系统', '视觉策划'] 
  },
  { 
      id: '5', 
      year: '2014 - 2018', 
      role: '本科 / 视觉传达设计', 
      company: '黑龙江大学', 
      color: '#55FF55',
      desc: 'GPA：3.8（专业第一）。2014-2018 连续获综合奖学金与校优秀学生干部。\n2014-2017 校广播台音乐台负责人。\n获黑龙江省第五届“互联网+”大学生创新创业大赛一等奖。',
      tags: ['专业第一', '校优秀干事', '竞赛一等奖']
  },
];

// --- DEPTH CONFIG ---
const DEPTHS = {
    FLOOR: -300,
    PROPS: -290,
    MAIN: -50,
};

// --- COMPONENTS ---

const FloorMarquee: React.FC<{ direction: 'left' | 'right', text: string, className?: string, rotate?: number, style?: React.CSSProperties }> = React.memo(({ direction, text, className, rotate = 0, style }) => {
    return (
        <div 
            className="absolute left-[-20%] w-[140%] pointer-events-auto overflow-visible flex will-change-transform"
            style={{ 
                transform: `translateZ(${DEPTHS.PROPS - 10}px) rotate(${rotate}deg)`, 
                zIndex: 0,
                ...style,
            }}
        >
            <motion.div
                className={`flex whitespace-nowrap ${className}`}
                initial={{ x: direction === 'left' ? '0%' : '-50%' }}
                animate={{ x: direction === 'left' ? '-50%' : '0%' }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
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

const ProfileTimelineCard: React.FC<{ 
    item: any, 
    onClick: () => void, 
    index: number, 
    style: React.CSSProperties 
}> = React.memo(({ item, onClick, index, style }) => {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);

    const randomDuration = useMemo(() => 4 + Math.random() * 2, []);
    const randomDelay = useMemo(() => Math.random() * 2, []);

    const handleMouseMove = ({ clientX, clientY }: React.MouseEvent) => {
        if (!ref.current) return;
        const { left, top } = ref.current.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <motion.div
            ref={ref}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            // 🟢 UPDATED: Spring physics adjusted for overshoot/recoil
            initial={{ opacity: 0, x: 400, scale: 0.9 }} 
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ margin: "-10%" }} // Removed once: true to allow replay
            transition={{ 
                delay: index * 0.15, 
                type: "spring", 
                stiffness: 50,    
                damping: 9,       
                mass: 1,          
                
                // Specific overrides for the continuous floating/hover animations
                y: {
                    duration: isHovered ? 0.3 : randomDuration,
                    repeat: isHovered ? 0 : Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay: isHovered ? 0 : randomDelay
                },
                rotateZ: {
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "mirror"
                }
            }}
            className="absolute rounded-[2rem] cursor-pointer group perspective-1000 transform-gpu will-change-transform"
            style={{ 
                ...style, 
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                transformStyle: "preserve-3d" 
            }}
            animate={{
                y: isHovered ? -10 : [0, -10, 0], 
                rotateZ: isHovered ? 0 : [0, 0.5, -0.5, 0]
            }}
        >
            <div 
                className="absolute -left-16 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center pointer-events-none"
                style={{ transform: 'translateZ(10px)' }}
            >
                <div className="absolute left-full top-1/2 w-8 h-[1px] bg-white/20 group-hover:w-12 transition-all duration-300" />
                <div className="w-3 h-3 rounded-full bg-gray-300 group-hover:bg-white transition-colors duration-300 z-10" />
                <div 
                    className="absolute inset-0 rounded-full border border-gray-400 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" 
                    style={{ borderColor: item.color }}
                />
                 <div 
                    className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-all duration-500" 
                    style={{ backgroundColor: item.color }}
                />
            </div>

            <motion.div 
                className="absolute inset-0 rounded-[2rem] shadow-sm" 
                style={{ transformStyle: 'preserve-3d' }}
                whileHover={{ z: 20, scale: 1.02 }} 
            >
                <motion.div
                    className="absolute -inset-[1px] rounded-[2rem] z-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none"
                    style={{
                        background: item.color,
                        maskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                        WebkitMaskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                    }}
                />
                
                <div className="absolute inset-0 bg-white/60 backdrop-blur-md border border-white/60 rounded-[2rem] overflow-hidden z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-60 pointer-events-none" />

                    {/* Reverted Content Sizes */}
                    <div className="relative p-6 flex flex-col justify-center h-full z-20">
                        <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-3">
                                 <span className="font-albert-black text-3xl text-black/90 group-hover:text-black transition-colors">
                                    {item.company}
                                 </span>
                                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-black">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                 </svg>
                             </div>

                             <span 
                                className="px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md"
                                style={{ 
                                    backgroundColor: 'rgba(255,255,255,0.4)', 
                                    borderColor: 'rgba(255,255,255,0.6)',
                                    color: '#555' 
                                }}
                             >
                                {item.year}
                             </span>
                        </div>
                        
                        <div className="text-gray-600 font-albert-light text-lg flex items-center gap-2 mb-2">
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                             </svg>
                             {item.role}
                        </div>

                        <p className="text-sm text-gray-500 font-albert-light leading-snug line-clamp-2 whitespace-pre-line">
                            {item.desc}
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
});

const ExperienceModalCard: React.FC<{ selectedExp: any, onClose: () => void }> = ({ selectedExp, onClose }) => {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY }: React.MouseEvent) => {
        if (!ref.current) return;
        const { left, top } = ref.current.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <motion.div
            layoutId={`card-${selectedExp.id}`}
            ref={ref}
            onMouseMove={handleMouseMove}
            initial={{ rotateY: 90, opacity: 0, scale: 0.9 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: -90, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar transform-gpu group"
            style={{ 
                transformStyle: "preserve-3d",
                borderRadius: '2.5rem',
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div 
                className="absolute inset-4 rounded-[2.5rem] transition-opacity duration-300 pointer-events-none"
                style={{ 
                    boxShadow: `0 0 100px -10px ${selectedExp.color}`,
                    opacity: 0.04,
                    zIndex: -1
                }}
            />
            <motion.div
                className="absolute inset-0 z-20 pointer-events-none rounded-[2.5rem]"
                style={{
                    border: '1.5px solid transparent',
                    background: selectedExp.color,
                    opacity: 0.15,
                    maskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                    WebkitMaskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                    maskComposite: 'exclude', 
                    WebkitMaskComposite: 'xor',
                    padding: '1.5px', 
                    backgroundClip: 'content-box',
                }}
            >
                 <div className="absolute inset-0 bg-transparent" /> 
            </motion.div>
            <div className="absolute inset-0 rounded-[2.5rem] border border-white/50 pointer-events-none z-20 mix-blend-overlay" />
             <div 
                className="absolute inset-0 rounded-[2.5rem] blur-md mix-blend-multiply transition-all duration-500"
                style={{ 
                    backgroundColor: selectedExp.color, 
                    transform: 'translate(4px, 4px) scale(0.99)', 
                    opacity: 0.015, 
                    zIndex: -1 
                }} 
            />
            <div 
                className="absolute inset-0 rounded-[2.5rem] blur-md mix-blend-screen transition-all duration-500"
                style={{ 
                    backgroundColor: '#ffffff', 
                    transform: 'translate(-4px, -4px) scale(0.99)', 
                    opacity: 0.01,
                    zIndex: -2 
                }} 
            />
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[60px] saturate-150 rounded-[2.5rem] shadow-2xl" />
            <div className="relative z-20 p-6 md:p-14">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors border border-black/5 backdrop-blur-sm text-black/60"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg border border-white/20" style={{ backgroundColor: selectedExp.color }}>
                        {selectedExp.company.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-3xl font-albert-black text-black">{selectedExp.company}</h2>
                        <span className="text-gray-500 font-mono">{selectedExp.year}</span>
                    </div>
                </div>
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-black mb-2">{selectedExp.role}</h3>
                    <p className="text-lg text-gray-800 leading-relaxed font-albert-regular whitespace-pre-line">
                        {selectedExp.desc}
                    </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {selectedExp.tags && selectedExp.tags.map((tag: string, i: number) => (
                         <span key={i} className="px-3 py-1 bg-white/60 border border-white/60 rounded-lg text-xs text-gray-600 font-bold uppercase backdrop-blur-md shadow-sm">
                            {tag}
                         </span>
                    ))}
                </div>
                <div 
                    className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-[80px] pointer-events-none"
                    style={{ backgroundColor: selectedExp.color, opacity: 0.02 }} 
                />
            </div>
        </motion.div>
    );
};

const StablePhoto: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className="absolute w-[320px] h-[440px] md:w-[400px] md:h-[550px]"
            style={{
                top: '-6%',
                left: '15%',
                zIndex: 20,
                transformStyle: "preserve-3d",
                z: DEPTHS.MAIN,
            }}
            initial={{ x: -1000, rotate: -45, opacity: 0 }}
            whileInView={{ 
                x: 0, 
                rotate: 2, 
                opacity: 1,
                y: [0, -10, 0]
            }}
            viewport={{ once: false }}
            transition={{ 
                x: { duration: 1.2, type: "spring", stiffness: 50, damping: 12 },
                y: { duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                className="w-full h-full rounded-[2rem] bg-white p-3 shadow-2xl group cursor-pointer"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
            >
                <div className="w-full h-full relative overflow-hidden rounded-[1.5rem] bg-gray-100 transform-style-3d">
                    <img 
                        src="https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/grxx/zjz.webp" 
                        alt="Profile" 
                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out will-change-filter"
                        decoding="async"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />
                    <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] rounded-[1.5rem] pointer-events-none" />
                </div>
            </motion.div>
        </motion.div>
    );
};

const NameTilt: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 200, damping: 10 });
    const mouseYSpring = useSpring(y, { stiffness: 200, damping: 10 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ 
                rotateX, 
                rotateY, 
                transformStyle: "preserve-3d" 
            }}
            className="inline-block"
        >
            <h2 className="text-7xl font-siyuan font-bold text-black leading-none mb-4 mix-blend-multiply tracking-tighter transform -skew-x-6 hover:text-black/70 transition-colors duration-300 pointer-events-none">
                王海锋
            </h2>
        </motion.div>
    );
};


const Profile: React.FC<{ forceOpenModal?: boolean, setForceOpenModal?: (open: boolean) => void }> = ({ forceOpenModal, setForceOpenModal }) => {
  const [selectedExp, setSelectedExp] = useState<any>(null);
  const [isFullModalOpen, setIsFullModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external prop with local state
  React.useEffect(() => {
    if (forceOpenModal) {
        setIsFullModalOpen(true);
        // Reset the trigger in parent to avoid re-opening on every scroll
        if (setForceOpenModal) setForceOpenModal(false);
    }
  }, [forceOpenModal, setForceOpenModal]);

  const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start start", "end end"]
  });
  const floorY = useTransform(scrollYProgress, [0, 1], ["-10%", "-30%"]);

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

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["35deg", "25deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-1%", "1%"]);

    return (
        <section 
            ref={containerRef}
            className="relative w-full bg-white overflow-hidden" 
            onMouseMove={handleMouseMove}
            style={{ height: 'auto', minHeight: '100vh' }}
        >
            {/* --- MOBILE LAYOUT (Single Column) --- */}
            <div className="w-full bg-white px-6 py-20 flex flex-col items-center md:hidden relative z-50">
                <h2 className="text-4xl font-albert-black text-gray-200 tracking-tighter mb-8">个人简历</h2>
                
                <div className="w-full max-w-sm aspect-[3/4] rounded-[1.5rem] overflow-hidden mb-8 shadow-xl">
                    <img 
                        src="https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/grxx/zjz.webp" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />
                </div>

                <div 
                    className="text-center mb-12 hover:scale-105 transition-transform"
                    onClick={() => setIsFullModalOpen(true)}
                >
                    <h2 className="text-5xl font-siyuan font-bold text-black leading-none mb-4 tracking-tighter">
                        王海锋
                    </h2>
                    <div className="flex flex-col items-center gap-2 text-sm font-mono text-gray-500 mb-4">
                        <span>8年工作经验 | 杭州</span>
                        <span>资深摄影师 / 设计师</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-[#D40411]">
                        点击查看完整履历
                    </div>
                </div>

                <div className="w-full flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-hanchanyuanyuan text-black">核心经历</h3>
                </div>

                <div className="flex flex-col w-full gap-6">
                    {experienceData.map((item, idx) => (
                        <div 
                            key={item.id}
                            onClick={() => setSelectedExp(item)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="font-albert-black text-xl text-black">
                                    {item.company}
                                </span>
                                <span className="text-xs font-bold text-gray-500 whitespace-nowrap bg-white px-2 py-1 rounded-md border border-gray-200">
                                    {item.year}
                                </span>
                            </div>
                            <div className="text-gray-600 font-albert-light text-sm flex items-center gap-2 mb-3">
                                {item.role}
                            </div>
                            <p className="text-sm text-gray-500 font-albert-light leading-snug line-clamp-3">
                                {item.desc}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4 text-[10px]">
                                {item.tags.map((tag:string, i:number) => (
                                    <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded-md text-gray-500">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- DESKTOP LAYOUT (3D) --- */}
            <div className="hidden md:block w-full h-[140vh]">
                <motion.div 
                    className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center will-change-transform"
                >
                    <div className="absolute inset-0 flex items-center justify-center perspective-2000">
            <motion.div
                className="relative w-full max-w-[1600px] will-change-transform transform-gpu"
                style={{
                    scale: PROFILE_SCALE, // 🟢 APPLIED GLOBAL SCALE
                    rotateX,
                    rotateY,
                    x: translateX,
                    y: floorY,
                    aspectRatio: '16/9',
                    transformStyle: "preserve-3d",
                }}
            >
                <div className="absolute inset-[-50%] bg-white transform-preserve-3d" style={{ transform: `translateZ(${DEPTHS.FLOOR}px)` }} />
                
                {/* Scaled Text (Reverted) */}
                <FloorMarquee 
                    direction="right" 
                    text="关于我" 
                    rotate={-5} 
                    className="text-[160px] font-hanchanyuanyuan text-gray-100 leading-none" 
                    style={{ top: '15%', zIndex: 1 }}
                />

                <div 
                    className="absolute pointer-events-none text-center w-[400px]"
                    style={{
                         top: '5%',
                         left: '15%',
                         transform: `translateZ(${DEPTHS.PROPS}px) rotateX(-5deg)`,
                         zIndex: 5
                    }}
                >
                    {/* Reverted Text */}
                    <h2 className="text-6xl font-albert-black text-gray-200 tracking-tighter">个人简历</h2>
                </div>

                <StablePhoto />

                <motion.div 
                    className="absolute text-left pointer-events-auto"
                    style={{ 
                        top: '70%', 
                        left: '22%', 
                        transform: `translateZ(${DEPTHS.MAIN}px) rotateX(-10deg) rotateZ(-5deg)`,
                        width: '450px',
                        zIndex: 25
                    }}
                    initial={{ opacity: 0, y: 50, rotate: 10 }}
                    whileInView={{ opacity: 1, y: 0, rotate: -5 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.5, duration: 1, type: "spring" }}
                >
                    <Magnetic strength={40}>
                        <motion.div
                            className="cursor-pointer"
                            whileHover={{ scale: 1.15 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            onClick={() => setIsFullModalOpen(true)}
                        >
                            <NameTilt />
                            <div className="flex flex-wrap gap-4 text-sm font-mono text-gray-500 pl-4 border-l-2 border-gray-300 pointer-events-none font-opposans">
                                <span>8年工作经验</span>
                                <span>·</span>
                                <span>杭州</span>
                                <span>·</span>
                                <span>资深摄影师 / 设计师</span>
                            </div>
                            
                            {/* NEW: Click Hint */}
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold tracking-widest text-black/40 group-hover:text-black transition-colors">
                                <span className="w-6 h-[1px] bg-black/20" />
                                点击查看完整履历
                            </div>
                        </motion.div>
                    </Magnetic>
                </motion.div>

                {/* Timeline Cards */}
                <div 
                    className="absolute w-full h-full pointer-events-auto"
                    style={{
                        zIndex: 30,
                        transformStyle: "preserve-3d",
                        transform: `translateZ(${DEPTHS.MAIN}px) rotateX(-5deg)`,
                    }}
                >
                    {experienceData.map((item, idx) => (
                        <ProfileTimelineCard 
                            key={item.id} 
                            item={item} 
                            index={idx}
                            style={CARD_POSITIONS[idx] as React.CSSProperties}
                            onClick={() => setSelectedExp(item)}
                        />
                    ))}
                </div>

            </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* FULL SCREEN EXPERIENCE MODAL (2nd LEVEL PAGE) */}
      <ExperienceModal 
        isOpen={isFullModalOpen} 
        onClose={() => setIsFullModalOpen(false)} 
      />

      {/* FLIP MODAL OVERLAY (Individual Item details) */}
      {createPortal(
        <AnimatePresence>
            {selectedExp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center perspective-2000 px-4">
                     <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="absolute inset-0 bg-white/40 backdrop-blur-md"
                        onClick={() => setSelectedExp(null)}
                     />
                     
                     <ExperienceModalCard 
                        selectedExp={selectedExp} 
                        onClose={() => setSelectedExp(null)} 
                     />
                </div>
            )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

export default Profile;
