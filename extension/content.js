let pasteBlocked = true;

document.addEventListener('paste', (e) => {
  if (pasteBlocked) {
    e.preventDefault();
    alert('Paste action detected and blocked during competitive mode.');
  }
});

function detectCompletion() {
  const successMessage = document.querySelector('.success-message-class, [data-e2e-locator="submission-result"]');
  if (successMessage && successMessage.textContent.includes('Accepted')) {
    chrome.runtime.sendMessage({ type: 'PROBLEM_SOLVED', data: { title: document.title } });
  }
}

setInterval(detectCompletion, 3000);
