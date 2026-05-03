import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Swords, Heart, Activity } from 'lucide-react';
import { playClick, playSuccess, playError, playWhoosh, playHeavyHit, playVictoryChime } from '../../utils/sounds';
import { addXp } from '../../utils/progressionStore';

export default function CodeMonBattle({ currentUser, onExit }) {
  const [phase, setPhase] = useState('lobby'); // lobby, battle, end
  const [hp, setHp] = useState({ player: 100, enemy: 100 });
  const [time, setTime] = useState(20);
  const [result, setResult] = useState(null);
  
  const [enemyAttackCd, setEnemyAttackCd] = useState(5);
  const [combatText, setCombatText] = useState([]);
  const [shakeTarget, setShakeTarget] = useState(null); // 'player' | 'enemy' | null
  
  const attackProblems = [
    { title: "Find Max", code: "const max = arr => Math.max(...arr);\n// Provide O(n) loop instead", fix: "let m=-Infinity; for(let x of arr) if(x>m) m=x; return m;", dmg: 20 },
    { title: "Reverse Array", code: "arr.reverse()", fix: "for(let i=0;i<arr.length/2;i++) { let t=arr[i]; arr[i]=arr[arr.length-1-i]; arr[arr.length-1-i]=t; }", dmg: 30 }
  ];

  const [currentProblem, setCurrentProblem] = useState(0);
  const [inputCode, setInputCode] = useState('');

  const timerRef = useRef(null);

  const startBattle = () => {
    setPhase('battle');
    setHp({ player: 100, enemy: 100 });
    setTime(45); // 45 seconds to defeat
    setEnemyAttackCd(5);
    playWhoosh();

    timerRef.current = setInterval(() => {
      setTime(t => {
        if (t <= 1) { clearInterval(timerRef.current); finish(false); return 0; }
        return t - 1;
      });
      setEnemyAttackCd(c => {
         if (c <= 1) {
            // Enemy attacks
            setHp(h => {
              const nh = h.player - 15;
              if (nh <= 0) { clearInterval(timerRef.current); finish(false); }
              return { ...h, player: Math.max(0, nh) };
            });
            playError();
            playHeavyHit();
            setShakeTarget('player');
            setTimeout(() => setShakeTarget(null), 400);

            // Enemy hit combat text
            setCombatText(prev => [...prev, { id: Date.now(), msg: "-15 HP", color: "#EF4444", target: "player" }]);

            return 5 + Math.floor(Math.random() * 3);
         }
         return c - 1;
      });
    }, 1000);
  };

  const finish = (won) => {
    clearInterval(timerRef.current);
    setResult(won);
    setPhase('end');
    if (won) { playVictoryChime(); addXp(50); } else { playError(); }
  };

  const handleAttack = () => {
    playClick();
    const prob = attackProblems[currentProblem];
    // extremely crude check for minigame prototype
    if (inputCode.length > 10 && !inputCode.includes('reverse') && !inputCode.includes('Math.max')) {
       // Successful attack
       const damage = prob.dmg + (time > 30 ? 10 : 0); // time complexity bonus proxy
       playHeavyHit();
       setShakeTarget('enemy');
       setTimeout(() => setShakeTarget(null), 400);
       setCombatText(prev => [...prev, { id: Date.now(), msg: `-${damage} HP!`, color: "#4ade80", target: "enemy" }]);

       setHp(h => {
          const nh = h.enemy - damage;
          if(nh <= 0) { clearInterval(timerRef.current); finish(true); }
          return { ...h, enemy: Math.max(0, nh) };
       });
       setCurrentProblem((currentProblem + 1) % attackProblems.length);
       setInputCode('');
    } else {
       // Missed
       playError();
       setCombatText(prev => [...prev, { id: Date.now(), msg: "MISS!", color: "#EF4444", target: "enemy" }]);
       setInputCode('');
    }
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div className="flex flex-col h-full bg-[#111] text-white p-8">
      <div className="flex justify-between items-center mb-8 border-b-4 border-white pb-4">
         <button onClick={() => { playClick(); onExit(); }} className="bg-white text-black font-black uppercase px-4 py-2 shadow-[4px_4px_0px_#EF4444] flex items-center gap-2"><ArrowLeft size={16}/> Retreat</button>
         <h1 className="text-3xl font-black uppercase text-[#8b5cf6]" style={{textShadow:"2px 2px 0px #fff"}}>CodeMon Battle</h1>
         <div className="w-24 text-right font-black uppercase"><Activity className="inline" /> VS AI</div>
      </div>

      {phase === 'lobby' && (
        <div className="flex-1 flex flex-col items-center justify-center">
            <Swords size={64} className="text-[#FFD93D] mb-6" />
            <p className="text-xl font-bold uppercase tracking-wider mb-8">Optimize to deal massive damage!</p>
            <button onClick={startBattle} className="bg-[#EF4444] text-white border-4 border-white text-2xl font-black px-8 py-4 uppercase shadow-[8px_8px_0px_#fff] hover:-translate-y-1 transition-transform">Battle Start</button>
        </div>
      )}

      {phase === 'battle' && (
        <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-8 relative">
                
                {/* Floating Combat Text Renderer */}
                {combatText.map(ct => (
                   <div key={ct.id} className="absolute animate-combat-text font-black text-4xl" style={{
                      color: ct.color, textShadow: "4px 4px 0px #000",
                      left: ct.target === 'player' ? '100px' : 'auto',
                      right: ct.target === 'enemy' ? '100px' : 'auto',
                      top: '100px'
                   }}>{ct.msg}</div>
                ))}

                {/* Player Health & Sprite */}
                <div className={`flex flex-col gap-4 ${shakeTarget === 'player' ? 'animate-shake-hard animate-flash' : ''}`}>
                  <div className="bg-[#FFD93D] text-black border-4 border-white p-4 w-[300px]">
                      <h2 className="font-black uppercase mb-2">{currentUser?.name || "Player"} (Algorithm)</h2>
                      <div className="w-full h-6 bg-black border-2 border-white mb-1"><div className="h-full bg-[#4ade80]" style={{width: `${hp.player}%`}}></div></div>
                      <div className="flex justify-between text-xs font-black"><Heart size={12} className="text-red-500"/> {hp.player} / 100</div>
                  </div>
                  <div className="h-48 w-48 border-4 border-white bg-neo-bg p-2 shadow-[8px_8px_0px_#4ade80]">
                      <img src="/assets/codemon_player.png" alt="Player Sprite" className="w-full h-full object-contain drop-shadow-[5px_5px_0px_#4ade80] animate-bounce-slow" />
                  </div>
                </div>

                <div className="text-6xl font-black text-center">
                   <div className={time < 10 ? "text-[#EF4444] animate-pulse-slow font-mono text-8xl" : "text-white"}>{time}s</div>
                   <div className="text-sm font-bold opacity-60 mt-2">UNTIL SYSTEM FAILURE</div>
                </div>

                {/* Enemy Health & Sprite */}
                <div className={`flex flex-col items-end gap-4 ${shakeTarget === 'enemy' ? 'animate-shake-hard animate-flash' : ''}`}>
                  <div className="bg-[#8b5cf6] text-white border-4 border-white p-4 w-[300px]">
                      <h2 className="font-black uppercase mb-2">Wild NullPtr</h2>
                      <div className="w-full h-6 bg-black border-2 border-white mb-1"><div className="h-full bg-[#EF4444]" style={{width: `${hp.enemy}%`}}></div></div>
                      <div className="flex justify-between text-xs font-black"><Heart size={12} className="text-red-500"/> {hp.enemy} / 100</div>
                  </div>
                  <div className="h-48 w-48 border-4 border-white bg-black p-2 shadow-[-8px_8px_0px_#EF4444]">
                      <img src="/assets/codemon_enemy.png" alt="Enemy Sprite" className="w-full h-full object-contain drop-shadow-[5px_5px_0px_#EF4444] animate-float" />
                  </div>
                </div>
            </div>

            <div className="flex-1 bg-black border-4 border-white p-6 flex flex-col">
                <div className="text-xl font-black uppercase mb-4 text-[#FFD93D]">Attack Prompt: {attackProblems[currentProblem].title}</div>
                <div className="bg-gray-900 border-2 border-gray-700 p-4 font-mono text-sm mb-4 whitespace-pre-wrap text-blue-300">
                    {attackProblems[currentProblem].code}
                </div>
                <textarea 
                  className="flex-1 bg-[#1e1e2e] text-[#4ade80] font-mono p-4 outline-none border-2 border-[#8b5cf6]"
                  placeholder="Write optimized logic here to attack..."
                  value={inputCode} onChange={e => setInputCode(e.target.value)}
                  autoFocus
                />
                <button onClick={handleAttack} className="mt-4 bg-[#FFD93D] text-black font-black uppercase py-4 border-4 border-white shadow-[4px_4px_0px_#fff]">Execute Attack</button>
            </div>
        </div>
      )}

      {phase === 'end' && (
         <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl font-black uppercase mb-4" style={{color: result ? '#4ade80' : '#EF4444'}}>{result ? 'Victory!' : 'Defeat!'}</h1>
            <p className="text-xl font-bold uppercase tracking-wider mb-8">{result ? 'You gained 50 XP!' : 'NullPtr fainted your algorithm.'}</p>
            <button onClick={() => { playClick(); onExit(); }} className="bg-white text-black border-4 border-white text-xl font-black px-8 py-4 uppercase shadow-[6px_6px_0px_#8b5cf6] hover:-translate-y-1 transition-transform">Return to Arena</button>
         </div>
      )}
    </div>
  );
}
