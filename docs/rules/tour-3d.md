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
- The model follows the built house — site photos and `public/3d/walk.mp4` — over the architect's plan; the north end (hall up to the facade, garage gate under it, open ramp) was built differently from the plan.
- Windows go through `wall()` only (rectangular frame inside the opening); check each one against the partitions and slabs of its floor. Chairs are placed by `roundTable` / `longTable`, never by hand next to a table.
- Static geometry of every floor is merged by `bake()` at the end of `scene.js`; anything that must move or be picked separately has to stay out of the floor groups.
