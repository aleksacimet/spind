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
  CatmullRomCurve3,
  CylinderGeometry,
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
  TorusGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Curve,
  type Texture,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { LOGO_H, LOGO_W } from '../components/logo-path';
import { buildLocker, logoCanvas, LD as LK_D, LGAP as LK_GAP, LTOP, LW as LK_W, OTTO_LAPTOP, type ModuleKey } from './locker-model';

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

const monPx = (w = 1280) => [w, Math.round((w * MON_SCREEN[1]) / MON_SCREEN[0])] as const;
const screens: Record<string, () => Texture> = {
  // Platform overview: a map with every site, live status tiles per locker, the activity log.
  dashboard: () =>
    drawScreen(...monPx(), (k) => {
      const { ctx, W, H, bar, rr } = k;
      lapChrome(k);
      const x0 = 180;
      bar(x0, 70, 260, 26, 0.9);
      // Map card with sites.
      const mw = (W - x0 - 40) * 0.56;
      const mh = H - 150;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x0, 120, mw, mh, 22);
      ctx.clip();
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(x0, 120, mw, mh);
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 8;
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(x0 + i * 120 - 80, 120);
        ctx.lineTo(x0 + i * 120 + 60, 120 + mh);
        ctx.stroke();
      }
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(x0, 170 + i * 110);
        ctx.lineTo(x0 + mw, 150 + i * 110);
        ctx.stroke();
      }
      const pins: [number, number, boolean][] = [[0.2, 0.3, false], [0.55, 0.22, false], [0.78, 0.55, true], [0.35, 0.72, false]];
      for (const [px, py, hl] of pins) {
        const X = x0 + mw * px;
        const Y = 120 + mh * py;
        for (const [r, a] of [[44, 0.14], [26, 0.26]] as const) {
          ctx.beginPath();
          ctx.arc(X, Y, r, 0, Math.PI * 2);
          ctx.fillStyle = hl ? `rgba(255, 211, 105, ${a})` : `rgba(46, 142, 255, ${a})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(X, Y, 12, 0, Math.PI * 2);
        ctx.fillStyle = hl ? HL : '#2E8EFF';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      }
      ctx.restore();
      // Status tiles: drawers per locker, free and in use.
      const sx = x0 + mw + 28;
      const sw = W - sx - 40;
      rr(sx, 120, sw, 250, 22, 'rgba(255,255,255,0.06)');
      bar(sx + 24, 144, 150, 16, 0.6);
      const cols = 6;
      const cw = (sw - 48 - (cols - 1) * 10) / cols;
      for (let r = 0; r < 4; r++)
        for (let c = 0; c < cols; c++) {
          const n = r * cols + c;
          rr(sx + 24 + c * (cw + 10), 184 + r * 44, cw, 34, 8, n === 9 ? HL : n % 4 === 1 || n % 7 === 2 ? 'rgba(46,142,255,0.8)' : 'rgba(255,255,255,0.1)');
        }
      // Activity log.
      rr(sx, 390, sw, H - 390 - 30, 22, 'rgba(255,255,255,0.06)');
      for (let i = 0; i < 4; i++) {
        const y = 420 + i * 52;
        if (y > H - 70) break;
        ctx.beginPath();
        ctx.arc(sx + 40, y + 10, 10, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? HL : '#2E8EFF';
        ctx.fill();
        bar(sx + 66, y + 3, sw * 0.5 - i * 20, 14, 0.5);
        bar(sx + sw - 110, y + 3, 70, 14, 0.25);
      }
    }),
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
      // Cracks from a knock in the lower right corner.
      ctx.strokeStyle = 'rgba(230, 240, 255, 0.55)';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      const ox = W * 0.82;
      const oy = H * 0.78;
      for (const [a, len, kink] of [[3.5, 340, 0.3], [3.9, 260, -0.4], [4.4, 300, 0.25], [2.9, 220, -0.2], [5.0, 180, 0.35], [3.2, 140, 0.5]] as const) {
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        const mx = ox + Math.cos(a) * len * 0.5;
        const my = oy + Math.sin(a) * len * 0.5;
        ctx.lineTo(mx, my);
        ctx.lineTo(mx + Math.cos(a + kink) * len * 0.5, my + Math.sin(a + kink) * len * 0.5);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(ox, oy, 26, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(230, 240, 255, 0.25)';
      ctx.fill();
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
  // Phone: the welcome sent before day one, a QR code and a PIN (onboarding).
  qr: () =>
    drawScreen(...PHONE_PX, (k) => {
      const { ctx, W, H, bar, rr } = k;
      bar(64, 52, 78, 20, 0.7);
      bar(W / 2 - 170, 150, 340, 40, 0.92);
      bar(W / 2 - 120, 214, 240, 18, 0.42);
      const N = 21;
      const s = 18;
      const ox = (W - N * s) / 2;
      const oy = 300;
      rr(ox - 30, oy - 30, N * s + 60, N * s + 60, 28, '#ffffff');
      let seed = 11;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      ctx.fillStyle = '#0E1B2C';
      for (let y = 0; y < N; y++)
        for (let x = 0; x < N; x++) {
          const fin = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
          if (!fin && rnd() > 0.5) ctx.fillRect(ox + x * s, oy + y * s, s, s);
        }
      for (const [fx, fy] of [[0, 0], [14, 0], [0, 14]]) {
        ctx.fillStyle = '#0E1B2C';
        ctx.fillRect(ox + fx * s, oy + fy * s, 7 * s, 7 * s);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ox + (fx + 1) * s, oy + (fy + 1) * s, 5 * s, 5 * s);
        ctx.fillStyle = '#0E1B2C';
        ctx.fillRect(ox + (fx + 2) * s, oy + (fy + 2) * s, 3 * s, 3 * s);
      }
      // The PIN: four yellow boxes.
      const py = oy + N * s + 80;
      for (let i = 0; i < 4; i++) rr(W / 2 - 4 * 62 + 14 + i * 124, py, 96, 110, 20, HL);
      bar(W / 2 - 110, H - 56, 220, 12, 0.6);
    }),
  // Phone: calling us (contact): an avatar in rings, call waves, the yellow call button.
  calling: () =>
    drawScreen(...PHONE_PX, (k) => {
      const { ctx, W, H, bar, rr, icon } = k;
      bar(64, 52, 78, 20, 0.7);
      const cy = H * 0.32;
      for (const [r, a] of [[230, 0.06], [180, 0.1], [130, 0.16]] as const) {
        ctx.beginPath();
        ctx.arc(W / 2, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(46, 142, 255, ${a})`;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(W / 2, cy, 96, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.fill();
      icon('user', W / 2 - 54, cy - 54, 108, '#1C3658', 1.8);
      bar(W / 2 - 170, cy + 280, 340, 40, 0.92);
      bar(W / 2 - 110, cy + 350, 220, 18, 0.42);
      for (let i = 0; i < 6; i++) {
        const x = 110 + (i % 3) * ((W - 220) / 2);
        const y = H * 0.66 + Math.floor(i / 3) * 120;
        ctx.beginPath();
        ctx.arc(x, y, 44, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fill();
      }
      rr(W / 2 - 70, H - 250, 140, 140, 70, HL);
      icon('call', W / 2 - 34, H - 214, 68, '#16191E', 2);
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
  const port = new MeshStandardMaterial({ color: 0x3a414b, roughness: 0.6 });
  const pad = new MeshPhysicalMaterial({ color: 0xe2e5e9, roughness: 0.35, metalness: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.2 });
  const logoMat = (color: string) => new MeshStandardMaterial({ map: texture(logoCanvas(color, 512)), transparent: true, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -2 });
  return { clay, oldClay, frame, glass, lens, camRing, groove, port, pad, logo: logoMat('#b8c0ca'), logoLight: logoMat('#8f99a6') };
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

/* ---------- Laptop: hinge at the back, keyboard deck with speaker grilles, lid open or closed ---------- */
let keyTex: Texture | null = null;
function keyboardTexture() {
  if (keyTex) return keyTex;
  const [c, ctx] = makeCanvas(1280, 440);
  ctx.fillStyle = '#eceef1';
  ctx.fillRect(0, 0, 1280, 440);
  // Speaker grilles left and right of the keys: fine dot fields.
  ctx.fillStyle = '#cdd2d8';
  for (const x0 of [22, 1280 - 22 - 96])
    for (let y = 26; y < 400; y += 14)
      for (let x = x0; x < x0 + 96; x += 14) {
        ctx.beginPath();
        ctx.arc(x + 6, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
  const k0 = 140;
  const kw0 = 1280 - k0 * 2;
  const rows = [14, 14, 13, 12, 11];
  const kh = 60;
  const gap = 12;
  const key = (x: number, y: number, w: number, h: number) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 10);
    ctx.fillStyle = '#d3d7dd';
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(x + 2, y + 1, w - 4, h - 7, 9);
    ctx.fillStyle = '#f6f7f8';
    ctx.fill();
  };
  // Function row: shorter keys.
  for (let i = 0; i < 14; i++) key(k0 + i * ((kw0 + gap) / 14), 18, (kw0 + gap) / 14 - gap, 34);
  rows.forEach((n, r) => {
    const kw = (kw0 - gap * (n - 1)) / n;
    for (let i = 0; i < n; i++) key(k0 + i * (kw + gap), 64 + r * (kh + gap), kw, kh);
  });
  key(k0 + kw0 * 0.3, 64 + 5 * (kh + gap) - 2, kw0 * 0.4, kh - 10); // space bar
  keyTex = texture(c);
  return keyTex;
}
function buildLaptop(M: Mats, o: { screen?: Texture; open?: boolean; angle?: number; body?: MeshStandardMaterial | MeshPhysicalMaterial }) {
  const { screen, open = true, angle = 0.32, body = M.frame } = o;
  const lap = new Group();
  const base = mesh(new RoundedBoxGeometry(LW, LT, LD, 5, 0.016), body);
  base.position.y = LT / 2;
  lap.add(base);
  // Front lip: a shallow notch to lift the lid, a soft groove.
  const notch = mesh(new RoundedBoxGeometry(0.16, 0.008, 0.01, 2, 0.004), M.groove, false);
  notch.position.set(0, LT - 0.004, LD / 2 - 0.001);
  lap.add(notch);
  // Ports on the left side: two USB-C and a headphone jack, dark soft slots.
  for (const [z, w] of [[-0.24, 0.05], [-0.15, 0.05], [0.2, 0.018]] as const) {
    const p = mesh(new RoundedBoxGeometry(0.004, 0.012, w, 2, 0.004), M.port, false);
    p.position.set(-LW / 2 - 0.0005, LT / 2, z);
    lap.add(p);
  }
  if (open) {
    const keys = mesh(new PlaneGeometry(LW * 0.94, LD * 0.44), new MeshStandardMaterial({ map: keyboardTexture(), roughness: 0.7, metalness: 0.2 }), false);
    keys.rotation.x = -Math.PI / 2;
    keys.position.set(0, LT + 0.0008, -LD * 0.15);
    lap.add(keys);
    const pad = mesh(flatRound(0.5, 0.3, 0.03), M.pad, false);
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(0, LT + 0.0008, LD * 0.255);
    lap.add(pad);
  }
  // Hinge barrel along the back edge.
  const barrel = mesh(new CylinderGeometry(0.016, 0.016, LW * 0.78, 24), M.port, false);
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(0, LT, -LD / 2 + 0.012);
  lap.add(barrel);
  // Lid pivots on the back edge.
  const hinge = new Group();
  hinge.position.set(0, LT, -LD / 2 + 0.01);
  lap.add(hinge);
  const lid = mesh(new RoundedBoxGeometry(LW, LH, LL, 5, 0.009), body);
  lid.position.set(0, LH / 2, open ? LL / 2 : -LL / 2 - 0.006);
  hinge.add(lid);
  if (open) {
    hinge.rotation.x = -angle;
    const glassFront = mesh(flatRound(LW - 0.03, LH - 0.03, 0.03), M.glass, false);
    glassFront.position.set(0, LH / 2, LL + 0.0008);
    hinge.add(glassFront);
    // Webcam in the top bezel.
    const cam = mesh(new CircleGeometry(0.008, 20), M.lens, false);
    cam.position.set(0, LH - 0.032, LL + 0.0014);
    hinge.add(cam);
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
    // Small grey Spind logo on the closed lid, quiet, like on the lockers.
    const lw = 0.22;
    const logo = new Mesh(new PlaneGeometry(lw, (lw * LOGO_H) / LOGO_W), M.logo);
    logo.position.set(0, LH / 2, -LL - 0.006 - 0.0008);
    logo.rotation.y = Math.PI;
    hinge.add(logo);
  }
  return lap;
}
const CLOSED_H = LT + LL + 0.006;

/* ---------- Monitor (platform): thin panel on a clay stand ---------- */
const MON_W = 0.76;
const MON_H = 0.46;
const MON_SCREEN: [number, number] = [MON_W - 0.03, MON_H - 0.055];
function buildMonitor(M: Mats, tex: Texture) {
  const g = new Group();
  const lift = 0.2;
  const panel = mesh(new RoundedBoxGeometry(MON_W, MON_H, 0.02, 5, 0.008), M.frame);
  panel.position.set(0, lift + MON_H / 2, 0);
  g.add(panel);
  const glassFront = mesh(flatRound(MON_W - 0.008, MON_H - 0.008, 0.008), M.glass, false);
  glassFront.position.set(0, lift + MON_H / 2, 0.0108);
  g.add(glassFront);
  const scr = new Mesh(flatRound(MON_SCREEN[0], MON_SCREEN[1], 0.004), screenMat(tex, 1.05));
  scr.position.set(0, lift + MON_H / 2 + 0.012, 0.0116);
  g.add(scr);
  const sh = sheen(MON_W - 0.008, MON_H - 0.008, 0.008, 0.9);
  sh.position.set(0, lift + MON_H / 2, 0.0122);
  g.add(sh);
  // Small grey logo on the chin.
  const lw = 0.05;
  const logo = new Mesh(new PlaneGeometry(lw, (lw * LOGO_H) / LOGO_W), M.logoLight);
  logo.position.set(0, lift + 0.016, 0.0118);
  g.add(logo);
  const neck = mesh(new RoundedBoxGeometry(0.07, lift + 0.12, 0.025, 3, 0.01), M.clay);
  neck.position.set(0, (lift + 0.12) / 2, -0.03);
  neck.rotation.x = -0.12;
  g.add(neck);
  const foot = mesh(new RoundedBoxGeometry(0.26, 0.012, 0.19, 4, 0.006), M.clay);
  foot.position.set(0, 0.006, -0.05);
  g.add(foot);
  return g;
}

/* ---------- Employee badge (workflows) ---------- */
function buildBadge(M: Mats) {
  const g = new Group();
  const card = mesh(new RoundedBoxGeometry(0.054, 0.0856, 0.0024, 3, 0.001), M.clay);
  g.add(card);
  const [c, ctx] = makeCanvas(256, 406);
  ctx.fillStyle = '#f4f5f7';
  ctx.fillRect(0, 0, 256, 406);
  ctx.fillStyle = '#2E8EFF';
  ctx.fillRect(0, 0, 256, 70);
  ctx.beginPath();
  ctx.arc(128, 170, 56, 0, Math.PI * 2);
  ctx.fillStyle = '#d7dce2';
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(48, 258, 160, 22, 11);
  ctx.fillStyle = '#b8c0ca';
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(72, 296, 112, 14, 7);
  ctx.fillStyle = '#d7dce2';
  ctx.fill();
  ctx.drawImage(logoCanvas('#ffffff', 160), 84, 16, 88, 88 * (LOGO_H / LOGO_W));
  const face = new Mesh(new PlaneGeometry(0.052, 0.0836), new MeshStandardMaterial({ map: texture(c), roughness: 0.6 }));
  face.position.z = 0.0013;
  g.add(face);
  return g;
}

/* ---------- Integration tiles: clay blocks with a blue line icon ---------- */
const TILE_ICON: Record<string, string> = {
  mdm: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6zM9 12l2 2 4-4',
  itsm: 'M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4zM14 7v10',
  identity: 'M3 6h18v12H3zM8.5 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5.5 16.2c.5-1.4 1.6-2 3-2s2.5.6 3 2M14 10h4.5M14 13h3.5',
  hr: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.5 19a5.5 5.5 0 0 1 11 0M16 11a2.5 2.5 0 1 0 0-5M17 14.5a4.5 4.5 0 0 1 3.5 4.5',
  courier: 'M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6zM17 19a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z',
  service: 'M15 4a4 4 0 0 0-3.8 5.2L4 16.4 7.6 20l7.2-7.2A4 4 0 0 0 20 9l-2.5 2.5-3-3L17 6a4 4 0 0 0-2-2z',
  hospital: 'M4 21V7l8-4 8 4v14zM10 21v-5h4v5M12 7.5v5M9.5 10h5',
  warehouse: 'M3 21V9l9-5 9 5v12M7 21v-7h10v7M7 17.5h10',
  office: 'M5 21V4h10v17M15 9h4v12M8 8h2M8 12h2M8 16h2M3 21h18',
};
function buildTile(M: Mats, name: string) {
  const g = new Group();
  const s = 0.2;
  const block = mesh(new RoundedBoxGeometry(s, s, 0.05, 5, 0.03), M.clay);
  block.position.y = s / 2;
  g.add(block);
  const [c, ctx] = makeCanvas(256, 256);
  ctx.fillStyle = '#f1f3f5';
  ctx.fillRect(0, 0, 256, 256);
  ctx.save();
  ctx.translate(68, 56);
  ctx.scale(120 / 24, 120 / 24);
  ctx.strokeStyle = '#2E8EFF';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke(new Path2D(TILE_ICON[name]));
  ctx.restore();
  ctx.beginPath();
  ctx.roundRect(88, 200, 80, 10, 5);
  ctx.fillStyle = '#cfd5dc';
  ctx.fill();
  const face = new Mesh(flatRound(s - 0.04, s - 0.04, 0.02), new MeshStandardMaterial({ map: texture(c), roughness: 0.75 }));
  face.position.set(0, s / 2, 0.0252);
  g.add(face);
  // Status light: a small blue dot on top.
  const dot = new Mesh(new CircleGeometry(0.008, 20), new MeshBasicMaterial({ color: BLUE, toneMapped: false }));
  dot.rotation.x = -Math.PI / 2;
  dot.position.set(s / 2 - 0.03, s + 0.0005, 0);
  g.add(dot);
  return g;
}

/* ---------- Search, return kit: magnifying glass, headset, charger ---------- */
function buildMagnifier(M: Mats) {
  const g = new Group();
  const R = 0.42;
  const rim = mesh(new TorusGeometry(R, 0.05, 24, 96), M.frame);
  g.add(rim);
  const lens = new Mesh(
    new CircleGeometry(R - 0.02, 64),
    new MeshPhysicalMaterial({ color: 0xd6e8ff, transparent: true, opacity: 0.22, roughness: 0.02, clearcoat: 1, clearcoatRoughness: 0.02, depthWrite: false })
  );
  g.add(lens);
  const glint = new Mesh(new RingGeometry(R * 0.55, R * 0.62, 48, 1, 0.5, 1.1), new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, depthWrite: false, toneMapped: false }));
  glint.position.z = 0.002;
  g.add(glint);
  const collar = mesh(new CylinderGeometry(0.065, 0.075, 0.12, 32), M.frame);
  collar.position.set(0, -R - 0.08, 0);
  g.add(collar);
  const handle = mesh(new CylinderGeometry(0.06, 0.068, 0.62, 32), M.clay);
  handle.position.set(0, -R - 0.14 - 0.31, 0);
  g.add(handle);
  const cap = mesh(new CircleGeometry(0.068, 32), M.clay);
  cap.rotation.x = Math.PI / 2;
  cap.position.set(0, -R - 0.14 - 0.62, 0);
  g.add(cap);
  return g;
}
function buildHeadset(M: Mats) {
  const g = new Group();
  const band = mesh(new TorusGeometry(0.3, 0.035, 20, 64, Math.PI), M.clay);
  band.position.y = 0.12;
  g.add(band);
  for (const side of [-1, 1]) {
    const cup = mesh(new CylinderGeometry(0.12, 0.12, 0.08, 40), M.clay);
    cup.rotation.z = Math.PI / 2;
    cup.position.set(side * 0.3, 0.12, 0);
    g.add(cup);
    const pad = mesh(new CylinderGeometry(0.1, 0.1, 0.03, 40), M.groove);
    pad.rotation.z = Math.PI / 2;
    pad.position.set(side * 0.255, 0.12, 0);
    g.add(pad);
  }
  return g;
}
function buildCharger(M: Mats) {
  const g = new Group();
  const brick = mesh(new RoundedBoxGeometry(0.24, 0.1, 0.24, 4, 0.03), M.clay);
  brick.position.y = 0.05;
  g.add(brick);
  const curve = new CatmullRomCurve3([
    new Vector3(0, 0.03, 0.12),
    new Vector3(0.05, 0.02, 0.35),
    new Vector3(0.3, 0.02, 0.45),
    new Vector3(0.45, 0.02, 0.25),
    new Vector3(0.4, 0.02, 0.05),
  ]);
  const cable = mesh(new TubeGeometry(curve, 64, 0.016, 10, false), M.clay);
  g.add(cable);
  const plug = mesh(new RoundedBoxGeometry(0.05, 0.03, 0.08, 2, 0.01), M.groove);
  plug.position.set(0.4, 0.02, 0.03);
  g.add(plug);
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
  const ping = pings(root, { r0: 0.8, r1: 1.5 });
  // Searching: a magnifying glass sweeps slowly over the phone, lens toward the camera.
  const mag = buildMagnifier(M);
  const holder = new Group();
  holder.add(mag);
  mag.scale.setScalar(0.85);
  mag.rotation.set(-0.75, 0, -0.55);
  root.add(holder);
  const place = (t: number) => {
    holder.position.set(0.32 + Math.cos(t * 0.6) * 0.22, 0.75 + Math.sin(t * 1.2) * 0.04, 0.25 + Math.sin(t * 0.6) * 0.16);
  };
  place(0.6);
  return {
    root,
    span: (a) => Math.max(1.75, 2.35 / a),
    lookY: 0.25,
    elev: 46,
    restY: 0,
    tick: (t, r, ambient) => {
      ping(t, r);
      if (ambient) place(t);
    },
  };
}

/** Shared framing for the open-laptop scenes. */
const lapFrame = { span: (a: number) => Math.max(1.75, 2.55 / a), lookY: 0.36, elev: 30, restY: -0.42, maxX: 0.05 };

/** A Spind locker in scene units (k units per metre), with drawer `open` (index) out and lit. */
function lockerAt(modules: ModuleKey[], k: number, open?: number, screenDrawer?: number) {
  const L = buildLocker({ modules, screenDrawer: screenDrawer ?? (open !== undefined ? open + 1 : null), yellow: true });
  L.root.scale.setScalar(k);
  if (open !== undefined) L.setOpen(open, 1);
  return L;
}

/** Swap: the faulty laptop in front, Otto behind with the laptop drawer out and the replacement in it. */
function sceneFaulty(M: Mats): Built {
  const root = new Group();
  const K = 2.5;
  const L = lockerAt(['master'], K, OTTO_LAPTOP);
  L.root.position.set(-0.6, 0, -0.7);
  L.root.rotation.y = 0.32;
  const lap = buildLaptop(M, { screen: screens.faulty() });
  lap.scale.setScalar(0.82);
  lap.position.set(0.68, 0, 0.55);
  lap.rotation.y = -0.42;
  root.add(L.root, lap, floorSpot(3.6, 0.4));
  // Two-way flow between drawer and laptop, and a small pair of swap arrows turning on the floor between them.
  const out = runner(root, floorCurve([-0.3, 0.05], [0.45, 0.35], 0.2), { dots: 3, trail: 14, period: 2.4 });
  const back = runner(root, floorCurve([0.35, 0.55], [-0.45, 0.25], 0.2), { dots: 3, trail: 14, period: 2.4 });
  const arrows = new Group();
  for (const a of [0, Math.PI]) arrows.add(flat(new Mesh(arcArrow(0.2, 0.024, a + 0.35, a + Math.PI - 0.5), blueMat(0.95)), 0.0014, -1));
  arrows.position.set(0, 0, 0.32);
  root.add(arrows);
  return {
    root,
    span: (a) => Math.max(2.7, 3.7 / a),
    lookY: 0.9,
    elev: 16,
    restY: -0.12,
    maxX: 0.04,
    keyTarget: [0, 0.9, 0],
    tick: (t, r) => {
      out(t, r);
      back(t, r);
      arrows.rotation.y = r ? 0.3 : -t * 0.6;
    },
  };
}

/** Temporary device: the loan laptop out of Otto's laptop drawer, its loan time as a dial on the floor, the way back. */
function sceneLoan(M: Mats): Built {
  const root = new Group();
  const L = lockerAt(['master'], 2.5, OTTO_LAPTOP);
  L.root.position.set(-0.62, 0, -0.72);
  L.root.rotation.y = 0.3;
  const lap = buildLaptop(M, { screen: screens.loan() });
  lap.scale.setScalar(0.78);
  lap.position.set(0.62, 0, 0.5);
  lap.rotation.y = -0.4;
  root.add(L.root, lap, floorSpot(3.4, 0.38));
  // The loan period: a dial of ticks around the laptop, filling up, then starting over.
  const N = 48;
  const R = 0.92;
  const geo = new PlaneGeometry(0.02, 0.09);
  const ticks = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    const m = new Mesh(geo, blueMat(0.15));
    m.rotation.set(-Math.PI / 2, 0, -a + Math.PI / 2);
    m.scale.y = i % 4 === 0 ? 1.5 : 1;
    m.position.set(0.62 + Math.cos(a) * R, 0.0012, 0.5 + Math.sin(a) * R);
    m.renderOrder = -1;
    root.add(m);
    return m;
  });
  // Out of the drawer, and back in when the loan ends.
  const out = runner(root, floorCurve([-0.32, 0.0], [0.05, 0.45], 0.15), { dots: 2, trail: 10, period: 2.4 });
  const back = runner(root, floorCurve([0.1, 0.8], [-0.5, 0.2], 0.25), { dots: 2, trail: 12, period: 2.4 });
  const PERIOD = 9;
  return {
    root,
    span: (a) => Math.max(2.7, 3.7 / a),
    lookY: 0.9,
    elev: 17,
    restY: -0.12,
    maxX: 0.04,
    keyTarget: [0, 0.9, 0],
    tick: (t, reduce) => {
      const p = reduce ? 0.72 : (t / PERIOD) % 1;
      const lit = p * N;
      ticks.forEach((m, i) => ((m.material as MeshBasicMaterial).opacity = i < lit ? (i > lit - 1.5 ? 1 : 0.8) : 0.14));
      // Near the end of the loan the way back lights up (the reminder).
      out(t, reduce);
      back(t, reduce);
    },
  };
}

