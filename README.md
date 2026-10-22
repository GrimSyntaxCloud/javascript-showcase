# JavaScript showcase

Two working browser tools recovered from my [JavaScript learning collection](https://github.com/GrimSyntaxCloud/javaScript), repaired and redesigned with AI assistance. Original learning source remains there; this repo contains the maintained static versions.

- **[Meme Press](https://grimsyntaxcloud.github.io/javascript-showcase/meme-press/)** — a playful image-and-caption workshop. Choose a local image, edit wrapped captions, adjust text size, and download a PNG. Your image stays in your browser.
- **[Still](https://grimsyntaxcloud.github.io/javascript-showcase/still/)** — a quiet task list. Add tasks, mark them complete, filter and remove tasks. Changes persist in this browser's localStorage.

## How they work

Meme Press uses the Canvas API to draw an original sample illustration or a selected JPG/PNG/WebP image, then overlays captions and exports a PNG Blob. File type and size are checked (10 MB/40 MP maximum); output has a maximum 2400-pixel longest side. No images are uploaded.

Still uses DOM elements and `textContent` to render tasks safely. It stores tasks under `still.tasks.v1`, imports valid legacy `TASKS` data if present, and reports unavailable/corrupt storage honestly. There is no backend or cross-device synchronization.

Both apps use semantic HTML, responsive CSS, system fonts and native JavaScript. There are no package dependencies, third-party assets, analytics, API keys or paid services.

## Local development

Use Node.js 24 or newer:

```sh
npm run check
```

This runs five behavior tests and builds `dist/` with an explicit two-app allowlist. Preview with a static HTTP server, for example `python3 -m http.server 4341 --directory dist`, then open `http://127.0.0.1:4341/`.

Tests cover canvas scaling, invalid image rejection, caption wrapping, task lifecycle/literal HTML input, and legacy data normalization. Browser checks additionally verify PNG download/reimport, localStorage persistence and responsive layouts.

## Publishing

Pushes to `main` test and publish `dist/` through GitHub Actions to GitHub Pages. Pull requests check without publishing. Actions are pinned to commit hashes and Dependabot checks them weekly. Only `index.html`, `meme-press/` and `still/` are uploaded; no backend code is included.

Public repository and GitHub Pages hosting use the free offering. The original `javaScript` repository is preserved.
