chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PROBLEM_SOLVED') {
    chrome.storage.local.get(['solvedProblems'], (result) => {
      let solved = result.solvedProblems || [];
      solved.push({ title: message.data.title, timestamp: Date.now() });
      chrome.storage.local.set({ solvedProblems: solved });
    });
  }
});