/**
 * EOU rollout: one visit, two drawers. Otto and Bruno (8 wide drawers): the old laptop goes into one drawer,
 * the new, ready one comes out of another. The old one waits in front (closed, greyer), the new one stands open with a check.
 */
function sceneRollout(M: Mats): Built {
  const root = new Group();
  const NEW = 10 + 2; // Bruno's third drawer: the new device
  const OLD = 10 + 5; // Bruno's sixth drawer: waiting for the old one
  const L = lockerAt(['master', 'n8'], 2.1, undefined, NEW + 1);
  L.setOpen(NEW, 1);
  L.setOpen(OLD, 0.75, false);
  L.root.position.set(-0.15, 0, -0.85);
  L.root.rotation.y = 0.12;
  const old = buildLaptop(M, { open: false, body: M.oldClay });
  old.scale.setScalar(0.72);
  old.position.set(-0.95, 0, 0.55);
  old.rotation.y = 0.5;
  const lap = buildLaptop(M, { screen: screens.ready() });
  lap.scale.setScalar(0.72);
  lap.position.set(0.92, 0, 0.55);
  lap.rotation.y = -0.45;
  root.add(L.root, old, lap, floorSpot(3.8, 0.38));
  // Old in (left), new out (right).
  const inRun = runner(root, floorCurve([-0.85, 0.2], [0.05, -0.35], -0.2), { dots: 3, trail: 14, period: 2.6 });
  const outRun = runner(root, floorCurve([0.55, -0.35], [0.85, 0.2], -0.2), { dots: 3, trail: 14, period: 2.6 });
  const ping = pings(root, { r0: 0.45, r1: 0.8, x: 0.92, z: 0.55, count: 2, strength: 0.6 });
  return {
    root,
    span: (a) => Math.max(2.4, 4.0 / a),
    lookY: 0.75,
    elev: 18,
    restY: -0.05,
    maxX: 0.04,
    keyTarget: [0, 0.8, 0],
    tick: (t, r) => {
      inRun(t, r);
      outRun(t, r);
      ping(t, r);
    },
  };
}

