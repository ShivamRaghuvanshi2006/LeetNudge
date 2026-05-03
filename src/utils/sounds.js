// LeetNudge SFX Engine — Procedural Web Audio API Sounds
// Minimal, aesthetic sound effects

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function resumeCtx() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// Subtle click — short pop
export function playClick() {
  try {
    const ctx = resumeCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) { /* silent fail */ }
}

// Very subtle hover blip
export function playHover() {
  try {
    const ctx = resumeCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) { /* silent fail */ }
}

// Navigation tab switch — soft pop
export function playNav() {
  try {
    const ctx = resumeCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) { /* silent fail */ }
}

// Success — ascending two-note chime
export function playSuccess() {
  try {
    const ctx = resumeCtx();
    [523, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
  } catch (e) { /* silent fail */ }
}

// Notification — soft bell ding
export function playNotification() {
  try {
    const ctx = resumeCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1047, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(523, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) { /* silent fail */ }
}

// Error — low buzz
export function playError() {
  try {
    const ctx = resumeCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) { /* silent fail */ }
}

// Whoosh — for modals opening
export function playWhoosh() {
  try {
    const ctx = resumeCtx();
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
    filter.Q.setValueAtTime(2, ctx.currentTime);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
  } catch (e) { /* silent fail */ }
}

let ambientOsc = null;
let ambientGain = null;

export function startAmbient() {
  try {
    if (ambientOsc) return;
    const ctx = resumeCtx();
    ambientOsc = ctx.createOscillator();
    ambientGain = ctx.createGain();
    
    // Very low drone sound
    ambientOsc.type = 'triangle';
    ambientOsc.frequency.setValueAtTime(55, ctx.currentTime); // Low A
    
    // Detuned second oscillator for chorus
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(55.5, ctx.currentTime);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, ctx.currentTime);

    // LFO for slow volume modulation (pulsing)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.05, ctx.currentTime);
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.005, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(ambientGain.gain);
    
    ambientOsc.connect(filter);
    osc2.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(ctx.destination);
    
    // Very quiet base volume
    ambientGain.gain.setValueAtTime(0.015, ctx.currentTime);
    
    ambientOsc.start();
    osc2.start();
    lfo.start();
    
    // Store reference to stop later
    ambientOsc.osc2 = osc2;
    ambientOsc.lfo = lfo;
  } catch(e) {}
}

export function stopAmbient() {
  try {
    if (ambientOsc) {
      const ctx = getCtx();
      ambientGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.5);
      setTimeout(() => {
        ambientOsc?.stop();
        ambientOsc?.osc2?.stop();
        ambientOsc?.lfo?.stop();
        ambientOsc = null;
      }, 1000);
    }
  } catch(e) {}
}

let gameTrackInterval = null;
let gameTrackPlaying = false;

// Intense Game Loop Background Music
export function startGameTrack() {
  try {
    if (gameTrackPlaying) return;
    gameTrackPlaying = true;
    const ctx = resumeCtx();

    // Bassline sequence loop
    const notes = [110, 110, 130.81, 146.83, 110, 110, 98, 103.83];
    let noteIdx = 0;

    gameTrackInterval = setInterval(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(notes[noteIdx], ctx.currentTime);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);

      // Add high arpeggio every few beats
      if (noteIdx % 2 === 0) {
        const arp = ctx.createOscillator();
        const aGain = ctx.createGain();
        arp.connect(aGain);
        aGain.connect(ctx.destination);
        arp.type = 'square';
        arp.frequency.setValueAtTime(notes[noteIdx] * 4, ctx.currentTime);
        aGain.gain.setValueAtTime(0.015, ctx.currentTime);
        aGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        arp.start(ctx.currentTime);
        arp.stop(ctx.currentTime + 0.1);
      }

      noteIdx = (noteIdx + 1) % notes.length;
    }, 250); // 4 beats per second
  } catch (e) { /* silent fail */ }
}

export function stopGameTrack() {
  if (gameTrackInterval) clearInterval(gameTrackInterval);
  gameTrackPlaying = false;
}

// Intense distored hit sound
export function playHeavyHit() {
  try {
    const ctx = resumeCtx();
    const bufferSize = ctx.sampleRate * 0.3; // 300ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // white noise
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.3);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start(ctx.currentTime);
  } catch(e) {}
}

export function playVictoryChime() {
  try {
    const ctx = resumeCtx();
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.5);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.5);
    });
  } catch(e) {}
}

