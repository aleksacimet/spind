/**
 * A lost phone in real 3D (three.js), same look as the Spind lockers (hero-locker.ts): modern clay render, one matte
 * white material, soft studio light, no dark outlines, blue techno accents, CTA yellow only on the screen.
 * Used by Device3D.astro in the Lost device use case hero.
 *
 * The story it tells: the phone floats alone (it's gone), its screen is in lost mode (a yellow padlock, a map with
 * its last location, a "call the owner" button: shapes only, no text) and blue location pings ripple out on the floor
 * under it, like the MDM finding it.
 *
 * - Mouse over the stage: the phone turns a little toward the pointer and springs back (same exception to the
 *   fill-only hover rule as the lockers).
 * - Ambient: a slow float and the pings. Reduced motion: a still phone with still rings.
 * - Renders only while visible. If WebGL is missing the stage stays empty (the hero copy carries the page).
 */
import {
  CanvasTexture,
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
  RingGeometry,
  Scene,
  Shape,
  ShapeGeometry,
  ShadowMaterial,
  SpotLight,
  SRGBColorSpace,
  WebGLRenderer,
  type BufferGeometry,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* ---------- Phone dimensions (scene units; the phone is the hero, so it's big) ---------- */
const PW = 0.76; // width
const PH = 1.56; // height
const PR = 0.14; // corner radius
const PD = 0.09; // body depth (plus the soft edge on both sides)
const GLASS_IN = 0.07; // the white clay rim around the front glass (both sides together)
const SCREEN_IN = 0.115; // the screen inside the glass
const BEVEL = 0.024;
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

export function initHeroDevice(stage: HTMLElement) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  // Pose: 'dropped' (default) lies screen up on the floor, as if it fell; 'float' stands upright above the pings.
  const dropped = stage.dataset.pose !== 'float';
  const restY = dropped ? 0 : REST_Y;
  const maxX = dropped ? 0 : MAX_X; // a lying phone only turns flat on the floor

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

  const key = new SpotLight(0xffffff, 1.55, 0, 0.5, 1, 0);
  key.position.set(-1.2, 5, 3.6);
  key.target.position.set(0, dropped ? 0 : FLOAT + PH / 2, 0);
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
  // Rim light from behind: a cool edge on the clay, so the phone lifts off a dark page.
  const rim = new DirectionalLight(0xbcd6ff, 0.5);
  rim.position.set(1.5, 2.5, -3);
  scene.add(rim);

  const dark = stage.dataset.surface === 'dark';
  const floor = new Mesh(new PlaneGeometry(8, 8), new ShadowMaterial({ color: 0x0d1015, opacity: 0.08 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  /* ---------- Floor: a soft pool of light (dark page) and a blue spot where the phone was found ---------- */
  const radial = (stops: [number, number][]) => {
    const [c, ctx] = makeCanvas(256, 256);
    // alphaMap reads the grey value, so draw grey on black (not white with alpha).
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 256, 256);
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    for (const [o, a] of stops) g.addColorStop(o, `rgb(${a * 255},${a * 255},${a * 255})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return texture(c, false);
  };
  if (dark) {
    const pool = new Mesh(
      new PlaneGeometry(2.6, 1.5),
      new MeshBasicMaterial({ color: 0xc9dcff, alphaMap: radial([[0, 1], [0.5, 0.4], [0.92, 0]]), transparent: true, opacity: 0.14, depthWrite: false, toneMapped: false })
    );
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = 0.0004;
    pool.renderOrder = -3;
    scene.add(pool);
  }
  const spot = new Mesh(
    new PlaneGeometry(dropped ? 2.3 : 0.9, dropped ? 2.3 : 0.9),
    new MeshBasicMaterial({ color: 0x5aa6ff, alphaMap: radial([[0, 1], [0.3, 0.4], [0.75, 0.06], [1, 0]]), transparent: true, opacity: 0.6, depthWrite: false, toneMapped: false })
  );
  spot.rotation.x = -Math.PI / 2;
  spot.position.y = 0.0008;
  spot.renderOrder = -2;
  scene.add(spot);

  // Location pings: thin blue rings rippling out on the floor.
  const PINGS = 3;
  const PERIOD = 3.2;
  const ringGeo = new RingGeometry(0.97, 1, 96);
  const pings = Array.from({ length: PINGS }, () => {
    const m = new Mesh(ringGeo, new MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
    m.rotation.x = -Math.PI / 2;
    m.position.y = 0.0012;
    m.renderOrder = -1;
    scene.add(m);
    return m;
  });
  const setPings = (t: number) => {
    pings.forEach((m, i) => {
      const p = reduce ? (i + 0.5) / PINGS : ((t / PERIOD + i / PINGS) % 1);
      const r = dropped ? 0.95 + p * 0.8 : 0.22 + p * 1.05;
      m.scale.set(r, r, 1);
      (m.material as MeshBasicMaterial).opacity = (reduce ? 0.5 : Math.sin(Math.PI * Math.min(1, p * 1.15))) * 0.85 * (1 - p * 0.6);
    });
  };

  /* ---------- Materials ---------- */
  const clay = new MeshStandardMaterial({ color: CLAY, roughness: 0.78 });
  const buttonMat = new MeshStandardMaterial({ color: 0xe3e6ea, roughness: 0.7 });
  const glass = new MeshPhysicalMaterial({ color: 0x0b0e13, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 });
  const lensMat = new MeshPhysicalMaterial({ color: 0x14243a, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.02 });
  const camRing = new MeshStandardMaterial({ color: 0xd5d9de, metalness: 1, roughness: 0.3 });

  const mesh = (g: BufferGeometry, m: MeshStandardMaterial | MeshPhysicalMaterial | MeshBasicMaterial, shadows = true) => {
    const o = new Mesh(g, m);
    o.castShadow = shadows;
    o.receiveShadow = shadows;
    return o;
  };

  /* ---------- The phone ---------- */
  const rig = new Group(); // turns toward the mouse
  rig.position.y = dropped ? 0 : FLOAT + PH / 2;
  scene.add(rig);
  const phone = new Group(); // floats
  rig.add(phone);

  // Body: white clay with a soft rounded edge all round.
  const bodyGeo = new ExtrudeGeometry(roundRectShape(PW - BEVEL * 2, PH - BEVEL * 2, PR - BEVEL), {
    depth: PD,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 8,
    curveSegments: 32,
  });
  bodyGeo.translate(0, 0, -PD / 2);
  const body = mesh(bodyGeo, clay);
  phone.add(body);
  const FRONT = PD / 2 + BEVEL;

  // Front: one sheet of black glass with a thin white clay rim around it, then the screen.
  const glassFront = mesh(flatRound(PW - GLASS_IN, PH - GLASS_IN, PR - GLASS_IN / 2), glass, false);
  glassFront.position.z = FRONT + 0.0008;
  phone.add(glassFront);
  const screen = new Mesh(
    flatRound(PW - SCREEN_IN, PH - SCREEN_IN, PR - SCREEN_IN / 2),
    new MeshPhysicalMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: drawLostScreen(), emissiveIntensity: 1.15, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03 })
  );
  screen.position.z = FRONT + 0.0016;
  phone.add(screen);
  // Camera island: a black pill at the top of the screen.
  const island = mesh(new RoundedBoxGeometry(0.2, 0.054, 0.004, 3, 0.002), glass, false);
  island.position.set(0, PH / 2 - SCREEN_IN / 2 - 0.05, FRONT + 0.0026);
  phone.add(island);
  // Soft diagonal reflection on the glass.
  {
    const [c, ctx] = makeCanvas(256, 512);
    const g = ctx.createLinearGradient(0, 0, 256, 512);
    g.addColorStop(0, 'rgba(255,255,255,0.12)');
    g.addColorStop(0.38, 'rgba(255,255,255,0.06)');
    g.addColorStop(0.39, 'rgba(255,255,255,0.015)');
    g.addColorStop(0.7, 'rgba(255,255,255,0)');
    g.addColorStop(1, 'rgba(255,255,255,0.03)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 512);
    const sheen = new Mesh(
      flatRound(PW - GLASS_IN, PH - GLASS_IN, PR - GLASS_IN / 2),
      new MeshBasicMaterial({ map: texture(c), transparent: true, depthWrite: false, toneMapped: false })
    );
    sheen.position.z = FRONT + 0.0032;
    phone.add(sheen);
  }

  // Side buttons in clay: action and volume on the left, power on the right.
  const SIDE = PW / 2 + 0.002;
  const side = (x: number, y: number, h: number) => {
    const b = mesh(new RoundedBoxGeometry(0.02, h, 0.05, 3, 0.009), buttonMat);
    b.position.set(x, y, 0);
    phone.add(b);
  };
  side(-SIDE, 0.48, 0.07);
  side(-SIDE, 0.32, 0.14);
  side(-SIDE, 0.14, 0.14);
  side(SIDE, 0.28, 0.22);

  // Back: camera plateau with two lenses (seen when the phone turns).
  const BACK = -FRONT;
  const plateau = mesh(new RoundedBoxGeometry(0.3, 0.3, 0.03, 4, 0.012), clay);
  plateau.position.set(-PW / 2 + 0.05 + 0.15, PH / 2 - 0.05 - 0.15, BACK - 0.008);
  phone.add(plateau);
  for (const [dx, dy] of [[-0.065, 0.065], [0.065, -0.065]] as const) {
    const ring = mesh(new RoundedBoxGeometry(0.11, 0.11, 0.02, 4, 0.05), camRing, false);
    ring.position.set(plateau.position.x + dx, plateau.position.y + dy, BACK - 0.03);
    phone.add(ring);
    const lens = mesh(new RoundedBoxGeometry(0.08, 0.08, 0.02, 4, 0.038), lensMat, false);
    lens.position.set(plateau.position.x + dx, plateau.position.y + dy, BACK - 0.034);
    phone.add(lens);
  }

  if (dropped) {
    // Screen up, spun a little in its own plane, resting on its back (the camera plateau lifts it a hair).
    phone.rotation.set(-Math.PI / 2, 0, 0.5);
    phone.position.y = FRONT + 0.045;
  }

  /* ---------- Camera: the phone and its pings fill the stage ---------- */
  const camera = new PerspectiveCamera(18, 1.4, 0.5, 40);
  const lookY = dropped ? 0.02 : (FLOAT + PH) / 2 + 0.04;
  // Dropped: the camera looks down on the floor, like spotting it on the ground.
  const CAM_ELEV = MathUtils.degToRad(dropped ? 40 : 11);
  const fit = () => {
    // The phone fills about 80% of the height; the stage stays wide enough for the pings at any width.
    const span = dropped ? Math.max(2.25, 3.5 / camera.aspect) : Math.max(PH + FLOAT + 0.32, 2.7 / camera.aspect);
    const dist = span / 2 / Math.tan(MathUtils.degToRad(camera.fov / 2));
    camera.position.set(0, lookY + Math.sin(CAM_ELEV) * dist, Math.cos(CAM_ELEV) * dist);
    camera.lookAt(0, lookY, 0);
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
    // Float: a slow bob and a hint of roll, like it's drifting.
    if (dropped) {
      // Lying still on the floor; only the pings move.
    } else if (ambient) {
      phone.position.y = Math.sin(t * 1.1) * 0.035;
      phone.rotation.z = Math.sin(t * 0.7) * 0.025 + 0.05;
      spot.scale.setScalar(1 - phone.position.y * 1.2);
    } else phone.rotation.z = 0.05;
    setPings(t);
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