/** Onboarding: the kit waits in Otto's laptop drawer; the new hire's phone shows the QR code and PIN sent before day one. */
function sceneOnboarding(M: Mats): Built {
  const root = new Group();
  const L = lockerAt(['master'], 2.5, OTTO_LAPTOP);
  L.root.position.set(-0.72, 0, -0.75);
  L.root.rotation.y = 0.3;
  const lap = buildLaptop(M, { screen: screens.welcome() });
  lap.scale.setScalar(0.78);
  lap.position.set(0.42, 0, 0.32);
  lap.rotation.y = -0.38;
  const phone = lyingPhone(M, screens.qr(), -0.45, 0.5);
  phone.position.set(1.18, 0, 0.92);
  root.add(L.root, lap, phone, floorSpot(3.4, 0.42));
  const ping = pings(root, { r0: 0.35, r1: 0.7, x: 1.18, z: 0.92, strength: 0.7, period: 2.8, count: 2 });
  const run = runner(root, floorCurve([-0.4, 0.05], [0.95, 0.75], 0.25), { dots: 3, trail: 18 });
  return {
    root,
    span: (a) => Math.max(2.7, 3.8 / a),
    lookY: 0.85,
    elev: 17,
    restY: -0.12,
    maxX: 0.04,
    keyTarget: [0, 0.9, 0],
    tick: (t, r) => {
      ping(t, r);
      run(t, r);
    },
  };
}

