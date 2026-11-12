// --- подписи: маленькие точки, текст появляется по наведению (на телефоне — по касанию); txt — надпись видна всегда
const labelsEl = document.getElementById('labels');
const labels = [];
function addLabel(text, sub, x, y, z, fl = 'pb', txt = false) {
  const el = document.createElement('div');
  el.className = 'dot' + (txt ? ' txt' : '');
  el.innerHTML = '<i></i><div class="tip"><b>' + T(text) + '</b>' + (sub ? '<span>' + T(sub) + '</span>' : '') + '</div>';
  el.onclick = e => { e.stopPropagation(); const o = el.classList.contains('open'); labels.forEach(l => l.el.classList.remove('open')); if (!o) el.classList.add('open'); };
  labelsEl.appendChild(el);
  labels.push({ el, pos: new THREE.Vector3(x, z + FL[fl], -y), fl });
}
addLabel('Giardino', 'sala con cocina', 10.8, 5.4, 0.9);
addLabel('Baño de invitados', 'inodoro, lavatorio y nicho del lavarropas', 2.9, 4.2, 0.9);
addLabel('Baño de Giardino', '', 5.9, 4.3, 0.9);
addLabel('Dormitorio de Giardino', 'puerta frente a la entrada de la suite', 10.3, 1.6, 0.9);
addLabel('Cocina común', 'roble y mesada negra; heladera en la columna junto a la puerta al jardín', 3.9, 6.5, 1.0);
addLabel('Patio con sillones', 'baldosa gris y cuatro sillones negros', 10.2, 10.6, 0.5);
addLabel('Sala y comedor comunes', 'mesa larga de madera, sofá frente a la TV', 4.0, 10.3, 0.9);
addLabel('Escalera', '', 4.2, 1.6, 0.9);
addLabel('Puerta de entrada', 'madera con paño fijo, desde el patio', 8.3, 7.6, 1.4);
addLabel('Depósito · sin acceso', '', 3.6, 8.0, 1.6, 'sub', true);
addLabel('Matafuego', 'al pie de la escalera', 0.62, 0.62, 1.9, 'sub', true);
addLabel('Rampa del garaje', '', 3.6, 24.0, 0.4, 'pb');
addLabel('Paraiso', 'dormitorio, living, cocina y comedor', 5.6, 12.8, 1.0, 'p1');
addLabel('Terrazzo', 'dormitorio, living con cocina, salida al balcón', 5.6, 6.0, 1.0, 'p1');
addLabel('Balcón', 'deck de madera, plantas, sillones de ratán', 10.0, 3.2, 0.6, 'p1');
addLabel('Living con cocina', 'ventana de esquina al noreste', 10.6, 5.6, 1.0, 'p2');
addLabel('Dormitorio', '', 10.0, 1.6, 1.0, 'p2');
addLabel('Quincho', 'parrilla de ladrillo y bacha', 3.4, 6.2, 1.0, 'p2');
addLabel('Terraza', 'deck, canteros con pastos, mesa para 6', 3.6, 13.0, 0.6, 'p2');
addLabel('Puerta de Giardino', 'desde el vestíbulo', 8.32, 5.3, 1.4);

// --- ракурсы: точка — где снято видео и фото; конус показывает, куда смотрит камера.
// Нажатие: камера встаёт в эту точку, видео обхода перематывается на это место, ниже — фото
const panel = document.getElementById('photo'), vid = panel.querySelector('video'), pImg = panel.querySelector('img.big'),
  pCap = panel.querySelector('.cap'), pUse = panel.querySelector('.use'), pTh = panel.querySelector('.th');
