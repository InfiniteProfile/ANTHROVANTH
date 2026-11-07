# ANTHROVANTH
Static, deterministic archive of fictional ancient hominin individuals. Serve the folder over HTTP (browsers block `fetch` from `file://`), for example `python3 -m http.server`, or deploy to GitHub Pages, Netlify or Cloudflare Pages.
- IDs are BigInt-safe decimal strings (any length); the same ID always generates the same individual (hash seeded).
- Dates use BP (1950 CE). Lifespan = Birth BP - Death BP; each profile is validated before display.
- Portraits are parametric anatomical illustrations (brow, jaw, prognathism, cranial height per species), not photographs. Add images in `images/` and swap `face()` in `script.js` if you have licensed reconstructions.
- Species ranges and measurements are approximate; edit `species.json`, `professions.json`, `chronology.json`.