/**
 * Offboarding: everything comes back on the last day. An empty wide drawer stands open and lit; in front the leaver's
 * kit waits to go in: the closed laptop with the phone (being wiped) on top, the headset, the charger. Rings draw in.
 */
function sceneOffboarding(M: Mats): Built {
  const root = new Group();
  const L = lockerAt(['master', 'n8'], 2.1);
  const D = 10 + 4;
  L.setOpen(D, 1, false);
  L.root.position.set(-0.2, 0, -0.9);
  L.root.rotation.y = 0.1;
  const kit = new Group();
  const lap = buildLaptop(M, { open: false });
  lap.scale.setScalar(0.7);
  lap.rotation.y = 0.25;
  const phone = lyingPhone(M, screens.wipe(), 0.6, 0.36, CLOSED_H * 0.7);
  phone.rotation.y = 0.25;
  phone.position.set(0.05, 0, 0.04);
  const headset = buildHeadset(M);
  headset.position.set(0.95, 0, -0.05);
  headset.rotation.y = -0.6;
  const charger = buildCharger(M);
  charger.position.set(-0.85, 0, 0.15);
  charger.rotation.y = 0.5;
  kit.add(lap, phone, headset, charger);
  kit.scale.setScalar(1.35);
  kit.position.set(0.05, 0, 0.62);
  root.add(L.root, kit, floorSpot(3.6, 0.42));
  // Into the drawer: dots from each item, rings drawing in toward the drawer front.
  const ticks = [
    runner(root, floorCurve([-0.7, 0.6], [0.15, -0.25], -0.2), { dots: 2, trail: 12, period: 2.6 }),
    runner(root, floorCurve([0.1, 0.25], [0.3, -0.25], 0), { dots: 2, trail: 8, period: 2.2 }),
    runner(root, floorCurve([0.95, 0.45], [0.45, -0.25], 0.2), { dots: 2, trail: 12, period: 2.6 }),
    pings(root, { r0: 0.3, r1: 0.75, x: 0.32, z: -0.2, inward: true, period: 2.8, count: 3, strength: 0.6 }),
  ];
  return {
    root,
    span: (a) => Math.max(2.4, 3.9 / a),
    lookY: 0.75,
    elev: 20,
    restY: -0.05,
    maxX: 0.04,
    keyTarget: [0, 0.8, 0],
    tick: (t, r) => ticks.forEach((f) => f(t, r)),
  };
}