const EYE = 1.6, cams = [];
const NOVID = !!window.NOVID;   // версия для «Страниц» хаба: видеофайла нет, точка показывает ракурс и фото
if (NOVID) vid.style.display = 'none';
let curCam = null;
function showPhoto(c, i) {
  const p = c.photos[i];
  pImg.style.display = pUse.style.display = p ? '' : 'none';
  pTh.innerHTML = '';
  if (!p) return;
  pImg.src = PH[p.k]; pUse.textContent = T(p.use);
  if (c.photos.length > 1) c.photos.forEach((q, j) => { const im = new Image(); im.src = PH[q.k]; if (j === i) im.className = 'on'; im.onclick = e => { e.stopPropagation(); showPhoto(c, j); }; pTh.appendChild(im); });
}
function openCam(c, fly = true) {
  curCam = c; cams.forEach(k => k.el.classList.toggle('on', k === c));
  pCap.textContent = T(c.name);
  if (!qs.has('still') && !NOVID) {
    if (!vid.getAttribute('src')) vid.src = (/\/3d\/?$/.test(location.pathname) ? '/3d/' : '') + 'walk.mp4';   // на сайте страница открыта как /3d, /en/3d… — видео одно
    const go = () => { vid.currentTime = c.t; vid.play().catch(() => {}); };
    vid.readyState >= 1 ? go() : vid.addEventListener('loadedmetadata', go, { once: true });
    vid.load && vid.readyState === 0 && vid.load();
  }
  showPhoto(c, 0);
  panel.classList.add('show'); resize();
  if (fly) {
    setFloor(c.fl);
    controls.minDistance = 0.2;
    const e = new THREE.Vector3(c.x, FL[c.fl] + c.z, -c.y), d = new THREE.Vector3(c.lx - c.x, 0, -(c.ly - c.y)).normalize();
    goTo(e.clone().addScaledVector(d, -0.01), e.clone().addScaledVector(d, 1.2));
  }
}
pImg.addEventListener('load', () => { if (panel.classList.contains('show')) resize(); });   // высота панели меняется, когда фото готово
function closeCam() { panel.classList.remove('show'); vid.pause(); if (curCam) curCam.cone.visible = curCam.fl === curF && camsOn; curCam = null; cams.forEach(k => k.el.classList.remove('on')); resize(); }
panel.onclick = e => e.stopPropagation();
panel.querySelector('.x').onclick = closeCam;
addEventListener('keydown', e => { if (e.key === 'Escape') closeCam(); });
const coneMat = new THREE.MeshBasicMaterial({ color: 0x4aa3ff, transparent: true, opacity: 0.45, side: THREE.DoubleSide, depthWrite: false });
const coneEdge = new THREE.LineBasicMaterial({ color: 0x1d5fa8 });
function addCam(name, fl, t, [x, y], [lx, ly], photos = [], z = EYE) {
  const c = { name, fl, t, x, y, lx, ly, z, photos };
  // конус взгляда: вершина в глазу, раскрыв по направлению (горизонтальный угол ~60°)
  const g = new THREE.Group(), L = 0.95, geo = new THREE.ConeGeometry(L * 0.58, L, 4, 1, true);
  geo.translate(0, -L / 2, 0); geo.rotateX(-Math.PI / 2); geo.rotateZ(Math.PI / 4); geo.scale(1, 0.6, 1);
  g.add(new THREE.Mesh(geo, coneMat), new THREE.LineSegments(new THREE.EdgesGeometry(geo), coneEdge));
  g.position.set(x, z, -y);
  g.rotation.set(0, Math.atan2(-(lx - x), (ly - y)) + Math.PI, 0);
  floors[fl].add(g); c.cone = g;
  const el = document.createElement('div');
  el.className = 'dot cam';
  el.innerHTML = '<i></i><div class="tip"><b>' + T(name) + '</b><span>' + camTip(photos.length, NOVID) + '</span></div>';
  el.onclick = e => { e.stopPropagation(); labels.forEach(l => l.el.classList.remove('open')); openCam(c); };
  labelsEl.appendChild(el); c.el = el; cams.push(c);
  labels.push({ el, pos: new THREE.Vector3(x, z + FL[fl], -y), fl, cam: c });
}
const ph = (k, use) => ({ k, use });
// подвал и улица (снято с земли: z — над отметкой подвала)
addCam('Portón del garaje', 'sub', 12, [3.6, 32], [3.6, 12.6], [ph('acceso', 'rampa de entrada al terreno y muro de hormigón.')], -FL.sub + EYE);
// planta baja
addCam('Patio de entrada', 'pb', 54, [12.6, 10.8], [8.3, 7.6], [
  ph('patio1', 'patio con baldosa gris, muro de hormigón con encofrado, cuatro sillones negros y puerta de madera con paño fijo.'),
  ph('patio2', 'cuatro sillones negros, ventana negra chica en el muro, puerta de entrada con marco de madera.'),
  ph('patio3', 'sillones negros y ventana grande con marco negro.'),
  ph('fachada', 'hormigón visto con textura de encofrado, ventanas negras.')]);
