# deploy/

`gh-pages-404.html` is the SPA route-restore shim that **GitHub Pages** needs (it has
no `_redirects` support). It is deliberately kept out of `public/` so that a plain
`vite build` never emits `dist/404.html`.

Why: Cloudflare Pages gives a `404.html` in the output precedence over the
`/* /index.html 200` rule in `_redirects`. Three separate deploys shipped it by
running `wrangler pages deploy dist` directly, and each time every deep link on
slic.nonarkara.org (`/rankings`, `/city/*`, …) answered HTTP 404. A convention
("run `npm run deploy`, not wrangler") did not hold, so `dist/` is now safe by
default and only `npm run deploy:gh` copies the shim in.
