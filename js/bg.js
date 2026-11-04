/* ==========================================================
   Fond animé : courbes de niveau violettes sur fond blanc,
   recréé en code à partir de BackgroundAnimation_Big_AI_60fps.mp4.

   Principe : un relief (bruit simplex 3D étiré + pente diagonale + zones de
   relief fort ou faible) est coupé à intervalle constant, comme une vraie carte
   topographique : les pentes raides donnent des faisceaux de lignes serrées,
   les replats de grands espaces (marching squares). Les segments obtenus sont raccordés en
   courbes continues puis tracés en courbes de Bézier passant par les milieux
   des segments : les coins sont toujours arrondis.

   Deux cadrages :
     - normal  : réglage par défaut
     - dezoom  : relief vu de plus loin (formes plus petites, plus nombreuses)
   Pour comparer : ajouter ?topo=dezoom à l'adresse du site.
   Pour changer le cadrage par défaut : modifier DEFAULT_PRESET ci-dessous.
   ========================================================== */
(function () {
  "use strict";

  const canvas = document.getElementById("bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return; // le fond blanc du CSS reste affiché si le canvas est indisponible

  /* ----- réglages ----- */
  const DEFAULT_PRESET = "normal";
  const PRESETS = {
    normal: { SCALE: 0.0036 }, // zoom du relief (plus petit = formes plus larges)
    dezoom: { SCALE: 0.0052 }
  };
  const CELL_MIN = 9;       // finesse du calcul, en px CSS (plus petit = plus précis, plus lourd)
  const MAX_CELLS = 22000;  // plafond de calcul : sur les grands écrans les cellules grandissent un peu
  const INTERVAL = 0.09;    // écart de hauteur entre deux courbes (plus petit = plus de lignes)
  const SLOPE = 0.45;       // pente diagonale générale (faisceaux de lignes parallèles)
  const WARP = 0.55;        // étirement des formes (alternance zones serrées / zones larges)
  const AMP_MIN = 0.42;     // relief minimal dans les zones calmes (plus petit = plus de grands espaces)
  const SPEED = 0.0045;     // vitesse d'évolution (0.045 → 0.009 → 0.0045)
  const LINE = "rgba(100, 68, 151, 0.09)"; // violet du CV, opacité (0.36 → 0.18 → 0.09)
  const LINE_WIDTH = 1.1;
  const BACKGROUND = "#fdfdfd";
  const MAX_FPS = 12;       // le relief bouge très lentement : 12 images/s suffisent

  let presetName = DEFAULT_PRESET;
  try {
    const q = new URLSearchParams(location.search).get("topo");
    if (q && PRESETS[q]) presetName = q;
  } catch (e) { /* ignoré */ }
  const SCALE = PRESETS[presetName].SCALE;

  /* ----- bruit simplex 3D (Stefan Gustavson, domaine public) ----- */
  const perm = new Uint8Array(512);
  const grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
  ];
  (function seed() {
    let s = 20260211; // graine fixe : même relief à chaque chargement
    const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    const p = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  })();

  const F3 = 1 / 3, G3 = 1 / 6;
  function contrib(x, y, z, gi) {
    let tt = 0.6 - x * x - y * y - z * z;
    if (tt < 0) return 0;
    const g = grad3[gi];
    tt *= tt;
    return tt * tt * (g[0] * x + g[1] * y + g[2] * z);
  }
  function noise3(xin, yin, zin) {
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s), j = Math.floor(yin + s), k = Math.floor(zin + s);
    const t = (i + j + k) * G3;
    const x0 = xin - (i - t), y0 = yin - (j - t), z0 = zin - (k - t);
    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }
    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;
    const ii = i & 255, jj = j & 255, kk = k & 255;
    return 32 * (
      contrib(x0, y0, z0, perm[ii + perm[jj + perm[kk]]] % 12) +
      contrib(x1, y1, z1, perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12) +
      contrib(x2, y2, z2, perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12) +
      contrib(x3, y3, z3, perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12)
    );
  }

  /* relief : bruit étiré (warp) + modulation d'amplitude + pente diagonale, ramené à l'intervalle */
  function height(x, y, t) {
    let u = x * SCALE, v = y * SCALE;
    const wu = noise3(u * 0.55 + 5.2, v * 0.55 + 1.3, t * 0.7);
    const wv = noise3(u * 0.55 - 8.1, v * 0.55 + 4.4, t * 0.7);
    u += WARP * wu; v += WARP * wv;
    const m = noise3(u * 0.35 + 31.7, v * 0.35 - 12.3, t * 0.5) * 0.5 + 0.5;
    const amp = AMP_MIN + (1 - AMP_MIN) * 1.6 * m * m;
    const n = noise3(u, v, t) * 0.88 + noise3(u * 2.1 + 7.3, v * 2.1 - 3.1, t * 1.3) * 0.12;
    return (amp * n + SLOPE * (u * 0.85 + v * 0.4)) / INTERVAL;
  }

  /* ----- dimensions et tampons ----- */
  let W = 0, H = 0, cols = 0, rows = 0, field = null, CELL = CELL_MIN;
  let ex = null, ey = null, nb1 = null, nb2 = null, seen = null, touched = null, nTouched = 0;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    // netteté limitée à 2x et surface plafonnée (certains navigateurs refusent les très grands canvas)
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const MAX_PIXELS = 8e6;
    if (W * H * dpr * dpr > MAX_PIXELS) dpr = Math.max(1, Math.sqrt(MAX_PIXELS / (W * H)));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    CELL = Math.max(CELL_MIN, Math.ceil(Math.sqrt((W * H) / MAX_CELLS)));
    cols = Math.ceil(W / CELL) + 3;
    rows = Math.ceil(H / CELL) + 3;
    field = new Float32Array(cols * rows);
    const nEdges = 2 * cols * rows; // arêtes horizontales puis verticales
    ex = new Float32Array(nEdges); ey = new Float32Array(nEdges);
    nb1 = new Int32Array(nEdges).fill(-1); nb2 = new Int32Array(nEdges).fill(-1);
    seen = new Uint8Array(nEdges);
    touched = new Int32Array(nEdges);
    draw(performance.now());
  }

  /* ----- raccordement des segments en courbes ----- */
  function touch(k, x, y) {
    if (nb1[k] === -1 && nb2[k] === -1 && !seen[k]) { touched[nTouched++] = k; seen[k] = 2; }
    ex[k] = x; ey[k] = y;
  }
  function link(a, b) {
    if (nb1[a] === -1) nb1[a] = b; else nb2[a] = b;
    if (nb1[b] === -1) nb1[b] = a; else nb2[b] = a;
  }
  /* courbe lissée : Bézier quadratiques entre les milieux des segments */
  function strokeChain(chain, closed) {
    const n = chain.length;
    if (n < 2) return;
    if (closed && n > 2) {
      let k0 = chain[n - 1], k1 = chain[0];
      ctx.moveTo((ex[k0] + ex[k1]) / 2, (ey[k0] + ey[k1]) / 2);
      for (let i = 0; i < n; i++) {
        const a = chain[i], b = chain[(i + 1) % n];
        ctx.quadraticCurveTo(ex[a], ey[a], (ex[a] + ex[b]) / 2, (ey[a] + ey[b]) / 2);
      }
      return;
    }
    ctx.moveTo(ex[chain[0]], ey[chain[0]]);
    for (let i = 1; i < n - 1; i++) {
      const a = chain[i], b = chain[i + 1];
      ctx.quadraticCurveTo(ex[a], ey[a], (ex[a] + ex[b]) / 2, (ey[a] + ey[b]) / 2);
    }
    ctx.lineTo(ex[chain[n - 1]], ey[chain[n - 1]]);
  }
  function walk(start) {
    const chain = [start];
    seen[start] = 1;
    let prev = -1, cur = start;
    for (;;) {
      const nx = nb1[cur] !== prev && nb1[cur] !== -1 && seen[nb1[cur]] !== 1 ? nb1[cur]
        : (nb2[cur] !== prev && nb2[cur] !== -1 && seen[nb2[cur]] !== 1 ? nb2[cur] : -1);
      if (nx === -1) break;
      seen[nx] = 1; chain.push(nx); prev = cur; cur = nx;
    }
    // boucle fermée si la dernière arête rejoint la première
    const last = chain[chain.length - 1];
    const closed = chain.length > 2 && (nb1[last] === start || nb2[last] === start);
    if (closed && chain.length < 7) return; // ignore les toutes petites boucles (points)
    strokeChain(chain, closed);
  }

  const lerp = (a, b, v0, v1, lvl) => a + ((lvl - v0) / (v1 - v0)) * (b - a);

  function draw(now) {
    const t = now * 0.001 * SPEED;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) field[r * cols + c] = height((c - 1) * CELL, (r - 1) * CELL, t);
    }

    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = LINE;
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();

    const NH = rows * cols;
    // une courbe à chaque valeur entière du relief (intervalle constant)
    let gmin = Infinity, gmax = -Infinity;
    for (let i = 0; i < field.length; i++) { const f = field[i]; if (f < gmin) gmin = f; if (f > gmax) gmax = f; }
    for (let lv = Math.ceil(gmin); lv <= Math.floor(gmax); lv++) {
      const lvl = lv + 0.0001;
      nTouched = 0;
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const a = field[r * cols + c];
          const b = field[r * cols + c + 1];
          const d = field[(r + 1) * cols + c];
          const e = field[(r + 1) * cols + c + 1];
          let code = 0;
          if (a > lvl) code |= 1;
          if (b > lvl) code |= 2;
          if (e > lvl) code |= 4;
          if (d > lvl) code |= 8;
          if (code === 0 || code === 15) continue;

          const x = (c - 1) * CELL, y = (r - 1) * CELL;
          const kTop = r * cols + c, kBottom = (r + 1) * cols + c;
          const kLeft = NH + r * cols + c, kRight = NH + r * cols + c + 1;
          const T = () => touch(kTop, lerp(x, x + CELL, a, b, lvl), y);
          const Rr = () => touch(kRight, x + CELL, lerp(y, y + CELL, b, e, lvl));
          const B = () => touch(kBottom, lerp(x, x + CELL, d, e, lvl), y + CELL);
          const Lf = () => touch(kLeft, x, lerp(y, y + CELL, a, d, lvl));
          switch (code) {
            case 1: case 14: Lf(); T(); link(kLeft, kTop); break;
            case 2: case 13: T(); Rr(); link(kTop, kRight); break;
            case 3: case 12: Lf(); Rr(); link(kLeft, kRight); break;
            case 4: case 11: Rr(); B(); link(kRight, kBottom); break;
            case 5: Lf(); T(); Rr(); B(); link(kLeft, kTop); link(kRight, kBottom); break;
            case 6: case 9: T(); B(); link(kTop, kBottom); break;
            case 7: case 8: Lf(); B(); link(kLeft, kBottom); break;
            case 10: T(); Rr(); Lf(); B(); link(kTop, kRight); link(kLeft, kBottom); break;
          }
        }
      }
      // d'abord les courbes ouvertes (extrémités), puis les boucles
      for (let i = 0; i < nTouched; i++) {
        const k = touched[i];
        if (seen[k] !== 1 && (nb1[k] === -1 || nb2[k] === -1)) walk(k);
      }
      for (let i = 0; i < nTouched; i++) {
        const k = touched[i];
        if (seen[k] !== 1) walk(k);
      }
      // remise à zéro des arêtes utilisées pour ce niveau
      for (let i = 0; i < nTouched; i++) {
        const k = touched[i];
        nb1[k] = -1; nb2[k] = -1; seen[k] = 0;
      }
    }
    ctx.stroke();
  }

  /* ----- boucle d'animation ----- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let last = 0, raf = 0;
  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (now - last < 1000 / MAX_FPS) return;
    last = now;
    draw(now);
  }
  function start() {
    cancelAnimationFrame(raf);
    if (reduce.matches || document.hidden) return;
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener("resize", () => { resize(); start(); });
  document.addEventListener("visibilitychange", start);
  if (reduce.addEventListener) reduce.addEventListener("change", start);

  resize();
  start();
})();
