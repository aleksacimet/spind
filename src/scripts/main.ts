/**
 * Site behaviour. Everything degrades to a static, fully visible page without JS.
 * - grid fit on resize / font load
 * - header state, mobile menu, active nav
 * - reveals (fade, drawer clip, title lines)
 * - hero: random drawers open and close
 * - how it works: scroll story drives the locker screen
 * - modules highlight, counters, LISSA mock tabs
 */
import { initContactForm } from './form';
import { initCalc } from './calc';

declare global { interface Window { __gridFit?: () => void } }

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionOK = () => !reduceMotion.matches;

/* ---------- Grid fit ---------- */
let fitTimer = 0;
const refit = () => { window.clearTimeout(fitTimer); fitTimer = window.setTimeout(() => window.__gridFit?.(), 120); };
let lastW = window.innerWidth;
window.addEventListener('resize', () => { if (window.innerWidth !== lastW) { lastW = window.innerWidth; refit(); } }, { passive: true });
document.fonts?.ready.then(() => window.__gridFit?.());
document.querySelectorAll('details').forEach((d) => d.addEventListener('toggle', () => window.__gridFit?.()));

/* ---------- Title lines: wrap each rendered line so it can rise out of a mask ---------- */
function splitLines(el: HTMLElement) {
  const text = el.textContent?.trim() ?? '';
  if (!text) return;
  el.setAttribute('aria-label', text);
  const words = text.split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
  const spans = [...el.querySelectorAll<HTMLElement>('.w')];
  const lines: string[][] = [];
  let top = -1;
  spans.forEach((s) => {
    if (s.offsetTop !== top) { lines.push([]); top = s.offsetTop; }
    lines[lines.length - 1].push(s.textContent ?? '');
  });
  el.innerHTML = lines
    .map((l, i) => `<span class="line" aria-hidden="true" style="--li:${i}"><span>${l.join(' ')}</span></span>`)
    .join('');
}
const splitEls = [...document.querySelectorAll<HTMLElement>('[data-split]')];
if (motionOK()) {
  document.fonts?.ready.then(() => {
    splitEls.forEach(splitLines);
    window.__gridFit?.();
  });
}

/* ---------- Header and mobile menu ---------- */
const header = document.querySelector<HTMLElement>('[data-header]');
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const toggleLabel = document.querySelector<HTMLElement>('[data-menu-label]');
let menuOpen = false;
let ddOpen = false;
const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 8 || menuOpen || ddOpen);

function setMenu(open: boolean, returnFocus = true) {
  if (!toggle || !menu) return;
  menuOpen = open;
  toggle.setAttribute('aria-expanded', String(open));
  menu.hidden = !open;
  document.documentElement.classList.toggle('menu-open', open);
  if (toggleLabel) toggleLabel.textContent = open ? toggleLabel.dataset.close! : toggleLabel.dataset.open!;
  updateHeader();
  if (open) menu.querySelector<HTMLElement>('a')?.focus();
  else if (returnFocus) toggle.focus();
}
toggle?.addEventListener('click', () => setMenu(!menuOpen));
menu?.querySelectorAll('[data-menu-link]').forEach((a) => a.addEventListener('click', () => setMenu(false, false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOpen) setMenu(false);
  if (e.key === 'Tab' && menuOpen && menu && toggle) {
    const items = [toggle, ...[...menu.querySelectorAll<HTMLElement>('a, summary')].filter((el) => el.offsetParent !== null)];
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
window.matchMedia('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches && menuOpen) setMenu(false, false); });

/* ---------- Mega menu ----------
 * Disclosure pattern: each trigger is a button with aria-expanded that shows its panel.
 * Opens on click, and on hover for mouse users. Escape, a click outside or moving away closes it.
 */
const dds = [...document.querySelectorAll<HTMLElement>('[data-dd]')].map((item) => ({
  item,
  trigger: item.querySelector<HTMLButtonElement>('[data-dd-trigger]')!,
  panel: item.querySelector<HTMLElement>('[data-dd-panel]')!,
}));
let hoverTimer = 0;
function setDD(target: (typeof dds)[number] | null) {
  dds.forEach((d) => {
    const open = d === target;
    d.trigger.setAttribute('aria-expanded', String(open));
    d.panel.hidden = !open;
  });
  ddOpen = !!target;
  header?.classList.toggle('dd-open', ddOpen);
  updateHeader();
}
const openDD = () => dds.find((d) => !d.panel.hidden) ?? null;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
dds.forEach((d) => {
  d.trigger.addEventListener('click', () => setDD(openDD() === d ? null : d));
  d.trigger.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setDD(d); d.panel.querySelector<HTMLElement>('a')?.focus(); }
  });
  d.item.addEventListener('mouseenter', () => {
    if (!canHover.matches) return;
    window.clearTimeout(hoverTimer);
    hoverTimer = window.setTimeout(() => setDD(d), openDD() ? 0 : 120);
  });
  d.item.addEventListener('mouseleave', () => {
    if (!canHover.matches) return;
    window.clearTimeout(hoverTimer);
    hoverTimer = window.setTimeout(() => { if (openDD() === d) setDD(null); }, 200);
  });
  d.item.addEventListener('focusout', (e) => { if (!d.item.contains(e.relatedTarget as Node)) { if (openDD() === d) setDD(null); } });
  d.panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setDD(null)));
});
document.addEventListener('keydown', (e) => {
  const d = openDD();
  if (e.key === 'Escape' && d) { setDD(null); d.trigger.focus(); }
});
document.addEventListener('click', (e) => { if (openDD() && !(e.target as Element).closest('[data-dd]')) setDD(null); });

