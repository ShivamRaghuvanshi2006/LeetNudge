import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const features = [
  {
    icon: '🧠',
    title: 'Smart Nudging System',
    desc: 'Context-aware hints that guide you to the right approach without spoiling the solution.',
    color: 'bg-neo-accent',
  },
  {
    icon: '⚙️',
    title: 'Code Analysis Engine',
    desc: 'Analyzes your code structure, time complexity, patterns, and identifies where you went wrong.',
    color: 'bg-[#4ade80]',
  },
  {
    icon: '📈',
    title: 'Personalized Learning',
    desc: 'Tracks your weak areas and builds a customized problem path to strengthen your skills.',
    color: 'bg-neo-secondary',
  },
  {
    icon: '🎯',
    title: 'Adaptive Difficulty',
    desc: 'Dynamically adjusts hint specificity based on how long you\'ve been stuck and your history.',
    color: 'bg-white',
  },
  {
    icon: '🏆',
    title: 'Streak & Progress',
    desc: 'Gamified learning with streaks, badges, and visual progress charts to keep you motivated.',
    color: 'bg-neo-muted',
  },
  {
    icon: '🔌',
    title: 'LeetCode Integration',
    desc: 'Works natively within LeetCode. No context switching — hints appear right where you code.',
    color: 'bg-[#FF8A8A]',
  },
]

export default function FeaturesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="features"
      ref={ref}
      className="py-24 px-4 bg-neo-muted relative z-10 border-t-8 border-neo-black overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-6"
        >
          <span className="inline-block bg-neo-black text-white font-black px-4 py-1 border-4 border-neo-black tracking-widest uppercase rotate-2">
            Capabilities
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-black text-[clamp(40px,6vw,72px)] text-center text-neo-black leading-[1.0] tracking-tighter mb-6 uppercase max-w-4xl mx-auto"
        >
          Everything you need to <span className="bg-[#4ade80] px-2 border-4 border-neo-black shadow-[4px_4px_0px_0px_#000] inline-block -rotate-1">level up</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-center text-neo-black font-bold text-xl md:text-2xl max-w-2xl mx-auto mb-16"
        >
          A complete AI system built to accelerate your coding interview preparation.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, desc, color, index, inView }) {
  const rotations = ['rotate-1', '-rotate-2', 'rotate-2', '-rotate-1', 'rotate-1', '-rotate-1']
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
      className={`border-4 border-neo-black ${color} p-8 shadow-[8px_8px_0px_0px_#000] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#000] transition-all duration-200 ${rotations[index]}`}
    >
      <div className="text-4xl mb-6 bg-white border-4 border-neo-black w-16 h-16 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
        {icon}
      </div>

      <h3 className="font-black text-2xl text-neo-black mb-3 uppercase leading-none">
        {title}
      </h3>

      <p className="font-bold text-lg text-neo-black leading-snug">
        {desc}
      </p>
    </motion.div>
  )
}
