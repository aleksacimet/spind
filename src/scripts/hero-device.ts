/**
 * The use case hero objects in real 3D (three.js), same look as the Spind lockers (hero-locker.ts): modern clay render,
 * matte white material, soft studio light, no dark outlines, blue techno accents on the floor, CTA yellow only on screens.
 * Used by Device3D.astro; each use case gets its own little scene, built from the same parts (phone, laptop, mini locker,
 * floor pings, floor arrows, dials, moving dots), so the pages read as one visual language:
 *
 * - lost-device: a phone dropped screen up in lost mode (padlock, map, call button), blue location pings around it.
 * - faulty-device-swap: an open laptop with a broken screen (warning), two blue swap arrows circling it on the floor.
 * - temporary-device: an open laptop with a loan timer on screen, a blue dial of ticks on the floor filling up.
 * - eou-rollout: a stack of closed old laptops, blue dots running to a new open laptop with a check.
 * - onboarding: a starter kit (open laptop with a welcome screen and a phone beside it), soft pings.
 * - offboarding: a closed laptop with a phone on top being wiped, blue rings drawing in (coming back).
 * - multi-site: four mini Spind lockers on the floor linked by blue dotted routes, each pinging in turn.
 *
 * Screens are text-free: shapes and line icons only, like the How it works screens.
 * - Mouse over the stage: the scene turns a little toward the pointer and springs back (same exception to the
 *   fill-only hover rule as the lockers).
 * - Ambient: the floor accents move. Reduced motion: a still scene.
 * - Renders only while visible. If WebGL is missing the stage stays empty (the hero copy carries the page).
 */
import {
  CanvasTexture,
  CircleGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  QuadraticBezierCurve3,
  RingGeometry,
  Scene,
  Shape,
  ShapeGeometry,
  ShadowMaterial,
  SpotLight,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Curve,
  type Texture,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* ---------- Phone dimensions (scene units; the phone is the hero, so it's big) ---------- */
const PW = 0.76; // width
const PH = 1.56; // height
const PR = 0.12; // corner radius
const PD = 0.034; // body depth (plus the soft edge on both sides): about 8 mm on a real phone, ~11% of the width
const GLASS_IN = 0.014; // only a hairline of the frame shows around the front glass
const SCREEN_IN = 0.05; // thin black bezel between glass edge and screen
const BEVEL = 0.025;
const FLOAT = 0.3; // gap between the phone and the floor

/* Colours: same as the lockers */
const CLAY = 0xeceef1;
const BLUE = 0x2e8eff;
const HL = '#FFD369'; // CTA yellow, screen only

/* Tilt */
const MAX_Y = 0.22;
const MAX_X = 0.07;
const REST_Y = -0.36; // three-quarter view, so the clay edge and buttons read

const clamp1 = (v: number) => Math.max(-1, Math.min(1, v));

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!] as const;
}
function texture(c: HTMLCanvasElement, srgb = true) {
  const t = new CanvasTexture(c);
  if (srgb) t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
function roundRectShape(w: number, h: number, r: number) {
  const s = new Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}
/** Flat rounded rectangle with 0-1 UVs over its bounds (ShapeGeometry UVs are in shape units). */
function flatRound(w: number, h: number, r: number) {
  const g = new ShapeGeometry(roundRectShape(w, h, r), 24);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  uv.needsUpdate = true;
  return g;
}

/* ---------- The lost-mode screen: text-free, built from shapes and line icons like the How it works screens ---------- */
const ICON: Record<string, Path2D> = {
  lock: new Path2D('M7.5 10.5V8a4.5 4.5 0 0 1 9 0v2.5M5.5 10.5h13v10h-13zM12 14.5v2.5'),
  pin: new Path2D('M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z'),
  call: new Path2D('M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z'),
  noSignal: new Path2D('M3 20h2M8 20v-3M13 20v-7M18 20V8M3 4l18 16'),
  warn: new Path2D('M12 4l9 16H3zM12 10v4.5M12 17.5v.01'),
  check: new Path2D('M5 12.5l4.5 4.5L19 7'),
  user: new Path2D('M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5a7.5 7.5 0 0 1 15 0'),
  clock: new Path2D('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3.5 2'),
  wipe: new Path2D('M20 12a8 8 0 1 1-2.3-5.7M20 4v4.5h-4.5'),
};

function drawLostScreen() {
  const W = 690;
  const H = Math.round((W * (PH - SCREEN_IN)) / (PW - SCREEN_IN));
  const [c, ctx] = makeCanvas(W, H);
  const icon = (name: string, x: number, y: number, size: number, color: string, lw = 1.6) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 24, size / 24);
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(ICON[name]);
    ctx.restore();
  };
  const rr = (x: number, y: number, w: number, h: number, r: number, fill: string) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
  };
  const bar = (x: number, y: number, w: number, h: number, a: number) => rr(x, y, w, h, h / 2, `rgba(255,255,255,${a})`);

  // Background: the locker screen's deep blue, with a soft blue glow from the top.
  const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
  bg.addColorStop(0, '#2A5288');
  bg.addColorStop(1, '#10223A');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, H * 0.3, 0, W / 2, H * 0.3, W * 0.9);
  glow.addColorStop(0, 'rgba(46, 142, 255, 0.45)');
  glow.addColorStop(1, 'rgba(46, 142, 255, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Status bar: time on the left, no signal on the right (it's been blocked).
  bar(64, 52, 78, 20, 0.7);
  icon('noSignal', W - 64 - 40, 40, 40, 'rgba(255,255,255,0.5)', 1.8);

  // The padlock: yellow, in two soft rings (lost mode is on).
  const cy = H * 0.27;
  for (const [r, a] of [[170, 0.06], [124, 0.1]] as const) {
    ctx.beginPath();
    ctx.arc(W / 2, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 211, 105, ${a})`;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(W / 2, cy, 84, 0, Math.PI * 2);
  ctx.fillStyle = HL;
  ctx.fill();
  icon('lock', W / 2 - 50, cy - 52, 100, '#16191E', 2);

  // Title and message: bars, no words.
  bar(W / 2 - 190, cy + 222, 380, 40, 0.92);
  bar(W / 2 - 220, cy + 290, 440, 18, 0.42);
  bar(W / 2 - 150, cy + 324, 300, 18, 0.42);

  // Last known location: a small map card with a street grid, a route and the pin.
  const mx = 64;
  const my = H * 0.62;
  const mw = W - 128;
  const mh = 290;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(mx, my, mw, mh, 32);
  ctx.clip();
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  ctx.fillRect(mx, my, mw, mh);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 10;
  for (let k = 0; k < 6; k++) {
    ctx.beginPath();
    ctx.moveTo(mx + 40 + k * 110, my);
    ctx.lineTo(mx + k * 110 - 60, my + mh);
    ctx.stroke();
  }
  for (let k = 0; k < 3; k++) {
    ctx.beginPath();
    ctx.moveTo(mx, my + 70 + k * 90);
    ctx.lineTo(mx + mw, my + 40 + k * 90);
    ctx.stroke();
  }
  ctx.setLineDash([2, 22]);
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(46, 142, 255, 0.95)';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(mx + 60, my + mh - 40);
  ctx.bezierCurveTo(mx + 200, my + mh - 30, mx + 220, my + 120, mx + mw * 0.66, my + 128);
  ctx.stroke();
  ctx.setLineDash([]);
  const px = mx + mw * 0.66;
  const py = my + 128;
  for (const [r, a] of [[64, 0.14], [38, 0.26]] as const) {
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(46, 142, 255, ${a})`;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(px, py, 16, 0, Math.PI * 2);
  ctx.fillStyle = '#2E8EFF';
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  ctx.restore();
  // Pin chip in the map's corner.
  rr(mx + 24, my + 24, 64, 64, 18, 'rgba(10, 20, 34, 0.6)');
  icon('pin', mx + 36, my + 36, 40, '#ffffff', 1.8);

  // Call the owner: the yellow button.
  const by = H - 230;
  rr(64, by, W - 128, 104, 52, HL);
  icon('call', W / 2 - 26, by + 26, 52, '#16191E', 2);

  // Home indicator.
  bar(W / 2 - 110, H - 56, 220, 12, 0.6);
  return texture(c);
}

