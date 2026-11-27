/**
 * Spind locker in real 3D (three.js). Used by Locker3D.astro: home hero, template page heroes, How it works.
 * Look: modern clay render. One matte light material, soft light and soft shadows, gaps are soft grooves (no dark
 * outlines), and a few techno accents that light up blue: drawer light strips, the reader ring, the screen.
 * Modules stand left to right as listed in data-modules: Otto (master: touch screen, readers, a small grey logo,
 * then 9 smartphone drawers and 1 laptop drawer), Lotte (s24: 24 small drawers), Bruno (n8: 8 wide
 * drawers), Greta (m124: 12 small, then 4 wide). compact is an alias for master.
 *
 * - Mouse over the stage: the locker turns a little toward the pointer and springs back when it leaves.
 * - A drawer opens only while the mouse is over it (tap on touch screens): it pops out, its compartment lights blue,
 *   its light strip turns blue and the screen names it. Nothing opens on its own.
 * - Story mode (data-story-screen): the How it works tabs set data-state 0-3 and the screen follows the step;
 *   in the Open step the target drawer's light strip turns blue.
 * - Touch screens: a slow sway instead of the tilt. Reduced motion: no turning, drawers snap open.
 * - Renders only while something moves and pauses off screen. If WebGL is missing, the SVG drawing stays.
 * Hover motion here is a deliberate exception to the site's fill-only hover rule (asked for on 2026-11-25).
 */
