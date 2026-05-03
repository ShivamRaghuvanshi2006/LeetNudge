import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ThreeDScene from './ThreeDScene'
import { playClick, playHover } from '../utils/sounds'

export default function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neo-bg pt-20"
    >
        {/* Animated Background Shapes */}
      <div className="absolute inset-0 z-[0] overflow-hidden pointer-events-none opacity-50 dark:opacity-20">
        <motion.div animate={{ rotate: 180 }} transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] border-[8px] border-neo-accent opacity-10" />
        <motion.div animate={{ rotate: -180 }} transition={{ duration: 150, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] border-[8px] border-[#8b5cf6] opacity-10 rounded-sm" />
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] right-[15%] w-16 h-16 bg-[#FFD93D] border-4 border-neo-black shadow-[4px_4px_0px_var(--neo-shadow,#000)] rotate-12 opacity-40" />
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[30%] left-[10%] w-12 h-12 bg-[#4ade80] border-4 border-neo-black shadow-[4px_4px_0px_var(--neo-shadow,#000)] -rotate-12 opacity-40" />
        <motion.div animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[60%] right-[8%] w-20 h-20 bg-[#C4B5FD] border-4 border-neo-black shadow-[4px_4px_0px_var(--neo-shadow,#000)] rotate-45 opacity-30" />
        {/* Floating code symbols */}
        {['{ }', '< />', '( )', '[ ]', '= =', '&&'].map((sym, i) => (
          <motion.div key={i}
            animate={{ y: [0, -10 - i * 2, 0], x: [0, (i % 2 ? 5 : -5), 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            className="absolute font-mono font-black text-2xl text-neo-black opacity-[0.05]"
            style={{ top: `${15 + i * 14}%`, left: `${5 + i * 16}%` }}>
            {sym}
          </motion.div>
        ))}
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-[1] mix-blend-multiply opacity-20 pointer-events-none">
        <ThreeDScene />
      </div>

      {/* Content */}
      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
        {/* Sticker Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center gap-2 px-4 py-2 border-4 border-neo-black bg-neo-secondary shadow-neo-sm mb-8 rotate-[-3deg] hover:rotate-0 transition-transform duration-200"
        >
          <span className="w-3 h-3 rounded-full bg-neo-accent border-2 border-neo-black animate-pulse" />
          <span className="font-black text-sm uppercase tracking-widest text-neo-black">AI-Powered · Beta</span>
        </motion.div>

        {/* Massive Title with glitch effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
          className="relative mb-6 group"
        >
          <h1 className="font-black text-[clamp(45px,11vw,140px)] leading-[0.85] tracking-tighter uppercase text-neo-black mb-2 relative z-10 text-stroke
            group-hover:animate-glitch transition-all">
            LeetNudge
          </h1>
          <h1 className="font-black text-[clamp(45px,11vw,140px)] leading-[0.85] tracking-tighter uppercase text-neo-accent absolute top-2 left-2 -z-10 select-none
            group-hover:translate-x-1 group-hover:translate-y-1 transition-transform">
            LeetNudge
          </h1>
          {/* Extra shadow layer for depth */}
          <h1 className="font-black text-[clamp(45px,11vw,140px)] leading-[0.85] tracking-tighter uppercase text-[#8b5cf6] absolute top-4 left-4 -z-20 select-none opacity-30">
            LeetNudge
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="font-bold text-xl md:text-3xl text-neo-black mb-12 max-w-3xl"
        >
          Don't just get the answers.<br/>
          <motion.span
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 1, -1, 0] }}
            transition={{ delay: 1, duration: 0.5, repeat: Infinity, repeatDelay: 4 }}
            className="bg-neo-accent text-white px-2 py-1 border-4 border-neo-black shadow-neo-sm inline-block mt-2"
          >
            GET UNSTUCK.
          </motion.span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto"
        >
          <NeoBtn href="#pricing" primary>Start Solving Fast</NeoBtn>
          <NeoBtn href="#solution">See How It Works</NeoBtn>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="w-8 h-14 border-4 border-neo-black bg-white shadow-[4px_4px_0px_#000] flex items-start justify-center pt-2">
          <div className="w-2 h-3 bg-neo-black" />
        </motion.div>
      </motion.div>
    </section>
  )
}

function NeoBtn({ href, primary, children }) {
  return (
    <a href={href}
      onMouseEnter={playHover}
      onClick={playClick}
      className={`relative inline-flex items-center justify-center gap-2 h-14 md:h-16 px-6 md:px-8 border-4 border-neo-black font-black text-base md:text-lg uppercase tracking-widest
        transition-all duration-100 cursor-pointer active:translate-x-[4px] active:translate-y-[4px] active:shadow-none whitespace-nowrap
        ${primary
          ? 'bg-neo-accent text-white shadow-[6px_6px_0px_0px_var(--neo-shadow,#000)] hover:bg-neo-secondary hover:text-neo-black'
          : 'bg-neo-bg text-neo-black shadow-[6px_6px_0px_0px_var(--neo-shadow,#FF6B6B)] hover:bg-neo-muted'
        }`}
    >
      {children}
      {primary && <span className="text-xl">→</span>}
    </a>
  )
}
