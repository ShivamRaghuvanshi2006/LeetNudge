/**
 * Progression Store
 * Handles XP, Streaks, Daily Rewards, and Cosmetics Unlocks
 */

const STORAGE_KEY = 'ln_progression_state';

const INITIAL_STATE = {
  xp: 0,
  shards: 100, // Premium currency
  level: 1,
  rank: 'Bronze',
  currentStreak: 0,
  maxStreak: 0,
  lastLogin: null, // "YYYY-MM-DD"
  unlockedCosmetics: {
    avatars: ['default'],
    borders: ['default'],
    titles: ['Novice'],
    themes: ['neo-brutalist']
  },
  equipped: {
    avatar: 'default',
    border: 'default',
    title: 'Novice',
    theme: 'neo-brutalist'
  },
  loginHistory: [] // Array of "YYYY-MM-DD"
};

export const getProgressionState = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? { ...INITIAL_STATE, ...JSON.parse(data) } : INITIAL_STATE;
  } catch (e) {
    return INITIAL_STATE;
  }
};

const saveState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const addXp = (amount) => {
  const state = getProgressionState();
  state.xp += amount;
  
  // Calculate level
  const levels = [0, 200, 500, 1000, 2000, 5000, 10000];
  let newLevel = 1;
  for (let i = 0; i < levels.length; i++) {
    if (state.xp >= levels[i]) newLevel = i + 1;
  }
  state.level = newLevel;

  // Rank Mapping
  const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master'];
  state.rank = ranks[Math.min(Math.floor((newLevel - 1) / 2), ranks.length - 1)];

  saveState(state);
  return state;
};

export const processDailyLogin = () => {
  const state = getProgressionState();
  const today = new Date().toISOString().split('T')[0];

  if (state.lastLogin === today) return state; // Already logged in today
  
  if (state.lastLogin) {
    const lastDate = new Date(state.lastLogin);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays === 1) {
      // Continuous streak
      state.currentStreak += 1;
    } else {
      // Soft penalty: instead of resetting to 0 immediately, we drop by diffDays - 1 if it's longer
      // or if you missed 1 day, drop slightly. Actually prompt said: Handle missed days with soft penalties (avoid harsh resets).
      const penalty = diffDays * 2;
      state.currentStreak = Math.max(0, state.currentStreak - penalty);
    }
  } else {
    state.currentStreak = 1;
  }

  state.maxStreak = Math.max(state.maxStreak, state.currentStreak);
  state.lastLogin = today;
  if (!state.loginHistory.includes(today)) {
    state.loginHistory.push(today);
  }

  // Rewards for streaks
  if (state.currentStreak >= 3 && !state.unlockedCosmetics.titles.includes('Consistent Coder')) {
    state.unlockedCosmetics.titles.push('Consistent Coder');
  }
  if (state.currentStreak >= 7 && !state.unlockedCosmetics.themes.includes('dark-mode')) {
    state.unlockedCosmetics.themes.push('dark-mode');
  }
  if (state.currentStreak >= 30 && !state.unlockedCosmetics.titles.includes('streak-god')) {
    state.unlockedCosmetics.titles.push('streak-god');
  }

  // Daily base reward
  state.xp += 100;
  state.shards += 10;
  
  saveState(state);
  return state;
};

export const equipCosmetic = (type, id) => {
  const state = getProgressionState();
  if (state.unlockedCosmetics[`${type}s`]?.includes(id) || type === 'avatar') {
    state.equipped[type] = id;
    saveState(state);
    return true;
  }
  return false;
};
