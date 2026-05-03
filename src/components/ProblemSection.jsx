import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const struggles = [
  {
    emoji: '⏱️',
    title: 'Stuck for 30 mins',
    desc: 'You stare at the problem. Time ticks. Nothing clicks. Frustration builds up silently.',
    color: 'bg-neo-accent',
  },
  {
    emoji: '🧭',
    title: 'Wrong approach',
    desc: 'You code for an hour only to realize the entire strategy was wrong from the start.',
    color: 'bg-neo-secondary',
  },
  {
    emoji: '🔮',
    title: 'No idea how to optimize',
    desc: "Your O(n²) solution passes basic tests but fails on large inputs. You don't know why.",
    color: 'bg-white',
  },
]

export default function ProblemSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="problem"
      ref={ref}
      className="py-24 px-4 bg-neo-bg relative z-10 border-t-8 border-neo-black overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="inline-block bg-neo-black text-white font-black px-4 py-1 border-4 border-neo-black tracking-widest uppercase rotate-2">
            The Problem
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-black text-[clamp(40px,6vw,72px)] text-center text-neo-black leading-[1.0] tracking-tighter mb-6 uppercase max-w-4xl mx-auto"
        >
          LeetCode is <span className="bg-neo-accent text-white px-2 border-4 border-neo-black inline-block -rotate-2">brutally hard</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-neo-black font-bold text-xl md:text-2xl max-w-2xl mx-auto mb-16"
        >
          Most developers get stuck, give up, or peek at solutions — killing the learning that matters.
        </motion.p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {struggles.map((s, i) => (
            <StruggleCard key={s.title} {...s} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StruggleCard({ emoji, title, desc, color, index, inView }) {
  const rotation = index === 0 ? '-rotate-2' : index === 1 ? 'rotate-1' : '-rotate-1';
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      className={`border-4 border-neo-black ${color} p-8 shadow-[8px_8px_0px_0px_#000] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#000] transition-all duration-200 ${rotation}`}
    >
      <div className="text-5xl mb-6 bg-white border-4 border-neo-black w-20 h-20 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
        {emoji}
      </div>
      <h3 className="font-black text-2xl text-neo-black mb-4 uppercase leading-none">
        {title}
      </h3>
      <p className="font-bold text-lg text-neo-black leading-snug">
        {desc}
      </p>
    </motion.div>
  )
}
