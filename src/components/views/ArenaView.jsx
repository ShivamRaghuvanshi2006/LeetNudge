import { useState, useEffect } from 'react';
import { ArrowLeft, Swords, Bug, Zap, ListOrdered, FastForward, Navigation, ShieldAlert } from 'lucide-react';
import { playClick, playWhoosh, startGameTrack, stopGameTrack } from '../../utils/sounds';

import GameView from './GameView'; // Existing Code Sus
import CodeMonBattle from '../games/CodeMonBattle';
import MiniGames from '../games/MiniGames';

export default function ArenaView({ currentUser, onBack }) {
  const [activeGame, setActiveGame] = useState(null); // 'sus', 'codemon', 'debug', 'output', 'step', 'speed', 'pattern'

  useEffect(() => {
    startGameTrack();
    return () => stopGameTrack();
  }, []);

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

  if (activeGame === 'sus') return <GameView currentUser={currentUser} onExit={() => setActiveGame(null)} />;
  if (activeGame === 'codemon') return <CodeMonBattle currentUser={currentUser} onExit={() => setActiveGame(null)} />;
  if (['debug', 'output', 'step', 'speed', 'pattern'].includes(activeGame)) {
    return <MiniGames mode={activeGame} currentUser={currentUser} onExit={() => setActiveGame(null)} />;
  }

  return (
    <>
      <div className="crt-overlay"></div>
      <div className="flex-1 overflow-auto bg-black relative h-full text-white" style={{ backgroundImage: "linear-gradient(#111 2px, transparent 2px), linear-gradient(90deg, #111 2px, transparent 2px)", backgroundSize: "40px 40px" }}>
        <div className="p-8 relative z-10">
          <button onClick={onBack} className="mb-6 bg-[#FFD93D] text-black border-4 border-white px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_#fff] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2">
            <ArrowLeft size={16} /> Retreat from Arena
          </button>

          <div className="bg-[#EF4444] text-white border-4 border-white shadow-[10px_10px_0px_#FFD93D] p-8 mb-8 animate-shake-subtle">
            <h1 className="text-6xl font-black uppercase tracking-tighter" style={{textShadow:"6px 6px 0px #000"}}>THE ARENA</h1>
            <p className="font-bold text-2xl mt-2 font-mono text-[#FFD93D]">> INITIALIZING COMBAT PROTOCOLS...</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map(g => (
              <div 
                key={g.id} 
                onClick={() => handleSelect(g.id)}
                className="bg-black border-4 border-white p-6 shadow-[6px_6px_0px_#8b5cf6] hover:-translate-y-2 hover:shadow-[10px_10px_0px_#4ade80] hover:border-[#4ade80] cursor-pointer transition-all flex flex-col items-center text-center group relative overflow-hidden"
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
