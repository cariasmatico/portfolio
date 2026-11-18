#!/usr/bin/env node
/* =========================================================================
   BUILD — writes one HTML file per page, so search engines and link
   previews can read every page.

   Run it after editing js/content.js, before you push:

       node build.js

   It writes (never edit these by hand, they are overwritten each time):
     index.html                 landing page
     works/index.html           works index
     works/<slug>/index.html    one per work
     agenda/ about/ contact/    one index.html each
     404.html                   shown by GitHub for unknown addresses
     sitemap.xml                list of every page, for search engines

   The pages are made by js/app.js itself, so they look exactly like the
   live site. Visitors' browsers still re-draw them from content.js.
   ========================================================================= */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DIR = __dirname;
const read = (f) => fs.readFileSync(path.join(DIR, f), "utf8");
const CONTENT = read("js/content.js");
const APP = read("js/app.js");

/* ---------- run app.js in a tiny fake browser and capture the page ---------- */

function el() {
  return {
    innerHTML: "", hidden: false, attrs: {},
    setAttribute(k, v) { this.attrs[k] = String(v); },
    getAttribute(k) { return this.attrs[k]; },
    addEventListener() {}, querySelectorAll() { return []; },
    classList: { add() {}, remove() {}, contains() { return false; } }
  };
}

function render(site, urlPath) {
  const nodes = { app: el(), "site-header": el(), "site-footer": el(), "site-base": el() };
  const body = el();
  const document = {
    title: "", body, baseURI: site.origin + site.root,
    getElementById: (id) => nodes[id] || null,
    addEventListener() {}, dispatchEvent() {}
  };
  const window = { SITE: null, addEventListener() {}, scrollTo() {} };
  const ctx = {
    window, document, URL, CustomEvent: function () {}, console,
    location: { protocol: "https:", pathname: site.root + urlPath, hash: "", origin: site.origin, href: site.origin + site.root + urlPath },
    history: { replaceState() {}, pushState() {} }
  };
  ctx.window.scrollTo = () => {};
  ctx.scrollTo = () => {};
  vm.createContext(ctx);
  vm.runInContext(CONTENT.replace(/^\s*window\.SITE\s*=/m, "window.SITE ="), ctx);
  ctx.SITE = window.SITE;
  vm.runInContext(APP, ctx);
  return {
    title: document.title,
    page: body.attrs["data-page"],
    header: nodes["site-header"].innerHTML,
    headerHidden: nodes["site-header"].hidden,
    main: nodes.app.innerHTML,
    footer: nodes["site-footer"].innerHTML
  };
}

