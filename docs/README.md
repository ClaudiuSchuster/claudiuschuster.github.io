# Development documentation

This is the technical entry point for the `claudiuschuster.github.io`
repository. The root [README](../README.md) is intentionally kept as a concise
showcase; development, verification and publication details live here.

## About the site

The repository contains the dependency-free landing page at
[claudiuschuster.github.io](https://claudiuschuster.github.io/). It connects
Claudiu Schuster's personal site, the OSS Singularity observatory, and the
German and English curriculum vitae in one small constellation.

## Design and content model

- **Data Flow Atelier** is atmospheric, rounded and signal-led. It is the first-visit default.
- **Prismatic Workshop** is bright, geometric and unapologetically colourful.
- German and English share the same structure and behavior.
- The page remains useful without JavaScript and respects reduced-motion preferences.
- The large destination tiles are the complete content model: personal site, open-source observatory and two browser-view CV links.

## Local preview

Run the source server from the repository root:

```sh
python3 -m http.server 4190 --bind 127.0.0.1
```

Then open <http://127.0.0.1:4190/>.

## Verification

Run the lightweight checks that match the dependency-free repository:

```sh
git diff --check
test "$(identify -format '%wx%h' assets/social-preview.png)" = '1200x630'
test "$(identify -format '%wx%h ' favicon.ico | sed 's/ $//')" = '16x16 32x32 48x48 64x64'
curl --fail --silent --show-error http://127.0.0.1:4190/index.html >/dev/null
python3 -m json.tool site.webmanifest >/dev/null
curl --fail --silent --show-error http://127.0.0.1:4190/site.webmanifest | python3 -m json.tool >/dev/null
```

The page is served directly from the committed root files; there is no build
step or package installation. For visual changes, check both themes, both
languages, the responsive layout, reduced motion, and the destination links in
a real browser.

## Social preview and metadata

`assets/social-preview.png` is the 1200×630 social card for repository links and
the live landing page. It brings together the `claudiuschuster.de` and
`oss-singularity.io` anchors and selected OSS Singularity projects:
`proton-drive-linux`, `cinnamon-chatgpt-usage`, `cinnamon-system-monitor` and
`nemo-action-bar`.

`index.html` exposes the card through absolute Open Graph and Twitter image
metadata, including dimensions, MIME type, alt text and the
`summary_large_image` card type.

## Repository layout

- [`../index.html`](../index.html): complete one-page markup and social metadata
- [`../styles.css`](../styles.css): both themes, responsive layout and reduced-motion styles
- [`../script.js`](../script.js): theme/language controls and lightweight observatory motion
- [`../site.webmanifest`](../site.webmanifest): GitHub-Pages-compatible install metadata using the existing root icons
- [`../assets/social-preview.png`](../assets/social-preview.png): repository and link-preview artwork
- [`../favicon.ico`](../favicon.ico), [`../favicon.svg`](../favicon.svg) and [`../favicon.png`](../favicon.png): stable ICO fallback, modern SVG and PNG fallback for the prismatic open-signal icon
- [`../.github/FUNDING.yml`](../.github/FUNDING.yml): GitHub Sponsors receiver configuration
- [`../README.md`](../README.md): public showcase entry point
- [`../.github/`](../.github/): repository automation, when present

## Publication

GitHub Pages publishes the repository root from the `main` branch at
<https://claudiuschuster.github.io/>. The canonical URL and social metadata
point to that root user page. The personal site remains available at
<https://claudiuschuster.de/> and its separate project-page mirror at
<https://claudiuschuster.github.io/claudiuschuster.de/>.

The root `site.webmanifest` is a plain static asset in that same Pages source;
GitHub Pages serves it without `.htaccess` or a custom deployment step. The
manifest keeps relative `id`, `start_url` and `scope` values so the source also
remains valid when viewed from a repository subpath.

## Documentation map

This file is the current development entry point. Add future development or
operations notes under `docs/` and link them here so the root README remains a
focused showcase.