addCam('Puerta y vestíbulo', 'pb', 66, [8.3, 8.6], [8.3, 5.3], [
  ph('vest1', 'puerta de madera con listones verticales y paño fijo vidriado; adentro, banco con zapatero.'),
  ph('vest2', 'banco blanco con almohadón gris y cerradura electrónica.'),
  ph('vest3', 'puerta de madera abierta hacia el vestíbulo blanco.'),
  ph('perchero', 'perchero negro con zapatero y puerta blanca hacia Giardino.')]);
addCam('Giardino · living', 'pb', 90, [9.5, 4.4], [12.4, 7.1], [
  ph('par_sala1', 'mesa redonda blanca con sillas grises, TV en la pared, esquina vidriada con marco negro y cortinas.'),
  ph('par_sala2', 'ventana de esquina, aire acondicionado, TV, cocina en el costado.')]);
addCam('Giardino · cocina', 'pb', 114, [12.1, 4.9], [10.4, 3.4], [
  ph('par_cocina1', 'mesada negra y muebles de roble, alacenas blancas, bacha de acero.'),
  ph('par_cocina2', 'alacenas blancas, grifería negra.'),
  ph('par_heladera', 'heladera blanca en la punta de la cocina.')]);
addCam('Giardino · dormitorio', 'pb', 168, [8.4, 2.6], [12.0, 0.8], [
  ph('par_dorm', 'cama con respaldo gris tapizado, ventana negra con cortina.'),
  ph('par_placard', 'placard blanco de piso a techo con tiradores negros.')]);
addCam('Giardino · baño', 'pb', 204, [6.8, 4.5], [5.2, 3.8], [ph('par_bano', 'ducha con mampara de vidrio y marco negro, lavarropas, inodoro, bacha blanca.')]);
addCam('Sala común', 'pb', 222, [6.7, 6.6], [3.0, 14.0], [
  ph('pasillo', 'paso hacia la zona común: ventana negra, piso símil madera.'),
  ph('sala1', 'ventana larga con vidrios divididos, sofá, techo de hormigón con huellas de tablas.'),
  ph('sala2', 'sofá gris grande, TV, celosía de madera sobre la ventana.'),
  ph('sala_fondo', 'sala al fondo con mesa de madera y ventanas negras.')]);
addCam('Cocina común', 'pb', 246, [4.0, 7.3], [3.9, 5.3], [
  ph('cc1', 'muebles de roble, mesada negra, estantes abiertos, campana blanca, horno.'),
  ph('cc2', 'frente completo de roble con estantes abiertos.'),
  ph('cc3', 'alacena de roble con vajilla.'),
  ph('heladera', 'heladera de acero de dos puertas junto a la columna blanca.')]);
addCam('Baño de invitados', 'pb', 312, [2.0, 4.6], [2.9, 3.3], [ph('bano2', 'ducha con mampara, estante negro con toallas, inodoro.')]);
addCam('Escalera', 'pb', 330, [1.4, 1.7], [6.0, 1.7], [
  ph('esc1', 'escalera de hormigón con baranda de cables negros y pasamanos de madera.'),
  ph('esc2', 'tramo superior con ventana negra y techo de hormigón.')]);
