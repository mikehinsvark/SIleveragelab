# SI Leverage Lab website

Static AI resource hub for **https://sileveragelab.com/**. This repository contains the complete editable website and its local media, fonts, logos, and video.

## Hosting

GitHub Pages publishes the **`main` branch, repository root (`/`)**. The `CNAME` file assigns `sileveragelab.com`; keep it in the root when editing or redeploying. `.nojekyll` tells Pages to serve these files directly without a Jekyll build.

The Namecheap DNS configuration uses these apex A records:

| Host | Type | Value |
| --- | --- | --- |
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `@` | A | `185.199.110.153` |
| `@` | A | `185.199.111.153` |
| `www` | CNAME | `mikehinsvark.github.io` |

With the custom domain attached and its HTTPS certificate issued, GitHub Pages can enforce HTTPS and redirect `www` to the apex domain. Manage deployment and certificate settings under **Settings → Pages**.

## Files

| File / directory | Purpose |
| --- | --- |
| `index.html` | Page content, resource cards, carousel, logos, footer links, and video dialog |
| `styles.css` | Responsive layout, compact notebook hero, branding, hover effects, and controls |
| `app.js` | Carousel selection, playback controls, swipe, and video integration |
| `scroll.js` | Up/down page navigator, progress stops, and keyboard behavior |
| `video.js` | Accessible, user-initiated video player |
| `assets/` | All referenced images, logos, video, poster, and locally hosted font files |
| `asset-manifest.json` | Local asset sizes and SHA-256 integrity hashes |
| `robots.txt`, `sitemap.xml` | Search-engine discovery for the custom domain |

## Edit and preview

No Node dependencies, account secrets, database, or build step are needed. Edit the HTML, CSS, and JavaScript directly, commit, and push to `main`. GitHub Pages redeploys from that branch.

For a local preview:

```bash
python3 -m http.server 3000
```

Open `http://localhost:3000/`. Keep relative asset URLs intact so the site can be served from the custom domain or a local server.

## Asset portability

All website imagery and video are stored in this repository; the page does not depend on Manus storage. Fonts are bundled locally with their SIL Open Font License files under `assets/font-licenses/`. Intentional external links still lead to the referenced AI tools and business resources.

The original Manus project is preserved separately. This existing GitHub repository is not registered as that project's managed canonical repository; future changes made here do not automatically synchronize back to the Manus project, and vice versa.

The exported visual design and content are based on source version `ca9e5d7`, including the compact notebook hero, up/down navigation, intro video, AI/SI footer logos, and all requested footer links.
