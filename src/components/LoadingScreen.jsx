import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [done, setDone] = useState(false);

  const phases = [
    'INITIALIZING SYSTEM...',
    'LOADING DSA PROTOCOLS...',
    'CONNECTING AI ENGINE...',
    'CALIBRATING NUDGE SYSTEM...',
    'SYSTEM READY'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.random() * 8 + 2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => { setDone(true); onDone(); }, 600);
          return 100;
        }
        setPhase(Math.min(Math.floor(next / 25), phases.length - 1));
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Animated grid background */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}>
            <motion.div animate={{ y: [-40, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-full h-[calc(100%+40px)]" style={{
              backgroundImage: 'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Floating particles */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div key={i}
              animate={{ y: [0, -20, 0], x: [0, i % 2 ? 10 : -10, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
              className="absolute w-2 h-2 bg-[#8b5cf6]"
              style={{ left: `${5 + i * 6.5}%`, top: `${20 + (i * 17) % 60}%` }}
            />
          ))}

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-[#8b5cf6] border-4 border-white shadow-[8px_8px_0px_#FF6B6B] flex items-center justify-center">
              <span className="text-white font-black text-5xl">L</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white font-black text-5xl uppercase tracking-tighter mb-2"
            style={{ textShadow: '4px 4px 0px #8b5cf6' }}
          >
            LeetNudge
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
            className="text-white font-bold text-sm uppercase tracking-[0.3em] mb-12"
          >
            Tactical DSA Intelligence
          </motion.p>

          {/* Progress Bar */}
          <div className="w-72 relative">
            <div className="h-6 border-4 border-white bg-black relative overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#8b5cf6] via-[#FF6B6B] to-[#FFD93D]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
              {/* Scanline effect */}
              <motion.div
                animate={{ x: [-10, 280] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 w-10 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[#8b5cf6] font-black text-xs uppercase tracking-widest">
                {phases[phase]}
              </span>
              <span className="text-white font-black text-xs">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Binary stream decorations */}
          <div className="absolute bottom-8 left-8 font-mono text-[#8b5cf6] opacity-20 text-xs leading-relaxed">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>{Array.from({ length: 30 }).map(() => Math.round(Math.random())).join('')}</div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
