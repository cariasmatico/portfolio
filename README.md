# Artist portfolio

A small static site: plain HTML, CSS and JavaScript. No build step, no framework.

```
index.html        page shell (rarely edited)
css/style.css     the look — colours, type and spacing are tokens at the top
js/content.js     ALL texts, works, media, bio and CV  ← edit this
js/app.js         turns content.js into pages
media/            your images, audio, video, PDFs
```

## Editing content

Open `js/content.js`. Each work is one block in the `works` list; copy a block to add a new one.
Give it a unique `slug` (it becomes the address, e.g. `yoursite.com/#my-new-piece`).

Media types per work: `image`, `video` (local .mp4), `vimeo`, `youtube`, `audio` (local .mp3), `embed` (Bandcamp/SoundCloud player URL).
Drop files into `media/` and reference them as `"media/filename.jpg"`. An empty `src` shows a grey placeholder.

Text fields accept simple HTML such as `<em>`, `<a href="…">` and `<br>`.

## Previewing

- Quickest: double-click `index.html`.
- With a local server (closer to the real thing): `python3 -m http.server 4173`, then open http://localhost:4173

## Publishing

Upload the whole folder to any static host: Netlify (drag and drop), GitHub Pages, Cloudflare Pages, or your own server.