// 2° piso
addCam('Pasillo del 2° piso', 'p2', 366, [0.9, 3.4], [0.9, 7.5]);
addCam('Terraza', 'p2', 438, [3.6, 16.2], [4.5, 8.0]);
addCam('Quincho', 'p2', 384, [3.4, 7.9], [3.3, 4.6]);
addCam('Penthouse · living', 'p2', 480, [8.6, 4.4], [12.5, 7.2]);
addCam('Penthouse · cocina', 'p2', 492, [11.8, 6.2], [7.7, 5.9]);
addCam('Penthouse · dormitorio', 'p2', 504, [11.9, 2.6], [9.6, 0.6]);   // за открытой створкой двери, иначе вид упирается в неё
// 1° piso
addCam('Pasillo del 1° piso', 'p1', 546, [0.9, 3.4], [0.9, 12.0]);
addCam('Terrazzo · living', 'p1', 558, [2.3, 6.6], [6.9, 5.5]);
addCam('Balcón', 'p1', 582, [7.9, 6.2], [12.0, 1.5]);
addCam('Terrazzo · dormitorio', 'p1', 636, [6.6, 5.4], [3.2, 4.0]);
addCam('Paraiso · dormitorio', 'p1', 672, [3.3, 14.4], [1.0, 16.2]);
addCam('Paraiso · living', 'p1', 690, [5.9, 12.6], [5.9, 16.5]);
addCam('Paraiso · cocina', 'p1', 720, [6.4, 13.2], [4.3, 10.8]);

document.addEventListener('click', () => labels.forEach(l => l.el.classList.remove('open')));

// --- этажи: виден выбранный и всё, что ниже
const ORDER = ['sub', 'pb', 'p1', 'p2', 'roof'];
let curF = 'all';
function visibleFor(fl) { return curF === 'all' ? true : ORDER.indexOf(fl) <= ORDER.indexOf(curF); }
function labelOn(l) { return l.fl === curF; }
function setFloor(f) {
  curF = f;
  ORDER.forEach(n => { if (floors[n]) floors[n].visible = visibleFor(n); });
  cams.forEach(c => c.cone.visible = c.fl === f && camsOn && c !== curCam);   // стоя в точке, свой конус не заслоняет вид
  lawn.visible = f !== 'sub';
  const cut = { sub: 0.3, pb: FL.p1, p1: FL.p2, p2: FL.roof }[f];   // на этаже сосна — пенёк до верха этажа: место видно, план не закрыт
  pineTops.forEach(({ top, t, h }) => { top.visible = !cut; t.visible = f !== 'sub';   // в подвале земли нет — пеньки висели бы в воздухе
    const k = cut ? Math.min(1, cut / h) : 1; t.scale.y = k; t.position.y = h * k / 2; });
}
let anim = null;
function goTo(p, t, instant) {
  if (instant) { camera.position.copy(p); controls.target.copy(t); return; }
  anim = { from: { p: camera.position.clone(), t: controls.target.clone() }, to: { p, t }, k: 0 };
}

