// Tiny synthesized SFX via Web Audio oscillators — no audio files to ship
// or load. Muted state persists (device-level, like language). Every call
// is wrapped so a browser without AudioContext just silently no-ops.

const Sound = {
  ctx: null,
  muted: false,

  init() {
    this.muted = localStorage.getItem("dq:muted") === "1";
  },

  isMuted() {
    return this.muted;
  },

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("dq:muted", this.muted ? "1" : "0");
    return this.muted;
  },

  ensureCtx() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      this.ctx = new Ctx();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  },

  tone(freq, duration, type = "sine", peakGain = 0.15, delay = 0) {
    if (this.muted) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    try {
      const start = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(peakGain, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.02);
    } catch {
      // audio is a nice-to-have, never worth breaking the app over
    }
  },

  correct() {
    this.tone(660, 0.11, "sine", 0.14);
    this.tone(880, 0.15, "sine", 0.12, 0.08);
  },

  wrong() {
    this.tone(200, 0.22, "sawtooth", 0.07);
  },

  levelUp() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.18, "triangle", 0.12, i * 0.08));
  },

  achievement() {
    [784, 988, 1318].forEach((f, i) => this.tone(f, 0.16, "sine", 0.13, i * 0.07));
  },

  goalComplete() {
    [523, 659, 784, 988, 1318].forEach((f, i) => this.tone(f, 0.2, "triangle", 0.13, i * 0.07));
  },

  combo() {
    this.tone(740, 0.09, "square", 0.1);
    this.tone(988, 0.12, "square", 0.1, 0.06);
  },

  bonus() {
    [660, 880, 1108, 1318, 1568].forEach((f, i) => this.tone(f, 0.14, "triangle", 0.12, i * 0.055));
  },

  tap() {
    this.tone(440, 0.05, "square", 0.03);
  },
};

Sound.init();