/** Four branches, each with its own real Spind, linked by the partner network. Real metres. */
function sceneMultiSite(): Built {
  const root = new Group();
  const sites: [number, number, ModuleKey[]][] = [
    [-1.25, -0.2, ['master', 's24']],
    [0.15, -1.05, ['master']],
    [1.35, -0.05, ['master', 'n8']],
    [0.0, 0.95, ['master']],
  ];
  const ticks: ((t: number, r: boolean) => void)[] = [];
  sites.forEach(([x, z, mods], i) => {
    const L = buildLocker({ modules: mods, screenDrawer: i === 3 ? 5 : null });
    L.root.position.set(x, 0, z);
    L.root.rotation.y = [0.35, 0.05, -0.35, 0.1][i];
    const spot = floorSpot(1.6, 0.4);
    spot.position.set(x, 0.0008, z + 0.3);
    root.add(L.root, spot);
    ticks.push(pings(root, { r0: 0.55, r1: 1.0, x, z: z + 0.25, count: 2, period: 3.2, offset: i * 0.25, strength: 0.6 }));
  });
  const P = sites.map(([x, z]) => [x, z + 0.42] as [number, number]);
  const links: [number, number, number][] = [[0, 1, 0.18], [1, 2, 0.18], [2, 3, 0.2], [3, 0, 0.18]];
  links.forEach(([a, b, bend], i) => ticks.push(runner(root, floorCurve(P[a], P[b], bend), { dots: 2, trail: 18, period: 3 + i * 0.3, size: 0.02 })));
  return { root, span: (a) => Math.max(2.4, 4.4 / a), lookY: 0.2, elev: 30, restY: 0, keyTarget: [0, 0.4, 0], tick: (t, r) => ticks.forEach((f) => f(t, r)) };
}