// --- навигация: этаж → квартира/зона → комната; каждый пункт — свой вид, рассчитанный по габаритам
const B = { house: [0, 0, 12.75, 18.0] };
const NAV = [
  { id: 'all', name: 'Todo', f: 'all', az: [9, -1.5] },   // с востока: вход, патио, балкон и терраса; с юго-запада дом закрыт соснами
  { id: 'p2', name: '2° piso', f: 'p2', kids: [
    { id: 'p2-terraza', name: 'Terraza', box: [0, 7.5, 7.95, 18.0] },
    { id: 'p2-quincho', name: 'Quincho', box: [1.6, 4.4, 4.9, 8.6] },
    { id: 'p2-penthouse', name: 'Penthouse', box: [1.55, 0, 12.75, 7.51], kids: [
      { id: 'p2-living', name: 'Living', box: [7.2, 3.17, 12.75, 7.51] },
      { id: 'p2-dorm', name: 'Dormitorio', box: [7.2, 0, 12.75, 3.17] }] }] },
  { id: 'p1', name: '1° piso', f: 'p1', kids: [
    { id: 'p1-terrazzo', name: 'Terrazzo', box: [1.55, 3.03, 7.31, 9.86], kids: [
      { id: 'p1-sur-living', name: 'Living', box: [3.9, 3.03, 7.31, 9.86] },
      { id: 'p1-sur-dorm', name: 'Dormitorio', box: [1.55, 3.03, 5.3, 5.92] },
      { id: 'p1-balcon', name: 'Balcón', box: [7.31, 0, 12.75, 7.51] }] },
    { id: 'p1-paraiso', name: 'Paraiso', box: [0, 9.86, 7.31, 16.9], az: [-1, -0.5], el: 1.45, kids: [   // почти сверху: видны обе кровати, гостиная и кухня
      { id: 'p1-norte-living', name: 'Living y cocina', box: [3.9, 9.86, 7.31, 16.9] },
      { id: 'p1-norte-dorm', name: 'Dormitorio', box: [0, 13.81, 4.14, 16.9], az: [-1, -0.5], el: 1.45 }] }] },   // почти сверху с северо-запада: с юго-запада южную кровать закрывает стена, с востока — створка двери и метка фото
  { id: 'pb', name: 'Planta baja', f: 'pb', kids: [
    { id: 'pb-giardino', name: 'Giardino', box: [7.2, 0, 12.75, 7.51], kids: [
      { id: 'pb-par-living', name: 'Living', box: [9.04, 3.25, 12.75, 7.51] },
      { id: 'pb-par-dorm', name: 'Dormitorio', box: [7.2, 0, 12.75, 3.25] }] },
    { id: 'pb-comun', name: 'Sala común', box: [0, 5.15, 7.31, 15.51], kids: [
      { id: 'pb-sala', name: 'Sala', box: [0, 7.8, 7.31, 15.51] },
      { id: 'pb-cocina', name: 'Cocina', box: [0, 5.15, 7.31, 8.2] }] },
    { id: 'pb-patio', name: 'Patio', box: [7.31, 7.51, 13.4, 12.0] }] },
  { id: 'sub', name: 'Subsuelo', f: 'sub', kids: [
    { id: 'sub-garaje', name: 'Depósito', box: [0, 3.0, 12.75, 12.62] },
    { id: 'sub-escalera', name: 'Escalera', box: [0, 0, 7.27, 3.0], az: [0, -1] }] },   // с севера: с юго-запада угол с огнетушителем закрыт стенами
];
const byId = {};
(function walk(list, parent, f) { list.forEach(n => { n.parent = parent; n.f = n.f || f; n.box = n.box || B.house; byId[n.id] = n; if (n.kids) walk(n.kids, n, n.f); }); })(NAV, null, null);
const AZ = new THREE.Vector3(-16, 0, 20.5).normalize();   // с юго-запада, как изометрия
let curNav = null, plan = false;
const NAVW = 230;   // ширина левой навигации на десктопе: вид центрируется в свободной части экрана
function freeAspect() { const w = innerWidth, h = innerHeight; return w >= 700 ? (w - NAVW) / h : w / h; }
function navView(n) {
  const [x0, y0, x1, y1] = n.id === 'all' ? B.house : n.box, w = x1 - x0, h = y1 - y0, top = !n.parent;
  const hgt = n.id === 'all' ? FL.roof + 1 : top ? 2.7 : 2.7;
  const base = n.id === 'all' ? 0 : FL[n.f];
  const t = new THREE.Vector3((x0 + x1) / 2, base + (n.id === 'all' ? 3.5 : top ? 0.6 : 1.0), -(y0 + y1) / 2);
  const el = plan ? 1.55 : n.el != null ? n.el : n.id === 'all' ? 0.42 : top ? 0.82 : 1.0;   // n.el — свой наклон пункта; в «Плане» не действует
  // видимые размеры прямоугольника с этого азимута и угла; расстояние — чтобы он целиком влез в кадр
  const AZn = n.az ? new THREE.Vector3(n.az[0], 0, n.az[1]).normalize() : AZ;
  const ax = Math.abs(AZn.x), az = Math.abs(AZn.z);
  const sw = plan ? w : w * az + h * ax, sh = plan ? h : (w * ax + h * az) * Math.sin(el) + hgt * Math.cos(el);
  const fov = 38 * Math.PI / 180, asp = freeAspect();
  const d = Math.max(sh, sw / asp) / (2 * Math.tan(fov / 2)) * (n.id === 'all' ? 1.3 : top ? 1.12 : 1.25) + (plan ? hgt : (w * ax + h * az) / 2 * Math.cos(el) + (n.el != null ? (hgt - 1.0) * Math.sin(el) : 0));   // крутой свой наклон: верх стен ближе к камере, отступаем на него
  const dir = plan ? new THREE.Vector3(0, 1, 0.0001) : AZn.clone().multiplyScalar(Math.cos(el)).setY(Math.sin(el));
  return [t.clone().add(dir.normalize().multiplyScalar(d)), t];
}
const navEl = document.getElementById('nav'), navL = document.getElementById('navl'), navT = document.getElementById('navt');
function renderNav() {
  const path = new Set(); for (let n = curNav; n; n = n.parent) path.add(n);
  const ul = (list) => '<ul>' + list.map(n => '<li><button data-n="' + n.id + '" class="' + (n === curNav ? 'on' : path.has(n) ? 'path' : '') + '">' + T(n.name) + '</button>' + (n.kids && path.has(n) ? ul(n.kids) : '') + '</li>').join('') + '</ul>';
  navL.innerHTML = ul(NAV).slice(4, -5);
  navT.textContent = '☰ ' + [...path].reverse().map(n => T(n.name)).join(' · ');
  navL.querySelectorAll('button').forEach(b => b.onclick = e => { e.stopPropagation(); go(byId[b.dataset.n]); });
}
navT.onclick = e => { e.stopPropagation(); navEl.classList.toggle('fold'); };
function go(n, instant) {
  curNav = n; closeCam(); controls.minDistance = 2;
  if (innerWidth < 700 && !instant) navEl.classList.add('fold');   // телефон: выбрал пункт — меню сворачивается, выбранное не остаётся под ним (Иван)
  setFloor(n.f); renderNav();
  const [p, t] = navView(n); goTo(p, t, instant);
}
document.getElementById('second').onchange = e => document.body.classList.toggle('nodots', !e.target.checked);
let camsOn = true;
document.getElementById('fotos').onchange = e => { camsOn = e.target.checked; document.body.classList.toggle('nocams', !camsOn); setFloor(curF); };
document.getElementById('plan').onchange = e => { plan = e.target.checked; if (curNav) go(curNav); };