/* ---------- How it works: scroll story ---------- */
const story = document.querySelector<HTMLElement>('[data-story]');
const storyLocker = story?.querySelector<SVGSVGElement>('[data-locker]');
const storySteps = story ? [...story.querySelectorAll<HTMLElement>('[data-step]')] : [];
const storyBars = story ? [...story.querySelectorAll<HTMLElement>('.stage-progress span')] : [];
let storyState = -1;
function setStory(i: number) {
  if (i === storyState || !storyLocker) return;
  storyState = i;
  storyLocker.dataset.state = String(Math.max(0, i));
  storySteps.forEach((s, k) => s.classList.toggle('is-active', k === i));
  storyBars.forEach((b, k) => b.classList.toggle('on', k <= i));
}
function updateStory() {
  if (!story || !storySteps.length) return;
  // The active step is the last one whose top has passed 55% of the viewport.
  const line = window.innerHeight * 0.55;
  let idx = 0;
  storySteps.forEach((s, k) => { if (s.getBoundingClientRect().top < line) idx = k; });
  setStory(idx);
}

/* ---------- Scroll loop ---------- */
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { ticking = false; updateHeader(); updateStory(); });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Active nav section ---------- */
const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav]')];
if (navLinks.length) {
  const ids = [...new Set(navLinks.map((a) => a.dataset.nav!))];
  const visible = new Map<string, boolean>();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
      const current = ids.find((id) => visible.get(id)) ?? null;
      navLinks.forEach((a) => {
        const on = a.dataset.nav === current;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );
  ids.map((id) => document.getElementById(id)).forEach((s) => s && io.observe(s));
}

/* ---------- Reveal ----------
 * A drawer reveal starts fully clipped, and browsers never report a fully clipped element
 * as intersecting. So we observe each element's parent (never clipped) and reveal the
 * elements inside it. A load-time fallback reveals anything still hidden.
 */
const revealEls = [...document.querySelectorAll<HTMLElement>('[data-reveal], [data-split]')];
const show = (el: HTMLElement) => el.classList.add('is-visible');
let sweepTimer = 0;
if (motionOK() && 'IntersectionObserver' in window) {
  const byTarget = new Map<Element, HTMLElement[]>();
  revealEls.forEach((el) => {
    // Observe the nearest ancestor that has a box: a display:contents parent is never reported as visible.
    let target: HTMLElement = el;
    if (el.dataset.reveal === 'drawer') {
      let p = el.parentElement;
      while (p && getComputedStyle(p).display === 'contents') p = p.parentElement;
      if (p) target = p;
    }
    byTarget.set(target, [...(byTarget.get(target) ?? []), el]);
  });
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      byTarget.get(e.target)?.forEach(show);
      io.unobserve(e.target);
    }),
    { rootMargin: '0px 0px -4% 0px', threshold: 0 }
  );
  byTarget.forEach((_, target) => io.observe(target));
  // Safety net: anything above the fold or already scrolled past is shown.
  const sweep = () => revealEls.forEach((el) => { if (el.getBoundingClientRect().top < window.innerHeight) show(el); });
  window.addEventListener('load', () => window.setTimeout(sweep, 500));
  window.addEventListener('scroll', () => { window.clearTimeout(sweepTimer); sweepTimer = window.setTimeout(sweep, 400); }, { passive: true });
} else {
  revealEls.forEach(show);
}

/* ---------- Hero: drawers open and close on their own, like a busy locker ---------- */
const heroLocker = document.querySelector<SVGSVGElement>('.locker--animate');
if (heroLocker && motionOK()) {
  const drawers = [...heroLocker.querySelectorAll<SVGGElement>('.dr:not(.dr--accent)')];
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(heroLocker);
  const cycle = () => {
    if (visible && !document.hidden && drawers.length) {
      const d = drawers[Math.floor(Math.random() * drawers.length)];
      d.classList.add('is-open');
      window.setTimeout(() => d.classList.remove('is-open'), 1700);
    }
    window.setTimeout(cycle, 1500 + Math.random() * 900);
  };
  window.setTimeout(cycle, 2600);
}

