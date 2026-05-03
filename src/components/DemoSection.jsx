import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const SAMPLE_HINTS = {
  'two sum': [
    '🔍 Think about what data structure lets you look up values in O(1) time.',
    '💡 For each number x, you need to find (target - x). A HashMap can store seen values.',
    '⚡ Iterate once: check if (target - nums[i]) is in your map, then add nums[i] to the map.',
  ],
  'binary search': [
    '🔍 The array is sorted — that\'s a major hint. Can you eliminate half the search space each step?',
    '💡 Compare mid element with target. If target < mid, search left half; else search right half.',
    '⚡ Use left=0, right=n-1. Loop while left<=right. Return -1 if not found.',
  ],
  'default': [
    '🔍 Break the problem into subproblems. What\'s the simplest case you can solve first?',
    '💡 Think about the data structure that best fits the access pattern of this problem.',
    '⚡ Consider time vs space trade-offs. A brute-force O(n²) can often be improved with extra memory.',
  ],
}

const PLACEHOLDER = 'Paste your LeetCode problem description here...\n\ne.g. "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."'

export default function DemoSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [input, setInput] = useState('')
  const [hints, setHints] = useState([])
  const [loading, setLoading] = useState(false)
  const [hintStep, setHintStep] = useState(0)

  const getHintSet = () => {
    const lower = input.toLowerCase()
    if (lower.includes('two sum') || lower.includes('target') || lower.includes('twosum')) return SAMPLE_HINTS['two sum']
    if (lower.includes('binary search') || lower.includes('sorted array')) return SAMPLE_HINTS['binary search']
    return SAMPLE_HINTS['default']
  }

  const handleGetHint = () => {
    if (!input.trim() || loading) return
    setLoading(true)
    setHints([])
    setHintStep(0)

    const hintSet = getHintSet()
    const currentStep = hintStep % hintSet.length

    setTimeout(() => {
      setHints([hintSet[currentStep]])
      setLoading(false)
      setHintStep(s => s + 1)
    }, 800)
  }

  const handleMoreHint = () => {
    const hintSet = getHintSet()
    const currentStep = hintStep % hintSet.length
    if (hints.length >= hintSet.length) return; // Prevent duplicates in simple demo
    setHints(prev => [...prev, hintSet[currentStep]])
    setHintStep(s => s + 1)
  }

  return (
    <section
      id="demo"
      ref={ref}
      className="py-32 px-4 bg-neo-bg relative z-10 border-t-8 border-neo-black overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-6"
        >
          <span className="inline-block bg-[#4ade80] text-neo-black font-black px-4 py-1 border-4 border-neo-black shadow-[4px_4px_0px_0px_#000] tracking-widest uppercase -rotate-2">
            Try It Live
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-black text-[clamp(40px,6vw,72px)] text-center text-neo-black leading-[1.0] tracking-tighter mb-6 uppercase max-w-4xl mx-auto"
        >
          Experience a nudge, <span className="bg-neo-secondary px-2 border-4 border-neo-black shadow-[4px_4px_0px_0px_#000] inline-block rotate-1">right now</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-center text-neo-black font-bold text-xl md:text-2xl max-w-2xl mx-auto mb-16"
        >
          Paste any LeetCode problem and watch LeetNudge guide you — without giving the solution.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          {/* Input box */}
          <div className="bg-white border-4 border-neo-black shadow-[12px_12px_0px_0px_#000] mb-8 rotate-1">
            {/* Header */}
            <div className="p-3 bg-neo-muted border-b-4 border-neo-black flex items-center gap-2">
              <span className="text-xl">📋</span>
              <span className="font-bold text-sm text-neo-black uppercase tracking-wide">Paste your problem</span>
            </div>

            <textarea
              id="problem-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={PLACEHOLDER}
              className="w-full min-h-[200px] bg-[#FFFDF5] border-none outline-none resize-none font-bold text-lg md:text-xl text-neo-black p-6 md:p-8 placeholder-neo-black placeholder-opacity-40"
            />
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              id="get-hint-btn"
              onClick={handleGetHint}
              disabled={!input.trim() || loading}
              className={`
                flex items-center justify-center gap-2 
                h-16 px-10 border-4 border-neo-black font-black text-lg uppercase tracking-widest
                transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed
                ${input.trim() && !loading 
                  ? 'bg-neo-accent text-white shadow-[6px_6px_0px_0px_#000] hover:bg-neo-secondary hover:text-neo-black active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer' 
                  : 'bg-gray-200 text-gray-500 shadow-none'
                }
              `}
            >
              {loading ? (
                <>
                  <SpinnerDot /> Analyzing...
                </>
              ) : '✨ Get Hint'}
            </button>

            {hints.length > 0 && hints.length < getHintSet().length && (
              <button
                id="more-hint-btn"
                onClick={handleMoreHint}
                className="h-16 px-10 bg-white text-neo-black font-black text-lg uppercase tracking-widest border-4 border-neo-black shadow-[6px_6px_0px_0px_#FFD93D] hover:bg-neo-secondary active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 cursor-pointer"
              >
                More Hints →
              </button>
            )}
          </div>

          {/* Hint output */}
          <AnimatePresence>
            {hints.map((hint, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-white border-4 border-neo-black p-6 md:p-8 mb-4 shadow-[8px_8px_0px_0px_#000] flex items-start gap-4 ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
              >
                <div className="min-w-[40px] h-10 rounded-full border-4 border-neo-black bg-neo-accent flex items-center justify-center font-black text-white text-lg flex-shrink-0">
                  {i + 1}
                </div>
                <div className="font-bold text-xl text-neo-black leading-relaxed">
                  {hint}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {hints.length === 0 && !loading && (
            <div className="text-center font-bold text-neo-black opacity-50 mt-8">
              Try: "Given nums = [2,7,11,15] and target = 9, find two indices that add up to target"
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function SpinnerDot() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      className="w-5 h-5 border-4 border-neo-black border-t-white rounded-full bg-transparent"
    />
  )
}
