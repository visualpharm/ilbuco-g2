// --- прогулка от первого лица (Иван, 13.11: «чтоб можно было по нему ходить, двери открывать… активные облачка… в другую комнату перейти»).
// Стрелки/WASD — шаги и повороты, перетаскивание — взгляд, касание пола — идти туда, касание двери или E — открыть/закрыть.
// Облачко над проёмом переводит в соседнюю комнату, над лестницей — на соседний этаж. Стены и мебель не пускают: сетка проходимости
// строится из той же геометрии, что видна на экране (ячейка 10 см на каждом этаже)
walker = (function () {
  const LV = ['sub', 'pb', 'p1', 'p2'];
  const GX0 = -12, GY0 = -12, CS = 0.1, GW = 380, GH = 460;   // участок вокруг дома: x −12…26, y −12…34
  const R = 0.22, EYEW = 1.6, SPEED = 1.7, TURN = 1.9;
  // комнаты: сначала маленькие (поиск по первому совпадению); n — название по частям, c — надпись облачка, если не последняя часть;
  // at — где встать и куда смотреть; st — здесь лестница
  const ROOMS = [
    { id: 'gi-bano', fl: 'pb', n: ['Baño de Giardino'], b: [[4.42, 3.13, 7.2, 5.02]] },
    { id: 'pb-inv', fl: 'pb', n: ['Baño de invitados'], b: [[1.55, 3.13, 4.42, 5.02]] },
    { id: 'gi-dorm', fl: 'pb', n: ['Giardino', 'Dormitorio'], b: [[7.31, 0.35, 12.75, 3.25]] },
    { id: 'vest', fl: 'pb', n: ['Vestíbulo'], b: [[7.31, 5.2, 9.04, 7.51]], at: [8.3, 6.8, 3.0, 6.3] },   // взгляд на запад, сквозь проём в общий зал: прихожая 1,7 м, в любую другую сторону — стена или дверь впритык
    { id: 'gi', fl: 'pb', n: ['Giardino'], b: [[7.31, 3.25, 12.75, 5.2], [9.04, 5.2, 12.75, 7.51]], at: [9.5, 4.4, 12.4, 7.1] },
    { id: 'pb-esc', fl: 'pb', n: ['Escalera'], b: [[0, 0, 7.2, 3.03], [0.35, 3.03, 1.55, 5.15]], st: 1, at: [1.0, 1.8, 5.0, 1.0] },
    { id: 'patio', fl: 'pb', n: ['Patio'], b: [[7.31, 7.51, 13.4, 12.5]], at: [12.6, 10.8, 8.3, 7.6] },
    { id: 'pb-comun', fl: 'pb', n: ['Sala común'], b: [[0.35, 5.15, 7.31, 14.66]], at: [6.7, 6.6, 3.0, 14.0] },
    { id: 'jardin', fl: 'pb', n: ['Jardín'], b: [], at: [-2.2, 6.25, 0, 6.25], keep: 1 },   // keep: выйдя в сад, не оборачиваться к дому
    { id: 'sub-esc', fl: 'sub', n: ['Escalera', 'Subsuelo'], b: [[0, 0, 7.27, 3.0]], st: 1, at: [1.0, 1.6, 5.0, 1.0] },
    { id: 'tz-bano', fl: 'p1', n: ['Baño de Terrazzo'], b: [[1.55, 7.3, 3.9, 9.86]] },
    { id: 'pa-bano', fl: 'p1', n: ['Baño de Paraiso'], b: [[1.55, 9.86, 3.9, 12.49]] },
    { id: 'pa-dorm', fl: 'p1', n: ['Paraiso', 'Dormitorio'], b: [[0.35, 13.81, 4.14, 16.9]] },
    { id: 'p1-esc', fl: 'p1', n: ['Pasillo', '1° piso'], c: 'Pasillo', b: [[0, 0, 7.2, 3.03], [0.35, 3.03, 1.55, 12.49]], st: 1, at: [0.9, 3.4, 0.9, 12] },
    { id: 'tz', fl: 'p1', n: ['Terrazzo'], b: [[1.55, 3.03, 7.31, 9.86]], at: [2.3, 6.6, 6.9, 5.5] },
    { id: 'balcon', fl: 'p1', n: ['Balcón'], b: [[7.31, 0, 13.43, 8.17]], at: [8.6, 5.75, 12.4, 2.0] },
    { id: 'pa', fl: 'p1', n: ['Paraiso'], b: [[0.35, 12.49, 4.14, 13.81], [3.9, 9.86, 7.31, 16.9]], at: [5.9, 12.6, 5.9, 16.5] },
    { id: 'ph-bano', fl: 'p2', n: ['Baño del Penthouse'], b: [[4.9, 4.44, 7.2, 7.51]] },
    { id: 'quincho', fl: 'p2', n: ['Quincho'], b: [[2.03, 4.4, 4.83, 7.51]] },
    { id: 'ph-dorm', fl: 'p2', n: ['Penthouse', 'Dormitorio'], b: [[7.2, 0.35, 12.75, 3.17]] },
    { id: 'p2-esc', fl: 'p2', n: ['Pasillo', '2° piso'], c: 'Pasillo', b: [[0, 0, 7.2, 3.03], [0.35, 3.03, 1.55, 7.51]], st: 1, at: [0.95, 3.6, 0.95, 7.3] },
    { id: 'ph', fl: 'p2', n: ['Penthouse'], b: [[1.55, 3.03, 7.2, 4.44], [7.2, 3.17, 12.75, 7.51]], at: [8.6, 4.4, 12.5, 7.2] },
    { id: 'terraza', fl: 'p2', n: ['Terraza'], b: [[0, 7.51, 7.95, 18.0]], at: [3.6, 16.2, 4.5, 8.0] },
  ];
  const RM = {}; ROOMS.forEach(r => RM[r.id] = r);
  // переходы: комната a, комната b, точка проёма, точка перед ним со стороны a, со стороны b; p — свой путь от a к b, ca/cb — где облачко;
  // fa/fb — куда смотреть, придя в a или в b (иначе — к главной точке комнаты)
  const LINKS = [
    ['jardin', 'pb-comun', [0, 6.25], [-0.7, 6.25], [0.8, 6.25]],
    ['jardin', 'patio', null, null, null, { p: [[-1.6, 4.5], [-1.6, -1.6], [14.3, -1.6], [14.3, 9.5], [12.6, 10.8]], ca: [-1.3, 2.0], cb: [13.6, 9.4] }],
    ['patio', 'vest', [8.3, 7.46], [8.3, 8.2], [8.3, 6.8]],
    ['vest', 'gi', [8.32, 5.2], [8.32, 5.8], [8.32, 4.5], { fa: [8.3, 8.2] }],
    ['vest', 'pb-comun', [7.31, 6.4], [7.7, 6.4], [6.0, 6.5], { fa: [8.3, 5.2] }],
    ['gi', 'gi-dorm', [8.37, 3.25], [8.37, 3.9], [8.37, 2.6]],
    ['gi', 'gi-bano', [7.2, 4.57], [7.8, 4.57], [6.6, 4.57]],
    ['pb-esc', 'pb-inv', [1.55, 4.57], [0.95, 4.57], [2.1, 4.57]],
    ['pb-esc', 'pb-comun', [0.95, 5.15], [0.95, 4.5], [0.95, 5.8]],
    ['p1-esc', 'tz', [1.55, 6.45], [0.95, 6.45], [2.2, 6.45]],
    ['p1-esc', 'pa', [0.92, 12.49], [0.92, 11.9], [0.92, 13.1]],
    ['tz', 'tz-bano', [2.7, 7.3], [2.7, 6.7], [2.7, 7.9]],
    ['tz', 'balcon', [7.31, 5.5], [6.6, 5.5], [8.4, 5.75]],
    ['pa', 'pa-bano', [3.3, 12.49], [3.3, 13.1], [3.3, 11.9]],
    ['pa', 'pa-dorm', [2.9, 13.81], [2.9, 13.2], [2.9, 14.4]],
    ['p2-esc', 'ph', [1.55, 3.7], [0.95, 3.7], [2.2, 3.65]],
    ['p2-esc', 'terraza', [1.05, 7.51], [1.0, 6.8], [1.0, 8.3]],
    ['ph', 'ph-bano', [5.8, 4.44], [5.8, 3.8], [5.8, 5.1]],
    ['ph', 'ph-dorm', [8.5, 3.17], [8.5, 3.8], [8.5, 2.5]],
    ['terraza', 'quincho', [3.45, 7.51], [3.3, 7.85], [3.45, 6.6]],
  ];
  // лестницы: П-образные марши (scene.js, stairU) — первый вдоль южной стены на восток, второй вдоль северной на запад
  const STAIRS = [
    { lo: 'sub', hi: 'pb', up: 'Subir a planta baja', down: 'Bajar al subsuelo' },
    { lo: 'pb', hi: 'p1', up: 'Subir al 1° piso', down: 'Bajar a planta baja' },
    { lo: 'p1', hi: 'p2', up: 'Subir al 2° piso', down: 'Bajar al 1° piso' },
  ];
  STAIRS.forEach(s => { s.rise = FL[s.hi] - FL[s.lo]; s.x0 = stairX0(s.rise); });
  const YA = 0.98, YB = 2.29;   // середины маршей
  const STAIR_FACE = { pb: [0.95, 6.5], p1: [0.9, 12], p2: [1.0, 7.6] };   // сойдя с лестницы — лицом к коридору, а не в стену
  const STAIR_EXIT = { pb: [0.95, 2.6], p1: [0.95, 2.7], p2: [0.95, 2.7] };
  function stairPath(s, up) {
    const { x0, rise: r } = s, b = FL[s.lo], m = (STAIR_LAND + STAIR_END) / 2;
    const P = [[x0 - 0.5, YA, b], [x0, YA, b], [STAIR_LAND, YA, b + r / 2], [m, YA, b + r / 2], [m, YB, b + r / 2], [STAIR_LAND, YB, b + r / 2], [x0, YB, b + r], [x0 - 0.5, YB, b + r]];
    if (!up) P.reverse();
    const ex = STAIR_EXIT[up ? s.hi : s.lo];   // сойдя с марша — шаг к устью коридора, чтобы он был виден
    if (ex) P.push([ex[0], ex[1], up ? b + r : b]);
    return P;
  }

  // --- сетка: 1 — пол этажа, 2 — препятствие на высоте тела, 4 — стена выше головы (заслоняет облачка)
  let grids = null;
  function buildGrids() {
    grids = {}; LV.forEach(l => grids[l] = new Uint8Array(GW * GH));
    const skip = new Set(pineTops.map(p => p.top)), v = [0, 1, 2].map(() => new THREE.Vector3());
    const e1 = new THREE.Vector3(), e2 = new THREE.Vector3();
    scene.updateMatrixWorld(true);
    (function visit(o) {
      if (o.userData.door || o.userData.nohit || skip.has(o)) return;
      if (o.isMesh) {
        const pos = o.geometry.attributes.position, idx = o.geometry.index, n = idx ? idx.count : pos.count;
        for (let t = 0; t < n; t += 3) {
          for (let k = 0; k < 3; k++) v[k].fromBufferAttribute(pos, idx ? idx.getX(t + k) : t + k).applyMatrix4(o.matrixWorld);
          const lo = Math.min(v[0].y, v[1].y, v[2].y), hi = Math.max(v[0].y, v[1].y, v[2].y);
          e1.subVectors(v[1], v[0]); e2.subVectors(v[2], v[0]); e1.cross(e2);
          const up = e1.y / (e1.length() || 1);
          const tri = [v[0].x, -v[0].z, v[1].x, -v[1].z, v[2].x, -v[2].z];
          LV.forEach(l => {
            const b = FL[l], g = grids[l];
            if (up > 0.7 && lo >= b - 0.3 && hi <= b + 0.3) mark(g, 1, tri, true);
            if (lo < b + 1.5 && hi > b + 0.3) mark(g, 2, tri, true);
            if (lo < b + 1.95 && hi > b + 1.75) mark(g, 4, tri, false);
          });
        }
      }
      o.children.forEach(visit);
    })(scene);
  }
  const ci = x => Math.floor((x - GX0) / CS), cj = y => Math.floor((y - GY0) / CS);
  function setC(g, i, j, bit) { if (i >= 0 && j >= 0 && i < GW && j < GH) g[j * GW + i] |= bit; }
  function line(g, bit, ax, ay, bx, by) {
    const n = Math.ceil(Math.hypot(bx - ax, by - ay) / 0.05) + 1;
    for (let k = 0; k <= n; k++) setC(g, ci(ax + (bx - ax) * k / n), cj(ay + (by - ay) * k / n), bit);
  }
  function mark(g, bit, [ax, ay, bx, by, cx, cy], fill) {
    line(g, bit, ax, ay, bx, by); line(g, bit, bx, by, cx, cy); line(g, bit, cx, cy, ax, ay);
    const A = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    if (!fill || Math.abs(A) < 1e-4) return;
    const i0 = Math.max(0, ci(Math.min(ax, bx, cx))), i1 = Math.min(GW - 1, ci(Math.max(ax, bx, cx)));
    const j0 = Math.max(0, cj(Math.min(ay, by, cy))), j1 = Math.min(GH - 1, cj(Math.max(ay, by, cy)));
    for (let j = j0; j <= j1; j++) {
      const y = GY0 + (j + 0.5) * CS;
      for (let i = i0; i <= i1; i++) {
        const x = GX0 + (i + 0.5) * CS;
        const w0 = (bx - x) * (cy - y) - (by - y) * (cx - x), w1 = (cx - x) * (ay - y) - (cy - y) * (ax - x), w2 = (ax - x) * (by - y) - (ay - y) * (bx - x);
        if (A > 0 ? w0 >= 0 && w1 >= 0 && w2 >= 0 : w0 <= 0 && w1 <= 0 && w2 <= 0) g[j * GW + i] |= bit;
      }
    }
  }
  function cell(l, x, y) { const i = ci(x), j = cj(y); return i < 0 || j < 0 || i >= GW || j >= GH ? 2 : grids[l][j * GW + i]; }
  const RING = [];
  for (let a = 0; a < 12; a++) RING.push([R * Math.cos(a * Math.PI / 6), R * Math.sin(a * Math.PI / 6)]);
  for (let a = 0; a < 6; a++) RING.push([R / 2 * Math.cos(a * Math.PI / 3), R / 2 * Math.sin(a * Math.PI / 3)]);
  function free(l, x, y) {
    const c = cell(l, x, y);
    if (!(c & 1) || c & 2) return false;
    return RING.every(([dx, dy]) => !(cell(l, x + dx, y + dy) & 2));
  }
  // двери: створка — отрезок от петли длиной w под текущим углом
  function doorSeg(d) { const a = d.base + d.k * d.turn; return [d.hx, d.hy, d.hx + d.w * Math.cos(a), d.hy + d.w * Math.sin(a)]; }
  function segDist(x, y, [ax, ay, bx, by]) {
    const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(x - ax - t * dx, y - ay - t * dy);
  }
  const doorMid = d => [d.hx + Math.cos(d.base) * d.w / 2, d.hy + Math.sin(d.base) * d.w / 2];

  // --- состояние
  const p = { x: 0, y: 0, h: 0, fl: 'pb', yaw: 0, pitch: 0 };
  let room = null, path = null, walkTo = null, faceTo = null, last = 0, stuck = 0;
  const keys = {};

  function ok(nx, ny) {
    if (!free(p.fl, nx, ny)) return false;
    for (const d of DOORS) {
      if (d.fl !== p.fl) continue;
      const s = doorSeg(d);
      if (segDist(nx, ny, s) < R + 0.03 && segDist(p.x, p.y, s) >= R + 0.03) { if (!d.open) d.open = true; return false; }   // толкнул закрытую дверь — она открывается
    }
    return true;
  }
  function move(dx, dy) {
    if (ok(p.x + dx, p.y + dy)) { p.x += dx; p.y += dy; return true; }
    if (Math.abs(dx) > 1e-4 && ok(p.x + dx, p.y)) { p.x += dx; return true; }
    if (Math.abs(dy) > 1e-4 && ok(p.x, p.y + dy)) { p.y += dy; return true; }
    return false;
  }
  const turnTo = (a, max) => { let d = a - p.yaw; d = Math.atan2(Math.sin(d), Math.cos(d)); p.yaw += Math.max(-max, Math.min(max, d)); };

  function roomAt(l, x, y) {
    const r = ROOMS.find(r => r.fl === l && r.b.some(([x0, y0, x1, y1]) => x >= x0 && x <= x1 && y >= y0 && y <= y1));
    return r || (l === 'pb' ? RM.jardin : room);
  }
  const rName = r => r.n.map(T).join(' · ');
  const rCloud = r => T(r.c || r.n[r.n.length - 1]);

  // --- облачка
  const clouds = [], tmpV = new THREE.Vector3();
  function addCloud(text, x, y, h, go) {
    const el = document.createElement('div'); el.className = 'cloud';
    const s = document.createElement('span'); s.textContent = text; el.appendChild(s);
    s.addEventListener('pointerdown', e => e.stopPropagation());
    s.addEventListener('click', e => { e.stopPropagation(); go(); });
    labelsEl.appendChild(el); clouds.push({ el, x, y, pos: new THREE.Vector3(x, h, -y) });
  }
  function setRoom(r) {
    room = r; document.getElementById('wroom').textContent = rName(r);
    clouds.splice(0).forEach(c => c.el.remove());
    LINKS.forEach(([a, b, dp, sa, sb, o]) => {
      if (a !== r.id && b !== r.id) return;
      const fwd = a === r.id, to = RM[fwd ? b : a], h = FL[r.fl] + 1.95;
      const face = (fwd ? o && o.fb : o && o.fa) || look(to);
      if (o && o.p) {
        const pts = fwd ? o.p : o.p.slice().reverse().slice(1).concat([to.at.slice(0, 2)]), c = fwd ? o.ca : o.cb;
        addCloud(rCloud(to), c[0], c[1], h, () => glide(pts.map(q => [q[0], q[1], FL[r.fl]]), r.fl, false, face));
      } else {
        const s0 = fwd ? sa : sb, s1 = fwd ? sb : sa;
        addCloud(rCloud(to), dp[0], dp[1], h, () => glide([s0, dp, s1].map(q => [q[0], q[1], FL[r.fl]]), r.fl, false, face));
      }
    });
    if (r.st) STAIRS.forEach(s => {
      if (s.lo === r.fl) addCloud(T(s.up), s.x0 + 0.4, YA, FL[s.lo] + 2.0, () => glide(stairPath(s, true), s.hi, true, STAIR_FACE[s.hi]));
      if (s.hi === r.fl) addCloud(T(s.down), s.x0 + 0.4, YB, FL[s.hi] + 1.3, () => glide(stairPath(s, false), s.lo, true, STAIR_FACE[s.lo]));
    });
  }
  // облачко видно, если оно впереди, ближе 10 м и между ним и глазом нет стены
  function seen(c) {
    const dx = c.x - p.x, dy = c.y - p.y, d = Math.hypot(dx, dy);
    if (d > 10) return false;
    for (let t = 0.25; t < d - 0.5; t += 0.1) if (cell(p.fl, p.x + dx * t / d, p.y + dy * t / d) & 4) return false;
    return true;
  }

  // --- движение по пути (облачко, лестница): препятствия не мешают, двери по дороге открываются
  // войдя в комнату — повернуться к её главной точке (at) или к середине
  function look(r) { if (r.keep) return null; if (r.at) return r.at.slice(2); const [x0, y0, x1, y1] = r.b[0]; return [(x0 + x1) / 2, (y0 + y1) / 2]; }
  function glide(pts, fl, stair, face) { path = { pts, i: 0, fl, stair, face, opened: [] }; walkTo = null; faceTo = null; }
  function tickPath(dt) {
    const q = path.pts[path.i], dx = q[0] - p.x, dy = q[1] - p.y, dh = q[2] - p.h, d = Math.hypot(dx, dy, dh);
    const step = (Math.abs(dh) > 0.01 ? 1.1 : SPEED * 1.15) * dt;   // по ступеням медленнее
    if (Math.hypot(dx, dy) > 0.05) turnTo(Math.atan2(dy, dx), 5 * dt);
    p.pitch += Math.max(-1.5 * dt, Math.min(1.5 * dt, (path.stair ? (dh > 0 ? 0.12 : -0.25) : 0) - p.pitch));
    if (d <= step) {
      p.x = q[0]; p.y = q[1]; p.h = q[2];
      if (++path.i >= path.pts.length) {
        p.fl = path.fl; p.h = FL[p.fl];
        if (path.face && Math.hypot(path.face[0] - p.x, path.face[1] - p.y) > 0.8) faceTo = Math.atan2(path.face[1] - p.y, path.face[0] - p.x);
        path.opened.forEach(dr => dr.open = false);   // дверь, открытую по дороге, закрыть за собой: иначе створка заслоняет комнату
        path = null;
      }
    } else { p.x += dx / d * step; p.y += dy / d * step; p.h += dh / d * step; }
    if (path && !path.stair) DOORS.forEach(dr => { if (dr.fl === p.fl && !dr.open) { const m = doorMid(dr); if (Math.hypot(m[0] - p.x, m[1] - p.y) < 1.4) { dr.open = true; path.opened.push(dr); } } });
  }
  // у подножия или наверху марша шаг вперёд на восток — лестница сама ведёт на соседний этаж
  function stairTrigger() {
    if (Math.cos(p.yaw) < 0.5) return false;
    for (const s of STAIRS) {
      if (s.lo === p.fl && Math.hypot(p.x - s.x0, p.y - YA) < 0.6) { glide(stairPath(s, true).slice(1), s.hi, true, STAIR_FACE[s.hi]); return true; }
      if (s.hi === p.fl && Math.hypot(p.x - s.x0, p.y - YB) < 0.6) { glide(stairPath(s, false).slice(1), s.lo, true, STAIR_FACE[s.lo]); return true; }
    }
    return false;
  }

  // --- кадр
  function tick() {
    const now = performance.now(), dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    DOORS.forEach(d => {
      const t = d.open ? 1 : 0;
      if (d.k !== t) { d.k = d.k < t ? Math.min(t, d.k + 2.4 * dt) : Math.max(t, d.k - 2.4 * dt); d.pivot.rotation.y = d.base + d.k * d.turn; }
    });
    const f = (keys.f ? 1 : 0) - (keys.b ? 1 : 0), s = (keys.r ? 1 : 0) - (keys.l ? 1 : 0), tr = (keys.tl ? 1 : 0) - (keys.tr ? 1 : 0);
    if ((f || s || tr) && path && !path.stair) path = null;
    if (f || s || tr) walkTo = faceTo = null;
    if (faceTo != null) { turnTo(faceTo, 3 * dt); if (Math.abs(Math.atan2(Math.sin(faceTo - p.yaw), Math.cos(faceTo - p.yaw))) < 0.01) faceTo = null; }
    if (path) tickPath(dt);
    else {
      p.yaw += tr * TURN * dt;
      const sp = SPEED * (keys.fast ? 1.6 : 1) * dt, c = Math.cos(p.yaw), sn = Math.sin(p.yaw);
      if (f > 0 && stairTrigger()) { /* лестница */ }
      else if (f || s) move((f * c + s * sn) * sp, (f * sn - s * c) * sp);
      else if (walkTo) {
        const dx = walkTo[0] - p.x, dy = walkTo[1] - p.y, d = Math.hypot(dx, dy);
        turnTo(Math.atan2(dy, dx), 4 * dt);
        if (d < 0.12) walkTo = null;
        else if (!stairTrigger()) {
          const st = Math.min(d, sp);
          if (move(dx / d * st, dy / d * st)) stuck = 0; else if ((stuck += dt) > 0.4) walkTo = null;
        }
      }
    }
    camera.position.set(p.x, p.h + EYEW, -p.y);
    camera.rotation.set(p.pitch, p.yaw - Math.PI / 2, 0, 'YXZ');
    if (!path || !path.stair) { const r = roomAt(p.fl, p.x, p.y); if (r && r !== room) setRoom(r); }
    const w = innerWidth, h = innerHeight;
    clouds.forEach(c => {
      tmpV.copy(c.pos).project(camera);
      const on = !path && tmpV.z < 1 && Math.abs(tmpV.x) < 1.1 && Math.abs(tmpV.y) < 1.1 && seen(c);
      c.el.style.display = on ? '' : 'none';
      if (!on) return;
      const hw = c.el.firstChild.offsetWidth / 2 + 8, x = Math.max(hw, Math.min(w - hw, (tmpV.x * 0.5 + 0.5) * w));   // у края экрана облачко не обрезается
      c.el.style.transform = 'translate(' + x + 'px,' + Math.max(60, (-tmpV.y * 0.5 + 0.5) * h) + 'px)';
    });
  }

  // --- вход и выход
  const NAVROOM = { 'pb-giardino': 'gi', 'pb-par-living': 'gi', 'pb-par-dorm': 'gi-dorm', 'pb-comun': 'pb-comun', 'pb-sala': 'pb-comun', 'pb-cocina': 'pb-comun',
    'p1': 'tz', 'p1-terrazzo': 'tz', 'p1-sur-living': 'tz', 'p1-sur-dorm': 'tz', 'p1-balcon': 'balcon', 'p1-paraiso': 'pa', 'p1-norte-living': 'pa', 'p1-norte-dorm': 'pa-dorm',
    'p2': 'ph', 'p2-penthouse': 'ph', 'p2-living': 'ph', 'p2-dorm': 'ph-dorm', 'p2-terraza': 'terraza', 'p2-quincho': 'quincho', 'sub': 'sub-esc', 'sub-escalera': 'sub-esc', 'sub-garaje': 'sub-esc' };
  function place(r) {
    const [x0, y0, x1, y1] = r.b[0] || [0, 0, 0, 0], at = r.at || [(x0 + x1) / 2, (y0 + y1) / 2, x1, (y0 + y1) / 2];
    p.fl = r.fl; p.h = FL[r.fl]; p.x = at[0]; p.y = at[1]; p.pitch = 0;
    for (let k = 0; k < 400 && !free(p.fl, p.x, p.y); k++) { const a = k * 2.4, d = 0.05 * Math.sqrt(k); p.x = at[0] + d * Math.cos(a); p.y = at[1] + d * Math.sin(a); }   // спираль до свободного места
    p.yaw = Math.atan2(at[3] - p.y, at[2] - p.x); path = walkTo = faceTo = null;
    setRoom(r);
  }
  const W = {
    on: false, p, rooms: ROOMS, links: LINKS, stairs: STAIRS,
    enter(id) {
      if (!grids) buildGrids();
      closeCam(); anim = null; setFloor('all');
      controls.enabled = false; W.on = true; document.body.classList.add('walking');
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      place(RM[id] || RM[NAVROOM[curNav && curNav.id]] || RM.patio);
      scene.fog.near = 30; scene.fog.far = 130; last = 0;
      resize(); tick();
    },
    exit() {
      W.on = false; path = walkTo = null; document.body.classList.remove('walking');
      clouds.splice(0).forEach(c => c.el.remove());
      Object.keys(keys).forEach(k => keys[k] = false);
      controls.enabled = true;
      controls.target.copy(camera.position).add(new THREE.Vector3(Math.cos(p.yaw), 0, -Math.sin(p.yaw)));
      resize(); go(curNav || byId.all);
    },
    resize(w, h) {
      camera.clearViewOffset(); camera.aspect = w / h;
      camera.fov = Math.max(55, Math.min(90, 2 * Math.atan(Math.tan(40 * Math.PI / 180) / camera.aspect) * 180 / Math.PI));   // ~80° по ширине, на телефоне стоя — 90° по высоте
      camera.updateProjectionMatrix();
    },
    tick,
    glide, place: id => place(RM[id]), room: () => room && room.id, free: (l, x, y) => grids ? free(l, x, y) : null, cell: (l, x, y) => cell(l, x, y),
    clouds: () => clouds.map(c => ({ text: c.el.textContent, on: c.el.style.display !== 'none', el: c.el })),
    busy: () => !!(path || walkTo || faceTo != null),
    keys,
  };

  // --- управление: клавиатура
  const KEY = { ArrowUp: 'f', KeyW: 'f', ArrowDown: 'b', KeyS: 'b', ArrowLeft: 'tl', ArrowRight: 'tr', KeyA: 'l', KeyD: 'r', ShiftLeft: 'fast', ShiftRight: 'fast' };
  addEventListener('keydown', e => {
    if (!W.on) return;
    if (e.key === 'Escape') { W.exit(); return; }
    const k = KEY[e.code];
    if (k) { keys[k] = true; e.preventDefault(); return; }
    if (e.code === 'KeyE' || e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); toggleAhead(); }
  });
  addEventListener('keyup', e => { const k = KEY[e.code]; if (k) keys[k] = false; });
  addEventListener('blur', () => Object.keys(keys).forEach(k => keys[k] = false));
  function toggleAhead() {
    let best = null, bd = 1.9;
    DOORS.forEach(d => {
      if (d.fl !== p.fl) return;
      const m = doorMid(d), dx = m[0] - p.x, dy = m[1] - p.y, dist = Math.hypot(dx, dy);
      if (dist < bd && (dx * Math.cos(p.yaw) + dy * Math.sin(p.yaw)) / (dist || 1) > 0.3) { best = d; bd = dist; }
    });
    if (best) best.open = !best.open;
  }

  // --- управление: перетаскивание — взгляд, касание — дверь или идти к точке
  const cv = renderer.domElement, ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let drag = null;
  cv.addEventListener('pointerdown', e => {
    if (!W.on || drag) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, t: performance.now(), moved: false };
    cv.setPointerCapture && cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener('pointermove', e => {
    if (!W.on || !drag || e.pointerId !== drag.id) return;
    if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 6) drag.moved = true;
    if (drag.moved) {
      const k = 2.2 / Math.max(innerWidth, innerHeight) * 1.6;
      p.yaw += (e.clientX - drag.x) * k; p.pitch = Math.max(-1.2, Math.min(1.2, p.pitch + (e.clientY - drag.y) * k));
      walkTo = faceTo = null;
    }
    drag.x = e.clientX; drag.y = e.clientY;
  });
  const endDrag = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const tap = !drag.moved && performance.now() - drag.t < 500; drag = null;
    if (W.on && tap && e.type === 'pointerup') tapAt(e.clientX, e.clientY);
  };
  cv.addEventListener('pointerup', endDrag); cv.addEventListener('pointercancel', endDrag);
  function tapAt(cx, cy) {
    ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects([floors[p.fl], lawn], true).find(h => !h.object.userData.nohit && !(h.object.parent && h.object.parent.userData.nohit));
    if (!hit) return;
    const d = hit.object.userData.door;
    if (d) { if (hit.distance < 4) d.open = !d.open; return; }
    const n = hit.face ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld) : null, x = hit.point.x, y = -hit.point.z;
    if (n && n.y > 0.7 && Math.abs(hit.point.y - FL[p.fl]) < 0.35) walkTo = [x, y];
    else if (hit.distance < 14) { const dx = x - p.x, dy = y - p.y, L = Math.hypot(dx, dy) || 1; walkTo = [x - dx / L * 0.4, y - dy / L * 0.4]; }
    path = null; stuck = 0;
  }

  // --- кнопки: войти, выйти, крестовина
  const wb = document.getElementById('walkb');
  wb.querySelector('img').src = IC.walk; wb.querySelector('span').textContent = T('Recorrer caminando');
  wb.onclick = e => { e.stopPropagation(); W.enter(); };
  const wx = document.getElementById('wexit'); wx.textContent = T('Salir'); wx.onclick = e => { e.stopPropagation(); W.exit(); };
  const PAD = { f: 'Adelante', b: 'Atrás', tl: 'Girar a la izquierda', tr: 'Girar a la derecha' };
  document.querySelectorAll('#wpad button').forEach(b => {
    const k = b.dataset.k; b.querySelector('img').src = IC.up; b.setAttribute('aria-label', T(PAD[k]));
    const off = e => { keys[k] = false; b.classList.remove('on'); };
    b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); keys[k] = true; b.classList.add('on'); b.setPointerCapture && b.setPointerCapture(e.pointerId); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => b.addEventListener(t, off));
    b.addEventListener('contextmenu', e => e.preventDefault());
  });
  return W;
})();
if (qs.has('walk')) walker.enter(qs.get('walk'));
