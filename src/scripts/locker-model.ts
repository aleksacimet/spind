/**
 * A static Spind locker model for the 3D scenes in hero-device.ts (use case and product page heroes).
 * Same build and look as the interactive hero locker (hero-locker.ts): clay cabinets on a recessed plinth, lighter
 * drawer fronts with soft grooves, fine light strips, Otto's black glass screen with the badge reader (blue ring) and
 * QR camera, a small grey logo. Dimensions are real metres (a module is 600 wide, 910 tall, 500 deep).
 * Screens are text-free (shapes only). Drawers can be opened (with a tray, a device and the blue compartment light).
 */
import {
  BoxGeometry,
  CanvasTexture,
  CircleGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  RingGeometry,
  SRGBColorSpace,
  type BufferGeometry,
  type Material,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { LOGO_PATHS, LOGO_W, LOGO_H } from '../components/logo-path';

export const LW = 0.6; // module width
export const LGAP = 0.06; // space between modules
export const LD = 0.5; // depth
const PL = 0.05; // plinth
const BODY = 0.86;
export const LTOP = PL + BODY;
const FM = 0.022;
const DG = 0.0025;
const FZ = LD / 2;
const FRONT_T = 0.02;
const FRONT_Z = FZ - 0.006;
const FACE = FRONT_Z + FRONT_T / 2;
const BLUE = 0x2e8eff;

export type ModuleKey = 'master' | 's24' | 'n8' | 'm124';
const ROWS: Record<Exclude<ModuleKey, 'master'>, number[]> = {
  s24: [3, 3, 3, 3, 3, 3, 3, 3],
  n8: [1, 1, 1, 1, 1, 1, 1, 1],
  m124: [3, 3, 3, 3, 1, 1, 1, 1],
};
const MASTER_ROWS = [3, 3, 3, 1];

export type LockerDrawer = {
  g: Group;
  w: number;
  h: number;
  wide: boolean;
  strip: Mesh;
  light: Mesh;
  max: number;
  tray?: Group;
};

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
export function logoCanvas(color: string, w: number) {
  const h = Math.round((w * LOGO_H) / LOGO_W);
  const [c, ctx] = makeCanvas(w, h);
  ctx.scale(w / LOGO_W, h / LOGO_H);
  ctx.fillStyle = color;
  for (const p of LOGO_PATHS) ctx.fill(new Path2D(p.d), p.evenodd ? 'evenodd' : 'nonzero');
  return c;
}

/* ---------- Shared, built once ---------- */
let shared: ReturnType<typeof makeShared> | null = null;
function makeShared() {
  const geo = new Map<string, BufferGeometry>();
  const rbox = (w: number, h: number, d: number, r: number, seg = 3) => {
    const k = [w, h, d, r, seg].map((v) => v.toFixed(4)).join();
    let g = geo.get(k);
    if (!g) geo.set(k, (g = new RoundedBoxGeometry(w, h, d, seg, r)));
    return g;
  };
  const plane = (w: number, h: number) => {
    const k = `p${w.toFixed(4)}x${h.toFixed(4)}`;
    let g = geo.get(k);
    if (!g) geo.set(k, (g = new PlaneGeometry(w, h)));
    return g;
  };
  // Soft occlusion on a drawer front: darker toward each gap, most along the bottom (a groove, not a line).
  const shadeCache = new Map<string, MeshStandardMaterial>();
  const clayFront = new MeshStandardMaterial({ color: 0xf1f3f5, roughness: 0.74 });
  const frontFor = (w: number, h: number) => {
    const k = `${w.toFixed(4)}x${h.toFixed(4)}`;
    let m = shadeCache.get(k);
    if (m) return m;
    const cw = 128;
    const ch = Math.max(16, Math.round((cw * h) / w));
    const [c, ctx] = makeCanvas(cw, ch);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);
    const ex = (0.012 / w) * cw;
    const ey = (0.012 / h) * ch;
    const edge = (x0: number, y0: number, x1: number, y1: number, a: number) => {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, `rgba(96, 108, 124, ${a})`);
      g.addColorStop(1, 'rgba(96, 108, 124, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, cw, ch);
    };
    edge(0, 0, ex, 0, 0.08);
    edge(cw, 0, cw - ex, 0, 0.08);
    edge(0, 0, 0, ey, 0.06);
    edge(0, ch, 0, ch - ey, 0.12);
    m = clayFront.clone();
    m.map = texture(c);
    shadeCache.set(k, m);
    return m;
  };
  const lightTex = (() => {
    const [c, ctx] = makeCanvas(4, 128);
    const gr = ctx.createLinearGradient(0, 0, 0, 128);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.15, 'rgba(255,255,255,0.85)');
    gr.addColorStop(1, 'rgba(255,255,255,0.2)');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, 4, 128);
    return texture(c, false);
  })();
  const sheen = (() => {
    const [c, ctx] = makeCanvas(512, 356);
    const g = ctx.createLinearGradient(0, 0, 512, 356);
    g.addColorStop(0, 'rgba(255,255,255,0.10)');
    g.addColorStop(0.34, 'rgba(255,255,255,0.07)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.02)');
    g.addColorStop(0.62, 'rgba(255,255,255,0)');
    g.addColorStop(1, 'rgba(255,255,255,0.03)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 356);
    return texture(c);
  })();
  const nfc = (() => {
    const [c, ctx] = makeCanvas(256, 256);
    ctx.strokeStyle = 'rgba(230, 236, 243, 0.85)';
    ctx.lineCap = 'round';
    ctx.lineWidth = 10;
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      ctx.arc(92, 128, 26 + k * 28, -Math.PI / 4, Math.PI / 4);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(230, 236, 243, 0.85)';
    ctx.beginPath();
    ctx.arc(92, 128, 8, 0, Math.PI * 2);
    ctx.fill();
    return texture(c);
  })();
  const contact = (() => {
    // Soft contact shadow under a module.
    const S = 128;
    const pad = 0.16;
    const tw = LW + pad * 2;
    const td = LD + pad * 2;
    const [c, ctx] = makeCanvas(S, S);
    const img = ctx.createImageData(S, S);
    for (let j = 0; j < S; j++)
      for (let i = 0; i < S; i++) {
        const x = ((i + 0.5) / S - 0.5) * tw;
        const z = ((j + 0.5) / S - 0.5) * td;
        const dist = Math.hypot(Math.max(Math.abs(x) - LW / 2, 0), Math.max(Math.abs(z) - LD / 2, 0));
        img.data[(j * S + i) * 4 + 3] = Math.round(Math.pow(Math.max(0, 1 - dist / pad), 2.2) * 255);
      }
    ctx.putImageData(img, 0, 0);
    return { tex: texture(c, false), w: tw, d: td };
  })();
  return {
    rbox,
    plane,
    frontFor,
    lightTex,
    sheen,
    nfc,
    contact,
    clay: new MeshStandardMaterial({ color: 0xeceef1, roughness: 0.78 }),
    groove: new MeshStandardMaterial({ color: 0xa9b1bb, roughness: 0.95 }),
    plinth: new MeshStandardMaterial({ color: 0xaab2bc, roughness: 0.9 }),
    detail: new MeshStandardMaterial({ color: 0xc3cad2, roughness: 0.85 }),
    strip: new MeshStandardMaterial({ color: 0xd3d9df, roughness: 0.6 }),
    active: new MeshStandardMaterial({ color: BLUE, emissive: BLUE, emissiveIntensity: 1.5, roughness: 0.4, toneMapped: false }),
    glass: new MeshPhysicalMaterial({ color: 0x0b0e13, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 }),
    reader: new MeshPhysicalMaterial({ color: 0x1b222c, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.15 }),
    lens: new MeshPhysicalMaterial({ color: 0x14243a, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.02 }),
    ringGlow: new MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.85, toneMapped: false }),
    metal: new MeshStandardMaterial({ color: 0xd5d9de, metalness: 1, roughness: 0.3 }),
    tray: new MeshStandardMaterial({ color: 0xe3e7ec, roughness: 0.8 }),
    phone: new MeshPhysicalMaterial({ color: 0x1b1f26, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08 }),
    laptop: new MeshStandardMaterial({ color: 0xcfd4da, metalness: 0.7, roughness: 0.35 }),
    logo: new MeshStandardMaterial({ map: texture(logoCanvas('#b8c0ca', 512)), transparent: true, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -2 }),
  };
}

