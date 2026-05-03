import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const steps = [
  {
    num: '01',
    icon: '🔍',
    title: 'Detects Struggle',
    desc: 'LeetNudge monitors your coding session and identifies when you\'ve been stuck on a pattern or edge case for too long.',
    color: 'bg-neo-secondary',
  },
  {
    num: '02',
    icon: '💡',
    title: 'Gives Smart Hints',
    desc: 'Instead of revealing the answer, it nudges you with targeted hints — pointing to the exact concept or pattern you\'re missing.',
    color: 'bg-white',
  },
  {
    num: '03',
    icon: '🎯',
    title: 'Adapts to Your Level',
    desc: 'Hints get progressively more specific based on how stuck you are. Beginners get more guidance; experts get subtle nudges.',
    color: 'bg-neo-accent',
  },
]

export default function SolutionSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="solution"
      ref={ref}
      className="py-24 px-4 bg-neo-muted relative z-10 border-t-8 border-neo-black overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-6"
        >
          <span className="inline-block bg-neo-black text-white font-black px-4 py-1 border-4 border-neo-black tracking-widest uppercase -rotate-1">
            The Solution
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-black text-[clamp(40px,6vw,72px)] text-center text-neo-black leading-[1.0] tracking-tighter mb-6 uppercase"
        >
          Hint-first AI that <span className="bg-neo-secondary px-2 border-4 border-neo-black inline-block rotate-1 shadow-[4px_4px_0px_0px_#000]">teaches, not solves</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-center text-neo-black font-bold text-xl md:text-2xl max-w-2xl mx-auto mb-20"
        >
          A three-step AI process that respects your effort and maximizes your growth.
        </motion.p>

        {/* Flow steps */}
        <div className="flex flex-col gap-12">
          {steps.map((step, i) => (
            <FlowStep key={step.num} {...step} index={i} inView={inView} isLast={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FlowStep({ num, icon, title, desc, color, index, inView, isLast }) {
  const alignRight = index % 2 !== 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: alignRight ? 50 : -50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
      className={`flex items-stretch gap-4 md:gap-8 ${alignRight ? 'md:flex-row-reverse' : ''} flex-col md:flex-row`}
    >
      <div className="hidden md:flex flex-col items-center">
        <div className={`w-20 h-20 rounded-full border-4 border-neo-black ${color} flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_#000] z-10`}>
          {icon}
        </div>
        {!isLast && (
          <div className="w-2 h-full bg-neo-black my-2"></div>
        )}
      </div>

      <div className={`flex-1 ${color} border-4 border-neo-black p-6 md:p-10 shadow-[8px_8px_0px_0px_#000] ${alignRight ? 'md:rotate-1' : 'md:-rotate-1'} hover:rotate-0 hover:-translate-y-2 transition-all duration-200`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="md:hidden w-12 h-12 rounded-full border-4 border-neo-black bg-white flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_#000]">
            {icon}
          </div>
          <div className="font-black text-sm uppercase tracking-widest border-2 border-neo-black inline-block px-2 py-1 bg-white">
            STEP {num}
          </div>
        </div>
        <h3 className="font-black text-2xl md:text-4xl text-neo-black mb-4 uppercase leading-none">
          {title}
        </h3>
        <p className="font-bold text-lg md:text-xl text-neo-black leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  )
}
