import { useState, useEffect, useCallback } from 'react';
import { Sparkles, Zap, Trophy, Target, Flame, Gift, CheckSquare, RefreshCw, Star, TrendingUp, Clock, CheckCircle2, Lock, Skull, PartyPopper } from 'lucide-react';
import { loadXP, saveXP, getRank, getNextRank, getRankProgress, addXP, toggleHabit, claimMilestone, RANKS } from '../../utils/xpStore';
import PomodoroTimer from '../PomodoroTimer';
import SkillRadar from '../SkillRadar';
import { playSuccess, playClick } from '../../utils/sounds';

// ── Heatmap colors ─────────────────────────────────────────
const HEAT_COLORS = ['#F3F4F6', '#C4B5FD', '#A78BFA', '#7C3AED', '#4C1D95'];

// ── Contribution Heatmap ───────────────────────────────────
function ContributionHeatmap({ grid }) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-6">
      <div className="font-black uppercase text-sm tracking-widest mb-4 flex items-center gap-2">
        <TrendingUp size={16} /> Contribution Heatmap
        <span className="ml-auto text-xs opacity-50 font-bold normal-case">Past 52 weeks</span>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-1" style={{ minWidth: 600 }}>
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((level, di) => (
                <div
                  key={di}
                  title={`${level} solve${level !== 1 ? 's' : ''}`}
                  className="w-3 h-3 border border-black/10 cursor-pointer hover:scale-150 transition-transform"
                  style={{ backgroundColor: HEAT_COLORS[level] }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-xs font-bold opacity-50">Less</span>
        {HEAT_COLORS.map((c, i) => (
          <div key={i} className="w-3 h-3 border border-black/10" style={{ backgroundColor: c }} />
        ))}
        <span className="text-xs font-bold opacity-50">More</span>
      </div>
    </div>
  );
}

// ── XP Rank Bar ────────────────────────────────────────────
function XPRankBar({ xp }) {
  const rank = getRank(xp);
  const next = getNextRank(xp);
  const progress = getRankProgress(xp);

  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{rank.emoji}</span>
          <div>
            <div className="font-black uppercase text-xl" style={{ color: rank.color }}>{rank.name}</div>
            <div className="text-xs font-bold opacity-60 uppercase">{xp.toLocaleString()} XP total</div>
          </div>
        </div>
        {next && (
          <div className="text-right">
            <div className="text-xs font-black uppercase opacity-50">Next: {next.name}</div>
            <div className="text-sm font-black" style={{ color: next.color }}>{(next.minXP - xp).toLocaleString()} XP away</div>
          </div>
        )}
      </div>
      <div className="w-full h-5 bg-neo-bg border-4 border-black relative overflow-hidden">
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%`, backgroundColor: rank.color }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-black">
          {progress}%
        </span>
      </div>
      {/* Rank milestones */}
      <div className="flex gap-1 mt-3 justify-between">
        {RANKS.map(r => (
          <div key={r.name} className="flex flex-col items-center gap-1">
            <span className="text-base" title={r.name}>{r.emoji}</span>
            <div className={`w-2 h-2 border-2 border-black rounded-full ${xp >= r.minXP ? 'bg-black' : 'bg-white'}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Daily Quests ───────────────────────────────────────────
function DailyQuests({ quests, onClaim }) {
  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-6">
      <div className="font-black uppercase text-sm tracking-widest mb-4 flex items-center gap-2">
        <Target size={16} /> Daily Quests
        <span className="ml-auto text-xs font-bold opacity-40 uppercase">Resets at midnight</span>
      </div>
      <div className="space-y-3">
        {quests.map((q, i) => {
          const pct = Math.min(100, Math.round((q.progress / q.total) * 100));
          const done = q.progress >= q.total;
          return (
            <div key={q.id} className={`p-3 border-4 border-black transition-all ${done ? 'bg-[#DCFCE7]' : 'bg-neo-bg'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{q.icon}</span>
                  <span className="font-bold text-sm">{q.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#8b5cf6]">+{q.xpReward} XP</span>
                  {done && (
                    <button
                      onClick={() => onClaim(q)}
                      className="px-3 py-1 bg-[#4ade80] border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    >
                      Claim
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full h-2 bg-white border-2 border-black">
                <div className="h-full bg-[#8b5cf6] transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
              <div className="text-right text-xs font-bold mt-1 opacity-60">{q.progress}/{q.total}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Habit Tracker ──────────────────────────────────────────
function HabitTracker({ habits, onToggle }) {
  const done = habits.filter(h => h.done).length;
  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-6">
      <div className="font-black uppercase text-sm tracking-widest mb-4 flex items-center gap-2">
        <CheckSquare size={16} /> Today's Habits
        <span className={`ml-auto px-2 py-0.5 text-xs font-black border-2 border-black ${done === habits.length ? 'bg-[#4ade80]' : 'bg-[#FFD93D]'}`}>
          {done}/{habits.length}
        </span>
      </div>
      <div className="space-y-3">
        {habits.map(h => (
          <button
            key={h.id}
            onClick={() => onToggle(h.id)}
            className={`w-full p-3 border-4 border-black font-bold text-sm flex items-center gap-3 transition-all shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none
              ${h.done ? 'bg-[#4ade80] line-through opacity-80' : 'bg-white'}`}
          >
            <span className="text-xl">{h.icon}</span>
            <span>{h.label}</span>
            {h.done && <span className="ml-auto font-black text-green-700">✓</span>}
          </button>
        ))}
      </div>
      {done === habits.length && (
        <div className="mt-4 text-center text-sm font-black uppercase text-[#15803d] animate-bounce flex items-center justify-center gap-2">
          <PartyPopper size={16} /> All habits done! +50 Bonus XP
        </div>
      )}
    </div>
  );
}

// ── Milestone Rewards ──────────────────────────────────────
function MilestoneRewards({ totalSolved, milestones, claimedMilestones, onClaim }) {
  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-6">
      <div className="font-black uppercase text-sm tracking-widest mb-4 flex items-center gap-2">
        <Gift size={16} /> Milestone Rewards
      </div>
      <div className="grid grid-cols-2 gap-3">
        {milestones.map(m => {
          const claimed = claimedMilestones.includes(m);
          const unlocked = totalSolved >= m;
          return (
            <div
              key={m}
              className={`p-3 border-4 border-black text-center transition-all
                ${claimed ? 'bg-[#F3F4F6] opacity-60' : unlocked ? 'bg-[#FFD93D] shadow-[4px_4px_0px_#000]' : 'bg-white opacity-40'}`}
            >
              <div className="text-2xl mb-1 flex justify-center">
                {claimed ? <CheckCircle2 size={24} className="text-[#15803d]" /> : unlocked ? <Gift size={24} className="text-black" /> : <Lock size={24} className="opacity-50" />}
              </div>
              <div className="font-black text-sm">{m} Solves</div>
              {unlocked && !claimed && (
                <button
                  onClick={() => onClaim(m)}
                  className="mt-2 px-3 py-1 bg-black text-white text-xs font-black uppercase hover:bg-[#8b5cf6] transition-colors"
                >
                  Claim +200 XP
                </button>
              )}
              {claimed && <div className="text-xs font-bold mt-1 opacity-60">Claimed</div>}
              {!unlocked && <div className="text-xs font-bold mt-1 opacity-60">{m - totalSolved} left</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Personal Record Wall ───────────────────────────────────
function RecordWall({ records }) {
  const items = [
    { label: 'Fastest Solve', value: records.fastestSolve, icon: <Zap size={24} /> },
    { label: 'Longest Streak', value: `${records.longestStreak} days`, icon: <Flame size={24} className="text-[#EF4444]" /> },
    { label: 'First Hard', value: records.firstHard, icon: <Skull size={24} className="opacity-70" /> },
    { label: 'Total Solved', value: records.totalSolved, icon: <Trophy size={24} className="text-[#FFD93D]" /> },
  ];
  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-6">
      <div className="font-black uppercase text-sm tracking-widest mb-4 flex items-center gap-2">
        <Star size={16} /> Personal Records
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map(item => (
          <div key={item.label} className="bg-neo-bg border-4 border-black p-3 shadow-[4px_4px_0px_#000]">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-xs font-black uppercase opacity-60">{item.label}</div>
            <div className="text-lg font-black mt-0.5">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Weekly Goal Ring ───────────────────────────────────────
function WeeklyGoalRing({ done, target }) {
  const pct = Math.min(100, Math.round((done / target) * 100));
  const circumference = 2 * Math.PI * 36;
  return (
    <div className="bg-[#FFD93D] border-4 border-black shadow-[8px_8px_0px_#000] p-6 flex items-center gap-6">
      <div className="relative" style={{ width: 90, height: 90 }}>
        <svg width="90" height="90" className="-rotate-90">
          <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="8" />
          <circle
            cx="45" cy="45" r="36"
            fill="none" stroke="#000" strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct / 100)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black">{pct}%</span>
        </div>
      </div>
      <div>
        <div className="font-black uppercase text-lg">Weekly Goal</div>
        <div className="text-4xl font-black">{done}<span className="text-xl opacity-60">/{target}</span></div>
        <div className="text-sm font-bold opacity-70">problems solved</div>
        {done >= target && (
          <div className="mt-1 text-sm font-black text-green-700 animate-bounce">🎯 Goal smashed!</div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MAIN OVERVIEW
// ═══════════════════════════════════════════════════════════
export default function OverviewView({ isPremium }) {
  const [xpState, setXpState] = useState(() => loadXP());
  const [toast, setToast]     = useState(null);

  const save = useCallback((newState) => {
    setXpState(newState);
    saveXP(newState);
  }, []);

  const showToast = (msg, color = '#4ade80') => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleHabit = (id) => {
    playClick();
    save(toggleHabit(xpState, id));
  };

  const handleClaimMilestone = (m) => {
    playSuccess();
    save(claimMilestone(xpState, m));
    showToast(`🏆 Milestone Claimed! +200 XP`, '#FFD93D');
  };

  const handleClaimQuest = (q) => {
    playSuccess();
    const newState = { ...xpState, xp: xpState.xp + q.xpReward };
    save(newState);
    showToast(`✅ Quest Complete! +${q.xpReward} XP`, '#4ade80');
  };

  return (
    <div className="animate-fade-in w-full space-y-6 pb-8 relative">

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 right-6 z-50 px-6 py-3 border-4 border-black font-black text-lg shadow-[6px_6px_0px_#000] animate-fade-in"
          style={{ backgroundColor: toast.color }}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Row 1: Stats + Weekly Goal ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#8b5cf6] flex flex-col items-center">
          <div className="text-sm font-black uppercase mb-1 opacity-60">Efficiency</div>
          <div className="text-6xl font-black text-[#8b5cf6]">A+</div>
        </div>
        <div className="bg-[#FFD93D] border-4 border-black p-6 shadow-[8px_8px_0px_#000] flex flex-col items-center">
          <div className="text-sm font-black uppercase mb-1 opacity-60">Total Solved</div>
          <div className="text-6xl font-black">{xpState.totalSolved}</div>
        </div>
        <div className="bg-[#4ade80] border-4 border-black p-6 shadow-[8px_8px_0px_#000] flex flex-col items-center">
          <div className="text-sm font-black uppercase mb-1 opacity-60">Streak</div>
          <div className="text-6xl font-black flex items-end gap-1">
            {xpState.streak}
            <Flame size={32} className="mb-2 text-[#EF4444] drop-shadow-md" />
          </div>
        </div>
        <div className="col-span-2 md:col-span-1">
          <WeeklyGoalRing done={xpState.weeklyGoal.done} target={xpState.weeklyGoal.target} />
        </div>
      </div>

      {/* ── Row 2: XP Rank Bar ── */}
      <XPRankBar xp={xpState.xp} />

      {/* ── Row 3: Heatmap ── */}
      {xpState.heatmap && <ContributionHeatmap grid={xpState.heatmap} />}

      {/* ── Row 4: Quests + Habits ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DailyQuests quests={xpState.quests} onClaim={handleClaimQuest} />
        <HabitTracker habits={xpState.habits} onToggle={handleToggleHabit} />
      </div>

      {/* ── Row 5: Skill Radar + Pomodoro + Records ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkillRadar skills={xpState.skills} size={260} />
        <PomodoroTimer onSessionComplete={() => showToast('🍅 Focus session done! +25 XP', '#8b5cf6')} />
        <RecordWall records={xpState.records} />
      </div>

      {/* ── Row 6: Milestones ── */}
      <MilestoneRewards
        totalSolved={xpState.totalSolved}
        milestones={xpState.milestones}
        claimedMilestones={xpState.claimedMilestones}
        onClaim={handleClaimMilestone}
      />

      {/* ── Row 7: Combo display ── */}
      {xpState.combo >= 2 && (
        <div className="border-4 border-black p-6 shadow-[8px_8px_0px_#000] bg-[#EF4444] text-white flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <Zap size={32} />
            <div>
              <div className="font-black text-2xl uppercase">🔥 {xpState.combo}x Combo Active!</div>
              <div className="font-bold text-sm opacity-80">XP multiplier: {xpState.combo >= 3 ? '2x' : '1.5x'} — Keep solving!</div>
            </div>
          </div>
          <div className="text-5xl font-black">{xpState.combo}x</div>
        </div>
      )}

      {!isPremium && (
        <div className="border-4 border-[#8b5cf6] p-4 bg-[#EDE9FE] flex items-center gap-3">
          <Sparkles size={20} className="text-[#8b5cf6]" />
          <span className="font-black text-sm uppercase text-[#8b5cf6]">
            Upgrade to Pro for advanced analytics, AI Roadmap, and unlimited quests
          </span>
        </div>
      )}
    </div>
  );
}