/**
 * Workflows: the employee taps a badge at Otto's reader (rings pulse out of it) and one drawer after another slides
 * out lit blue and back in: pickup, return, swap, the five actions running on one locker. Real metres.
 */
function sceneWorkflows(M: Mats): Built {
  const root = new Group();
  const L = buildLocker({ modules: ['master', 's24'], screenDrawer: 4, yellow: true });
  root.add(L.root, floorSpot(2.6, 0.38));
  const ox = -(LK_W + LK_GAP) / 2; // Otto's centre
  const readerX = ox - 0.24;
  const readerY = LTOP - 0.06 - 0.125;
  const badge = buildBadge(M);
  badge.scale.setScalar(1.7);
  badge.position.set(readerX + 0.02, readerY - 0.01, LK_D / 2 + 0.09);
  badge.rotation.set(-0.1, 0.35, 0.18);
  root.add(badge);
  // Rings pulsing out of the reader.
  const ringGeo = new RingGeometry(0.97, 1, 64);
  const rings = Array.from({ length: 3 }, () => {
    const m = new Mesh(ringGeo, blueMat());
    m.position.set(readerX, readerY, LK_D / 2 + 0.008);
    root.add(m);
    return m;
  });
  // A walking path on the floor up to the locker.
  const run = runner(root, floorCurve([-1.25, 1.15], [ox, LK_D / 2 + 0.18], -0.2), { dots: 3, trail: 20, period: 2.8, size: 0.014 });
  // The drawer sequence: one of Otto's phone drawers, the laptop drawer, two of Lotte's.
  const seq = [4, OTTO_LAPTOP, 10 + 7, 10 + 16];
  const STEP = 2.6;
  return {
    root,
    span: (a) => Math.max(1.05, 1.65 / a),
    lookY: 0.47,
    elev: 13,
    restY: -0.38,
    maxX: 0.05,
    keyTarget: [0, 0.5, 0],
    tick: (t, reduce, ambient) => {
      run(t, reduce);
      rings.forEach((m, i) => {
        const p = reduce ? (i + 0.5) / 3 : ((t / 1.8 + i / 3) % 1);
        const r = 0.03 + p * 0.07;
        m.scale.set(r, r, 1);
        (m.material as MeshBasicMaterial).opacity = (1 - p) * 0.8;
      });
      if (ambient) badge.position.z = LK_D / 2 + 0.09 + Math.sin(t * 1.6) * 0.008;
      if (reduce) {
        L.setOpen(seq[1], 1);
        return;
      }
      const k = Math.floor(t / STEP) % seq.length;
      const local = (t % STEP) / STEP;
      // Out over 15%, hold, back in over 15%, then a short pause.
      const ease = (x: number) => x * x * (3 - 2 * x);
      const p = local < 0.15 ? ease(local / 0.15) : local < 0.7 ? 1 : local < 0.85 ? 1 - ease((local - 0.7) / 0.15) : 0;
      seq.forEach((d) => d !== seq[k] && L.setOpen(d, 0));
      L.setOpen(seq[k], p);
    },
  };
}

