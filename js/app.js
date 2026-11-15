/* =========================================================================
   APP — builds the pages from window.SITE (js/content.js)
   Pages are chosen by the part of the address after "#":
     (empty)   landing page
     #works    works index
     #<slug>   a single work, e.g. #field-notes
     #about    bio and CV
     #contact  contact
   ========================================================================= */
(function () {
  "use strict";

  var S = window.SITE;
  var app = document.getElementById("app");
  var headerEl = document.getElementById("site-header");
  var footerEl = document.getElementById("site-footer");

  var bySlug = {};
  S.works.forEach(function (w) { bySlug[w.slug] = w; });

  /* Works page state: filter + grid/list, remembered per visitor */
  var COLLAB = "Collaborations";
  var state = { filter: "All", view: load("works-view") || "grid" };

  function isCollab(w) { return !!w.collaboration; }
  function tagsOf(w) { return w.tags || []; }
  /* "All" and the category filters show own works only; collaborations have their own filter */
  function matches(w, f) {
    if (f === COLLAB) return isCollab(w);
    if (isCollab(w)) return false;
    return f === "All" || tagsOf(w).indexOf(f) !== -1;
  }

  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function plain(html) { return String(html).replace(/<[^>]*>/g, ""); }
  function attr(s) { return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }

  /* ---------- Header & footer ---------- */

  function renderHeader(current) {
    var items = [["works", "Works"], ["agenda", "Agenda"], ["about", "About"], ["contact", "Contact"]];
    var isWork = !!bySlug[current];
    headerEl.hidden = current === "";
    headerEl.innerHTML =
      '<div class="wrap header-inner">' +
        '<a class="brand" href="#">' + S.name + "</a>" +
        '<nav class="nav" aria-label="Main">' +
          items.map(function (it) {
            var on = current === it[0] || (isWork && it[0] === "works");
            return '<a href="#' + it[0] + '"' + (on ? ' aria-current="page"' : "") + ">" + it[1] + "</a>";
          }).join("") +
        "</nav>" +
      "</div>";
  }

  function renderFooter() {
    footerEl.innerHTML =
      '<div class="wrap footer-inner">' +
        "<span>© " + new Date().getFullYear() + " " + S.name + "</span>" +
        '<span class="footer-mail">' + S.contact.email + "</span>" +
      "</div>";
  }

  /* ---------- Placeholder drawings (used until a thumbnail exists) ----------
     Each work gets its own small drawing, picked from its slug. */

  function seeded(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return function () { h = (Math.imul(h, 1664525) + 1013904223) >>> 0; return h / 4294967296; };
  }

  function drawing(slug) {
    var r = seeded(slug); r(); r();
    var kind = Math.floor(r() * 4), s = "", i;
    var W = 400, H = 300;
    if (kind === 0) {                      // staff with scattered noteheads
      for (i = 0; i < 5; i++) s += '<line x1="40" x2="360" y1="' + (110 + i * 18) + '" y2="' + (110 + i * 18) + '"/>';
      for (i = 0; i < 9; i++) {
        var x = 60 + i * 34 + r() * 10, y = 101 + Math.round(r() * 10) * 9;
        s += '<ellipse cx="' + x + '" cy="' + y + '" rx="7" ry="5" transform="rotate(-20 ' + x + " " + y + ')" class="fill"/>';
      }
    } else if (kind === 1) {               // concentric rings, off-centre
      var cx = 140 + r() * 120, cy = 120 + r() * 60;
      for (i = 1; i < 9; i++) s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (i * 14 + r() * 6) + '"/>';
    } else if (kind === 2) {               // waveform bars
      for (i = 0; i < 48; i++) {
        var h = 6 + Math.abs(Math.sin(i / 5 + r())) * 90 * r();
        s += '<line x1="' + (56 + i * 6.2) + '" x2="' + (56 + i * 6.2) + '" y1="' + (150 - h) + '" y2="' + (150 + h) + '"/>';
      }
    } else {                                // graphic-score strokes
      for (i = 0; i < 7; i++) {
        var y0 = 70 + i * 26, x0 = 40 + r() * 60, x1 = 220 + r() * 140;
        s += '<path d="M' + x0 + " " + y0 + " C " + (x0 + 60) + " " + (y0 - 30 * r()) + ", " + (x1 - 60) + " " + (y0 + 30 * r()) + ", " + x1 + " " + y0 + '"/>';
      }
    }
    return '<svg class="drawing" viewBox="0 0 ' + W + " " + H + '" aria-hidden="true">' + s + "</svg>";
  }

  function thumb(w) {
    return w.thumbnail
      ? '<img src="' + attr(w.thumbnail) + '" alt="" loading="lazy">'
      : drawing(w.slug);
  }

  /* ---------- Media ---------- */

  function placeholder(kind, hint, ratio) {
    return '<div class="ph ' + (ratio || "") + '"><span class="ph-kind">' + kind + '</span><span class="ph-hint">' + hint + "</span></div>";
  }

  function mediaItem(m) {
    var watch = "";
    if (m.type === "youtube" && m.id) watch = "https://www.youtube.com/watch?v=" + m.id + (m.start ? "&t=" + m.start + "s" : "");
    if (m.type === "vimeo" && m.id) watch = "https://vimeo.com/" + m.id;
    var cap = (m.caption || watch)
      ? "<figcaption>" + (m.caption || "") +
          (watch ? ' <a class="watch" href="' + attr(watch) + '" target="_blank" rel="noopener">Watch on ' + (m.type === "vimeo" ? "Vimeo" : "YouTube") + " ↗</a>" : "") +
        "</figcaption>"
      : "";
    var body;
    switch (m.type) {
      case "image":
        body = m.src ? '<img src="' + attr(m.src) + '" alt="' + attr(plain(m.caption || "")) + '" loading="lazy">'
                     : placeholder("Image", "add src in content.js", "r-4x3");
        break;
      case "video":
        body = m.src ? '<video controls preload="metadata" playsinline src="' + attr(m.src) + '"' + (m.poster ? ' poster="' + attr(m.poster) + '"' : "") + "></video>"
                     : placeholder("Video", "add an .mp4 src in content.js", "r-16x9");
        break;
      case "vimeo":
        body = m.id ? '<div class="frame r-16x9"><iframe src="https://player.vimeo.com/video/' + attr(m.id) + '?dnt=1" allow="fullscreen; picture-in-picture" allowfullscreen loading="lazy" title="' + attr(plain(m.caption || "Video")) + '"></iframe></div>'
                    : placeholder("Vimeo", "add the video id in content.js", "r-16x9");
        break;
      case "youtube":
        body = m.id ? '<div class="frame r-16x9"><iframe src="https://www.youtube-nocookie.com/embed/' + attr(m.id) + (m.start ? '?start=' + attr(m.start) : '') + '" allow="fullscreen; picture-in-picture" allowfullscreen loading="lazy" title="' + attr(plain(m.caption || "Video")) + '"></iframe></div>'
                    : placeholder("YouTube", "add the video id in content.js", "r-16x9");
        break;
      case "audio":
        body = m.src ? '<audio controls preload="none" src="' + attr(m.src) + '"></audio>'
                     : placeholder("Audio", "add an .mp3 src in content.js", "r-audio");
        break;
      case "embed":
        body = m.src ? '<iframe class="embed" src="' + attr(m.src) + '" style="height:' + (m.height || 120) + 'px" loading="lazy" title="' + attr(plain(m.caption || "Embedded player")) + '"></iframe>'
                     : placeholder("Embed", "add a player url in content.js", "r-audio");
        break;
      default:
        return "";
    }
    return '<figure class="media media-' + m.type + '">' + body + cap + "</figure>";
  }

  /* ---------- Views ---------- */

  function home() {
    var featured = S.works.filter(function (w) { return w.featured; });
    var upcoming = agendaSplit().upcoming;

    return {
      title: S.name,
      html:
        '<section class="home wrap">' +
          '<h1 class="home-name">' + S.name + "</h1>" +
          '<p class="home-tagline">' + S.tagline + "</p>" +
          '<nav class="home-nav" aria-label="Main">' +
            '<a href="#works">Works</a><a href="#agenda">Agenda</a><a href="#about">About & CV</a><a href="#contact">Contact</a>' +
          "</nav>" +
          '<div class="home-cols">' +
            (featured.length ?
              '<div class="home-block"><h2 class="label">Recent works</h2><ul class="plain-list">' +
                featured.map(function (w) {
                  return '<li><a href="#' + w.slug + '"><span class="yr">' + w.year + '</span><span><em class="t">' + w.title + '</em> <span class="soft">' + (w.medium || "") + "</span></span></a></li>";
                }).join("") +
              "</ul></div>" : "") +
            (upcoming.length ?
              '<div class="home-block"><h2 class="label">Upcoming</h2><ul class="plain-list">' +
                upcoming.map(agendaRow).join("") +
              '</ul><a class="more" href="#agenda">Full agenda →</a></div>' : "") +
          "</div>" +
        "</section>"
    };
  }

  /* ---------- Agenda ----------
     Dates can be "2027-01-08", "2026-06" (month only) or "2021" (year only). */

  function dateParts(iso) {
    var p = String(iso).split("-").map(Number);
    return { y: p[0], m: p[1] || 0, d: p[2] || 0 };
  }
  function dateStart(iso) { var q = dateParts(iso); return new Date(q.y, q.m ? q.m - 1 : 0, q.d || 1); }
  function dateEnd(iso) {
    var q = dateParts(iso);
    if (q.d) return new Date(q.y, q.m - 1, q.d, 23, 59);
    if (q.m) return new Date(q.y, q.m, 0, 23, 59);       // last day of that month
    return new Date(q.y, 11, 31, 23, 59);
  }
  function fmtDate(iso) {
    var q = dateParts(iso);
    if (!q.m) return String(q.y);
    var opts = q.d ? { day: "numeric", month: "short", year: "numeric" } : { month: "short", year: "numeric" };
    return dateStart(iso).toLocaleDateString("en-GB", opts);
  }

  /* everything in S.agenda, split by today's date */
  function agendaSplit() {
    var now = new Date(), all = (S.agenda || S.upcoming || []).slice();
    var up = all.filter(function (u) { return dateEnd(u.date) >= now; })
                .sort(function (a, b) { return dateStart(a.date) - dateStart(b.date); });
    var past = all.filter(function (u) { return dateEnd(u.date) < now; })
                  .sort(function (a, b) { return dateStart(b.date) - dateStart(a.date); });
    return { upcoming: up, past: past };
  }

  /* one line: date · title (italic, linked when url is set) · text.
     url can be external ("https://…") or one of your works ("#aparicion"). */
  function agendaRow(u) {
    var title = u.title ? "<em>" + u.title + "</em>" : "";
    if (title && u.url) {
      var ext = u.url.charAt(0) !== "#";
      title = '<a class="up-link" href="' + attr(u.url) + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + title + (ext ? " ↗" : "") + "</a>";
    }
    var text = title + (title && u.text ? ", " : "") + (u.text || "");
    return '<li><div class="row"><span class="yr">' + fmtDate(u.date) + "</span><span>" + text + "</span></div></li>";
  }

  function agendaPage() {
    var A = agendaSplit();
    return {
      title: "Agenda — " + S.name,
      html:
        '<section class="agenda wrap">' +
          '<h1 class="page-title">Agenda</h1>' +
          '<div class="agenda-block"><h2 class="label">Upcoming</h2>' +
            (A.upcoming.length ? '<ul class="plain-list">' + A.upcoming.map(agendaRow).join("") + "</ul>"
                               : '<p class="soft">No dates announced right now.</p>') +
          "</div>" +
          (A.past.length ? '<div class="agenda-block"><h2 class="label">Past</h2><ul class="plain-list">' + A.past.map(agendaRow).join("") + "</ul></div>" : "") +
        "</section>"
    };
  }

  function worksPage() {
    var cats = ["All"].concat(S.categories, [COLLAB]);
    return {
      title: "Works — " + S.name,
      html:
        '<section class="works wrap">' +
          '<div class="works-bar">' +
            '<h1 class="page-title">Works</h1>' +
            '<div class="filters" role="group" aria-label="Filter by category">' +
              cats.map(function (c) {
                return (c === COLLAB ? '<span class="filters-sep" aria-hidden="true">/</span>' : "") +
                  '<button type="button" class="chip" data-filter="' + attr(c) + '" aria-pressed="' + (state.filter === c) + '">' + c + "</button>";
              }).join("") +
            "</div>" +
            '<div class="view-toggle" role="group" aria-label="Layout">' +
              '<button type="button" class="chip" data-view="grid" aria-pressed="' + (state.view === "grid") + '">Grid</button>' +
              '<button type="button" class="chip" data-view="list" aria-pressed="' + (state.view === "list") + '">List</button>' +
            "</div>" +
          "</div>" +
          '<div id="works-out">' + worksList() + "</div>" +
        "</section>"
    };
  }

  function worksList() {
    var list = S.works.filter(function (w) { return matches(w, state.filter); });
    if (!list.length) return '<p class="soft">Nothing in this category yet.</p>';

    if (state.view === "list") {
      return '<ol class="work-rows">' + list.map(function (w) {
        return '<li><a href="#' + w.slug + '">' +
          '<span class="yr">' + w.year + "</span>" +
          '<em class="t">' + w.title + "</em>" +
          '<span class="soft">' + (w.medium || "") + "</span>" +
          '<span class="soft dur">' + (isCollab(w) ? tagsOf(w).join(", ") : (w.duration || "")) + "</span>" +
        "</a></li>";
      }).join("") + "</ol>";
    }

    return '<ul class="grid">' + list.map(function (w) {
      return '<li><a class="card" href="#' + w.slug + '">' +
        '<div class="card-img">' + thumb(w) + "</div>" +
        '<div class="card-cap"><em class="t">' + w.title + '</em>, ' + w.year +
          '<span class="soft">' + (w.medium || "") + "</span></div>" +
      "</a></li>";
    }).join("") + "</ul>";
  }

  function workPage(w) {
    if (!matches(w, state.filter)) state.filter = isCollab(w) ? COLLAB : "All";
    var group = S.works.filter(function (x) { return isCollab(x) === isCollab(w); });
    var i = group.indexOf(w);
    var prev = group[i - 1], next = group[i + 1];
    var meta = [
      ["Year", w.year], [isCollab(w) ? "Role" : "Medium", isCollab(w) ? w.role : w.medium], ["Duration", w.duration],
      [isCollab(w) ? "Field" : "Tags", tagsOf(w).join(", ")]
    ].concat((w.details || []).map(function (d) { return [d.label, d.value]; }))
     .filter(function (p) { return p[1]; });

    return {
      title: plain(w.title) + " — " + S.name,
      html:
        '<article class="work wrap">' +
          '<header class="work-head">' +
            '<a class="back" href="#works">← ' + (isCollab(w) ? "Collaborations" : "All works") + '</a>' +
            '<h1 class="work-title"><em>' + w.title + "</em></h1>" +
            '<dl class="meta">' + meta.map(function (p) { return "<dt>" + p[0] + "</dt><dd>" + p[1] + "</dd>"; }).join("") + "</dl>" +
          "</header>" +
          '<div class="work-media">' + ((w.media && w.media.length) ? w.media.map(mediaItem).join("")
            : (w.thumbnail ? mediaItem({ type: "image", src: w.thumbnail }) : "")) + "</div>" +
          '<div class="work-text">' +
            (w.description || []).map(function (p) { return "<p>" + p + "</p>"; }).join("") +
            (w.links && w.links.length ?
              '<ul class="links">' + w.links.map(function (l) {
                return '<li><a href="' + attr(l.url) + '" target="_blank" rel="noopener">' + l.label + " ↗</a></li>";
              }).join("") + "</ul>" : "") +
          "</div>" +
          '<nav class="pager" aria-label="More works">' +
            (prev ? '<a href="#' + prev.slug + '">← <em>' + prev.title + "</em></a>" : "<span></span>") +
            (next ? '<a href="#' + next.slug + '"><em>' + next.title + "</em> →</a>" : "<span></span>") +
          "</nav>" +
        "</article>"
    };
  }

  function aboutPage() {
    var A = S.about;
    return {
      title: "About — " + S.name,
      html:
        '<section class="about wrap">' +
          '<h1 class="page-title">About</h1>' +
          '<div class="about-grid">' +
            (A.portrait
              ? '<figure class="media about-photo"><img src="' + attr(A.portrait) + '" alt="Portrait of ' + attr(plain(S.name)) + '">' + (A.portraitCaption ? "<figcaption>" + A.portraitCaption + "</figcaption>" : "") + "</figure>"
              : "") +
            '<div class="about-text">' +
              '<div class="bio">' + A.bio.map(function (p) { return "<p>" + p + "</p>"; }).join("") + "</div>" +
              '<div class="cv">' +
                '<div class="cv-head"><h2 class="label">CV</h2>' +
                  (A.cvFile ? '<a href="' + attr(A.cvFile) + '" target="_blank" rel="noopener">' + (A.cvLabel || "Full CV (PDF)") + ' ↗</a>' : "") +
                "</div>" +
                /* each CV section is a fold-out list, closed by default */
                A.cv.map(function (sec) {
                  return '<details class="cv-sec"><summary><span>' + sec.heading + '</span><span class="cv-count">' + sec.items.length + "</span></summary><ul>" +
                    sec.items.map(function (it) { return '<li><span class="yr">' + it.year + "</span><span>" + it.text + "</span></li>"; }).join("") +
                  "</ul></details>";
                }).join("") +
              "</div>" +
            "</div>" +
          "</div>" +
        "</section>"
    };
  }

  function contactPage() {
    var C = S.contact;
    return {
      title: "Contact — " + S.name,
      html:
        '<section class="contact wrap">' +
          '<h1 class="page-title">Contact</h1>' +
          '<p class="contact-note">' + C.note + "</p>" +
          '<p class="contact-mail"><a href="mailto:' + attr(C.email) + '">' + C.email + "</a>" +
            ' <button type="button" class="chip" id="copy-mail">Copy</button></p>' +
          (C.publisher ? '<p class="soft">' + C.publisher + "</p>" : "") +
          '<ul class="links">' + C.links.map(function (l) {
            return '<li><a href="' + attr(l.url) + '" target="_blank" rel="noopener">' + l.label + " ↗</a></li>";
          }).join("") + "</ul>" +
          (S.location ? '<p class="soft">' + S.location + "</p>" : "") +
        "</section>"
    };
  }

  function notFound() {
    return {
      title: "Not found — " + S.name,
      html: '<section class="wrap"><h1 class="page-title">Nothing here</h1><p>That page doesn\'t exist. <a href="#works">See all works</a>.</p></section>'
    };
  }

  /* ---------- Router ---------- */

  function route() {
    var key = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    if (key === "home") key = "";
    var view =
      key === "" ? home() :
      key === "works" ? worksPage() :
      key === "agenda" ? agendaPage() :
      key === "about" ? aboutPage() :
      key === "contact" ? contactPage() :
      bySlug[key] ? workPage(bySlug[key]) : notFound();

    renderHeader(key);
    app.innerHTML = view.html;
    document.title = view.title;
    document.body.setAttribute("data-page", bySlug[key] ? "work" : (key || "home"));
    window.scrollTo(0, 0);
  }

  /* ---------- Interactions ---------- */

  app.addEventListener("click", function (e) {
    var f = e.target.closest("[data-filter]");
    var v = e.target.closest("[data-view]");
    if (f) state.filter = f.getAttribute("data-filter");
    if (v) { state.view = v.getAttribute("data-view"); save("works-view", state.view); }
    if (f || v) {
      app.querySelectorAll("[data-filter]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-filter") === state.filter); });
      app.querySelectorAll("[data-view]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-view") === state.view); });
      document.getElementById("works-out").innerHTML = worksList();
    }

    if (e.target.id === "copy-mail") {
      var btn = e.target;
      var done = function () { btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy"; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(S.contact.email).then(done, function () { selectMail(); });
      else selectMail();
    }
  });

  function selectMail() {
    var a = app.querySelector(".contact-mail a");
    var r = document.createRange(); r.selectNodeContents(a);
    var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
  }

  /* Page change: a short fade out, swap the page, fade back in.
     Timing lives in css/style.css (main / main.is-leaving). */
  var FADE_OUT = 140, fadeTimer;
  function navigate() {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return route();
    clearTimeout(fadeTimer);
    app.classList.add("is-leaving");
    fadeTimer = setTimeout(function () {
      route();
      app.classList.remove("is-leaving");
    }, FADE_OUT);
  }

  window.addEventListener("hashchange", navigate);
  renderFooter();
  route();
})();
