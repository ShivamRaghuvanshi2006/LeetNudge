import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Check, X } from 'lucide-react';
import { playClick, playSuccess, playError, playWhoosh } from '../../utils/sounds';
import { addXp } from '../../utils/progressionStore';
import RitualSubmit from '../RitualSubmit';

export default function MiniGames({ mode, currentUser, onExit }) {
  const [phase, setPhase] = useState('lobby'); 
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const timerRef = useRef(null);

  const start = () => {
    setPhase('ready');
    setScore(0);
    playWhoosh();
    
    // "Ready... GO!" phase
    setTimeout(() => {
        setPhase('playing');
        setTime(30);
        timerRef.current = setInterval(() => {
          setTime(t => {
            if(t <= 1) { clearInterval(timerRef.current); setPhase('end'); return 0; }
            return t - 1;
          });
        }, 1000);
    }, 2000);
  };

  const end = () => {
    clearInterval(timerRef.current);
    if (score > 0) {
      addXp(score * 10);
      playSuccess();
    }
    setPhase('end');
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const renderGame = () => {
     switch(mode) {
       case 'debug': return <DebugRush score={score} setScore={setScore} playSuccess={playSuccess} playError={playError} />;
       case 'output': return <OutputArena score={score} setScore={setScore} playSuccess={playSuccess} playError={playError} />;
       case 'step': return <StepBuilder score={score} setScore={setScore} playSuccess={playSuccess} playError={playError} end={end} />;
       case 'speed': return <SpeedSolve score={score} setScore={setScore} playSuccess={playSuccess} playError={playError} end={end} />;
       case 'pattern': return <PatternHunt score={score} setScore={setScore} playSuccess={playSuccess} playError={playError} />;
       default: return <div>Unknown mode</div>;
     }
  };

  const titles = {
    debug: "Debug Rush", output: "Output Arena", step: "Step Builder", speed: "Speed Solve Duel", pattern: "Pattern Hunt"
  };

  return (
    <div className="flex flex-col h-full bg-[#FFFDF5] p-8 border-4 border-black">
      <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
         <button onClick={() => { playClick(); onExit(); }} className="bg-white text-black font-black uppercase px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] flex items-center gap-2"><ArrowLeft size={16}/> Retreat</button>
         <h1 className="text-3xl font-black uppercase tracking-tight">{titles[mode]}</h1>
         <div className="font-black text-xl flex items-center gap-2"><Clock /> {time}s</div>
      </div>

      {phase === 'lobby' && (
         <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-xl font-bold uppercase mb-8">Score as many points as you can in 30 seconds!</p>
            <button onClick={start} className="bg-[#4ade80] text-black border-4 border-black text-2xl font-black px-8 py-4 uppercase shadow-[8px_8px_0px_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0px_#000] transition-all">Start Minigame</button>
         </div>
      )}

      {phase === 'ready' && (
         <div className="flex-1 flex flex-col items-center justify-center relative">
             <div className="absolute animate-bounce-in text-8xl font-black uppercase text-[#EF4444]" style={{textShadow:"8px 8px 0px #000"}}>READY...</div>
             <div className="absolute animate-combat-text text-9xl font-black uppercase text-[#4ade80]" style={{textShadow:"8px 8px 0px #000", animationDelay: "1s"}}>GO!</div>
         </div>
      )}

      {phase === 'playing' && (
         <div className="flex-1 flex flex-col relative animate-fade-in">
            <div className="absolute top-0 right-0 bg-[#FFD93D] px-6 py-2 border-4 border-black font-black text-xl shadow-[4px_4px_0px_#000]">SCORE: {score}</div>
            <div className="mt-16 flex-1">
               {renderGame()}
            </div>
         </div>
      )}

      {phase === 'end' && (
         <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl font-black uppercase mb-4">Time's Up!</h1>
            <p className="text-3xl font-black uppercase tracking-wider mb-2 text-[#8b5cf6]">Final Score: {score}</p>
            <p className="font-bold opacity-60 mb-8">+ {score * 10} XP</p>
            <button onClick={() => { playClick(); onExit(); }} className="bg-[#FFD93D] border-4 border-black text-xl font-black px-8 py-4 uppercase shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-transform">Back to Arena</button>
         </div>
      )}
    </div>
  );
}


// --- Mini Game Implementations ---

function DebugRush({ score, setScore, playSuccess, playError }) {
  const problems = [
     { code: "function add(a, b) {\n  return a + c;\n}", line: 2, fix: "b" },
     { code: "let arr = [1, 2, 3];\nfor(let i=0; i<=arr.length; i++) {\n  console.log(arr[i]);\n}", line: 2, fix: "<" }
  ];
  const [idx, setIdx] = useState(0);
  const [inp, setInp] = useState('');

  const submit = () => {
     if(inp.includes(problems[idx].fix)) { playSuccess(); setScore(s=>s+1); setIdx((idx+1)%problems.length); setInp(''); }
     else { playError(); setInp(''); }
  };

  return (
    <div className="flex flex-col items-center">
       <div className="bg-[#1e1e2e] text-[#4ade80] font-mono text-lg p-6 border-4 border-black whitespace-pre-wrap w-[500px]">
         {problems[idx].code}
       </div>
       <p className="font-bold mt-4">Bug is on line {problems[idx].line}. What should the fix involve?</p>
       <div className="flex gap-4 mt-4">
         <input className="border-4 border-black p-2 font-mono" value={inp} onChange={e=>setInp(e.target.value)} placeholder="Type fix..." />
         <button onClick={submit} className="bg-black text-white font-black uppercase px-6 py-2 shadow-[4px_4px_0px_#FFD93D]">Fix</button>
       </div>
    </div>
  );
}

function OutputArena({ score, setScore, playSuccess, playError }) {
  const problems = [
     { code: "console.log(typeof null);", res: "object" },
     { code: "console.log(1 + '1' - 1);", res: "10" }
  ];
  const [idx, setIdx] = useState(0);
  const [inp, setInp] = useState('');
  const submit = () => {
    if(inp.trim().toLowerCase() === problems[idx].res) { playSuccess(); setScore(s=>s+1); setIdx((idx+1)%problems.length); setInp('');}
    else { playError(); setInp(''); }
  }
  return <DebugRush score={score} setScore={setScore} playSuccess={playSuccess} playError={playError} /> // Simplified reuse for prototype
}

function StepBuilder({ score, setScore, playSuccess, playError, end }) {
  // A drag-and-drop or select prototype
  return <div className="text-center font-bold">Step Builder mechanics coming soon (Drag blocks in order).<br/><button onClick={end} className="mt-4 px-4 py-2 border-2 border-black bg-[#FFD93D] font-black uppercase">Finish</button></div>
}

function SpeedSolve({ score, setScore, playSuccess, playError, end }) {
  const [code, setCode] = useState("function reverseArray(arr) {\n  // your code here\n}");
  const [botProgress, setBotProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBotProgress(p => Math.min(100, p + Math.random() * 5));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const submitCode = async () => {
    // Simulate compilation delay for the ritual submit
    await new Promise(r => setTimeout(r, 1000));
    
    // Naive validation
    if (code.includes("reverse") || code.includes("for") || code.includes("while") || code.length > 50) {
      setScore(s => s + 5);
      return true;
    }
    return false;
  };

  return (
    <div className="flex flex-col items-center w-[600px] max-w-full mx-auto">
      <div className="flex justify-between w-full mb-2 px-1">
        <div className="font-black uppercase">You</div>
        <div className="font-black uppercase text-[#EF4444]">Bot</div>
      </div>
      
      {/* Progress Bars */}
      <div className="flex w-full gap-8 mb-6">
        <div className="flex-1 h-6 bg-white border-4 border-black relative">
           <div className="absolute top-0 bottom-0 left-0 bg-[#4ade80] transition-all duration-300" style={{width: `${Math.min(100, score * 20)}%`}}></div>
        </div>
        <div className="flex-1 h-6 bg-white border-4 border-black relative">
           <div className="absolute top-0 bottom-0 left-0 bg-[#EF4444] transition-all duration-300" style={{width: `${botProgress}%`}}></div>
        </div>
      </div>

      <div className="bg-[#1e1e2e] text-[#4ade80] font-mono text-lg p-6 border-4 border-black w-full mb-6">
        <textarea 
          className="w-full h-32 bg-transparent text-[#4ade80] outline-none resize-none font-mono"
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck="false"
        />
      </div>

      <RitualSubmit onSubmit={submitCode} />
      
      <button onClick={end} className="mt-8 px-4 py-2 border-2 border-black bg-gray-200 font-black uppercase hover:-translate-y-1 shadow-[4px_4px_0px_#000] active:translate-y-0 active:shadow-none transition-all">Forfeit Duel</button>
    </div>
  );
}

function PatternHunt({ score, setScore, playSuccess, playError }) {
  const problems = [
     { desc: "Given an array and target, find continuous subarray that sums to target.", opts: ['DP', 'Sliding Window', 'Two Pointer'], ans: 'Sliding Window' },
     { desc: "Find the shortest path in an unweighted grid.", opts: ['DFS', 'BFS', 'Dijkstra'], ans: 'BFS' }
  ];
  const [idx, setIdx] = useState(0);

  const guess = (opt) => {
     if(opt === problems[idx].ans) { playSuccess(); setScore(s=>s+1); setIdx((idx+1)%problems.length); }
     else { playError(); }
  };

  return (
    <div className="flex flex-col items-center">
       <div className="bg-white border-4 border-black p-6 w-[500px] text-center font-bold shadow-[4px_4px_0px_#000] text-lg">
         {problems[idx].desc}
       </div>
       <div className="flex gap-4 mt-8">
         {problems[idx].opts.map(o => (
           <button key={o} onClick={() => guess(o)} className="bg-[#8b5cf6] text-white border-4 border-black px-6 py-4 font-black uppercase text-sm shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-transform">{o}</button>
         ))}
       </div>
    </div>
  );
}