/* ---------- helpers ---------- */

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const plain = (h) => String(h || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
function clip(s, n) {
  s = plain(s);
  if (s.length <= n) return s;
  return s.slice(0, s.lastIndexOf(" ", n - 1)).replace(/[,;:.]$/, "") + "…";
}

/* ---------- the page template ---------- */

function pageHtml(o) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <!-- made by build.js from js/content.js: edit those, then run "node build.js" -->
  <base href="${o.base}" id="site-base">
  <title>${esc(o.title)}</title>
  <meta name="description" content="${esc(o.description)}">
  <link rel="canonical" href="${esc(o.url)}">
  <meta property="og:type" content="${o.ogType}">
  <meta property="og:site_name" content="${esc(o.siteName)}">
  <meta property="og:title" content="${esc(o.title)}">
  <meta property="og:description" content="${esc(o.description)}">
  <meta property="og:url" content="${esc(o.url)}">
${o.image ? `  <meta property="og:image" content="${esc(o.image)}">
  <meta name="twitter:card" content="summary_large_image">
` : `  <meta name="twitter:card" content="summary">
`}${o.noindex ? `  <meta name="robots" content="noindex">
` : ""}  <link rel="stylesheet" href="css/style.css">
  <!-- remembers inverted mode between visits (set by the creature) -->
  <script>try{if(localStorage.getItem("inverted")==="1")document.documentElement.setAttribute("data-inverted","")}catch(e){}</script>
${o.jsonld ? `  <script type="application/ld+json">${JSON.stringify(o.jsonld).replace(/</g, "\\u003c")}</script>
` : ""}</head>
<body data-page="${o.page}">
  <header class="site-header" id="site-header"${o.headerHidden ? " hidden" : ""}>${o.header}</header>
  <main id="app" tabindex="-1">${o.main}</main>
  <footer class="site-footer" id="site-footer">${o.footer}</footer>

  <!-- 1. All your texts, works and media live in content.js -->
  <script src="js/content.js"></script>
  <!-- 2. app.js turns that content into pages. You rarely need to touch it. -->
  <script src="js/app.js"></script>
  <!-- 3. The little creature on the landing page. Delete this line to remove it. -->
  <script src="js/gadget.js"></script>
</body>
</html>
`;
}

/* ---------- build ---------- */

const ctx0 = {};
vm.createContext(Object.assign(ctx0, { window: {} }));
vm.runInContext(CONTENT, ctx0);
const SITE = ctx0.window.SITE;
if (!SITE.siteUrl) throw new Error("Add siteUrl to js/content.js");
const siteUrl = SITE.siteUrl.replace(/\/?$/, "/");
const U = new URL(siteUrl);
const site = { origin: U.origin, root: U.pathname };
const abs = (p) => (p ? new URL(p, siteUrl).href : "");

const name = plain(SITE.name);
const portrait = SITE.about && SITE.about.portrait;
const pages = [
  { key: "", path: "", description: SITE.tagline, image: portrait },
  { key: "works", path: "works/", description: "Works by " + name + ": composition, electroacoustic music, multimedia, installation and performance." },
  { key: "agenda", path: "agenda/", description: "Upcoming and past performances and exhibitions of works by " + name + "." },
  { key: "about", path: "about/", description: clip((SITE.about.bio || [])[0] || SITE.tagline, 160), image: portrait },
  { key: "contact", path: "contact/", description: "Contact " + name + " for scores, recordings, collaborations and performances." }
].concat(SITE.works.map((w) => ({
  key: w.slug, path: "works/" + w.slug + "/", work: w,
  description: clip((w.description || [])[0] || [plain(w.title), w.year, w.medium].filter(Boolean).join(", "), 160),
  image: w.thumbnail || ((w.media || []).find((m) => m.type === "image" && m.src) || {}).src || portrait
})));

const person = {
  "@context": "https://schema.org", "@type": "Person", name,
  jobTitle: "Composer, sound artist and multimedia artist", url: siteUrl,
  image: abs(portrait) || undefined,
  sameAs: ((SITE.contact && SITE.contact.links) || []).map((l) => l.url)
};

const written = [];
function write(rel, html) {
  const f = path.join(DIR, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
  written.push(rel);
}

for (const p of pages) {
  const r = render(site, p.path);
  const depth = p.path.split("/").filter(Boolean).length;
  write(p.path + "index.html", pageHtml({
    base: depth ? "../".repeat(depth) : "./",
    title: r.title, description: plain(p.description), url: siteUrl + p.path,
    ogType: p.work ? "article" : (p.key === "" ? "profile" : "website"),
    siteName: name, image: abs(p.image),
    jsonld: p.key === "" ? person : null,
    page: r.page, header: r.header, headerHidden: r.headerHidden, main: r.main, footer: r.footer
  }));
}

/* 404: GitHub shows it for any unknown address. It needs the full base
   path because it can appear at any depth. */
{
  const r = render(site, "nothing-here/");
  write("404.html", pageHtml({
    base: site.root, title: r.title, description: SITE.tagline, url: siteUrl,
    ogType: "website", siteName: name, image: "", noindex: true,
    page: r.page, header: r.header, headerHidden: r.headerHidden, main: r.main, footer: r.footer
  }));
}

/* sitemap */
const today = new Date().toISOString().slice(0, 10);
write("sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages.map((p) => `  <url><loc>${esc(siteUrl + p.path)}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
  "\n</urlset>\n");

/* remove pages of works that no longer exist in content.js */
const worksDir = path.join(DIR, "works");
const slugs = new Set(SITE.works.map((w) => w.slug));
for (const d of fs.readdirSync(worksDir, { withFileTypes: true })) {
  if (!d.isDirectory() || slugs.has(d.name)) continue;
  const files = fs.readdirSync(path.join(worksDir, d.name));
  if (files.length === 1 && files[0] === "index.html") {
    fs.rmSync(path.join(worksDir, d.name), { recursive: true });
    console.log("removed old page works/" + d.name + "/");
  }
}

console.log("Built " + pages.length + " pages, 404.html and sitemap.xml for " + siteUrl);
