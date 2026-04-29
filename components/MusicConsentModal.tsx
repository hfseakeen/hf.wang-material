
import React from 'react';
import { motion } from 'framer-motion';

interface MusicConsentModalProps {
  onConfirm: () => void;
  onDecline: () => void;
}

const MusicConsentModal: React.FC<MusicConsentModalProps> = ({ onConfirm, onDecline }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="pointer-events-auto relative w-[320px] p-8 rounded-[2rem] bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl text-center overflow-hidden"
      >
        {/* Decorative Gradients */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-orange-500/30 rounded-full blur-2xl pointer-events-none" />
        
        <h3 className="relative z-10 text-2xl font-hanchanyuanyuan text-white mb-3">开启音乐？</h3>
        <p className="relative z-10 text-sm text-white/70 mb-8 font-opposans leading-relaxed">
          您是否想要开启背景音乐以获得更佳的浏览体验？
        </p>

        <div className="relative z-10 flex gap-4 justify-center">
            <button 
                onClick={onDecline}
                className="px-6 py-2.5 rounded-full border border-white/20 text-white/60 hover:bg-white/10 hover:text-white transition-all text-xs font-bold tracking-widest uppercase backdrop-blur-md"
            >
                暂不
            </button>
            <button 
                onClick={onConfirm}
                className="px-8 py-2.5 rounded-full bg-white text-black hover:scale-105 transition-transform text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
                好的
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MusicConsentModal;
