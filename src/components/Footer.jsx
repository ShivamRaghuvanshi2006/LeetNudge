import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, MessageCircle } from 'lucide-react'
import { playClick, playHover } from '../utils/sounds'

const links = {
  Product: ['Features', 'Demo', 'Pricing', 'Changelog'],
  Resources: ['Docs', 'Blog', 'Discord', 'Status'],
  Company: ['About', 'Careers', 'Privacy', 'Terms'],
}

export default function Footer({ onShowToS }) {
  const handleLinkClick = (item) => {
    if (item === 'Terms' || item === 'Privacy') {
      if (onShowToS) onShowToS();
    }
  };

  return (
    <footer className="py-20 px-8 relative border-t-8 border-neo-black bg-white">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-6xl mx-auto mb-16">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 border-4 border-neo-black bg-neo-accent flex items-center justify-center font-black text-2xl text-white shadow-[4px_4px_0px_0px_#000]">L</div>
            <span className="font-black text-3xl uppercase tracking-tighter text-neo-black">LeetNudge</span>
          </div>
          <p className="font-bold text-lg text-neo-black max-w-sm mb-8">
            AI-powered hints for LeetCode. Learn faster. Think deeper. Get unstuck without shortcuts.
          </p>
          <div className="flex gap-4">
            {[
              { icon: Github, href: 'https://github.com/ShivamRaghuvanshi2006', label: 'GitHub', color: 'hover:bg-neo-secondary' },
              { icon: Linkedin, href: 'https://www.linkedin.com/in/shivam-raghuvanshi-366669381/', label: 'LinkedIn', color: 'hover:bg-neo-muted' },
              { icon: MessageCircle, href: 'https://discord.gg/mYmFcEeY3h', label: 'Discord', color: 'hover:bg-[#5865F2]' },
              { icon: Github, href: 'https://github.com/VEERAJ-mark27', label: 'VEERAJ-GitHub', color: 'hover:bg-neo-accent' },
            ].map(({ icon: Icon, href, label, color }) => (
              <a key={label} href={href} id={`footer-${label.toLowerCase()}`} aria-label={label} target="_blank" rel="noreferrer"
                onMouseEnter={playHover} onClick={playClick}
                className={`w-12 h-12 border-4 border-neo-black bg-neo-bg shadow-[4px_4px_0px_0px_var(--neo-shadow,#000)] flex items-center justify-center text-neo-black transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--neo-shadow,#000)] ${color}`}>
                <Icon size={24} strokeWidth={2.5} />
              </a>
            ))}
          </div>
        </div>

        {Object.entries(links).map(([col, items]) => (
          <div key={col}>
            <div className="font-black uppercase tracking-widest text-lg text-neo-black mb-6 pb-2 border-b-4 border-neo-black inline-block">{col}</div>
            <div className="flex flex-col gap-4">
              {items.map(item => (
                <a key={item} href="#"
                  onMouseEnter={playHover}
                  onClick={(e) => { playClick(); if (item === 'Terms' || item === 'Privacy') { e.preventDefault(); handleLinkClick(item); } }}
                  className="font-bold text-lg text-neo-black hover:text-white hover:bg-neo-black transition-colors px-2 py-1 w-fit border-2 border-transparent hover:border-neo-black inline-block"
                >{item}</a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t-8 border-neo-black flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="font-bold text-lg text-neo-black bg-neo-secondary px-4 py-2 border-4 border-neo-black shadow-[4px_4px_0px_0px_#000] -rotate-1">
          © 2025 LeetNudge. Built for competitive programmers.
        </div>
        <div className="flex items-center gap-3 bg-white border-4 border-neo-black px-4 py-2 shadow-[4px_4px_0px_0px_#000] rotate-1">
          <div className="w-3 h-3 rounded-full border-2 border-neo-black bg-[#4ade80] animate-pulse"></div>
          <span className="font-black tracking-widest text-sm uppercase text-neo-black">ALL SYSTEMS OPERATIONAL</span>
        </div>
      </div>
    </footer>
  )
}