/* ---------- More screens, same palette and kit as the lost-mode screen ---------- */
type Kit = {
  ctx: CanvasRenderingContext2D;
  W: number;
  H: number;
  icon: (name: string, x: number, y: number, size: number, color: string, lw?: number) => void;
  rr: (x: number, y: number, w: number, h: number, r: number, fill: string) => void;
  bar: (x: number, y: number, w: number, h: number, a: number) => void;
  /** A yellow disc with a dark line icon inside, in two soft yellow rings. */
  badge: (cx: number, cy: number, r: number, name: string) => void;
};
function drawScreen(W: number, H: number, draw: (k: Kit) => void) {
  const [c, ctx] = makeCanvas(W, H);
  const icon = (name: string, x: number, y: number, size: number, color: string, lw = 1.6) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 24, size / 24);
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(ICON[name]);
    ctx.restore();
  };
  const rr = (x: number, y: number, w: number, h: number, r: number, fill: string) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
  };
  const bar = (x: number, y: number, w: number, h: number, a: number) => rr(x, y, w, h, h / 2, `rgba(255,255,255,${a})`);
  const badge = (cx: number, cy: number, r: number, name: string) => {
    for (const [k, a] of [[2, 0.06], [1.48, 0.1]] as const) {
      ctx.beginPath();
      ctx.arc(cx, cy, r * k, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 211, 105, ${a})`;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = HL;
    ctx.fill();
    icon(name, cx - r * 0.6, cy - r * 0.6, r * 1.2, '#16191E', 2);
  };
  const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
  bg.addColorStop(0, '#2A5288');
  bg.addColorStop(1, '#10223A');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, H * 0.3, 0, W / 2, H * 0.3, Math.max(W, H) * 0.8);
  glow.addColorStop(0, 'rgba(46, 142, 255, 0.4)');
  glow.addColorStop(1, 'rgba(46, 142, 255, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  draw({ ctx, W, H, icon, rr, bar, badge });
  return texture(c);
}

/* Laptop size (scene units) */
const LW = 1.44; // width
const LD = 0.98; // depth of the base
const LT = 0.036; // base thickness
const LH = 0.92; // lid height
const LL = 0.02; // lid thickness
const LAP_SCREEN: [number, number] = [LW - 0.1, LH - 0.13];
const lapPx = (w = 1024) => [w, Math.round((w * LAP_SCREEN[1]) / LAP_SCREEN[0])] as const;
const PHONE_PX = [690, Math.round((690 * (PH - SCREEN_IN)) / (PW - SCREEN_IN))] as const;

/** Laptop screen chrome: a top bar with three dots, a left rail of bars. */
function lapChrome(k: Kit) {
  const { ctx, W, H, bar } = k;
  ctx.fillStyle = 'rgba(8, 16, 28, 0.35)';
  ctx.fillRect(0, 0, W, 44);
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(30 + i * 24, 22, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.fill();
  }
  bar(W - 120, 16, 80, 12, 0.35);
  ctx.fillStyle = 'rgba(8, 16, 28, 0.22)';
  ctx.fillRect(0, 44, 150, H - 44);
  for (let i = 0; i < 6; i++) bar(30, 84 + i * 46, 90 - (i % 3) * 18, 14, i === 1 ? 0.6 : 0.22);
}

const screens: Record<string, () => Texture> = {
  // Faulty: glitch bands and a warning.
  faulty: () =>
    drawScreen(...lapPx(), (k) => {
      const { ctx, W, H, bar, badge } = k;
      lapChrome(k);
      const bands = [[0.18, 26, 0.16], [0.31, 10, 0.3], [0.62, 18, 0.14], [0.71, 6, 0.4], [0.84, 30, 0.1]] as const;
      for (const [y, h, a] of bands) {
        ctx.fillStyle = `rgba(160, 200, 255, ${a})`;
        ctx.fillRect(150, H * y, W - 150, h);
      }
      ctx.fillStyle = 'rgba(255, 211, 105, 0.22)';
      ctx.fillRect(420, H * 0.71 - 4, 380, 4);
      const cx = 150 + (W - 150) / 2;
      badge(cx, H * 0.4, 62, 'warn');
      bar(cx - 150, H * 0.4 + 120, 300, 28, 0.9);
      bar(cx - 190, H * 0.4 + 170, 380, 14, 0.4);
      bar(cx - 120, H * 0.4 + 198, 240, 14, 0.4);
    }),
  // Loan: a timer ring three-quarters full and a calendar strip.
  loan: () =>
    drawScreen(...lapPx(), (k) => {
      const { ctx, W, H, bar, rr, icon } = k;
      lapChrome(k);
      const cx = 150 + (W - 150) * 0.33;
      const cy = H * 0.5;
      ctx.lineCap = 'round';
      ctx.lineWidth = 26;
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.arc(cx, cy, 150, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = HL;
      ctx.beginPath();
      ctx.arc(cx, cy, 150, -Math.PI / 2, Math.PI);
      ctx.stroke();
      icon('clock', cx - 50, cy - 50, 100, '#ffffff', 1.8);
      const gx = 150 + (W - 150) * 0.6;
      bar(gx, H * 0.22, 220, 26, 0.9);
      bar(gx, H * 0.22 + 44, 160, 14, 0.4);
      for (let r = 0; r < 4; r++)
        for (let c = 0; c < 5; c++) {
          const on = r * 5 + c;
          rr(gx + c * 56, H * 0.42 + r * 56, 44, 44, 10, on >= 6 && on <= 13 ? (on === 13 ? HL : 'rgba(46,142,255,0.75)') : 'rgba(255,255,255,0.1)');
        }
    }),
  // New device: a check, a full progress bar.
  ready: () =>
    drawScreen(...lapPx(), (k) => {
      const { W, H, bar, rr, badge } = k;
      lapChrome(k);
      const cx = 150 + (W - 150) / 2;
      badge(cx, H * 0.38, 62, 'check');
      bar(cx - 150, H * 0.38 + 120, 300, 28, 0.9);
      rr(cx - 220, H * 0.38 + 186, 440, 18, 9, 'rgba(255,255,255,0.12)');
      rr(cx - 220, H * 0.38 + 186, 440, 18, 9, '#2E8EFF');
    }),
  // Welcome: an avatar card, a checklist with ticks.
  welcome: () =>
    drawScreen(...lapPx(), (k) => {
      const { ctx, W, H, bar, rr, icon, badge } = k;
      lapChrome(k);
      const cx = 150 + (W - 150) * 0.32;
      badge(cx, H * 0.36, 70, 'user');
      bar(cx - 120, H * 0.36 + 130, 240, 28, 0.9);
      bar(cx - 90, H * 0.36 + 176, 180, 14, 0.4);
      const lx = 150 + (W - 150) * 0.6;
      for (let i = 0; i < 4; i++) {
        const y = H * 0.2 + i * 96;
        rr(lx, y, 300, 72, 18, 'rgba(255,255,255,0.08)');
        ctx.beginPath();
        ctx.arc(lx + 40, y + 36, 18, 0, Math.PI * 2);
        ctx.fillStyle = i < 3 ? '#2E8EFF' : 'rgba(255,255,255,0.15)';
        ctx.fill();
        if (i < 3) icon('check', lx + 28, y + 24, 24, '#ffffff', 2.6);
        bar(lx + 80, y + 29, 160 - i * 20, 14, 0.5);
      }
    }),
  // Phone: a matching welcome (onboarding).
  phoneWelcome: () =>
    drawScreen(...PHONE_PX, (k) => {
      const { W, H, bar, badge } = k;
      bar(64, 52, 78, 20, 0.7);
      badge(W / 2, H * 0.34, 90, 'check');
      bar(W / 2 - 190, H * 0.34 + 230, 380, 40, 0.92);
      bar(W / 2 - 220, H * 0.34 + 300, 440, 18, 0.42);
      bar(W / 2 - 150, H * 0.34 + 334, 300, 18, 0.42);
      bar(W / 2 - 110, H - 56, 220, 12, 0.6);
    }),
  // Phone: being wiped for return (offboarding).
  wipe: () =>
    drawScreen(...PHONE_PX, (k) => {
      const { ctx, W, H, bar, rr, icon } = k;
      bar(64, 52, 78, 20, 0.7);
      const cy = H * 0.38;
      ctx.lineCap = 'round';
      ctx.lineWidth = 30;
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.arc(W / 2, cy, 170, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = HL;
      ctx.beginPath();
      ctx.arc(W / 2, cy, 170, -Math.PI / 2, Math.PI * 0.85);
      ctx.stroke();
      icon('wipe', W / 2 - 60, cy - 60, 120, '#ffffff', 1.8);
      bar(W / 2 - 190, cy + 270, 380, 40, 0.92);
      bar(W / 2 - 150, cy + 340, 300, 18, 0.42);
      rr(64, H - 230, W - 128, 104, 52, 'rgba(255,255,255,0.1)');
      bar(W / 2 - 110, H - 56, 220, 12, 0.6);
    }),
};

/* ---------- Floor helpers ---------- */
function radial(stops: [number, number][]) {
  const [c, ctx] = makeCanvas(256, 256);
  // alphaMap reads the grey value, so draw grey on black (not white with alpha).
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 256, 256);
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  for (const [o, a] of stops) g.addColorStop(o, `rgb(${a * 255},${a * 255},${a * 255})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return texture(c, false);
}
const flat = (m: Mesh, y: number, order: number) => {
  m.rotation.x = -Math.PI / 2;
  m.position.y = y;
  m.renderOrder = order;
  return m;
};
const blueMat = (opacity = 0) => new MeshBasicMaterial({ color: BLUE, transparent: true, opacity, depthWrite: false, toneMapped: false });

/** A soft blue spot on the floor. */
function floorSpot(size: number, opacity = 0.55) {
  return flat(
    new Mesh(
      new PlaneGeometry(size, size),
      new MeshBasicMaterial({ color: 0x5aa6ff, alphaMap: radial([[0, 1], [0.3, 0.4], [0.75, 0.06], [1, 0]]), transparent: true, opacity, depthWrite: false, toneMapped: false })
    ),
    0.0008,
    -2
  );
}

/** Thin blue rings rippling out (or in) on the floor. Returns the tick. */
function pings(parent: Group, o: { count?: number; period?: number; r0: number; r1: number; inward?: boolean; strength?: number; x?: number; z?: number; offset?: number }) {
  const { count = 3, period = 3.2, r0, r1, inward = false, strength = 0.85, x = 0, z = 0, offset = 0 } = o;
  const geo = new RingGeometry(0.97, 1, 96);
  const rings = Array.from({ length: count }, () => {
    const m = flat(new Mesh(geo, blueMat()), 0.0012, -1);
    m.position.x = x;
    m.position.z = z;
    parent.add(m);
    return m;
  });
  return (t: number, reduce: boolean) =>
    rings.forEach((m, i) => {
      let p = reduce ? (i + 0.5) / count : ((t / period + i / count + offset) % 1);
      if (inward) p = 1 - p;
      const r = r0 + p * (r1 - r0);
      m.scale.set(r, r, 1);
      const life = inward ? 1 - p : p;
      (m.material as MeshBasicMaterial).opacity = (reduce ? 0.5 : Math.sin(Math.PI * Math.min(1, life * 1.15))) * strength * (inward ? 0.4 + p * 0.6 : 1 - p * 0.6);
    });
}

/** A blue arc band with an arrowhead, lying on the floor (angles in radians, counter-clockwise from +x). */
function arcArrow(R: number, w: number, a0: number, a1: number) {
  const s = new Shape();
  const ro = R + w / 2;
  const ri = R - w / 2;
  s.moveTo(Math.cos(a0) * ro, Math.sin(a0) * ro);
  s.absarc(0, 0, ro, a0, a1, false);
  const head = w * 1.15;
  const tipA = a1 + (w * 1.8) / R;
  s.lineTo(Math.cos(a1) * (R + head), Math.sin(a1) * (R + head));
  s.lineTo(Math.cos(tipA) * R, Math.sin(tipA) * R);
  s.lineTo(Math.cos(a1) * (R - head), Math.sin(a1) * (R - head));
  s.lineTo(Math.cos(a1) * ri, Math.sin(a1) * ri);
  s.absarc(0, 0, ri, a1, a0, true);
  return new ShapeGeometry(s, 48);
}

/** Blue dots running along a floor curve, over a faint dotted trail. */
function runner(parent: Group, curve: Curve<Vector3>, o: { dots?: number; period?: number; trail?: number; size?: number } = {}) {
  const { dots = 4, period = 2.6, trail = 22, size = 0.024 } = o;
  const dotGeo = new CircleGeometry(size, 20);
  const trailGeo = new CircleGeometry(size * 0.55, 12);
  for (let i = 0; i <= trail; i++) {
    const m = flat(new Mesh(trailGeo, blueMat(0.35)), 0.0014, -1);
    m.position.copy(curve.getPointAt(i / trail)).setY(0.0014);
    parent.add(m);
  }
  const movers = Array.from({ length: dots }, () => {
    const m = flat(new Mesh(dotGeo, blueMat(1)), 0.0016, -1);
    parent.add(m);
    return m;
  });
  return (t: number, reduce: boolean) =>
    movers.forEach((m, i) => {
      const p = reduce ? (i + 0.5) / dots : ((t / period + i / dots) % 1);
      m.position.copy(curve.getPointAt(p)).setY(0.0016);
      (m.material as MeshBasicMaterial).opacity = Math.sin(Math.PI * p) * 0.95;
    });
}
const floorCurve = (a: [number, number], b: [number, number], bend = 0) => {
  const mid = new Vector3((a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2);
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const len = Math.hypot(dx, dz) || 1;
  mid.x += (-dz / len) * bend;
  mid.z += (dx / len) * bend;
  return new QuadraticBezierCurve3(new Vector3(a[0], 0, a[1]), mid, new Vector3(b[0], 0, b[1]));
};

/* ---------- Materials (shared by every scene) ---------- */
function materials() {
  const clay = new MeshStandardMaterial({ color: CLAY, roughness: 0.78 });
  const oldClay = new MeshStandardMaterial({ color: 0xd9dce1, roughness: 0.82 });
  // Frame: light satin aluminium, so thin edges catch the light like a real device.
  const frame = new MeshPhysicalMaterial({ color: 0xe6e9ed, metalness: 0.55, roughness: 0.32, clearcoat: 0.4, clearcoatRoughness: 0.3 });
  const glass = new MeshPhysicalMaterial({ color: 0x0b0e13, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 });
  const lens = new MeshPhysicalMaterial({ color: 0x14243a, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.02 });
  const camRing = new MeshStandardMaterial({ color: 0xd5d9de, metalness: 1, roughness: 0.3 });
  const groove = new MeshStandardMaterial({ color: 0xd3d7dd, roughness: 0.85 });
  return { clay, oldClay, frame, glass, lens, camRing, groove };
}
type Mats = ReturnType<typeof materials>;
const mesh = (g: BufferGeometry, m: MeshStandardMaterial | MeshPhysicalMaterial | MeshBasicMaterial, shadows = true) => {
  const o = new Mesh(g, m);
  o.castShadow = shadows;
  o.receiveShadow = shadows;
  return o;
};
const screenMat = (map: Texture, intensity = 1.15) =>
  new MeshPhysicalMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: map, emissiveIntensity: intensity, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03 });

