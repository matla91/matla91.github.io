# Verification — 16 October 2026

> Historical V1 record. For current browser checks, measurements and remaining limits, see [the V2 audit](audit-v2/README.md).

## Completed

- TypeScript strict compilation with `tsc --noEmit`.
- 13 Vitest / Testing Library tests: meaningful server render, organization relationship disclosure, keyboard Escape/focus for navigation, highlight/archive expanders, scientific stage/pause controls, five project routes, incoming experience anchors, unknown routes and absence of false affiliations.
- Production client build and server prerender. Output includes 7 complete pages (home, five case studies, 404) and 9 legacy redirects; direct requests need no SPA fallback.
- Automated check of 154 local links/assets/anchors, unique IDs, image alternatives, `aria-controls` targets, one H1 on content pages, absence of template demo publications in `dist/`, and a 480 KB raw JavaScript budget.
- Client bundle approximately 407 KB raw / 128 KB compressed; CSS approximately 43 KB raw / 10 KB compressed. This is an artifact-size check, **not** a measured page-speed score.
- Project images converted from the existing SVG-embedded PNGs to responsive WebP (approximately 9–51 KB per image). Fonts are self-hosted (approximately 63 KB total WOFF2).
- 10 distinct public repository, project-demo and institutional URLs returned HTTP 200 in this session. The LinkedIn destination is reused from the public README; it was not authenticated or otherwise tested.
- Public CV regenerated from `src/content/cv.json`; one-page PDF rendered to PNG and visually inspected for clipping, overlap and legibility.
- `git diff --check`.

## Implemented but requiring rendered-browser review

- Responsive CSS for 320px phones, larger phones, tablet and desktop; touch controls, single-column mobile case studies and collapsed navigation.
- Visible focus styles, skip link, semantic headings, native details/summary, explicit button states, labeled organization relations and image alternatives.
- Reduced-motion CSS and Motion configuration, manual hero-animation pause, static meaningful HTML without JavaScript, lazy project images.
- SEO titles/descriptions, per-page canonicals, Open Graph cover, JSON-LD, sitemap and legacy URLs.

The managed environment does not provide the dedicated preview browser skill. In accordance with its workflow no substitute browser runner, browser installation or local preview server was used. **No Lighthouse score, real-browser accessibility certification, mobile screenshot, layout-overflow result or live keyboard end-to-end pass is claimed.** The reference was visually inspected and interacted with on desktop only; its mobile presentation was not visually verified.

## Review sequence before an owner-approved production switch

1. Open the owner-private preview at phone, tablet and desktop widths; inspect heading wraps, logo proportions, project media, 200% zoom and horizontal overflow.
2. Tab through navigation, controls and disclosures; check Escape, visible focus and organization-to-experience anchors. Test with reduced motion enabled.
3. Open each project URL directly, try an unknown URL and follow CV / email / GitHub / LinkedIn links.
4. Run Lighthouse or an equivalent tool in a real browser and inspect rendering/contrast. Bundle sizes alone do not establish performance or accessibility.
5. Review the newly generated public CV and degree-status wording. No existing downloadable CV was present in the original repository.
6. Only after review, select GitHub Actions as the Pages source and merge the PR. The redesign branch workflow cannot deploy `master` or change Pages settings.

The original Academic Pages files are preserved for history and source provenance. They are not part of the distribution; only `dist/` is published by the new workflow. No merge or production GitHub Pages deployment is performed as part of this mission.
