/**
 * Interface sounds: soft, short tones made with the Web Audio API (no audio files to download).
 * - tap:    a click on a button, link or card
 * - open / close: an FAQ answer, a menu or a dropdown opens or closes
 * - select: a step, module, filter or tab is picked
 * - tick:   a slider moves (throttled)
 * - done:   a form is sent
 * Always on and barely there: low volume, rounded by a low-pass filter, no switch. The audio starts only after the
 * first click or key press (browsers require it).
 */
type Sound = 'tap' | 'open' | 'close' | 'select' | 'tick' | 'done';

// The old footer switch saved "off" here; sound is always on now, so the saved choice is cleared.
try { localStorage.removeItem('spind-sound'); } catch { /* storage blocked */ }

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
function audio(): AudioContext | null {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.4;
    // A low-pass keeps every tone soft and round, never sharp.
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2200;
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
    // About half as loud as before (-5 to -6 dB), a little lower and shorter.
    case 'tap': tone(740, 0, 0.06, 0.035, 560); break;
    case 'select': tone(620, 0, 0.08, 0.03); tone(930, 0.035, 0.09, 0.02); break;
    case 'open': tone(523, 0, 0.1, 0.028); tone(784, 0.045, 0.12, 0.024); break;
    case 'close': tone(784, 0, 0.09, 0.024); tone(523, 0.04, 0.1, 0.02); break;
    case 'tick': {
      const now = performance.now();
      if (now - lastTick < 60) return;
      lastTick = now;
      tone(1200, 0, 0.02, 0.012);
      break;
    }
    case 'done': tone(523, 0, 0.2, 0.03); tone(659, 0.09, 0.2, 0.026); tone(784, 0.18, 0.28, 0.026); break;
  }
}

/* Wiring: one set of listeners on the document covers every page and component. */
const TAP = 'a[href], button, [role="button"], [data-sound="tap"]';
const SELECT = '[data-step], [data-module-btn], [data-filter], [aria-pressed]';

document.addEventListener('click', (e) => {
  const el = (e.target as Element).closest<HTMLElement>(`${SELECT}, summary, [aria-expanded], ${TAP}`);
  if (!el || el.matches('[disabled], [aria-disabled="true"]')) return;
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
