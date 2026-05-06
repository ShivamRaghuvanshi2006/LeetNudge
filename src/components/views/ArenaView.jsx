import { useState, useEffect } from 'react';
import { ArrowLeft, Swords, Bug, Zap, ListOrdered, FastForward, Navigation, ShieldAlert, Dices, Maximize, Smartphone } from 'lucide-react';
import { playClick, playWhoosh, startGameTrack, stopGameTrack } from '../../utils/sounds';

import GameView from './GameView'; // Existing Code Sus
import CodeMonBattle from '../games/CodeMonBattle';
import MiniGames from '../games/MiniGames';

export default function ArenaView({ currentUser, onBack }) {
  const [activeGame, setActiveGame] = useState(null); // 'sus', 'codemon', 'debug', 'output', 'step', 'speed', 'pattern'
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    startGameTrack();
    return () => stopGameTrack();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFullscreen = () => {
    playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const games = [
    { id: 'sus', name: 'Code Sus', desc: 'Social deduction multiplayer coding.', icon: ShieldAlert, color: '#EF4444' },
    { id: 'codemon', name: 'CodeMon Battle', desc: 'Turn-based algorithmic battles.', icon: Swords, color: '#8b5cf6' },
    { id: 'debug', name: 'Debug Rush', desc: 'Find syntax & logic bugs fast.', icon: Bug, color: '#FFD93D' },
    { id: 'output', name: 'Output Arena', desc: 'Mental dry-running code.', icon: Zap, color: '#4ade80' },
    { id: 'step', name: 'Step Builder', desc: 'Drag rules to build algorithms.', icon: ListOrdered, color: '#fb923c' },
    { id: 'speed', name: 'Speed Duel', desc: '1v1 First to solve correctly.', icon: FastForward, color: '#eab308' },
    { id: 'pattern', name: 'Pattern Hunt', desc: 'Identify algorithmic patterns.', icon: Navigation, color: '#3b82f6' },
  ];

  const handleSelect = (id) => {
    playWhoosh();
    setActiveGame(id);
  };

  const [isSpinning, setIsSpinning] = useState(false);

  const handleRandomSelect = () => {
    if (isSpinning) return;
    playClick();
    setIsSpinning(true);
    
    // Simulate spinning
    let spins = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      spins++;
      const randomGame = games[Math.floor(Math.random() * games.length)];
      if (spins >= maxSpins) {
        clearInterval(interval);
        setTimeout(() => {
          setIsSpinning(false);
          handleSelect(randomGame.id);
        }, 500);
      }
    }, 100);
  };

  if (activeGame === 'sus') return <GameView currentUser={currentUser} onExit={() => setActiveGame(null)} />;
  if (activeGame === 'codemon') return <CodeMonBattle currentUser={currentUser} onExit={() => setActiveGame(null)} />;
  if (['debug', 'output', 'step', 'speed', 'pattern'].includes(activeGame)) {
    return <MiniGames mode={activeGame} currentUser={currentUser} onExit={() => setActiveGame(null)} />;
  }

  return (
    <>
      {isPortrait && (
        <div className="fixed inset-0 bg-black/90 z-[9999] flex flex-col items-center justify-center text-white p-6 animate-fade-in text-center">
          <Smartphone size={64} className="animate-pulse mb-6 rotate-90 text-[#FFD93D]" />
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 shadow-neo-sm bg-[#EF4444] px-4 py-2 border-4 border-white">
            Rotate Your Phone
          </h2>
          <p className="font-bold text-lg max-w-xs">
            The Arena requires a landscape view for the best combat experience.
          </p>
        </div>
      )}

      <div className="crt-overlay"></div>
      <div className="flex-1 overflow-auto bg-black relative h-full text-white" style={{ backgroundImage: "linear-gradient(#111 2px, transparent 2px), linear-gradient(90deg, #111 2px, transparent 2px)", backgroundSize: "40px 40px" }}>
        <div className="p-4 md:p-8 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => { 
                if (document.fullscreenElement) document.exitFullscreen();
                onBack(); 
              }} 
              className="bg-[#FFD93D] text-black border-4 border-white px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_#fff] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Retreat
            </button>
            <button onClick={handleFullscreen} className="bg-white text-black border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_#8b5cf6] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2">
              <Maximize size={16} /> Fullscreen
            </button>
          </div>

          <div className="bg-[#EF4444] text-white border-4 border-white shadow-[10px_10px_0px_#FFD93D] p-6 md:p-8 mb-8 animate-shake-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter" style={{textShadow:"6px 6px 0px #000"}}>THE ARENA</h1>
              <p className="font-bold text-lg md:text-2xl mt-2 font-mono text-[#FFD93D]">&gt; INITIALIZING COMBAT PROTOCOLS...</p>
            </div>
            <button 
              onClick={handleRandomSelect}
              disabled={isSpinning}
              className={`w-full md:w-auto p-4 md:p-6 border-4 border-white font-black uppercase text-xl md:text-2xl transition-all shadow-[6px_6px_0px_#000] flex flex-col items-center gap-2
                ${isSpinning ? 'bg-[#FFD93D] text-black animate-spin-slow shadow-none scale-95' : 'bg-[#8b5cf6] text-white hover:-translate-y-2 hover:shadow-[10px_10px_0px_#fff]'}`}
            >
              <Dices size={40} />
              {isSpinning ? 'SPINNING...' : 'RANDOM CHALLENGE'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
            {games.map(g => (
              <div 
                key={g.id} 
                onClick={() => !isSpinning && handleSelect(g.id)}
                className={`bg-black border-4 border-white p-6 transition-all flex flex-col items-center text-center group relative overflow-hidden
                  ${isSpinning ? 'opacity-50 blur-sm scale-95' : 'shadow-[6px_6px_0px_#8b5cf6] hover:-translate-y-2 hover:shadow-[10px_10px_0px_#4ade80] hover:border-[#4ade80] cursor-pointer'}`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{backgroundColor: g.color}}></div>
                <div className="w-16 h-16 border-4 border-white flex items-center justify-center shadow-[4px_4px_0px_#fff] mb-4 bg-black group-hover:animate-bounce-in" style={{color: g.color}}>
                  <g.icon size={32} />
                </div>
                <h3 className="font-black uppercase text-xl mb-2" style={{color: g.color}}>{g.name}</h3>
                <p className="text-sm font-bold opacity-80 text-gray-300">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
