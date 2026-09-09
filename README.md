# claudiuschuster.github.io

The small constellation at [claudiuschuster.github.io](https://claudiuschuster.github.io/) — a dependency-free landing page connecting Claudiu Schuster's personal site, open-source observatory and bilingual curriculum vitae.

The page is intentionally static: HTML, CSS and vanilla JavaScript only. It has two visual worlds inspired by the companion sites:

- **Data Flow Atelier** — atmospheric, rounded and signal-led.
- **Prismatic Workshop** — bright, geometric and unapologetically colourful.

## Local preview

From the repository root:

```sh
python3 -m http.server 4190 --bind 127.0.0.1
```

Then open <http://127.0.0.1:4190/> in a browser.

## Structure

- `index.html` — the complete one-page experience and its four large destination tiles.
- `styles.css` — both themes, responsive layout and reduced-motion styles.
- `script.js` — theme/language controls, pointer response and lightweight observatory motion.

The personal-site tile links to the official site, with its [GitHub Pages mirror](https://claudiuschuster.github.io/claudiuschuster.de/) called out directly below the constellation. The CV tiles point at the current `main` tree in the [curriculum-vitae repository](https://github.com/ClaudiuSchuster/curriculum-vitae) and deliberately use browser-view URLs instead of download links, so they follow the latest CV version.

Built with love, care and a little magic for making complexity flow.
