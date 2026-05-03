const overlayHTML = `
  <div id="pt-overlay">
    <div class="pt-header" id="pt-drag-handle">
      <span>Assistant</span>
      <span style="cursor:pointer;" id="pt-close">X</span>
    </div>
    <div class="pt-content">
      <div style="margin-bottom:12px; display: flex; justify-content: space-between">Time Spent: <span id="pt-timer">00:00</span></div>
      <div style="margin-bottom:20px; display: flex; justify-content: space-between">Typing Speed: <span class="text-green">55 WPM</span></div>
      <button class="btn btn-primary" style="width:100%;">Get Hint</button>
    </div>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', overlayHTML);

const overlay = document.getElementById('pt-overlay');
const handle = document.getElementById('pt-drag-handle');
const closeBtn = document.getElementById('pt-close');

let isDragging = false;
let offsetX, offsetY;

handle.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - overlay.offsetLeft;
  offsetY = e.clientY - overlay.offsetTop;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  overlay.style.left = (e.clientX - offsetX) + 'px';
  overlay.style.top = (e.clientY - offsetY) + 'px';
  overlay.style.bottom = 'auto';
  overlay.style.right = 'auto';
});

document.addEventListener('mouseup', () => { isDragging = false; });
closeBtn.addEventListener('click', () => { overlay.classList.add('pt-hidden'); });
