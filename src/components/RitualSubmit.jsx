import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { playSuccess, playError, playWhoosh } from '../utils/sounds';
import { Zap } from 'lucide-react';

export default function RitualSubmit({ onSubmit, disabled }) {
  const [isPressing, setIsPressing] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, charging, success, error
  const controls = useAnimation();

  const handlePointerDown = async () => {
    if (disabled || status === 'success') return;
    setIsPressing(true);
    setStatus('charging');
    playWhoosh();
    
    // Build tension animation
    await controls.start({ 
      scale: 0.9, 
      backgroundColor: "#8b5cf6", // Purple charging
      boxShadow: "0px 0px 40px #8b5cf6",
      transition: { duration: 1.5, ease: "easeIn" } 
    });
    
    // If we completed the animation and are still pressing, trigger submit
    // Note: Framer Motion's await completes when the animation finishes
    setIsPressing(prev => {
      if (prev) {
        triggerSubmit();
      }
      return prev;
    });
  };

  const handlePointerUp = () => {
    if (status === 'success' || disabled) return;
    setIsPressing(false);
    
    if (status === 'charging') {
      setStatus('idle');
      controls.start({ 
        scale: 1, 
        backgroundColor: "transparent",
        boxShadow: "6px 6px 0px #000",
        transition: { type: "spring", stiffness: 300, damping: 15 } 
      });
    }
  };

  const triggerSubmit = async () => {
    setIsPressing(false);
    
    // Impact frame
    await controls.start({ 
      scale: [0.9, 1.3, 1], 
      rotate: [0, -5, 5, 0], 
      backgroundColor: "#4ade80", 
      boxShadow: "10px 10px 0px #000",
      transition: { duration: 0.4 } 
    });
    
    const success = await onSubmit();
    
    if (success) {
      setStatus('success');
      playSuccess(); // The huge dopamine hit
    } else {
      setStatus('error');
      playError();
      controls.start({ 
        x: [-10, 10, -10, 10, 0], 
        backgroundColor: "#FF6B6B", 
        boxShadow: "6px 6px 0px #000",
        transition: { duration: 0.5 } 
      });
      setTimeout(() => {
        setStatus('idle');
        controls.start({ backgroundColor: "transparent" });
      }, 2000);
    }
  };

  return (
    <motion.button
      animate={controls}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      disabled={disabled}
      className={`relative w-full py-5 border-4 border-[#00ffcc] font-black uppercase text-2xl transition-colors shadow-[6px_6px_0px_#000] cursor-pointer select-none overflow-hidden
        ${disabled ? 'opacity-50 cursor-not-allowed border-gray-500 text-gray-500' : 'text-[#00ffcc] hover:bg-[#00ffcc]/10'}`}
      style={{ touchAction: 'none' }} // Prevent scrolling while holding on mobile
    >
      <div className="relative z-10 flex items-center justify-center gap-3 mix-blend-difference text-white">
        {status === 'idle' && <><Zap size={32} /> PULL TO SUBMIT</>}
        {status === 'charging' && "CHARGING CORE..."}
        {status === 'success' && "SYSTEM OVERRIDE SUCCESS"}
        {status === 'error' && "COMPILATION FAILED"}
      </div>

      {/* Charging overlay effect */}
      {status === 'charging' && (
        <motion.div 
          initial={{ bottom: '-100%' }}
          animate={{ bottom: '0%' }}
          transition={{ duration: 1.5, ease: "linear" }}
          className="absolute inset-0 bg-[#8b5cf6] z-0"
        />
      )}
    </motion.button>
  );
}