import {
  BoxGeometry,
  CanvasTexture,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
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
  Raycaster,
  RingGeometry,
  Scene,
  ShadowMaterial,
  SpotLight,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { LOGO_PATHS, LOGO_W, LOGO_H } from '../components/logo-path';

/* ---------- Dimensions in metres (a module is 600 wide, 910 tall, 500 deep) ---------- */
const W = 0.6; // module width
const GAP = 0.06; // space between modules
const D = 0.5; // depth
const PL = 0.05; // plinth height
const BODY = 0.86; // cabinet above the plinth
const TOP = PL + BODY;
const FM = 0.022; // frame around the drawer field
const DG = 0.0025; // gap between drawers
const FZ = D / 2; // front face of the cabinet
const FRONT_T = 0.02; // drawer front thickness
const FRONT_Z = FZ - 0.006; // drawer fronts stand 4 mm proud of the frame
const FACE = FRONT_Z + FRONT_T / 2; // drawer front face

/* Framing: the back top edge sits this far from the top of the stage, the front floor line this far down.
   Only the vertical is fixed, so a page can line things up with the locker at any width (see Locker3D.astro). */
const FRAME = { top: 0.045, floor: 0.93 };
const CAM_DIST = 3.8;
const CAM_ELEV = MathUtils.degToRad(9);

/* Tilt */
const MAX_Y = 0.17; // ~10 degrees left and right
const MAX_X = 0.05; // ~3 degrees up and down

/* Colours (sRGB hex) */
const CLAY = 0xeceef1; // body
const CLAY_FRONT = 0xf1f3f5; // drawer fronts, a touch lighter
const GROOVE = 0xa9b1bb; // gaps between fronts
const BLUE = 0x2e8eff;

type Screen = { idleTitle: string; idleText: string; start: string; openTitle: string; openText: string; footer: string };
type Story = { request: string; code: string; open: string; logged: string };
type Drawer = {
  n: number;
  g: Group;
  w: number;
  h: number;
  kind: 'small' | 'wide';
  strip: Mesh;
  light: Mesh;
  max: number;
  /** 0 closed, 1 open (springs past 1 a little) */
  p: number;
  v: number;
  target: number;
  tray?: Group;
};

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
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/** Soft contact shadow under a module: opaque at the footprint, fading out over `pad` metres. */
function contactShadow(w: number, d: number, pad: number) {
  const S = 256;
  const [c, ctx] = makeCanvas(S, S);
  const img = ctx.createImageData(S, S);
  const tw = w + pad * 2;
  const td = d + pad * 2;
  for (let j = 0; j < S; j++) {
    for (let i = 0; i < S; i++) {
      const x = ((i + 0.5) / S - 0.5) * tw;
      const z = ((j + 0.5) / S - 0.5) * td;
      const dist = Math.hypot(Math.max(Math.abs(x) - w / 2, 0), Math.max(Math.abs(z) - d / 2, 0));
      const a = Math.pow(Math.max(0, 1 - dist / pad), 2.2);
      img.data[(j * S + i) * 4 + 3] = Math.round(a * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  return { tex: texture(c, false), w: tw, d: td };
}

/** The Spind logo in one flat colour on transparent. */
function logoCanvas(color: string, w: number) {
  const h = Math.round((w * LOGO_H) / LOGO_W);
  const [c, ctx] = makeCanvas(w, h);
  ctx.scale(w / LOGO_W, h / LOGO_H);
  ctx.fillStyle = color;
  for (const p of LOGO_PATHS) ctx.fill(new Path2D(p.d), p.evenodd ? 'evenodd' : 'nonzero');
  return c;
}

/**
 * Soft occlusion on a drawer front (clay look): darker in the last 12 mm toward each gap, most along the bottom,
 * so a gap reads as a soft groove instead of a drawn line.
 */
function frontShade(w: number, h: number) {
  const cw = 256;
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
  edge(0, 0, 0, ey, 0.06); // top of the face
  edge(0, ch, 0, ch - ey, 0.12); // bottom of the face
  return texture(c);
}

/** Diagonal soft reflection for the screen glass (white on transparent). */
function sheenTexture() {
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
}

/** Contactless reader symbol (three arcs). */
function nfcTexture() {
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
}

export function initHeroLocker(stage: HTMLElement) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const copy: Screen = JSON.parse(stage.dataset.screen || '{}');
  const story: Story | null = stage.dataset.storyScreen ? JSON.parse(stage.dataset.storyScreen) : null;
  const storyDrawer = Number(stage.dataset.storyDrawer || 0);
  let storyStep = story ? Number(stage.dataset.state || 0) : -1;

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
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const canvas = renderer.domElement;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', stage.dataset.label || '');
  stage.appendChild(canvas);

  /* ---------- Scene, light: a big soft studio light, like a clay render ---------- */
  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.62;
  pmrem.dispose();

  const key = new SpotLight(0xffffff, 1.55, 0, 0.5, 1, 0);
  key.position.set(-0.85, 4.5, 3.4); // high, so floor shadows stay short and inside the stage
  key.target.position.set(0.1, 0.72, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 2;
  key.shadow.camera.far = 9;
  key.shadow.radius = 9;
  key.shadow.bias = -0.0003;
  key.shadow.normalBias = 0.01;
  scene.add(key, key.target);
  const fill = new DirectionalLight(0xe4ecff, 0.3);
  fill.position.set(3, 1.6, 2);
  scene.add(fill);

  const floor = new Mesh(new PlaneGeometry(8, 8), new ShadowMaterial({ color: 0x0d1015, opacity: 0.08 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  // On a dark page a shadow can't show, so the floor gets a faint pool of light instead (like a spot on a dark stage).
  if (stage.dataset.surface === 'dark') {
    const [c, ctx] = makeCanvas(256, 256);
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.4)');
    g.addColorStop(0.92, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const pool = new Mesh(
      new PlaneGeometry(1.45, 0.8),
      new MeshBasicMaterial({ color: 0xc9dcff, alphaMap: texture(c, false), transparent: true, opacity: 0.14, depthWrite: false, toneMapped: false })
    );
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(0, 0.0004, 0.06);
    pool.renderOrder = -2;
    scene.add(pool);
  }

  /* ---------- Materials ---------- */
  const clay = new MeshStandardMaterial({ color: CLAY, roughness: 0.78 });
  const clayFront = new MeshStandardMaterial({ color: CLAY_FRONT, roughness: 0.74 });
  const groove = new MeshStandardMaterial({ color: GROOVE, roughness: 0.95 });
  const plinthMat = new MeshStandardMaterial({ color: 0xaab2bc, roughness: 0.9 });
  const detail = new MeshStandardMaterial({ color: 0xc3cad2, roughness: 0.85 }); // vents, slot: shallow grooves
  const stripMat = new MeshStandardMaterial({ color: 0xd3d9df, roughness: 0.6 }); // drawer light strip, off
  const activeMat = new MeshStandardMaterial({ color: BLUE, emissive: BLUE, emissiveIntensity: 1.5, roughness: 0.4, toneMapped: false });
  const glass = new MeshPhysicalMaterial({ color: 0x0b0e13, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 });
  const readerMat = new MeshPhysicalMaterial({ color: 0x1b222c, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.15 });
  const lensMat = new MeshPhysicalMaterial({ color: 0x14243a, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.02 });
  const ringGlow = new MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.85, toneMapped: false });
  const metal = new MeshStandardMaterial({ color: 0xd5d9de, metalness: 1, roughness: 0.3 });
  const trayMat = new MeshStandardMaterial({ color: 0xe3e7ec, roughness: 0.8 });
  const phoneMat = new MeshPhysicalMaterial({ color: 0x1b1f26, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08 });
  const laptopMat = new MeshStandardMaterial({ color: 0xcfd4da, metalness: 0.7, roughness: 0.35 });

  /* ---------- Geometry cache ---------- */
  const geoCache = new Map<string, BufferGeometry>();
  const rbox = (w: number, h: number, d: number, r: number, seg = 3) => {
    const k = [w, h, d, r, seg].map((v) => v.toFixed(4)).join();
    let g = geoCache.get(k);
    if (!g) geoCache.set(k, (g = new RoundedBoxGeometry(w, h, d, seg, r)));
    return g;
  };
  const plane = (w: number, h: number) => {
    const k = `p${w.toFixed(4)}x${h.toFixed(4)}`;
    let g = geoCache.get(k);
    if (!g) geoCache.set(k, (g = new PlaneGeometry(w, h)));
    return g;
  };
  const mesh = (g: BufferGeometry, m: Material, shadows = true) => {
    const o = new Mesh(g, m);
    o.castShadow = shadows;
    o.receiveShadow = shadows;
    return o;
  };

  /* ---------- Rig: everything that turns ---------- */
  const rig = new Group();
  scene.add(rig);
  const ao = contactShadow(W, D, 0.16);
  const aoMat = new MeshBasicMaterial({ color: 0x0d1015, alphaMap: ao.tex, transparent: true, opacity: 0.42, depthWrite: false });
  const aoGeo = new PlaneGeometry(ao.w, ao.d);

  function cabinet(x: number) {
    const m = new Group();
    m.position.x = x;
    rig.add(m);
    const body = mesh(rbox(W, BODY, D, 0.022, 6), clay);
    body.position.y = PL + BODY / 2;
    m.add(body);
    // Recessed plinth: the cabinet seems to float a little above the floor.
    const plinth = mesh(rbox(W - 0.05, PL + 0.01, D - 0.09, 0.008, 2), plinthMat);
    plinth.position.set(0, (PL + 0.01) / 2, -0.02);
    m.add(plinth);
    const shadow = new Mesh(aoGeo, aoMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.0008;
    shadow.renderOrder = -1;
    m.add(shadow);
    return m;
  }

  /** Opening behind the fronts: a soft grey groove in the gaps, the compartment when a drawer is out. */
  function opening(m: Group, x0: number, y0: number, w: number, h: number) {
    const p = new Mesh(plane(w, h), groove);
    p.position.set(x0 + w / 2, y0 + h / 2, FZ + 0.0004);
    m.add(p);
  }

  /* ---------- Drawers ---------- */
  const drawers: Drawer[] = [];
  const fronts: Mesh[] = [];
  // Compartment light: brightest at the top (the LED strip), fading down.
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
  const frontMats = new Map<string, MeshStandardMaterial>();
  const frontFor = (w: number, h: number) => {
    const k = `${w.toFixed(4)}x${h.toFixed(4)}`;
    let m = frontMats.get(k);
    if (!m) {
      m = clayFront.clone();
      m.map = frontShade(w, h);
      frontMats.set(k, m);
    }
    return m;
  };

  function drawer(m: Group, cx: number, cy: number, w: number, h: number, kind: Drawer['kind'], n: number) {
    const g = new Group();
    g.position.set(cx, cy, 0);
    m.add(g);
    const f = mesh(rbox(w, h, FRONT_T, 0.006, 3), frontFor(w, h));
    f.position.z = FRONT_Z;
    g.add(f);
    // Light strip, bottom right where the pull was: a fine grey line that glows blue while the drawer is open.
    const sw = kind === 'wide' ? 0.07 : 0.036;
    const strip = mesh(rbox(sw, 0.003, 0.002, 0.0012, 1), stripMat, false);
    strip.position.set(w / 2 - 0.016 - sw / 2, -h / 2 + 0.013, FACE - 0.0006);
    g.add(strip);
    // Compartment light: sits in the opening behind the front and shows once the drawer is out. It is a gap wider
    // than the front, so in the How it works Open step the gaps around the waiting drawer glow blue.
    const light = new Mesh(plane(w + DG * 2, h + DG * 2), new MeshBasicMaterial({ color: BLUE, alphaMap: lightTex, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
    light.position.set(cx, cy, FZ + 0.0006);
    light.visible = false;
    m.add(light);
    const d: Drawer = { n, g, w, h, kind, strip, light, max: kind === 'wide' ? 0.22 : 0.2, p: 0, v: 0, target: 0 };
    // Pick targets: the front, and the opening behind it (so the drawer stays open while the mouse is over its compartment).
    f.userData.drawer = d;
    light.userData.drawer = d;
    fronts.push(f, light);
    drawers.push(d);
  }

  /** A field of drawers between yTop and yBottom. rows: drawers per row, top to bottom. Returns the next number. */
  function drawerField(m: Group, rows: number[], yTop: number, yBottom: number, first: number) {
    const fw = W - FM * 2;
    const fh = yTop - yBottom;
    const x0 = -fw / 2;
    opening(m, x0, yBottom, fw, fh);
    const h = (fh - DG * (rows.length + 1)) / rows.length;
    let n = first;
    rows.forEach((cols, r) => {
      const w = (fw - DG * (cols + 1)) / cols;
      for (let c = 0; c < cols; c++) {
        const cx = x0 + DG + w / 2 + c * (w + DG);
        const cy = yTop - DG - h / 2 - r * (h + DG);
        drawer(m, cx, cy, w, h, cols === 1 ? 'wide' : 'small', n++);
      }
    });
    return n;
  }
  function drawerModule(x: number, rows: number[], first: number) {
    return drawerField(cabinet(x), rows, TOP - FM, PL + FM, first);
  }

  /* ---------- Otto's screen ---------- */
  const [scrCanvas, scr] = makeCanvas(1024, 640);
  const scrTex = texture(scrCanvas);
  const css = getComputedStyle(document.documentElement);
  const fontDisplay = css.getPropertyValue('--font-display').trim() || 'sans-serif';
  const fontBody = css.getPropertyValue('--font-body').trim() || 'sans-serif';
  const logoWhite = logoCanvas('#ffffff', 240);
  const pad2 = (n: number) => String(n).padStart(2, '0');

  // Fixed QR-like pattern (decorative): three finder squares and seeded modules.
  const qr = (() => {
    const N = 21;
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const bits: boolean[] = [];
    for (let i = 0; i < N * N; i++) bits.push(rnd() > 0.52);
    return { N, bits };
  })();

  /** Highlight colour (CTA yellow) for the How it works screens. */
  const HL = '#FFD369';
  function screenBase(glowStrength: number) {
    const ctx = scr;
    const { width: w, height: h } = scrCanvas;
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#1C3658');
    bg.addColorStop(1, '#0A1422');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    const glow = ctx.createRadialGradient(w * 0.85, h * 0.1, 0, w * 0.85, h * 0.1, w * 0.7);
    glow.addColorStop(0, `rgba(0, 121, 255, ${glowStrength})`);
    glow.addColorStop(1, 'rgba(46, 142, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(logoWhite, 56, 44, 108, 108 * (LOGO_H / LOGO_W));
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(56, h - 92, w - 112, 2);
    if (story) {
      // How it works: no text on the screen, only shapes (the step titles sit in the tabs above).
      roundRect(ctx, w - 56 - 84, 50, 84, 20, 10);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.fill();
      roundRect(ctx, 56, h - 62, 160, 16, 8);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.fill();
      return;
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = `700 30px ${fontDisplay}`;
    ctx.textAlign = 'right';
    ctx.fillText('08:42', w - 56, 78);
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = `400 26px ${fontBody}`;
    ctx.fillText(copy.footer || '', 56, h - 46);
  }
  function title(text: string, sub?: string) {
    scr.fillStyle = '#ffffff';
    scr.font = `700 64px ${fontDisplay}`;
    scr.fillText(text, 56, 270);
    if (sub) {
      scr.fillStyle = 'rgba(255, 255, 255, 0.66)';
      scr.font = `400 32px ${fontBody}`;
      scr.fillText(sub, 56, 322);
    }
  }
  function miniMap(active: number | null, on = '#0079FF') {
    const cols = 3;
    const tw = 92;
    const th = 50;
    const gx = 12;
    const ox = scrCanvas.width - 56 - cols * tw - (cols - 1) * gx;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < cols; c++) {
        roundRect(scr, ox + c * (tw + gx), 196 + r * (th + gx), tw, th, 8);
        scr.fillStyle = active !== null && r * cols + c === (active - 1) % 12 ? on : 'rgba(255, 255, 255, 0.09)';
        scr.fill();
      }
    }
  }
  function progress(frac: number, on = '#2E8EFF') {
    roundRect(scr, 56, 384, 420, 12, 6);
    scr.fillStyle = 'rgba(255, 255, 255, 0.14)';
    scr.fill();
    roundRect(scr, 56, 384, 420 * frac, 12, 6);
    scr.fillStyle = on;
    scr.fill();
  }

  /** Idle or "drawer n is open" (home and template heroes). */
  function drawScreen(open: number | null) {
    screenBase(open ? 0.45 : 0.22);
    if (open) {
      title(copy.openTitle.replace('{n}', pad2(open)), copy.openText);
      progress(0.7);
    } else {
      title(copy.idleTitle, copy.idleText);
      roundRect(scr, 56, 372, 248, 80, 40);
      scr.fillStyle = '#0079FF';
      scr.fill();
      scr.fillStyle = '#ffffff';
      scr.font = `700 32px ${fontDisplay}`;
      scr.fillText(`${copy.start}  →`, 96, 423);
    }
    miniMap(open);
    scrTex.needsUpdate = true;
  }

  /* ---------- How it works screens: text-free, built from the items the employee deals with ----------
     Line icons on a 24-unit grid (same style as the site icons), drawn with Path2D. */
  const ICON: Record<string, Path2D> = {
    laptop: new Path2D('M5 6h14v9H5zM3 18h18'),
    phone: new Path2D('M8 3h8v18H8zM11 18h2'),
    headset: new Path2D('M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H4zM17 14h3v5h-3z'),
    mouse: new Path2D('M12 3a5 5 0 0 1 5 5v8a5 5 0 0 1-10 0V8a5 5 0 0 1 5-5zM12 7v3'),
    badge: new Path2D('M3 6h18v12H3zM8.5 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5.5 16.2c.5-1.4 1.6-2 3-2s2.5.6 3 2M14 10h4.5M14 13h3.5'),
    waves: new Path2D('M15.5 8a5.5 5.5 0 0 1 0 8M18.5 5.5a9.5 9.5 0 0 1 0 13'),
    check: new Path2D('M6 12.5l4 4 8-9'),
    arrow: new Path2D('M5 12h14M13 6l6 6-6 6'),
    drawer: new Path2D('M3 6h18v12H3zM9 15h6'),
  };
  function icon(name: string, x: number, y: number, size: number, color: string, lw = 1.6) {
    scr.save();
    scr.translate(x, y);
    scr.scale(size / 24, size / 24);
    scr.strokeStyle = color;
    scr.lineWidth = lw;
    scr.lineCap = 'round';
    scr.lineJoin = 'round';
    scr.stroke(ICON[name]);
    scr.restore();
  }
  function bar(x: number, y: number, w: number, h: number, a: number) {
    roundRect(scr, x, y, w, h, h / 2);
    scr.fillStyle = `rgba(255, 255, 255, ${a})`;
    scr.fill();
  }
  /** Device tile: rounded card with a line icon; the chosen one is yellow. */
  function tile(x: number, y: number, w: number, h: number, name: string, on: boolean) {
    roundRect(scr, x, y, w, h, 18);
    scr.fillStyle = on ? HL : 'rgba(255, 255, 255, 0.08)';
    scr.fill();
    if (!on) { scr.strokeStyle = 'rgba(255, 255, 255, 0.12)'; scr.lineWidth = 2; scr.stroke(); }
    const s = Math.min(w, h) * 0.46;
    icon(name, x + (w - s) / 2, y + (h - s) / 2 - h * 0.08, s, on ? '#16191E' : 'rgba(255, 255, 255, 0.85)', 1.5);
    bar(x + w * 0.28, y + h * 0.78, w * 0.44, 10, on ? 0 : 0.25);
    if (on) { roundRect(scr, x + w * 0.28, y + h * 0.78, w * 0.44, 10, 5); scr.fillStyle = 'rgba(22, 25, 30, 0.35)'; scr.fill(); }
  }
  /** Header of every step: a title bar and a subtitle bar. */
  function head(w1: number, w2: number) {
    bar(56, 132, w1, 34, 0.92);
    bar(56, 182, w2, 14, 0.4);
  }

  /** How it works steps: request (pick the device), identify (badge, QR or PIN), open (the drawer), tracked (the log). */
  function drawStory(step: number) {
    if (!story) return;
    screenBase(step === 2 ? 0.45 : 0.22);
    const W = scrCanvas.width;
    if (step === 0) {
      // Request: the devices to choose from, the faulty one's replacement picked, a yellow go button.
      head(300, 200);
      const names = ['laptop', 'phone', 'headset', 'mouse'];
      const tw = (W - 112 - 3 * 20) / 4;
      names.forEach((n, k) => tile(56 + k * (tw + 20), 228, tw, 196, n, k === 1));
      roundRect(scr, W - 56 - 180, 450, 180, 64, 32);
      scr.fillStyle = HL;
      scr.fill();
      icon('arrow', W - 56 - 180 + 66, 458, 48, '#16191E', 2);
    } else if (step === 1) {
      // Identify: the RFID badge being tapped, or the QR code, or the PIN.
      head(260, 180);
      roundRect(scr, 56, 228, 330, 286, 22);
      scr.fillStyle = 'rgba(255, 255, 255, 0.08)';
      scr.fill();
      icon('badge', 92, 262, 190, HL, 1.2);
      icon('waves', 250, 262, 120, 'rgba(255, 255, 255, 0.7)', 1.4);
      const s = 9;
      const ox = 430;
      const oy = 240;
      roundRect(scr, ox - 14, oy - 14, qr.N * s + 28, qr.N * s + 28, 14);
      scr.fillStyle = '#ffffff';
      scr.fill();
      scr.fillStyle = '#0E1B2C';
      const finder = (fx: number, fy: number) => {
        scr.fillRect(ox + fx * s, oy + fy * s, 7 * s, 7 * s);
        scr.fillStyle = '#ffffff';
        scr.fillRect(ox + (fx + 1) * s, oy + (fy + 1) * s, 5 * s, 5 * s);
        scr.fillStyle = '#0E1B2C';
        scr.fillRect(ox + (fx + 2) * s, oy + (fy + 2) * s, 3 * s, 3 * s);
      };
      for (let y = 0; y < qr.N; y++) {
        for (let x = 0; x < qr.N; x++) {
          const inFinder = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
          if (!inFinder && qr.bits[y * qr.N + x]) scr.fillRect(ox + x * s, oy + y * s, s, s);
        }
      }
      finder(0, 0);
      finder(14, 0);
      finder(0, 14);
      for (let k = 0; k < 4; k++) {
        roundRect(scr, 700 + k * 70, 270, 52, 64, 12);
        scr.fillStyle = k < 2 ? HL : 'rgba(255, 255, 255, 0.12)';
        scr.fill();
      }
      for (let k = 0; k < 9; k++) {
        roundRect(scr, 700 + (k % 3) * 94, 360 + Math.floor(k / 3) * 54, 82, 42, 10);
        scr.fillStyle = 'rgba(255, 255, 255, 0.08)';
        scr.fill();
      }
    } else if (step === 2) {
      // Open: the picked device goes to its drawer, which glows yellow on the locker map.
      head(340, 240);
      tile(56, 228, 250, 250, 'phone', true);
      icon('arrow', 330, 318, 72, 'rgba(255, 255, 255, 0.6)', 1.6);
      const cols = 4;
      const cw = 104;
      const ch = 52;
      const gx = 12;
      const ox = W - 56 - cols * cw - (cols - 1) * gx;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < cols; c++) {
          const on = r === 1 && c === 2;
          roundRect(scr, ox + c * (cw + gx), 228 + r * (ch + gx), cw, ch, 10);
          scr.fillStyle = on ? HL : 'rgba(255, 255, 255, 0.08)';
          scr.fill();
          if (on) icon('drawer', ox + c * (cw + gx) + cw / 2 - 16, 228 + r * (ch + gx) + ch / 2 - 16, 32, '#16191E', 1.8);
        }
      }
      roundRect(scr, ox, 492, cols * cw + (cols - 1) * gx, 12, 6);
      scr.fillStyle = 'rgba(255, 255, 255, 0.14)';
      scr.fill();
      roundRect(scr, ox, 492, (cols * cw + (cols - 1) * gx) * 0.7, 12, 6);
      scr.fillStyle = HL;
      scr.fill();
    } else {
      // Tracked: done, and the handover lands in the log (device, person, time).
      scr.fillStyle = '#2F9E6B';
      scr.beginPath();
      scr.arc(100, 160, 44, 0, Math.PI * 2);
      scr.fill();
      icon('check', 70, 130, 60, '#ffffff', 2.4);
      bar(170, 136, 280, 30, 0.92);
      bar(170, 180, 190, 14, 0.4);
      const rows: [string, boolean][] = [['phone', true], ['laptop', false], ['headset', false]];
      rows.forEach(([n, first], k) => {
        const y = 240 + k * 92;
        roundRect(scr, 56, y, W - 112, 76, 16);
        scr.fillStyle = first ? 'rgba(255, 211, 105, 0.14)' : 'rgba(255, 255, 255, 0.06)';
        scr.fill();
        roundRect(scr, 76, y + 14, 48, 48, 12);
        scr.fillStyle = first ? HL : 'rgba(255, 255, 255, 0.1)';
        scr.fill();
        icon(n, 84, y + 22, 32, first ? '#16191E' : 'rgba(255, 255, 255, 0.8)', 1.6);
        bar(146, y + 22, 220, 14, first ? 0.85 : 0.5);
        bar(146, y + 44, 140, 10, 0.25);
        bar(W - 56 - 20 - 110, y + 32, 110, 12, 0.3);
      });
    }
    scrTex.needsUpdate = true;
  }
  const refreshScreen = () => (story ? drawStory(storyStep) : drawScreen(hovered ? hovered.n : null));

  /* ---------- Otto: screen, readers, slot, service panel ---------- */
  /** Otto: screen, readers and slot on top. Below: the service panel, or (compact) a field of drawers. */
  function otto(x: number, below?: { rows: number[]; first: number }): number {
    const m = cabinet(x);
    // Touch screen behind one sheet of black glass.
    const sy = TOP - 0.06 - 0.125;
    const bezel = mesh(rbox(0.36, 0.25, 0.014, 0.012, 4), glass);
    bezel.position.set(0, sy, FZ + 0.001);
    m.add(bezel);
    const screen = new Mesh(
      new PlaneGeometry(0.33, 0.206),
      new MeshPhysicalMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: scrTex, emissiveIntensity: 0.95, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03 })
    );
    screen.position.set(0, sy + 0.004, FZ + 0.0082);
    m.add(screen);
    const sheen = new Mesh(
      new PlaneGeometry(0.36, 0.25),
      new MeshBasicMaterial({ map: sheenTexture(), transparent: true, depthWrite: false, toneMapped: false, opacity: 0.9 })
    );
    sheen.position.set(0, sy, FZ + 0.0085);
    m.add(sheen);

    // Badge reader (left, with a soft blue ring) and QR camera (right).
    const readerGeo = new CylinderGeometry(0.026, 0.026, 0.006, 64);
    for (const side of [-1, 1]) {
      const r = mesh(readerGeo, readerMat, false);
      r.rotation.x = Math.PI / 2;
      r.position.set(side * 0.24, sy, FZ + 0.002);
      m.add(r);
    }
    const ring = new Mesh(new RingGeometry(0.0215, 0.0235, 64), ringGlow);
    ring.position.set(-0.24, sy, FZ + 0.0052);
    m.add(ring);
    const nfc = new Mesh(new CircleGeometry(0.017, 48), new MeshBasicMaterial({ map: nfcTexture(), transparent: true, depthWrite: false }));
    nfc.position.set(-0.24, sy, FZ + 0.0053);
    m.add(nfc);
    const lens = mesh(new CylinderGeometry(0.0085, 0.0085, 0.003, 48), lensMat, false);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0.24, sy, FZ + 0.0058);
    m.add(lens);
    const lensRing = mesh(new CylinderGeometry(0.0118, 0.0118, 0.002, 48), metal, false);
    lensRing.rotation.x = Math.PI / 2;
    lensRing.position.set(0.24, sy, FZ + 0.005);
    m.add(lensRing);

    // Return slot under the screen: a shallow groove.
    const slot = mesh(rbox(0.15, 0.006, 0.004, 0.0025, 2), detail, false);
    slot.position.set(0, sy - 0.125 - 0.045, FZ - 0.0012);
    m.add(slot);

    const top = 0.47;
    const y0 = PL + FM;
    const lw = 0.078;
    const lh = (lw * LOGO_H) / LOGO_W;
    const logoMat = () =>
      new MeshStandardMaterial({ map: texture(logoCanvas('#b8c0ca', 1024)), transparent: true, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -2 });

    if (below) {
      // Compact: the small grey logo sits on the frame between the slot and the drawers, left aligned with them.
      const logo = new Mesh(new PlaneGeometry(lw, lh), logoMat());
      logo.position.set(-W / 2 + FM + 0.034 + lw / 2, top + 0.042, FZ + 0.0003);
      m.add(logo);
      return drawerField(m, below.rows, top, y0, below.first);
    }

    // Service panel: one big front with the logo, vents and a key lock.
    const fw = W - FM * 2;
    const fh = top - y0;
    opening(m, -fw / 2, y0, fw, fh);
    const pw = fw - DG * 2;
    const ph = fh - DG * 2;
    const panel = mesh(rbox(pw, ph, FRONT_T, 0.006, 3), frontFor(pw, ph));
    panel.position.set(0, y0 + fh / 2, FRONT_Z);
    m.add(panel);

    // Small light grey logo, printed, top left: there, but quiet.
    const logo = new Mesh(new PlaneGeometry(lw, lh), logoMat());
    logo.position.set(-pw / 2 + 0.034 + lw / 2, top - DG - 0.034 - lh / 2, FACE + 0.0002);
    m.add(logo);

    // Vents, bottom right: shallow grooves.
    const ventGeo = rbox(0.17, 0.0035, 0.003, 0.0015, 1);
    for (let k = 0; k < 7; k++) {
      const v = new Mesh(ventGeo, detail);
      v.position.set(pw / 2 - 0.034 - 0.085, y0 + 0.05 + k * 0.016, FACE - 0.0012);
      m.add(v);
    }
    // Key lock, top right.
    const lock = mesh(new CylinderGeometry(0.009, 0.009, 0.004, 40), metal, false);
    lock.rotation.x = Math.PI / 2;
    lock.position.set(pw / 2 - 0.034 - 0.009, top - DG - 0.045, FACE + 0.0012);
    m.add(lock);
    const keyway = new Mesh(rbox(0.002, 0.01, 0.002, 0.0008, 1), groove);
    keyway.position.set(lock.position.x, lock.position.y, FACE + 0.0028);
    m.add(keyway);
    return 0;
  }

  const ROWS: Record<string, number[]> = {
    s24: [3, 3, 3, 3, 3, 3, 3, 3],
    n8: [1, 1, 1, 1, 1, 1, 1, 1],
    m124: [3, 3, 3, 3, 1, 1, 1, 1],
  };
  // Otto (master): 9 smartphone drawers (3 x 3) and one laptop drawer below them, under the screen (per Pera, 27 Nov).
  // compact is kept as an alias for the same module.
  const MASTER_ROWS = [3, 3, 3, 1];
  const keys = (stage.dataset.modules || 'master,s24,n8').split(',').filter((k) => k === 'master' || k === 'compact' || ROWS[k]);
  const step = W + GAP;
  let nextDrawer = 1;
  keys.forEach((k, i) => {
    const x = (i - (keys.length - 1) / 2) * step; // centred on the turn axis
    if (k === 'master' || k === 'compact') nextDrawer = otto(x, { rows: MASTER_ROWS, first: nextDrawer });
    else nextDrawer = drawerModule(x, ROWS[k], nextDrawer);
  });

  /* ---------- Trays and devices (built the first time a drawer opens) ---------- */
  const phoneGeo = rbox(0.074, 0.008, 0.156, 0.004, 3);
  const laptopGeo = rbox(0.31, 0.016, 0.215, 0.006, 3);
  function ensureTray(d: Drawer) {
    if (d.tray) return;
    const t = new Group();
    const depth = 0.42;
    const iw = d.w - 0.014;
    const ih = d.h - 0.024;
    const sideH = ih * 0.55;
    const zb = FRONT_Z - FRONT_T / 2; // back of the front
    const bottom = mesh(new BoxGeometry(iw, 0.002, depth), trayMat);
    bottom.position.set(0, -ih / 2, zb - depth / 2);
    const left = mesh(new BoxGeometry(0.002, sideH, depth), trayMat);
    left.position.set(-iw / 2, -ih / 2 + sideH / 2, zb - depth / 2);
    const right = left.clone();
    right.position.x = iw / 2;
    t.add(bottom, left, right);
    const device = mesh(d.kind === 'wide' ? laptopGeo : phoneGeo, d.kind === 'wide' ? laptopMat : phoneMat);
    const len = d.kind === 'wide' ? 0.215 : 0.156;
    const thick = d.kind === 'wide' ? 0.016 : 0.008;
    device.position.set(0, -ih / 2 + 0.001 + thick / 2, zb - 0.014 - len / 2);
    t.add(device);
    d.g.add(t);
    d.tray = t;
  }

  /* ---------- Camera: fixed vertical framing ---------- */
  const camera = new PerspectiveCamera(15, 2, 0.5, 30);
  camera.position.set(0, TOP / 2 + Math.tan(CAM_ELEV) * CAM_DIST, CAM_DIST);
  {
    // Pitch and lens so that the back top edge lands on FRAME.top and the front floor line on FRAME.floor.
    const elev = (p: Vector3) => Math.atan2(p.y - camera.position.y, camera.position.z - p.z);
    const th = elev(new Vector3(0, TOP, -D / 2));
    const tl = elev(new Vector3(0, 0, FZ));
    const a = 1 - 2 * FRAME.top;
    const b = 1 - 2 * FRAME.floor;
    let lo = tl;
    let hi = th;
    for (let i = 0; i < 60; i++) {
      const phi = (lo + hi) / 2;
      if (Math.tan(th - phi) / a - Math.tan(tl - phi) / b > 0) lo = phi;
      else hi = phi;
    }
    const phi = (lo + hi) / 2;
    camera.rotation.set(phi, 0, 0);
    camera.fov = MathUtils.radToDeg(2 * Math.atan(Math.tan(th - phi) / a));
    camera.updateProjectionMatrix();
  }

  /* ---------- Size ---------- */
  const resize = () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    kick(true);
  };

  /* ---------- Motion ---------- */
  const rot = { x: 0, y: reduce ? 0 : -0.32, vx: 0, vy: 0 };
  const target = { x: 0, y: 0 };
  const sway = !reduce && !finePointer;
  let raf = 0;
  let last = 0;
  let visible = true;
  let forceOnce = false;

  function spring(dt: number) {
    const k = 34;
    const c = 10;
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

  /* ---------- Drawers: open on hover ---------- */
  let hovered: Drawer | null = null;
  // How it works, Open step: the story drawer is unlocked and waiting (gaps glow, strip blue) until the mouse opens it.
  const isWaiting = (d: Drawer) => !!story && storyStep === 2 && d.n === storyDrawer;
  const stripFor = (d: Drawer) => (d.target === 1 || isWaiting(d) ? activeMat : stripMat);
  function setHover(d: Drawer | null) {
    if (d === hovered) return;
    const prev = hovered;
    hovered = d;
    if (prev) {
      prev.target = 0;
      prev.strip.material = stripFor(prev);
    }
    if (d) {
      ensureTray(d);
      d.target = 1;
      d.strip.material = stripFor(d);
    }
    if (!story) drawScreen(d ? d.n : null);
    kick();
  }
  function stepDrawers(dt: number) {
    let busy = false;
    for (const d of drawers) {
      if (d.p === d.target && d.v === 0) continue;
      if (reduce) {
        d.p = d.target;
        d.v = 0;
      } else {
        // Push latch: a quick pop that runs a touch past its stop, then settles.
        const k = 210;
        const c = 19;
        d.v += ((d.target - d.p) * k - d.v * c) * dt;
        d.p += d.v * dt;
        if (Math.abs(d.target - d.p) < 1e-4 && Math.abs(d.v) < 1e-3) {
          d.p = d.target;
          d.v = 0;
        } else busy = true;
      }
      d.g.position.z = Math.max(0, d.p) * d.max;
      applyGlow(d);
    }
    return busy;
  }
  function applyGlow(d: Drawer) {
    const glow = Math.max(Math.min(1, Math.max(0, d.p) * 3), isWaiting(d) ? 1 : 0);
    d.light.visible = glow > 0.001;
    (d.light.material as MeshBasicMaterial).opacity = 0.85 * glow;
  }

  // Pointer picking: which drawer front is under the mouse (re-checked while the locker turns).
  const raycaster = new Raycaster();
  const ndc = new Vector2();
  let pointerIn = false;
  let pickDirty = false;
  function pointerToNdc(e: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
  }
  function pick(): Drawer | null {
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(fronts, false)[0];
    return hit ? (hit.object.userData.drawer as Drawer) : null;
  }

  function frame(now: number) {
    raf = 0;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
    last = now;
    if (sway) target.y = Math.sin((now / 1000) * ((Math.PI * 2) / 11)) * 0.11;
    const turning = spring(dt);
    rig.rotation.set(rot.x, rot.y, 0);
    if (pointerIn && (pickDirty || turning)) {
      rig.updateMatrixWorld();
      setHover(pick());
      pickDirty = false;
    }
    const sliding = stepDrawers(dt);
    renderer.render(scene, camera);
    if (!stage.classList.contains('is-3d')) stage.classList.add('is-3d');
    forceOnce = false;
    if (visible && (turning || sliding || sway)) raf = requestAnimationFrame(frame);
    else last = 0;
  }
  function kick(force = false) {
    if (force) forceOnce = true;
    if (!raf && (visible || forceOnce)) raf = requestAnimationFrame(frame);
  }

  stage.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    pointerToNdc(e);
    pointerIn = true;
    pickDirty = true;
    if (finePointer && !reduce) {
      // The locker turns its front toward the pointer.
      const r = stage.getBoundingClientRect();
      target.y = clamp1(((e.clientX - r.left) / r.width) * 2 - 1) * MAX_Y;
      target.x = clamp1(((e.clientY - r.top) / r.height) * 2 - 1) * MAX_X;
    }
    kick();
  }, { passive: true });
  stage.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse') return;
    pointerIn = false;
    target.x = 0;
    target.y = 0;
    setHover(null);
    kick();
  });
  // Touch: tap a drawer to open it, tap it again (or anywhere else on the locker) to close it.
  stage.addEventListener('pointerup', (e) => {
    if (e.pointerType === 'mouse') return;
    pointerToNdc(e);
    rig.updateMatrixWorld();
    const d = pick();
    setHover(d && d !== hovered ? d : null);
  });

  // Story mode: the How it works tabs set data-state on the stage.
  if (story) {
    new MutationObserver(() => {
      const s = Number(stage.dataset.state || 0);
      if (s === storyStep) return;
      storyStep = s;
      drawers.forEach((d) => {
        d.strip.material = stripFor(d);
        applyGlow(d);
      });
      drawStory(storyStep);
      kick(true);
    }).observe(stage, { attributes: true, attributeFilter: ['data-state'] });
  }

  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible) kick();
    else setHover(null);
  }).observe(stage);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) kick();
  });
  new ResizeObserver(resize).observe(stage);

  const start = () => {
    refreshScreen();
    resize();
  };
  if (document.fonts?.status === 'loaded') start();
  else document.fonts.ready.then(start);

  if (import.meta.env.DEV) {
    const w = window as unknown as Record<string, Record<string, unknown> | undefined>;
    const hooks = {
      open: (n: number) => setHover(drawers.find((x) => x.n === n) ?? null),
      tilt: (x: number, y: number) => {
        target.x = x;
        target.y = y;
        kick();
      },
    };
    // One handle per locker on the page, by data-modules order: __heroLocker (first), __lockers[i].
    w.__lockers = w.__lockers || {};
    (w.__lockers as Record<string, unknown>)[stage.closest('section')?.id || String(Object.keys(w.__lockers).length)] = hooks;
    if (!w.__heroLocker) w.__heroLocker = hooks;
  }
}
