/* ═══════════════════════════════════════════════════════════════════
   CODE SUS — Full game view
   Social-deduction multiplayer game inside LeetNudge.
   ═══════════════════════════════════════════════════════════════════ */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Timer, Bug, Users, Send, AlertTriangle, SkipForward,
  Play, Swords, Shield, Eye, EyeOff, Trophy, Skull,
  ArrowLeft, Zap, Clock, ChevronRight, RefreshCw,
  Gamepad2, UserPlus, Globe, X, Vote, MessageCircle
} from 'lucide-react';
import { playClick, playSuccess, playError, playNotification, playWhoosh } from '../../utils/sounds';
import { CODE_TASKS, PLAYER_COLORS, BOT_NAMES, KEYWORDS, pickTasks, getOptions, shuffle } from '../../data/codeTasks';

// ─── Constants ────────────────────────────────────────────────────
const MATCH_DURATION    = 300;   // 5 min
const DISCUSSION_TIME   = 30;
const VOTING_TIME       = 20;
const REVEAL_TIME       = 5;
const MATCHMAKING_TIME  = 10;
const MAX_PLAYERS       = 4;
const IMPOSTOR_COOLDOWN = 20;
const TASK_COUNT        = 4;

// ─── SVG Crewmate Icon ───────────────────────────────────────────
function CrewmateIcon({ color = '#EF4444', size = 40, visor = '#B3D9FF', dead = false, className = '' }) {
  const s = size;
  return (
    <svg viewBox="0 0 40 52" width={s} height={s * 1.3} className={className} style={{ opacity: dead ? 0.4 : 1 }}>
      {/* Body */}
      <ellipse cx="20" cy="30" rx="14" ry="17" fill={color} stroke="#000" strokeWidth="2.5" />
      {/* Visor */}
      <ellipse cx="25" cy="24" rx="9" ry="8" fill={visor} stroke="#000" strokeWidth="2" />
      <ellipse cx="27" cy="22" rx="3" ry="2.5" fill="#fff" opacity="0.6" />
      {/* Left leg */}
      <rect x="7" y="40" width="11" height="10" rx="4" fill={color} stroke="#000" strokeWidth="2" />
      {/* Right leg */}
      <rect x="22" y="40" width="11" height="10" rx="4" fill={color} stroke="#000" strokeWidth="2" />
      {/* Backpack */}
      <rect x="1" y="22" width="7" height="14" rx="3" fill={color} stroke="#000" strokeWidth="2" />
      {dead && <text x="20" y="35" textAnchor="middle" fontSize="20" fill="#000">✕</text>}
    </svg>
  );
}

