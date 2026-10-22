# JavaScript showcase

Four working projects recovered from my [JavaScript learning collection](https://github.com/GrimSyntaxCloud/javaScript), repaired and redesigned with AI assistance. Original learning source remains there; this repo contains the maintained browser apps and managed APIs.

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

## Managed API demos

`apps/interval` and `apps/field` are separate Azure Static Web Apps packages. They are **not** included in the GitHub Pages artifact. Both are deployed with managed Node.js 22 APIs in the existing free Azure setup; no App Service plan, premium Functions, paid geocoding service or Application Insights is required.

- **[Interval](https://lively-desert-0d824e10f.2.azurestaticapps.net/):** fictional event form with server-side validation and original fixed statistics. Submission data is discarded, never logged or persisted. No database or app settings required.
- **[FIELD](https://lively-tree-03a3d9f0f.5.azurestaticapps.net/):** MET Norway forecast gateway plus local GeoNames city catalog. Shared Mongo cache on the existing free Cosmos database enforces a global request gate and fixed-size cache across API instances. See [deployment notes](apps/DEPLOYMENT.md) and [provider attribution](apps/field/PROVIDER-NOTES.md).

Separate workflows test/audit each API, package only production dependencies, and deploy to `azure-interval` or `azure-field` environments. The deployment jobs remain disabled until the corresponding repository variable is set to `true` and that environment's deployment token is present. Publishing these packages requires verifying existing Azure Free capacity first.

Live validation on October 21, 2026 covered Meme Press image export, Still task persistence, Interval's actual fictional form submission and unchanged sample charts, and FIELD's manual city lookup, live forecast, unit conversion, shared cache and invalid-coordinate response. Fifteen automated behavior/integration tests pass; both managed API dependency audits report no known vulnerabilities at that time.

### Still's visual identity

Still uses a lavender dotted workspace, a cream task sheet, mint progress panel, coral sticker and a butter-yellow reminder note. Completion updates the totals and gives the original CSS flower a short celebratory motion. Task storage, legacy migration and filters are unchanged. All artwork and effects use native CSS with reduced-motion support; there are no new dependencies or paid assets.

### Meme Press's visual identity

Meme Press is a pink-and-ink internet print shop: a full-width press bed, a slightly tilted paper proof, registration marks and three numbered editing stations. Acid-green export controls and an original SVG smile bring the playful identity into the tool. Short entrance and hover effects honor reduced-motion preferences. The Canvas logic, image limits, private local processing and PNG output are unchanged; no library, font service or paid asset was added.
