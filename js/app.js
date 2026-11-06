/* ==========================================================
   Application : navigation par onglets (hash), bascule FR/EN à tout moment,
   vidéo au survol des vignettes, bandeaux projet, badges du CV.
   Le contenu vient de js/data.js.
   ========================================================== */
(function () {
  "use strict";

  const D = window.PORTFOLIO;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const main = $("#main");

  /* ---------- langue ---------- */
  let lang = "fr";
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "fr" || saved === "en") lang = saved;
    else if (!/^fr/i.test(navigator.language || "fr")) lang = "en";
  } catch (e) { /* stockage indisponible : on garde la langue par défaut */ }

  const t = (o) => (o && typeof o === "object" ? (o[lang] || o.en || o.fr || "") : (o || ""));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- badge du CV ----------
     Le contour (double polygone) est extrait pixel par pixel du CV : assets/ring_white.png et ring_night.png.
     Le fond lilas et les photos/icônes sont recoupés à la même forme polygonale. */
  const GLYPHS = {
    doc: '<path d="M7 3h7l4 4v14H7z M14 3v4h4 M10 12h5 M10 16h5"/>',
    download: '<path d="M12 4v11 M7 11l5 5 5-5 M5 20h14"/>',
    code: '<path d="M9 7l-5 5 5 5 M15 7l5 5-5 5"/>',
    play: '<path d="M8 5l11 7-11 7z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
  };
  /* contour vectoriel du CV ; kind = sm | md | lg | photo (voir js/rings.js) */
  const ringImg = (ring, kind) =>
    '<svg class="ring" viewBox="0 0 100 100" aria-hidden="true">' +
    (window.CV_RINGS[kind] || window.CV_RINGS.sm).map((d) => '<path fill="' + ring + '" fill-rule="evenodd" d="' + d + '"/>').join("") + "</svg>";

  /* badge image (icône du CV) ; ring = couleur du contour (#fefefe ou #1e0e3b) */
  function badgeImg(src, ring, alt, kind) {
    return '<span class="badge" role="img" aria-label="' + esc(alt || "") + '"><img class="b-disc" src="' + src + '" alt="" draggable="false">' + ringImg(ring, kind || "sm") + "</span>";
  }
  /* badge à pictogramme : fond lilas du CV + pictogramme bleu nuit (comme les icônes de contact) */
  function badgeGlyph(name, ring, kind) {
    return '<span class="badge" aria-hidden="true"><img class="b-disc" src="assets/disc_lilac_' + (kind || "md") + '.webp" alt="" draggable="false">' +
      '<svg class="b-glyph" viewBox="0 0 24 24" fill="none" stroke="#1e0e3b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (GLYPHS[name] || GLYPHS.link) + "</svg>" + ringImg(ring, kind || "md") + "</span>";
  }
  /* badge à monogramme (moteur sans logo fourni) */
  function badgeText(txt, ring, alt, kind) {
    return '<span class="badge" role="img" aria-label="' + esc(alt || "") + '"><img class="b-disc" src="assets/disc_lilac_' + (kind || "sm") + '.webp" alt="" draggable="false">' +
      '<span class="b-text">' + esc(txt) + "</span>" + ringImg(ring, kind || "sm") + "</span>";
  }
  /* variante : contour seul (pour y superposer un logo) */
  function badgeEmpty(ring, kind) {
    return '<span class="badge" aria-hidden="true">' + ringImg(ring, kind || "lg") + "</span>";
  }

  /* ---------- bandeau supérieur ---------- */
  function renderTopbar(current) {
    const bar = $("#topbar");
    bar.innerHTML =
      '<a class="brand" href="#/home" aria-label="' + esc(D.site.name) + '">' +
        badgeImg("assets/photo.webp", "#fefefe", "", "photo") +
        '<span><span class="brand-name">' + esc(D.site.name) + '</span><span class="brand-sub">' + esc(t(D.site.role)) + "</span></span></a>" +
      '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="tabs">' + esc(t(D.ui.menu)) + "</button>" +
      '<nav class="tabs" id="tabs" aria-label="Navigation">' +
        D.tabs.map((tab) => '<a class="tab" href="' + tab.route + '"' + (tab.id === current ? ' aria-current="page"' : "") + ">" + esc(t(tab.label)) + "</a>").join("") +
      "</nav>" +
      '<div class="lang" role="group" aria-label="Langue / Language">' +
        '<button type="button" data-lang="fr" aria-pressed="' + (lang === "fr") + '">FR</button>' +
        '<button type="button" data-lang="en" aria-pressed="' + (lang === "en") + '">EN</button></div>';
  }

  /* ---------- pied de page : icônes cliquables (barre de contact du CV) ---------- */
  function renderFooter() {
    const c = D.site.contact, w = "#fefefe";
    const link = (href, inner, label, extra) =>
      '<li><a class="icon-link" href="' + esc(href) + '" aria-label="' + esc(label) + '" data-tip="' + esc(label) + '"' + (extra || "") + ">" + inner + "</a></li>";
    $("#footer").innerHTML =
      '<ul class="icons">' +
      link("tel:" + c.phone, badgeImg("assets/icons/phone.webp", w, "", "md"), c.phone) +
      link("mailto:" + c.email, badgeImg("assets/icons/mail.webp", w, "", "md"), c.email) +
      link(c.linkedin, badgeImg("assets/icons/linkedin.webp", w, "", "md"), t(D.ui.linkedin), ' target="_blank" rel="noopener"') +
      '<li class="cv-menu"><button class="icon-link cv-btn" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="cv-pop" aria-label="' + esc(t(D.ui.cvLabel)) + '" data-tip="CV">' + badgeGlyph("doc", w, "md") + "</button>" +
        '<div class="cv-pop" id="cv-pop" hidden>' +
          '<a href="' + esc(c.cvColor) + '" download>' + esc(t(D.ui.cvColor)) + "</a>" +
          '<a href="' + esc(c.cvPrint) + '" download>' + esc(t(D.ui.cvPrint)) + "</a></div></li>" +
      "</ul>" +
      '<p class="copyright">© ' + new Date().getFullYear() + " " + esc(D.site.name) + "</p>";
  }

  /* ---------- éléments communs ---------- */
  const sectionTitle = (txt, small) => '<h2 class="section-title' + (small ? " sm" : "") + '">' + esc(txt) + "</h2>";
  const placeholder = (txt, cls) => '<div class="ph grid-bg ' + (cls || "") + '">' + esc(txt) + "</div>";

  const PERSON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>';

  /* logo du moteur : icône du CV si disponible, sinon monogramme (« ? » tant que le moteur n'est pas renseigné) */
  function engineBadge(p, ring) {
    if (p.engineIcon) return badgeImg("assets/icons/" + p.engineIcon + ".webp", ring, p.engine);
    return badgeText(p.engineMark || "?", ring, p.engine || "");
  }

  function tile(p) {
    const chip = D.tabs.find((x) => x.id === p.category);
    const media = p.cover
      ? '<img class="media" src="' + esc(p.cover) + '" alt="" loading="lazy">'
      : '<div class="media grid-bg ph">' + esc(t(D.ui.coverTodo)) + "</div>";
    const n = p.team == null ? "?" : p.team;
    const peopleLabel = (p.team == null ? "" : p.team + " ") + t(D.ui.people);
    const open = p.wip
      ? '<div class="tile wip" aria-disabled="true" title="' + esc(t(D.ui.wipTitle)) + '">'
      : '<a class="tile" href="#/project/' + p.id + '"' + (p.preview ? ' data-video="' + esc(p.preview) + '"' : "") + ">";
    return open +
      (p.wip ? '<span class="wip-band grid-bg">WIP</span>' : "") +
      media +
      '<span class="chip">' + esc(t(chip.label)) + "</span>" +
      '<span class="cap"><span class="cap-main"><span class="cap-title">' + esc(p.title) + '</span><span class="cap-meta">' + esc(t(p.genre)) + "</span></span>" +
      '<span class="stats">' +
        '<span class="stat" title="' + esc(p.engine || "") + '">' + engineBadge(p, "#fefefe") + "</span>" +
        '<span class="stat people" title="' + esc(peopleLabel) + '">' + PERSON + "<b>" + esc(n) + "</b></span></span></span>" + (p.wip ? "</div>" : "</a>");
  }
  const grid = (list) => list.length
    ? '<div class="grid">' + list.map(tile).join("") + "</div>"
    : '<p class="empty">' + esc(t(D.ui.emptyCategory)) + "</p>";

  /* ---------- vues ---------- */
  function viewHome() {
    main.innerHTML =
      '<h1 class="name">' + esc(D.site.name) + "</h1>" +
      '<p class="role">' + esc(t(D.site.role)) + "</p>" +
      '<div class="hero-video" id="hero-video"></div>' +
      ["professional", "personal", "exercise"].map((cat) =>
        sectionTitle(t(D.ui[cat])) + grid(D.projects.filter((p) => p.category === cat))).join("");
    mountIntroVideo();
  }

  function mountIntroVideo() {
    const box = $("#hero-video");
    const fallback = () => { box.innerHTML = placeholder(t(D.ui.introTodo), "fill"); };
    if (!D.site.introVideo) return fallback();
    const v = document.createElement("video");
    v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
    v.setAttribute("aria-label", t(D.ui.video));
    v.addEventListener("error", fallback, { once: true });
    v.src = D.site.introVideo;
    box.appendChild(v);
    const p = v.play(); if (p && p.catch) p.catch(() => {});
  }

  function viewCategory(cat) {
    main.innerHTML = sectionTitle(t(D.ui[cat])) + grid(D.projects.filter((p) => p.category === cat));
  }

  /* bandeau projet : retravail du bandeau violet fourni (logo, titre, genre, type, durée, map) */
  function banner(p) {
    const logo = p.logo
      ? '<img src="' + esc(p.logo) + '" alt="" style="position:absolute;inset:14%;width:72%;height:72%;object-fit:contain">'
      : "<span>" + esc(t(D.ui.banner.logo)) + "</span>";
    const engineMark = '<span style="display:inline-block;vertical-align:middle;width:1.4em;height:1.4em;margin-left:.4em">' + engineBadge(p, "#fefefe") + "</span>";
    return '<header class="banner grid-bg"><div class="banner-in">' +
      '<div class="banner-left"><div class="logo">' + badgeEmpty("#fefefe") + logo + "</div><div>" +
      "<h1>" + esc(p.title) + "</h1>" +
      '<span class="line">' + esc(t(p.genre)) + "</span>" +
      '<span class="line">' + esc(t(p.type)) + "</span>" +
      '<span class="line">' + esc(t(p.duration)) + engineMark + "</span></div></div>" +
      '<div class="banner-right">' + (p.map ? '<img src="' + esc(p.map) + '" alt="">' : placeholder(t(D.ui.banner.map))) + "</div></div></header>";
  }

  /* ---------- page projet ----------
     Mise en page inspirée des portfolios de référence (Project GLOW / Jedi DLC), dans la charte du CV.
     Textes : lorem ipsum ; médias : emplacements « à ajouter ». */
  const LOREM = {
    p1: "Lorem ipsum dolor sit amet, <b>consectetur adipiscing</b> elit. Sed do eiusmod tempor incididunt ut labore et dolore <b>magna aliqua</b>. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    p2: "Duis aute irure dolor in <b>reprehenderit</b> in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia <b>deserunt mollit</b> anim id est laborum.",
    p3: "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio, et <b>tempus</b> feugiat. Integer in mauris eu nibh euismod gravida.",
    bullets: ["<b>Lorem ipsum</b> dolor sit amet", "Consectetur <b>adipiscing</b> elit", "Sed do <b>eiusmod</b> tempor incididunt"]
  };
  const media = (cls, cap) =>
    "<figure class=\"p-fig\">" + placeholder(t(D.ui.mediaTodo), "p-ph " + cls) + (cap ? "<figcaption>" + esc(cap) + "</figcaption>" : "") + "</figure>";
  const text = (...ps) => '<div class="p-text">' + ps.map((x) => "<p>" + x + "</p>").join("") + "</div>";
  const list = (items) => '<ul class="p-list">' + items.map((x) => "<li>" + x + "</li>").join("") + "</ul>";
  const secTitle = (label, side) => '<h2 class="sec-h ' + (side || "left") + '">' + esc(label) + "</h2>";

  /* ---------- visionneuse PDF ----------
     Pages pré-converties en images : rapide, identique sur ordinateur et téléphone, sans téléchargement.
     Sans images, repli sur la visionneuse PDF du navigateur. */
  function pdfViewer(doc, title) {
    const U = D.ui.page;
    if (!doc) return "";
    const open = '<a class="pdfv-btn" href="' + esc(doc.file) + '" target="_blank" rel="noopener">' + esc(t(U.openPdf)) + " ↗</a>";
    if (!doc.pages || !doc.pages.length) {
      return '<div class="pdfv"><iframe class="pdfv-frame" src="' + esc(doc.file) + '#view=FitH" title="' + esc(title) + '" loading="lazy"></iframe>' +
        '<div class="pdfv-bar grid-bg"><span></span>' + open + "</div></div>";
    }
    const n = doc.pages.length;
    return '<div class="pdfv" tabindex="0" role="region" aria-label="' + esc(t(U.ldd) + " – " + title) + '" data-pages="' + esc(JSON.stringify(doc.pages)) + '">' +
      '<div class="pdfv-stage">' +
        '<img class="pdfv-page" src="' + esc(doc.pages[0]) + '" alt="' + esc(t(U.page) + " 1 / " + n) + '" loading="lazy" draggable="false">' +
        '<button class="pdfv-nav prev" type="button" aria-label="' + esc(t(U.prevPage)) + '">‹</button>' +
        '<button class="pdfv-nav next" type="button" aria-label="' + esc(t(U.nextPage)) + '">›</button>' +
      "</div>" +
      '<div class="pdfv-bar grid-bg">' +
        '<span class="pdfv-count" aria-live="polite">1 / ' + n + "</span>" +
        '<div class="pdfv-thumbs">' + doc.pages.map((src, i) =>
          '<button type="button" class="pdfv-thumb' + (i === 0 ? " on" : "") + '" data-i="' + i + '" aria-label="' + esc(t(U.page) + " " + (i + 1)) + '"><img src="' + esc(src) + '" alt="" loading="lazy" draggable="false"></button>').join("") + "</div>" +
        '<span class="pdfv-tools">' + open +
          '<button class="pdfv-btn pdfv-fs" type="button">' + esc(t(U.fullscreen)) + " ⛶</button></span>" +
      "</div></div>";
  }

  function initPdfViewers() {
    main.querySelectorAll(".pdfv[data-pages]").forEach((v) => {
      const pages = JSON.parse(v.dataset.pages);
      const img = v.querySelector(".pdfv-page"), count = v.querySelector(".pdfv-count");
      const thumbs = [...v.querySelectorAll(".pdfv-thumb")];
      let i = 0;
      const show = (k) => {
        i = (k + pages.length) % pages.length;
        img.src = pages[i];
        img.alt = t(D.ui.page.page) + " " + (i + 1) + " / " + pages.length;
        count.textContent = (i + 1) + " / " + pages.length;
        thumbs.forEach((b, j) => b.classList.toggle("on", j === i));
        const pre = new Image(); pre.src = pages[(i + 1) % pages.length]; // précharge la page suivante
      };
      v.querySelector(".pdfv-nav.prev").addEventListener("click", () => show(i - 1));
      v.querySelector(".pdfv-nav.next").addEventListener("click", () => show(i + 1));
      thumbs.forEach((b) => b.addEventListener("click", () => show(+b.dataset.i)));
      v.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); show(i - 1); }
        if (e.key === "ArrowRight") { e.preventDefault(); show(i + 1); }
      });
      // glisser au doigt (téléphone / tablette)
      let x0 = null;
      const stage = v.querySelector(".pdfv-stage");
      stage.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
      stage.addEventListener("pointerup", (e) => {
        if (x0 === null) return;
        const dx = e.clientX - x0; x0 = null;
        if (Math.abs(dx) > 40) show(dx < 0 ? i + 1 : i - 1);
      });
      // plein écran (masqué si le navigateur ne le permet pas, ex. iPhone)
      const fs = v.querySelector(".pdfv-fs");
      if (!v.requestFullscreen && !v.webkitRequestFullscreen) fs.hidden = true;
      fs.addEventListener("click", () => {
        if (document.fullscreenElement) document.exitFullscreen();
        else (v.requestFullscreen || v.webkitRequestFullscreen).call(v);
      });
    });
  }

  /* ---------- navigation entre projets d'une même catégorie (en boucle, hors WIP) ---------- */
  function projectNav(p) {
    const list = D.projects.filter((x) => x.category === p.category && !x.wip);
    const k = list.findIndex((x) => x.id === p.id);
    if (list.length < 2 || k < 0) return "";
    const prev = list[(k - 1 + list.length) % list.length], next = list[(k + 1) % list.length];
    const U = D.ui.page;
    const thumb = (q) => q.cover
      ? '<img src="' + esc(q.cover) + '" alt="" loading="lazy">'
      : '<span class="pn-ph grid-bg"><span class="pn-badge">' + engineBadge(q, "#fefefe") + "</span></span>";
    const arrow = (q, dir) =>
      '<a class="pn-arrow ' + dir + '" href="#/project/' + q.id + '" aria-label="' + esc(t(dir === "prev" ? U.prevProject : U.nextProject) + " : " + q.title + " – " + t(q.genre)) + '">' +
        '<span class="pn-chev grid-bg" aria-hidden="true">' + (dir === "prev" ? "‹" : "›") + "</span>" +
        '<span class="pn-peek" aria-hidden="true"><span class="pn-thumb">' + thumb(q) + "</span>" +
          '<span class="pn-label">' + esc(t(dir === "prev" ? U.prevProject : U.nextProject)) + "</span>" +
          '<span class="pn-name">' + esc(q.title) + '</span><span class="pn-genre">' + esc(t(q.genre)) + "</span></span></a>";
    const link = (q, dir) =>
      '<a class="pn-link ' + dir + '" href="#/project/' + q.id + '"><span class="pn-label">' + esc(t(dir === "prev" ? U.prevProject : U.nextProject)) + "</span>" +
        '<span class="pn-name">' + (dir === "prev" ? "← " : "") + esc(q.title) + (dir === "next" ? " →" : "") + "</span>" +
        '<span class="pn-genre">' + esc(t(q.genre)) + "</span></a>";
    return '<nav class="pn" aria-label="' + esc(t(D.tabs.find((x) => x.id === p.category).label)) + '">' +
      arrow(prev, "prev") + arrow(next, "next") +
      '<div class="pn-bottom">' + link(prev, "prev") + link(next, "next") + "</div></nav>";
  }

  function viewProject(id) {
    const p = D.projects.find((x) => x.id === id);
    if (!p) { main.innerHTML = '<p class="empty">' + esc(t(D.ui.notFound)) + "</p>"; return null; }
    if (p.wip) { main.innerHTML = '<p class="empty">' + esc(t(D.ui.wipTitle)) + "</p>"; return p.category; }
    const U = D.ui.page;
    const back = D.tabs.find((x) => x.id === p.category);
    const roles = p.roles && p.roles.length ? p.roles.map((r) => t(r)) : LOREM.bullets;
    const team = p.team == null ? "?" : p.team;
    const pill = (label, value, extra) =>
      '<div class="pill-box"><span class="pill-label">' + esc(label) + '</span><span class="pill">' + (extra || "") + esc(value) + "</span></div>";

    let h = '<a class="back" href="' + back.route + '">' + esc(t(D.ui.back)) + "</a>" + banner(p);

    // 1. description + trailer (réf. Jedi DLC)
    h += '<section class="p-intro"><div>' + secTitle(t(U.description)) + text(LOREM.p1, LOREM.p2) + "</div>" +
      "<div>" + media("r16x9", t(U.trailer)) + "</div></section>";

    // 2. galerie de captures
    h += '<section class="p-gallery">' + media("r16x9") + media("r4x3") + media("r4x3") + "</section>";

    // 3. bandeau infos : missions / genre / durée / équipe / moteur (réf. Jedi DLC, aux couleurs du CV)
    h += '<section class="p-info grid-bg"><div class="p-roles"><h3>' + esc(t(D.ui.myRoles)) + "</h3>" + list(roles) + "</div>" +
      '<div class="p-pills">' +
        pill(t(U.genre), t(p.genre)) + pill(t(U.duration), t(p.duration)) +
        pill(t(U.team), team + " " + t(U.people)) +
        pill(t(U.engine), p.engine || "?", '<span class="pill-badge">' + engineBadge(p, "#fefefe") + "</span>") +
      "</div></section>";

    // 4. contexte du jeu
    h += '<section class="p-sec">' + secTitle(t(U.context)) + text(LOREM.p1) + "</section>";

    // 5. documentation : moodboard + intentions (réf. Jedi DLC)
    h += '<section class="p-sec">' + secTitle(t(U.documentation), "right") +
      '<div class="p-split rev">' + media("r4x3", t(U.moodboard)) + "<div>" + text(LOREM.p1) + list(LOREM.bullets) + text(LOREM.p3) + "</div></div></section>";

    // 5 bis. document consultable dans la page (visionneuse PDF)
    h += '<section class="p-sec">' + secTitle(t(U.ldd), "center") + '<p class="p-thanks">' + esc(t(U.lddSub)) + "</p>" +
      pdfViewer(p.pdf || D.site.placeholderPdf, p.title) + "</section>";

    // 6. flow du niveau
    h += '<section class="p-sec">' + secTitle(t(U.flow)) +
      '<div class="p-split">' + "<div>" + text(LOREM.p1, LOREM.p2) + "</div>" + media("r16x9", t(U.flowCap)) + "</div></section>";

    // 7. moléculaire + layout (réf. Jedi DLC)
    h += '<section class="p-sec">' + secTitle(t(U.molecular), "right") +
      '<div class="p-split rev">' + media("r16x9", t(U.molecularCap)) + text(LOREM.p1, LOREM.p3) + "</div>" +
      '<div class="p-full">' + media("r21x9", t(U.layoutCap)) + "</div></section>";

    // 8. blockout + playtests
    h += '<section class="p-sec">' + secTitle(t(U.blockout)) +
      '<div class="p-split">' + text(LOREM.p1, LOREM.p2, LOREM.p3) + '<div class="p-stack">' + media("r16x9") + media("r16x9") + "</div></div></section>";

    // 9. sessions QA (réf. Project GLOW)
    h += '<section class="p-sec">' + secTitle(t(U.qa), "right") +
      '<div class="p-split rev">' + media("r16x9", t(U.qaCap)) + text(LOREM.p1, LOREM.p2) + "</div></section>";

    // 10. ce que j'ai appris
    h += '<section class="p-sec p-learned">' + secTitle(t(U.learned), "center") + text(LOREM.p1) +
      '<p class="p-allowed">' + esc(t(U.allowed)) + "</p>" + list(LOREM.bullets) + "</section>";

    // 11. équipe (réf. Project GLOW) : uniquement pour les projets à plusieurs
    if (p.team && p.team > 1) {
      const n = Math.min(p.team - 1, 15);
      h += '<section class="p-sec">' + secTitle(t(U.myTeam), "center") + '<p class="p-thanks">' + esc(t(U.thanks)) + "</p>" +
        '<div class="p-full">' + media("r21x9") + "</div>" +
        '<div class="p-team">' + Array.from({ length: n }, () =>
          '<div class="member">' + placeholder("", "p-ph r1x1") + '<div class="member-card"><span class="member-name">' + esc(t(U.name)) +
          '</span><span class="member-role">' + esc(t(U.role)) + "</span></div></div>").join("") + "</div></section>";
    }

    if (p.links && p.links.length) {
      h += '<section class="p-sec"><div class="links">' +
        p.links.map((l) => '<a class="btn" href="' + esc(l.href) + '" target="_blank" rel="noopener">' + badgeGlyph(l.icon || "link", "#fefefe") + "<span>" + esc(t(l.label)) + "</span></a>").join("") +
        "</div></section>";
    }
    h += projectNav(p);
    main.innerHTML = h;
    initPdfViewers();
    return p.category;
  }

  function viewInfos() {
    const A = D.about;
    const tools = (list) => '<div class="icon-row">' + list.map((x) =>
      '<div class="icon-item">' + badgeImg("assets/icons/" + x[0] + ".webp", "#1e0e3b", x[1]) + "<span>" + esc(x[1]) + "</span></div>").join("") + "</div>";
    main.innerHTML =
      sectionTitle(t(D.ui.aboutMe)) +
      '<div class="about">' + A.text[lang].map((x) => "<p>" + x + "</p>").join("") + "</div>" +
      sectionTitle(t(D.ui.skills)) +
      '<div class="skills">' + A.skills.map((s) =>
        '<div class="skill-col"><h3>' + esc(t(s.title)) + "</h3><ul>" + s.items.map((i) => "<li>" + esc(t(i)) + "</li>").join("") + "</ul>" + tools(s.tools) + "</div>").join("") +
      '<div class="skill-col"><h3>' + esc(t(D.ui.languages)) + "</h3><ul>" + A.languages.map((l) => "<li>" + esc(t(l)) + "</li>").join("") + "</ul>" +
      "<h3>" + esc(t(D.ui.education)) + "</h3><p>" + t(A.education) + "</p></div></div>" +
      sectionTitle(t(D.ui.hobbies)) +
      '<div class="hobbies">' + A.hobbies.map((h) =>
        '<div class="hobby">' + badgeImg("assets/icons/" + h.icon + ".webp", "#1e0e3b", t(h.name), "lg") +
        "<strong>" + esc(t(h.name)) + "</strong><span>" + esc(t(h.level)) + "</span><span>" + esc(t(h.freq)) + "</span><span>" + esc(t(h.years)) + "</span></div>").join("") + "</div>";
  }

  /* ---------- routeur ---------- */
  function route() {
    const hash = location.hash || "#/home";
    const parts = hash.replace(/^#\/?/, "").split("/");
    let current = parts[0] || "home";
    if (current === "home") viewHome();
    else if (current === "professional" || current === "personal" || current === "exercise") viewCategory(current);
    else if (current === "infos") viewInfos();
    else if (current === "project") current = viewProject(parts[1]) || "home";
    else { current = "home"; viewHome(); }

    renderTopbar(current);
    renderFooter();
    document.title = t(D.ui.pageTitle);
    document.documentElement.lang = lang;
    bindTiles();
  }

  /* ---------- vidéo au survol des vignettes ---------- */
  function bindTiles() {
    main.querySelectorAll(".tile[data-video]").forEach((el) => {
      let v = null;
      const start = () => {
        if (!v) {
          v = document.createElement("video");
          v.muted = true; v.loop = true; v.playsInline = true; v.preload = "auto";
          v.addEventListener("error", () => { v.remove(); v = null; el.removeAttribute("data-video"); }, { once: true });
          v.src = el.dataset.video;
          el.insertBefore(v, el.querySelector(".chip"));
        }
        const p = v.play();
        el.classList.add("playing");
        if (p && p.catch) p.catch(() => {});
      };
      const stop = () => {
        el.classList.remove("playing");
        if (v) { v.pause(); try { v.currentTime = 0; } catch (e) {} }
      };
      el.addEventListener("mouseenter", start);
      el.addEventListener("mouseleave", stop);
      el.addEventListener("focus", start);
      el.addEventListener("blur", stop);
    });
  }

  /* ---------- événements globaux ---------- */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang]");
    if (btn) {
      lang = btn.dataset.lang;
      try { localStorage.setItem("lang", lang); } catch (err) { /* ignoré */ }
      route();
      return;
    }
    const tel = e.target.closest('#footer a[href^="tel:"]');
    if (tel && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      e.preventDefault();
      const num = D.site.contact.phone;
      const done = () => {
        tel.setAttribute("data-tip", t(D.ui.copied));
        tel.classList.add("tip-on");
        setTimeout(() => { tel.setAttribute("data-tip", num); tel.classList.remove("tip-on"); }, 1600);
      };
      const fallback = () => {
        const ta = document.createElement("textarea");
        ta.value = num; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (err) { /* ignoré */ }
        ta.remove(); done();
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(num).then(done, fallback);
      else fallback();
      return;
    }
    const cvBtn = e.target.closest(".cv-btn");
    const pop = $("#cv-pop");
    if (cvBtn && pop) {
      const open = pop.hidden;
      pop.hidden = !open;
      cvBtn.setAttribute("aria-expanded", String(open));
      return;
    }
    if (pop && !pop.hidden && !e.target.closest("#cv-pop")) {
      pop.hidden = true;
      const b = $(".cv-btn"); if (b) b.setAttribute("aria-expanded", "false");
    } else if (pop && !pop.hidden) { pop.hidden = true; }
    const menu = e.target.closest(".menu-btn");
    if (menu) {
      const bar = $("#topbar");
      const open = bar.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
      return;
    }
    if (e.target.closest(".tab")) $("#topbar").classList.remove("open");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const pop = $("#cv-pop");
    if (pop && !pop.hidden) { pop.hidden = true; const b = $(".cv-btn"); if (b) { b.setAttribute("aria-expanded", "false"); b.focus(); } }
  });

  window.addEventListener("hashchange", () => { route(); window.scrollTo(0, 0); });
  route();
})();