// ─── Syntax-highlight a code line ────────────────────────────────
function HighlightLine({ text }) {
  const parts = text.split(/(\b(?:function|const|let|var|return|if|else|for|while|class|new|this|true|false|null|def|int|void|static|public|private|break|continue|Math)\b|"[^"]*"|'[^']*'|\d+)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (!part) return null;
        if (KEYWORDS.includes(part)) return <span key={i} className="text-[#c678dd] font-bold">{part}</span>;
        if (/^["']/.test(part)) return <span key={i} className="text-[#98c379]">{part}</span>;
        if (/^\d+$/.test(part)) return <span key={i} className="text-[#d19a66]">{part}</span>;
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

// ─── Format mm:ss ────────────────────────────────────────────────
function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// ═══════════════════════════════════════════════════════════════════
//  PHASE: LOBBY
// ═══════════════════════════════════════════════════════════════════
function LobbyPhase({ onQuickMatch, onHostGame, playerName }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full gap-8 select-none">
      {/* Title */}
      <div className="relative">
        <h1 className="text-[80px] font-black uppercase leading-none tracking-tighter" style={{ textShadow: '6px 6px 0px #000', color: '#FFD93D' }}>
          CODE <span style={{ color: '#EF4444' }}>SUS</span>
        </h1>
        <p className="text-center text-white font-black uppercase tracking-widest text-lg bg-black px-4 py-1 mt-2"
           style={{ boxShadow: '4px 4px 0px #8b5cf6' }}>
          Find the Impostor. Fix the Code.
        </p>
      </div>

      {/* Crewmate parade */}
      <div className="flex gap-3 my-4">
        {PLAYER_COLORS.slice(0, 6).map((c, i) => (
          <motion.div key={i} animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}>
            <CrewmateIcon color={c.bg} size={44} visor={c.visor} />
          </motion.div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4 w-[380px]">
        <button onClick={() => { playWhoosh(); onQuickMatch(); }}
          className="w-full py-5 bg-[#4ade80] border-4 border-black font-black text-xl uppercase shadow-[6px_6px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3">
          <Globe size={24} /> Quick Match
        </button>
        <button onClick={() => { playWhoosh(); onHostGame(); }}
          className="w-full py-5 bg-[#8b5cf6] text-white border-4 border-black font-black text-xl uppercase shadow-[6px_6px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3">
          <UserPlus size={24} /> Host Game
        </button>
      </div>

      <p className="text-sm font-bold opacity-60 uppercase tracking-wider mt-4">Playing as: <span className="text-[#FFD93D]">{playerName}</span></p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  PHASE: MATCHMAKING
// ═══════════════════════════════════════════════════════════════════
function MatchmakingPhase({ players, countdown, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full gap-8 select-none">
      <h2 className="text-4xl font-black uppercase" style={{ textShadow: '4px 4px 0px #000', color: '#FFD93D' }}>
        Finding Players...
      </h2>

      <div className="flex gap-6">
        {Array.from({ length: MAX_PLAYERS }).map((_, i) => {
          const p = players[i];
          return (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.15 }}
              className={`w-28 h-36 border-4 border-black shadow-[4px_4px_0px_#000] flex flex-col items-center justify-center gap-2 ${p ? 'bg-white' : 'bg-black/20'}`}>
              {p ? (
                <>
                  <CrewmateIcon color={p.color.bg} size={40} visor={p.color.visor} />
                  <span className="font-black text-xs uppercase truncate w-full text-center px-1">{p.name}</span>
                  {p.isBot && <span className="text-[10px] bg-[#8b5cf6] text-white px-2 font-bold uppercase">BOT</span>}
                </>
              ) : (
                <div className="animate-pulse text-4xl">?</div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <Clock size={20} />
        <span className="font-black text-2xl">{countdown}s</span>
        <span className="font-bold opacity-60 uppercase text-sm">— Bots fill empty slots</span>
      </div>

      <button onClick={onCancel}
        className="px-8 py-3 bg-[#FF6B6B] text-white border-4 border-black font-black uppercase shadow-[4px_4px_0px_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all">
        Cancel
      </button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  PHASE: ROLE REVEAL
// ═══════════════════════════════════════════════════════════════════
function RoleRevealPhase({ role, color }) {
  const isImp = role === 'impostor';
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full gap-6 select-none">
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }}
        className={`p-12 border-8 border-black shadow-[12px_12px_0px_#000] ${isImp ? 'bg-[#EF4444]' : 'bg-[#4ade80]'}`}>
        <CrewmateIcon color={color.bg} size={100} visor={color.visor} />
      </motion.div>
      <motion.h1 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
        className="text-6xl font-black uppercase" style={{ textShadow: '5px 5px 0px #000', color: isImp ? '#EF4444' : '#4ade80' }}>
        {isImp ? '👾 IMPOSTOR' : '🛡️ CREWMATE'}
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="text-xl font-black uppercase tracking-wider bg-black text-white px-6 py-2">
        {isImp ? 'Sabotage the code. Don\'t get caught.' : 'Fix the bugs. Find the impostor.'}
      </motion.p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  PHASE: GAME OVER
// ═══════════════════════════════════════════════════════════════════
function GameOverPhase({ winner, players, myId, onPlayAgain }) {
  const myPlayer = players.find(p => p.id === myId);
  const iWon = (winner === 'crewmates' && myPlayer?.role === 'crewmate') ||
               (winner === 'impostor' && myPlayer?.role === 'impostor');
  const impostor = players.find(p => p.role === 'impostor');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full gap-6 select-none">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
        className={`text-center p-10 border-8 border-black shadow-[12px_12px_0px_#000] ${iWon ? 'bg-[#4ade80]' : 'bg-[#EF4444]'}`}>
        <h1 className="text-6xl font-black uppercase mb-4" style={{ textShadow: '5px 5px 0px #000' }}>
          {iWon ? '🏆 VICTORY!' : '💀 DEFEAT!'}
        </h1>
        <p className="text-2xl font-black uppercase">
          {winner === 'crewmates' ? 'Crewmates fixed all bugs!' : 'Impostor sabotaged the mission!'}
        </p>
      </motion.div>

      {/* All roles revealed */}
      <div className="flex gap-4 mt-4">
        {players.map(p => (
          <div key={p.id} className={`p-4 border-4 border-black shadow-[4px_4px_0px_#000] bg-white text-center ${p.role === 'impostor' ? 'ring-4 ring-red-500' : ''}`}>
            <CrewmateIcon color={p.color.bg} size={36} visor={p.color.visor} dead={!p.alive} />
            <p className="font-black text-sm mt-2">{p.name}</p>
            <span className={`text-xs font-black uppercase px-2 py-0.5 ${p.role === 'impostor' ? 'bg-[#EF4444] text-white' : 'bg-[#4ade80]'}`}>
              {p.role}
            </span>
          </div>
        ))}
      </div>

      <button onClick={() => { playClick(); onPlayAgain(); }}
        className="mt-6 px-10 py-4 bg-[#FFD93D] border-4 border-black font-black text-xl uppercase shadow-[6px_6px_0px_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-3">
        <RefreshCw size={24} /> Play Again
      </button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MAIN GAME VIEW EXPORT
// ═══════════════════════════════════════════════════════════════════
export default function GameView({ currentUser }) {
  const playerName = currentUser?.name || 'Player';

  // ─── Top-level state ───────────────────────────────────────────
  const [phase, setPhase]             = useState('lobby');      // lobby | matchmaking | roleReveal | coding | discussion | voting | gameOver
  const [players, setPlayers]         = useState([]);
  const [myId, setMyId]               = useState(null);
  const [tasks, setTasks]             = useState([]);
  const [timer, setTimer]             = useState(0);
  const [messages, setMessages]       = useState([]);
  const [votes, setVotes]             = useState({});
  const [matchCountdown, setMatchCD]  = useState(MATCHMAKING_TIME);
  const [winner, setWinner]           = useState(null);
  const [sabCooldown, setSabCooldown] = useState(0);

  // Refs for intervals
  const timerRef     = useRef(null);
  const botRef       = useRef(null);
  const matchRef     = useRef(null);
  const sabRef       = useRef(null);
  const msgInputRef  = useRef(null);

  // ─── Derived state ────────────────────────────────────────────
  const myPlayer   = players.find(p => p.id === myId);
  const isImpostor = myPlayer?.role === 'impostor';
  const bugsTotal  = tasks.reduce((s, t) => s + t.bugs.length, 0);
  const bugsFixed  = tasks.reduce((s, t) => s + t.bugs.filter(b => b.fixed && !b.sabotaged).length, 0);
  const alivePlayers = players.filter(p => p.alive);

  // ─── Cleanup helper ───────────────────────────────────────────
  const clearAllIntervals = useCallback(() => {
    [timerRef, botRef, matchRef, sabRef].forEach(r => { if (r.current) clearInterval(r.current); r.current = null; });
  }, []);

  useEffect(() => () => clearAllIntervals(), [clearAllIntervals]);

  // ═══════════════════════════════════════════════════════════════
  //  MATCHMAKING LOGIC
  // ═══════════════════════════════════════════════════════════════
  const startMatchmaking = useCallback(() => {
    setPhase('matchmaking');
    const myColor = PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
    const me = { id: 'me', name: playerName, color: myColor, role: null, isBot: false, alive: true, currentLine: null, idle: true };
    setMyId('me');
    setPlayers([me]);
    setMatchCD(MATCHMAKING_TIME);

    let cd = MATCHMAKING_TIME;
    let currentPlayers = [me];
    const usedColors = [myColor.name];
    const usedNames  = [playerName];

    matchRef.current = setInterval(() => {
      cd--;
      setMatchCD(cd);

      // Random chance to add a bot player
      if (currentPlayers.length < MAX_PLAYERS && (Math.random() < 0.4 || cd <= 3)) {
        const availColors = PLAYER_COLORS.filter(c => !usedColors.includes(c.name));
        const availNames  = BOT_NAMES.filter(n => !usedNames.includes(n));
        if (availColors.length && availNames.length) {
          const botColor = availColors[Math.floor(Math.random() * availColors.length)];
          const botName  = availNames[Math.floor(Math.random() * availNames.length)];
          usedColors.push(botColor.name);
          usedNames.push(botName);
          const bot = { id: `bot_${Date.now()}_${Math.random()}`, name: botName, color: botColor, role: null, isBot: true, alive: true, currentLine: null, idle: true };
          currentPlayers = [...currentPlayers, bot];
          setPlayers([...currentPlayers]);
          playNotification();
        }
      }

      // Fill remaining with bots at 0
      if (cd <= 0) {
        clearInterval(matchRef.current);
        while (currentPlayers.length < MAX_PLAYERS) {
          const availColors = PLAYER_COLORS.filter(c => !usedColors.includes(c.name));
          const availNames  = BOT_NAMES.filter(n => !usedNames.includes(n));
          const botColor = availColors[0] || PLAYER_COLORS[0];
          const botName  = availNames[0] || 'Bot';
          usedColors.push(botColor.name);
          usedNames.push(botName);
          currentPlayers.push({ id: `bot_${Date.now()}_${Math.random()}`, name: botName, color: botColor, role: null, isBot: true, alive: true, currentLine: null, idle: true });
        }
        setPlayers([...currentPlayers]);

        // Assign roles
        const impIdx = Math.floor(Math.random() * currentPlayers.length);
        const withRoles = currentPlayers.map((p, i) => ({ ...p, role: i === impIdx ? 'impostor' : 'crewmate' }));
        setPlayers(withRoles);

        // Go to role reveal
        setTimeout(() => {
          setPhase('roleReveal');
          playWhoosh();
          setTimeout(() => {
            startCodingPhase(withRoles);
          }, REVEAL_TIME * 1000);
        }, 500);
      }
    }, 1000);
  }, [playerName, clearAllIntervals]);

  // ═══════════════════════════════════════════════════════════════
  //  CODING PHASE LOGIC
  // ═══════════════════════════════════════════════════════════════
  const startCodingPhase = useCallback((gamePlayers) => {
    const newTasks = pickTasks(TASK_COUNT);
    setTasks(newTasks);
    setTimer(MATCH_DURATION);
    setPhase('coding');
    setMessages([]);
    setVotes({});
    setSabCooldown(0);

    // Main timer
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearAllIntervals();
          // Time's up — impostor wins
          setWinner('impostor');
          setPhase('gameOver');
          playError();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Bot AI loop
    botRef.current = setInterval(() => {
      setPlayers(prev => {
        return prev.map(p => {
          if (!p.isBot || !p.alive) return p;
          // Random activity simulation
          const randomLine = Math.floor(Math.random() * 25) + 1;
          return { ...p, currentLine: Math.random() < 0.3 ? null : randomLine, idle: Math.random() < 0.2 };
        });
      });

      // Crewmate bots try to fix bugs
      setTasks(prev => {
        const updated = prev.map(t => ({ ...t, bugs: t.bugs.map(b => ({ ...b })) }));
        // Find unfixed bugs
        const unfixed = [];
        updated.forEach((t, ti) => t.bugs.forEach((b, bi) => { if (!b.fixed) unfixed.push({ ti, bi }); }));
        if (unfixed.length > 0 && Math.random() < 0.15) {
          const pick = unfixed[Math.floor(Math.random() * unfixed.length)];
          updated[pick.ti].bugs[pick.bi].fixed = true;
          updated[pick.ti].bugs[pick.bi].sabotaged = false;
        }
        return updated;
      });
    }, 3000);

    // Impostor bot AI (if impostor is a bot)
    const impBot = gamePlayers.find(p => p.role === 'impostor' && p.isBot);
    if (impBot) {
      sabRef.current = setInterval(() => {
        setTasks(prev => {
          const updated = prev.map(t => ({ ...t, bugs: t.bugs.map(b => ({ ...b })) }));
          const fixed = [];
          updated.forEach((t, ti) => t.bugs.forEach((b, bi) => { if (b.fixed && !b.sabotaged) fixed.push({ ti, bi }); }));
          if (fixed.length > 0 && Math.random() < 0.3) {
            const pick = fixed[Math.floor(Math.random() * fixed.length)];
            updated[pick.ti].bugs[pick.bi].sabotaged = true;
            updated[pick.ti].bugs[pick.bi].fixed = false;
          }
          return updated;
        });
      }, IMPOSTOR_COOLDOWN * 1000);
    }
  }, [clearAllIntervals]);

  // ─── Check win condition on tasks change ──────────────────────
  useEffect(() => {
    if (phase !== 'coding') return;
    const totalBugs = tasks.reduce((s, t) => s + t.bugs.length, 0);
    const fixedBugs = tasks.reduce((s, t) => s + t.bugs.filter(b => b.fixed && !b.sabotaged).length, 0);
    if (totalBugs > 0 && fixedBugs >= totalBugs) {
      clearAllIntervals();
      setWinner('crewmates');
      setPhase('gameOver');
      playSuccess();
    }
  }, [tasks, phase, clearAllIntervals]);

  // ═══════════════════════════════════════════════════════════════
  //  PLAYER ACTIONS
  // ═══════════════════════════════════════════════════════════════
  const handleFixBug = (taskIdx, bugIdx, chosenCode) => {
    setTasks(prev => {
      const updated = prev.map(t => ({ ...t, bugs: t.bugs.map(b => ({ ...b })) }));
      const bug = updated[taskIdx].bugs[bugIdx];
      if (chosenCode === bug.fix) {
        bug.fixed = true;
        bug.sabotaged = false;
        playSuccess();
      } else {
        playError();
      }
      return updated;
    });
    // Update player activity
    setPlayers(prev => prev.map(p => p.id === myId ? { ...p, idle: false, currentLine: tasks[taskIdx]?.bugs[bugIdx]?.lineNum || null } : p));
  };

  const handleSabotage = (taskIdx, bugIdx) => {
    if (sabCooldown > 0) return;
    setTasks(prev => {
      const updated = prev.map(t => ({ ...t, bugs: t.bugs.map(b => ({ ...b })) }));
      updated[taskIdx].bugs[bugIdx].fixed = false;
      updated[taskIdx].bugs[bugIdx].sabotaged = true;
      return updated;
    });
    setSabCooldown(IMPOSTOR_COOLDOWN);
    playClick();
  };

  // Sabotage cooldown timer
  useEffect(() => {
    if (sabCooldown <= 0) return;
    const id = setInterval(() => setSabCooldown(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(id);
  }, [sabCooldown]);

  // ─── Call Meeting ─────────────────────────────────────────────
  const callMeeting = () => {
    if (phase !== 'coding') return;
    clearInterval(timerRef.current);
    clearInterval(botRef.current);
    clearInterval(sabRef.current);
    setPhase('discussion');
    setTimer(DISCUSSION_TIME);
    setMessages(prev => [...prev, { sender: '⚠️ SYSTEM', text: `${myPlayer?.name} called an emergency meeting!`, system: true }]);
    playNotification();

    // Bot auto-messages during discussion
    setTimeout(() => {
      const botMsgs = [
        "I was fixing bugs the whole time!",
        "I saw someone near the code...",
        "That's kinda sus ngl",
        "I just finished a task, check my activity",
        "Who called this meeting?",
        "I think it's the quiet one",
        "I was on line 4, anyone else?",
        "Skip? I don't have enough info",
      ];
      const bots = players.filter(p => p.isBot && p.alive);
      bots.forEach((bot, i) => {
        setTimeout(() => {
          setMessages(prev => [...prev, { sender: bot.name, text: botMsgs[Math.floor(Math.random() * botMsgs.length)], color: bot.color.bg }]);
        }, 2000 + i * 3000 + Math.random() * 2000);
      });
    }, 1000);

    // Discussion timer
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          startVoting();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ─── Voting Phase ─────────────────────────────────────────────
  const startVoting = () => {
    setPhase('voting');
    setTimer(VOTING_TIME);
    setVotes({});
    playWhoosh();

    // Bots auto-vote
    const alive = players.filter(p => p.alive);
    const bots = alive.filter(p => p.isBot);
    bots.forEach((bot, i) => {
      setTimeout(() => {
        setVotes(prev => {
          const targets = alive.filter(p => p.id !== bot.id);
          const target = Math.random() < 0.25 ? 'skip' : targets[Math.floor(Math.random() * targets.length)]?.id || 'skip';
          return { ...prev, [bot.id]: target };
        });
      }, 3000 + i * 2000 + Math.random() * 3000);
    });

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          resolveVotes();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVote = (targetId) => {
    setVotes(prev => ({ ...prev, [myId]: targetId }));
    playClick();
  };

  const resolveVotes = useCallback(() => {
    // Tally votes
    const tally = {};
    Object.values(votes).forEach(v => { tally[v] = (tally[v] || 0) + 1; });

    let maxVotes = 0;
    let eliminated = null;
    let tie = false;
    Object.entries(tally).forEach(([id, count]) => {
      if (id === 'skip') return;
      if (count > maxVotes) { maxVotes = count; eliminated = id; tie = false; }
      else if (count === maxVotes) { tie = true; }
    });
    const skipCount = tally['skip'] || 0;
    if (tie || skipCount >= maxVotes) eliminated = null;

    if (eliminated) {
      setPlayers(prev => prev.map(p => p.id === eliminated ? { ...p, alive: false } : p));
      const elPlayer = players.find(p => p.id === eliminated);
      setMessages(prev => [...prev, { sender: '⚠️ SYSTEM', text: `${elPlayer?.name} was eliminated! They were a ${elPlayer?.role?.toUpperCase()}.`, system: true }]);

      // Check if impostor was eliminated
      if (elPlayer?.role === 'impostor') {
        clearAllIntervals();
        setWinner('crewmates');
        setPhase('gameOver');
        playSuccess();
        return;
      }

      // Check if only 2 players remain (impostor wins if 1v1)
      const aliveAfter = players.filter(p => p.alive && p.id !== eliminated);
      if (aliveAfter.length <= 2) {
        const impAlive = aliveAfter.find(p => p.role === 'impostor');
        if (impAlive) {
          clearAllIntervals();
          setWinner('impostor');
          setPhase('gameOver');
          playError();
          return;
        }
      }
    } else {
      setMessages(prev => [...prev, { sender: '⚠️ SYSTEM', text: 'No one was eliminated. (Tie/Skip)', system: true }]);
    }

    // Return to coding
    setTimeout(() => {
      setPhase('coding');
      setTimer(prev => prev > 0 ? prev : 120); // resume with remaining or give 2 min
      // Restart timers
      timerRef.current = setInterval(() => {
        setTimer(p => {
          if (p <= 1) { clearAllIntervals(); setWinner('impostor'); setPhase('gameOver'); playError(); return 0; }
          return p - 1;
        });
      }, 1000);
      botRef.current = setInterval(() => {
        setPlayers(prev => prev.map(p => (!p.isBot || !p.alive) ? p : { ...p, currentLine: Math.random() < 0.3 ? null : Math.floor(Math.random() * 25) + 1, idle: Math.random() < 0.2 }));
        setTasks(prev => {
          const u = prev.map(t => ({ ...t, bugs: t.bugs.map(b => ({ ...b })) }));
          const unfixed = [];
          u.forEach((t, ti) => t.bugs.forEach((b, bi) => { if (!b.fixed) unfixed.push({ ti, bi }); }));
          if (unfixed.length && Math.random() < 0.15) { const pick = unfixed[Math.floor(Math.random() * unfixed.length)]; u[pick.ti].bugs[pick.bi].fixed = true; u[pick.ti].bugs[pick.bi].sabotaged = false; }
          return u;
        });
      }, 3000);
    }, 2000);
  }, [votes, players, clearAllIntervals]);

  // Auto-resolve when all votes are in
  useEffect(() => {
    if (phase !== 'voting') return;
    const alive = players.filter(p => p.alive);
    const allVoted = alive.every(p => votes[p.id] !== undefined);
    if (allVoted && alive.length > 0) {
      clearInterval(timerRef.current);
      resolveVotes();
    }
  }, [votes, phase, players, resolveVotes]);

  // ─── Send Chat Message ────────────────────────────────────────
  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: myPlayer?.name || 'You', text: text.trim(), color: myPlayer?.color?.bg }]);
    playClick();
  };

  // ─── Reset to Lobby ───────────────────────────────────────────
  const resetGame = () => {
    clearAllIntervals();
    setPhase('lobby');
    setPlayers([]);
    setTasks([]);
    setMessages([]);
    setVotes({});
    setTimer(0);
    setWinner(null);
    setSabCooldown(0);
  };

  // ═══════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="h-full w-full flex flex-col" style={{ background: 'linear-gradient(135deg, #1a1035 0%, #2d1b69 50%, #1a1035 100%)' }}>
      <AnimatePresence mode="wait">
        {/* LOBBY */}
        {phase === 'lobby' && (
          <LobbyPhase key="lobby" onQuickMatch={() => startMatchmaking()} onHostGame={() => startMatchmaking()} playerName={playerName} />
        )}

        {/* MATCHMAKING */}
        {phase === 'matchmaking' && (
          <MatchmakingPhase key="match" players={players} countdown={matchCountdown} onCancel={resetGame} />
        )}

        {/* ROLE REVEAL */}
        {phase === 'roleReveal' && myPlayer && (
          <RoleRevealPhase key="reveal" role={myPlayer.role} color={myPlayer.color} />
        )}

        {/* GAME OVER */}
        {phase === 'gameOver' && (
          <GameOverPhase key="over" winner={winner} players={players} myId={myId} onPlayAgain={resetGame} />
        )}

        {/* CODING / DISCUSSION / VOTING — Main Game UI */}
        {(phase === 'coding' || phase === 'discussion' || phase === 'voting') && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full overflow-hidden">
            {/* ─── TOP BAR ──────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#6B21A8] border-b-4 border-black shadow-[0_4px_0px_#000] shrink-0 z-20">
              <button onClick={resetGame} className="p-2 hover:bg-white/20 transition-colors rounded">
                <ArrowLeft size={20} className="text-white" />
              </button>
              <div className="flex items-center gap-6 text-white font-black uppercase text-sm">
                <div className="flex items-center gap-2 bg-black/30 px-4 py-1.5 border-2 border-white/30">
                  <Timer size={16} /> <span className="text-lg tabular-nums">{fmt(timer)}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 px-4 py-1.5 border-2 border-white/30">
                  <Bug size={16} /> <span>Bugs: <span className="text-[#4ade80]">{bugsFixed}</span>/{bugsTotal}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 px-4 py-1.5 border-2 border-white/30">
                  <Users size={16} /> <span>Players: {alivePlayers.length}/{players.length}</span>
                </div>
                {phase !== 'coding' && (
                  <div className="bg-[#FFD93D] text-black px-4 py-1.5 border-2 border-black animate-pulse font-black">
                    {phase === 'discussion' ? '💬 DISCUSSION' : '🗳️ VOTING'}
                  </div>
                )}
              </div>
              <div className="w-8" />
            </div>

            {/* ─── MAIN CONTENT ─────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden">
              {/* ─── CODE EDITOR (CENTER) ─────────────────── */}
              <div className="flex-1 flex flex-col overflow-hidden border-r-4 border-black">
                <div className="bg-[#1e1e2e] text-white flex-1 overflow-y-auto p-0 font-mono text-sm relative">
                  {/* Editor header */}
                  <div className="sticky top-0 bg-[#2d2d44] border-b-2 border-[#444] px-4 py-2 flex items-center gap-3 z-10">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="font-bold text-white/60 text-xs uppercase tracking-wider ml-2">CODE EDITOR</span>
                    {isImpostor && (
                      <span className="ml-auto bg-[#EF4444] text-white text-xs font-black px-3 py-0.5 uppercase animate-pulse border border-white/30">
                        👾 IMPOSTOR MODE
                      </span>
                    )}
                  </div>

                  {/* Code tasks */}
                  <div className="p-4 space-y-8">
                    {tasks.map((task, ti) => (
                      <TaskBlock key={task.id} task={task} taskIdx={ti} onFix={handleFixBug} onSabotage={handleSabotage}
                        isImpostor={isImpostor} sabCooldown={sabCooldown} players={players} myId={myId} phase={phase} />
                    ))}
                  </div>
                </div>
              </div>

              {/* ─── RIGHT PANEL ──────────────────────────── */}
              <div className="w-[280px] bg-[#FFFDF5] border-l-2 border-black flex flex-col shrink-0 overflow-hidden">
                {/* Player Activity */}
                <div className="border-b-4 border-black p-3">
                  <h3 className="font-black uppercase text-sm tracking-wider mb-3 border-b-2 border-black pb-1 flex items-center gap-2">
                    <Users size={14} /> Player Activity
                  </h3>
                  <div className="space-y-2">
                    {players.map(p => (
                      <div key={p.id} className={`flex items-center gap-2 p-1.5 border-2 border-black text-xs font-bold ${!p.alive ? 'opacity-40 line-through' : ''}`}
                        style={{ backgroundColor: p.color.light || '#fff' }}>
                        <CrewmateIcon color={p.color.bg} size={18} visor={p.color.visor} dead={!p.alive} />
                        <span className="truncate flex-1">{p.name}</span>
                        <span className="text-[10px] opacity-70 uppercase shrink-0">
                          {!p.alive ? 'ELIMINATED' : p.idle ? 'Idle' : p.currentLine ? `Line ${p.currentLine}` : 'Active'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code Heatmap */}
                <div className="border-b-4 border-black p-3">
                  <h3 className="font-black uppercase text-xs tracking-wider mb-2 flex items-center gap-1">
                    — Code Heatmap —
                  </h3>
                  {['1-10', '11-20', '21-30'].map((range, i) => (
                    <div key={range} className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono w-10 font-bold">{range}</span>
                      <div className="flex-1 h-4 bg-gray-200 border border-black overflow-hidden flex">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <div key={j} className="flex-1" style={{
                            backgroundColor: ['#4ade80', '#fbbf24', '#ef4444', '#22c55e', '#f97316'][Math.floor(Math.random() * 5)],
                            opacity: 0.3 + Math.random() * 0.7,
                          }} />
                        ))}
                      </div>
                      {i === 2 && <span className="text-[10px] font-black text-[#EF4444] uppercase">High</span>}
                    </div>
                  ))}
                </div>

                {/* Discussion / Voting panel */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <h3 className="font-black uppercase text-sm tracking-wider p-3 border-b-2 border-black flex items-center gap-2">
                    <MessageCircle size={14} /> Discussion / Voting
                  </h3>

                  {(phase === 'voting') ? (
                    /* ─── VOTING UI ─── */
                    <div className="p-3 space-y-2 overflow-y-auto flex-1">
                      <p className="text-xs font-black uppercase text-center mb-2">
                        Voting Ends In: <span className="text-[#EF4444]">{timer}s</span>
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {alivePlayers.map(p => (
                          <button key={p.id} onClick={() => p.id !== myId && handleVote(p.id)}
                            disabled={votes[myId] !== undefined || p.id === myId}
                            className={`flex flex-col items-center p-2 border-3 border-black text-xs font-bold transition-all
                              ${votes[myId] === p.id ? 'bg-[#EF4444] text-white shadow-none translate-y-1' : 'bg-white shadow-[3px_3px_0px_#000] hover:-translate-y-0.5'}
                              ${p.id === myId ? 'opacity-50' : 'cursor-pointer'}`}>
                            <CrewmateIcon color={p.color.bg} size={24} visor={p.color.visor} />
                            <span className="mt-1 truncate w-full text-center">{p.name}</span>
                          </button>
                        ))}
                        <button onClick={() => handleVote('skip')}
                          disabled={votes[myId] !== undefined}
                          className={`flex flex-col items-center p-2 border-3 border-black text-xs font-bold transition-all col-span-2
                            ${votes[myId] === 'skip' ? 'bg-gray-400 text-white shadow-none translate-y-1' : 'bg-[#FFD93D] shadow-[3px_3px_0px_#000] hover:-translate-y-0.5'}`}>
                          <SkipForward size={24} />
                          <span className="mt-1">Skip Vote</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ─── CHAT / DISCUSSION ─── */
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
                        {messages.length === 0 && (
                          <p className="text-center opacity-40 font-bold mt-8 uppercase text-[10px]">No messages yet</p>
                        )}
                        {messages.map((m, i) => (
                          <div key={i} className={`p-1.5 ${m.system ? 'bg-[#FFD93D] border-2 border-black font-black text-center' : 'border-b border-gray-200'}`}>
                            <span className="font-black" style={{ color: m.color || '#000' }}>{m.sender}: </span>
                            <span>{m.text}</span>
                          </div>
                        ))}
                      </div>
                      {(phase === 'discussion' || phase === 'coding') && (
                        <div className="border-t-2 border-black p-2 flex gap-1 shrink-0">
                          <input ref={msgInputRef} placeholder="Type message..."
                            className="flex-1 px-2 py-1.5 border-2 border-black text-xs font-bold focus:outline-none focus:bg-[#FFD93D]/20"
                            onKeyDown={e => { if (e.key === 'Enter') { sendMessage(e.target.value); e.target.value = ''; } }} />
                          <button onClick={() => { if (msgInputRef.current) { sendMessage(msgInputRef.current.value); msgInputRef.current.value = ''; } }}
                            className="bg-[#4ade80] border-2 border-black px-3 font-black text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-y-0.5 active:shadow-none">
                            <Send size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Call Meeting Button (during coding) */}
                  {phase === 'coding' && (
                    <div className="p-2 border-t-2 border-black shrink-0">
                      <button onClick={callMeeting}
                        className="w-full py-2 bg-[#EF4444] text-white border-3 border-black font-black text-xs uppercase shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2">
                        <AlertTriangle size={14} /> Call Meeting
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  TASK BLOCK — Single code task with bugs
// ═══════════════════════════════════════════════════════════════════
function TaskBlock({ task, taskIdx, onFix, onSabotage, isImpostor, sabCooldown, players, myId, phase }) {
  const [dragOver, setDragOver] = useState(null); // bugId being dragged over
  const [selectedBug, setSelectedBug] = useState(null); // bugId showing options

  const allFixed = task.bugs.every(b => b.fixed && !b.sabotaged);

  return (
    <div className={`border-2 ${allFixed ? 'border-[#4ade80]/50' : 'border-[#444]'} rounded overflow-hidden`}>
      {/* Task header */}
      <div className={`flex items-center justify-between px-3 py-1.5 text-xs font-black uppercase tracking-wider ${allFixed ? 'bg-[#4ade80]/20 text-[#4ade80]' : 'bg-[#2d2d44] text-white/70'}`}>
        <span>{task.title}</span>
        <span>{allFixed ? '✅ FIXED' : `${task.bugs.filter(b => b.fixed && !b.sabotaged).length}/${task.bugs.length} bugs`}</span>
      </div>

      {/* Code lines */}
      <div className="relative">
        {task.lines.map((line, li) => {
          const bug = line.isBug ? task.bugs.find(b => b.id === line.bugId) : null;
          const isBugLine = !!bug;
          const isFixed = bug?.fixed && !bug?.sabotaged;
          const isSabotaged = bug?.sabotaged;
          const showingOptions = selectedBug === line.bugId;

          // Player cursors on this line
          const cursors = players.filter(p => p.alive && p.currentLine === line.num && p.id !== myId);

          return (
            <div key={li}>
              <div
                className={`flex items-center px-2 py-0.5 group transition-colors relative
                  ${isBugLine && !isFixed ? 'bg-[#ef444420] hover:bg-[#ef444435] cursor-pointer' : ''}
                  ${isFixed ? 'bg-[#4ade8015]' : ''}
                  ${isSabotaged ? 'bg-[#f9731620]' : ''}
                  ${dragOver === line.bugId ? 'bg-[#FFD93D30] ring-2 ring-[#FFD93D]' : ''}`}
                onClick={() => { if (isBugLine && !isFixed && phase === 'coding') setSelectedBug(showingOptions ? null : line.bugId); }}
                onDragOver={(e) => { if (isBugLine && !isFixed) { e.preventDefault(); setDragOver(line.bugId); } }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => {
                  e.preventDefault(); setDragOver(null);
                  if (!isBugLine) return;
                  const code = e.dataTransfer.getData('text/plain');
                  const bIdx = task.bugs.findIndex(b => b.id === line.bugId);
                  if (bIdx >= 0) onFix(taskIdx, bIdx, code);
                  setSelectedBug(null);
                }}
              >
                {/* Line number */}
                <span className="w-8 text-right text-[#666] text-xs mr-3 select-none shrink-0 font-mono">{line.num}</span>

                {/* Bug indicator */}
                {isBugLine && !isFixed && (
                  <span className="w-2 h-2 rounded-full bg-[#EF4444] mr-2 shrink-0 animate-pulse" />
                )}
                {isFixed && (
                  <span className="w-2 h-2 rounded-full bg-[#4ade80] mr-2 shrink-0" />
                )}

                {/* Code */}
                <code className="flex-1 whitespace-pre text-[13px]">
                  {isFixed ? <HighlightLine text={bug.fix} /> : <HighlightLine text={line.text} />}
                </code>

                {/* Player cursors */}
                {cursors.map(c => (
                  <span key={c.id} className="ml-2 text-[10px] font-black px-1.5 py-0.5 shrink-0 animate-pulse" style={{ backgroundColor: c.color.bg, color: '#fff' }}>
                    ◀ {c.name}
                  </span>
                ))}

                {/* Impostor sabotage button */}
                {isImpostor && isFixed && phase === 'coding' && (
                  <button onClick={(e) => { e.stopPropagation(); const bIdx = task.bugs.findIndex(b => b.id === line.bugId); onSabotage(taskIdx, bIdx); }}
                    disabled={sabCooldown > 0}
                    className={`ml-2 text-[10px] font-black px-2 py-0.5 border border-black uppercase shrink-0 transition-all
                      ${sabCooldown > 0 ? 'bg-gray-400 opacity-50 cursor-not-allowed' : 'bg-[#EF4444] text-white hover:bg-[#dc2626] cursor-pointer'}`}>
                    {sabCooldown > 0 ? `${sabCooldown}s` : '💣 SAB'}
                  </button>
                )}
              </div>

              {/* ─── Code block options (click to fix) ─── */}
              {showingOptions && !isFixed && phase === 'coding' && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="bg-[#1a1a2e] border-t border-b border-[#FFD93D]/40 p-2 pl-12">
                  <p className="text-[10px] text-[#FFD93D] font-bold uppercase mb-2 flex items-center gap-1">
                    <Zap size={10} /> Choose the correct fix:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getOptions(bug).map((opt, oi) => (
                      <button key={oi}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', opt)}
                        onClick={() => { const bIdx = task.bugs.findIndex(b => b.id === line.bugId); onFix(taskIdx, bIdx, opt); setSelectedBug(null); }}
                        className="px-3 py-1.5 bg-[#2d2d44] hover:bg-[#3d3d54] border-2 border-[#555] hover:border-[#FFD93D] text-[12px] font-mono text-white/90 cursor-grab active:cursor-grabbing transition-all hover:-translate-y-0.5 shadow-[2px_2px_0px_#000]">
                        <code><HighlightLine text={opt} /></code>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
