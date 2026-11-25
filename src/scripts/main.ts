/**
 * Site behaviour. Everything degrades to a static, fully visible page without JS.
 * - grid fit on resize / font load
 * - header state, mobile menu, active nav
 * - reveals (fade, drawer clip, title lines)
 * - hero: random drawers open and close
 * - how it works: tabs (click) drive the locker screen
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
    if (!lines.length || s.offsetTop !== top) { lines.push([]); top = s.offsetTop; }
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

/* ---------- How it works: tabs change only on click (or arrow keys); nothing advances on its own ---------- */
const story = document.querySelector<HTMLElement>('[data-story]');
const storyLocker = story?.querySelector<SVGSVGElement>('[data-locker]');
const storyTabs = story ? [...story.querySelectorAll<HTMLButtonElement>('[role="tab"]')] : [];
const storyCopy = story ? [...story.querySelectorAll<HTMLElement>('[data-copy]')] : [];
function setStory(i: number) {
  if (!story) return;
  if (storyLocker) storyLocker.dataset.state = String(i);
  storyTabs.forEach((t, k) => { const on = k === i; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
  storyCopy.forEach((c, k) => { c.hidden = k !== i; });
  story.querySelector('[role="tabpanel"]')?.setAttribute('aria-labelledby', storyTabs[i]?.id ?? '');
}
if (story && storyTabs.length) {
  setStory(0);
  storyTabs.forEach((t, k) => {
    t.addEventListener('click', () => setStory(k));
    t.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const n = (k + d + storyTabs.length) % storyTabs.length;
      setStory(n);
      storyTabs[n].focus();
    });
  });
}

/* ---------- Scroll loop ---------- */
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { ticking = false; updateHeader(); });
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

/* ---------- Dark surfaces: the glow follows the mouse (lockers have no hover effect) ---------- */
if (motionOK() && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll<HTMLElement>('[data-hero]').forEach((hero) => {
    const space = hero.matches('.space, .glow-band, .site-footer') ? hero : hero.querySelector<HTMLElement>('.space');
    if (!space) return;
    let frame = 0;
    hero.addEventListener('pointermove', (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Glow: position inside the dark surface, clamped so it never leaves it.
        const b = space.getBoundingClientRect();
        space.style.setProperty('--gx', `${Math.min(100, Math.max(0, ((e.clientX - b.left) / b.width) * 100))}%`);
        space.style.setProperty('--gy', `${Math.min(100, Math.max(0, ((e.clientY - b.top) / b.height) * 100))}%`);
      });
    }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      space.style.removeProperty('--gx');
      space.style.removeProperty('--gy');
    });
  });
}

/* ---------- Home hero: 3D locker. three.js loads in its own file, only on pages that have the stage. ---------- */
const heroStage = document.querySelector<HTMLElement>('[data-hero-stage]');
if (heroStage) {
  import('./hero-locker')
    .then((m) => m.initHeroLocker(heroStage))
    .catch(() => heroStage.classList.add('is-fallback'));
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
    b.addEventListener('focus', () => show(key));
    b.addEventListener('blur', () => show(pinned));
    b.addEventListener('click', () => { pinned = pinned === key ? null : key; show(pinned); });
  });
});

/* ---------- Device fit (Modules): hovering a device card highlights the one drawer it goes into ---------- */
document.querySelectorAll<HTMLElement>('[data-modules]').forEach((figure) => {
  const locker = figure.querySelector<SVGSVGElement>('[data-locker]');
  const section = figure.closest('section');
  if (!locker || !section) return;
  // A small drawer in Lotte for the phone, a wide one in Bruno for the laptop.
  const targets: Record<string, SVGGElement | undefined> = {
    small: locker.querySelectorAll<SVGGElement>('.mod[data-module="s24"] .dr')[4],
    wide: locker.querySelectorAll<SVGGElement>('.mod[data-module="n8"] .dr')[2],
  };
  section.querySelectorAll<HTMLElement>('[data-fit-drawer]').forEach((card) => {
    const dr = targets[card.dataset.fitDrawer ?? ''];
    if (!dr) return;
    const on = () => dr.classList.add('is-open');
    const off = () => dr.classList.remove('is-open');
    card.tabIndex = 0;
    card.addEventListener('pointerenter', on);
    card.addEventListener('pointerleave', off);
    card.addEventListener('focus', on);
    card.addEventListener('blur', off);
  });
});

/* ---------- Drawer size example (Modules): hovering a drawer on the locker draws a device in a drawer of that size ---------- */
document.querySelectorAll<HTMLElement>('[data-modules]').forEach((figure) => {
  const fit = figure.closest('section')?.querySelector<HTMLElement>('.fit');
  if (!fit) return;
  figure.querySelectorAll<SVGGElement>('.mod-locker .dr').forEach((dr) => {
    dr.addEventListener('pointerenter', () => { fit.dataset.show = dr.dataset.kind ?? ''; dr.classList.add('is-open'); });
    dr.addEventListener('pointerleave', () => { delete fit.dataset.show; dr.classList.remove('is-open'); });
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

/* ---------- Motion layer: card spotlight (fine pointers only) ---------- */
if (motionOK() && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll<HTMLElement>('[data-spot], .tile--hover').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const b = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - b.left}px`);
      el.style.setProperty('--my', `${e.clientY - b.top}px`);
    });
  });
}
