---
name: dupolvo-design
description: Use this skill to generate well-branded interfaces and assets for duPolvo, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and the landing-page UI for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key starting points:
- `styles.css` + `tokens/` — link `styles.css` to inherit all color, type, spacing and motion tokens, plus the Bricolage Grotesque `@font-face` rules.
- `duPolvo Landing.html` — the reference for layout, components (buttons, cards, ticker, FAQ, stats) and the signature animation patterns.
- `assets/octopus.png` — the mascot; `assets/fonts/` — the webfonts.
- Voice: Brazilian Portuguese, informal ("você" / "a gente"), bold and direct without arrogance, octopus metaphors (braços, mergulho, mar), no emoji.
- Motion: easing `cubic-bezier(0.16, 1, 0.3, 1)`, 250–400ms, always respect `prefers-reduced-motion`.
