import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* 3D simplex noise: Ashima Arts / Stefan Gustavson (MIT) */
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const RING_RADIUS = 2.75;
const RING_TEXT = 'ROBOTICS  •  COMPUTER ARCHITECTURE  •  VLSI  •  EMBEDDED SYSTEMS  •  ARTIFICIAL INTELLIGENCE  •  ';

/* Where the core sits for each section.
   d = desktop, m = narrow screens: [screenX 0..1, screenY 0..1, ring diameter as a fraction of the smaller viewport side] */
const SECTIONS = {
  top: { d: [0.73, 0.5, 0.82], m: [0.5, 0.9, 0.92], amp: 0.22, colors: ['#8b5cf6', '#2dd4bf', '#f9a8d4'] },
  about: { d: [0.18, 0.4, 0.62], m: [0.5, 0.22, 0.8], amp: 0.3, colors: ['#ec4899', '#a78bfa', '#fde68a'] },
  skills: { d: [0.5, 0.42, 0.7], m: [0.5, 0.5, 0.85], amp: 0.34, colors: ['#60a5fa', '#2dd4bf', '#c4b5fd'] },
  projects: { d: [0.84, 0.55, 0.62], m: [0.5, 0.3, 0.8], amp: 0.26, colors: ['#8b5cf6', '#f472b6', '#99f6e4'] },
  hardware: { d: [0.84, 0.3, 0.5], m: [0.5, 0.25, 0.8], amp: 0.18, colors: ['#f59e0b', '#f472b6', '#fde68a'] },
  journey: { d: [0.82, 0.5, 0.66], m: [0.5, 0.5, 0.8], amp: 0.3, colors: ['#2dd4bf', '#818cf8', '#f9a8d4'] },
  certificates: { d: [0.16, 0.5, 0.6], m: [0.5, 0.3, 0.8], amp: 0.24, colors: ['#a78bfa', '#22d3ee', '#fbcfe8'] },
  contact: { d: [0.5, 0.48, 0.95], m: [0.5, 0.45, 1.0], amp: 0.34, colors: ['#8b5cf6', '#2dd4bf', '#f9a8d4'] },
};

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,.55)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function ringTexture(maxAniso) {
  const canvas = document.createElement('canvas');
  canvas.width = 4096;
  canvas.height = 128;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.anisotropy = Math.min(8, maxAniso);
  const draw = () => {
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '700 68px "Space Grotesk Variable", "Segoe UI", system-ui, sans-serif';
    const w = ctx.measureText(RING_TEXT).width;
    const reps = Math.max(1, Math.round(canvas.width / w));
    ctx.setTransform(canvas.width / (w * reps), 0, 0, 1, 0, 0);
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < reps; i++) ctx.fillText(RING_TEXT, i * w, canvas.height / 2 + 4);
    tex.needsUpdate = true;
  };
  draw();
  if (document.fonts && document.fonts.load) {
    document.fonts.load('700 68px "Space Grotesk Variable"').then(draw).catch(() => {});
  }
  return tex;
}

function makeChip() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.14, 1),
    new THREE.MeshStandardMaterial({ color: '#161829', metalness: 0.55, roughness: 0.32 })
  );
  g.add(body);
  const die = new THREE.Mesh(
    new THREE.BoxGeometry(0.46, 0.02, 0.46),
    new THREE.MeshStandardMaterial({ color: '#0b1020', emissive: '#2dd4bf', emissiveIntensity: 1.1, roughness: 0.4 })
  );
  die.position.y = 0.08;
  g.add(die);
  const pins = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.06, 0.03, 0.16),
    new THREE.MeshStandardMaterial({ color: '#d1d5db', metalness: 1, roughness: 0.28 }),
    28
  );
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3(1, 1, 1);
  const p = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  let k = 0;
  for (let side = 0; side < 4; side++) {
    for (let i = 0; i < 7; i++) {
      const t = -0.39 + i * 0.13;
      if (side === 0) p.set(t, 0, 0.58);
      else if (side === 1) p.set(t, 0, -0.58);
      else if (side === 2) p.set(0.58, 0, t);
      else p.set(-0.58, 0, t);
      q.setFromAxisAngle(up, side >= 2 ? Math.PI / 2 : 0);
      m.compose(p, q, s);
      pins.setMatrixAt(k++, m);
    }
  }
  g.add(pins);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 0.14, 1)),
    new THREE.LineBasicMaterial({ color: '#a78bfa', transparent: true, opacity: 0.7 })
  );
  g.add(edges);
  return g;
}