/** Platform: one screen shows every site; three Spinds stand behind it, each reporting in along the floor. */
function scenePlatform(M: Mats): Built {
  const root = new Group();
  const mon = buildMonitor(M, screens.dashboard());
  mon.scale.setScalar(1.7);
  mon.position.set(0, 0, 0.7);
  root.add(mon);
  const sites: [number, number, ModuleKey[], number][] = [
    [-1.15, -0.55, ['master', 's24'], 0.35],
    [0.05, -1.1, ['master', 'm124'], 0],
    [1.15, -0.5, ['master'], -0.35],
  ];
  const ticks: ((t: number, r: boolean) => void)[] = [];
  sites.forEach(([x, z, mods, ry], i) => {
    const L = buildLocker({ modules: mods, screenDrawer: null });
    L.root.position.set(x, 0, z);
    L.root.rotation.y = ry;
    root.add(L.root);
    ticks.push(runner(root, floorCurve([x, z + 0.42], [0, 0.55], 0.15 * (i - 1)), { dots: 2, trail: 18, period: 2.6 + i * 0.35, size: 0.018 }));
    ticks.push(pings(root, { r0: 0.5, r1: 0.85, x, z: z + 0.2, count: 2, offset: i * 0.3, strength: 0.5 }));
  });
  root.add(floorSpot(3.6, 0.35));
  return { root, span: (a) => Math.max(1.7, 3.3 / a), lookY: 0.55, elev: 15, restY: 0, maxX: 0.04, keyTarget: [0, 0.6, 0], tick: (t, r) => ticks.forEach((f) => f(t, r)) };
}

/** Integrations: your systems and partners as clay tiles in an arc, each feeding the locker along the floor. */
function sceneIntegrations(M: Mats): Built {
  const root = new Group();
  const L = buildLocker({ modules: ['master', 's24'], screenDrawer: 7 });
  L.root.position.z = -0.45;
  root.add(L.root, floorSpot(3, 0.38));
  const names = ['mdm', 'itsm', 'identity', 'hr', 'courier', 'service'];
  const ticks: ((t: number, r: boolean) => void)[] = [];
  names.forEach((n, i) => {
    const a = MathUtils.degToRad(200 + (i * 140) / (names.length - 1)); // a front arc, left to right
    const x = Math.cos(a) * 1.15;
    const z = 0.25 - Math.sin(a) * 0.75;
    const tile = buildTile(M, n);
    tile.position.set(x, 0, z);
    tile.scale.setScalar(1.45);
    tile.rotation.y = -x * 0.35;
    root.add(tile);
    ticks.push(runner(root, floorCurve([x, z - 0.06], [(x * 0.25), -0.12], 0.08 * (x > 0 ? 1 : -1)), { dots: 2, trail: 14, period: 2.2 + (i % 3) * 0.35, size: 0.012 }));
  });
  return { root, span: (a) => Math.max(1.3, 2.45 / a), lookY: 0.4, elev: 18, restY: 0, maxX: 0.04, keyTarget: [0, 0.5, 0], tick: (t, r) => ticks.forEach((f) => f(t, r)) };
}

/**
 * Business case: IT desk time per month as clay bars on a slab, today (tall) next to with Spind (short, blue capped),
 * growing in on a loop; Otto stands beside them. Real metres.
 */