/* ---------- Modules highlight ---------- */
document.querySelectorAll<HTMLElement>('[data-modules]').forEach((figure) => {
  const buttons = [...figure.querySelectorAll<HTMLButtonElement>('[data-module-btn]')];
  const mods = [...figure.querySelectorAll<SVGGElement>('.mod')];
  let pinned: string | null = null;
  const show = (key: string | null) => {
    if (key) figure.dataset.active = key; else delete figure.dataset.active;
    mods.forEach((m) => m.classList.toggle('is-active', m.dataset.module === key));
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.moduleBtn === key)));
  };
  buttons.forEach((b) => {
    const key = b.dataset.moduleBtn!;
    b.addEventListener('mouseenter', () => show(key));
    b.addEventListener('mouseleave', () => show(pinned));
    b.addEventListener('focus', () => show(key));
    b.addEventListener('blur', () => show(pinned));
    b.addEventListener('click', () => { pinned = pinned === key ? null : key; show(pinned ?? (b.matches(':hover') ? key : null)); });
  });
  mods.forEach((m) => {
    const key = m.dataset.module!;
    m.addEventListener('mouseenter', () => show(key));
    m.addEventListener('mouseleave', () => show(pinned));
    m.addEventListener('click', () => { pinned = pinned === key ? null : key; show(pinned); });
  });
});

/* ---------- Counters ---------- */
const counters = document.querySelectorAll<HTMLElement>('[data-count]');
if (counters.length && motionOK()) {
  const run = (el: HTMLElement) => {
    const target = Number(el.dataset.count);
    const fmt = new Intl.NumberFormat(el.dataset.locale || 'en-US', { useGrouping: !!el.dataset.locale });
    const start = performance.now();
    const dur = target < 10 ? 700 : 1300;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      el.textContent = fmt.format(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); run(e.target as HTMLElement); } }),
    { threshold: 0.6 }
  );
  counters.forEach((el) => io.observe(el));
}

/* ---------- LISSA mock: switch tabs on its own while visible, click to switch ---------- */
document.querySelectorAll<HTMLElement>('[data-mock]').forEach((mock) => {
  let timer = 0;
  let paused = false;
  const setTab = (i: number) => {
    // Restart the in-pane animations by toggling is-live.
    mock.classList.remove('is-live');
    mock.dataset.tab = String(i);
    requestAnimationFrame(() => requestAnimationFrame(() => mock.classList.add('is-live')));
  };
  mock.querySelectorAll<HTMLElement>('[data-mock-tab]').forEach((tab) =>
    tab.addEventListener('click', () => { paused = true; setTab(Number(tab.dataset.mockTab)); })
  );
  if (!motionOK()) { mock.classList.add('is-live'); return; }
  new IntersectionObserver(([e]) => {
    window.clearInterval(timer);
    if (e.isIntersecting) {
      mock.classList.add('is-live');
      timer = window.setInterval(() => { if (!paused && !document.hidden) setTab(mock.dataset.tab === '0' ? 1 : 0); }, 5200);
    }
  }, { threshold: 0.35 }).observe(mock);
});

/* ---------- Lifecycle: the accent diamond walks from Pool to Refurbish while visible ---------- */
document.querySelectorAll<HTMLElement>('[data-cycle]').forEach((cycle) => {
  if (!motionOK()) return;
  const steps = [...cycle.querySelectorAll<HTMLElement>('.cycle-step')];
  let i = -1, timer = 0;
  const tick = () => {
    if (document.hidden) return;
    steps.forEach((s) => s.classList.remove('is-on'));
    i = (i + 1) % steps.length;
    steps[i].classList.add('is-on');
  };
  new IntersectionObserver(([e]) => {
    window.clearInterval(timer);
    if (e.isIntersecting) {
      cycle.classList.add('is-running');
      if (i < 0) window.setTimeout(tick, 900);
      timer = window.setInterval(tick, 1400);
    }
  }, { threshold: 0.4 }).observe(cycle);
});

/* ---------- LISSA mock: load Inter only when the mock is close ---------- */
document.querySelectorAll<HTMLElement>('[data-mock]').forEach((mock) => {
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { mock.classList.add('inter'); io.disconnect(); } }, { rootMargin: '800px 0px' });
  io.observe(mock);
});

/* ---------- Contact form ---------- */
initContactForm();
initCalc();
