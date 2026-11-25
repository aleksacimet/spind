/**
 * Interface sounds: soft, short tones made with the Web Audio API (no audio files to download).
 * - tap:    a click on a button, link or card
 * - open / close: an FAQ answer, a menu or a dropdown opens or closes
 * - select: a step, module, filter or tab is picked
 * - tick:   a slider moves (throttled)
 * - done:   a form is sent
 * Everything stays very quiet. The audio starts only after the first click or key press (browsers require it),
 * and the footer has a Sound on/off switch that is remembered in this browser.
 */
type Sound = 'tap' | 'open' | 'close' | 'select' | 'tick' | 'done';

const KEY = 'spind-sound';
let on = true;
try { on = localStorage.getItem(KEY) !== 'off'; } catch { /* storage blocked: sound stays on */ }

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
function audio(): AudioContext | null {
  if (!on) return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    // A gentle low-pass keeps every tone round, never sharp.
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 3200;
    master.connect(lp).connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** One soft sine tone with a fast attack and a short exponential fade. */
function tone(freq: number, start: number, dur: number, vol: number, endFreq?: number) {
  const c = ctx!;
  const t = c.currentTime + start;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, t);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master!);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

let lastTick = 0;
export function play(kind: Sound) {
  if (!audio()) return;
  switch (kind) {
    case 'tap': tone(880, 0, 0.07, 0.05, 620); break;
    case 'select': tone(660, 0, 0.09, 0.045); tone(990, 0.04, 0.1, 0.03); break;
    case 'open': tone(523, 0, 0.12, 0.04); tone(784, 0.05, 0.14, 0.035); break;
    case 'close': tone(784, 0, 0.1, 0.035); tone(523, 0.04, 0.12, 0.03); break;
    case 'tick': {
      const now = performance.now();
      if (now - lastTick < 45) return;
      lastTick = now;
      tone(1400, 0, 0.025, 0.018);
      break;
    }
    case 'done': tone(523, 0, 0.22, 0.04); tone(659, 0.09, 0.22, 0.035); tone(784, 0.18, 0.32, 0.035); break;
  }
}

/* Wiring: one set of listeners on the document covers every page and component. */
const TAP = 'a[href], button, [role="button"], [data-sound="tap"]';
const SELECT = '[data-step], [data-module-btn], [data-filter], [aria-pressed]';

document.addEventListener('click', (e) => {
  const el = (e.target as Element).closest<HTMLElement>(`${SELECT}, summary, [aria-expanded], ${TAP}`);
  if (!el || el.matches('[disabled], [aria-disabled="true"], [data-sound-toggle]')) return;
  if (el.matches('summary')) return; // handled by the details toggle below
  if (el.matches('[aria-expanded]')) {
    // aria-expanded is updated by the click handler, so read it right after.
    queueMicrotask(() => play(el.getAttribute('aria-expanded') === 'true' ? 'open' : 'close'));
    return;
  }
  play(el.matches(SELECT) ? 'select' : 'tap');
});

document.querySelectorAll('details').forEach((d) => d.addEventListener('toggle', () => {
  if (ctx || navigator.userActivation?.hasBeenActive) play(d.open ? 'open' : 'close');
}));

document.addEventListener('input', (e) => {
  if ((e.target as HTMLInputElement).type === 'range') play('tick');
});

document.addEventListener('spind:sent', () => play('done'));

/* Footer switch */
function syncToggles() {
  document.querySelectorAll<HTMLButtonElement>('[data-sound-toggle]').forEach((b) => {
    b.setAttribute('aria-pressed', String(on));
    const label = b.querySelector('[data-sound-state]');
    if (label) label.textContent = on ? (b.dataset.on ?? 'On') : (b.dataset.off ?? 'Off');
  });
}
document.querySelectorAll<HTMLButtonElement>('[data-sound-toggle]').forEach((b) => b.addEventListener('click', () => {
  on = !on;
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* not remembered */ }
  syncToggles();
  if (on) play('select');
  else if (ctx) void ctx.suspend();
}));
syncToggles();
