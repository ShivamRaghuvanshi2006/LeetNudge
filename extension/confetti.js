window.triggerSuccessFlow = () => {
    const successOverlay = document.createElement('div');
    successOverlay.className = 'ln-extension-root ln-success-overlay';
    
    successOverlay.innerHTML = `
      <canvas id="ln-confetti-canvas"></canvas>
      <div style="z-index: 1; text-align: center;">
        <h1 style="font-size: 3rem; margin-bottom: 2rem;">Problem Solved</h1>
        <div class="ln-glass" style="padding: 2rem;">
          <h3 style="margin-bottom: 1rem;">Recommended Next Steps</h3>
          
          <div class="ln-row-item ln-row-green">
            <div><strong>Two Sum</strong> | Array <span style="font-size: 11px; color:var(--ln-muted); margin-left: 8px;">Solidify basics</span></div>
            <div style="color: var(--ln-green)">Easy</div>
          </div>
          
          <div class="ln-row-item ln-row-orange">
            <div><strong>3Sum</strong> | Two Pointers <span style="font-size: 11px; color:var(--ln-muted); margin-left: 8px;">Level up</span></div>
            <div style="color: var(--ln-orange)">Medium</div>
          </div>
          <div class="ln-row-item ln-row-orange">
            <div><strong>Container With Most Water</strong> <span style="font-size: 11px; color:var(--ln-muted); margin-left: 8px;">Explore boundaries</span></div>
            <div style="color: var(--ln-orange)">Medium</div>
          </div>
          <div class="ln-row-item ln-row-orange">
            <div><strong>Longest Substring</strong> <span style="font-size: 11px; color:var(--ln-muted); margin-left: 8px;">Practice mapping</span></div>
            <div style="color: var(--ln-orange)">Medium</div>
          </div>
          
          <div class="ln-row-item ln-row-red">
            <div><strong>Trapping Rain Water</strong> <span style="font-size: 11px; color:var(--ln-muted); margin-left: 8px;">Challenge memory limits</span></div>
            <div style="color: var(--ln-red)">Hard</div>
          </div>
          
          <button class="ln-btn ln-btn-primary" style="margin-top: 2rem; width: 100%" onclick="this.closest('.ln-success-overlay').classList.remove('active')">Continue Coding</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(successOverlay);
    setTimeout(() => {
      successOverlay.classList.add('active');
      triggerConfettiParticles();
    }, 100);
};

function triggerConfettiParticles() {
  const canvas = document.getElementById('ln-confetti-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const colors = ['#2ecc71', '#27ae60', '#f1c40f'];
  
  for(let i=0; i<120; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2 + 100,
      r: Math.random() * 4 + 2,
      dx: Math.random() * 10 - 5,
      dy: Math.random() * -10 - 5,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    for(let i=0; i<particles.length; i++) {
      let p = particles[i];
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.2; 
      if(p.y < canvas.height) active = true;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    if(active) requestAnimationFrame(animate);
  }
  animate();
}
