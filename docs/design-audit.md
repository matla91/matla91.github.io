# Design and content audit — 16 October 2026

> Historical V1 record. For current browser checks, measurements and remaining limits, see [the V2 audit](audit-v2/README.md).

Reference: https://martin-dallinger.me/ (live desktop inspection, including the organization expander and navigation).
Profile: https://github.com/matla91/matla91 (`main`).
Existing site: https://github.com/matla91/matla91.github.io (`master`, base `5cc95ec58916965ac0d0b244016405feb652d1bb`).

| Observed reference pattern                                                      | Decision in this portfolio                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Large name on a dark hero, scientific background, profile panel, scroll CTA     | Retain the two-column hierarchy; replace the loss landscape and photo montage with an original procedural signal/point-cloud illustration and Matthis’s public GitHub avatar.                                                                             |
| Three connected research themes                                                 | Adapt to ML/vision, computational imaging/inverse problems, scientific computing/reproducibility.                                                                                                                                                         |
| Distinct, prominent organization logo strip and “Show all”                      | Use official ISL, MAGYAR, ENSISA and UQAC logos in two explicitly labeled relationship groups. Four logos remain visible; a click/tap/keyboard action exposes the actual relationship and a section link. An additional expander would add no value here. |
| Research practice followed by expandable experience                             | Retain the experimental loop and native keyboard-operable experience disclosures.                                                                                                                                                                         |
| Large project presentations, detailed evidence, topical tags, source/demo links | Five editorial project features, each with a statically rendered case-study URL, approach, outcomes, provenance and limitations.                                                                                                                          |
| Long achievements lists and secondary project gate                              | Adapt to documented highlights with an accessible expander, then a compact public project archive. No invented awards.                                                                                                                                    |
| Education timeline and extensive course lists                                   | Move education near the organizations and keep a concise double-degree timeline. Avoid unsupported start dates and unverified marks.                                                                                                                      |
| Violet accents, colored gradients, cursor glow, many subject-specific sections  | Omit. Use the requested monochrome palette, technical grid, scientific SVG, deliberate light/dark rhythm and reduced-motion support.                                                                                                                      |

The reference’s current rendered desktop order is hero → about → organizations → research practice/experience → achievements/competitions → featured work/archive → education → cybersecurity/hobbies/languages/books → contact. Its public document also contains a skills section. This portfolio preserves the requested editorial vocabulary while placing education earlier and giving Matthis’s five verified project accounts dedicated pages. No reference code, wording, photos, logos or original illustration assets were copied.

## Public content decisions

- ISL: use the public profile’s broad research description only. No PF32 dimensions, experimental scores, internal milestones, protocols, checkpoints or unpublished images/code.
- MAGYAR: relationship and June 2025 date are documented in the existing public portfolio. The approximately 1,000-image dataset and 78% macro F1 are self-reported; the detailed page says explicitly that the proprietary test data and split are not independently inspectable. The home page uses dataset scale, not an unqualified performance promise.
- CNN study: use its actual public README and distinguish the reported experiment from proof about the original paper. Data leakage is a hypothesis; temporal labeling boundaries need scrutiny. Omit unverifiable traffic claims such as “65,000 views”.
- Basel Tram Air: follow the current public README, including historical December 2019–March 2020 coverage, 262 cells and the absence of a live/health claim.
- Sentiment project: use the public project account, distinguish dataset scale from independent test size and label reported metrics as self-reported.
- No verified publication or award source was found for this pass; none is claimed. Forks of scientific libraries are not presented as authored projects.
- Degree dates: UQAC study period 2025–2026; degrees explicitly pending; ENSISA diploma expected May 2027 per the supplied current project context. No unsupported ENSISA start date is added.
- Existing public email and LinkedIn are reused. The old “seeking a July 2026 internship” wording and Canadian location are not carried forward.

## Verification boundary

Desktop visual interaction with the reference was inspected. The available browser surface does not expose viewport resizing, so its mobile rendering was not visually audited. The dedicated managed preview browser skill is unavailable in this session: no local preview server or substitute browser runner was started. The implementation provides explicit 320–680px, tablet and desktop styles; mobile visual review, keyboard review in a real browser and Lighthouse measurements remain unverified. DOM interaction tests and generated-file checks are recorded separately; they do not prove rendered layout or contrast compliance.
