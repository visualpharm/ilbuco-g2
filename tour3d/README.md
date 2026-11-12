# 3D tour of the house

The page at `/3d` (and `/en/3d`, `/pt/3d`, `/ru/3d`) is one self-contained file, `public/3d/index.html`, built from this folder. Never edit that file by hand: change the sources here and rebuild.

```sh
python3 tour3d/build.py            # writes public/3d/index.html
python3 tour3d/build.py --check    # fails when public/3d/index.html is not what the sources build (runs in local CI)
python3 tour3d/build.py --light    # writes tour3d/dist/ilbuco-3d-light.html: under 2 MiB, no video
```

The build needs only Python 3. Commit `public/3d/index.html` together with the sources; Vercel serves the committed file and builds nothing here.

## What is where

| Path | What it holds |
|---|---|
| `src/head.html` | Page head, styles, the menu's markup |
| `src/scene.js` | The house: walls, floors, furniture, trees. Plan coordinates in metres, X to the east, Y to the north (the street side) |
| `src/i18n.js` | Language of the page and the dictionary: Spanish text → English, Portuguese, Russian |
| `src/app.js` | Labels, shooting points, photos and video panel, the tour's menu, camera moves |
| `photos/NN-key.jpg` | Photos shown at shooting points; `key` is what `ph('key', …)` in `src/app.js` refers to |
| `photos-light/` | The same photos, compressed harder, for the light copy |
| `vendor/` | three.js r147 and its OrbitControls, as shipped |
| `check.mjs` | Browser check of the menu item and the tour on phone and desktop, every language |
| `public/3d/walk.mp4` | The walk-through video; a shooting point opens it at its own second |

## Changing things

- **Text**: every visible string is written in Spanish in `src/app.js` or `src/head.html` and translated in the `TR` dictionary of `src/i18n.js` (order: en, pt, ru). A string without a translation shows in Spanish and lands in `window.__missing`; `check.mjs` fails on it. Room names — Giardino, Paraiso, Terrazzo, Penthouse — are not translated.
- **Photo**: replace or add `photos/NN-key.jpg` (and its lighter twin in `photos-light/`), reference the key with `ph('key', 'descripción.')` in `src/app.js`, add the description to `TR`.
- **Shooting point**: `addCam(name, floor, second of walk.mp4, [x, y], [look-at x, y], [photos])` in `src/app.js`.
- **Room in the tour's menu**: the `NAV` tree in `src/app.js`. Ids are part of public addresses (`/3d?n=p1-terrazzo`); when one changes, add the old id to `OLD` so old links keep opening.
- **Language**: read from the path (`/ru/3d`) or `?lang=ru`. A new language needs a rewrite in `next.config.mjs`, an entry in `app/sitemap.ts`, an hreflang line in `src/head.html` and a column in `TR`.

## Checking

```sh
BASE=https://ilbuco.com.ar OUT=/tmp/tour node tour3d/check.mjs
```

It clicks the site's menu item, picks a room, turns the model, opens a shooting point and waits for the video, in four languages on phone and desktop. It needs `playwright-core` and a Chrome that has WebGL (see the header of the file); a headless browser without a GPU draws an empty page, which is not a bug of the tour.

## Not in the repository

- The drawings the model is measured from — the construction album of 10.2024 (`buco-album-2024-10.pdf`: plans of four levels, facades, sections) — and the earlier 2022 project («Bucho var 5.pdf», DWG, structural sheets; not a source any more) — private documents.
- Full-size originals of the photos and the earlier versions of the model.

A copy of both is kept on the hub machine in `~/.claude/artifacts/ilbuco-3d/workspace-archive/`. Neither is needed to rebuild the tour.

## The light copy

`--light` builds a variant for hosts that limit page size and block media files: lighter photos, no video, whole-line comments removed. The hub's Pages copy `ilbuco-3d` is this file.
