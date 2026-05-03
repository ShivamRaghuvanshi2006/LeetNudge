import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, LayoutPanelLeft } from 'lucide-react'
import { playClick, playHover } from '../utils/sounds'

const navLinks = [
  { href: '#problem',  label: 'Problem'  },
  { href: '#solution', label: 'Solution' },
  { href: '#features', label: 'Features' },
  { href: '#demo',     label: 'Demo'     },
]

export default function Navbar({ onLogin }) {
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState('light') // 'light', 'dark', 'minimal'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    
    // Check initial mode
    if (document.documentElement.classList.contains('minimal')) setTheme('minimal');
    else if (document.documentElement.classList.contains('dark')) setTheme('dark');
    
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const selectTheme = (t) => {
    playClick();
    setTheme(t);
    document.documentElement.classList.remove('dark', 'minimal');
    if (t !== 'light') {
      document.documentElement.classList.add(t);
    }
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-[1000] px-4 md:px-10 py-4 flex items-center justify-between transition-colors duration-200 border-b-4 border-neo-black ${scrolled ? 'bg-neo-bg' : 'bg-neo-bg'}`}
    >
      {/* Logo */}
      <a 
        href="#hero" 
        className="flex items-center gap-3 group hover:-rotate-2 transition-transform duration-200"
      >
        <div className="w-10 h-10 bg-neo-accent border-4 border-neo-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center font-black text-white text-xl">
          L
        </div>
        <span className="font-black text-2xl tracking-tighter uppercase text-neo-black">
          LeetNudge
        </span>
      </a>

      {/* Desktop links */}
      <div className="hidden md:flex gap-6 items-center">
        {navLinks.map(link => (
          <a
            key={link.href}
            href={link.href}
            onMouseEnter={playHover}
            className="font-bold text-lg uppercase tracking-wide text-neo-black hover:bg-neo-secondary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--neo-shadow,#000)] border-2 border-transparent hover:border-neo-black px-3 py-1 transition-all duration-100"
          >{link.label}</a>
        ))}
        
        {/* Theme Selectors */}
        <div className="flex bg-neo-bg border-4 border-neo-black shadow-[4px_4px_0px_0px_var(--neo-shadow,#000)] p-1 gap-1 relative overflow-hidden">
          <button onClick={() => selectTheme('light')} onMouseEnter={playHover}
            className={`px-3 py-1 font-black uppercase text-xs transition-colors flex items-center gap-1 ${theme === 'light' ? 'bg-neo-black text-white' : 'hover:bg-neo-muted text-neo-black'}`}>
            <Sun size={14} /> Light
          </button>
          <button onClick={() => selectTheme('dark')} onMouseEnter={playHover}
            className={`px-3 py-1 font-black uppercase text-xs transition-colors flex items-center gap-1 ${theme === 'dark' ? 'bg-neo-black text-white' : 'hover:bg-neo-muted text-neo-black'}`}>
            <Moon size={14} /> Dark
          </button>
          <button onClick={() => selectTheme('minimal')} onMouseEnter={playHover}
            className={`px-3 py-1 font-black uppercase text-xs transition-colors flex items-center gap-1 ${theme === 'minimal' ? 'bg-neo-black text-white' : 'hover:bg-neo-muted text-neo-black'}`}>
            <LayoutPanelLeft size={14} /> Min
          </button>
        </div>

        <button
          onClick={onLogin}
          className="font-bold text-sm uppercase tracking-widest text-white bg-neo-black border-4 border-neo-black px-6 py-3 shadow-[6px_6px_0px_0px_#FFD93D] hover:bg-neo-accent active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all duration-100 rotate-1"
        >
          Get Started
        </button>
      </div>
    </motion.nav>
  )
}
