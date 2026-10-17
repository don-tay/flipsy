let ctx: AudioContext | null = null;
let muted = false;

export const setMuted = (m: boolean) => (muted = m);

const audio = (): AudioContext | null => {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
};

if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', () => audio(), { once: true });
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.12) {
  const c = audio();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  const t0 = c.currentTime + start;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export type Sfx = 'flip' | 'match' | 'miss' | 'win' | 'draw' | 'turn';

const SOUNDS: Record<Sfx, () => void> = {
  flip: () => tone(520, 0, 0.07, 'triangle'),
  match: () => {
    tone(660, 0, 0.12, 'sine');
    tone(880, 0.09, 0.18, 'sine');
  },
  miss: () => tone(220, 0, 0.18, 'sawtooth', 0.05),
  turn: () => tone(400, 0, 0.06, 'sine', 0.06),
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.25, 'triangle')),
  draw: () => [440, 392].forEach((f, i) => tone(f, i * 0.15, 0.25, 'triangle')),
};

const VIBES: Partial<Record<Sfx, number | number[]>> = { flip: 10, match: [20, 40, 20], miss: 40, win: [60, 60, 60, 60, 120] };

export function play(name: Sfx, haptic = true): void {
  if (muted) return;
  SOUNDS[name]();
  const v = VIBES[name];
  if (haptic && v && 'vibrate' in navigator) navigator.vibrate(v);
}
