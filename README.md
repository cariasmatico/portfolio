# Artist portfolio

A small static site: plain HTML, CSS and JavaScript, no framework.

```
js/content.js     ALL texts, works, media, bio and CV  ← edit this
css/style.css     the look — colours, type and spacing are tokens at the top
js/app.js         turns content.js into pages
js/gadget.js      the creature on the landing page
build.js          writes one HTML file per page (run: node build.js)
media/            your images, audio, video, PDFs

made by build.js — don't edit by hand, they are overwritten:
index.html, works/, agenda/, about/, contact/, 404.html, sitemap.xml
```

## Editing content

Open `js/content.js`. Each work is one block in the `works` list; copy a block to add a new one.
Give it a unique `slug` (it becomes the address, e.g. `…/portfolio/works/my-new-piece/`).
To link to a work from any text or agenda entry, write `#my-new-piece`; the site turns it into the right address.

Media types per work: `image`, `video` (local .mp4), `vimeo`, `youtube`, `audio` (local .mp3), `embed` (Bandcamp/SoundCloud player URL).
Drop files into `media/` and reference them as `"media/filename.jpg"`. An empty `src` shows a grey placeholder.

Text fields accept simple HTML such as `<em>`, `<a href="…">` and `<br>`.

## Build step (after every content change)

Each page has its own address and its own HTML file, so Google and link previews
(WhatsApp, Instagram, email…) can read every page. After editing `content.js`, run:

```
node build.js
```

It rewrites the page files and `sitemap.xml`. If you forget, visitors still see the new
content, but a new work's address won't exist yet and search engines see the old text.
Link previews use each work's `thumbnail` (or its first image) and the first paragraph
of its description.

## Previewing

- Quickest: double-click `index.html` (pages then use `#works`-style addresses).
- With a local server (closer to the real thing): `python3 -m http.server 4173`, then open http://localhost:4173

## Publishing

Live at https://cariasmatico.github.io/portfolio/ (GitHub Pages, from the `main` branch of github.com/cariasmatico/portfolio).

To update the live site after editing, run in this folder:

```
node build.js
git add -A
git commit -m "Describe what changed"
git push
```

GitHub rebuilds the site in about a minute.

## Search engines

The site address is `siteUrl` in `content.js`. To get listed faster, add the site to
[Google Search Console](https://search.google.com/search-console) and
[Bing Webmaster Tools](https://www.bing.com/webmasters) (Bing also feeds DuckDuckGo),
and submit `https://cariasmatico.github.io/portfolio/sitemap.xml` in both.
If you move to your own domain, change `siteUrl` and run `node build.js` again.
