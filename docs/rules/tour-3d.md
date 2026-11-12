# 3D tour (/3d)

- `public/3d/index.html` is built from `tour3d/` by `python3 tour3d/build.py`; never edit it by hand. Local CI runs `tour3d/build.py --check` and fails when the two disagree.
- The tour is a static page outside the app router: no React page, no build step on Vercel. Sources, photos and how to change them: `tour3d/README.md`.
- In the site menu it is a plain `<a>` (`plain: true` in `components/use-nav-items.ts`), never `next/link` — a prefetch would pull the whole 2 MB file.
- One address per language — `/3d`, `/en/3d`, `/pt/3d`, `/ru/3d` — by rewrites in `next.config.mjs`; the page reads its language from the path. All four are in `app/sitemap.ts` with hreflang.
- Every visible string is Spanish in the sources and translated in `tour3d/src/i18n.js`; an untranslated one lands in `window.__missing`.
- Rooms carry the names we use, the same spelling as `translations/rooms.ts`: Giardino (ground floor), Paraiso (1st floor, street side), Terrazzo (1st floor, balcony with plants), Penthouse (top floor). The street is on the north side of the model.
- Ids of the tour's menu are public addresses (`?n=p1-terrazzo`); a renamed id goes into `OLD` in `tour3d/src/app.js`.
- No builder's notes, dimensions or "approximate" remarks on the page; labels are small dots, blue dots open photos and the walk-through video (Ivan).
- Screenshots and checks need a browser with WebGL: `tour3d/check.mjs` (Chrome for Testing with `--use-angle=metal --enable-gpu --ignore-gpu-blocklist`). A headless browser without a GPU shows an empty page.
- The hub's Pages copy `ilbuco-3d` is `tour3d/build.py --light`; update it when the tour changes and set its title back afterwards (`pages_cli.py put` takes the title from the file).
- The model follows the built house: site photos, `public/3d/walk.mp4` and the construction album of 10.2024 (the working drawings the house was built from; kept outside this public repo in `~/.claude/artifacts/ilbuco-3d/workspace-archive/src/`). The 2022 project is not a source — the house was built smaller and stepped on the north side. Origin of the plan coordinates is the outer south-west corner of the concrete; floor levels are `FL` in `scene.js` (basement −3.0, ground 0, 1st 3.5, 2nd 6.5, roof 9.5).
- North facade is stepped: the garage gate is in the basement wall (Y 12.62), the hall with the slatted window hangs over it (to Y 15.51), the 1st floor reaches further (slabs to Y 18.0); the approach is an open apron and ramp between retaining walls, no lawn over it (Ivan).
- The "whole house" view looks from the east (entrance patio, balcony, terrace); from the south-west the pines cover it.
- Windows go through `wall()` only (rectangular frame inside the opening); check each one against the partitions and slabs of its floor. Chairs are placed by `roundTable` / `longTable`, never by hand next to a table.
- Static geometry of every floor is merged by `bake()` at the end of `scene.js`; anything that must move or be picked separately has to stay out of the floor groups.
- Picking an item in the tour's menu flies the camera to it and the item must be fully on screen: on a phone (width under 700) the menu folds after every pick, floors and suites included; on desktop it stays open and the view is centred in the part of the screen right of it (`go()` in `tour3d/src/app.js`; `tour3d/check.mjs` checks both).
