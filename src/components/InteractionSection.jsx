import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const CODE_LINES = [
  { text: 'def twoSum(nums, target):' },
  { text: '    for i in range(len(nums)):' },
  { text: '        for j in range(i+1, len(nums)):' },
  { text: '            if nums[i] + nums[j] == target:' },
  { text: '                return [i, j]' },
]

const HINTS = [
  'Wait! You\'re using O(n²) time. Use a HashMap to store seen values!',
  'For each number, check if (target - num) already exists in your map.',
  'Boom. This reduces time complexity to O(n) with O(n) space trade-off.',
]

export default function InteractionSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [hoveredLine, setHoveredLine] = useState(null)
  const [hintIndex, setHintIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const handleAskHint = () => {
    setShowHint(true)
    setHintIndex(h => (h + 1) % HINTS.length)
  }

  return (
    <section
      ref={ref}
      className="py-32 px-4 bg-neo-bg relative z-10 border-t-8 border-neo-black overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-6"
        >
          <span className="inline-block bg-white text-neo-black font-black px-4 py-1 border-4 border-neo-black shadow-[4px_4px_0px_0px_#000] tracking-widest uppercase rotate-2">
            Live Interaction
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-black text-[clamp(40px,6vw,72px)] text-center text-neo-black leading-[1.0] tracking-tighter mb-16 uppercase"
        >
          Hover. Interact.{' '}
          <span className="bg-neo-accent text-white px-2 border-4 border-neo-black shadow-[6px_6px_0px_0px_#000] inline-block -rotate-1">
            Get unstuck.
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          {/* Code Editor Mock */}
          <div className="bg-white border-4 border-neo-black shadow-[12px_12px_0px_0px_#000] -rotate-1 hover:rotate-0 transition-transform duration-200">
            {/* Editor header */}
            <div className="p-3 bg-neo-muted border-b-4 border-neo-black flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-neo-black bg-neo-accent" />
              <div className="w-4 h-4 rounded-full border-2 border-neo-black bg-neo-secondary" />
              <div className="w-4 h-4 rounded-full border-2 border-neo-black bg-[#4ade80]" />
              <span className="font-bold text-sm text-neo-black ml-2 uppercase tracking-wide">solution.py</span>
            </div>
            {/* Code lines */}
            <div className="p-6 font-mono font-bold text-sm md:text-base bg-[#FFFDF5]">
              {CODE_LINES.map((line, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredLine(i)}
                  onMouseLeave={() => setHoveredLine(null)}
                  className={`flex items-center gap-4 px-2 py-2 transition-colors border-l-4 ${hoveredLine === i ? 'bg-neo-secondary border-neo-black' : 'border-transparent'}`}
                >
                  <span className="text-neo-black opacity-40 select-none min-w-[20px] text-right font-black">{i + 1}</span>
                  <span className="text-neo-black whitespace-pre">{line.text}</span>
                </div>
              ))}

              <div className="mt-8">
                <button
                  onClick={handleAskHint}
                  className="w-full bg-neo-accent text-white font-black text-lg uppercase tracking-widest border-4 border-neo-black py-4 shadow-[6px_6px_0px_0px_#000] hover:bg-[#FF4D4D] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100"
                >
                  ✨ Ask for Hint
                </button>
              </div>
            </div>
          </div>

          {/* Hint panel */}
          <div className="flex flex-col gap-6 rotate-1">
            {/* AI badge */}
            <div className="bg-white border-4 border-neo-black shadow-[8px_8px_0px_0px_#000] p-8 hover:-translate-y-1 transition-transform">
              <div className="font-black text-xl uppercase text-neo-black mb-4 border-b-4 border-neo-black pb-2 inline-block bg-neo-secondary px-2">🤖 LeetNudge AI</div>
              {showHint ? (
                <motion.div
                  key={hintIndex}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-bold text-2xl leading-snug text-neo-black"
                >{HINTS[hintIndex]}</motion.div>
              ) : (
                <div className="font-bold text-2xl text-neo-black opacity-40">Click "Ask for Hint" to get a nudge...</div>
              )}
            </div>

            {/* Info cards */}
            {[
              { label: 'Current Complexity', val: 'O(n²)', bad: true },
              { label: 'Suggested Pattern', val: 'Hash Map', bad: false },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? '-1deg' : '1deg' }}
                className={`border-4 border-neo-black p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[6px_6px_0px_0px_#000] transition-all duration-100 ${item.bad ? 'bg-[#FF8A8A]' : 'bg-[#4ade80]'}`}
              >
                <div className="font-black uppercase tracking-widest text-sm border-2 border-neo-black bg-white px-2 py-1 shadow-[2px_2px_0px_0px_#000]">{item.label}</div>
                <div className={`font-black text-xl md:text-2xl text-neo-black bg-white border-4 border-neo-black px-4 py-2 shadow-[4px_4px_0px_0px_#000] ${item.bad ? 'rotate-2' : '-rotate-1'} text-center w-full sm:w-auto`}>{item.val}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
