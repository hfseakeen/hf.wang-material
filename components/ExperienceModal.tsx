
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

interface ExperienceItem {
  id: string;
  year: string;
  role: string;
  company: string;
  description: string;
  tags: string[];
  type: 'work' | 'edu';
}

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- DATA ---
const mixedData: ExperienceItem[] = [
  {
    id: '1',
    year: '2024.02 - 至今',
    role: '摄影师 / 摄像师',
    company: '杭州六美传媒有限公司',
    description: '内容：1.全程主导摄影工作室从0到1的筹备、运营与发展。统筹内容创作、客户服务、团队管理及商业变现，搭建标准化服务流程，实现工作室稳定运营与口碑沉淀。2.负责过言之有物、倍至、丝塔芙、素湃等产品的拍摄。柠檬森林、遇上咖啡等直播间的搭建工作。3.主导各类产品拍摄项目执行。定制拍摄方案，把控光影、构图与画面质感，完成高质量拍摄工作。4.负责工作室日常运营，包括场地管理、摄影设备采购、维护与管理，搭建高效的拍摄与后期工作环境。客户全流程对接，包括咨询洽谈、需求沟通、订单签订、拍摄引导、后期反馈对接及作品交付，提升客户体验与满意度，维护老客户关系。5. 管控运营成本，核算日常开支（租金、薪资、物料、设备维护等），优化成本结构，确保工作室良性运营。6.搭建新媒体推广矩阵（小红书、抖音、朋友圈等），发布优质作品、拍摄花絮及活动，提升工作室曝光量与知名度。',
    tags: ['摄影工作室', '产品摄影', '电商摄影'],
    type: 'work'
  },
  {
    id: '2',
    year: '2019.06 - 2024.02',
    role: '资深设计师 (D6)',
    company: '观澜网络（杭州）有限公司 / 丁香园',
    description: '1.丁香园大众医学部UED摄影负责人，负责全品类电商产品图的线上视觉效果，提升用户体验。2.参与丁香园自研产品的整体规划详情页设计拍摄实施，确保产品上线符合市场需求。3.负责丁香园电商平台产品图片上线的视觉效果，包括各大促、天猫及小程序等。4.协调团队资源，优化工作流程，提高摄影项目的执行效率。5.定期与业务部门沟通，根据反馈调整产品的拍摄效率和风格质量，持续优化产品展示效果。',
    tags: ['UED摄影师', '产品摄影', '电商摄影'],
    type: 'work'
  },
  {
    id: '3',
    year: '2018.06 - 2019.05',
    role: '视觉设计师',
    company: 'K3 SPACE',
    description: '1.负责品牌形象的整体设计与策划，确保品牌视觉的一致性和创新性。2.提出标志设计方案，参与从概念到最终执行的全过程，成功应用于多个知名互联网和电商品牌。3.主导品牌VI系统的构建，包括但不限于色彩方案、字体设计、图形元素等，提升品牌识别度。4.与团队紧密合作，确保设计方案的有效实施，并根据反馈进行优化调整。5.定期分析行业设计趋势，为品牌提供创新的设计思路和视觉策略。',
    tags: ['品牌设计', 'VI系统', '视觉策划'],
    type: 'work'
  },
  {
    id: 'edu-1',
    year: '2014 - 2018',
    role: '本科 / 视觉传达设计',
    company: '黑龙江大学',
    description: '1.GPA:4（专业第一）。2.荣誉奖项：2014-2018综合奖学金，2014-2018 校优秀学生干部。3.2014-2017校广播台音乐台负责人，负责校园音乐类导播2017。4.苹果公司IOS Club夏令营优秀学员。5.2017 黑龙江省第五届“互联网＋”大学生创新创业大赛一等奖。6.2017 黑龙江省第二届移动应用创新大赛二等奖。7.2017中国高校计算机大赛移动应用创新赛 最佳作品奖',
    tags: ['专业第一', '校优秀干事', '竞赛一等奖'],
    type: 'edu'
  }
];

// --- UTILS: Formatter for Description ---
const FormattedDescription: React.FC<{ text: string }> = ({ text }) => {
    // Splits text by "1.", "2.", "3." etc to create new lines
    const parts = text.split(/(\d+\.)/g);
    
    // If no numbers found, return text as is
    if (parts.length <= 1) return <p>{text}</p>;

    const elements = [];
    for (let i = 1; i < parts.length; i += 2) {
        // parts[i] is the number (e.g. "1."), parts[i+1] is the content
        elements.push(
            <div key={i} className="flex gap-2 mb-2 items-start">
                <span className="font-bold text-black/60 min-w-[20px]">{parts[i]}</span>
                <span>{parts[i+1]}</span>
            </div>
        );
    }
    // Handle any text before the first number (if any)
    if(parts[0].trim()) {
        elements.unshift(<div key="intro" className="mb-2">{parts[0]}</div>);
    }

    return <div className="leading-relaxed">{elements}</div>;
};


