/* =========================================================================
   GADGET — a small creature in the bottom-right corner of the landing page.
   Hover: it notices you (eyes follow the pointer, it shivers, shows its label).
   Click: it crouches, jumps, glitches and lands in another medium:
     body → pixel → video feed → score → render → body …
   Everything is drawn on a <canvas> in a 100 × 100 unit space.
   ========================================================================= */
(function () {
  "use strict";

  /* The media it moves through. Rename the labels freely. */
  var MEDIA = [
    { key: "body",  label: "body" },
    { key: "pixel", label: "pixel" },
    { key: "feed",  label: "video feed" },
    { key: "score", label: "score" },
    { key: "mesh",  label: "render" }
  ];

  var R = 24;                      // body radius (units)
  var SWITCH_AT = 260;             // ms after click when the medium changes
  var GLITCH = 380;                // ms of glitch transition

  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- DOM ---------- */
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "gadget";
  btn.setAttribute("aria-label", "A small creature. Click to move it into another medium.");
  btn.innerHTML = '<span class="gadget-label" aria-live="polite"></span><canvas aria-hidden="true"></canvas>';
  document.body.appendChild(btn);

  /* drop zone shown in the middle of the screen while dragging */
  var target = document.createElement("div");
  target.className = "gadget-target";
  target.setAttribute("aria-hidden", "true");
  target.innerHTML = "<span>invert</span>";
  document.body.appendChild(target);

  var cv = btn.querySelector("canvas");
  var labelEl = btn.querySelector(".gadget-label");
  var ctx = cv.getContext("2d");
  var offA = document.createElement("canvas"), offB = document.createElement("canvas");
  var px = 0, INK = "#141414", PAPER = "#ffffff";

  function resize() {
    var s = cv.getBoundingClientRect().width || 80;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    px = Math.max(1, Math.round(s * dpr));
    [cv, offA, offB].forEach(function (c) { c.width = c.height = px; });
    readColors();
  }
  function readColors() {
    var cs = getComputedStyle(document.documentElement);
    INK = cs.getPropertyValue("--ink").trim() || INK;
    PAPER = cs.getPropertyValue("--paper").trim() || PAPER;
  }

  /* ---------- state ---------- */
  var st = {
    medium: 0, prev: 0,
    hover: false,
    look: { x: 0, y: 0 }, lookTarget: { x: 0, y: 0 },
    clickAt: -1, switchAt: -1, glitchAt: -1,
    blinkAt: performance.now() + 2500,
    labelUntil: 0
  };

  function hash(a, b) { var s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); }

  /* ---------- shape ---------- */
  function radius(a, t) {
    var w = reduce ? 0 : 1;
    return R * (1 + w * (0.07 * Math.sin(3 * a + t * 1.7) + 0.045 * Math.sin(5 * a - t * 2.3) + 0.03 * Math.sin(2 * a + t * 0.9)));
  }

  function pose(now) {
    var t = now / 1000, cx = 50, cy = 64, sx = 1, sy = 1;
    if (!reduce) { var b = Math.sin(t * 2.2) * 0.025; sx += b; sy -= b; }
    if (st.hover && !reduce && !drag.active) { cx += Math.sin(t * 40) * 0.6; sx += 0.05; sy += 0.05; }
    if (drag.active && !reduce) {               // dangling from the pointer
      var v = Math.min(1, Math.abs(drag.vx) / 25);
      sx += -0.1 + v * 0.15; sy += 0.14 - v * 0.1;
      cy += 3 + Math.sin(t * 9) * 1.2;
    }

    if (st.clickAt >= 0 && !reduce) {
      var k = now - st.clickAt, p;
      if (k < 140) {                         // crouch
        p = k / 140; sx += 0.22 * p; sy -= 0.22 * p;
      } else if (k < 560) {                  // jump
        p = (k - 140) / 420;
        var h = 4 * p * (1 - p), c = Math.pow(1 - p, 3);
        cy -= 24 * h; sx += 0.22 * c - 0.12 * h; sy += -0.22 * c + 0.16 * h;
      } else if (k < 820) {                  // land and settle
        p = (k - 560) / 260;
        var d = Math.sin(p * Math.PI * 2) * (1 - p);
        sx += 0.2 * d; sy -= 0.2 * d;
      } else st.clickAt = -1;
    }
    return { cx: cx, cy: cy, sx: sx, sy: sy, t: t };
  }

  function outline(P, n) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2, r = radius(a, P.t);
      pts.push([P.cx + Math.cos(a) * r * P.sx, P.cy + Math.sin(a) * r * P.sy]);
    }
    return pts;
  }
  function pathOf(c, pts) {
    c.beginPath();
    pts.forEach(function (p, i) { i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); });
    c.closePath();
  }
  function inside(x, y, P) {
    var dx = (x - P.cx) / P.sx, dy = (y - P.cy) / P.sy;
    return Math.sqrt(dx * dx + dy * dy) < radius(Math.atan2(dy, dx), P.t);
  }
  function eyes(P, now) {
    var open = now > st.blinkAt && now < st.blinkAt + 130 ? 0.15 : 1;
    if (st.hover) open *= 1.2;
    if (drag.active) open = drag.hot ? 1.45 : 1.3;   // surprised
    return [-1, 1].map(function (s) {
      return { x: P.cx + (s * 8 + st.look.x * 3.5) * P.sx, y: P.cy + (-4 + st.look.y * 3) * P.sy, open: open };
    });
  }

  /* ---------- one renderer per medium ---------- */
  var draw = {
    body: function (c, P, E) {
      c.fillStyle = INK; pathOf(c, outline(P, 72)); c.fill();
      c.fillStyle = PAPER;
      E.forEach(function (e) { c.beginPath(); c.ellipse(e.x, e.y, 3.2, 3.2 * e.open, 0, 0, Math.PI * 2); c.fill(); });
    },

    pixel: function (c, P, E) {
      var cell = 6;
      c.fillStyle = INK;
      for (var x = 2; x < 100; x += cell)
        for (var y = 1; y < 100; y += cell)
          if (inside(x + cell / 2, y + cell / 2, P)) c.fillRect(x, y, cell + 0.05, cell + 0.05);
      c.fillStyle = PAPER;
      E.forEach(function (e) {
        var gx = 2 + Math.floor((e.x - 2) / cell) * cell, gy = 1 + Math.floor((e.y - 1) / cell) * cell;
        var h = cell * e.open; c.fillRect(gx, gy + (cell - h) / 2, cell, h);
      });
    },

    feed: function (c, P, E) {
      var frame = Math.floor(P.t * 12), roll = (P.t * 28) % 130 - 15;
      c.save(); pathOf(c, outline(P, 72)); c.clip();
      c.fillStyle = INK;
      for (var i = 0, y = 0; y < 100; i++, y += 2.6) {
        var off = hash(i, frame) > 0.9 ? (hash(i, frame + 3) - 0.5) * 9 : 0;
        var th = Math.abs(y - roll) < 4 ? 0.5 : 1.5;
        c.fillRect(off, y, 100, th);
      }
      c.restore();
      c.fillStyle = PAPER;
      E.forEach(function (e) { var h = 5 * e.open; c.fillRect(e.x - 3, e.y - h / 2, 6, h); });
    },

    score: function (c, P, E) {
      var pts = outline(P, 72);
      c.lineWidth = 0.7; c.strokeStyle = INK; pathOf(c, pts); c.stroke();
      c.save(); pathOf(c, pts); c.clip();
      for (var s = -2; s <= 2; s++) { c.beginPath(); c.moveTo(0, P.cy + s * 5 * P.sy); c.lineTo(100, P.cy + s * 5 * P.sy); c.stroke(); }
      c.restore();
      var shift = (P.t * 6) % 7, base = Math.floor(P.t * 6 / 7);
      c.fillStyle = INK;
      for (var col = -6; col <= 6; col++) {
        var x = P.cx + col * 7 - shift;
        for (var pos = -7; pos <= 7; pos++) {
          var y = P.cy + pos * 2.5 * P.sy;
          if (hash(col + base, pos) < 0.2 && inside(x, y, P) && inside(x + 3, y, P) && inside(x - 3, y, P)) {
            c.beginPath(); c.ellipse(x, y, 2.5, 1.8, -0.35, 0, Math.PI * 2); c.fill();
            if (inside(x + 2.3, y - 8, P)) { c.beginPath(); c.moveTo(x + 2.3, y); c.lineTo(x + 2.3, y - 8); c.stroke(); }
          }
        }
      }
      E.forEach(function (e) {   // eyes are open noteheads
        c.fillStyle = PAPER; c.lineWidth = 1.1;
        c.beginPath(); c.ellipse(e.x, e.y, 3, 2.2 * e.open, -0.35, 0, Math.PI * 2); c.fill(); c.stroke();
      });
    },

    mesh: function (c, P, E) {
      var rot = P.t * 0.9, rx = R * P.sx, ry = R * P.sy, pts = outline(P, 18);
      c.strokeStyle = INK; c.lineWidth = 0.7;
      pathOf(c, pts); c.stroke();
      [-0.55, 0, 0.55].forEach(function (k) {      // latitudes
        var w = rx * Math.sqrt(1 - k * k);
        c.beginPath(); c.ellipse(P.cx, P.cy + k * ry, w, w * 0.22, 0, 0, Math.PI * 2); c.stroke();
      });
      for (var j = 0; j < 3; j++) {                 // longitudes, turning
        var w2 = Math.abs(Math.cos(rot + j * Math.PI / 3)) * rx;
        c.beginPath(); c.ellipse(P.cx, P.cy, Math.max(w2, 0.1), ry, 0, 0, Math.PI * 2); c.stroke();
      }
      c.fillStyle = INK;
      pts.forEach(function (p) { c.fillRect(p[0] - 1, p[1] - 1, 2, 2); });
      E.forEach(function (e) { c.beginPath(); c.ellipse(e.x, e.y, 2.4, 2.4 * e.open, 0, 0, Math.PI * 2); c.fill(); });
    }
  };

  function renderInto(c, medium, P, E) {
    c.setTransform(px / 100, 0, 0, px / 100, 0, 0);
    c.clearRect(0, 0, 100, 100);
    draw[MEDIA[medium].key](c, P, E);
  }

  /* ---------- frame ---------- */
  function frame(now) {
    raf = 0;
    if (btn.hidden || document.hidden) return;

    st.look.x += (st.lookTarget.x - st.look.x) * 0.12;
    st.look.y += (st.lookTarget.y - st.look.y) * 0.12;
    if (now > st.blinkAt + 130) st.blinkAt = now + 1800 + Math.random() * 3500;

    if (st.switchAt >= 0 && now >= st.switchAt) {
      st.prev = st.medium;
      st.medium = (st.medium + 1) % MEDIA.length;
      st.switchAt = -1;
      st.glitchAt = reduce ? -1 : now;
      showLabel(1800);
    }

    var P = pose(now), E = eyes(P, now);
    var g = st.glitchAt >= 0 ? (now - st.glitchAt) / GLITCH : 1;

    if (g < 1) {
      var ca = offA.getContext("2d"), cb = offB.getContext("2d");
      renderInto(ca, st.prev, P, E);
      renderInto(cb, st.medium, P, E);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, px, px);
      var bh = Math.max(1, Math.round(px / 25)), f = Math.floor(now / 45);
      for (var i = 0, y = 0; y < px; i++, y += bh) {
        var src = hash(i, f) < g * 1.2 - 0.1 ? offB : offA;
        var off = (hash(i, f + 9) - 0.5) * px * 0.3 * Math.sin(Math.PI * g);
        ctx.drawImage(src, 0, y, px, bh, off, y, px, bh);
      }
    } else {
      st.glitchAt = -1;
      renderInto(ctx, st.medium, P, E);
    }

    if (now > st.labelUntil && !st.hover && !drag.active) btn.classList.remove("show-label");
    loop();
  }

  var raf = 0;
  function loop() { if (!raf) raf = requestAnimationFrame(frame); }

  function showLabel(ms) {
    labelEl.textContent = "fig. " + (st.medium + 1) + " — " + MEDIA[st.medium].label;
    btn.classList.add("show-label");
    st.labelUntil = performance.now() + ms;
  }

  /* ---------- events ---------- */
  btn.addEventListener("pointerenter", function () { st.hover = true; showLabel(0); });
  btn.addEventListener("pointerleave", function () { st.hover = false; });

  window.addEventListener("pointermove", function (e) {
    var r = cv.getBoundingClientRect();
    var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.6);
    var d = Math.sqrt(dx * dx + dy * dy) || 1, m = Math.min(1, d / 160);
    st.lookTarget = { x: dx / d * m, y: dy / d * m };
  }, { passive: true });

  btn.addEventListener("click", function () {
    if (drag.justDragged) { drag.justDragged = false; return; }   // a drag, not a click
    var now = performance.now();
    if (st.switchAt >= 0) return;            // already mid-jump
    st.clickAt = now;
    st.switchAt = now + (reduce ? 0 : SWITCH_AT);
    loop();
  });

  /* ---------- drag to the centre → invert the site ---------- */
  var drag = { id: null, active: false, hot: false, sx: 0, sy: 0, dx: 0, dy: 0, vx: 0, lastX: 0, justDragged: false };

  function hotRadius() { return Math.max(56, Math.min(innerWidth, innerHeight) * 0.12); }

  btn.addEventListener("pointerdown", function (e) {
    if (e.button !== 0 || drag.id !== null) return;
    drag.id = e.pointerId; drag.sx = e.clientX; drag.sy = e.clientY; drag.lastX = e.clientX;
    drag.active = false; drag.justDragged = false;
    try { btn.setPointerCapture(e.pointerId); } catch (err) {}
  });

  btn.addEventListener("pointermove", function (e) {
    if (e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (!drag.active && Math.sqrt(dx * dx + dy * dy) < 7) return;
    if (!drag.active) {
      drag.active = true;
      btn.classList.add("dragging"); target.classList.add("show");
      btn.style.transition = "none";
    }
    drag.dx = dx; drag.dy = dy;
    drag.vx = drag.vx * 0.7 + (e.clientX - drag.lastX) * 0.3; drag.lastX = e.clientX;
    btn.style.transform = "translate(" + dx + "px," + dy + "px)";

    var r = btn.getBoundingClientRect();
    var cx = r.left + r.width / 2 - innerWidth / 2, cy = r.top + r.height / 2 - innerHeight / 2;
    var hot = Math.sqrt(cx * cx + cy * cy) < hotRadius();
    if (hot !== drag.hot) {
      drag.hot = hot;
      target.classList.toggle("hot", hot);
      if (hot) { labelEl.textContent = isInverted() ? "back to paper" : "invert"; btn.classList.add("show-label"); }
      else btn.classList.remove("show-label");
    }
    loop();
  });

  function endDrag(e) {
    if (e.pointerId !== drag.id) return;
    drag.id = null;
    if (!drag.active) return;                 // it was a plain click
    drag.active = false; drag.justDragged = true;
    setTimeout(function () { drag.justDragged = false; }, 50);
    btn.classList.remove("dragging", "show-label");
    target.classList.remove("show", "hot");

    if (drag.hot && e.type === "pointerup") { drag.hot = false; invertFromCentre(); return; }
    drag.hot = false;
    // spring back to the corner
    btn.style.transition = reduce ? "none" : "transform 0.5s cubic-bezier(.3,1.5,.5,1)";
    btn.style.transform = "";
  }
  btn.addEventListener("pointerup", endDrag);
  btn.addEventListener("pointercancel", endDrag);

  function isInverted() { return document.documentElement.hasAttribute("data-inverted"); }

  function setInverted(on) {
    if (on) document.documentElement.setAttribute("data-inverted", "");
    else document.documentElement.removeAttribute("data-inverted");
    try { localStorage.setItem("inverted", on ? "1" : "0"); } catch (err) {}
    readColors();
  }

  /* the creature is swallowed by the centre, the page flips,
     and it pops back out in the corner in the new colours */
  function invertFromCentre() {
    var t = "translate(" + drag.dx + "px," + drag.dy + "px)";
    btn.style.transition = reduce ? "none" : "transform 0.25s ease-in";
    btn.style.transform = t + " scale(0)";
    setTimeout(function () {
      setInverted(!isInverted());
      btn.style.transition = "none";
      btn.style.transform = "scale(0)";
      setTimeout(function () {
        btn.style.transition = reduce ? "none" : "transform 0.45s cubic-bezier(.3,1.6,.5,1)";
        btn.style.transform = "";
        st.clickAt = performance.now();         // little landing bounce
      }, reduce ? 0 : 420);
    }, reduce ? 0 : 260);
  }

  /* keyboard: "i" inverts while the creature has focus */
  btn.addEventListener("keydown", function (e) {
    if (e.key === "i" || e.key === "I") { setInverted(!isInverted()); }
  });

  /* ---------- only on the landing page ---------- */
  function onRoute() {
    btn.hidden = document.body.getAttribute("data-page") !== "home";
    target.classList.remove("show", "hot");
    if (!btn.hidden) { resize(); loop(); }
  }
  document.addEventListener("pagechange", onRoute);   // sent by app.js after each page change
  window.addEventListener("resize", function () { if (!btn.hidden) resize(); });
  document.addEventListener("visibilitychange", loop);
  onRoute();
})();
