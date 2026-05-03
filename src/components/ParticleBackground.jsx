import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
    let animId

    const SYMBOLS = ['{}', '<>', '//', '=>', '&&', '||', '[]', '()', '!=', '==', '++', '0']
    const COLORS = ['#FF6B6B', '#FFD93D', '#C4B5FD', '#4ade80', '#ffffff']

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 20 + 16,
      sym: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    function draw() {
      ctx.clearRect(0, 0, w, h)
      particles.forEach(p => {
        ctx.font = `900 ${p.size}px 'Space Grotesk', sans-serif`
        
        ctx.fillStyle = p.color
        ctx.fillText(p.sym, p.x, p.y)

        ctx.lineWidth = 2
        ctx.strokeStyle = '#000000'
        ctx.strokeText(p.sym, p.x, p.y)

        // Drop shadow feel
        ctx.fillStyle = '#000000'
        ctx.fillText(p.sym, p.x + 3, p.y + 3)
        // Redraw on top of drop shadow (hacky but works)
        ctx.fillStyle = p.color
        ctx.fillText(p.sym, p.x, p.y)
        ctx.strokeText(p.sym, p.x, p.y)

        p.x += p.vx
        p.y += p.vy
        
        // Bounce off edges with slight randomness
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
