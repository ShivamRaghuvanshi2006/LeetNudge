import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Zap, Shield, Sparkles, Check } from 'lucide-react';
import { playClick, playSuccess, playWhoosh } from '../utils/sounds';

const FREE_FEATURES = [
  "3 AI Hints per day",
  "Basic DSA Sheets",
  "2 Matchmaking games/day",
  "Basic profile",
];

const PRO_FEATURES = [
  "Unlimited AI Hints",
  "All DSA Sheets + Custom Protocols",
  "Unlimited Matchmaking",
  "Advanced Analytics Dashboard",
  "Priority Friend Requests",
  "Custom Profile Badges",
  "Ad-free Experience",
  "Early Feature Access",
];

export default function SubscriptionModal({ show, onClose, onSubscribe }) {
  if (!show) return null;

  const handleSubscribe = () => {
    playSuccess();
    onSubscribe();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -3 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="w-full max-w-[900px] bg-[#FFFDF5] border-8 border-black shadow-[20px_20px_0px_#8b5cf6] relative overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Close */}
          <button onClick={() => { playClick(); onClose(); }} className="absolute top-6 right-6 z-50 w-12 h-12 bg-black text-white flex items-center justify-center border-4 border-black hover:bg-[#FF6B6B] hover:rotate-90 transition-all font-black text-xl">
            <X size={24} />
          </button>

          {/* Header */}
          <div className="bg-[#8b5cf6] p-8 border-b-8 border-black relative overflow-hidden">
            <div className="absolute right-[-5%] top-[-50%] text-[200px] font-black opacity-10 rotate-12 pointer-events-none">PRO</div>
            <div className="flex items-center gap-4">
              <Crown size={40} className="text-[#FFD93D]" />
              <h2 className="text-4xl font-black uppercase text-white" style={{textShadow: "4px 4px 0px #000"}}>
                Upgrade to Pro
              </h2>
            </div>
            <p className="text-white font-bold text-lg mt-2 opacity-90">Unlock the full tactical arsenal</p>
          </div>

          {/* Content */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_#000] relative">
              <div className="absolute -top-4 left-4 bg-black text-white font-black px-4 py-1 uppercase text-sm tracking-wider">Current Plan</div>
              <h3 className="text-3xl font-black uppercase mt-4 mb-2">Free</h3>
              <div className="text-5xl font-black mb-6">₹0<span className="text-lg">/mo</span></div>
              <div className="space-y-3">
                {FREE_FEATURES.map(f => (
                  <div key={f} className="flex items-center gap-3 font-bold">
                    <Check size={18} className="text-[#4ade80] flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Plan */}
            <div className="border-4 border-black p-6 bg-[#FFD93D] shadow-[6px_6px_0px_#000] relative transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute -top-4 left-4 bg-[#8b5cf6] text-white font-black px-4 py-1 uppercase text-sm tracking-wider flex items-center gap-2">
                <Sparkles size={14} /> Recommended
              </div>
              <h3 className="text-3xl font-black uppercase mt-4 mb-2 flex items-center gap-2">
                <Crown size={28} className="text-[#8b5cf6]" /> Pro
              </h3>
              <div className="text-5xl font-black mb-1">
                ₹59<span className="text-lg">/mo</span>
              </div>
              <div className="text-sm font-bold opacity-70 mb-6">~$3 USD • Cancel anytime</div>
              <div className="space-y-3">
                {PRO_FEATURES.map(f => (
                  <div key={f} className="flex items-center gap-3 font-bold">
                    <Zap size={18} className="text-[#8b5cf6] flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSubscribe}
                className="w-full mt-8 py-5 bg-black text-white font-black text-xl uppercase tracking-widest border-4 border-black shadow-[6px_6px_0px_#8b5cf6] hover:-translate-y-1 hover:shadow-[10px_10px_0px_#8b5cf6] active:translate-y-1 active:shadow-none transition-all"
              >
                Subscribe Now →
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <p className="font-bold text-sm opacity-60">Secure payment · Instant activation · Cancel anytime</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
