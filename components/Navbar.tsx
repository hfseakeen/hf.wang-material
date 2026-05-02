
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import Magnetic from './Magnetic';
import VinylLogo from './VinylLogo';

// Optimized Spotlight Link
const SpotlightLink: React.FC<{ text: string; href: string; onClick?: (e: React.MouseEvent) => void; className?: string }> = ({ text, href, onClick, className }) => {
    const ref = useRef<HTMLAnchorElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Create gradient string directly
    const gradientBg = useMotionTemplate`radial-gradient(100px circle at ${mouseX}px ${mouseY}px, rgba(0,0,0,0.05), transparent 40%)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <Magnetic>
            <motion.a
                ref={ref}
                href={href}
                onClick={onClick}
                onMouseMove={handleMouseMove}
                className={`relative px-4 py-2 text-[10px] font-bold tracking-widest cursor-pointer block group overflow-hidden rounded-lg text-gray-600 ${className || ''}`}
                whileHover={{ opacity: 1, color: "#000000" }} // Darken on hover
            >
                {/* Spotlight Gradient Background - Zero React Renders */}
                <motion.div 
                    className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100 hidden md:block"
                    style={{ background: gradientBg }}
                />
                <span className="relative z-10 block">{text}</span>
            </motion.a>
        </Magnetic>
    );
};

const Navbar: React.FC = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // 🟢 NEW: Listen for global hide/show events (e.g., from modals)
  useEffect(() => {
    const handleHide = () => setIsHidden(true);
    const handleShow = () => setIsHidden(false);
    
    window.addEventListener('hide-navbar', handleHide);
    window.addEventListener('show-navbar', handleShow);
    
    return () => {
        window.removeEventListener('hide-navbar', handleHide);
        window.removeEventListener('show-navbar', handleShow);
    };
  }, []);

  // Debounced scroll update or simple threshold check is fine
  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldBeScrolled = latest > 100;
    if (isScrolled !== shouldBeScrolled) {
        setIsScrolled(shouldBeScrolled);
    }
  });

  const navLinks = [
      { name: "个人经历 EXPERIENCE", id: "#experience" },
      { name: "专业能力 CAPABILITIES", id: "#capabilities" },
      { name: "作品展示 PROJECTS", id: "#projects" }
  ];

  const handleScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Close mobile menu on click
    const element = document.querySelector(id);
    if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
  };

  return (
    <>
    <motion.nav
      className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-8 flex justify-between items-center transition-all duration-500 pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: isHidden ? 0 : 1,
        y: isHidden ? -20 : 0,
        backgroundColor: isScrolled ? "rgba(255,255,255,0.01)" : "transparent",
      }}
      style={{ pointerEvents: isHidden ? 'none' : 'auto' } as any}
    >
      <div 
        className="absolute inset-0 z-[-1] transition-all duration-500 pointer-events-none"
        style={{
            opacity: isScrolled ? 0.2 : 1,
            backdropFilter: isScrolled ? "blur(8px)" : "blur(0px)",
        }}
      />

      <div 
        className="w-full flex justify-between items-center transition-all duration-500 pointer-events-auto"
        style={{ opacity: isScrolled ? 0.2 : 1 }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
        onMouseLeave={(e) => { if(isScrolled) e.currentTarget.style.opacity = "0.2"; }}
      >
          <div className="flex items-center">
             <Magnetic strength={20}>
                <VinylLogo />
             </Magnetic>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
                <SpotlightLink 
                    key={link.name} 
                    text={link.name} 
                    href={link.id}
                    onClick={(e) => handleScroll(e, link.id)}
                />
            ))}

            <Magnetic>
                <motion.a
                    href="#contact"
                    onClick={(e) => handleScroll(e, "#contact")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-4 px-6 py-2 text-[10px] font-bold tracking-widest text-gray-600 border border-black/10 rounded-full backdrop-blur-md bg-white/30 shadow-sm hover:bg-white/50 transition-all block hover:text-black"
                >
                    <span>联系 CONTACT</span>
                </motion.a>
            </Magnetic>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-white/50 backdrop-blur-md border border-gray-200 rounded-full outline-none z-[100]"
              >
                  <motion.span 
                    animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                    className="w-4 h-px bg-black block" 
                  />
                  <motion.span 
                    animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="w-4 h-px bg-black block" 
                  />
                  <motion.span 
                    animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                    className="w-4 h-px bg-black block" 
                  />
              </button>
          </div>
      </div>
    </motion.nav>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed inset-0 z-[40] bg-white pt-24 px-6 md:hidden flex flex-col gap-6 items-center shadow-xl"
            >
                {navLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.id}
                        onClick={(e) => handleScroll(e, link.id)}
                        className="text-lg font-albert-black text-black tracking-widest py-2"
                    >
                        {link.name}
                    </a>
                ))}
                <a
                    href="#contact"
                    onClick={(e) => handleScroll(e, "#contact")}
                    className="text-lg font-albert-black text-[#D40411] tracking-widest py-2"
                >
                    联系 CONTACT
                </a>
            </motion.div>
        )}
    </AnimatePresence>
    </>
  );
};

export default Navbar;