/** Soft diagonal reflection over a screen. */
function sheen(w: number, h: number, r: number, strength = 1) {
  const [c, ctx] = makeCanvas(256, 512);
  const g = ctx.createLinearGradient(0, 0, 256, 512);
  g.addColorStop(0, `rgba(255,255,255,${0.12 * strength})`);
  g.addColorStop(0.38, `rgba(255,255,255,${0.06 * strength})`);
  g.addColorStop(0.39, `rgba(255,255,255,${0.015 * strength})`);
  g.addColorStop(0.7, 'rgba(255,255,255,0)');
  g.addColorStop(1, `rgba(255,255,255,${0.03 * strength})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 512);
  return new Mesh(flatRound(w, h, r), new MeshBasicMaterial({ map: texture(c), transparent: true, depthWrite: false, toneMapped: false }));
}

/* ---------- Phone: upright in its own group, screen facing +z ---------- */
const P_FRONT = PD / 2 + BEVEL;
function buildPhone(M: Mats, screenTex: Texture) {
  const phone = new Group();
  const bodyGeo = new ExtrudeGeometry(roundRectShape(PW - BEVEL * 2, PH - BEVEL * 2, PR - BEVEL), {
    depth: PD,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 8,
    curveSegments: 32,
  });
  bodyGeo.translate(0, 0, -PD / 2);
  phone.add(mesh(bodyGeo, M.frame));
  const glassFront = mesh(flatRound(PW - GLASS_IN, PH - GLASS_IN, PR - GLASS_IN / 2), M.glass, false);
  glassFront.position.z = P_FRONT + 0.0008;
  phone.add(glassFront);
  const screen = new Mesh(flatRound(PW - SCREEN_IN, PH - SCREEN_IN, PR - SCREEN_IN / 2), screenMat(screenTex));
  screen.position.z = P_FRONT + 0.0016;
  phone.add(screen);
  const island = mesh(new RoundedBoxGeometry(0.17, 0.048, 0.003, 3, 0.0015), M.glass, false);
  island.position.set(0, PH / 2 - SCREEN_IN / 2 - 0.045, P_FRONT + 0.0026);
  phone.add(island);
  const sh = sheen(PW - GLASS_IN, PH - GLASS_IN, PR - GLASS_IN / 2);
  sh.position.z = P_FRONT + 0.0032;
  phone.add(sh);
  // Side buttons: action and volume on the left, power on the right.
  const SIDE = PW / 2 + 0.002;
  for (const [x, y, h] of [[-SIDE, 0.48, 0.07], [-SIDE, 0.32, 0.14], [-SIDE, 0.14, 0.14], [SIDE, 0.28, 0.22]] as const) {
    const b = mesh(new RoundedBoxGeometry(0.014, h, 0.03, 3, 0.006), M.frame);
    b.position.set(x, y, 0);
    phone.add(b);
  }
  // Back: frosted clay plate and the camera plateau with two lenses.
  const BACK = -P_FRONT;
  const back = mesh(flatRound(PW - GLASS_IN, PH - GLASS_IN, PR - GLASS_IN / 2), M.clay, false);
  back.position.z = BACK - 0.0008;
  back.rotation.y = Math.PI;
  phone.add(back);
  const plateau = mesh(new RoundedBoxGeometry(0.3, 0.3, 0.02, 4, 0.01), M.clay);
  plateau.position.set(-PW / 2 + 0.2, PH / 2 - 0.2, BACK - 0.006);
  phone.add(plateau);
  for (const [dx, dy] of [[-0.065, 0.065], [0.065, -0.065]] as const) {
    const ring = mesh(new RoundedBoxGeometry(0.11, 0.11, 0.02, 4, 0.05), M.camRing, false);
    ring.position.set(plateau.position.x + dx, plateau.position.y + dy, BACK - 0.02);
    phone.add(ring);
    const lens = mesh(new RoundedBoxGeometry(0.08, 0.08, 0.02, 4, 0.038), M.lens, false);
    lens.position.set(plateau.position.x + dx, plateau.position.y + dy, BACK - 0.024);
    phone.add(lens);
  }
  return phone;
}
/** A phone lying screen up on a surface at height y, spun by `spin` in its own plane. */
function lyingPhone(M: Mats, screenTex: Texture, spin: number, scale = 1, y = 0) {
  const holder = new Group();
  const p = buildPhone(M, screenTex);
  p.rotation.set(-Math.PI / 2, 0, spin);
  p.position.y = (P_FRONT + 0.03) * scale + y;
  p.scale.setScalar(scale);
  holder.add(p);
  return holder;
}

/* ---------- Laptop: hinge at the back, keyboard deck, lid open or closed ---------- */
let keyTex: Texture | null = null;
function keyboardTexture() {
  if (keyTex) return keyTex;
  const [c, ctx] = makeCanvas(1024, 400);
  ctx.fillStyle = '#eceef1';
  ctx.fillRect(0, 0, 1024, 400);
  const rows = [14, 14, 13, 12, 11];
  const kh = 56;
  const gap = 12;
  rows.forEach((n, r) => {
    const kw = (1024 - 40 - gap * (n - 1)) / n;
    for (let i = 0; i < n; i++) {
      const x = 20 + i * (kw + gap);
      const y = 22 + r * (kh + gap) + (r === 4 ? 0 : 0);
      ctx.beginPath();
      ctx.roundRect(x, y, kw, kh, 10);
      ctx.fillStyle = '#dde0e5';
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x + 3, y + 2, kw - 6, kh - 8, 8);
      ctx.fillStyle = '#f3f4f6';
      ctx.fill();
    }
  });
  // Space bar row.
  ctx.beginPath();
  ctx.roundRect(300, 22 + 5 * (kh + gap) - 4, 424, kh - 6, 10);
  ctx.fillStyle = '#dde0e5';
  ctx.fill();
  keyTex = texture(c);
  return keyTex;
}
function buildLaptop(M: Mats, o: { screen?: Texture; open?: boolean; angle?: number; body?: MeshStandardMaterial | MeshPhysicalMaterial }) {
  const { screen, open = true, angle = 0.32, body = M.clay } = o;
  const lap = new Group();
  const base = mesh(new RoundedBoxGeometry(LW, LT, LD, 4, 0.014), body);
  base.position.y = LT / 2;
  lap.add(base);
  if (open) {
    const keys = mesh(new PlaneGeometry(LW * 0.84, LD * 0.4), new MeshStandardMaterial({ map: keyboardTexture(), roughness: 0.8 }), false);
    keys.rotation.x = -Math.PI / 2;
    keys.position.set(0, LT + 0.0008, -LD * 0.14);
    lap.add(keys);
    const pad = mesh(flatRound(0.46, 0.28, 0.03), M.groove, false);
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(0, LT + 0.0008, LD * 0.26);
    lap.add(pad);
  }
  // Lid pivots on the back edge.
  const hinge = new Group();
  hinge.position.set(0, LT, -LD / 2 + 0.01);
  lap.add(hinge);
  const lid = mesh(new RoundedBoxGeometry(LW, LH, LL, 4, 0.009), body);
  lid.position.set(0, LH / 2, open ? LL / 2 : -LL / 2 - 0.006);
  hinge.add(lid);
  if (open) {
    hinge.rotation.x = -angle;
    const glassFront = mesh(flatRound(LW - 0.03, LH - 0.03, 0.03), M.glass, false);
    glassFront.position.set(0, LH / 2, LL + 0.0008);
    hinge.add(glassFront);
    if (screen) {
      const scr = new Mesh(flatRound(LAP_SCREEN[0], LAP_SCREEN[1], 0.012), screenMat(screen, 1.05));
      scr.position.set(0, LH / 2 + 0.03, LL + 0.0016);
      hinge.add(scr);
      const sh = sheen(LW - 0.03, LH - 0.03, 0.03, 0.8);
      sh.position.set(0, LH / 2, LL + 0.003);
      hinge.add(sh);
    }
  } else {
    hinge.rotation.x = Math.PI / 2;
    // Small grey logo on the closed lid, like the lockers.
    const logo = mesh(new CircleGeometry(0.06, 32), M.groove, false);
    logo.position.set(0, LH / 2, -LL - 0.006 - 0.0008);
    logo.rotation.y = Math.PI;
    hinge.add(logo);
  }
  return lap;
}
const CLOSED_H = LT + LL + 0.006;

/* ---------- Mini Spind locker (multi-site) ---------- */
function miniLocker(M: Mats) {
  const g = new Group();
  const w = 0.42;
  const h = 0.62;
  const d = 0.26;
  const body = mesh(new RoundedBoxGeometry(w, h, d, 4, 0.03), M.clay);
  body.position.y = h / 2;
  g.add(body);
  // Drawer grooves: fine soft grey lines on the front.
  for (let i = 1; i < 5; i++) {
    const line = mesh(new PlaneGeometry(w - 0.06, 0.006), M.groove, false);
    line.position.set(0, (h * i) / 5 - 0.02, d / 2 + 0.0008);
    g.add(line);
  }
  const vline = mesh(new PlaneGeometry(0.006, h * 0.6), M.groove, false);
  vline.position.set(0, h * 0.3 + 0.02, d / 2 + 0.0008);
  g.add(vline);
  // Screen with a blue glow.
  const scr = new Mesh(new PlaneGeometry(0.12, 0.08), new MeshBasicMaterial({ color: 0x2e8eff, toneMapped: false }));
  scr.position.set(-0.1, h - 0.11, d / 2 + 0.001);
  g.add(scr);
  const strip = new Mesh(new PlaneGeometry(w - 0.08, 0.012), new MeshBasicMaterial({ color: 0x7ab8ff, toneMapped: false }));
  strip.position.set(0, h - 0.03, d / 2 + 0.001);
  g.add(strip);
  return g;
}

/* ---------- The scenes ---------- */
type Built = {
  root: Group;
  /** Vertical world span to fit for a given aspect ratio. */
  span: (aspect: number) => number;
  lookY: number;
  elev: number; // camera elevation, degrees
  restY: number; // resting turn
  maxX?: number;
  keyTarget?: [number, number, number];
  tick?: (t: number, reduce: boolean, ambient: boolean) => void;
};

function sceneLost(M: Mats, pose: string): Built {
  const root = new Group();
  if (pose === 'float') {
    const phone = buildPhone(M, drawLostScreen());
    const rig = new Group();
    rig.position.y = FLOAT + PH / 2;
    rig.add(phone);
    root.add(rig, floorSpot(0.9, 0.6));
    const ping = pings(root, { r0: 0.22, r1: 1.27 });
    return {
      root,
      span: (a) => Math.max(PH + FLOAT + 0.32, 2.7 / a),
      lookY: (FLOAT + PH) / 2 + 0.04,
      elev: 11,
      restY: REST_Y,
      maxX: MAX_X,
      keyTarget: [0, FLOAT + PH / 2, 0],
      tick: (t, reduce, ambient) => {
        if (ambient) {
          phone.position.y = Math.sin(t * 1.1) * 0.035;
          phone.rotation.z = Math.sin(t * 0.7) * 0.025 + 0.05;
        } else phone.rotation.z = 0.05;
        ping(t, reduce);
      },
    };
  }
  root.add(lyingPhone(M, drawLostScreen(), 0.5), floorSpot(2, 0.6));
  const ping = pings(root, { r0: 0.8, r1: 1.3 });
  return { root, span: (a) => Math.max(1.55, 2.1 / a), lookY: 0.02, elev: 52, restY: 0, tick: (t, r) => ping(t, r) };
}

/** Shared framing for the open-laptop scenes. */
const lapFrame = { span: (a: number) => Math.max(1.75, 2.55 / a), lookY: 0.36, elev: 30, restY: -0.42, maxX: 0.05 };

function sceneFaulty(M: Mats): Built {
  const root = new Group();
  const lap = buildLaptop(M, { screen: screens.faulty() });
  lap.position.z = 0.05;
  root.add(lap, floorSpot(2.6, 0.45));
  // Two swap arrows chasing each other around the laptop.
  const arrows = new Group();
  for (const a of [0, Math.PI]) {
    const m = flat(new Mesh(arcArrow(1.08, 0.045, a + 0.35, a + Math.PI - 0.45), blueMat(0.9)), 0.0012, -1);
    arrows.add(m);
  }
  root.add(arrows);
  return { root, ...lapFrame, tick: (t, reduce) => (arrows.rotation.y = reduce ? 0.4 : t * 0.35) };
}

function sceneLoan(M: Mats): Built {
  const root = new Group();
  root.add(buildLaptop(M, { screen: screens.loan() }), floorSpot(2.6, 0.4));
  // A dial of ticks on the floor: the loan time filling up, then starting over.
  const N = 60;
  const geo = new PlaneGeometry(0.022, 0.1);
  const ticks = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    const m = new Mesh(geo, blueMat(0.15));
    m.rotation.set(-Math.PI / 2, 0, -a + Math.PI / 2);
    const big = i % 5 === 0;
    m.scale.y = big ? 1.5 : 1;
    m.position.set(Math.cos(a) * 1.12, 0.0012, Math.sin(a) * 1.12);
    m.renderOrder = -1;
    root.add(m);
    return m;
  });
  const PERIOD = 9;
  return {
    root,
    ...lapFrame,
    tick: (t, reduce) => {
      const p = reduce ? 0.72 : (t / PERIOD) % 1;
      const lit = p * N;
      ticks.forEach((m, i) => ((m.material as MeshBasicMaterial).opacity = i < lit ? (i > lit - 1.5 ? 1 : 0.8) : 0.14));
    },
  };
}

function sceneRollout(M: Mats): Built {
  const root = new Group();
  const S = 0.72;
  // Old devices: three closed laptops stacked, slightly greyer.
  const stack = new Group();
  for (let i = 0; i < 3; i++) {
    const l = buildLaptop(M, { open: false, body: M.oldClay });
    l.position.y = i * (CLOSED_H + 0.01);
    l.rotation.y = [0.08, -0.06, 0.14][i];
    l.position.x = [0, 0.03, -0.02][i];
    stack.add(l);
  }
  stack.scale.setScalar(S * 1.05);
  stack.position.set(-0.72, 0, -0.15);
  stack.rotation.y = 0.75;
  // New device: open, ready.
  const lap = buildLaptop(M, { screen: screens.ready() });
  lap.scale.setScalar(S);
  lap.position.set(0.62, 0, 0.2);
  lap.rotation.y = -0.3;
  root.add(stack, lap, floorSpot(3, 0.38));
  const run = runner(root, floorCurve([-0.6, 0.25], [0.3, 0.62], -0.25), { dots: 4, trail: 18 });
  const ping = pings(root, { r0: 0.55, r1: 0.95, x: 0.62, z: 0.2, count: 2, strength: 0.6 });
  return {
    root,
    span: (a) => Math.max(1.6, 2.9 / a),
    lookY: 0.2,
    elev: 34,
    restY: -0.1,
    maxX: 0.05,
    tick: (t, r) => {
      run(t, r);
      ping(t, r);
    },
  };
}

function sceneOnboarding(M: Mats): Built {
  const root = new Group();
  const lap = buildLaptop(M, { screen: screens.welcome() });
  lap.position.set(-0.18, 0, -0.08);
  const phone = lyingPhone(M, screens.phoneWelcome(), -0.35, 0.62);
  phone.position.set(0.86, 0, 0.42);
  root.add(lap, phone, floorSpot(3, 0.42));
  const ping = pings(root, { r0: 1.0, r1: 1.5, strength: 0.6, period: 4 });
  return { root, span: (a) => Math.max(1.8, 2.75 / a), lookY: 0.3, elev: 32, restY: -0.3, maxX: 0.05, tick: (t, r) => ping(t, r) };
}

function sceneOffboarding(M: Mats): Built {
  const root = new Group();
  const lap = buildLaptop(M, { open: false });
  lap.rotation.y = -0.22;
  const phone = lyingPhone(M, screens.wipe(), 0.42, 0.8, CLOSED_H);
  phone.position.set(0.12, 0, 0.06);
  phone.rotation.y = -0.22;
  root.add(lap, phone, floorSpot(2.6, 0.5));
  // Rings drawing in: everything coming back.
  const ping = pings(root, { r0: 0.95, r1: 1.45, inward: true, period: 3.6 });
  return { root, span: (a) => Math.max(1.55, 2.35 / a), lookY: 0.04, elev: 46, restY: 0, tick: (t, r) => ping(t, r) };
}

function sceneMultiSite(M: Mats): Built {
  const root = new Group();
  const sites: [number, number][] = [[-0.95, -0.15], [0.05, -0.6], [0.98, 0.05], [-0.1, 0.62]];
  const ticks: ((t: number, r: boolean) => void)[] = [];
  sites.forEach(([x, z], i) => {
    const l = miniLocker(M);
    l.position.set(x, 0, z);
    l.scale.setScalar(1.25);
    l.rotation.y = -0.15 + (i % 2) * 0.1;
    const spot = floorSpot(0.9, 0.45);
    spot.position.set(x, 0.0008, z);
    root.add(l, spot);
    ticks.push(pings(root, { r0: 0.3, r1: 0.62, x, z, count: 2, period: 3.2, offset: i * 0.25, strength: 0.7 }));
  });
  // Routes: the partner network linking every site.
  const links: [number, number, number][] = [[0, 1, 0.12], [1, 2, 0.12], [2, 3, 0.15], [3, 0, 0.12]];
  links.forEach(([a, b, bend], i) => ticks.push(runner(root, floorCurve(sites[a], sites[b], bend), { dots: 2, trail: 16, period: 3 + i * 0.3, size: 0.024 })));
  return {
    root,
    span: (a) => Math.max(1.8, 3.0 / a),
    lookY: 0.22,
    elev: 40,
    restY: 0,
    tick: (t, r) => ticks.forEach((f) => f(t, r)),
  };
}

const SCENES: Record<string, (M: Mats, pose: string) => Built> = {
  'lost-device': sceneLost,
  'faulty-device-swap': sceneFaulty,
  'temporary-device': sceneLoan,
  'eou-rollout': sceneRollout,
  onboarding: sceneOnboarding,
  offboarding: sceneOffboarding,
  'multi-site': sceneMultiSite,
};
export const DEVICE_SCENES = Object.keys(SCENES);

export function initHeroDevice(stage: HTMLElement) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const make = SCENES[stage.getAttribute('data-device-3d') || ''] ?? sceneLost;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    stage.classList.add('is-fallback');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = NeutralToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', stage.dataset.label || '');
  stage.appendChild(canvas);

  /* ---------- Scene and light: the lockers' studio ---------- */
  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.62;
  pmrem.dispose();

  const M = materials();
  const S = make(M, stage.dataset.pose || 'dropped');
  const rig = new Group(); // turns toward the mouse
  rig.add(S.root);
  scene.add(rig);

  const key = new SpotLight(0xffffff, 1.55, 0, 0.5, 1, 0);
  key.position.set(-1.2, 5, 3.6);
  key.target.position.set(...(S.keyTarget ?? [0, 0.2, 0]));
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 2;
  key.shadow.camera.far = 10;
  key.shadow.radius = 12;
  key.shadow.bias = -0.0003;
  key.shadow.normalBias = 0.01;
  scene.add(key, key.target);
  const fill = new DirectionalLight(0xe4ecff, 0.35);
  fill.position.set(3, 1.6, 2);
  scene.add(fill);
  // Rim light from behind: a cool edge on the clay, so objects lift off a dark page.
  const rim = new DirectionalLight(0xbcd6ff, 0.5);
  rim.position.set(1.5, 2.5, -3);
  scene.add(rim);

  const floor = new Mesh(new PlaneGeometry(10, 10), new ShadowMaterial({ color: 0x0d1015, opacity: 0.08 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  if (stage.dataset.surface === 'dark') {
    // A soft pool of light under the scene on the dark page.
    scene.add(
      flat(
        new Mesh(
          new PlaneGeometry(3.4, 2),
          new MeshBasicMaterial({ color: 0xc9dcff, alphaMap: radial([[0, 1], [0.5, 0.4], [0.92, 0]]), transparent: true, opacity: 0.14, depthWrite: false, toneMapped: false })
        ),
        0.0004,
        -3
      )
    );
  }

  /* ---------- Camera: the scene fills the stage ---------- */
  const camera = new PerspectiveCamera(18, 1.4, 0.5, 40);
  const CAM_ELEV = MathUtils.degToRad(S.elev);
  const fit = () => {
    const span = S.span(camera.aspect);
    const dist = span / 2 / Math.tan(MathUtils.degToRad(camera.fov / 2));
    camera.position.set(0, S.lookY + Math.sin(CAM_ELEV) * dist, Math.cos(CAM_ELEV) * dist);
    camera.lookAt(0, S.lookY, 0);
  };
  const resize = () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    fit();
    kick();
  };

  /* ---------- Motion ---------- */
  const restY = S.restY;
  const maxX = S.maxX ?? 0; // scenes on the floor only turn flat
  const rot = { x: 0, y: restY, vx: 0, vy: 0 };
  const target = { x: 0, y: restY };
  let raf = 0;
  let last = 0;
  let visible = true;
  const ambient = !reduce;

  function spring(dt: number) {
    const k = 30;
    const c = 9;
    rot.vx += ((target.x - rot.x) * k - rot.vx * c) * dt;
    rot.vy += ((target.y - rot.y) * k - rot.vy * c) * dt;
    rot.x += rot.vx * dt;
    rot.y += rot.vy * dt;
    const busy = Math.abs(target.x - rot.x) + Math.abs(target.y - rot.y) + Math.abs(rot.vx) + Math.abs(rot.vy) > 2e-4;
    if (!busy) {
      rot.x = target.x;
      rot.y = target.y;
      rot.vx = rot.vy = 0;
    }
    return busy;
  }

  function frame(now: number) {
    raf = 0;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
    last = now;
    const t = now / 1000;
    if (!finePointer && ambient) target.y = restY + Math.sin(t * ((Math.PI * 2) / 11)) * 0.14;
    const turning = spring(dt);
    rig.rotation.set(rot.x, rot.y, 0);
    S.tick?.(t, reduce, ambient);
    renderer.render(scene, camera);
    if (!stage.classList.contains('is-3d')) stage.classList.add('is-3d');
    if (visible && (turning || ambient)) raf = requestAnimationFrame(frame);
    else last = 0;
  }
  function kick() {
    if (!raf && visible) raf = requestAnimationFrame(frame);
  }

  stage.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !finePointer || reduce) return;
    const r = stage.getBoundingClientRect();
    target.y = restY + clamp1(((e.clientX - r.left) / r.width) * 2 - 1) * MAX_Y;
    target.x = clamp1(((e.clientY - r.top) / r.height) * 2 - 1) * maxX;
    kick();
  }, { passive: true });
  stage.addEventListener('pointerleave', () => {
    target.x = 0;
    target.y = restY;
    kick();
  });

  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible) kick();
  }).observe(stage);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) kick();
  });
  new ResizeObserver(resize).observe(stage);
  resize();
}
