// ═══════════════════════════════════════════════════════════
//  LeetNudge — XP / Rank / Quests / Habit / Combo Store
// ═══════════════════════════════════════════════════════════

export const RANKS = [
  { name: 'Rookie',   minXP: 0,    color: '#9CA3AF', emoji: '🥉' },
  { name: 'Bronze',   minXP: 500,  color: '#CD7F32', emoji: '🥉' },
  { name: 'Silver',   minXP: 1500, color: '#C0C0C0', emoji: '🥈' },
  { name: 'Gold',     minXP: 3500, color: '#FFD700', emoji: '🥇' },
  { name: 'Platinum', minXP: 7000, color: '#4ade80', emoji: '💎' },
  { name: 'Diamond',  minXP: 12000,color: '#60A5FA', emoji: '💠' },
  { name: 'Legend',   minXP: 20000,color: '#F59E0B', emoji: '👑' },
];

export function getRank(xp) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.minXP) rank = r;
  }
  return rank;
}

export function getNextRank(xp) {
  for (let i = 0; i < RANKS.length; i++) {
    if (xp < RANKS[i].minXP) return RANKS[i];
  }
  return null;
}

export function getRankProgress(xp) {
  const current = getRank(xp);
  const next = getNextRank(xp);
  if (!next) return 100;
  const range = next.minXP - current.minXP;
  const earned = xp - current.minXP;
  return Math.min(100, Math.round((earned / range) * 100));
}

// ── Default state ──────────────────────────────────────────
const DEFAULT_STATE = {
  xp: 1240,
  streak: 12,
  longestStreak: 18,
  totalSolved: 142,
  lastSolveDate: new Date().toDateString(),
  combo: 0,
  comboExpiresAt: null,
  habits: [
    { id: 'h1', label: 'Solve a problem',   done: false, icon: '⚡' },
    { id: 'h2', label: 'Revise one topic',  done: false, icon: '📖' },
    { id: 'h3', label: 'Mock interview',    done: false, icon: '🎤' },
  ],
  quests: [],
  questDate: '',
  milestones: [10, 50, 100, 500],
  claimedMilestones: [10, 50],
  heatmap: null,  // generated below
  records: {
    fastestSolve: '4m 12s',
    longestStreak: 18,
    firstHard: '3 Sum',
    totalSolved: 142,
  },
  skills: {
    Arrays: 82,
    'Dynamic\nProgramming': 45,
    Graphs: 63,
    Trees: 71,
    Math: 55,
    Strings: 78,
  },
  weeklyGoal: { target: 5, done: 3 },
};

const QUEST_POOL = [
  { id: 'q1', label: 'Solve 2 problems today',      xpReward: 80,  icon: '⚡', progress: 0, total: 2 },
  { id: 'q2', label: 'Solve a Hard problem',         xpReward: 150, icon: '🔥', progress: 0, total: 1 },
  { id: 'q3', label: 'Maintain a 3-problem combo',  xpReward: 120, icon: '🎯', progress: 0, total: 3 },
  { id: 'q4', label: 'Open the app & check habits', xpReward: 30,  icon: '✅', progress: 1, total: 1 },
  { id: 'q5', label: 'Visit DSA Sheet',              xpReward: 50,  icon: '📊', progress: 0, total: 1 },
  { id: 'q6', label: 'Try a quiz question',          xpReward: 60,  icon: '🧠', progress: 0, total: 1 },
  { id: 'q7', label: 'Revise a saved problem',       xpReward: 70,  icon: '🔁', progress: 0, total: 1 },
];

function generateHeatmap() {
  const grid = [];
  for (let week = 0; week < 52; week++) {
    const row = [];
    for (let day = 0; day < 7; day++) {
      const rand = Math.random();
      row.push(rand < 0.4 ? 0 : rand < 0.6 ? 1 : rand < 0.8 ? 2 : rand < 0.95 ? 3 : 4);
    }
    grid.push(row);
  }
  return grid;
}

function pickDailyQuests() {
  const pool = [...QUEST_POOL];
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

// ── Load / Save ────────────────────────────────────────────
export function loadXP() {
  try {
    const raw = localStorage.getItem('ln_xp_state');
    const state = raw ? JSON.parse(raw) : DEFAULT_STATE;
    // Generate heatmap if missing
    if (!state.heatmap) state.heatmap = generateHeatmap();
    // Refresh quests if new day
    const today = new Date().toDateString();
    if (state.questDate !== today) {
      state.quests = pickDailyQuests();
      state.questDate = today;
      // Reset habits
      state.habits = state.habits.map(h => ({ ...h, done: false }));
    }
    return state;
  } catch {
    const s = { ...DEFAULT_STATE, heatmap: generateHeatmap(), quests: pickDailyQuests(), questDate: new Date().toDateString() };
    return s;
  }
}

export function saveXP(state) {
  try {
    localStorage.setItem('ln_xp_state', JSON.stringify(state));
  } catch {}
}

// ── Actions ────────────────────────────────────────────────
export function addXP(state, amount) {
  const multiplier = state.combo >= 3 ? 2 : 1;
  const gained = amount * multiplier;
  const newXP = state.xp + gained;
  return { ...state, xp: newXP, totalSolved: state.totalSolved + 1 };
}

export function startCombo(state) {
  const expiresAt = Date.now() + 60000; // 60 seconds
  return { ...state, combo: (state.combo || 0) + 1, comboExpiresAt: expiresAt };
}

export function breakCombo(state) {
  return { ...state, combo: 0, comboExpiresAt: null };
}

export function toggleHabit(state, habitId) {
  return {
    ...state,
    habits: state.habits.map(h => h.id === habitId ? { ...h, done: !h.done } : h),
  };
}

export function claimMilestone(state, milestone) {
  return {
    ...state,
    claimedMilestones: [...(state.claimedMilestones || []), milestone],
    xp: state.xp + 200,
  };
}