// --- размер: открытая панель с видео не закрывает вид — центр кадра сдвигается в свободную часть экрана
function resize() {
  const w = innerWidth, h = innerHeight, desk = w >= 700;
  renderer.setSize(w, h);
  const open = panel.classList.contains('show');
  camera.fov = 38;
  if (desk) {
    const dl = NAVW - (open ? panel.offsetWidth + 20 : 0), fw = w + Math.abs(dl);
    camera.aspect = fw / h; camera.setViewOffset(fw, h, dl < 0 ? -dl : 0, 0, w, h);
    if (open) camera.fov = 2 * Math.atan(Math.tan(32 * Math.PI / 180) * h / (w - panel.offsetWidth - 20)) * 180 / Math.PI;   // в точке съёмки: ~64° по ширине свободной части
  } else if (open) {
    const ph2 = panel.offsetHeight + 16; camera.aspect = w / (h + ph2); camera.setViewOffset(w, h + ph2, 0, ph2, w, h);
    camera.fov = 2 * Math.atan(Math.tan(32 * Math.PI / 180) * (h + ph2) / w) * 180 / Math.PI;   // телефон в точке съёмки: обзор ~64° по ширине, а не узкая щель
  }
  else { camera.aspect = w / h; camera.clearViewOffset(); }
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();
const qs = new URLSearchParams(location.search);
const OLD = { 'pb-paraiso': 'pb-giardino', 'p1-norte': 'p1-paraiso', 'p1-sur': 'p1-terrazzo', 'p2-depto': 'p2-penthouse' };
go(byId[OLD[qs.get('n')] || qs.get('n') || 'all'] || byId.all, true);
if (innerWidth < 700 && !qs.has('navopen')) navEl.classList.add('fold');
if (qs.has('cam')) { const c = cams.find(k => k.t === +qs.get('cam')); if (c) { openCam(c, false); setFloor(c.fl); controls.minDistance = 0.2; const e = new THREE.Vector3(c.x, FL[c.fl] + c.z, -c.y), d = new THREE.Vector3(c.lx - c.x, 0, -(c.ly - c.y)).normalize(); goTo(e.clone().addScaledVector(d, -0.01), e.clone().addScaledVector(d, 1.2), true); } }
if (qs.has('eye')) { const [fl, x, y, z, lx, ly, lz] = qs.get('eye').split(','); const f = +FL[fl] || 0; setFloor(fl); controls.minDistance = 0.2; goTo(new THREE.Vector3(+x, f + +z, -y), new THREE.Vector3(+lx, f + +lz, -ly), true); }   // проверочный ракурс
if (qs.has('tip')) labels[+qs.get('tip')].el.classList.add('open');   // для проверочных кадров

const tmp = new THREE.Vector3();
let still = qs.has('still'), n = 0;
function frame() {
  if (!still || n++ < 1) requestAnimationFrame(frame);
  if (anim) {
    anim.k = Math.min(1, anim.k + 0.045);
    const e = 1 - Math.pow(1 - anim.k, 3);
    camera.position.lerpVectors(anim.from.p, anim.to.p, e);
    controls.target.lerpVectors(anim.from.t, anim.to.t, e);
    if (anim.k >= 1) anim = null;
  }
  controls.update();
  const cd = camera.position.distanceTo(controls.target);   // туман от расстояния до дома: издалека (телефон) дом не выбеливается
  scene.fog.near = cd + 25; scene.fog.far = cd + 110;
  renderer.render(scene, camera);
  const w = innerWidth, h = innerHeight;
  labels.forEach(l => {
    tmp.copy(l.pos).project(camera);
    l.el.style.display = tmp.z < 1 && Math.abs(tmp.x) < 1.2 && Math.abs(tmp.y) < 1.2 && labelOn(l) && l.cam !== curCam ? '' : 'none';
    l.el.style.transform = 'translate(' + ((tmp.x * 0.5 + 0.5) * w) + 'px,' + ((-tmp.y * 0.5 + 0.5) * h) + 'px)';
  });
}
frame();

// --- язык страницы и ссылка на сайт (в «Страницах» хаба и в локальном файле сайта рядом нет)
document.documentElement.lang = LANG;
document.title = 'Il Buco · Cariló · ' + { es: 'Tour 3D', en: '3D Tour', pt: 'Tour 3D', ru: '3D-тур' }[LANG];
document.querySelectorAll('#nav .opts label').forEach(l => { const s = l.lastChild; s.textContent = T(s.textContent); });
panel.querySelector('.x').setAttribute('aria-label', T('Cerrar'));
const homeEl = document.getElementById('home');
if (NOVID || !/^https?:/.test(location.protocol)) homeEl.remove(); else homeEl.href = LANG === 'es' ? '/' : '/' + LANG;
