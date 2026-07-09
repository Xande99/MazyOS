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
- `duPolvo/index.html` (+ `duPolvo/css/style.css`, `duPolvo/js/main.js`) — the reference for layout, components (buttons, cards, ticker, FAQ, stats) and the signature animation patterns.
- `sections/` — the same components above, extracted as generic, client-agnostic HTML partials ready to drop into a new landing page. Start a new LP from these instead of writing sections from scratch. See `sections/README.md`.
- `motion-kit/` — the reveal/stagger/counter/word-split animation system extracted into a reusable vanilla-JS module (`motion-kit.js` + `motion-kit.css`), plus GSAP (Astro/Tipo A) and Motion (Next.js/Tipo B) equivalent recipes in `motion-kit/README.md`. Use this instead of writing new scroll-reveal logic per project.
- `assets/octopus.png` — the mascot; `assets/fonts/` — the webfonts.
- Voice: Brazilian Portuguese, informal ("você" / "a gente"), bold and direct without arrogance, octopus metaphors (braços, mergulho, mar), no emoji.
- Motion: easing `cubic-bezier(0.16, 1, 0.3, 1)`, 250–400ms, always respect `prefers-reduced-motion`.
- Accessible color note: `#FD4B90` (brand pink) fails WCAG AA as text-on-light or white-on-pink-fill — use `--du-pink-ink` (`#C81F66`) in those two cases (see `tokens/colors.css`).