/** Otto's screen, text-free: logo, title bars, the drawer map (one drawer highlighted), a progress bar. */
function lockerScreen(highlight: number | null, yellow: boolean) {
  const [c, ctx] = makeCanvas(1024, 640);
  const w = 1024;
  const h = 640;
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#1C3658');
  bg.addColorStop(1, '#0A1422');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  const glow = ctx.createRadialGradient(w * 0.85, h * 0.1, 0, w * 0.85, h * 0.1, w * 0.7);
  glow.addColorStop(0, `rgba(0, 121, 255, ${highlight ? 0.45 : 0.22})`);
  glow.addColorStop(1, 'rgba(46, 142, 255, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(logoCanvas('#ffffff', 240), 56, 44, 108, 108 * (LOGO_H / LOGO_W));
  const rr = (x: number, y: number, ww: number, hh: number, r: number, fill: string) => {
    ctx.beginPath();
    ctx.roundRect(x, y, ww, hh, r);
    ctx.fillStyle = fill;
    ctx.fill();
  };
  rr(w - 56 - 84, 50, 84, 20, 10, 'rgba(255,255,255,0.22)');
  rr(56, 228, 360, 52, 26, 'rgba(255,255,255,0.92)');
  rr(56, 300, 280, 20, 10, 'rgba(255,255,255,0.4)');
  rr(56, 384, 420, 12, 6, 'rgba(255,255,255,0.14)');
  if (highlight) rr(56, 384, 420 * 0.7, 12, 6, yellow ? '#FFD369' : '#2E8EFF');
  else rr(56, 372 + 40, 248, 64, 32, '#0079FF');
  const cols = 3;
  const tw = 92;
  const th = 50;
  const gx = 12;
  const ox = w - 56 - cols * tw - (cols - 1) * gx;
  for (let r = 0; r < 4; r++)
    for (let cc = 0; cc < cols; cc++) rr(ox + cc * (tw + gx), 196 + r * (th + gx), tw, th, 8, highlight !== null && r * cols + cc === (highlight - 1) % 12 ? (yellow ? '#FFD369' : '#0079FF') : 'rgba(255,255,255,0.09)');
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fillRect(56, h - 92, w - 112, 2);
  rr(56, h - 62, 160, 16, 8, 'rgba(255,255,255,0.18)');
  return texture(c);
}

export type LockerOptions = {
  modules: ModuleKey[];
  /** Highlight this drawer number on the screen (1-based), yellow when `yellow`. */
  screenDrawer?: number | null;
  yellow?: boolean;
  /** Draw the contact shadow under each module (off when the scene has its own floor accents close by). */
  contact?: boolean;
};

export function buildLocker(o: LockerOptions) {
  shared ??= makeShared();
  const S = shared;
  const root = new Group();
  const drawers: LockerDrawer[] = [];
  const mesh = (g: BufferGeometry, m: Material, shadows = true) => {
    const x = new Mesh(g, m);
    x.castShadow = shadows;
    x.receiveShadow = shadows;
    return x;
  };

  const cabinet = (x: number) => {
    const m = new Group();
    m.position.x = x;
    root.add(m);
    const body = mesh(S.rbox(LW, BODY, LD, 0.022, 6), S.clay);
    body.position.y = PL + BODY / 2;
    m.add(body);
    const plinth = mesh(S.rbox(LW - 0.05, PL + 0.01, LD - 0.09, 0.008, 2), S.plinth);
    plinth.position.set(0, (PL + 0.01) / 2, -0.02);
    m.add(plinth);
    if (o.contact !== false) {
      const sh = new Mesh(new PlaneGeometry(S.contact.w, S.contact.d), new MeshBasicMaterial({ color: 0x0d1015, alphaMap: S.contact.tex, transparent: true, opacity: 0.42, depthWrite: false }));
      sh.rotation.x = -Math.PI / 2;
      sh.position.y = 0.0008;
      sh.renderOrder = -1;
      m.add(sh);
    }
    return m;
  };
  const opening = (m: Group, x0: number, y0: number, w: number, h: number) => {
    const p = new Mesh(S.plane(w, h), S.groove);
    p.position.set(x0 + w / 2, y0 + h / 2, FZ + 0.0004);
    m.add(p);
  };
  const drawer = (m: Group, cx: number, cy: number, w: number, h: number, wide: boolean) => {
    const g = new Group();
    g.position.set(cx, cy, 0);
    m.add(g);
    const f = mesh(S.rbox(w, h, FRONT_T, 0.006, 3), S.frontFor(w, h));
    f.position.z = FRONT_Z;
    g.add(f);
    const sw = wide ? 0.07 : 0.036;
    const strip = mesh(S.rbox(sw, 0.003, 0.002, 0.0012, 1), S.strip, false);
    strip.position.set(w / 2 - 0.016 - sw / 2, -h / 2 + 0.013, FACE - 0.0006);
    g.add(strip);
    const light = new Mesh(S.plane(w + DG * 2, h + DG * 2), new MeshBasicMaterial({ color: BLUE, alphaMap: S.lightTex, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
    light.position.set(cx, cy, FZ + 0.0006);
    light.visible = false;
    m.add(light);
    drawers.push({ g, w, h, wide, strip, light, max: wide ? 0.22 : 0.2 });
  };
  const field = (m: Group, rows: number[], yTop: number, yBottom: number) => {
    const fw = LW - FM * 2;
    const fh = yTop - yBottom;
    const x0 = -fw / 2;
    opening(m, x0, yBottom, fw, fh);
    const h = (fh - DG * (rows.length + 1)) / rows.length;
    rows.forEach((cols, r) => {
      const w = (fw - DG * (cols + 1)) / cols;
      for (let c = 0; c < cols; c++) drawer(m, x0 + DG + w / 2 + c * (w + DG), yTop - DG - h / 2 - r * (h + DG), w, h, cols === 1);
    });
  };
  const otto = (x: number) => {
    const m = cabinet(x);
    const sy = LTOP - 0.06 - 0.125;
    const bezel = mesh(S.rbox(0.36, 0.25, 0.014, 0.012, 4), S.glass);
    bezel.position.set(0, sy, FZ + 0.001);
    m.add(bezel);
    const screen = new Mesh(
      new PlaneGeometry(0.33, 0.206),
      new MeshPhysicalMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: lockerScreen(o.screenDrawer ?? null, !!o.yellow), emissiveIntensity: 0.95, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03 })
    );
    screen.position.set(0, sy + 0.004, FZ + 0.0082);
    m.add(screen);
    const sh = new Mesh(new PlaneGeometry(0.36, 0.25), new MeshBasicMaterial({ map: S.sheen, transparent: true, depthWrite: false, toneMapped: false, opacity: 0.9 }));
    sh.position.set(0, sy, FZ + 0.0085);
    m.add(sh);
    const readerGeo = new CylinderGeometry(0.026, 0.026, 0.006, 48);
    for (const side of [-1, 1]) {
      const r = mesh(readerGeo, S.reader, false);
      r.rotation.x = Math.PI / 2;
      r.position.set(side * 0.24, sy, FZ + 0.002);
      m.add(r);
    }
    const ring = new Mesh(new RingGeometry(0.0215, 0.0235, 48), S.ringGlow);
    ring.position.set(-0.24, sy, FZ + 0.0052);
    m.add(ring);
    const nfc = new Mesh(new CircleGeometry(0.017, 32), new MeshBasicMaterial({ map: S.nfc, transparent: true, depthWrite: false }));
    nfc.position.set(-0.24, sy, FZ + 0.0053);
    m.add(nfc);
    const lens = mesh(new CylinderGeometry(0.0085, 0.0085, 0.003, 32), S.lens, false);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0.24, sy, FZ + 0.0058);
    m.add(lens);
    const lensRing = mesh(new CylinderGeometry(0.0118, 0.0118, 0.002, 32), S.metal, false);
    lensRing.rotation.x = Math.PI / 2;
    lensRing.position.set(0.24, sy, FZ + 0.005);
    m.add(lensRing);
    const slot = mesh(S.rbox(0.15, 0.006, 0.004, 0.0025, 2), S.detail, false);
    slot.position.set(0, sy - 0.17, FZ - 0.0012);
    m.add(slot);
    const top = 0.47;
    const lw = 0.078;
    const lh = (lw * LOGO_H) / LOGO_W;
    const logo = new Mesh(new PlaneGeometry(lw, lh), S.logo);
    logo.position.set(-LW / 2 + FM + 0.034 + lw / 2, top + 0.042, FZ + 0.0003);
    m.add(logo);
    field(m, MASTER_ROWS, top, PL + FM);
    return m;
  };

  const step = LW + LGAP;
  o.modules.forEach((k, i) => {
    const x = (i - (o.modules.length - 1) / 2) * step;
    if (k === 'master') otto(x);
    else field(cabinet(x), ROWS[k], LTOP - FM, PL + FM);
  });

  /** Open a drawer by its index (0-based, in build order) by p (0-1), with its tray and device; lights it blue. */
  const setOpen = (i: number, p: number, device = true) => {
    const d = drawers[i];
    if (!d) return;
    if (!d.tray) {
      const t = new Group();
      const depth = 0.42;
      const iw = d.w - 0.014;
      const ih = d.h - 0.024;
      const sideH = ih * 0.55;
      const zb = FRONT_Z - FRONT_T / 2;
      const bottom = mesh(new BoxGeometry(iw, 0.002, depth), S.tray);
      bottom.position.set(0, -ih / 2, zb - depth / 2);
      const left = mesh(new BoxGeometry(0.002, sideH, depth), S.tray);
      left.position.set(-iw / 2, -ih / 2 + sideH / 2, zb - depth / 2);
      const right = left.clone();
      right.position.x = iw / 2;
      t.add(bottom, left, right);
      if (device) {
        const len = d.wide ? 0.215 : 0.156;
        const thick = d.wide ? 0.016 : 0.008;
        const dev = mesh(d.wide ? S.rbox(0.31, 0.016, 0.215, 0.006, 3) : S.rbox(0.074, 0.008, 0.156, 0.004, 3), d.wide ? S.laptop : S.phone);
        dev.position.set(0, -ih / 2 + 0.001 + thick / 2, zb - 0.014 - len / 2);
        t.add(dev);
      }
      d.g.add(t);
      d.tray = t;
    }
    d.g.position.z = p * d.max;
    d.light.visible = p > 0.001;
    (d.light.material as MeshBasicMaterial).opacity = Math.min(1, p * 3) * 0.9;
    d.strip.material = p > 0.05 ? S.active : S.strip;
  };

  const width = o.modules.length * LW + (o.modules.length - 1) * LGAP;
  return { root, drawers, setOpen, width, height: LTOP };
}

/** Index of Otto's laptop drawer (the wide one under the 9 phone drawers) when Otto is the first module. */
export const OTTO_LAPTOP = 9;