// --- COMPONENT: Apple Glass 3D Card ---
const AppleGlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tiltIntensity?: number;
}> = ({ children, className = "", onClick, tiltIntensity = 15 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${tiltIntensity}deg`, `-${tiltIntensity}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${tiltIntensity}deg`, `${tiltIntensity}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative group perspective-1000 transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
};

// --- COMPONENT: Spotlight Item Row ---
const SpotlightRow: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className="relative rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      {/* Spotlight Border Effect via Mask */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 0, 0, 0.15), 
              transparent 80%
            )
          `,
          maskImage: `
            linear-gradient(black, black) content-box,
            linear-gradient(black, black)
          `,
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px', // Border width
        }}
      />
      
      {/* Hover Background - Apple Glass darkening/lightening */}
      <div className="absolute inset-0 bg-white/40 border border-white/40 backdrop-blur-sm group-hover:bg-white/60 transition-colors duration-300 rounded-2xl" />

      <div className="relative z-20 p-6 md:p-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {children}
      </div>
    </div>
  );
};

const ExperienceModal: React.FC<ExperienceModalProps> = ({ isOpen, onClose }) => {
  const [selectedItem, setSelectedItem] = useState<ExperienceItem | null>(null);
  // 🇨🇳 CHINA OPTIMIZATION: Replaced Unsplash URL with jsDelivr mirror asset
  const [photoUrl, setPhotoUrl] = useState<string>("https://hf-1259323808.cos.ap-shanghai.myqcloud.com/images/grxx/zjz.webp");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const url = URL.createObjectURL(file);
          setPhotoUrl(url);
      }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 perspective-2000">
            
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="absolute inset-0 bg-white/40 backdrop-blur-2xl" 
                onClick={onClose}
            />

            {/* Close Button */}
            <motion.button
                className="absolute top-6 right-6 md:top-10 md:right-10 z-[200] p-3 bg-white/40 hover:bg-white/80 border border-white/60 backdrop-blur-md rounded-full shadow-lg transition-all"
                onClick={onClose}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ rotate: 90 }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </motion.button>

            <div className="relative z-10 w-full max-w-[1400px] h-[95vh] md:h-[85vh] flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-center pointer-events-none mt-8 md:mt-0">
                
                {/* LEFT: Photo Card (Thrown In Effect) */}
                <motion.div
                    className="flex flex-col items-center pointer-events-auto shrink-0"
                    initial={{ x: -300, rotate: -25, opacity: 0 }}
                    animate={{ x: 0, rotate: -3, opacity: 1 }}
                    exit={{ x: -300, rotate: -25, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 60, damping: 12, delay: 0.1 }}
                >
                    <AppleGlassCard 
                        tiltIntensity={10}
                        className="w-[180px] h-[240px] md:w-[380px] md:h-[480px] rounded-[1.5rem] md:rounded-[2.5rem] bg-white/20 backdrop-blur-xl border border-white/40 shadow-2xl p-2 md:p-3"
                    >
                         <div 
                            className="w-full h-full rounded-[1.2rem] md:rounded-[2rem] overflow-hidden relative cursor-pointer group bg-gray-200"
                            onClick={() => fileInputRef.current?.click()}
                         >
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                            
                            {/* Inner Border/Highlight */}
                            <div className="absolute inset-0 border border-white/20 rounded-[1.2rem] md:rounded-[2rem] pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none" />
                         </div>
                    </AppleGlassCard>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 md:mt-8 text-center"
                    >
                        <h2 className="text-2xl md:text-4xl font-siyuan font-bold text-black tracking-tight mb-1 md:mb-2">王海锋</h2>
                        <p className="text-xs md:text-lg font-mono text-gray-500 tracking-widest">WANG HAIFENG</p>
                    </motion.div>
                </motion.div>

                {/* RIGHT: Timeline Container (Apple Glass) */}
                <motion.div 
                    className="w-full max-w-4xl h-full flex-1 pointer-events-auto overflow-hidden"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <AppleGlassCard 
                        tiltIntensity={5}
                        className="w-full h-[60vh] md:h-full rounded-[2rem] md:rounded-[3rem] bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col"
                    >
                         {/* Header */}
                         <div className="p-6 md:p-12 pb-4 md:pb-6 border-b border-white/20 flex-shrink-0 bg-white/10 backdrop-blur-md">
                            <h2 className="text-2xl md:text-5xl font-hanchanyuanyuan text-black tracking-tight">
                                履历时间轴
                            </h2>
                         </div>

                         {/* Scrollable List */}
                         <div className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar relative">
                             {/* Vertical Line */}
                             <div className="absolute left-[31px] md:left-[61px] top-6 bottom-12 w-px bg-gradient-to-b from-transparent via-gray-300/50 to-transparent" />

                             <div className="space-y-6 md:space-y-10">
                                {mixedData.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className="relative pl-12 md:pl-16 group"
                                    >
                                        {/* Dot - Interactive Hover Effect */}
                                        <div className="absolute left-[3px] md:left-[23px] top-1/2 -translate-y-1/2 flex items-center justify-center z-20">
                                            {/* Outer Ring (expands on hover) */}
                                            <div 
                                                className={`w-5 h-5 rounded-full border-2 transition-all duration-300 scale-0 group-hover:scale-100 ${item.type === 'edu' ? 'border-blue-400' : 'border-[#FF4500]'}`} 
                                            />
                                            {/* Inner Core */}
                                            <div 
                                                className={`absolute w-2.5 h-2.5 rounded-full transition-colors duration-300 bg-gray-300 group-hover:bg-white`} 
                                            />
                                            {/* Glow on hover */}
                                            <div className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${item.type === 'edu' ? 'bg-blue-400' : 'bg-[#FF4500]'}`} />
                                        </div>

                                        <SpotlightRow onClick={() => setSelectedItem(item)}>
                                            {/* Title and Role Section */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-2xl font-bold text-black">{item.company}</h3>
                                                    {/* Arrow */}
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                                        <polyline points="12 5 19 12 12 19"></polyline>
                                                    </svg>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                                                    <p className="text-gray-500 font-medium text-sm">{item.role}</p>
                                                </div>
                                                <p className="text-gray-400 text-xs mt-3 line-clamp-1">{item.description.substring(0, 50)}...</p>
                                            </div>

                                            {/* Date Pill - Right aligned */}
                                            <div className="self-start md:self-center shrink-0">
                                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono tracking-wider border transition-colors duration-300 ${
                                                    item.type === 'edu' 
                                                        ? 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-100' 
                                                        : 'bg-red-50 text-red-600 border-red-100 group-hover:bg-red-100'
                                                }`}>
                                                    {item.year}
                                                </div>
                                            </div>
                                        </SpotlightRow>
                                    </motion.div>
                                ))}
                             </div>
                         </div>
                    </AppleGlassCard>
                </motion.div>

            </div>

            {/* DETAIL MODAL (Rotating Flip - Apple Glass iOS 16 Style) */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="absolute inset-0 bg-white/20 backdrop-blur-md"
                            onClick={() => setSelectedItem(null)}
                        />
                        
                        <motion.div
                            layoutId={selectedItem.id}
                            initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                            exit={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                            style={{ transformStyle: "preserve-3d" }}
                            className="relative w-full max-w-2xl bg-white/60 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.1)] p-10 md:p-14 border border-white/60 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white transition-colors border border-white/50 text-gray-500 hover:text-black"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>

                            {/* Content */}
                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${selectedItem.type === 'edu' ? 'bg-blue-100/50 text-blue-600' : 'bg-red-100/50 text-red-600'}`}>
                                        {selectedItem.year}
                                    </span>
                                    <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
                                </div>

                                <h2 className="text-4xl md:text-5xl font-albert-black mb-3 text-black tracking-tight">{selectedItem.company}</h2>
                                <h3 className="text-2xl text-gray-500 mb-10 font-light font-albert-light">{selectedItem.role}</h3>

                                <div className="prose prose-lg text-gray-600 font-albert-regular mb-12">
                                    {/* Use Utility Component to format text with line breaks at numbers */}
                                    <FormattedDescription text={selectedItem.description} />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {selectedItem.tags.map(tag => (
                                        <span key={tag} className="px-4 py-1.5 bg-white/40 border border-white/50 rounded-lg text-xs font-bold text-gray-500 uppercase tracking-wide shadow-sm backdrop-blur-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Decorative Background Elements (Subtle) */}
                            <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-3xl pointer-events-none" />
                            <div className={`absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-10 ${selectedItem.type === 'edu' ? 'bg-blue-400' : 'bg-orange-400'}`} />

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
      )}
    </AnimatePresence>
  );
};

export default ExperienceModal;