function sceneBusinessCase(M: Mats): Built {
  const root = new Group();
  const L = buildLocker({ modules: ['master'], screenDrawer: 2 });
  L.root.position.set(-0.78, 0, -0.1);
  L.root.rotation.y = 0.28;
  root.add(L.root, floorSpot(2.8, 0.38));
  const slab = mesh(new RoundedBoxGeometry(1.3, 0.035, 0.52, 4, 0.015), M.clay);
  slab.position.set(0.45, 0.0175, 0.05);
  root.add(slab);
  const today = [0.5, 0.56, 0.6, 0.64, 0.7];
  const spind = [0.2, 0.17, 0.15, 0.13, 0.11];
  const barGeo = new RoundedBoxGeometry(0.11, 1, 0.11, 3, 0.012);
  const capGeo = new RoundedBoxGeometry(0.112, 0.018, 0.112, 2, 0.008);
  const capMat = new MeshStandardMaterial({ color: BLUE, emissive: BLUE, emissiveIntensity: 1.2, roughness: 0.4, toneMapped: false });
  const bars: { m: Mesh; cap?: Mesh; h: number; d: number }[] = [];
  today.forEach((h, i) => {
    const x = -0.1 + i * 0.25;
    const a = mesh(barGeo, M.oldClay);
    a.position.set(x, 0, -0.07);
    const b = mesh(barGeo, M.clay);
    b.position.set(x + 0.06, 0, 0.12);
    const cap = mesh(capGeo, capMat, false);
    root.add(a, b, cap);
    bars.push({ m: a, h, d: i * 0.08 }, { m: b, cap, h: spind[i], d: i * 0.08 + 0.04 });
  });
  const base = 0.035;
  const set = (p: number) =>
    bars.forEach(({ m, cap, h, d }) => {
      const k = Math.max(0.001, Math.min(1, (p - d) / 0.35));
      const e = 1 - Math.pow(1 - k, 3);
      m.scale.y = h * e;
      m.position.y = base + (h * e) / 2;
      if (cap) cap.position.set(m.position.x, base + h * e + 0.006, m.position.z);
    });
  const run = runner(root, floorCurve([-0.45, 0.45], [0.3, 0.45], 0.1), { dots: 2, trail: 12, period: 2.4, size: 0.014 });
  const PERIOD = 7;
  return {
    root,
    span: (a) => Math.max(1.2, 2.3 / a),
    lookY: 0.38,
    elev: 20,
    restY: -0.1,
    maxX: 0.04,
    keyTarget: [0, 0.4, 0],
    tick: (t, reduce) => {
      run(t, reduce);
      const p = reduce ? 1 : Math.min(1, ((t % PERIOD) / PERIOD) * 1.6);
      set(p);
    },
  };
}

/** Contact: a phone lying on the floor calling us (avatar, yellow call button), call rings rippling out. */
function sceneContact(M: Mats): Built {
  const root = new Group();
  root.add(lyingPhone(M, screens.calling(), -0.42), floorSpot(2, 0.6));
  const ping = pings(root, { r0: 0.8, r1: 1.18, period: 2.6 });
  return { root, span: (a) => Math.max(1.75, 2.75 / a), lookY: 0.02, elev: 50, restY: 0, tick: (t, r) => ping(t, r) };
}

/** Case studies: three customers in different industries, each site on its own clay plinth with its Spind. */
function sceneCustomers(M: Mats): Built {
  const root = new Group();
  const sites: [number, number, ModuleKey[], string, number][] = [
    [-1.2, 0.05, ['master', 's24'], 'hospital', 0.35],
    [0.05, -0.55, ['master', 'n8'], 'warehouse', 0],
    [1.25, 0.1, ['master'], 'office', -0.35],
  ];
  const ticks: ((t: number, r: boolean) => void)[] = [];
  const discGeo = new CylinderGeometry(0.62, 0.64, 0.04, 64);
  sites.forEach(([x, z, mods, icon, ry], i) => {
    const disc = mesh(discGeo, M.clay);
    disc.position.set(x, 0.02, z);
    const L = buildLocker({ modules: mods, screenDrawer: null, contact: false });
    L.root.position.set(x, 0.04, z - 0.1);
    L.root.rotation.y = ry;
    const tile = buildTile(M, icon);
    tile.scale.setScalar(1.6);
    tile.position.set(x + (i === 2 ? -0.36 : 0.36), 0.04, z + 0.42);
    tile.rotation.y = ry * 0.6;
    root.add(disc, L.root, tile);
    ticks.push(pings(root, { r0: 0.7, r1: 1.0, x, z, count: 2, offset: i * 0.33, strength: 0.55 }));
  });
  ticks.push(runner(root, floorCurve([-0.6, 0.35], [-0.45, -0.35], 0.15), { dots: 2, trail: 12, period: 2.8, size: 0.016 }));
  ticks.push(runner(root, floorCurve([0.55, -0.35], [0.7, 0.4], 0.15), { dots: 2, trail: 12, period: 3.1, size: 0.016 }));
  root.add(floorSpot(3.6, 0.3));
  return { root, span: (a) => Math.max(1.5, 3.5 / a), lookY: 0.4, elev: 22, restY: 0, maxX: 0.04, keyTarget: [0, 0.4, 0], tick: (t, r) => ticks.forEach((f) => f(t, r)) };
}

const SCENES: Record<string, (M: Mats, pose: string) => Built> = {
  'business-case': sceneBusinessCase,
  contact: sceneContact,
  customers: sceneCustomers,
  'lost-device': sceneLost,
  'faulty-device-swap': sceneFaulty,
  'temporary-device': sceneLoan,
  'eou-rollout': sceneRollout,
  onboarding: sceneOnboarding,
  offboarding: sceneOffboarding,
  'multi-site': sceneMultiSite,
  workflows: sceneWorkflows,
  platform: scenePlatform,
  integrations: sceneIntegrations,
};
export const DEVICE_SCENES = Object.keys(SCENES);
/** Bleed of the canvas past the stage on each side, as a share of the stage size (keep in sync with Device3D.astro). */
const BLEED_X = 0.6;
const BLEED_Y = 0.45;

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
  // The canvas bleeds past the stage (Device3D.astro: BLEED), so rings and glows run out into the hero, behind the
  // text, and stop only at the hero's own edge. The subject stays framed in the stage box (view offset).
  const resize = () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    const cw = w * (1 + BLEED_X * 2);
    const ch = h * (1 + BLEED_Y * 2);
    renderer.setSize(cw, ch, false);
    camera.aspect = w / h;
    fit();
    camera.setViewOffset(w, h, -w * BLEED_X, -h * BLEED_Y, cw, ch);
    camera.updateProjectionMatrix();
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
