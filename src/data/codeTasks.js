// ─── CODE SUS — Task Pool ──────────────────────────────────────────
// Each task has code lines with embedded bugs.
// Bugs have 1 correct fix + several believable distractors.

export const PLAYER_COLORS = [
  { name: 'Red',    bg: '#EF4444', light: '#FCA5A5', dark: '#991B1B', visor: '#B3D9FF' },
  { name: 'Blue',   bg: '#3B82F6', light: '#93C5FD', dark: '#1E3A8A', visor: '#B3D9FF' },
  { name: 'Green',  bg: '#22C55E', light: '#86EFAC', dark: '#166534', visor: '#B3D9FF' },
  { name: 'Yellow', bg: '#EAB308', light: '#FDE047', dark: '#854D0E', visor: '#B3D9FF' },
  { name: 'Purple', bg: '#A855F7', light: '#D8B4FE', dark: '#6B21A8', visor: '#B3D9FF' },
  { name: 'Orange', bg: '#F97316', light: '#FDBA74', dark: '#9A3412', visor: '#B3D9FF' },
  { name: 'Pink',   bg: '#EC4899', light: '#F9A8D4', dark: '#9D174D', visor: '#B3D9FF' },
  { name: 'Cyan',   bg: '#06B6D4', light: '#67E8F9', dark: '#155E75', visor: '#B3D9FF' },
];

export const BOT_NAMES = [
  'ByteBot', 'NullPtr', 'StackFlow', 'DevDude',
  'BugHunter', 'AlgoAce', 'CodeNinja', 'PixelPete',
  'DataDan', 'LogicLee', 'SyntaxSam', 'CompileKid',
];

// ─── Syntax highlighting helpers ───────────────────────────────────
export const KEYWORDS = [
  'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for',
  'while', 'class', 'new', 'this', 'true', 'false', 'null', 'def',
  'int', 'void', 'static', 'public', 'private', 'break', 'continue',
  'switch', 'case', 'default', 'try', 'catch', 'throw', 'import',
  'export', 'from', 'of', 'in',
];

