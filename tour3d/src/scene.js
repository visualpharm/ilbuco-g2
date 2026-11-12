// Il Buco · v8: весь дом в настоящих размерах. Плановые координаты в метрах: (0, 0) — наружный юго-западный угол бетона, X на восток, Y на север.
// Размеры: рабочий альбом стройки 10.2024 (планы подвала, planta baja, 1-го и 2-го этажей, четыре фасада, разрез) — по нему дом построен;
// сверено с видео-обходом и фото. Проект 2022 («Bucho var 5») отличается от построенного дома и больше не источник.
// Материалы и мебель: фото готового дома и видео-обход.
// этажи: группы на своей отметке; координаты внутри — от пола этажа. Отметки по разрезу: гараж −3,0, 1-й этаж +3,5, 2-й +6,5, крыша +9,5
const FL = { sub: -3.0, pb: 0, p1: 3.5, p2: 6.5, roof: 9.5 };
const SLT = 0.32;          // толщина плит перекрытий
const H = FL.p1 - SLT;     // чистая высота planta baja
const TW = 0.35;           // наружные бетонные стены
const ST = 0.14;           // перегородки
const floors = {};
let G = null, WH = H;   // текущая группа и высота стен этажа
function floor(name) { if (!floors[name]) { const g = new THREE.Group(); g.position.y = FL[name]; scene.add(g); floors[name] = g; } G = floors[name]; }

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('stage').appendChild(renderer.domElement);

// небо
(function () {
  const c = document.createElement('canvas'); c.width = 4; c.height = 256;
  const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, '#9fc6e4'); gr.addColorStop(0.55, '#d9e8ef'); gr.addColorStop(1, '#f4efe2');
  g.fillStyle = gr; g.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; scene.background = t;
})();
scene.fog = new THREE.Fog(0xe4ecee, 55, 130);

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 300);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2 - 0.02;
controls.minDistance = 6;
controls.maxDistance = 160;

scene.add(new THREE.HemisphereLight(0xeaf3ff, 0x8a8068, 0.85));
const sun = new THREE.DirectionalLight(0xfff0d6, 1.35);
sun.position.set(-8, 34, 26);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -0.0004;
Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 100 });
scene.add(sun);

