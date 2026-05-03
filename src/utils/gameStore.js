/**
 * Code Sus - Central Game Store
 * Manages XP, Shards, Levels, and History via LocalStorage
 */

const STORAGE_KEY = 'leetnudge_game_state';

const INITIAL_STATE = {
  xp: 0,
  shards: 100,
  level: 1,
  rank: 'Bronze',
  totalWins: 0,
  totalMatches: 0,
  totalBugsFixed: 0,
  matchHistory: [],
  calendar: {}, // { "YYYY-MM-DD": { xp, matches, bugs } }
  dailyChallenge: {
    lastCompleted: null,
    streak: 0
  }
};

export const getGameState = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? { ...INITIAL_STATE, ...JSON.parse(data) } : INITIAL_STATE;
  } catch (e) {
    return INITIAL_STATE;
  }
};

export const saveGameState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const addXpAndShards = (xpAmount, shardAmount, stats = {}) => {
  const state = getGameState();
  const today = new Date().toISOString().split('T')[0];

  // Update totals
  state.xp += xpAmount;
  state.shards += shardAmount;
  state.totalBugsFixed += (stats.bugsFixed || 0);
  
  // Calculate Level (Thresholds: 200, 500, 1000, 2000, 5000...)
  const levels = [0, 200, 500, 1000, 2000, 5000, 10000];
  let newLevel = 1;
  for (let i = 0; i < levels.length; i++) {
    if (state.xp >= levels[i]) newLevel = i + 1;
  }
  state.level = newLevel;

  // Ranks
  const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master'];
  state.rank = ranks[Math.min(Math.floor((newLevel - 1) / 2), ranks.length - 1)];

  // Update Activity Calendar
  if (!state.calendar[today]) {
    state.calendar[today] = { xp: 0, matches: 0, bugs: 0 };
  }
  state.calendar[today].xp += xpAmount;
  state.calendar[today].matches += 1;
  state.calendar[today].bugs += (stats.bugsFixed || 0);

  // Add to History
  state.totalMatches += 1;
  if (stats.won) state.totalWins += 1;
  
  state.matchHistory.unshift({
    date: new Date().toISOString(),
    won: stats.won,
    xpGained: xpAmount,
    shardsGained: shardAmount,
    role: stats.role,
    bugsFixed: stats.bugsFixed
  });

  // Keep history reasonable
  if (state.matchHistory.length > 50) state.matchHistory.pop();

  saveGameState(state);
  return state;
};

export const spendShards = (amount) => {
  const state = getGameState();
  if (state.shards >= amount) {
    state.shards -= amount;
    saveGameState(state);
    return true;
  }
  return false;
};