// ─── Task Pool ─────────────────────────────────────────────────────
export const CODE_TASKS = [
  {
    id: 'array_sum',
    title: 'Array Sum Calculator',
    description: 'Returns the sum of all elements in an array',
    lines: [
      { num: 1,  text: 'function arraySum(arr) {' },
      { num: 2,  text: '  let total = 0;' },
      { num: 3,  text: '  for (let i = 0; i < arr.length; i++) {' },
      { num: 4,  text: '    total -= arr[i];', isBug: true, bugId: 'b1' },
      { num: 5,  text: '  }' },
      { num: 6,  text: '  return total;' },
      { num: 7,  text: '}' },
    ],
    bugs: [{
      id: 'b1', lineNum: 4,
      buggy:   '    total -= arr[i];',
      fix:     '    total += arr[i];',
      fakes:   ['    total *= arr[i];', '    total = arr[i];', '    total /= arr[i];'],
    }],
  },
  {
    id: 'find_max',
    title: 'Find Maximum Element',
    description: 'Returns the largest element in an array',
    lines: [
      { num: 1,  text: 'function findMax(arr) {' },
      { num: 2,  text: '  let max = Infinity;', isBug: true, bugId: 'b2' },
      { num: 3,  text: '  for (let i = 0; i < arr.length; i++) {' },
      { num: 4,  text: '    if (arr[i] > max) {' },
      { num: 5,  text: '      max = arr[i];' },
      { num: 6,  text: '    }' },
      { num: 7,  text: '  }' },
      { num: 8,  text: '  return max;' },
      { num: 9,  text: '}' },
    ],
    bugs: [{
      id: 'b2', lineNum: 2,
      buggy:   '  let max = Infinity;',
      fix:     '  let max = -Infinity;',
      fakes:   ['  let max = 0;', '  let max = null;', '  let max = arr[0] + 1;'],
    }],
  },
  {
    id: 'reverse_string',
    title: 'String Reversal',
    description: 'Reverses a given string character by character',
    lines: [
      { num: 1,  text: 'function reverseStr(s) {' },
      { num: 2,  text: '  let result = "";' },
      { num: 3,  text: '  for (let i = 0; i < s.length; i++) {', isBug: true, bugId: 'b3' },
      { num: 4,  text: '    result += s[i];' },
      { num: 5,  text: '  }' },
      { num: 6,  text: '  return result;' },
      { num: 7,  text: '}' },
    ],
    bugs: [{
      id: 'b3', lineNum: 3,
      buggy:   '  for (let i = 0; i < s.length; i++) {',
      fix:     '  for (let i = s.length - 1; i >= 0; i--) {',
      fakes:   ['  for (let i = s.length; i > 0; i--) {', '  for (let i = 1; i <= s.length; i++) {'],
    }],
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Number',
    description: 'Returns the nth Fibonacci number',
    lines: [
      { num: 1,  text: 'function fib(n) {' },
      { num: 2,  text: '  if (n <= 0) return 0;' },
      { num: 3,  text: '  if (n === 1) return 1;' },
      { num: 4,  text: '  return fib(n - 1) * fib(n - 2);', isBug: true, bugId: 'b4' },
      { num: 5,  text: '}' },
    ],
    bugs: [{
      id: 'b4', lineNum: 4,
      buggy:   '  return fib(n - 1) * fib(n - 2);',
      fix:     '  return fib(n - 1) + fib(n - 2);',
      fakes:   ['  return fib(n - 1) - fib(n - 2);', '  return fib(n) + fib(n - 1);'],
    }],
  },
  {
    id: 'is_palindrome',
    title: 'Palindrome Checker',
    description: 'Checks if a string reads the same forwards and backwards',
    lines: [
      { num: 1,  text: 'function isPalindrome(s) {' },
      { num: 2,  text: '  let left = 0;' },
      { num: 3,  text: '  let right = s.length;', isBug: true, bugId: 'b5' },
      { num: 4,  text: '  while (left < right) {' },
      { num: 5,  text: '    if (s[left] !== s[right]) return false;' },
      { num: 6,  text: '    left++; right--;' },
      { num: 7,  text: '  }' },
      { num: 8,  text: '  return true;' },
      { num: 9,  text: '}' },
    ],
    bugs: [{
      id: 'b5', lineNum: 3,
      buggy:   '  let right = s.length;',
      fix:     '  let right = s.length - 1;',
      fakes:   ['  let right = s.length + 1;', '  let right = s.length / 2;'],
    }],
  },
  {
    id: 'bubble_sort',
    title: 'Bubble Sort',
    description: 'Sorts an array in ascending order using bubble sort',
    lines: [
      { num: 1,  text: 'function bubbleSort(arr) {' },
      { num: 2,  text: '  for (let i = 0; i < arr.length; i++) {' },
      { num: 3,  text: '    for (let j = 0; j < arr.length - i - 1; j++) {' },
      { num: 4,  text: '      if (arr[j] < arr[j+1]) {', isBug: true, bugId: 'b6' },
      { num: 5,  text: '        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];' },
      { num: 6,  text: '      }' },
      { num: 7,  text: '    }' },
      { num: 8,  text: '  }' },
      { num: 9,  text: '  return arr;' },
      { num: 10, text: '}' },
    ],
    bugs: [{
      id: 'b6', lineNum: 4,
      buggy:   '      if (arr[j] < arr[j+1]) {',
      fix:     '      if (arr[j] > arr[j+1]) {',
      fakes:   ['      if (arr[j] >= arr[j+1]) {', '      if (arr[j] === arr[j+1]) {', '      if (arr[j] != arr[j+1]) {'],
    }],
  },
  {
    id: 'binary_search',
    title: 'Binary Search',
    description: 'Searches for a target value in a sorted array',
    lines: [
      { num: 1,  text: 'function binarySearch(arr, target) {' },
      { num: 2,  text: '  let lo = 0, hi = arr.length - 1;' },
      { num: 3,  text: '  while (lo <= hi) {' },
      { num: 4,  text: '    let mid = (lo + hi) * 2;', isBug: true, bugId: 'b7' },
      { num: 5,  text: '    if (arr[mid] === target) return mid;' },
      { num: 6,  text: '    if (arr[mid] < target) lo = mid + 1;' },
      { num: 7,  text: '    else hi = mid - 1;' },
      { num: 8,  text: '  }' },
      { num: 9,  text: '  return -1;' },
      { num: 10, text: '}' },
    ],
    bugs: [{
      id: 'b7', lineNum: 4,
      buggy:   '    let mid = (lo + hi) * 2;',
      fix:     '    let mid = Math.floor((lo + hi) / 2);',
      fakes:   ['    let mid = (lo + hi) / 2;', '    let mid = lo + hi >> 2;'],
    }],
  },
  {
    id: 'factorial',
    title: 'Factorial Calculator',
    description: 'Returns n! (n factorial)',
    lines: [
      { num: 1, text: 'function factorial(n) {' },
      { num: 2, text: '  if (n <= 1) return 1;' },
      { num: 3, text: '  return n + factorial(n - 1);', isBug: true, bugId: 'b8' },
      { num: 4, text: '}' },
    ],
    bugs: [{
      id: 'b8', lineNum: 3,
      buggy:   '  return n + factorial(n - 1);',
      fix:     '  return n * factorial(n - 1);',
      fakes:   ['  return n - factorial(n - 1);', '  return n * factorial(n);'],
    }],
  },
  {
    id: 'count_vowels',
    title: 'Vowel Counter',
    description: 'Counts the number of vowels in a string',
    lines: [
      { num: 1,  text: 'function countVowels(str) {' },
      { num: 2,  text: '  let count = 0;' },
      { num: 3,  text: '  const vowels = "aeiou";', isBug: true, bugId: 'b9' },
      { num: 4,  text: '  for (let ch of str.toLowerCase()) {' },
      { num: 5,  text: '    if (vowels.includes(ch)) count++;' },
      { num: 6,  text: '  }' },
      { num: 7,  text: '  return count;' },
      { num: 8,  text: '}' },
    ],
    bugs: [{
      id: 'b9', lineNum: 3,
      buggy:   '  const vowels = "aeiou";',
      fix:     '  const vowels = "aeiouAEIOU";',
      fakes:   ['  const vowels = "aeio";', '  const vowels = "aeioubc";'],
    }],
  },
  {
    id: 'power_func',
    title: 'Power Function',
    description: 'Calculates base raised to exponent',
    lines: [
      { num: 1, text: 'function power(base, exp) {' },
      { num: 2, text: '  let result = 0;', isBug: true, bugId: 'b10' },
      { num: 3, text: '  for (let i = 0; i < exp; i++) {' },
      { num: 4, text: '    result *= base;' },
      { num: 5, text: '  }' },
      { num: 6, text: '  return result;' },
      { num: 7, text: '}' },
    ],
    bugs: [{
      id: 'b10', lineNum: 2,
      buggy:   '  let result = 0;',
      fix:     '  let result = 1;',
      fakes:   ['  let result = base;', '  let result = -1;'],
    }],
  },
];

// Shuffle helper
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick N random tasks from the pool
export function pickTasks(count = 4) {
  return shuffle(CODE_TASKS).slice(0, count).map(t => ({
    ...t,
    lines: t.lines.map(l => ({ ...l })),
    bugs: t.bugs.map(b => ({ ...b, fixed: false, sabotaged: false })),
  }));
}

// Get all fix options for a bug (shuffled: fix + fakes)
export function getOptions(bug) {
  return shuffle([bug.fix, ...bug.fakes]);
}
