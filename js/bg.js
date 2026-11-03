/* ==========================================================
   Fond animé : courbes de niveau violettes sur fond blanc,
   recréé en code à partir de BackgroundAnimation_Big_AI_60fps.mp4.
   Principe : un champ de bruit simplex 3D (x, y, temps) est découpé en
   iso-lignes par marching squares, puis tracé en traits fins sur un canvas.
   ========================================================== */
(function () {
  "use strict";

  const canvas = document.getElementById("bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  /* ----- réglages (ajuster ici le rendu) ----- */
  const CELL = 12;          // taille d'une cellule du champ, en px CSS (plus petit = plus fin, plus lourd)
  const LEVELS = 11;        // nombre de courbes de niveau (moins = fond plus aéré)
  const SCALE = 0.0016;     // zoom du relief (plus petit = formes plus larges)
  const SPEED = 0.045;      // vitesse d'évolution (unités de bruit par seconde)
  const LINE = "rgba(100, 68, 151, 0.36)"; // violet du CV, adouci pour garder le texte lisible
  const LINE_WIDTH = 1.1;
  const BACKGROUND = "#fdfdfd";
  const MAX_FPS = 30;

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
  function noise3(xin, yin, zin) {
    let n0, n1, n2, n3;
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
    const contrib = (x, y, z, gi) => {
      let tt = 0.6 - x * x - y * y - z * z;
      if (tt < 0) return 0;
      const g = grad3[gi];
      tt *= tt;
      return tt * tt * (g[0] * x + g[1] * y + g[2] * z);
    };
    n0 = contrib(x0, y0, z0, perm[ii + perm[jj + perm[kk]]] % 12);
    n1 = contrib(x1, y1, z1, perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12);
    n2 = contrib(x2, y2, z2, perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12);
    n3 = contrib(x3, y3, z3, perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12);
    return 32 * (n0 + n1 + n2 + n3); // ~[-1, 1]
  }

  /* relief : deux octaves pour des formes organiques, légèrement étirées en diagonale */
  function height(x, y, t) {
    const u = x * SCALE + y * SCALE * 0.35;
    const v = y * SCALE - x * SCALE * 0.1;
    return noise3(u, v, t) * 0.78 + noise3(u * 2.1 + 7.3, v * 2.1 - 3.1, t * 1.4) * 0.22;
  }

  /* ----- dimensions ----- */
  let W = 0, H = 0, cols = 0, rows = 0, field = null;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / CELL) + 2;
    rows = Math.ceil(H / CELL) + 2;
    field = new Float32Array(cols * rows);
    draw(performance.now());
  }

  /* ----- marching squares ----- */
  const lerp = (a, b, v0, v1, lvl) => a + ((lvl - v0) / (v1 - v0)) * (b - a);

  function draw(now) {
    const t = now * 0.001 * SPEED;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) field[r * cols + c] = height(c * CELL, r * CELL, t);
    }

    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = LINE;
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();

    // le bruit simplex 3D reste dans ~[-0.9, 0.9]
    for (let l = 0; l < LEVELS; l++) {
      const lvl = -0.8 + (1.6 * (l + 0.5)) / LEVELS;
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

          const x = c * CELL, y = r * CELL;
          const top = [lerp(x, x + CELL, a, b, lvl), y];
          const right = [x + CELL, lerp(y, y + CELL, b, e, lvl)];
          const bottom = [lerp(x, x + CELL, d, e, lvl), y + CELL];
          const left = [x, lerp(y, y + CELL, a, d, lvl)];

          const seg = (p, q) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
          switch (code) {
            case 1: case 14: seg(left, top); break;
            case 2: case 13: seg(top, right); break;
            case 3: case 12: seg(left, right); break;
            case 4: case 11: seg(right, bottom); break;
            case 5: seg(left, top); seg(right, bottom); break;
            case 6: case 9: seg(top, bottom); break;
            case 7: case 8: seg(left, bottom); break;
            case 10: seg(top, right); seg(left, bottom); break;
          }
        }
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
