import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { playClick, playSuccess } from '../utils/sounds';

const MODES = {
  focus:  { label: 'Focus',       duration: 25 * 60, color: '#8b5cf6', bg: '#EDE9FE' },
  short:  { label: 'Short Break', duration: 5  * 60, color: '#4ade80', bg: '#DCFCE7' },
  long:   { label: 'Long Break',  duration: 15 * 60, color: '#60A5FA', bg: '#DBEAFE' },
};

function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export default function PomodoroTimer({ onSessionComplete }) {
  const [mode, setMode]       = useState('focus');
  const [timeLeft, setTime]   = useState(MODES.focus.duration);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);
  const cfg = MODES[mode];

  const progress = 1 - timeLeft / cfg.duration;
  const circumference = 2 * Math.PI * 54;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            playSuccess();
            if (mode === 'focus') {
              setSessions(s => s + 1);
              onSessionComplete?.();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const switchMode = (m) => {
    playClick();
    setMode(m);
    setTime(MODES[m].duration);
    setRunning(false);
  };

  const reset = () => {
    playClick();
    setTime(cfg.duration);
    setRunning(false);
  };

  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-6 flex flex-col items-center gap-4">
      <div className="font-black uppercase text-sm tracking-widest flex items-center gap-2">
        <Brain size={16} /> Pomodoro Timer
      </div>

      {/* Mode switcher */}
      <div className="flex gap-2 w-full">
        {Object.entries(MODES).map(([key, m]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`flex-1 py-1.5 text-xs font-black uppercase border-2 border-black transition-all
              ${mode === key ? 'bg-black text-white shadow-none translate-y-0.5' : 'bg-white hover:bg-neo-bg shadow-[2px_2px_0px_#000]'}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Circular Timer */}
      <div className="relative" style={{ width: 140, height: 140 }}>
        <svg width="140" height="140" className="-rotate-90">
          <circle cx="70" cy="70" r="54" fill="none" stroke="#E5E7EB" strokeWidth="10" />
          <circle
            cx="70" cy="70" r="54"
            fill="none"
            stroke={cfg.color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black tabular-nums">{fmt(timeLeft)}</span>
          <span className="text-xs font-bold uppercase opacity-60">{cfg.label}</span>
        </div>
      </div>

      {/* Sessions */}
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}
            className={`w-4 h-4 border-2 border-black ${i < sessions % 4 ? 'bg-[#8b5cf6]' : 'bg-white'}`}
          />
        ))}
        <span className="text-xs font-black ml-2 opacity-60">Session {sessions + 1}</span>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={() => { playClick(); setRunning(r => !r); }}
          className={`px-6 py-3 border-4 border-black font-black uppercase shadow-[4px_4px_0px_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2
            ${running ? 'bg-[#FF6B6B] text-white' : 'bg-[#4ade80]'}`}
        >
          {running ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
        </button>
        <button
          onClick={reset}
          className="p-3 border-4 border-black bg-white shadow-[4px_4px_0px_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {sessions >= 4 && (
        <div className="text-xs font-black uppercase text-[#8b5cf6] flex items-center gap-1 animate-pulse">
          <Coffee size={12} /> Take a long break!
        </div>
      )}
    </div>
  );
}
