/**
 * Revision Store (Spaced Repetition System)
 */

const STORAGE_KEY = 'ln_revision_state';

// intervals in days
const REVISION_INTERVALS = [1, 3, 7, 15, 30];

const INITIAL_STATE = {
  problemLogs: {} // { question_id: { status: 'solved'|'failed', timestamp: number, step: number, nextRevisionDate: "YYYY-MM-DD", history: [] } }
};

export const getRevisionState = () => {
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

// Formats date to YYYY-MM-DD
const formatDate = (date) => date.toISOString().split('T')[0];

const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
};

export const logProblemStatus = (questionId, status, mistakesCount = 0) => {
  const state = getRevisionState();
  const today = formatDate(new Date());

  if (!state.problemLogs[questionId]) {
    state.problemLogs[questionId] = {
      status,
      timestamp: Date.now(),
      step: 0,
      nextRevisionDate: addDays(today, REVISION_INTERVALS[0]),
      history: []
    };
  } else {
    // Existing log update
    const log = state.problemLogs[questionId];
    log.status = status;
    log.timestamp = Date.now();
    
    // If just solved, progress step, else reset
    if (status === 'solved') {
      log.step = Math.min(log.step + 1, REVISION_INTERVALS.length - 1);
      log.nextRevisionDate = addDays(today, REVISION_INTERVALS[log.step]);
    } else {
      log.step = 0; // forgot
      log.nextRevisionDate = today; // due immediately
    }
  }

  state.problemLogs[questionId].history.push({
    date: today,
    status,
    mistakesCount
  });

  saveState(state);
  return state;
};

export const getRevisionsDueToday = () => {
  const state = getRevisionState();
  const today = formatDate(new Date());
  
  const due = Object.entries(state.problemLogs).filter(([id, log]) => {
    return log.nextRevisionDate <= today;
  }).map(([id, log]) => ({ id, ...log }));
  
  return due;
};

export const markRevision = (questionId, remembered) => {
  if (remembered) {
    return logProblemStatus(questionId, 'solved', 0);
  } else {
    return logProblemStatus(questionId, 'failed', 1);
  }
};

export const getTotalSolvedCount = () => {
    const state = getRevisionState();
    return Object.values(state.problemLogs).filter(log => log.status === 'solved').length;
};
