/**
 * Home hero locker in real 3D (three.js), lit like a product shot.
 * Three white Spind modules stand on the floor: Otto (touch screen, readers, service panel with a small grey logo),
 * Lotte (24 small drawers) and Bruno (8 wide drawers).
 *
 * - Mouse over the stage: the locker turns a little toward the pointer and springs back when it leaves.
 *   This is the one hover motion on the site (asked for on 2026-11-25).
 * - Every few seconds a drawer slides out with a phone or laptop in it, the screen says which drawer, then it closes.
 * - Touch screens: a slow sway instead of the tilt. Reduced motion: one still frame.
 * - Renders only while something moves and pauses off screen. If WebGL is missing, the SVG drawing stays.
 */
import {
  BoxGeometry,
  CanvasTexture,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  SpotLight,
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
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { LOGO_PATHS } from '../components/logo-path';

/* ---------- Dimensions in metres (a module is 600 wide, 910 tall, 500 deep) ---------- */
const W = 0.6; // module width
const GAP = 0.06; // space between modules
const D = 0.5; // depth
const PL = 0.05; // plinth height
const BODY = 0.86; // cabinet above the plinth
const TOP = PL + BODY;
const FM = 0.022; // frame around the drawer field
const DG = 0.003; // gap between drawers
const FZ = D / 2; // front face
const FRONT_T = 0.02; // drawer front thickness
const FRONT_Z = FZ - 0.002; // drawer fronts stand 8 mm proud of the frame
const FACE = FRONT_Z + FRONT_T / 2; // drawer front face

/* Framing: the back top edge sits this far from the top of the stage, the front floor line this far down.
   Only the vertical is fixed, so the hero CSS can place the dark band on the locker at any width. */
export const FRAME = { top: 0.045, floor: 0.93 };
const CAM_DIST = 3.8;
const CAM_ELEV = MathUtils.degToRad(9);

/* Tilt */
const MAX_Y = 0.17; // ~10 degrees left and right
const MAX_X = 0.05; // ~3 degrees up and down

type Screen = { idleTitle: string; idleText: string; start: string; openTitle: string; openText: string; footer: string };
type Drawer = { n: number; g: Group; w: number; h: number; kind: 'small' | 'wide'; handle: Mesh; light: Mesh; max: number; tray?: Group };

// Push latch: the drawer pops out fast, runs a touch past its stop and settles back.
const easeOutBack = (t: number, s = 1.25) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
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
      const a = Math.pow(Math.max(0, 1 - dist / pad), 2.4);
      img.data[(j * S + i) * 4 + 3] = Math.round(a * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  return { tex: texture(c, false), w: tw, d: td };
}

/** The Spind logo as a texture, in one flat colour on transparent. */
function logoTexture(color: string) {
  const w = 1024;
  const h = Math.round((w * 3687) / 8342);
  const [c, ctx] = makeCanvas(w, h);
  ctx.scale(w / 8342, h / 3687);
  ctx.fillStyle = color;
  for (const p of LOGO_PATHS) ctx.fill(new Path2D(p.d), p.evenodd ? 'evenodd' : 'nonzero');
  return texture(c);
}

/**
 * Soft occlusion on a drawer front: a few percent darker in the last 8 mm toward each gap,
 * and a little more along the bottom, so the gaps read as depth, not as drawn lines.
 */
function frontShade(w: number, h: number) {
  const cw = 256;
  const ch = Math.max(16, Math.round((cw * h) / w));
  const [c, ctx] = makeCanvas(cw, ch);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, cw, ch);
  const ex = (0.008 / w) * cw;
  const ey = (0.008 / h) * ch;
  const edge = (x0: number, y0: number, x1: number, y1: number, a: number) => {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, `rgba(70, 80, 95, ${a})`);
    g.addColorStop(1, 'rgba(70, 80, 95, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cw, ch);
  };
  edge(0, 0, ex, 0, 0.07);
  edge(cw, 0, cw - ex, 0, 0.07);
  edge(0, 0, 0, ey, 0.05); // top of the face
  edge(0, ch, 0, ch - ey, 0.09); // bottom of the face
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

/** Contactless reader symbol (three arcs) for the badge reader. */
function nfcTexture() {
  const [c, ctx] = makeCanvas(256, 256);
  ctx.strokeStyle = 'rgba(230, 236, 243, 0.85)';
  ctx.lineCap = 'round';
  ctx.lineWidth = 12;
  for (let k = 0; k < 3; k++) {
    ctx.beginPath();
    ctx.arc(92, 128, 26 + k * 28, -Math.PI / 4, Math.PI / 4);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(230, 236, 243, 0.85)';
  ctx.beginPath();
  ctx.arc(92, 128, 9, 0, Math.PI * 2);
  ctx.fill();
  return texture(c);
}

export function initHeroLocker(stage: HTMLElement) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const copy: Screen = JSON.parse(stage.dataset.screen || '{}');

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
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const canvas = renderer.domElement;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', stage.dataset.label || '');
  stage.appendChild(canvas);

  /* ---------- Scene, light ---------- */
  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.5;
  pmrem.dispose();

  // Key: a soft spot from the front left, high, like a softbox in a studio. Its falloff gives the fronts a gentle
  // top-to-bottom gradient; its shadow is short and soft and falls on the drawers below an open one.
  const key = new SpotLight(0xffffff, 1.75, 0, 0.46, 0.95, 0);
  key.position.set(-1.1, 3.9, 3.6);
  key.target.position.set(0.1, 0.72, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 2;
  key.shadow.camera.far = 9;
  key.shadow.radius = 6;
  key.shadow.bias = -0.0003;
  key.shadow.normalBias = 0.01;
  scene.add(key, key.target);
  // Cool fill from the right so the right sides read as grey steel, not flat.
  const fill = new DirectionalLight(0xe4ecff, 0.28);
  fill.position.set(3, 1.6, 2);
  scene.add(fill);

  const floor = new Mesh(new PlaneGeometry(8, 8), new ShadowMaterial({ color: 0x0d1015, opacity: 0.09 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  /* ---------- Materials ---------- */
  // White powder-coated steel: matte with a faint sheen that moves as the locker turns.
  const white = new MeshPhysicalMaterial({ color: 0xf1f3f6, roughness: 0.5, clearcoat: 0.25, clearcoatRoughness: 0.45 });
  const frontMat = white.clone();
  frontMat.color.set(0xf6f7f9);
  const recess = new MeshStandardMaterial({ color: 0x343b45, roughness: 0.95 });
  const plinthMat = new MeshStandardMaterial({ color: 0x4f5763, roughness: 0.8 });
  const slotMat = new MeshStandardMaterial({ color: 0x20262e, roughness: 0.7 });
  const activeMat = new MeshStandardMaterial({ color: 0x0079ff, emissive: 0x1f86ff, emissiveIntensity: 1.6, roughness: 0.4 });
  const glass = new MeshPhysicalMaterial({ color: 0x07090c, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.04 });
  const readerMat = new MeshPhysicalMaterial({ color: 0x1b222c, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.1 });
  const lensMat = new MeshPhysicalMaterial({ color: 0x14243a, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.02 });
  const chrome = new MeshStandardMaterial({ color: 0xd5d9de, metalness: 1, roughness: 0.22 });
  const trayMat = new MeshStandardMaterial({ color: 0xdfe4ea, roughness: 0.6 });
  const trayFloor = new MeshStandardMaterial({ color: 0x0079ff, roughness: 0.55, emissive: 0x0a3f8a, emissiveIntensity: 0.35 });
  const phoneMat = new MeshPhysicalMaterial({ color: 0x111419, roughness: 0.18, metalness: 0.4, clearcoat: 1, clearcoatRoughness: 0.05 });
  const laptopMat = new MeshStandardMaterial({ color: 0xc8cdd3, metalness: 0.9, roughness: 0.32 });

  /* ---------- Geometry cache ---------- */
  const geoCache = new Map<string, BufferGeometry>();
  const rbox = (w: number, h: number, d: number, r: number, seg = 3) => {
    const k = [w, h, d, r, seg].map((v) => v.toFixed(4)).join();
    let g = geoCache.get(k);
    if (!g) geoCache.set(k, (g = new RoundedBoxGeometry(w, h, d, seg, r)));
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
  const ao = contactShadow(W, D, 0.14);
  const aoMat = new MeshBasicMaterial({ color: 0x0d1015, alphaMap: ao.tex, transparent: true, opacity: 0.5, depthWrite: false });
  const aoGeo = new PlaneGeometry(ao.w, ao.d);

  function cabinet(x: number) {
    const m = new Group();
    m.position.x = x;
    rig.add(m);
    const body = mesh(rbox(W, BODY, D, 0.016, 5), white);
    body.position.y = PL + BODY / 2;
    m.add(body);
    // Recessed dark plinth: the cabinet looks like it stands a little above the floor.
    const plinth = mesh(new BoxGeometry(W - 0.05, PL + 0.01, D - 0.09), plinthMat);
    plinth.position.set(0, (PL + 0.01) / 2, -0.02);
    m.add(plinth);
    const shadow = new Mesh(aoGeo, aoMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.0008;
    shadow.renderOrder = -1;
    m.add(shadow);
    return m;
  }

  /** Dark opening behind the fronts: it shows in the gaps and when a drawer slides out. */
  function opening(m: Group, x0: number, y0: number, w: number, h: number) {
    const p = new Mesh(new PlaneGeometry(w, h), recess);
    p.position.set(x0 + w / 2, y0 + h / 2, FZ + 0.0004);
    m.add(p);
  }

  const drawers: Drawer[] = [];
  // Compartment light: brightest at the top (the LED strip), fading down.
  const lightTex = (() => {
    const [c, ctx] = makeCanvas(4, 128);
    const gr = ctx.createLinearGradient(0, 0, 0, 128);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.12, 'rgba(255,255,255,0.9)');
    gr.addColorStop(1, 'rgba(255,255,255,0.25)');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, 4, 128);
    return texture(c, false);
  })();
  const lightGeo = (w: number, h: number) => {
    const k = `light${w.toFixed(4)}`;
    let g = geoCache.get(k);
    if (!g) geoCache.set(k, (g = new PlaneGeometry(w, h)));
    return g;
  };
  const frontMats = new Map<string, MeshPhysicalMaterial>();
  const frontFor = (w: number, h: number) => {
    const k = `${w.toFixed(4)}x${h.toFixed(4)}`;
    let m = frontMats.get(k);
    if (!m) {
      m = frontMat.clone();
      m.map = frontShade(w, h);
      frontMats.set(k, m);
    }
    return m;
  };
  function drawer(m: Group, cx: number, cy: number, w: number, h: number, kind: Drawer['kind'], n: number) {
    const g = new Group();
    g.position.set(cx, cy, 0);
    m.add(g);
    const f = mesh(rbox(w, h, FRONT_T, 0.0045, 3), frontFor(w, h));
    f.position.z = FRONT_Z;
    g.add(f);
    // Finger pull, bottom right (as on the drawing): a dark slot that lights blue when the drawer opens.
    const hw = kind === 'wide' ? 0.08 : 0.042;
    const handle = mesh(rbox(hw, 0.0055, 0.004, 0.0018, 1), slotMat, false);
    handle.position.set(w / 2 - 0.016 - hw / 2, -h / 2 + 0.014, FACE - 0.0015);
    g.add(handle);
    // Compartment light: sits in the opening behind the front and only shows once the drawer slides out.
    const light = new Mesh(lightGeo(w, h), new MeshBasicMaterial({ color: 0x2e8eff, alphaMap: lightTex, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
    light.position.set(cx, cy, FZ + 0.0006);
    light.visible = false;
    m.add(light);
    drawers.push({ n, g, w, h, kind, handle, light, max: kind === 'wide' ? 0.15 : 0.13 });
  }

  function drawerModule(x: number, cols: number, first: number) {
    const m = cabinet(x);
    const fw = W - FM * 2;
    const fh = BODY - FM * 2;
    const x0 = -fw / 2;
    const y0 = PL + FM;
    opening(m, x0, y0, fw, fh);
    const w = (fw - DG * (cols + 1)) / cols;
    const h = (fh - DG * 9) / 8;
    let n = first;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = x0 + DG + w / 2 + c * (w + DG);
        const cy = TOP - FM - DG - h / 2 - r * (h + DG);
        drawer(m, cx, cy, w, h, cols === 1 ? 'wide' : 'small', n++);
      }
    }
    return n;
  }

  /* ---------- Otto: screen, readers, slot, service panel ---------- */
  const [scrCanvas, scr] = makeCanvas(1024, 640);
  const scrTex = texture(scrCanvas);
  const fontDisplay = getComputedStyle(document.documentElement).getPropertyValue('--font-display').trim() || 'sans-serif';
  const fontBody = getComputedStyle(document.documentElement).getPropertyValue('--font-body').trim() || 'sans-serif';
  const logoWhite = (() => {
    const w = 120;
    const h = (w * 3687) / 8342;
    const [c, ctx] = makeCanvas(w * 2, h * 2);
    ctx.scale((w * 2) / 8342, (h * 2) / 3687);
    ctx.fillStyle = '#ffffff';
    for (const p of LOGO_PATHS) ctx.fill(new Path2D(p.d), p.evenodd ? 'evenodd' : 'nonzero');
    return c;
  })();

  function drawScreen(open: number | null) {
    const ctx = scr;
    const { width: w, height: h } = scrCanvas;
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#1C3658');
    bg.addColorStop(1, '#0A1422');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    const glow = ctx.createRadialGradient(w * 0.85, h * 0.1, 0, w * 0.85, h * 0.1, w * 0.7);
    glow.addColorStop(0, open ? 'rgba(0, 121, 255, 0.45)' : 'rgba(46, 142, 255, 0.22)');
    glow.addColorStop(1, 'rgba(46, 142, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    ctx.drawImage(logoWhite, 56, 44, 108, 108 * (3687 / 8342));
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = `700 30px ${fontDisplay}`;
    ctx.textAlign = 'right';
    ctx.fillText('08:42', w - 56, 78);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#ffffff';
    ctx.font = `700 64px ${fontDisplay}`;
    ctx.fillText(open ? copy.openTitle.replace('{n}', String(open).padStart(2, '0')) : copy.idleTitle, 56, 270);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.66)';
    ctx.font = `400 32px ${fontBody}`;
    ctx.fillText(open ? copy.openText : copy.idleText, 56, 322);

    if (open) {
      // Progress bar instead of the button.
      roundRect(ctx, 56, 384, 420, 12, 6);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.fill();
      roundRect(ctx, 56, 384, 300, 12, 6);
      ctx.fillStyle = '#2E8EFF';
      ctx.fill();
    } else {
      roundRect(ctx, 56, 372, 248, 80, 40);
      ctx.fillStyle = '#0079FF';
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 32px ${fontDisplay}`;
      ctx.fillText(`${copy.start}  →`, 96, 423);
    }

    // Mini map of the drawers on the right: one lights up blue when it is open.
    const cols = 3;
    const rows = 4;
    const tw = 92;
    const th = 50;
    const gx = 12;
    const ox = w - 56 - cols * tw - (cols - 1) * gx;
    const oy = 196;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const k = r * cols + c;
        roundRect(ctx, ox + c * (tw + gx), oy + r * (th + gx), tw, th, 8);
        ctx.fillStyle = open && k === open % (cols * rows) ? '#0079FF' : 'rgba(255, 255, 255, 0.09)';
        ctx.fill();
      }
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(56, h - 92, w - 112, 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = `400 26px ${fontBody}`;
    ctx.fillText(copy.footer, 56, h - 46);
    scrTex.needsUpdate = true;
  }

  function otto(x: number) {
    const m = cabinet(x);
    // Touch screen behind one sheet of black glass.
    const sy = TOP - 0.06 - 0.125;
    const bezel = mesh(rbox(0.36, 0.25, 0.014, 0.008, 3), glass);
    bezel.position.set(0, sy, FZ + 0.001);
    m.add(bezel);
    const screen = new Mesh(
      new PlaneGeometry(0.33, 0.206),
      new MeshPhysicalMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: scrTex, emissiveIntensity: 0.95, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03 })
    );
    screen.position.set(0, sy + 0.004, FZ + 0.0082);
    m.add(screen);
    // Glass sheen: a soft diagonal reflection across the whole glass, like a real kiosk under office light.
    const sheen = new Mesh(
      new PlaneGeometry(0.36, 0.25),
      new MeshBasicMaterial({ map: sheenTexture(), transparent: true, depthWrite: false, toneMapped: false, opacity: 0.9 })
    );
    sheen.position.set(0, sy, FZ + 0.0085);
    m.add(sheen);

    // Badge reader (left) and QR camera (right).
    const readerGeo = new CylinderGeometry(0.028, 0.028, 0.006, 64);
    for (const side of [-1, 1]) {
      const r = mesh(readerGeo, readerMat, false);
      r.rotation.x = Math.PI / 2;
      r.position.set(side * 0.24, sy, FZ + 0.002);
      m.add(r);
    }
    const nfc = new Mesh(new CircleGeometry(0.02, 48), new MeshBasicMaterial({ map: nfcTexture(), transparent: true, depthWrite: false }));
    nfc.position.set(-0.24, sy, FZ + 0.0052);
    m.add(nfc);
    const lens = mesh(new CylinderGeometry(0.009, 0.009, 0.003, 48), lensMat, false);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0.24, sy, FZ + 0.0058);
    m.add(lens);
    const ring = mesh(new CylinderGeometry(0.0125, 0.0125, 0.002, 48), chrome, false);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0.24, sy, FZ + 0.005);
    m.add(ring);

    // Return slot under the screen.
    const slot = mesh(rbox(0.15, 0.008, 0.004, 0.003, 2), slotMat, false);
    slot.position.set(0, sy - 0.125 - 0.045, FZ + 0.0005);
    m.add(slot);

    // Service panel: one big front, like a drawer, with the logo, vents and a key lock.
    const fw = W - FM * 2;
    const top = 0.47;
    const y0 = PL + FM;
    const fh = top - y0;
    opening(m, -fw / 2, y0, fw, fh);
    const pw = fw - DG * 2;
    const ph = fh - DG * 2;
    const panel = mesh(rbox(pw, ph, FRONT_T, 0.0045, 3), frontFor(pw, ph));
    panel.position.set(0, y0 + fh / 2, FRONT_Z);
    m.add(panel);

    // Small grey logo, printed, top left: there, but quiet.
    const lw = 0.078;
    const lh = (lw * 3687) / 8342;
    const logo = new Mesh(
      new PlaneGeometry(lw, lh),
      new MeshStandardMaterial({ map: logoTexture('#b3bcc7'), transparent: true, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2 })
    );
    logo.position.set(-pw / 2 + 0.034 + lw / 2, top - DG - 0.034 - lh / 2, FACE + 0.0002);
    m.add(logo);

    // Vents, bottom right.
    const ventGeo = rbox(0.17, 0.0045, 0.004, 0.0018, 1);
    for (let k = 0; k < 7; k++) {
      const v = new Mesh(ventGeo, slotMat);
      v.position.set(pw / 2 - 0.034 - 0.085, y0 + 0.05 + k * 0.016, FACE - 0.0015);
      m.add(v);
    }
    // Key lock, top right.
    const lock = mesh(new CylinderGeometry(0.0095, 0.0095, 0.004, 40), chrome, false);
    lock.rotation.x = Math.PI / 2;
    lock.position.set(pw / 2 - 0.034 - 0.0095, top - DG - 0.045, FACE + 0.0015);
    m.add(lock);
    const keyway = new Mesh(rbox(0.0022, 0.011, 0.002, 0.0008, 1), slotMat);
    keyway.position.set(lock.position.x, lock.position.y, FACE + 0.0032);
    m.add(keyway);
  }

  const step = W + GAP;
  otto(-step);
  const next = drawerModule(0, 3, 1);
  drawerModule(step, 1, next);

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
    const bottom = mesh(new BoxGeometry(iw, 0.002, depth), trayFloor);
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
  const aimY = TOP / 2;
  camera.position.set(0, aimY + Math.tan(CAM_ELEV) * CAM_DIST, CAM_DIST);
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

  // Ambient drawer: opens, holds, closes, waits.
  let current: Drawer | null = null;
  let phase: 'idle' | 'opening' | 'open' | 'closing' = 'idle';
  let pt = 0;
  let timer = 0;
  let lastN = 0;
  const OPEN_T = 0.95;
  const HOLD_T = 2600;
  const CLOSE_T = 0.85;
  // Drawers in the lower two thirds, where the camera looks into them.
  const candidates = drawers.filter((d) => d.g.position.y < TOP * 0.62);

  function schedule(ms: number) {
    window.clearTimeout(timer);
    timer = window.setTimeout(openNext, ms);
  }
  function openNext() {
    if (!visible || document.hidden || phase !== 'idle') {
      schedule(1200);
      return;
    }
    let d: Drawer;
    do d = candidates[Math.floor(Math.random() * candidates.length)];
    while (d.n === lastN && candidates.length > 1);
    lastN = d.n;
    ensureTray(d);
    current = d;
    phase = 'opening';
    pt = 0;
    d.handle.material = activeMat;
    drawScreen(d.n);
    kick();
  }
  function glow(d: Drawer, v: number) {
    d.light.visible = v > 0.001;
    (d.light.material as MeshBasicMaterial).opacity = 0.85 * v;
  }
  function stepDrawer(dt: number) {
    if (!current || phase === 'idle' || phase === 'open') return false;
    pt += dt;
    if (phase === 'opening') {
      const k = Math.min(1, pt / OPEN_T);
      current.g.position.z = easeOutBack(k) * current.max;
      glow(current, Math.min(1, k * 3));
      if (k >= 1) {
        phase = 'open';
        window.setTimeout(() => {
          phase = 'closing';
          pt = 0;
          kick();
        }, HOLD_T);
      }
      return true;
    }
    const k = Math.min(1, pt / CLOSE_T);
    current.g.position.z = (1 - easeInOutCubic(k)) * current.max;
    glow(current, 1 - easeInOutCubic(k));
    if (k >= 1) {
      glow(current, 0);
      current.handle.material = slotMat;
      current = null;
      phase = 'idle';
      drawScreen(null);
      schedule(2400 + Math.random() * 2200);
    }
    return true;
  }

  function frame(now: number) {
    raf = 0;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
    last = now;
    if (sway) target.y = Math.sin((now / 1000) * ((Math.PI * 2) / 11)) * 0.11;
    const turning = spring(dt);
    const sliding = stepDrawer(dt);
    rig.rotation.set(rot.x, rot.y, 0);
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

  if (finePointer && !reduce) {
    stage.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = stage.getBoundingClientRect();
      const nx = clamp1(((e.clientX - r.left) / r.width) * 2 - 1);
      const ny = clamp1(((e.clientY - r.top) / r.height) * 2 - 1);
      // The locker turns its front toward the pointer.
      target.y = nx * MAX_Y;
      target.x = ny * MAX_X;
      kick();
    }, { passive: true });
    stage.addEventListener('pointerleave', () => {
      target.x = 0;
      target.y = 0;
      kick();
    });
  }

  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible) kick();
  }).observe(stage);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) kick();
  });
  new ResizeObserver(resize).observe(stage);

  const start = () => {
    drawScreen(null);
    resize();
    if (!reduce) schedule(1800);
  };
  if (document.fonts?.status === 'loaded') start();
  else document.fonts.ready.then(start);

  if (import.meta.env.DEV) {
    (window as unknown as Record<string, unknown>).__heroLocker = {
      open: (n: number) => {
        const d = drawers.find((x) => x.n === n);
        if (!d || phase !== 'idle') return;
        window.clearTimeout(timer);
        ensureTray(d);
        current = d;
        phase = 'opening';
        pt = 0;
        d.handle.material = activeMat;
        drawScreen(d.n);
        kick();
      },
      tilt: (x: number, y: number) => { target.x = x; target.y = y; kick(); },
    };
    // Where the dark band should end (3/4 down the front) and the front top edge, as fractions of the stage height.
    camera.updateMatrixWorld();
    const frac = (p: Vector3) => (1 - p.clone().project(camera).y) / 2;
    console.info('[hero-locker] front top', frac(new Vector3(0, TOP, FZ)).toFixed(4), 'band', frac(new Vector3(0, TOP * 0.25, FZ)).toFixed(4), 'fov', camera.fov.toFixed(2));
  }
}
