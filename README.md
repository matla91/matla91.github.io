# Matthis Lahargoue — Research & Engineering Portfolio

A monochrome portfolio for machine learning, computer vision and computational imaging. Built with React, TypeScript, Vite and Tailwind CSS, with native CSS transitions. Inspired by the editorial structure and interactions of Martin Dallinger’s portfolio, with original implementation and Matthis’s existing GitHub identity.

## Run and verify

Node 24 recommended (minimum 22.12).

```sh
npm ci
npm run dev
npm run check
```

`npm run check` runs interaction tests, TypeScript, the production build, static prerendering and local link/asset/anchor checks. `npm run build` outputs `dist/`: the home page, five project pages, 404, legacy redirects, sitemap, Open Graph metadata, self-hosted fonts and the downloadable CV. No SPA fallback or server is required.

## Edit content

- `src/content/portfolio.ts`: projects, organizations, skills, archive and contact links.
- `src/App.tsx`: editorial sections and page layouts.
- `src/components/`: navigation, scientific hero, conceptual project diagrams.
- `src/styles.css`: responsive design, reduced-motion and print styles.
- `src/content/cv.json`: public CV content; regenerate with `python scripts/generate_cv.py` (ReportLab and DejaVu Sans required).
- `scripts/prerender.mjs`: page metadata, sitemap and old URL redirects. `SITE_URL` optionally overrides the canonical origin for a production domain change.

All meaningful text is prerendered for search engines and visitors without JavaScript. Interactive controls hydrate on the client. The SVG uses no WebGL, model download or experimental data. Animations respect `prefers-reduced-motion`; the hero also has an explicit pause button.

## Deployment and review

Work takes place on `feat/monochrome-research-portfolio`. The workflow `.github/workflows/portfolio.yml` tests and builds pull requests and the redesign branch; **only a push to `master` or a manual run on `master` can deploy**. The existing published site must not be replaced until this PR is reviewed and merged by the owner.

The current Academic Pages/Jekyll sources are preserved in Git for reference; Vite ignores them and only publishes `dist/`. They include old template examples and must not be manually copied into `dist/`. The GitHub profile repository and its README are unchanged.

When the owner elects to migrate after review: set Settings → Pages → Build and deployment → Source to **GitHub Actions**, merge the PR, and verify the `github-pages` deployment. No Pages settings are changed by this branch. A future `CNAME` belongs in `public/CNAME`; update `SITE_URL`, Open Graph URLs and sitemap accordingly.

The separate owner-private preview is a review copy. GitHub remains the authoritative development repository. See `docs/verification.md` for exactly what was and was not checked.

## Editorial and scientific scope

See [design audit](docs/design-audit.md), [asset provenance](docs/asset-sources.md) and [verification](docs/verification.md). ISL material is limited to the public broad research description and conceptual illustrations. No unpublished measurements, internal protocols, data or code are included. Project metrics sourced only from self-reported public accounts are identified as such on the detailed pages.

## Audit V2

Voir [l’audit visuel, les corrections et les limites de vérification](docs/audit-v2/README.md). Les captures et mesures reproductibles sont jointes à la PR V2 ; aucune publication de cette branche.
