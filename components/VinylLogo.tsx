
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 音乐播放列表配置 ---
// FIX: Using jsd.cdn.zzko.cn for China accessibility and speed
// Replaced all raw.githubusercontent.com links with CDN mirrors
const ORIGINAL_PLAYLIST = [
    {
        title: "Head in the clouds",
        url: "https://hf-1259323808.cos.ap-shanghai.myqcloud.com/music/01-head%20in%20the%20clouds.mp3" 
    },
    {
        title: "Un Amico", 
        url: "https://hf-1259323808.cos.ap-shanghai.myqcloud.com/music/02-un%20amico.mp3" 
    },
    {
        title: "Death bed",
        url: "https://hf-1259323808.cos.ap-shanghai.myqcloud.com/music/03-death%20bed.mp3"
    },
    {
        title: "Luv(sic.)pt3", 
        url: "https://hf-1259323808.cos.ap-shanghai.myqcloud.com/music/04-luv%28sic.%29pt3.mp3" 
    },
    {
        title: "Repeat until death", 
        url: "https://hf-1259323808.cos.ap-shanghai.myqcloud.com/music/05-repeat%20until%20death.mp3" 
    },
    {
        title: "The Void", 
        url: "https://hf-1259323808.cos.ap-shanghai.myqcloud.com/music/06-the%20void.mp3" 
    },
    {
        title: "Come Here", 
        url: "https://hf-1259323808.cos.ap-shanghai.myqcloud.com/music/07-come%20here.mp3" 
    },
    {
        title: "空とぶ宅急便", 
        url: "https://hf-1259323808.cos.ap-shanghai.myqcloud.com/music/08-kikis%20delivery%20service.mp3" 
    },
    {
        title: "你听得到——编曲", 
        url: "https://hf-1259323808.cos.ap-shanghai.myqcloud.com/music/09-you%20hear%20me.mp3" 
    },
];

