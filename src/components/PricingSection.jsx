import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Crown, Check, Zap, Sparkles } from 'lucide-react';

const FREE_FEATURES = [
  { text: "3 AI Hints per day", included: true },
  { text: "Basic DSA sheet access", included: true },
  { text: "2 Duels per day", included: true },
  { text: "Basic profile", included: true },
  { text: "Unlimited AI Hints", included: false },
  { text: "Custom DSA Protocols", included: false },
  { text: "Advanced Analytics", included: false },
  { text: "Priority Support", included: false },
];

const PRO_FEATURES = [
  { text: "Unlimited AI Hints", included: true },
  { text: "All DSA Sheets + Custom Protocols", included: true },
  { text: "Unlimited Matchmaking Duels", included: true },
  { text: "Advanced Analytics Dashboard", included: true },
  { text: "Custom Profile Badges", included: true },
  { text: "Priority Friend Requests", included: true },
  { text: "Ad-free Experience", included: true },
  { text: "Early Feature Access", included: true },
];

export default function PricingSection({ onGetStarted }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="pricing"
      ref={ref}
      className="py-24 px-4 bg-white relative z-10 border-t-8 border-neo-black overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-6"
        >
          <span className="inline-block bg-[#8b5cf6] text-white font-black px-4 py-1 border-4 border-neo-black shadow-[4px_4px_0px_0px_#000] tracking-widest uppercase rotate-1">
            Pricing
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-black text-[clamp(40px,6vw,72px)] text-center text-neo-black leading-[1.0] tracking-tighter mb-6 uppercase max-w-4xl mx-auto"
        >
          Level up for{' '}
          <span className="bg-[#FFD93D] px-2 border-4 border-neo-black shadow-[4px_4px_0px_0px_#000] inline-block -rotate-1">
            ₹59/mo
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-center text-neo-black font-bold text-xl md:text-2xl max-w-2xl mx-auto mb-16"
        >
          Choose the plan that matches your grind. Upgrade anytime.
        </motion.p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="border-4 border-neo-black bg-neo-bg p-8 shadow-[8px_8px_0px_0px_#000] rotate-1 hover:rotate-0 hover:-translate-y-2 transition-all duration-200"
          >
            <h3 className="text-3xl font-black uppercase mb-2">Free</h3>
            <div className="text-6xl font-black mb-1 text-neo-black">₹0</div>
            <div className="text-sm font-bold opacity-60 mb-8 uppercase tracking-widest">Forever · No card needed</div>
            <div className="space-y-4">
              {FREE_FEATURES.map(f => (
                <div key={f.text} className={`flex items-center gap-3 font-bold ${!f.included ? 'opacity-30 line-through' : ''}`}>
                  <div className={`w-6 h-6 border-2 border-black flex items-center justify-center ${f.included ? 'bg-[#4ade80]' : 'bg-gray-200'}`}>
                    {f.included && <Check size={14} strokeWidth={3} />}
                  </div>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
            <button
              onClick={onGetStarted}
              className="w-full mt-8 py-4 bg-white border-4 border-black font-black text-lg uppercase shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
            >
              Get Started Free
            </button>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="border-4 border-neo-black bg-[#FFD93D] p-8 shadow-[8px_8px_0px_0px_#8b5cf6] -rotate-1 hover:rotate-0 hover:-translate-y-2 transition-all duration-200 relative"
          >
            <div className="absolute -top-5 right-6 bg-[#8b5cf6] text-white font-black px-4 py-2 uppercase text-sm tracking-wider border-4 border-black shadow-[4px_4px_0px_#000] flex items-center gap-2 rotate-3">
              <Sparkles size={14} /> Popular
            </div>
            <h3 className="text-3xl font-black uppercase mb-2 flex items-center gap-2">
              <Crown size={28} className="text-[#8b5cf6]" /> Pro
            </h3>
            <div className="text-6xl font-black mb-1 text-neo-black">₹59</div>
            <div className="text-sm font-bold opacity-60 mb-8 uppercase tracking-widest">Per month · ~$3 USD</div>
            <div className="space-y-4">
              {PRO_FEATURES.map(f => (
                <div key={f.text} className="flex items-center gap-3 font-bold">
                  <div className="w-6 h-6 border-2 border-black bg-[#8b5cf6] text-white flex items-center justify-center">
                    <Zap size={14} strokeWidth={3} />
                  </div>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
            <button
              onClick={onGetStarted}
              className="w-full mt-8 py-4 bg-black text-white border-4 border-black font-black text-lg uppercase shadow-[4px_4px_0px_#8b5cf6] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#8b5cf6] active:translate-y-1 active:shadow-none transition-all"
            >
              Upgrade to Pro →
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
