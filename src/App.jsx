import { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'
import ParticleBackground from './components/ParticleBackground'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import DemoSection from './components/DemoSection'
import SolutionSection from './components/SolutionSection'
import PricingSection from './components/PricingSection'
import Footer from './components/Footer'
import TermsOfService from './components/TermsOfService'
import { playClick, playSuccess, playError, playWhoosh } from './utils/sounds'

const ADMIN_EMAIL = 'raghuvanshishivam2006@gmail.com'
const ADMIN_PASS = 'shivam06'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [inSystem, setInSystem] = useState(() => !!localStorage.getItem('leetnudge_user'))
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('leetnudge_user')); } catch { return null; }
  })

  useEffect(() => {
    const theme = localStorage.getItem('ln_theme') || 'default';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const [showLogin, setShowLogin] = useState(false)
  const [showToS, setShowToS] = useState(false)
  const [loginMode, setLoginMode] = useState('user') // 'user' or 'admin'
  const [loginName, setLoginName] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')

  const handleOpenLogin = () => {
    playWhoosh()
    setShowLogin(true)
    setLoginError('')
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginMode === 'admin') {
      if (loginEmail === ADMIN_EMAIL && loginPass === ADMIN_PASS) {
        playSuccess()
        const userData = { name: 'Admin', email: loginEmail, isAdmin: true }
        localStorage.setItem('leetnudge_user', JSON.stringify(userData))
        setUser(userData)
        setInSystem(true)
        setShowLogin(false)
      } else {
        playError()
        setLoginError('Invalid admin credentials')
      }
    } else {
      if (!loginName.trim()) { playError(); setLoginError('Enter a display name'); return; }
      playSuccess()
      const userData = { name: loginName.trim(), isAdmin: false }
      localStorage.setItem('leetnudge_user', JSON.stringify(userData))
      setUser(userData)
      setInSystem(true)
      setShowLogin(false)
    }
  }

  const handleLogout = () => {
    playClick()
    localStorage.removeItem('leetnudge_user')
    setInSystem(false)
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-neo-bg">
      <LoadingScreen onDone={() => setLoaded(true)} />
      <TermsOfService show={showToS} onClose={() => setShowToS(false)} />

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-4" onClick={() => setShowLogin(false)}>
          <div className="w-full max-w-[500px] bg-[#FFFDF5] border-8 border-black shadow-[20px_20px_0px_#8b5cf6] -rotate-1 hover:rotate-0 transition-transform" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-[#8b5cf6] p-6 border-b-8 border-black text-white relative overflow-hidden">
              <div className="absolute right-[-10%] top-[-50%] text-[200px] font-black opacity-10 rotate-12">LN</div>
              <h2 className="text-3xl font-black uppercase" style={{textShadow:"4px 4px 0px #000"}}>System Access</h2>
              <p className="font-bold opacity-80 mt-1">Authenticate to enter the protocol</p>
            </div>

            {/* Mode Toggle */}
            <div className="flex border-b-4 border-black">
              <button onClick={() => { setLoginMode('user'); setLoginError(''); playClick(); }}
                className={`flex-1 py-4 font-black uppercase text-lg border-r-4 border-black transition-colors ${loginMode==='user' ? 'bg-[#FFD93D]' : 'bg-white hover:bg-neo-bg'}`}>
                👤 User Login
              </button>
              <button onClick={() => { setLoginMode('admin'); setLoginError(''); playClick(); }}
                className={`flex-1 py-4 font-black uppercase text-lg transition-colors ${loginMode==='admin' ? 'bg-[#FF6B6B] text-white' : 'bg-white hover:bg-neo-bg'}`}>
                🛡️ Admin Login
              </button>
            </div>

            <form onSubmit={handleLogin} className="p-8 space-y-4">
              {loginMode === 'user' ? (
                <div>
                  <label className="font-black uppercase text-sm tracking-wider mb-2 block">Display Name</label>
                  <input value={loginName} onChange={e => setLoginName(e.target.value)} placeholder="Enter your name..."
                    className="w-full p-4 border-4 border-black font-bold text-lg focus:bg-neo-bg outline-none" autoFocus />
                </div>
              ) : (
                <>
                  <div>
                    <label className="font-black uppercase text-sm tracking-wider mb-2 block">Admin Email</label>
                    <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="admin@leetnudge.com"
                      className="w-full p-4 border-4 border-black font-bold focus:bg-neo-bg outline-none" autoFocus />
                  </div>
                  <div>
                    <label className="font-black uppercase text-sm tracking-wider mb-2 block">Password</label>
                    <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="••••••"
                      className="w-full p-4 border-4 border-black font-bold focus:bg-neo-bg outline-none" />
                  </div>
                </>
              )}

              {loginError && (
                <div className="bg-[#FF6B6B] border-4 border-black p-3 font-black uppercase text-white text-center shadow-[4px_4px_0px_#000]">
                  ⚠️ {loginError}
                </div>
              )}

              <button type="submit"
                className="w-full py-5 bg-[#4ade80] border-4 border-black font-black text-xl uppercase shadow-[6px_6px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] active:translate-y-1 active:shadow-none transition-all">
                {loginMode === 'admin' ? '🛡️ Authenticate' : '🚀 Enter System'}
              </button>
            </form>

            <button onClick={() => setShowLogin(false)}
              className="w-full py-3 border-t-4 border-black font-black uppercase bg-white hover:bg-neo-bg transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loaded && !inSystem && (
        <div key="landing">
          <Navbar onLogin={handleOpenLogin} />
          <div className="relative">
            <div className="fixed inset-0 z-0 pointer-events-none">
              <ParticleBackground />
            </div>
            <main className="relative z-10">
              <HeroSection />
              <FeaturesSection />
              <PricingSection onGetStarted={handleOpenLogin} />
              <DemoSection />
              <SolutionSection />
            </main>
          </div>
          <Footer onShowToS={() => setShowToS(true)} />
        </div>
      )}

      {loaded && inSystem && (
        <div key="sys" className="fixed inset-0 z-50 overflow-hidden">
          <Dashboard onLogout={handleLogout} user={user} />
        </div>
      )}
    </div>
  )
}