function makeOcta(color) {
  const g = new THREE.Group();
  const geo = new THREE.OctahedronGeometry(0.6, 0);
  g.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.75, depthWrite: false })
    )
  );
  g.add(
    new THREE.Mesh(
      new THREE.OctahedronGeometry(0.3, 0),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18, depthWrite: false })
    )
  );
  return g;
}

function makeTorus() {
  return new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.16, 32, 96),
    new THREE.MeshPhysicalMaterial({
      color: '#c4b5fd',
      metalness: 1,
      roughness: 0.16,
      iridescence: 1,
      iridescenceIOR: 1.6,
      iridescenceThicknessMinimum: 200,
      iridescenceThicknessMaximum: 650,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    })
  );
}

export function initScene(canvas, { reduceMotion = false } = {}) {
  if (!canvas) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (err) {
    document.documentElement.classList.add('no-webgl');
    return null;
  }

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const small = window.innerWidth < 768;
  const lowPower = coarse || small;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  camera.position.set(0, 0, 10);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.85;
  pmrem.dispose();

  scene.add(new THREE.AmbientLight('#ffffff', 0.35));
  const key = new THREE.DirectionalLight('#ffffff', 1.4);
  key.position.set(5, 6, 8);
  scene.add(key);
  const violetLight = new THREE.PointLight('#8b5cf6', 40, 0, 2);
  violetLight.position.set(-5, 3, 4);
  scene.add(violetLight);
  const tealLight = new THREE.PointLight('#14b8a6', 40, 0, 2);
  tealLight.position.set(5, -3, 4);
  scene.add(tealLight);

  const glow = glowTexture();

  /* ---------------- core: liquid blob + wire shell + orbits + text ring ---------------- */
  const core = new THREE.Group();
  scene.add(core);

  const blobUniforms = {
    uTime: { value: 0 },
    uAmp: { value: 0.22 },
    uFreq: { value: 1.25 },
    uColA: { value: new THREE.Color(SECTIONS.top.colors[0]) },
    uColB: { value: new THREE.Color(SECTIONS.top.colors[1]) },
    uColC: { value: new THREE.Color(SECTIONS.top.colors[2]) },
  };
  const blob = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.1, lowPower ? 22 : 34),
    new THREE.ShaderMaterial({
      uniforms: blobUniforms,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uAmp;
        uniform float uFreq;
        varying vec3 vView;
        varying float vNoise;
        ${NOISE}
        void main() {
          vec3 n = normalize(position);
          float t = uTime * 0.22;
          float d = snoise(n * uFreq + vec3(t, t * 0.8, -t)) * 0.65
                  + snoise(n * uFreq * 2.3 - vec3(t * 1.4)) * 0.35;
          vNoise = d;
          vec3 p = position + normal * d * uAmp;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vView = mv.xyz;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColA;
        uniform vec3 uColB;
        uniform vec3 uColC;
        uniform float uTime;
        varying vec3 vView;
        varying float vNoise;
        void main() {
          vec3 N = normalize(cross(dFdx(vView), dFdy(vView)));
          vec3 V = normalize(-vView);
          float ndv = clamp(dot(N, V), 0.0, 1.0);
          float fres = pow(1.0 - ndv, 2.4);
          vec3 base = mix(uColA, uColB, smoothstep(-0.55, 0.55, vNoise));
          float bands = 0.5 + 0.5 * sin(vNoise * 7.0 + uTime * 0.7);
          base = mix(base, uColC, bands * 0.28);
          vec3 L = normalize(vec3(0.45, 0.75, 0.55));
          float diff = 0.55 + 0.45 * max(dot(N, L), 0.0);
          vec3 H = normalize(L + V);
          float spec = pow(max(dot(N, H), 0.0), 56.0);
          vec3 col = base * diff + vec3(spec) * 0.8 + fres * uColC * 0.6;
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }`,
    })
  );
  core.add(blob);

  const shellGeo = new THREE.IcosahedronGeometry(1.9, 1);
  const shell = new THREE.LineSegments(
    new THREE.EdgesGeometry(shellGeo),
    new THREE.LineBasicMaterial({ color: '#7c3aed', transparent: true, opacity: 0.22, depthWrite: false })
  );
  const nodePositions = [];
  const seen = new Set();
  const sp = shellGeo.attributes.position;
  for (let i = 0; i < sp.count; i++) {
    const key = `${sp.getX(i).toFixed(3)},${sp.getY(i).toFixed(3)},${sp.getZ(i).toFixed(3)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    nodePositions.push(sp.getX(i), sp.getY(i), sp.getZ(i));
  }
  const nodesGeo = new THREE.BufferGeometry();
  nodesGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
  shell.add(
    new THREE.Points(
      nodesGeo,
      new THREE.PointsMaterial({
        size: 0.14,
        map: glow,
        color: '#7c3aed',
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      })
    )
  );
  core.add(shell);

  const orbits = [
    { r: 2.25, tilt: [1.1, 0.3], speed: 0.9, color: '#7c3aed' },
    { r: 2.45, tilt: [-0.5, -0.9], speed: -0.65, color: '#0d9488' },
    { r: 2.05, tilt: [0.2, 1.3], speed: 1.15, color: '#db2777' },
  ].map((o, i) => {
    const group = new THREE.Group();
    group.rotation.set(o.tilt[0], 0, o.tilt[1]);
    const pts = [];
    for (let k = 0; k <= 200; k++) {
      const a = (k / 200) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * o.r, 0, Math.sin(a) * o.r));
    }
    group.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: o.color, transparent: true, opacity: 0.26, depthWrite: false })
      )
    );
    const electron = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), new THREE.MeshBasicMaterial({ color: o.color }));
    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: glow, color: o.color, transparent: true, opacity: 0.45, depthWrite: false })
    );
    halo.scale.setScalar(0.5);
    electron.add(halo);
    group.add(electron);
    core.add(group);
    return { ...o, electron, angle: i * 2.1 };
  });

  const ringTex = ringTexture(renderer.capabilities.getMaxAnisotropy());
  const ringGeo = new THREE.CylinderGeometry(RING_RADIUS, RING_RADIUS, 0.54, 200, 1, true);
  const ringGroup = new THREE.Group();
  ringGroup.rotation.set(0.32, 0, -0.16);
  const ringBack = new THREE.Mesh(
    ringGeo,
    new THREE.MeshBasicMaterial({ map: ringTex, color: '#7c3aed', transparent: true, opacity: 0.14, side: THREE.BackSide, depthWrite: false })
  );
  const ringFront = new THREE.Mesh(
    ringGeo,
    new THREE.MeshBasicMaterial({ map: ringTex, color: '#1e1b4b', transparent: true, opacity: 0.86, side: THREE.FrontSide, depthWrite: false })
  );
  ringBack.renderOrder = 1;
  ringFront.renderOrder = 3;
  ringGroup.add(ringBack, ringFront);
  core.add(ringGroup);

  /* ---------------- particle field ---------------- */
  const COUNT = lowPower ? 800 : 1600;
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const size = new Float32Array(COUNT);
  const phase = new Float32Array(COUNT);
  const palette = ['#8b5cf6', '#14b8a6', '#ec4899', '#60a5fa', '#a78bfa'].map((c) => new THREE.Color(c));
  for (let i = 0; i < COUNT; i++) {
    const r = 9 + Math.pow(Math.random(), 0.65) * 38;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.cos(ph) * 0.8;
    pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    const c = palette[(Math.random() * palette.length) | 0];
    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
    size[i] = 0.6 + Math.random() * 2.2;
    phase[i] = Math.random() * Math.PI * 2;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
  pGeo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  pGeo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
  const pUniforms = { uTime: { value: 0 }, uPR: { value: dpr } };
  const particles = new THREE.Points(
    pGeo,
    new THREE.ShaderMaterial({
      uniforms: pUniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: /* glsl */ `
        attribute float aSize;
        attribute float aPhase;
        attribute vec3 aColor;
        uniform float uTime;
        uniform float uPR;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          vAlpha = 0.55 + 0.45 * sin(uTime * 1.3 + aPhase);
          vColor = aColor;
          gl_PointSize = min(aSize * uPR * (30.0 / max(-mv.z, 0.1)), 20.0 * uPR);
        }`,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d);
          a *= a;
          gl_FragColor = vec4(vColor, a * vAlpha * 0.55);
          #include <colorspace_fragment>
        }`,
    })
  );
  scene.add(particles);

  /* ---------------- circuit-grid floor ---------------- */
  const floorUniforms = {
    uTime: { value: 0 },
    uTravel: { value: 0 },
    uOpacity: { value: 0.55 },
    uColA: { value: new THREE.Color('#8b5cf6') },
    uColB: { value: new THREE.Color('#14b8a6') },
  };
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 90),
    new THREE.ShaderMaterial({
      uniforms: floorUniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: /* glsl */ `
        varying vec3 vW;
        void main() {
          vec4 w = modelMatrix * vec4(position, 1.0);
          vW = w.xyz;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform float uTravel;
        uniform float uOpacity;
        uniform vec3 uColA;
        uniform vec3 uColB;
        varying vec3 vW;
        float gridLine(vec2 p) {
          vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
          return 1.0 - min(min(g.x, g.y), 1.0);
        }
        void main() {
          vec2 p = vW.xz;
          p.y -= uTravel;
          float minor = gridLine(p * 0.5);
          float major = gridLine(p * 0.125);
          float r = length(vW.xz - vec2(0.0, 2.0));
          float fade = smoothstep(34.0, 5.0, r);
          float ring = fract(r * 0.045 - uTime * 0.07);
          float wave = smoothstep(0.86, 0.99, ring) * (1.0 - smoothstep(0.99, 1.0, ring));
          vec3 col = mix(uColA, uColB, smoothstep(-16.0, 16.0, vW.x));
          float a = (minor * 0.16 + major * 0.45 + wave * (minor + major) * 0.9) * fade * uOpacity;
          gl_FragColor = vec4(col, a);
          #include <colorspace_fragment>
        }`,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -3.6;
  scene.add(floor);

  /* ---------------- floating objects (parallax with scroll) ---------------- */
  const floaters = new THREE.Group();
  scene.add(floaters);
  const TRAVEL = 30;
  const defs = [
    { type: 'chip', p: [10, 4.2, -8] },
    { type: 'octa', p: [-10.4, -4.6, -8], c: '#7c3aed' },
    { type: 'torus', p: [-10, -7.5, -8] },
    { type: 'chip', p: [10.2, -10.5, -8] },
    { type: 'octa', p: [-10.4, -14, -8], c: '#0d9488' },
    { type: 'torus', p: [10, -17.5, -8] },
    { type: 'chip', p: [-10.2, -21, -8] },
    { type: 'octa', p: [10.4, -24.5, -8], c: '#db2777' },
    { type: 'torus', p: [-10, -28, -8] },
    { type: 'chip', p: [10.2, -31.5, -8] },
  ];
  const floatItems = defs.map((d, i) => {
    const obj = d.type === 'chip' ? makeChip() : d.type === 'octa' ? makeOcta(d.c) : makeTorus();
    obj.position.set(...d.p);
    obj.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    obj.scale.setScalar(1.35);
    floaters.add(obj);
    return {
      obj,
      baseX: d.p[0],
      baseY: d.p[1],
      rx: 0.15 + Math.random() * 0.25,
      ry: 0.2 + Math.random() * 0.3,
      bob: 0.5 + Math.random() * 0.5,
      phase: i * 1.3,
    };
  });

  /* ---------------- state ---------------- */
  const cur = { x: 0, y: 0, s: 1, amp: 0.22 };
  const target = {
    x: 0,
    y: 0,
    s: 1,
    amp: 0.22,
    colA: new THREE.Color(SECTIONS.top.colors[0]),
    colB: new THREE.Color(SECTIONS.top.colors[1]),
    colC: new THREE.Color(SECTIONS.top.colors[2]),
  };
  let section = 'top';
  let scrollTarget = 0;
  let scrollSmooth = 0;
  let spin = 0;
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  let first = true;

  function viewHalfExtents() {
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    return { halfW: halfH * camera.aspect, halfH };
  }

  function applySection(id) {
    const k = SECTIONS[id] || SECTIONS.top;
    const narrow = window.innerWidth <= 1080;
    const [sx, sy, frac] = narrow ? k.m : k.d;
    const { halfW, halfH } = viewHalfExtents();
    target.x = (sx - 0.5) * 2 * halfW;
    target.y = (0.5 - sy) * 2 * halfH;
    target.s = (frac * Math.min(2 * halfW, 2 * halfH)) / (RING_RADIUS * 2);
    target.amp = k.amp;
    target.colA.set(k.colors[0]);
    target.colB.set(k.colors[1]);
    target.colC.set(k.colors[2]);
    if (first) {
      cur.x = target.x;
      cur.y = target.y;
      cur.s = target.s * 0.6;
      cur.amp = target.amp;
      first = false;
    }
  }

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = camera.aspect < 0.85 ? 55 : 42;
    camera.updateProjectionMatrix();
    const xScale = THREE.MathUtils.clamp(camera.aspect / 1.78, 0.45, 1);
    floatItems.forEach((f) => (f.obj.position.x = f.baseX * xScale));
    applySection(section);
  }
  resize();
  window.addEventListener('resize', resize);

  if (!coarse) {
    window.addEventListener(
      'pointermove',
      (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      },
      { passive: true }
    );
  }

  /* ---------------- loop ---------------- */
  const timer = new THREE.Timer();
  timer.connect(document);
  const speed = reduceMotion ? 0.15 : 1;
  let elapsed = 0;
  let frames = 0;
  let frameTime = 0;
  let enabled = true;

  function frame(time) {
    timer.update(time);
    let dt = timer.getDelta();
    if (dt > 0.1) dt = 0.1;
    elapsed += dt * speed;

    // adaptive resolution: drop pixel ratio if the device struggles
    frames++;
    frameTime += dt;
    if (frames === 90) {
      if (frameTime / frames > 1 / 38 && dpr > 0.8) {
        dpr = Math.max(0.75, dpr - 0.25);
        renderer.setPixelRatio(dpr);
        pUniforms.uPR.value = dpr;
        resize();
      }
      frames = 0;
      frameTime = 0;
    }

    const k = 1 - Math.exp(-dt * 2.2);
    cur.x += (target.x - cur.x) * k;
    cur.y += (target.y - cur.y) * k;
    cur.s += (target.s - cur.s) * k;
    cur.amp += (target.amp - cur.amp) * k;
    blobUniforms.uColA.value.lerp(target.colA, k);
    blobUniforms.uColB.value.lerp(target.colB, k);
    blobUniforms.uColC.value.lerp(target.colC, k);
    floorUniforms.uColA.value.lerp(target.colA, k * 0.5);
    floorUniforms.uColB.value.lerp(target.colB, k * 0.5);

    scrollSmooth += (scrollTarget - scrollSmooth) * (1 - Math.exp(-dt * 4));
    spin *= Math.exp(-dt * 1.8);

    core.position.set(cur.x, cur.y, 0);
    core.scale.setScalar(cur.s);
    blobUniforms.uTime.value = elapsed;
    blobUniforms.uAmp.value = cur.amp + Math.abs(spin) * 0.12;
    blob.rotation.y += dt * (0.18 + spin) * speed;
    blob.rotation.x = Math.sin(elapsed * 0.3) * 0.25;
    shell.rotation.y -= dt * (0.1 + spin * 0.6) * speed;
    shell.rotation.z += dt * 0.04 * speed;
    ringBack.rotation.y = ringFront.rotation.y -= dt * (0.22 + spin * 1.8) * speed;
    orbits.forEach((o) => {
      o.angle += dt * o.speed * (1 + Math.abs(spin) * 3) * speed;
      o.electron.position.set(Math.cos(o.angle) * o.r, 0, Math.sin(o.angle) * o.r);
    });

    pUniforms.uTime.value = elapsed;
    particles.rotation.y = elapsed * 0.012 + scrollSmooth * 0.9;
    particles.rotation.x = scrollSmooth * 0.25;

    floaters.position.y = scrollSmooth * TRAVEL;
    floatItems.forEach((f) => {
      f.obj.rotation.x += dt * f.rx * speed;
      f.obj.rotation.y += dt * f.ry * speed;
      f.obj.position.y = f.baseY + Math.sin(elapsed * f.bob + f.phase) * 0.25;
    });

    floorUniforms.uTime.value = elapsed;
    floorUniforms.uTravel.value = scrollSmooth * 60 + elapsed * 0.6;

    const mk = 1 - Math.exp(-dt * 2.5);
    mouse.sx += (mouse.x - mouse.sx) * mk;
    mouse.sy += (mouse.y - mouse.sy) * mk;
    camera.position.x = mouse.sx * 0.5;
    camera.position.y = mouse.sy * 0.35;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(frame);

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    renderer.setAnimationLoop(null);
    document.documentElement.classList.add('no-webgl');
  });

  return {
    setSection(id) {
      if (!SECTIONS[id] || id === section) return;
      section = id;
      applySection(id);
    },
    setScroll(progress, velocity) {
      scrollTarget = progress;
      if (reduceMotion) return;
      const s = THREE.MathUtils.clamp(velocity / 2200, -1.6, 1.6);
      if (Math.abs(s) > Math.abs(spin)) spin = s;
    },
    setEnabled(on) {
      enabled = on;
      canvas.classList.toggle('is-off', !on);
      if (on) {
        timer.reset?.();
        renderer.setAnimationLoop(frame);
      } else {
        renderer.setAnimationLoop(null);
      }
    },
    get enabled() {
      return enabled;
    },
  };
}