// ---------- процедурные текстуры (по фото: плитка «под дерево», шалёвочный бетон, настил)
function canvasTex(size, draw, world) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.encoding = THREE.sRGBEncoding; t.anisotropy = 8;
  t.userData.size = world; // сколько метров покрывает один тайл
  return t;
}
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function planks(g, S, rows, base, vary, lines) {
  const rh = S / rows;
  for (let r = 0; r < rows; r++) {
    let x = -rnd() * S * 0.6;
    while (x < S) {
      const len = S * (0.45 + rnd() * 0.4);
      const k = (rnd() - 0.5) * vary;
      g.fillStyle = `rgb(${base[0] + k},${base[1] + k * 0.9},${base[2] + k * 0.8})`;
      g.fillRect(x, r * rh, len, rh);
      g.strokeStyle = 'rgba(70,55,40,0.28)'; g.lineWidth = 2; g.strokeRect(x, r * rh, len, rh);
      g.strokeStyle = 'rgba(80,60,40,0.10)'; g.lineWidth = 1;
      for (let i = 0; i < lines; i++) { const y = r * rh + rnd() * rh; g.beginPath(); g.moveTo(x, y); g.lineTo(x + len, y + (rnd() - 0.5) * 3); g.stroke(); }
      x += len;
    }
  }
}
const tex = {
  floor: canvasTex(512, (g, S) => planks(g, S, 6, [188, 170, 146], 26, 7), 1.2),     // светлая плитка «под дерево», серо-коричневая
  deck: canvasTex(512, (g, S) => { g.fillStyle = '#8c8e91'; g.fillRect(0, 0, S, S); const n = 4, c = S / n; for (let r = 0; r < n; r++) for (let q = 0; q < n; q++) { const k = Math.floor(rnd() * 16) - 8; g.fillStyle = `rgb(${140 + k},${142 + k},${145 + k})`; g.fillRect(q * c + 2, r * c + 2, c - 4, c - 4); } for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(${rnd() > 0.5 ? '255,255,255' : '40,40,40'},0.05)`; g.fillRect(rnd() * S, rnd() * S, 1 + rnd() * 3, 1 + rnd() * 3); } g.strokeStyle = 'rgba(50,50,52,0.55)'; g.lineWidth = 3; for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * c, 0); g.lineTo(i * c, S); g.stroke(); g.beginPath(); g.moveTo(0, i * c); g.lineTo(S, i * c); g.stroke(); } }, 2.2),       // патио: серая каменная плитка (по видео-обходу)
  concrete: canvasTex(512, (g, S) => {                                                // шалёвочный бетон
    g.fillStyle = '#aaa8a2'; g.fillRect(0, 0, S, S);
    for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${rnd() > 0.5 ? '255,255,255' : '60,60,60'},0.05)`; g.fillRect(rnd() * S, rnd() * S, 2 + rnd() * 40, 1 + rnd() * 3); }
    for (let i = 0; i < 8; i++) { g.fillStyle = 'rgba(40,40,40,0.28)'; g.fillRect(0, i * S / 8, S, 2); }
  }, 1.2),
  tile: canvasTex(512, (g, S) => {                                                    // крупная серая плитка санузлов
    g.fillStyle = '#c4c1ba'; g.fillRect(0, 0, S, S);
    for (let i = 0; i < 4; i++) { g.fillStyle = `rgba(${rnd() > 0.5 ? '255,255,255' : '90,90,90'},0.06)`; g.fillRect((i % 2) * S / 2, (i >> 1) * S / 2, S / 2, S / 2); }
    g.fillStyle = 'rgba(80,80,80,0.5)'; g.fillRect(0, 0, S, 3); g.fillRect(0, 0, 3, S); g.fillRect(0, S / 2, S, 3); g.fillRect(S / 2, 0, 3, S);
  }, 1.2),
  board: canvasTex(512, (g, S) => {                                                   // бетон фасадов: следы вертикальных досок опалубки, швы заливки (по фото)
    const n = 16, bw = S / n;
    for (let i = 0; i < n; i++) {
      const k = Math.floor((rnd() - 0.5) * 14);
      g.fillStyle = `rgb(${182 + k},${180 + k},${174 + k})`; g.fillRect(i * bw, 0, bw + 1, S);
      for (let j = 0; j < 22; j++) { g.fillStyle = `rgba(${rnd() > 0.5 ? '255,255,255' : '70,70,70'},0.05)`; g.fillRect(i * bw + rnd() * bw, rnd() * S, 1 + rnd() * 2, 20 + rnd() * 120); }
      g.fillStyle = 'rgba(60,60,60,0.2)'; g.fillRect(i * bw, 0, 1.5, S);
    }
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${rnd() > 0.5 ? '255,255,255' : '50,50,50'},0.05)`; g.fillRect(rnd() * S, rnd() * S, 2 + rnd() * 5, 2 + rnd() * 5); }
    g.fillStyle = 'rgba(60,60,60,0.1)'; g.fillRect(0, 0, S, 2); g.fillRect(0, S / 2, S, 2);
  }, 2.4),
  grass: canvasTex(512, (g, S) => {
    g.fillStyle = '#7fa65f'; g.fillRect(0, 0, S, S);
    for (let i = 0; i < 6000; i++) { g.fillStyle = `rgba(${rnd() > 0.5 ? '120,160,80' : '60,100,50'},0.35)`; g.fillRect(rnd() * S, rnd() * S, 3, 3); }
  }, 6),
};
function tm(t, w, d, o = {}) {
  const c = t.clone(); c.needsUpdate = true; c.repeat.set(w / t.userData.size, d / t.userData.size);
  return new THREE.MeshStandardMaterial(Object.assign({ map: c, roughness: 0.85 }, o));
}
const S = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8 }, o));
const SL = (c, o = {}) => S(new THREE.Color(c).convertSRGBToLinear(), o);   // цвет как на фото (sRGB): растения, мульча
const mat = {
  plaster: S(0xf3f1ec), concrete: (() => { const m = new THREE.MeshStandardMaterial({ map: tex.board, roughness: 0.95 }); m.userData.wuv = 2.4; return m; })(), oak: S(0xc9a06a, { roughness: 0.6 }), woodDark: S(0x6b4d32, { roughness: 0.7 }),
  rail: S(0xc08a4e, { roughness: 0.6 }), white: S(0xf6f5f2, { roughness: 0.5 }), black: SL(0x1e1f22, { roughness: 0.5 }),
  counter: S(0x15161a, { roughness: 0.25, metalness: 0.2 }), steel: S(0xc9ccce, { roughness: 0.35, metalness: 0.6 }),
  sofaGrey: SL(0x9c9ea1, { roughness: 1 }), sofaBlue: S(0x2f4f9a, { roughness: 0.95 }), bedGrey: S(0x8e96a3, { roughness: 1 }), bedHead: S(0x5a5d66, { roughness: 1 }),
  quilt: SL(0x44474f, { roughness: 1 }), towel: SL(0x948a85, { roughness: 1 }), blanket: S(0xc9762f, { roughness: 1 }), chairBlack: S(0x25272b, { roughness: 0.6 }), chairWhite: S(0xefeeea, { roughness: 0.5 }), wicker: SL(0x232427, { roughness: 0.9 }),
  glass: new THREE.MeshStandardMaterial({ color: 0xaad4e4, transparent: true, opacity: 0.34, roughness: 0.05, metalness: 0.0, side: THREE.DoubleSide, depthWrite: false }),
  tree: S(0x4f7f4f, { roughness: 1 }), treeDark: S(0x3c6745, { roughness: 1 }), trunk: S(0x7b5a3b, { roughness: 1 }),
};

// мягкая мебель — не «кирпичи»: у материалов с userData.soft бокс получает скруглённые рёбра этого радиуса (диваны, кровати, подушки, плетёная мебель, шторы)
Object.entries({ sofaGrey: 0.07, sofaBlue: 0.07, bedHead: 0.05, bedGrey: 0.03, quilt: 0.06, towel: 0.06, wicker: 0.04 }).forEach(([k, r]) => { mat[k].userData.soft = r; });
mat.linen = S(0xf6f5f2, { roughness: 0.9 }); mat.linen.userData.soft = 0.045;   // матрасы и подушки
function softGeo(w, h, d, r) {
  const g = new THREE.BoxGeometry(w, h, d, 4, 4, 4), p = g.attributes.position, n = g.attributes.normal, hs = [w / 2, h / 2, d / 2], v = [0, 0, 0], c = [0, 0, 0];
  for (let i = 0; i < p.count; i++) {
    v[0] = p.getX(i); v[1] = p.getY(i); v[2] = p.getZ(i);
    for (let a = 0; a < 3; a++) { const s = Math.sign(v[a]), t = Math.abs(v[a]) / hs[a]; c[a] = t > 0.25 ? s * (hs[a] - r) : 0; v[a] = t > 0.75 ? s * hs[a] : c[a]; }
    const dx = v[0] - c[0], dy = v[1] - c[1], dz = v[2] - c[2], l = Math.hypot(dx, dy, dz) || 1;
    p.setXYZ(i, c[0] + dx / l * r, c[1] + dy / l * r, c[2] + dz / l * r); n.setXYZ(i, dx / l, dy / l, dz / l);
  }
  return g;
}
// plan(x,y) -> world(x, z)
const P = (x, y) => [x, -y];
// текстура в метрах, а не «на грань»: у материалов с userData.wuv рисунок не тянется и совпадает на соседних кусках стены
function worldUV(g, m, x0, y0, x1, y1, h, z0) {
  const uv = g.attributes.uv, w = Math.abs(x1 - x0), d = Math.abs(y1 - y0), xa = Math.min(x0, x1), ya = Math.min(y0, y1);
  [[d, h, ya, z0], [d, h, -ya - d, z0], [w, d, xa, ya], [w, d, xa, ya], [w, h, xa, z0], [w, h, -xa - w, z0]].forEach(([su, sv, ou, ov], i) => {   // грани: +x, −x, +y, −y, +z, −z
    const s = (Array.isArray(m) ? m[i] : m).userData.wuv; if (!s) return;
    for (let k = i * 4; k < i * 4 + 4; k++) uv.setXY(k, (ou + uv.getX(k) * su) / s, (ov + uv.getY(k) * sv) / s);
  });
}
function box(x0, y0, x1, y1, h, m, z0 = 0, cast = true) {
  const w = Math.abs(x1 - x0), d = Math.abs(y1 - y0), r = !Array.isArray(m) && m.userData.soft ? Math.min(m.userData.soft, Math.min(w, h, d) * 0.4) : 0;
  const g = r >= 0.02 ? softGeo(w, h, d, r) : new THREE.BoxGeometry(w, h, d);
  if (Array.isArray(m) ? m.some(q => q.userData.wuv) : m.userData.wuv) worldUV(g, m, x0, y0, x1, y1, h, z0);
  const o = new THREE.Mesh(g, m);
  const [px, pz] = P((x0 + x1) / 2, (y0 + y1) / 2);
  o.position.set(px, z0 + h / 2, pz);
  o.castShadow = cast; o.receiveShadow = true;
  (G || scene).add(o);
  return o;
}
function cyl(x, y, r, h, m, z0 = 0, seg = 24) {
  const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), m);
  const [px, pz] = P(x, y); o.position.set(px, z0 + h / 2, pz); o.castShadow = o.receiveShadow = true; (G || scene).add(o); return o;
}
// плита с текстурой сверху
const slabMats = new Map();
function slabMat(t, o) {
  const k = t.uuid + JSON.stringify(o);
  if (!slabMats.has(k)) { const m = new THREE.MeshStandardMaterial(Object.assign({ map: t, roughness: 0.85 }, o)); m.userData.wuv = t.userData.size; slabMats.set(k, m); }
  return slabMats.get(k);
}
function slab(x0, y0, x1, y1, h, t, z0, o = {}) {
  const top = slabMat(t, o), side = mat.concrete;
  return box(x0, y0, x1, y1, h, [side, side, top, side, side, side], z0);
}
const wallX = (x, y0, y1, m = mat.plaster, t = ST, h = WH, z0 = 0) => box(x - t / 2, y0, x + t / 2, y1, h, m, z0);
const wallY = (y, x0, x1, m = mat.plaster, t = ST, h = WH, z0 = 0) => box(x0, y - t / 2, x1, y + t / 2, h, m, z0);
// стена с проёмами во всю высоту этажа WH; над проёмом — стена. ops: [от, до, тип, число створок, верх, импост, подоконник]; тип: w окно (подоконник 0,8),
// b окно с чёрной панелью под стеклом до пола (так снаружи выглядят все окна дома), v окно почти от пола до потолка, g остекление в пол,
// d деревянная дверь, i внутренняя дверь (белая, открытая), o проём без двери, q проём-«окно» без стекла.
// fo — сдвиг рамы и стекла от оси стены (у толстых стен рама стоит ближе к улице); ins — с какой стороны дом (+1 — в сторону роста
// координаты, −1 — убывания): наружная бетонная стена изнутри белая (по видео); 0 — бетон с обеих сторон
function wall(axis, pos, a0, a1, ops = [], m = mat.concrete, t = ST, fo = 0, ins = 0) {
  const X = axis === 'x';
  let mm = m;
  if (m === mat.concrete && ins) { mm = [m, m, m, m, m, m]; mm[X ? (ins > 0 ? 0 : 1) : (ins > 0 ? 5 : 4)] = mat.plaster; }
  const fp = pos + fo, FD = 0.045;   // плоскость и полутолщина рамы: рама утоплена в проём
  const seg = (s0, s1, z0, h) => { if (s1 - s0 > 0.001 && h > 0.001) (X ? box(pos - t / 2, s0, pos + t / 2, s1, h, mm, z0) : box(s0, pos - t / 2, s1, pos + t / 2, h, mm, z0)); };
  const bar = (s0, s1, z0, h) => { if (s1 - s0 > 0.001 && h > 0.001) (X ? box(fp - FD, s0, fp + FD, s1, h, mat.black, z0) : box(s0, fp - FD, s1, fp + FD, h, mat.black, z0)); };
  const pane = (s0, s1, z0, h) => (X ? box(fp - 0.012, s0, fp + 0.012, s1, h, mat.glass, z0, false) : box(s0, fp - 0.012, s1, fp + 0.012, h, mat.glass, z0, false));
  // рама — прямоугольная коробка строго в проёме: стойки во всю высоту, ригели между ними, углы без ступенек
  const frame = (f, to, z0, z1, parts, tr) => {
    const w = 0.05;
    bar(f, f + w, z0, z1 - z0); bar(to - w, to, z0, z1 - z0);
    bar(f + w, to - w, z1 - w, w); bar(f + w, to - w, z0, w);
    const cs = []; for (let q = 1; q < parts; q++) cs.push(f + (to - f) * q / parts);
    cs.forEach(c => bar(c - 0.02, c + 0.02, z0 + w, z1 - z0 - 2 * w));
    if (tr && tr > z0 + 0.3 && tr < z1 - 0.3) [f + w, ...cs, to - w].forEach((c, i, A) => { if (i) bar(A[i - 1] + (i > 1 ? 0.02 : 0), c - (i < A.length - 1 ? 0.02 : 0), tr - 0.02, 0.04); });   // горизонтальный импост между стойками
  };
  let cur = a0;
  ops.slice().sort((p, q) => p[0] - q[0]).forEach(([f, to, k, n, tp, tr, sl]) => {
    seg(cur, f, 0, WH); cur = to;
    const sill = sl != null ? sl : k === 'w' ? 0.8 : k === 'b' ? 0.9 : k === 'v' ? 0.25 : k === 'q' ? 0.95 : 0;
    const top = tp != null ? tp : k === 'v' || k === 'g' ? WH - 0.12 : k === 'i' || k === 'o' ? 2.1 : k === 'q' ? 2.25 : Math.min(2.4, WH - 0.25);
    seg(f, to, top, WH - top);                                                            // перемычка до потолка
    const parts = n > 0 ? n : Math.max(1, Math.round((to - f) / 1.2));
    if (k === 'b') {
      // проём до пола: наверху стекло, под ним в той же раме тёмная глухая панель; изнутри под окном — белая стена с подоконником (видео 3:59)
      (X ? box(fp - 0.03, f + 0.05, fp + 0.03, to - 0.05, sill, mat.panel, 0) : box(f + 0.05, fp - 0.03, to - 0.05, fp + 0.03, sill, mat.panel, 0));
      if (ins) { const i0 = fp + ins * 0.03, i1 = pos + ins * t / 2; (X ? box(i0, f, i1, to, sill, mat.plaster, 0) : box(f, i0, to, i1, sill, mat.plaster, 0)); }
      pane(f + 0.05, to - 0.05, sill, top - sill - 0.05);
      frame(f, to, 0, top, parts, sill);
      return;
    }
    if (sill > 0) seg(f, to, 0, sill);
    if (k === 'w' || k === 'v' || k === 'g') {
      pane(f + 0.05, to - 0.05, sill + 0.05, top - sill - 0.1);
      frame(f, to, sill, top, parts, tr != null ? tr : k === 'v' ? 0.95 : 0);
    } else if (k === 'd') {
      const dm = n === -2 ? mat.black : mat.rail;   // n = -2 — чёрная дверь
      (X ? box(pos - 0.04, f + 0.03, pos + 0.04, to - 0.03, top, dm, 0) : box(f + 0.03, pos - 0.04, to - 0.03, pos + 0.04, top, dm, 0));
      (X ? box(pos + 0.05, to - 0.14, pos + 0.07, to - 0.1, 0.03, mat.black, 0.9) : box(to - 0.14, pos + 0.05, to - 0.1, pos + 0.07, 0.03, mat.black, 0.9));
    } else if (k === 'i') {
      const w = to - f, sg = n === -1 ? -1 : 1;   // створка открыта на 90°; n = -1 — в другую сторону
      if (X) box(pos + sg * t / 2, f, pos + sg * (t / 2 + w), f + 0.04, top, mat.white, 0); else box(f, pos + sg * t / 2, f + 0.04, pos + sg * (t / 2 + w), top, mat.white, 0);
    }
  });
  seg(cur, a1, 0, WH);
}
// наружная стена по координате наружной грани: толщина TW, рама в 10 см от улицы. Стены вдоль Y идут на всю длину дома, вдоль X — между ними:
// углы без выемок и без уступов (Иван, 12.11: снаружи стены гладкие)
const outer = (axis, face, a0, a1, ops, ins, m = mat.concrete) => wall(axis, face + ins * TW / 2, a0, a1, ops, m, TW, -ins * (TW / 2 - 0.1), G === floors.sub ? 0 : ins);
// окна дома по альбому: W1/W2 — 0,9 м, стекло от 1,2 до 2,4; W3/W4 — 1,2 м, стекло от 0,9 до 2,4; под стеклом чёрная панель до пола
const W12 = a => [a, a + 0.9, 'b', 1, 2.4, null, 1.2], W34 = a => [a, a + 1.2, 'b', 1, 2.4, null, 0.9];
// угловое окно: стёкла двух стен сходятся на тонкой чёрной стойке (xf, yf — плоскости рам), над ней бетон до потолка
function cpost(xf, yf, xo, yo, top) { box(xf - 0.045, yf - 0.045, xf + 0.045, yf + 0.045, top, mat.black); box(xf, yf, xo, yo, WH - top, mat.concrete, top); }
// плита перекрытия с отверстием под лестницу
function deck(x0, y0, x1, y1, h, t, z0, hole) {
  if (!hole) return slab(x0, y0, x1, y1, h, t, z0);
  const [hx0, hy0, hx1, hy1] = hole;
  slab(x0, y0, x1, hy0, h, t, z0); slab(x0, hy1, x1, y1, h, t, z0);
  slab(x0, hy0, hx0, hy1, h, t, z0); slab(hx1, hy0, x1, hy1, h, t, z0);
}
// П-образная лестница (альбом: марши 1,20 + зазор + 1,20, площадка 1,6 м у восточной стены клетки): первый марш вдоль южной стены на восток,
// второй — вдоль северной на запад; приходит ровно на отметку следующего этажа. Так на всех этажах
const STAIR_LAND = 5.3, STAIR_END = 7.08, STAIR_TR = 0.30;
const stairH = rise => Math.round(rise / 0.165) >> 1;                        // ступеней в марше
const stairX0 = rise => STAIR_LAND - stairH(rise) * STAIR_TR;               // западный край маршей
const STAIR_HOLE = x0 => [x0, TW, STAIR_END, 2.93];                          // проём в перекрытии: над маршами и площадкой
function stairU(rise, { flip = false, x0 = stairX0(rise), end = STAIR_END, y0 = TW + 0.02, y1 = 2.9, m = mat.concrete } = {}) {
  const h = stairH(rise), n = 2 * h, r = rise / n, tr = (STAIR_LAND - x0) / h, ym = (y0 + y1) / 2;
  const A = flip ? [ym + 0.05, y1] : [y0, ym - 0.05], B = flip ? [y0, ym - 0.05] : [ym + 0.05, y1];
  const TH = 0.2;   // толщина марша и площадки
  const step = (xa, xb, ya, yb, top) => box(xa, ya, xb, yb, Math.min(top, r + TH), m, Math.max(0, top - r - TH));
  const soffit = (xa, xb, ya, yb, za, zb) => {   // наклонная плита под маршем
    const L = Math.hypot(xb - xa, zb - za), o = box(0, ya, L, yb, TH, m);
    o.position.x = (xa + xb) / 2; o.position.y = (za + zb) / 2 - TH / 2; o.rotation.z = Math.atan2(zb - za, xb - xa);
  };
  for (let i = 0; i < h; i++) step(x0 + i * tr, x0 + (i + 1) * tr, A[0], A[1], (i + 1) * r);
  soffit(x0, STAIR_LAND, A[0], A[1], 0, h * r - r);
  box(STAIR_LAND, y0, end, y1, TH, m, h * r - TH);                            // промежуточная площадка — плита
  const t2 = (STAIR_LAND - x0) / (h - 1);
  for (let i = 0; i < h - 1; i++) { const xa = STAIR_LAND - (i + 1) * t2; step(xa, xa + t2, B[0], B[1], (h + i + 1) * r); }
  soffit(STAIR_LAND, x0, B[0], B[1], h * r, rise - r);
  // деревянный поручень на тонких чёрных стойках с внутренней стороны маршей (по видео)
  const rail = (xa, xb, za, zb, y) => {
    const L = xb - xa, Z = zb - za, o = box(0, y - 0.025, Math.hypot(L, Z), y + 0.025, 0.045, mat.rail, 0, false);
    o.position.x = (xa + xb) / 2; o.position.y = (za + zb) / 2 + 0.92; o.rotation.z = Math.atan2(Z, L);
    for (let k = 0; k <= Math.ceil(L / 0.9); k++) { const x = xa + L * k / Math.ceil(L / 0.9), z = za + Z * k / Math.ceil(L / 0.9); box(x - 0.015, y - 0.015, x + 0.015, y + 0.015, 0.92, mat.black, z, false); }
  };
  rail(x0 + 0.1, STAIR_LAND, r, h * r, flip ? ym + 0.08 : ym - 0.08);
  rail(x0 + 0.1, STAIR_LAND, rise, h * r, flip ? ym - 0.08 : ym + 0.08);
}

tex.wood = canvasTex(512, (g, S) => planks(g, S, 8, [146, 108, 76], 30, 5), 1.6);         // деревянный настил террас
Object.assign(mat, { curtain: S(0xd9c9a6, { roughness: 1 }), lightOak: SL(0xd6b88c, { roughness: 0.6 }), paint1: S(0x3f5268, { roughness: 0.4, metalness: 0.3 }),
  paint2: S(0xe9e9e6, { roughness: 0.4, metalness: 0.2 }), glassDark: S(0x2c3238, { roughness: 0.2 }), panel: S(0x17191c, { roughness: 0.18, metalness: 0.35 }), soil: S(0x4f3a2a, { roughness: 1 }), rug: S(0xd8cfbf, { roughness: 1 }), red: S(0xc4211c, { roughness: 0.45 }), brick: S(0xb0654a, { roughness: 0.9 }), grassDry: S(0xa8a463, { roughness: 1 }), lamp: S(0xf3e6c8, { roughness: 0.6, emissive: 0x5a4a2a }), plant: SL(0x5a8a3c, { roughness: 1 }), plantDark: SL(0x3d6a2e, { roughness: 1 }) });
// стул по фото: круглое сиденье-чаша, гнутая спинка, четыре расставленные ножки. rot = 0 — спинка на север
const dsides = new Map(), dside = m => { if (!dsides.has(m)) { const c = m.clone(); c.side = THREE.DoubleSide; dsides.set(m, c); } return dsides.get(m); };
const chairGeo = { seat: new THREE.CylinderGeometry(0.23, 0.2, 0.06, 14), back: new THREE.CylinderGeometry(0.25, 0.22, 0.36, 10, 1, true, Math.PI - 0.95, 1.9), leg: new THREE.CylinderGeometry(0.014, 0.011, 0.44, 6) };
function chair(x, y, mat0, rot) {
  const g = new THREE.Group(); const [px, pz] = P(x, y); g.position.set(px, 0, pz); g.rotation.y = rot;
  const seat = new THREE.Mesh(chairGeo.seat, mat0); seat.position.y = 0.44; g.add(seat);
  const back = new THREE.Mesh(chairGeo.back, dside(mat0)); back.position.y = 0.66; g.add(back);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    const l = new THREE.Mesh(chairGeo.leg, mat0 === mat.wicker ? mat.black : mat.oak); l.position.set(sx * 0.17, 0.215, sz * 0.17); l.rotation.set(-sz * 0.12, 0, sx * 0.12); g.add(l);
  });
  g.traverse(o => { o.castShadow = true; o.receiveShadow = true; }); (G || scene).add(g);
}
// стулья стоят вокруг стола, а не в нём: сиденье целиком снаружи кромки, спинка — от стола
const CH = 0.27;   // от кромки стола до оси стула
function roundTable(x, y, r, chairs, chairMat) {
  cyl(x, y, r, 0.035, mat.white, 0.715, 32); cyl(x, y, 0.045, 0.7, mat.steel, 0.015, 12); cyl(x, y, r * 0.55, 0.015, mat.steel, 0, 24);
  for (let i = 0; i < chairs; i++) {
    const a = (i / chairs) * Math.PI * 2 + 0.4, d = r + CH;
    chair(x + Math.cos(a) * d, y + Math.sin(a) * d, chairMat, Math.atan2(-Math.cos(a), Math.sin(a)));
  }
}
// прямоугольный стол вдоль X: столешница, царга, четыре ножки; стулья: по n с длинных сторон и по одному с торцов
function longTable(x0, y0, x1, y1, n, top, cm, ends = true) {
  box(x0, y0, x1, y1, 0.045, top, 0.705);
  [[x0 + 0.1, y0 + 0.1, x1 - 0.1, y0 + 0.125], [x0 + 0.1, y1 - 0.125, x1 - 0.1, y1 - 0.1], [x0 + 0.1, y0 + 0.1, x0 + 0.125, y1 - 0.1], [x1 - 0.125, y0 + 0.1, x1 - 0.1, y1 - 0.1]].forEach(b => box(...b, 0.08, top, 0.625));
  [[x0 + 0.08, y0 + 0.08], [x1 - 0.14, y0 + 0.08], [x0 + 0.08, y1 - 0.14], [x1 - 0.14, y1 - 0.14]].forEach(([x, y]) => box(x, y, x + 0.06, y + 0.06, 0.705, top));
  for (let i = 0; i < n; i++) { const x = x0 + (x1 - x0) * (i + 0.5) / n; chair(x, y1 + CH, cm, 0); chair(x, y0 - CH, cm, Math.PI); }
  if (ends) { chair(x0 - CH, (y0 + y1) / 2, cm, 0.5 * Math.PI); chair(x1 + CH, (y0 + y1) / 2, cm, 1.5 * Math.PI); }
}
mat.chairGrey = S(0x5f6f7e, { roughness: 0.9 });   // серо-голубые стулья (фото «cocina»)
const tubMat = new THREE.MeshStandardMaterial({ color: 0x1d1e21, roughness: 0.85, side: THREE.DoubleSide });
function tubChair(x, y, rot) {
  const g = new THREE.Group(); const [px, pz] = P(x, y); g.position.set(px, 0, pz); g.rotation.y = rot;
  const seg = 28, open = 1.15;                                         // спереди вырез: подлокотники ниже спинки
  const shell = new THREE.CylinderGeometry(0.4, 0.36, 1, seg, 1, true, open / 2, Math.PI * 2 - open);
  const p = shell.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const a = Math.atan2(p.getX(i), p.getZ(i));                        // 0 = спереди (+z)… π = спинка
    const top = 0.5 + 0.3 * Math.pow(Math.abs(a) / Math.PI, 1.5);
    p.setY(i, p.getY(i) > 0 ? top : 0.4);
  }
  shell.computeVertexNormals();
  const m = tubMat;
  const s = new THREE.Mesh(shell, m); g.add(s);
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.05, seg), m); seat.position.y = 0.42; g.add(seat);
  // низ — сплошная «бочка» до пола с арочными вырезами между четырьмя ножками
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.4, 0.26, seg, 1, true), m); drum.position.y = 0.29; g.add(drum);
  [0.785, 2.356, 3.927, 5.498].forEach(a => {
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.16, 0.06), m);
    l.position.set(Math.sin(a) * 0.38, 0.08, Math.cos(a) * 0.38); l.rotation.y = a; g.add(l);
  });
  g.traverse(o => { o.castShadow = true; o.receiveShadow = true; }); (G || scene).add(g);
}
const bconc = mat.concrete.clone();   // тот же шалёвочный бетон, но без белой штукатурки с внутренней стороны (стены балкона, парапеты)
const mulch = SL(0x3a2a1e, { roughness: 1 });
const flowerMats = [0xe8a0b4, 0xf4f1ea, 0xb79ad6, 0xf2c94c, 0xd2433a, 0xe0703a].map(c => SL(c, { roughness: 0.7 }));
const flowerGeo = new THREE.IcosahedronGeometry(0.045, 0);
function bush(x, y, r, z0 = 0, flowers = rnd() < 0.55) {   // круглый куст; у части — цветы
  const g = new THREE.Group(), [px, pz] = P(x, y);
  const o = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), rnd() > 0.5 ? mat.plant : mat.plantDark); o.scale.y = 0.8; o.castShadow = o.receiveShadow = true; g.add(o);
  if (flowers) { const fm = flowerMats[Math.floor(rnd() * flowerMats.length)]; for (let k = 0; k < 9; k++) { const a = rnd() * Math.PI * 2, b = rnd() * 1.2; const f = new THREE.Mesh(flowerGeo, fm); f.position.set(Math.cos(a) * Math.sin(b) * r, Math.cos(b) * r * 0.8, Math.sin(a) * Math.sin(b) * r); g.add(f); } }
  g.position.set(px, z0 + r * 0.6, pz); G.add(g); return g;
}
const bladeMats = [SL(0x7d8a3c, { roughness: 1 }), SL(0x4f8a3a, { roughness: 1 }), SL(0xa0904a, { roughness: 1 })];
const bladeGeo = new THREE.ConeGeometry(0.035, 1, 3); bladeGeo.translate(0, 0.5, 0);
function tuft(x, y, z0 = 0.04, k = 1) {   // пучок злаков: тонкие стебли веером; k — рост
  const g = new THREE.Group(), [px, pz] = P(x, y), m = bladeMats[Math.floor(rnd() * 3)], hh = (0.4 + rnd() * 0.35) * k;
  for (let k = 0; k < 9; k++) { const b = new THREE.Mesh(bladeGeo, m); b.scale.set(1, hh * (0.7 + rnd() * 0.4), 1); b.rotation.set((rnd() - 0.5) * 0.9, rnd() * 6.3, (rnd() - 0.5) * 0.9); b.castShadow = true; g.add(b); }
  g.position.set(px, z0, pz); G.add(g);
}
// агава: розетка жёстких заострённых листьев — так на плане террас обозначены растения, такие же на видео (Иван: «цветы не такую форму имеют»)
const agaveMats = [SL(0x7f9a7a, { roughness: 0.8 }), SL(0x6b7a4a, { roughness: 0.9 }), SL(0x5d8a4a, { roughness: 0.85 })];
const leafGeo = new THREE.ConeGeometry(0.07, 1, 4); leafGeo.translate(0, 0.5, 0);
function agave(x, y, r = 0.35, z0 = 0.04, green = 0) {
  const g = new THREE.Group(), [px, pz] = P(x, y), m = green ? agaveMats[2] : agaveMats[Math.floor(rnd() * 2)], n = 14 + Math.floor(rnd() * 6);
  for (let k = 0; k < n; k++) {
    const l = new THREE.Mesh(leafGeo, m), inner = k < 5;
    l.scale.set(1 + r, r * (inner ? 0.75 : 1.0) * (0.85 + rnd() * 0.3), 0.35);
    l.rotation.set(inner ? 0.35 + rnd() * 0.3 : 0.85 + rnd() * 0.5, k * 2.4 + rnd() * 0.3, 0, 'YXZ');
    l.castShadow = true; g.add(l);
  }
  g.position.set(px, z0, pz); G.add(g); return g;
}
// тонкое ограждение (по видео): стойки 35 мм, стальные тросы, деревянный поручень
function railing(x0, y0, x1, y1, h = 1.0, z0 = 0) {
  const L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.round(L / 1.5)), X = Math.abs(x1 - x0) > Math.abs(y1 - y0);
  for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n; box(x - 0.018, y - 0.018, x + 0.018, y + 0.018, h - 0.045, mat.black, z0, false); }
  for (let k = 1; k <= 5; k++) { const z = z0 + (h - 0.1) * k / 6; X ? box(x0, y0 - 0.004, x1, y0 + 0.004, 0.008, mat.steel, z, false) : box(x0 - 0.004, y0, x0 + 0.004, y1, 0.008, mat.steel, z, false); }
  X ? box(x0 - 0.03, y0 - 0.035, x1 + 0.03, y0 + 0.035, 0.045, mat.rail, z0 + h - 0.045, false) : box(x0 - 0.035, y0 - 0.03, x0 + 0.035, y1 + 0.03, 0.045, mat.rail, z0 + h - 0.045, false);
}
// стеклянное ограждение с деревянным поручнем (балкон 1-го этажа, по видео)
function glassRail(x0, y0, x1, y1, h = 1.0) {
  const X = Math.abs(x1 - x0) > Math.abs(y1 - y0);
  X ? box(x0, y0 - 0.01, x1, y0 + 0.01, h - 0.08, mat.glass, 0.05, false) : box(x0 - 0.01, y0, x0 + 0.01, y1, h - 0.08, mat.glass, 0.05, false);
  X ? box(x0, y0 - 0.035, x1, y0 + 0.035, 0.045, mat.rail, h - 0.03, false) : box(x0 - 0.035, y0, x0 + 0.035, y1, 0.045, mat.rail, h - 0.03, false);
  X ? box(x0, y0 - 0.03, x1, y0 + 0.03, 0.05, mat.black, 0, false) : box(x0 - 0.03, y0, x0 + 0.03, y1, 0.05, mat.black, 0, false);
}
// плавный контур: открытая кривая через точки и прямой возврат к началу
const curvePts = pts => new THREE.CatmullRomCurve3(pts.map(([x, y]) => new THREE.Vector3(x, y, 0)), false, 'centripetal').getPoints(48).map(v => [v.x, v.y]);
function flat(pts, h, m, z0 = 0) {
  const sh = new THREE.Shape(); pts.forEach(([x, y], i) => i ? sh.lineTo(x, y) : sh.moveTo(x, y));
  const o = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: false }), m);
  o.rotation.x = -Math.PI / 2; o.position.y = z0; o.castShadow = o.receiveShadow = true; G.add(o); return o;
}
const inPoly = (pts, x, y) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
// настилы балкона и террасы — светлая сосна (фото сайта и видео): доски рядами со сдвигом; NS — доски с севера на юг
const pineTex = canvasTex(512, (g, S) => planks(g, S, 10, [198, 164, 116], 20, 7), 1.6);
const pineMat = rot => { const t = pineTex.clone(); t.needsUpdate = true; t.repeat.set(1 / 1.6, 1 / 1.6); t.rotation = rot; return new THREE.MeshStandardMaterial({ map: t, roughness: 0.8 }); };
const pineTop = pineMat(0), pineTopNS = pineMat(Math.PI / 2);
// редкие молодые злаки и небольшие агавы по контуру клумбы (по фото)
function scatter(poly, n, agP = 0.25, k = 0.7, z0 = 0.1) {
  const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  for (let i = 0, c = 0; i < n * 10 && c < n; i++) {
    const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0);
    if (!inPoly(poly, x, y)) continue;
    c++; rnd() < agP ? agave(x, y, 0.18 + rnd() * 0.14, z0) : tuft(x, y, z0, k);
  }
}
// грядки: земля по прямоугольнику, на ней злаки и кусты вне настила
function beds(x0, y0, x1, y1, skip, step = 0.55, sparse = 0.3, bushP = 0.3, k = 1) {
  box(x0, y0, x1, y1, 0.04, mulch, 0, false);
  for (let x = x0 + step / 2; x < x1; x += step) for (let y = y0 + step / 2; y < y1; y += step) {
    const px = x + (rnd() - 0.5) * step * 0.6, py = y + (rnd() - 0.5) * step * 0.6;
    if (skip.some(p => inPoly(p, px, py)) || rnd() < sparse) continue;
    rnd() >= bushP ? tuft(px, py, 0.04, k) : agave(px, py, 0.2 + rnd() * 0.15);
  }
}
// чёрная плетёная мебель: сиденье, спинка с одной стороны, подлокотники, серые подушки
function wicker(x0, y0, x1, y1, back, z0 = 0.07) {
  const b = 0.15, B = { n: [x0, y1 - b, x1, y1], s: [x0, y0, x1, y0 + b], e: [x1 - b, y0, x1, y1], w: [x0, y0, x0 + b, y1] }[back];
  box(x0, y0, x1, y1, 0.36, mat.wicker, z0); box(...B, 0.78, mat.wicker, z0);
  if (back === 'n' || back === 's') { box(x0, y0, x0 + b, y1, 0.62, mat.wicker, z0); box(x1 - b, y0, x1, y1, 0.62, mat.wicker, z0); }
  else { box(x0, y0, x1, y0 + b, 0.62, mat.wicker, z0); box(x0, y1 - b, x1, y1, 0.62, mat.wicker, z0); }
  box(x0 + b, y0 + b, x1 - b, y1 - b, 0.08, mat.bedHead, z0 + 0.36);
}
function car(x, y, paint) {
  box(x - 0.9, y - 2.2, x + 0.9, y + 2.2, 0.62, paint, 0.28);
  box(x - 0.8, y - 1.05, x + 0.8, y + 0.95, 0.5, mat.glassDark, 0.9);
  box(x - 0.78, y - 0.95, x + 0.78, y + 0.85, 0.06, paint, 1.4);
  [[-0.86, -1.4], [0.86, -1.4], [-0.86, 1.45], [0.86, 1.45]].forEach(([dx, dy]) => { const w = cyl(x + dx, y + dy, 0.33, 0.24, mat.black, 0.21, 14); w.rotation.z = Math.PI / 2; });
}
const sq = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
// кухня квартиры вдоль стены санузла: холодильник, тумбы с чёрной столешницей, мойка, варочная, белые навесные шкафы (альбом, видео 12:00)
function kitchenette(kx, c0, c1, fr0, fr1, sink, hob) {
  box(kx, fr0, kx + 0.64, fr1, 1.8, mat.white);
  box(kx, c0, kx + 0.64, c1, 0.88, mat.oak); box(kx, c0, kx + 0.67, c1, 0.04, mat.counter, 0.88);
  box(kx + 0.12, sink, kx + 0.52, sink + 0.5, 0.01, mat.steel, 0.925); box(kx + 0.1, hob, kx + 0.54, hob + 0.4, 0.01, mat.black, 0.925);
  box(kx, c0, kx + 0.35, c1, 0.7, mat.white, 1.55);
}
// двуспальная кровать с мягким изголовьем: head — у какой стены изголовье ('s' — южной, 'w' — западной)
function bed(x0, y0, x1, y1, head) {
  box(x0, y0, x1, y1, 0.4, mat.bedHead); box(x0 + 0.05, y0 + 0.05, x1 - 0.05, y1 - 0.05, 0.22, mat.linen, 0.4);
  if (head === 's') {
    box(x0 - 0.05, y0 - 0.14, x1 + 0.05, y0, 1.1, mat.bedHead);
    box(x0 + 0.05, y0 + 0.7, x1 - 0.05, y1 - 0.05, 0.05, mat.bedGrey, 0.62);
    const m = (x0 + x1) / 2; box(x0 + 0.15, y0 + 0.1, m - 0.1, y0 + 0.5, 0.1, mat.linen, 0.64); box(m + 0.1, y0 + 0.1, x1 - 0.15, y0 + 0.5, 0.1, mat.linen, 0.64);
  } else {
    box(x0 - 0.14, y0 - 0.05, x0, y1 + 0.05, 1.1, mat.bedHead);
    box(x0 + 0.7, y0 + 0.05, x1 - 0.05, y1 - 0.05, 0.05, mat.bedGrey, 0.62);
    const m = (y0 + y1) / 2; box(x0 + 0.1, y0 + 0.15, x0 + 0.5, m - 0.1, 0.1, mat.linen, 0.64); box(x0 + 0.1, m + 0.1, x0 + 0.5, y1 - 0.15, 0.1, mat.linen, 0.64);
  }
}
// односпальная кровать изголовьем к западной стене, без изголовья и тумб (Paraiso, фото paraiso7): тёмно-серое покрывало на всю кровать,
// одна подушка под ним у изголовья, свёрнутое серое полотенце поперёк кровати в ногах
function singleBed(x0, y0, x1, y1) {
  const z = 0.48, m = (y0 + y1) / 2;
  box(x0, y0, x1, y1, z, mat.quilt);
  box(x0 + 0.08, y0 + 0.14, x0 + 0.5, y1 - 0.14, 0.1, mat.quilt, z);
  box(x1 - 0.55, m - 0.2, x1 - 0.37, m + 0.2, 0.13, mat.towel, z);
}
const toilet = (x, y, dir) => {   // бачок у стены, чаша — в сторону dir: 'n', 's', 'e', 'w'
  const v = { n: [0, 1], s: [0, -1], e: [1, 0], w: [-1, 0] }[dir], q = [Math.abs(v[1]), Math.abs(v[0])];
  box(x - q[0] * 0.2 - Math.abs(v[0]) * 0.1, y - q[1] * 0.2 - Math.abs(v[1]) * 0.1, x + q[0] * 0.2 + Math.abs(v[0]) * 0.1, y + q[1] * 0.2 + Math.abs(v[1]) * 0.1, 0.75, mat.white);
  const cx = x + v[0] * 0.33, cy = y + v[1] * 0.33;
  box(cx - q[0] * 0.18 - Math.abs(v[0]) * 0.23, cy - q[1] * 0.18 - Math.abs(v[1]) * 0.23, cx + q[0] * 0.18 + Math.abs(v[0]) * 0.23, cy + q[1] * 0.18 + Math.abs(v[1]) * 0.23, 0.4, mat.white);
};
Object.assign(mat, { darkConc: SL(0x55575a, { roughness: 0.95 }), stone: SL(0xcfcbc0, { roughness: 0.95 }) });

// --- участок: газон с вырезом под въезд в гараж. По альбому и видео-обходу (0:14–0:48): ворота гаража стоят в стене подвала под залом,
// зал planta baja нависает над ними на 2,9 м, 1-й этаж — ещё на 2,5 м дальше; от ворот на север — открытая бетонная площадка и
// пологий подъём к улице между подпорными стенами. Над въездом нет ни травы, ни колонн (Иван, 12.11: «не тоннель, под траву не уходит»)
const RAMP = [0.2, 7.06, 12.62, 33.5];
{
  const sh = new THREE.Shape(); sh.absarc(7, 8, 46, 0, Math.PI * 2, false);
  const h = new THREE.Path(), a = RAMP[0] - 0.2, b = RAMP[1] + 0.2; h.moveTo(a, RAMP[2]); h.lineTo(a, RAMP[3]); h.lineTo(b, RAMP[3]); h.lineTo(b, RAMP[2]); h.lineTo(a, RAMP[2]);
  sh.holes.push(h);
  { const k = new THREE.Path(); k.moveTo(0.4, 0.4); k.lineTo(0.4, 2.95); k.lineTo(7.0, 2.95); k.lineTo(7.0, 0.4); k.lineTo(0.4, 0.4); sh.holes.push(k); }   // под лестничной клеткой травы нет: в проём пола виден марш в подвал
  const gm = tex.grass.clone(); gm.needsUpdate = true; gm.repeat.set(1 / 6, 1 / 6);
  var lawn = new THREE.Mesh(new THREE.ShapeGeometry(sh, 48), new THREE.MeshStandardMaterial({ map: gm, roughness: 1 }));
  lawn.rotation.x = -Math.PI / 2; lawn.position.y = -0.03; lawn.receiveShadow = true; scene.add(lawn);
}

// ================= ПОДВАЛ (−3,0): гараж, лестница, бойлерная; въезд с севера (альбом, лист подвала; видео) =================
floor('sub'); WH = -FL.sub - 0.2;
slab(-0.1, -0.1, 12.85, 12.72, 0.2, tex.concrete, -0.2);
outer('x', 0, 0, 12.62, [], 1); outer('x', 12.75, 0, 12.62, [], -1); outer('y', 0, TW, 12.75 - TW, [], 1);
const GATE = 2.6;   // высота ворот; над ними до плиты зала — полоса бетона
outer('y', 12.62, TW, 12.75 - TW, [[0.4, 6.9, 'o', 0, GATE]], -1);   // проём ворот: от пола подвала, внутреннего пандуса нет (Иван, 05.11)
// деревянные ворота гаража из вертикальных досок (по видео), утоплены в проём
box(0.43, 12.39, 6.87, 12.51, GATE, mat.rail, 0);
for (let x = 0.5; x < 6.82; x += 0.16) box(x, 12.51, x + 0.03, 12.54, GATE, mat.woodDark, 0, false);
box(6.3, 12.54, 6.6, 12.58, 0.04, mat.black, 1.1, false);
wall('y', 3.0, TW, 7.1, [[0.45, 1.4, 'd', -2, 2.1]], mat.plaster, 0.15);   // стена лестничной клетки; дверь в гараж закрыта — гостям он недоступен (Иван)
[[0.35, 3.4], [6.7, 8.15], [11.55, 12.27]].forEach(([a, b]) => wall('x', 7.17, a, b, [], mat.concrete, 0.2));   // несущие стены между полосой и крылом
wall('y', 3.0, 7.27, 12.4, [[8.3, 9.2, 'd', -2, 2.1]], mat.plaster, 0.15);   // бойлерная под спальней Giardino
cyl(8.95, 0.75, 0.3, 1.6, mat.white, 0.1); box(7.4, 2.26, 8.0, 2.86, 1.8, mat.black);   // бойлер и серверный шкаф
stairU(-FL.sub);
// огнетушитель стоит в юго-западном углу, куда спускается лестница (Иван, 05.11); крупнее настоящего, чтобы был виден
cyl(0.62, 0.62, 0.17, 0.9, mat.red, 0, 24); cyl(0.62, 0.62, 0.06, 0.16, mat.black, 0.9, 12);
box(0.6, 0.62, 0.84, 0.68, 0.04, mat.black, 1.04); box(0.8, 0.62, 0.85, 0.68, 0.55, mat.black, 0.5);   // ручка и шланг
// пандус — только снаружи: у ворот ровная площадка, дальше пологий подъём до земли у улицы; внутри гаража ровный пол (Иван, 05.11)
const APRON = 6.5;
box(RAMP[0], RAMP[2], RAMP[1], RAMP[2] + APRON, 0.25, mat.concrete, -0.25);
function ramp(y0, y1, z0, z1) {
  const o = box(RAMP[0], y0, RAMP[1], y0 + Math.hypot(y1 - y0, z1 - z0), 0.25, mat.concrete);
  o.position.z = -(y0 + y1) / 2; o.position.y = (z0 + z1) / 2 - 0.125; o.rotation.x = Math.atan2(z1 - z0, y1 - y0);
}
ramp(RAMP[2] + APRON, RAMP[3], 0, -FL.sub);
// подпорные стены — открытый въезд без перекрытия: под нависающим залом доходят до его плиты, дальше — до газона с бортиком 0,2;
// восточная стена тёмная, на ней чёрные стойки с тросами и деревянным поручнем (видео 0:21–0:38)
const CON = 15.51 - RAMP[2];   // вынос зала над въездом
[[RAMP[0] - 0.2, mat.concrete], [RAMP[1], mat.darkConc]].forEach(([x, m]) => {
  const L = RAMP[3] - RAMP[2], g = -FL.sub, sh = new THREE.Shape([[0, -0.3], [APRON, -0.3], [L, g - 0.3], [L, g + 0.2], [CON, g + 0.2], [CON, g - 0.4], [0, g - 0.4]].map(([u, v]) => new THREE.Vector2(u, v)));
  const gm = new THREE.ExtrudeGeometry(sh, { depth: 0.2, bevelEnabled: false }); gm.rotateY(Math.PI / 2);
  const uv = gm.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 2.4, uv.getY(i) / 2.4);
  const o = new THREE.Mesh(gm, m); o.position.set(x, 0, -RAMP[2]); o.castShadow = o.receiveShadow = true; G.add(o);
});
railing(RAMP[1] + 0.1, 15.65, RAMP[1] + 0.1, RAMP[3] - 0.1, 0.9, -FL.sub + 0.2);

// ================= PLANTA BAJA (альбом, лист planta baja; мебель — по видео-обходу и фото) =================
floor('pb'); WH = H;
// --- полы
deck(0, 0, 7.31, 14.66, 0.2, tex.floor, -0.2, STAIR_HOLE(stairX0(-FL.sub)));   // зал, кухня, коридор; проём — лестница в подвал
slab(0, 14.66, 7.31, 15.51, 0.2, tex.concrete, -0.2);          // плита перед северным окном зала — бетонная рамка
box(0, 12.62, 7.31, 15.51, 0.2, mat.concrete, -0.4);            // зал нависает над въездом в гараж
slab(1.6, 3.13, 7.09, 5.02, 0.22, tex.tile, -0.2);             // санузлы
slab(7.31, 0, 12.75, 7.51, 0.2, tex.floor, -0.2);              // номер Giardino
slab(7.31, 7.51, 13.4, 12.0, 0.1, tex.deck, -0.1);             // патио: серая плитка (по видео-обходу)
for (let i = 0; i < 6; i++) box(9.75 + i * 0.12, 12.3 + i * 0.9, 10.65 + i * 0.12, 12.8 + i * 0.9, 0.04, mat.stone, -0.03);   // дорожка из плит к патио (видео 0:52)

// --- наружные стены: гладкий бетон, окна — чёрная рама, стекло и чёрная панель под ним до пола (Иван, 12.11; альбом, фасады)
// западная: окна лестничного холла и коридора, стеклянная дверь в сад у кухни (видео 4:47, 5:07), три окна зала
outer('x', 0, 0, 14.66, [W12(0.6), W12(3.2), [5.8, 6.7, 'g', 1, 2.4], W34(8.2), W34(10.4), W34(12.6)], 1);
wall('x', TW / 2, 14.66, 15.51, [], mat.concrete, TW);
outer('y', 0, TW, 12.75 - TW, [W12(0.6)], 1);                  // южная: окно в торце западного коридора (видео 5:23)
// восточная стена номера: окно спальни над столом, малое окно гостиной, угловое окно в пол
outer('x', 12.75, 0, 7.41, [W34(1.95), [4.19, 4.79, 'b', 1, 2.4, null, 1.2], [5.79, 7.41, 'g', 1, 2.4, 0.8]], -1);
// фасад на патио (видео 0:52–0:58): входная дверь в деревянной раме у самой стены зала, малое окно, угловое окно гостиной
outer('y', 7.51, 7.31, 12.65, [[7.71, 8.91, 'o', 0, 2.4], [9.76, 10.36, 'b', 1, 2.4, null, 1.2], [11.76, 12.65, 'g', 1, 2.4, 0.8]], -1);
cpost(12.65, 7.41, 12.75, 7.51, 2.4);
{ const y = 7.41;   // деревянный портал входа: полотно из вертикальных реек, боковое стекло, фрамуга
  [7.75, 8.62, 8.87].forEach(x => box(x - 0.04, y - 0.08, x + 0.04, y + 0.08, 2.4, mat.rail));
  box(7.79, y - 0.04, 8.58, y + 0.04, 2.08, mat.rail);
  for (let x = 7.86; x < 8.54; x += 0.12) box(x, y - 0.06, x + 0.025, y + 0.06, 2.0, mat.woodDark, 0.04);
  box(8.45, y + 0.06, 8.48, y + 0.1, 0.45, mat.black, 0.85);
  box(8.66, y - 0.02, 8.83, y + 0.02, 2.08, mat.glass, 0, false);
  box(7.71, y - 0.08, 8.91, y + 0.08, 0.06, mat.rail, 2.08); box(7.75, y - 0.02, 8.87, y + 0.02, 0.22, mat.glass, 2.14, false);
  box(7.71, y - 0.08, 8.91, y + 0.08, 0.04, mat.rail, 2.36); }
box(9.2, 7.51, 9.32, 7.57, 0.2, mat.black, 1.95, false);        // бра у двери
// восточная стена зала со стороны патио: три чёрных окна, между ними чёрные бра (видео 0:58)
outer('x', 7.31, 7.16, 14.66, [W34(8.21), W34(10.41), W34(12.61)], -1);
wall('x', 7.31 - TW / 2, 14.66, 15.51, [], mat.concrete, TW);
[9.91, 12.11].forEach(y => box(7.31, y - 0.06, 7.37, y + 0.06, 0.2, mat.black, 1.95, false));
// северное окно зала во всю ширину стоит в глубине бетонной рамки, перед ним — вертикальные рейки (видео 0:14–0:48)
wall('y', 14.7, TW, 7.31 - TW, [[1.25, 6.93, 'g', 4, 2.4, 0.8]], mat.concrete, 0.2, 0, -1);
for (let x = 1.3; x < 6.9; x += 0.27) box(x, 14.82, x + 0.04, 15.07, H, mat.lightOak);
box(0.74, 14.8, 0.86, 14.86, 0.2, mat.black, 1.95, false);
box(11.6, -0.3, 12.4, -0.02, 0.7, mat.paint2, 0.25);            // наружные блоки кондиционеров у южной стены

// --- лестница и коридор: бетонная П-образная лестница с деревянным поручнем (видео); коридор вдоль западной стены ведёт в зал
stairU(FL.p1);
wallY(3.03, 1.5, 7.09, mat.plaster, 0.2);                       // стена клетки / санузлы
wall('x', 7.2, TW, 5.27, [[4.2, 4.95, 'i', -1]], mat.plaster, 0.22);   // стена между полосой и номером; дверь ванной Giardino — из прихожей номера

// --- санузлы: гостевой (вход из коридора у западной стены — по видео) и ванная номера Giardino
wall('x', 1.55, 3.13, 5.02, [[4.2, 4.95, 'i']], mat.plaster, 0.1);
wallX(4.42, 3.13, 5.02, mat.plaster, 0.12);
wallY(5.145, 1.5, 7.31, mat.plaster, 0.25);
toilet(2.2, 3.27, 'n');
box(2.7, 3.17, 3.3, 3.62, 0.85, mat.white); box(2.8, 3.24, 3.2, 3.54, 0.02, mat.black, 0.85);   // тумба с раковиной
// душ в стекле с чёрной рамкой, стиральная машина в нише, чёрная полка с полотенцами (по видео)
box(3.45, 3.15, 4.35, 4.1, 0.05, mat.white);
box(3.43, 3.15, 3.47, 4.1, 2.0, mat.glass, 0.05, false); box(3.45, 4.08, 4.35, 4.12, 2.0, mat.glass, 0.05, false);
box(3.42, 3.15, 3.48, 4.13, 0.04, mat.black, 2.03); box(3.42, 4.07, 4.35, 4.13, 0.04, mat.black, 2.03); box(3.42, 4.07, 3.48, 4.13, 2.05, mat.black);
box(3.67, 4.4, 4.33, 5.0, 0.9, mat.white); { const d = cyl(3.65, 4.7, 0.17, 0.05, mat.steel, 0.28, 20); d.rotation.z = Math.PI / 2; }
box(2.2, 4.84, 2.8, 5.02, 0.03, mat.black, 1.1); box(2.25, 4.86, 2.75, 5.0, 0.12, mat.oak, 1.13);
// ванная Giardino (по видео: душ с чёрной рамкой, унитаз, белая тумба с круглым зеркалом, стиральная машина)
box(4.52, 3.15, 5.45, 4.1, 0.05, mat.white);
[[4.52, 4.1, 5.45, 4.12], [5.43, 3.15, 5.45, 4.12]].forEach(([a, b, c, d]) => box(a, b, c, d, 2.0, mat.glass, 0.05, false));
box(4.52, 4.08, 5.45, 4.14, 0.04, mat.black, 2.03); box(5.41, 3.15, 5.47, 4.14, 0.04, mat.black, 2.03);
toilet(5.9, 3.27, 'n');
box(6.35, 3.17, 7.0, 3.62, 0.85, mat.white); box(6.45, 3.24, 6.9, 3.54, 0.02, mat.steel, 0.85);
cyl(6.67, 3.16, 0.3, 0.02, mat.black, 1.35, 32).rotation.x = Math.PI / 2;                    // круглое зеркало
box(4.52, 4.4, 5.18, 5.0, 0.85, mat.white); { const d = cyl(5.2, 4.7, 0.17, 0.04, mat.steel, 0.26, 20); d.rotation.z = Math.PI / 2; }

// --- кухня (общая) у северной стены санузлов, лицом в зал (по видео): дубовый портал с высокими пеналами по краям,
// белая плитка, открытые полки, белая круглая вытяжка с трубой, чёрная столешница, духовка. Восточный край — белый
// простенок с выключателями; стальной двухдверный холодильник — в нише белой колонны у западной стены, рядом стеклянная
// дверь в сад (видео 4:13, 4:25, 4:47–5:07). От входной двери: слева кухня, справа весь зал — одно помещение (Иван)
const KB = 5.27, KF = 5.87;                                                                 // задняя и передняя линии кухни
box(1.85, KB, 2.5, KF, 2.3, mat.oak); box(5.25, KB, 5.85, KF, 2.3, mat.oak);               // высокие пеналы
box(1.85, KB, 5.85, KF, 0.14, mat.oak, 2.3);                                                // верх портала
box(2.5, KB, 5.25, KF, 0.88, mat.oak); box(2.5, KB, 5.25, KF + 0.03, 0.04, mat.counter, 0.88);
[2.65, 3.2, 4.35, 4.85].forEach(x => box(x, KF, x + 0.3, KF + 0.02, 0.025, mat.black, 0.7));   // чёрные ручки
box(2.5, KB, 5.25, KB + 0.03, 1.38, mat.white, 0.92);                                       // белая плитка
[1.45, 1.8].forEach(z => { box(2.5, KB, 3.1, KB + 0.3, 0.03, mat.oak, z); box(4.65, KB, 5.25, KB + 0.3, 0.03, mat.oak, z); }); // открытые полки
cyl(3.9, KB + 0.28, 0.27, 0.22, mat.white, 1.55, 32); cyl(3.9, KB + 0.2, 0.09, H - 1.77, mat.white, 1.77, 16); // круглая вытяжка и труба
box(3.6, KF, 4.2, KF + 0.02, 0.5, mat.black, 0.2);                                          // духовка
box(3.65, KB + 0.1, 4.15, KB + 0.5, 0.01, mat.black, 0.925);                                // варочная
box(4.5, KB + 0.1, 5.0, KB + 0.5, 0.01, mat.steel, 0.925);                                  // мойка
box(5.85, KB, 6.5, KF + 0.1, H, mat.white);                                                 // белый простенок до потолка
box(6.15, KF + 0.1, 6.23, KF + 0.11, 0.08, mat.paint2, 1.1, false); box(6.15, KF + 0.1, 6.23, KF + 0.11, 0.1, mat.paint2, 1.35, false); // выключатель, термостат
// белая колонна у западной стены с нишей холодильника, ниша смотрит на юг — к стеклянной двери
box(0.35, 7.8, 1.5, 7.95, H, mat.white);                                                    // задняя стенка ниши
box(1.5, 7.0, 1.95, 8.2, H, mat.white);                                                     // шахта — щека ниши со стороны зала
box(0.35, 7.0, 1.5, 7.8, H - 1.9, mat.white, 1.9);                                          // перемычка над нишей
box(0.45, 7.05, 1.36, 7.78, 1.82, mat.steel);                                               // холодильник side-by-side
box(0.9, 7.03, 0.92, 7.05, 1.6, mat.black, 0.1, false); box(0.62, 7.03, 0.7, 7.04, 0.14, mat.black, 1.25, false); // стык дверей, дисплей
box(0.35, 6.82, 0.36, 6.9, 0.08, mat.paint2, 1.1, false);                                   // выключатель у двери

// --- зал: один длинный светлый деревянный стол с бело-серыми стульями; диван, перед ним ТВ у северного окна (по видео и словам Ивана)
longTable(2.6, 8.3, 5.0, 9.2, 3, mat.lightOak, mat.chairWhite);
// два круглых белых столика с серыми стульями у западных окон (видео 3:59, 4:49)
roundTable(1.3, 10.9, 0.4, 3, mat.chairGrey); roundTable(1.3, 12.9, 0.4, 3, mat.chairGrey);
// Г-образный диван лицом к северному окну и пуф; ТВ на тумбе перед окном, лицом к дивану
box(2.9, 11.31, 6.4, 12.25, 0.42, mat.sofaGrey); box(2.9, 12.25, 3.9, 13.25, 0.42, mat.sofaGrey);
box(2.9, 11.25, 6.4, 11.5, 0.85, mat.sofaGrey); box(2.9, 11.25, 3.15, 13.25, 0.85, mat.sofaGrey);
box(4.3, 12.35, 5.8, 13.25, 0.36, mat.sofaGrey);                                            // пуф
box(3.5, 13.8, 5.9, 14.2, 0.45, mat.oak);                                                   // тумба под ТВ
box(4.05, 13.95, 5.35, 14.01, 0.76, mat.black, 0.55);                                       // телевизор
// уют: ковёр, подушки и плед, торшер, растения в кашпо, подвесные лампы над столом, книги
box(3.2, 12.15, 6.5, 13.7, 0.012, mat.rug, 0, false);
[[3.3, mat.curtain], [4.0, mat.bedGrey], [5.2, mat.curtain], [5.8, mat.bedGrey]].forEach(([x, m]) => box(x, 11.49, x + 0.45, 11.63, 0.36, m, 0.42));
box(3.14, 12.15, 3.28, 12.65, 0.36, mat.bedGrey, 0.42);
box(3.2, 12.55, 3.88, 13.2, 0.04, mat.blanket, 0.42);
cyl(6.65, 11.6, 0.12, 0.03, mat.black, 0); cyl(6.65, 11.6, 0.012, 1.5, mat.black, 0, 6); cyl(6.65, 11.6, 0.2, 0.28, mat.lamp, 1.42);
[[6.6, 14.2], [0.75, 14.2], [6.6, 7.65]].forEach(([x, y]) => { cyl(x, y, 0.22, 0.42, mat.white); bush(x, y, 0.36, 0.38, false); });
[3.3, 4.3].forEach(x => { cyl(x, 8.75, 0.005, H - 1.75, mat.black, 1.75, 4); cyl(x, 8.75, 0.17, 0.2, mat.lamp, 1.55); });
[[3.6, mat.blanket], [3.7, mat.paint1], [3.8, mat.lightOak]].forEach(([x, m]) => box(x, 13.87, x + 0.07, 14.1, 0.24, m, 0.45));

// --- вестибюль за входной дверью: справа белая скамья-обувница, слева белая дверь номера Giardino (видео 1:03–1:06)
box(7.0, 5.3, 7.72, 5.66, 0.45, mat.white); box(7.02, 5.32, 7.7, 5.64, 0.07, mat.sofaGrey, 0.45);
wallY(5.2, 7.31, 7.86, mat.plaster, 0.14);
box(7.86, 5.15, 8.78, 5.25, 2.08, mat.white);                              // дверь в номер из вестибюля — закрыта (видео 1:06)
box(8.6, 5.25, 8.74, 5.29, 0.03, mat.black, 1.0);                          // ручка
wallY(5.2, 7.86, 8.78, mat.plaster, 0.14, H - 2.1, 2.1);                 // стена над дверью
wallY(5.2, 8.78, 9.1, mat.plaster, 0.14);
wallX(9.04, 5.13, 7.16, mat.plaster, 0.12);                               // стена вестибюля; прихожая номера открыта в гостиную без простенков (Иван, 08.11)

// --- Giardino: прихожая → гостиная с кухней (север), спальня (юг), ванная (запад). По видео-обходу; альбом — для стен
wall('y', 3.25, 7.31, 12.4, [[7.95, 8.8, 'i', -1]], mat.plaster, 0.16);   // стена спальни: дверь из прихожей — напротив входа в номер
// шторы бежевые на чёрной штанге по краям углового окна и у маленького окна
box(11.48, 7.0, 11.74, 7.14, 2.48, mat.curtain, 0.04); box(12.24, 5.45, 12.38, 5.77, 2.48, mat.curtain, 0.04);
box(11.45, 7.06, 12.38, 7.09, 0.03, mat.black, 2.53); box(12.3, 5.4, 12.33, 7.09, 0.03, mat.black, 2.53);
box(9.5, 7.02, 9.74, 7.14, 1.4, mat.curtain, 1.1); box(9.45, 7.07, 10.6, 7.1, 0.03, mat.black, 2.5);
box(12.16, 4.05, 12.4, 4.95, 0.3, mat.white, 2.6);                                          // кондиционер
[3.4, 4.1].forEach(y => box(7.31, y, 7.35, y + 0.03, 1.35, mat.black)); box(7.31, 3.4, 7.53, 4.13, 0.03, mat.black, 1.3); box(7.31, 3.4, 7.55, 4.13, 0.03, mat.black, 0.35); // вешалка: крючки и полка для обуви
// кухонная линия вдоль южной стены гостиной: белый холодильник у прихожей, мойка, варочная, дубовые фасады,
// белые навесные шкафы с микроволновкой (по видео)
box(9.15, 3.33, 9.8, 3.98, 1.8, mat.white);                                                 // холодильник
box(9.8, 3.33, 12.38, 3.93, 0.88, mat.oak); box(9.8, 3.33, 12.38, 3.96, 0.04, mat.counter, 0.88);
for (let x = 10.0; x < 12.2; x += 0.6) box(x, 3.93, x + 0.3, 3.96, 0.025, mat.black, 0.7);
box(10.0, 3.41, 10.45, 3.81, 0.01, mat.steel, 0.925);                                       // мойка
box(11.1, 3.41, 11.7, 3.86, 0.01, mat.black, 0.925); box(11.1, 3.93, 11.7, 3.95, 0.5, mat.black, 0.2); // варочная и духовка
box(9.8, 3.33, 12.38, 3.68, 0.75, mat.white, 1.55);                                         // навесные шкафы
for (let x = 10.5; x < 11.7; x += 0.7) box(x, 3.68, x + 0.03, 3.7, 0.2, mat.black, 1.6);
box(11.78, 3.68, 12.33, 3.7, 0.32, mat.black, 1.75);                                        // микроволновка
// гостиная: серый диван-кровать под маленьким окном, ТВ на северной стене, круглый белый стол с четырьмя серыми стульями у углового окна
box(9.15, 6.48, 10.55, 7.16, 0.42, mat.sofaGrey); box(9.15, 6.98, 10.55, 7.16, 0.75, mat.sofaGrey);
box(10.75, 7.14, 11.4, 7.16, 0.5, mat.black, 1.15, false);                                  // телевизор
roundTable(11.35, 5.8, 0.42, 4, mat.bedHead);
// спальня: кровать с серой мягкой спинкой у южной стены, тумбы, стол под окном, белый шкаф от пола до потолка (по видео)
bed(9.5, 0.49, 11.1, 2.49, 's');
box(8.9, 0.38, 9.35, 0.78, 0.5, mat.oak); box(11.25, 0.38, 11.7, 0.78, 0.5, mat.oak);       // тумбы
box(11.85, 1.95, 12.38, 3.1, 0.04, mat.white, 0.72);                                        // стол под окном
[[11.87, 1.97], [12.32, 1.97], [11.87, 3.04], [12.32, 3.04]].forEach(([x, y]) => box(x, y, x + 0.04, y + 0.04, 0.72, mat.oak));
box(7.33, 0.37, 7.9, 2.95, H, mat.white);                                                   // шкаф во всю западную стену, дверь — справа от него
for (let y = 0.6; y < 2.9; y += 0.6) box(7.9, y, 7.92, y + 0.03, 0.4, mat.black, 0.9, false);
box(12.16, 0.6, 12.4, 1.5, 0.3, mat.white, 2.6);                                            // кондиционер спальни

// --- патио: четыре чёрных пластиковых кресла-«бочки» под плетение, без столика (по видео): группа у фасада, лицом друг к другу
const tc = [10.2, 8.95];
[[11.1, 8.85], [10.2, 8.3], [10.1, 9.7], [9.3, 9.05]].forEach(([x, y]) => tubChair(x, y, Math.atan2(tc[0] - x, -(tc[1] - y))));

// ================= 1-й ЭТАЖ (+3,5): лестничный холл, коридор вдоль западной стены, квартиры Terrazzo (юг) и Paraiso (север);
// балкон Terrazzo над номером Giardino (альбом, лист 1-го этажа; видео) =================
floor('p1'); WH = FL.p2 - FL.p1 - SLT;
deck(0, 0, 7.31, 16.8, SLT, tex.floor, -SLT, STAIR_HOLE(stairX0(FL.p1)));
box(stairX0(FL.p1), TW, stairX0(FL.p2 - FL.p1), 1.6, SLT, mat.concrete, -SLT);   // пол перед первой ступенью марша наверх
slab(0, 16.8, 7.31, 18.0, SLT, tex.concrete, -SLT);            // вынос над залом: плита перед северными окнами (видео 0:33)
slab(7.31, 8.17, 7.95, 18.0, SLT, tex.concrete, -SLT);         // карниз над окнами зала со стороны патио (видео 0:58)
slab(7.31, 0, 13.43, 8.17, SLT, tex.concrete, -SLT);           // балкон; его плита — козырёк над патио
stairU(FL.p2 - FL.p1);
// наружные стены: западная и южная — гладкие, в одной плоскости с planta baja (Иван, 12.11)
outer('x', 0, 0, 16.9, [W12(0.6), W12(3.2), W12(5.8), W34(12.55)], 1);
wall('x', TW / 2, 16.9, 18.0, [], mat.concrete, TW);            // западная щека северной ниши
outer('y', 0, TW, 7.31 - TW, [W12(0.6)], 1);
// восточная: окно-дверь на балкон, три окна над патио, угловое окно гостиной Paraiso (видео 0:38, 0:58)
outer('x', 7.31, 0, 16.8, [[4.3, 6.7, 'g', 2, 2.4], W34(8.2), W34(10.4), W34(12.6), [14.8, 16.8, 'g', 1, 2.4, 0.8]], -1);
// северный фасад 1-го этажа — бетон с окном спальни и угловым окном, без реек (видео 0:14–0:38)
outer('y', 16.9, TW, 7.21, [[1.8, 3.3, 'g', 1, 2.4, 0.8], [5.3, 7.21, 'g', 1, 2.4, 0.8]], -1);
cpost(7.21, 16.8, 7.31, 16.9, 2.4);
// холл и коридор вдоль западной стены: справа дверь в Terrazzo, в торце — дверь в Paraiso
wallY(3.03, 1.5, 6.96, mat.plaster, 0.2);
wall('x', 1.55, 3.13, 12.43, [[6.0, 6.9, 'i']], mat.plaster, 0.12);
// --- Terrazzo: альков спальни у лестничной стены, гостиная с выходом на балкон, кухня и санузел в ядре
wall('y', 5.92, 1.6, 4.6, [], mat.plaster, 0.12);
wall('y', 7.3, 1.6, 3.9, [[2.3, 3.1, 'i']], mat.plaster, 0.12);
wallX(3.9, 7.3, 9.72, mat.plaster, 0.13);
bed(2.9, 3.29, 4.7, 5.3, 's');
box(2.4, 3.15, 2.8, 3.55, 0.5, mat.oak); box(4.8, 3.15, 5.2, 3.55, 0.5, mat.oak);
box(1.62, 3.2, 2.2, 5.84, 2.3, mat.white); for (let y = 3.6; y < 5.8; y += 0.7) box(2.2, y, 2.22, y + 0.03, 0.4, mat.black, 0.9, false);
box(5.35, 3.15, 6.9, 4.05, 0.42, mat.sofaGrey); box(5.35, 3.15, 6.9, 3.37, 0.8, mat.sofaGrey);
box(5.5, 4.5, 6.3, 4.95, 0.4, mat.oak);
roundTable(5.9, 8.3, 0.45, 3, mat.chairWhite);
kitchenette(3.97, 8.06, 9.72, 7.36, 8.06, 8.3, 9.1);
box(1.63, 7.5, 2.13, 8.1, 0.85, mat.white); box(1.7, 7.6, 2.05, 8.0, 0.02, mat.steel, 0.85);
toilet(3.72, 8.3, 'w');
box(1.63, 8.87, 3.81, 9.7, 0.05, mat.white); box(1.63, 8.85, 3.81, 8.89, 2.0, mat.glass, 0.05, false);
wallY(9.86, 1.6, 6.96, mat.plaster, 0.28);                      // стена между квартирами
// --- Paraiso: прихожая в торце коридора, санузел и кухня в ядре, спальня на северо-западе, гостиная с угловым окном
wallX(3.9, 10.0, 12.49, mat.plaster, 0.13);
wall('y', 12.49, 0.35, 3.9, [[0.45, 1.4, 'i'], [2.9, 3.7, 'i', -1]], mat.plaster, 0.12);
wall('y', 13.81, 0.35, 4.14, [[2.44, 3.35, 'i']], mat.plaster, 0.12);
wallX(4.14, 13.81, 16.55, mat.plaster, 0.12);
box(1.63, 10.02, 3.81, 10.9, 0.05, mat.white); box(1.63, 10.9, 3.81, 10.94, 2.0, mat.glass, 0.05, false);
toilet(1.72, 11.3, 'e');
box(1.63, 11.75, 2.13, 12.35, 0.85, mat.white); box(1.7, 11.85, 2.05, 12.25, 0.02, mat.steel, 0.85);
kitchenette(3.97, 10.02, 11.75, 11.75, 12.43, 11.0, 10.2);
roundTable(5.9, 11.2, 0.45, 3, mat.chairWhite);
singleBed(0.4, 15.55, 2.4, 16.45); singleBed(0.4, 14.0, 2.4, 14.9);   // две раздельные односпальные, между ними проход (Иван, 12.11: «В Параисо две раздельные кровати»)
box(3.5, 14.9, 4.06, 16.5, 2.3, mat.white); for (let y = 15.3; y < 16.4; y += 0.6) box(3.48, y, 3.5, y + 0.03, 0.4, mat.black, 0.9, false);
// гостиная: Г-образный диван у стены спальни лицом к ТВ на восточной стене, журнальный столик
box(4.22, 13.9, 5.1, 15.9, 0.42, mat.sofaGrey); box(4.22, 13.9, 4.44, 15.9, 0.8, mat.sofaGrey);
box(5.1, 15.2, 5.9, 15.9, 0.42, mat.sofaGrey);
box(5.35, 14.2, 6.15, 14.7, 0.4, mat.oak);
box(6.93, 13.9, 6.95, 14.7, 0.5, mat.black, 1.0, false);
// --- балкон над Giardino (видео 9:20–10:20, фото сайта): изогнутый «остров» из светлой сосны, вокруг мульча с растениями до самых углов;
// широкие бетонные пилоны посередине северной и южной сторон, между ними и по всей восточной стороне — стекло с деревянным поручнем
box(10.36, 7.16, 11.76, 7.51, WH, bconc); box(10.38, 0, 11.76, 0.35, WH, bconc);
glassRail(7.31, 7.45, 10.36, 7.45); glassRail(11.76, 7.45, 12.69, 7.45);
glassRail(12.69, 0.06, 12.69, 7.45);
glassRail(7.31, 0.06, 10.38, 0.06); glassRail(11.76, 0.06, 12.69, 0.06);
const bm = ([x, y]) => [7.31 + (x - 7.83) * 0.88, 0.06 + (y + 0.39) * 0.81];
const isl = curvePts([[7.85, 4.4], [8.7, 1.4], [10.6, 0.5], [12.5, 1.4], [12.0, 3.4], [10.7, 4.6], [11.1, 6.9], [9.6, 8.3], [7.85, 8.35]].map(bm));
flat(isl, 0.07, pineTopNS, 0);   // светлая сосна, доски от дома к ограждению (фото балкона)
beds(7.4, 0.12, 12.64, 7.4, [isl, sq(7.3, 0, 8.05, 7.5)], 0.7, 0.5, 0.4, 0.6);   // мульча, редкие молодые злаки и агавы — земля доходит до самых углов у ограждения
box(7.33, 0.1, 8.0, 7.42, 0.05, mat.concrete);   // серая дорожка вдоль стены дома
wicker(7.95, 4.6, 9.65, 5.4, 'n'); wicker(9.3, 3.3, 10.05, 4.1, 'e'); wicker(8.2, 2.5, 8.95, 3.25, 's');
box(8.3, 3.6, 9.0, 4.3, 0.4, mat.wicker, 0.07);                                                       // столик-куб
[[10.0, 2.0], [10.0, 5.4]].forEach(([x, y]) => box(x - 0.15, y - 0.15, x + 0.15, y + 0.15, 0.05, mat.lamp, WH - 0.05, false));   // светильники на потолке

// ================= 2-й ЭТАЖ (+6,5): альбом, лист 2-го этажа, и видео. Лестница выходит в коридор у западной стены, он ведёт к стеклянной
// двери на террасу. Из коридора — дверь в квартиру: прихожая за quincho, из неё санузел, дальше общая комната с кухней и угловым
// окном, за ней спальня. Quincho открыт на террасу (Иван, 08.11) =================
floor('p2'); WH = FL.roof - FL.p2 - SLT;
deck(0, 0, 7.31, 7.5, SLT, tex.floor, -SLT, STAIR_HOLE(stairX0(FL.p2 - FL.p1)));
slab(7.31, 0, 12.75, 7.51, SLT, tex.floor, -SLT);
slab(12.75, 0, 13.43, 8.17, SLT, tex.concrete, -SLT); slab(7.31, 7.51, 12.75, 8.17, SLT, tex.concrete, -SLT);   // карниз над балконом
slab(0, 7.5, 7.31, 18.0, SLT, tex.concrete, -SLT);             // терраса
slab(7.31, 8.17, 7.95, 18.0, SLT, tex.concrete, -SLT);         // её восточный карниз
railing(stairX0(FL.p2 - FL.p1), 0.42, stairX0(FL.p2 - FL.p1), 1.58, 0.95);   // ограждение лестничного проёма
outer('x', 0, 0, 7.51, [W12(0.6), W12(3.2), W12(5.8)], 1);
outer('y', 0, TW, 12.75 - TW, [W12(0.6), W12(8.0)], 1);
outer('x', 12.75, 0, 7.41, [[1.6, 3.06, 'b', 1, 2.4, null, 0.9], [4.67, 7.41, 'g', 2, 2.4, 0.8]], -1);
// фасад на террасу и на балкон: стеклянная дверь коридора, открытый quincho, окно санузла, окно и угловое окно гостиной
outer('y', 7.51, TW, 12.65, [[0.63, 1.46, 'g', 1, 2.4], [2.1, 4.78, 'o', 0, WH], [5.47, 6.1, 'b', 1, 2.4, null, 1.2], [8.87, 10.33, 'g', 1, 2.4, 0.8], [11.76, 12.65, 'g', 1, 2.4, 0.8]], -1);
cpost(12.65, 7.41, 12.75, 7.51, 2.4);
wallY(3.03, 1.5, 7.31, mat.plaster, 0.2);                       // лестничная клетка / прихожая
wallX(7.2, TW, 3.13, mat.plaster, 0.22);                        // клетка / спальня
wall('x', 1.55, 3.13, 7.16, [[3.3, 4.2, 'i']], mat.plaster, 0.12);   // коридор; дверь в квартиру
wall('y', 4.4, 1.61, 4.9, [], bconc, 0.15);                    // задняя стена quincho
wallX(2.03, 4.4, 7.16, bconc, 0.15); box(1.61, 4.47, 1.95, 7.16, WH, mat.plaster);   // западная стена quincho и шахта за ней
wallX(4.83, 4.4, 7.16, bconc, 0.15);
wall('y', 4.44, 4.9, 7.09, [[5.4, 6.2, 'i']], mat.plaster, 0.12);    // санузел — дверь из прихожей
wallX(7.2, 4.38, 7.16, mat.plaster, 0.22);                      // санузел / кухня
box(2.0, 3.9, 3.4, 4.32, 2.1, mat.white);                       // шкаф в прихожей
// санузел: душ во всю ширину у фасада за стеклом, унитаз и тумба с раковиной у восточной стены
box(4.92, 6.3, 7.07, 7.14, 0.05, mat.white); box(4.92, 6.28, 7.07, 6.32, 2.0, mat.glass, 0.05, false);
toilet(6.97, 5.75, 'w');
box(6.6, 4.55, 7.07, 5.25, 0.85, mat.white); box(6.68, 4.65, 7.0, 5.15, 0.02, mat.steel, 0.85);
// quincho: кирпичный мангал с бетонным колпаком у задней стены, слева полка, справа бетонная столешница буквой Г с мойкой (видео 6:23, 6:29)
slab(2.1, 4.47, 4.76, 7.51, 0.02, tex.tile, 0);
[1.8, 5.08].forEach(x => box(x - 0.08, 7.51, x + 0.08, 7.63, 0.22, mat.black, 2.2, false));   // бра на фасаде
box(2.5, 4.47, 3.9, 5.2, 0.9, mat.white);
box(2.5, 4.47, 3.9, 4.62, 1.25, mat.brick, 0.9); box(2.5, 4.47, 2.65, 5.2, 1.25, mat.brick, 0.9); box(3.75, 4.47, 3.9, 5.2, 1.25, mat.brick, 0.9);
box(2.65, 4.66, 3.75, 5.12, 0.03, mat.black, 1.0);
box(2.4, 4.47, 4.0, 5.3, 0.45, mat.concrete, 2.15);
box(2.1, 4.47, 2.5, 4.95, 0.9, mat.concrete);
box(3.9, 4.47, 4.76, 5.1, 0.9, mat.concrete); box(4.2, 5.1, 4.76, 6.6, 0.9, mat.concrete);
box(4.0, 4.47, 4.76, 4.51, 0.9, mat.white, 0.9); box(4.72, 4.51, 4.76, 6.6, 0.9, mat.white, 0.9);
box(4.28, 5.6, 4.66, 6.1, 0.01, mat.steel, 0.905); box(4.67, 5.82, 4.72, 5.88, 0.3, mat.black, 0.9);
// общая комната: кухня вдоль стены санузла (холодильник, мойка, варочная), Г-образный диван у стены спальни, стол на 4 у окна
box(7.33, 4.45, 7.98, 5.2, 1.85, mat.white);
box(7.33, 5.2, 7.98, 7.1, 0.88, mat.oak); box(7.33, 5.2, 8.01, 7.1, 0.04, mat.counter, 0.88); box(7.33, 5.2, 7.68, 7.1, 0.7, mat.white, 1.55);
box(7.45, 5.5, 7.85, 6.0, 0.01, mat.steel, 0.925); box(7.45, 6.4, 7.85, 6.9, 0.01, mat.black, 0.925); box(7.98, 6.4, 8.0, 6.9, 0.5, mat.black, 0.2);
wall('y', 3.17, 7.31, 12.4, [[8.05, 8.95, 'i', -1]], mat.plaster, 0.14);   // стена спальни; дверь из гостиной
box(9.4, 3.26, 12.0, 4.26, 0.42, mat.sofaGrey); box(9.4, 3.26, 12.0, 3.48, 0.8, mat.sofaGrey);
box(9.4, 4.26, 10.3, 5.4, 0.42, mat.sofaGrey); box(9.4, 3.26, 9.62, 5.4, 0.8, mat.sofaGrey);
box(10.7, 4.8, 11.7, 5.3, 0.4, mat.oak);
box(10.5, 7.12, 11.6, 7.14, 0.6, mat.black, 1.1, false);       // телевизор
box(8.95, 5.65, 10.15, 6.85, 0.045, mat.lightOak, 0.705);
[[9.03, 5.73], [10.01, 5.73], [9.03, 6.71], [10.01, 6.71]].forEach(([x, y]) => box(x, y, x + 0.06, y + 0.06, 0.705, mat.lightOak));
[5.95, 6.55].forEach(y => { chair(8.95 - CH, y, mat.chairWhite, 0.5 * Math.PI); chair(10.15 + CH, y, mat.chairWhite, 1.5 * Math.PI); });
// спальня: шкаф у стены клетки, двуспальная кровать изголовьем к южной стене, тумбы, синий диван
box(7.33, 0.4, 7.93, 3.05, 2.3, mat.white);
bed(9.2, 0.49, 10.9, 2.49, 's');
box(8.75, 0.38, 9.1, 0.78, 0.5, mat.oak); box(11.0, 0.38, 11.35, 0.78, 0.5, mat.oak);
box(11.5, 0.37, 12.38, 1.55, 0.42, mat.sofaBlue); box(12.16, 0.37, 12.38, 1.55, 0.8, mat.sofaBlue);
// терраса на крыше 1-го этажа (фото сайта «terraza», видео 6:15–7:30): светлый сосновый настил; две клумбы свободной формы с мульчей,
// редкими злаками и агавами: длинная вдоль западного края до северо-западного угла и малая у восточного ограждения (Иван, 12.11:
// клумбы подходят к самым углам с видами); тросовое ограждение с деревянным поручнем; стол на 6 у quincho. Лестницы на крышу нет
const tm2 = ([x, y]) => [0.2 + (x + 0.2) * 7.0 / 7.72, 7.5 + (y - 8.77) * 9.2 / 10.29];
flat(sq(0.2, 7.5, 7.2, 16.7), 0.07, pineTop, 0);
const bedW = [...curvePts([[-0.2, 10.2], [0.9, 10.0], [1.5, 11.2], [2.2, 13.0], [1.5, 15.0], [1.9, 16.6], [2.9, 18.0], [2.6, 19.06]].map(tm2)), tm2([-0.2, 19.06])];
const bedE = curvePts([[7.52, 9.0], [6.6, 9.5], [5.9, 11.0], [6.3, 12.6], [7.52, 13.6]].map(tm2));
[bedW, bedE].forEach(b => flat(b, 0.1, mulch, 0));
scatter(bedW, 34); scatter(bedE, 10);
box(0, 7.5, 0.2, 18.0, 0.14, bconc); box(0.2, 17.8, 7.95, 18.0, 0.14, bconc); box(7.75, 8.17, 7.95, 17.8, 0.14, bconc);
railing(0.1, 7.6, 0.1, 16.75, 0.95, 0.14); railing(7.25, 7.6, 7.25, 16.75, 1.0, 0); railing(0.1, 16.75, 7.25, 16.75, 1.0, 0);
longTable(2.5, 8.6, 4.9, 9.4, 3, mat.black, mat.wicker, false);

// ================= КРЫША (+9,5): плоская бетонная плита и труба мангала над quincho. Выхода на крышу нет: будки и лестницы в доме нет —
// они были только в проекте 2022 (Иван, 08.11) =================
floor('roof'); WH = 2.3;
slab(0, 0, 13.43, 8.17, SLT, tex.concrete, -SLT);   // с карнизом на восток и на север — над балконом и фасадом на террасу
box(2.9, 4.55, 3.5, 5.1, 1.0, mat.white); box(2.8, 4.45, 3.6, 5.2, 0.08, mat.white, 1.0);
G = null;

// --- сосны: места — по топосъёмке участка (планилья деревьев проекта), точность ~1 м;
// после стройки их намного меньше (Иван, 05.11): оставлены 14 нумерованных — не ближе 1,5 м к дому и пандусу и не теснее 5 м друг к другу;
// плана с оставленными соснами нет. Размер — по диаметру ствола из планильи
const pineTops = [];
function pine(x, y, s = 1) {   // приморская сосна: высокий голый ствол, плоская крона-зонт наверху (по фото)
  const g = new THREE.Group(), top = new THREE.Group(), h = (11 + rnd() * 4) * s;
  const t = new THREE.Mesh(new THREE.CylinderGeometry(0.15 * s, 0.28 * s, h, 7), mat.trunk); t.position.y = h / 2; t.castShadow = true; g.add(t);
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * Math.PI * 2 + rnd(), d = i ? (1.0 + rnd() * 0.9) * s : 0, r = (1.1 + rnd() * 0.6) * s;   // кроны уже, чем были: сосен по съёмке много, дом должен читаться
    const c = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), i % 2 ? mat.treeDark : mat.tree);
    c.scale.y = 0.36; c.position.set(Math.cos(a) * d, h + rnd() * 0.7 * s, Math.sin(a) * d); c.castShadow = true; top.add(c);
    if (i) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.04 * s, 0.07 * s, d * 1.1, 5), mat.trunk); b.position.set(Math.cos(a) * d / 2, h - 0.5 * s, Math.sin(a) * d / 2); b.rotation.set(Math.sin(a) * 1.0, 0, -Math.cos(a) * 1.0); top.add(b); }
  }
  g.rotation.z = (rnd() - 0.5) * 0.1;
  g.add(top); pineTops.push({ top, t, h });   // кроны прячутся при виде этажа — остаются стволы и тени
  const [px, pz] = P(x, y); g.position.set(px, 0, pz); scene.add(g);
}
const PINE_OUT = [[-0.1, -0.1, 13.5, 18.1], [RAMP[0] - 0.2, RAMP[2], RAMP[1] + 0.2, RAMP[3]]];   // дом и въезд: сосен внутри нет
[[15.9, 35.5, 1.06], [-6.7, 29.8, 1.02], [12.3, 28.6, 1.11], [17.5, 24.1, 1.4], [8.6, 21.8, 0.93], [-4.4, 19.0, 0.97], [-9.1, 13.4, 1.06],
  [-10.6, 7.6, 1.02], [-1.8, 3.4, 0.97], [-10.2, -0.3, 1.02], [-2.4, -2.2, 1.02], [-2.4, 10.6, 0.91], [-16.8, 6.5, 0.93], [-15.0, 18.2, 0.93]]
  .filter(([x, y]) => !PINE_OUT.some(([a, b, c, d]) => x > a - 1.5 && x < c + 1.5 && y > b - 1.5 && y < d + 1.5))
  .forEach(([x, y, s]) => pine(x, y, s));

// --- скорость: всё неподвижное на этаже склеивается в один меш на материал — тысячи вызовов отрисовки превращаются в десятки.
// Этажи остаются группами (их прячет вид этажа), кроны сосен — тоже
function bake(group) {
  group.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(group.matrixWorld).invert(), m4 = new THREE.Matrix4(), bins = new Map();
  group.traverse(o => {
    if (!o.isMesh) return;
    const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    g.applyMatrix4(m4.multiplyMatrices(inv, o.matrixWorld));
    const pos = g.attributes.position.array, nor = g.attributes.normal.array, uv = g.attributes.uv ? g.attributes.uv.array : null, multi = Array.isArray(o.material);
    (multi && g.groups.length ? g.groups : [{ start: 0, count: pos.length / 3, materialIndex: 0 }]).forEach(({ start, count, materialIndex }) => {
      const m = multi ? o.material[materialIndex] : o.material, key = m.uuid + (o.castShadow ? 'c' : '') + (o.receiveShadow ? 'r' : '');
      let b = bins.get(key); if (!b) bins.set(key, b = { m, cast: o.castShadow, recv: o.receiveShadow, p: [], n: [], u: [], len: 0 });
      b.p.push(pos.subarray(start * 3, (start + count) * 3)); b.n.push(nor.subarray(start * 3, (start + count) * 3));
      b.u.push(uv ? uv.subarray(start * 2, (start + count) * 2) : new Float32Array(count * 2)); b.len += count;
    });
  });
  group.clear();
  bins.forEach(b => {
    const cat = (parts, k) => { const a = new Float32Array(b.len * k); let o = 0; parts.forEach(q => { a.set(q, o); o += q.length; }); return new THREE.BufferAttribute(a, k); };
    const g = new THREE.BufferGeometry(); g.setAttribute('position', cat(b.p, 3)); g.setAttribute('normal', cat(b.n, 3)); g.setAttribute('uv', cat(b.u, 2));
    const o = new THREE.Mesh(g, b.m); o.castShadow = b.cast; o.receiveShadow = b.recv; group.add(o);
  });
}
scene.updateMatrixWorld(true);
Object.values(floors).forEach(bake);
pineTops.forEach(({ top }) => bake(top));