const VinylLogo: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wasPlayingRef = useRef<boolean>(false);

  // 🟢 NEW: State to hold the shuffled playlist
  const [playlist, setPlaylist] = useState(ORIGINAL_PLAYLIST);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 🟢 1. RANDOM SHUFFLE ON MOUNT
  useEffect(() => {
      const shuffled = [...ORIGINAL_PLAYLIST];
      // Fisher-Yates Shuffle Algorithm
      for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setPlaylist(shuffled);
  }, []);

  // 🟢 2. LISTEN FOR ENABLE MUSIC EVENT (From Modal)
  useEffect(() => {
    const handleEnableMusic = () => {
        if (audioRef.current) {
            audioRef.current.volume = 0.4;
            audioRef.current.muted = false; // Ensure unmuted
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                      setIsPlaying(true);
                      setIsMuted(false);
                      wasPlayingRef.current = true;
                  })
                  .catch(e => console.log("Enable play failed", e));
            }
        }
    };

    window.addEventListener('enable-background-music', handleEnableMusic);
    return () => window.removeEventListener('enable-background-music', handleEnableMusic);
  }, []);

  // 🟢 NEW: 监听外部暂停/恢复事件 & 全局点击恢复
  useEffect(() => {
    // 暂停事件处理
    const handleExternalPause = () => {
      if (audioRef.current && !audioRef.current.paused) {
        wasPlayingRef.current = true;
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Don't reset wasPlayingRef if already paused, to avoid losing state
        // wasPlayingRef.current = false; 
      }
    };

    // 恢复事件处理
    const handleExternalResume = () => {
        if (wasPlayingRef.current && audioRef.current) {
            audioRef.current.play().catch(e => console.log("Resume failed", e));
            setIsPlaying(true);
        }
    };

    // 🟢 全局点击恢复逻辑：如果音乐是被暂时打断的，用户的下一个点击动作会尝试恢复播放
    const handleGlobalClickToResume = () => {
        if (wasPlayingRef.current && audioRef.current && audioRef.current.paused) {
            // 只有当不是静音且之前在播放时才恢复
            if (!isMuted) {
                audioRef.current.play().catch(e => console.log("Click resume failed", e));
                setIsPlaying(true);
                // Reset flag so we don't keep trying
                // wasPlayingRef.current = false; // Optional: keep true if we want consistent resume behavior
            }
        }
    };

    window.addEventListener('pause-background-music', handleExternalPause);
    window.addEventListener('resume-background-music', handleExternalResume);
    window.addEventListener('click', handleGlobalClickToResume); // Listen for any click
    
    return () => {
      window.removeEventListener('pause-background-music', handleExternalPause);
      window.removeEventListener('resume-background-music', handleExternalResume);
      window.removeEventListener('click', handleGlobalClickToResume);
    };
  }, [isMuted]); // Dependency on isMuted to prevent unmuting if user explicitly muted

  // 监听当前歌曲索引变化，实现切歌播放
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();

    if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Auto-play prevented on track change:", error);
            });
        }
    }
  }, [currentIndex, playlist]); // Added playlist dependency

  // 🟢 REMOVED AUTO-PLAY ON MOUNT
  // We now rely on 'enable-background-music' or user interaction.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4; // Just set volume, don't play
  }, []);

  const handleSongEnd = () => {
      handleNext();
  };

  const handleNext = () => {
      // Use the shuffled playlist length
      setCurrentIndex((prevIndex) => (prevIndex + 1) % playlist.length);
      setIsPlaying(true);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (audioRef.current) {
        audioRef.current.muted = !audioRef.current.muted;
        setIsMuted(audioRef.current.muted);
        
        if (audioRef.current.paused) {
             audioRef.current.play().catch(e => console.log("Toggle play error", e));
             setIsPlaying(true);
        }
    }
  };

  const handleDiscClick = () => {
    // 🟢 UPDATED: Removed window.scrollTo logic. Now strictly toggles music.
    
    if (audioRef.current) {
        if (audioRef.current.paused) {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
                setIsMuted(false);
                wasPlayingRef.current = true;
            });
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
            wasPlayingRef.current = false;
        }
    }
  };

  // Safe access
  const currentSong = playlist[currentIndex] || ORIGINAL_PLAYLIST[0];

  return (
    <div className="flex items-center gap-3">
        {/* 1. 黑胶唱片 */}
        <motion.div 
            className="relative flex flex-col items-center cursor-pointer group"
            onClick={handleDiscClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
            <audio 
                ref={audioRef} 
                src={currentSong.url} 
                preload="auto"
                onEnded={handleSongEnd}
            />
            
            {/* Vinyl Disc Visuals */}
            <motion.div
                key={`disc-${currentIndex}`}
                initial={{ scale: 0.8, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ 
                    scale: { duration: 0.5, type: "spring" },
                    rotate: { duration: 4, repeat: Infinity, ease: "linear" }
                }}
                style={{ 
                    animationPlayState: isPlaying ? "running" : "paused" 
                }}
                className="relative w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-lg border border-gray-800 z-20"
            >
                <div className="absolute inset-1 rounded-full border border-gray-700/50" />
                <div className="absolute inset-2 rounded-full border border-gray-700/50" />
                <div className="absolute inset-3 rounded-full border border-gray-700/50" />
                
                {/* Center Sticker */}
                <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center z-10 transition-colors duration-500"
                    style={{ 
                        backgroundColor: currentIndex % 2 === 0 ? '#F97316' : '#3B82F6' 
                    }}
                >
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
            </motion.div>
        </motion.div>

        {/* 2. 下一首按钮 */}
        <button 
            onClick={handleNext}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-black hover:bg-gray-100 transition-colors pointer-events-auto bg-white/50 backdrop-blur-sm z-10"
            title="Next Song"
        >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M5 4l10 8-10 8V4z" />
                <rect x="17" y="4" width="2" height="16" />
            </svg>
        </button>

        {/* 3. 歌名 */}
        <AnimatePresence>
            {isHovered && (
                <motion.div
                    initial={{ width: 0, opacity: 0, x: -10 }}
                    animate={{ width: "auto", opacity: 1, x: 0 }}
                    exit={{ width: 0, opacity: 0, x: -10 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} 
                    className="overflow-hidden flex items-center"
                >
                    <div className="whitespace-nowrap text-[10px] font-albert-black tracking-widest text-black mr-3">
                        {currentSong.title}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* 4. 静音按钮 */}
        <button 
            onClick={toggleMute}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-black hover:bg-gray-100 transition-colors pointer-events-auto bg-white/50 backdrop-blur-sm z-10"
            title={isMuted ? "Unmute" : "Mute"}
        >
            <AnimatePresence mode="wait">
                {isMuted ? (
                    <motion.svg 
                        key="mute"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                        <path d="M9 9v6a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0a7 7 0 0 1-7 7v0"></path>
                    </motion.svg>
                ) : (
                    <motion.svg 
                        key="sound"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                         <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                         <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </motion.svg>
                )}
            </AnimatePresence>
        </button>
    </div>
  );
};

export default VinylLogo;
