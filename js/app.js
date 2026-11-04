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
    return '<span class="badge" aria-hidden="true"><img class="b-disc" src="assets/disc_lilac_' + (kind || "md") + '.png" alt="" draggable="false">' +
      '<svg class="b-glyph" viewBox="0 0 24 24" fill="none" stroke="#1e0e3b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (GLYPHS[name] || GLYPHS.link) + "</svg>" + ringImg(ring, kind || "md") + "</span>";
  }
  /* badge à monogramme (moteur sans logo fourni) */
  function badgeText(txt, ring, alt, kind) {
    return '<span class="badge" role="img" aria-label="' + esc(alt || "") + '"><img class="b-disc" src="assets/disc_lilac_' + (kind || "sm") + '.png" alt="" draggable="false">' +
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
        badgeImg("assets/photo.png", "#fefefe", "", "photo") +
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
      link("tel:" + c.phone, badgeImg("assets/icons/phone.png", w, "", "md"), c.phone) +
      link("mailto:" + c.email, badgeImg("assets/icons/mail.png", w, "", "md"), c.email) +
      link(c.linkedin, badgeImg("assets/icons/linkedin.png", w, "", "md"), t(D.ui.linkedin), ' target="_blank" rel="noopener"') +
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
    if (p.engineIcon) return badgeImg("assets/icons/" + p.engineIcon + ".png", ring, p.engine);
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
      sectionTitle(t(D.ui.projects)) +
      grid(D.projects);
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

  function viewProject(id) {
    const p = D.projects.find((x) => x.id === id);
    if (!p) { main.innerHTML = '<p class="empty">' + esc(t(D.ui.notFound)) + "</p>"; return null; }
    if (p.wip) { main.innerHTML = '<p class="empty">' + esc(t(D.ui.wipTitle)) + "</p>"; return p.category; }
    const back = D.tabs.find((x) => x.id === p.category);
    let html =
      '<a class="back" href="' + back.route + '">' + esc(t(D.ui.back)) + "</a>" +
      banner(p) +
      '<p class="proj-context">' + esc(t(p.context)) + "</p>";

    if (p.roles && p.roles.length) {
      html += '<section class="block"><h3>' + esc(t(D.ui.myRoles)) + '</h3><ul class="roles">' +
        p.roles.map((r) => "<li>" + t(r) + "</li>").join("") + "</ul></section>";
    }
    // zone vidéo / trailer
    html += '<section class="block"><h3>' + esc(t(D.ui.video)) + "</h3>" +
      (p.preview
        ? '<video controls playsinline preload="metadata" src="' + esc(p.preview) + '" style="width:100%;border:3px solid var(--night)"></video>'
        : placeholder(t(D.ui.mediaTodo), "ph-box")) + "</section>";

    (p.sections || []).forEach((s) => {
      html += '<section class="block"><h3>' + esc(t(s.title)) + "</h3>" +
        (s.text ? "<p>" + t(s.text) + "</p>" : '<p class="todo">' + esc(t(D.ui.todo)) + "</p>") +
        (s.image ? "<figure><img src=\"" + esc(s.image) + '" alt="" loading="lazy">' + (s.caption ? "<figcaption>" + esc(t(s.caption)) + "</figcaption>" : "") + "</figure>" : "") +
        "</section>";
    });

    if (p.links && p.links.length) {
      html += '<section class="block"><div class="links">' +
        p.links.map((l) => '<a class="btn" href="' + esc(l.href) + '" target="_blank" rel="noopener">' + badgeGlyph(l.icon || "link", "#fefefe") + "<span>" + esc(t(l.label)) + "</span></a>").join("") +
        "</div></section>";
    }
    main.innerHTML = html;
    return p.category;
  }

  function viewInfos() {
    const A = D.about;
    const tools = (list) => '<div class="icon-row">' + list.map((x) =>
      '<div class="icon-item">' + badgeImg("assets/icons/" + x[0] + ".png", "#1e0e3b", x[1]) + "<span>" + esc(x[1]) + "</span></div>").join("") + "</div>";
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
        '<div class="hobby">' + badgeImg("assets/icons/" + h.icon + ".png", "#1e0e3b", t(h.name), "lg") +
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
