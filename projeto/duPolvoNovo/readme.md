# duPolvo — Design System

Brand & UI system for **duPolvo**, a creative agency from Guaratinguetá-SP, Brazil. The agency unites four disciplines under one roof — **Programação (dev), Design, Vídeo/Edição and Tráfego Pago (paid media)** — sold as a single, joined-up strategy. The central metaphor: an octopus ("polvo") whose many arms all pull in the same direction. *"Sua marca tem muitos braços. A gente cuida de todos."*

This project is a self-contained design system. The flagship deliverable is a complete, animated marketing landing page (`duPolvo Landing.html`).

## Sources provided
- `uploads/duPolvo1.png` — long full-page reference: section structure, copy tone, dark result cards.
- `uploads/duPolvo2.jpg` — primary visual reference: pink octopus mascot, large expressive type, decorative tentacles bleeding off section edges.
- `uploads/Agencia.jpg` — energy reference: massive hero type, bold accent color, animated ticker/marquee.
- `uploads/animations.mp4` — motion reference (scroll reveals, entrances, fluid transitions, card/button micro-interactions). *Not directly decodable as frames here — animation direction was implemented from the written brief + the easing/timing spec.*
- Bricolage Grotesque font files (24pt + 36pt optical sizes) → `assets/fonts/`.

There is no codebase or Figma file — this is a from-brief brand build. The octopus mascot (`assets/octopus.png`) was extracted and cleaned from `duPolvo2.jpg` (pink keyed off the navy blob), since no standalone mascot file was supplied.

---

## CONTENT FUNDAMENTALS — how duPolvo writes

- **Language:** Brazilian Portuguese. Informal, second person — speaks to **"você"**, and refers to itself as **"a gente"** (not the stiff "nós").
- **Tone:** creative, bold and direct, *without being arrogant*. Confident but warm; it pokes fun at agency clichés rather than at the client.
- **Casing:** sentence case everywhere except eyebrow labels, which are UPPERCASE with wide tracking (e.g. `NOSSOS SERVIÇOS`). Headlines are sentence case with a period — the period is part of the punchy rhythm ("A gente cuida de todos.").
- **The octopus runs through the copy.** Recurring metaphors: *braços / tentáculos* (arms), *mergulho* (diving in), *mar* (the sea), *grudado* (stuck-on / committed). Section names lean on it: "Mergulho", "Oito braços, muito resultado", "Bora dar oito braços pro seu marketing?".
- **Anti-jargon, anti-fluff.** Promises are concrete and a little cheeky: "sem letrinha miúda" (no fine print), "sem print mágico" (no fake screenshots), "sem robô do outro lado" (no bot on the other end).
- **Headlines:** short, two-beat, often with one word highlighted (pink text or an aqua/lime underline). e.g. "Sua marca não precisa só de posts bonitos. Precisa de **direção**."
- **Emoji:** none. Personality comes from the mascot, color and type — never from emoji.
- **CTAs:** action-first and human — "Solicitar orçamento", "Falar no WhatsApp", "Ver trabalhos", "Mandar e-mail".

---

## VISUAL FOUNDATIONS

- **Color.** Two backgrounds only: warm off-white **Cream `#F7F4F1`** for light sections and deep navy **Ink `#020E20`** for hero / stats / CTA / footer. **Pink `#FD4B90`** is the single action color (CTAs, active links, highlights). **Blue `#123047`** is heading text on light. **Lime `#DFFF5A`** and **Aqua `#81DFC0`** are accents — lime for the ticker band and WhatsApp button, aqua for icons, step rings and underlines. Accents appear mostly on dark.
- **Type.** Bricolage Grotesque throughout. Display/headlines use the **36pt optical ExtraBold (800)** with tight negative tracking (`-0.03em`) and ~0.98 line-height — big and expressive. Body is **24pt Regular (400)** at 17px / 1.6. Eyebrows: 13px, 700, `0.18em`, uppercase, with a short leading rule.
- **Backgrounds.** Flat color blocks — no photographic backgrounds. Dark sections carry soft radial **glows** (pink + aqua) for depth and a subtle morphing blob behind the mascot. The hero ticker is a lime band rotated ~-1.4°. No gradients on light sections; cards on dark may get a faint pink fill that slides up on hover.
- **Mascot & tentacles.** The pink octopus is the recurring hero element (hero + final CTA), gently floating (±16px, 6s ease-in-out). Reference designs let tentacles bleed off section edges as decoration.
- **Animation.** This is a priority of the brand. Signature easing **`cubic-bezier(0.16, 1, 0.3, 1)`**, durations **250–400ms** (reveals up to ~760ms). Patterns: scroll reveals with opacity+translateY and **stagger** between siblings; hero headline reveals word-by-word; floating mascot; stat counters that count up on entering the viewport; infinite marquee ticker; FAQ accordion (animated max-height); buttons that fill from the bottom on hover. All gated behind `prefers-reduced-motion`.
- **Hover states.** Cards lift (`translateY(-6 to -10px)`) and deepen their shadow; icon tiles rotate slightly and scale (playful `cubic-bezier(0.34,1.56,0.64,1)` back-ease); links grow a pink underline; buttons rise 2px, gain a colored shadow and fill from the bottom.
- **Press states.** Buttons settle back down and scale to ~0.98 — a small, tactile squish.
- **Borders & hairlines.** 1px `#E5DFD8` on cream; `rgba(255,255,255,.10)` on ink. Step rings and badge outlines use aqua.
- **Shadows.** Soft and cool-tinted: cards `0 8px 24px rgba(18,48,71,.06)` resting → larger on hover. Pink elements get a colored glow `0 12px 30px rgba(253,75,144,.38)`.
- **Radii.** Friendly and rounded: cards 20–28px, buttons fully pill (`999px`), icon tiles 11–15px, small chips pill.
- **Cards.** Light cards = white, hairline border, soft shadow, generous padding, lift on hover. Service cards = Ink `#020E20` background, colored icon tile, white title, muted body, subservice tags, pink fill sliding up on hover. Blog cards = gradient cover (pink / navy / aqua) with a Lucide glyph, a lime category badge, white body.
- **Transparency & blur.** The fixed header is transparent over the hero, then switches to `rgba(247,244,241,.78)` + `backdrop-filter: blur(14px)` once scrolled. Floating mascot chips are near-opaque white with a strong drop shadow.
- **Layout.** 1200px container, fluid gutters, generous vertical rhythm (`clamp(72px,9vw,140px)`). Breakpoints at 1024px (tablet, mostly 2-col) and 760px (mobile, single column, nav collapses to a menu button).

---

## ICONOGRAPHY

- **System:** [Lucide](https://lucide.dev) icons, loaded from CDN (`unpkg.com/lucide`). Chosen as the closest match to the reference designs' thin, rounded, single-weight line icons. **This is a substitution** — duPolvo has no proprietary icon set on file. If the agency adopts a custom set, swap the CDN link and the `data-lucide` names.
- **Usage:** ~1.5px stroke, line style (not filled), sat inside rounded colored tiles (pink / aqua / lime / blue washes). Star icons in the hero rating are filled with lime. Icon tiles animate (rotate + scale) on card hover.
- **Emoji:** never used.
- **Unicode:** the arrow `↗` / `→` accompanies CTAs and "ver mais" links (rendered as Lucide `arrow-up-right` / `arrow-right`).
- **Mascot art:** `assets/octopus.png` — a raster illustration, used as imagery, not as an icon.

---

## INDEX — what's in this project

**Foundations**
- `styles.css` — global entry (imports only). Consumers link this one file.
- `tokens/colors.css` · `typography.css` · `spacing.css` · `motion.css` · `fonts.css` — CSS custom properties + `@font-face`.
- `assets/fonts/` — Bricolage Grotesque TTFs. `assets/octopus.png` — mascot.

**Specimen cards** (Design System tab) — in `guidelines/`:
- Colors: `colors-brand.html`, `colors-roles.html`
- Type: `type-display.html`, `type-body.html`
- Brand: `brand-logo.html`, `brand-buttons.html`
- Spacing: `spacing-radius.html`

**Deliverable**
- `duPolvo/index.html` (+ `duPolvo/css/style.css`, `duPolvo/js/main.js`) — full animated landing page (Header, Hero+ticker, Problema, Solução, Serviços, Processo, Blog, Diferenciais/stats, FAQ, CTA final, Footer). Tokens consumed from `../tokens/*.css` at the top of `style.css`; references local fonts + mascot.

**Reusable library** (extracted 2026-07-09, from the front-end evolution plan)
- `sections/` — the sections above, genericized (client-agnostic copy, no duPolvo-specific classes) for reuse in any new LP. See `sections/README.md`.
- `motion-kit/` — the animation system (reveal/stagger/counter/word-split) as a standalone vanilla-JS module, plus GSAP/Motion equivalent recipes for Astro/Next.js projects. See `motion-kit/README.md`.

**Skill**
- `SKILL.md` — Agent-Skill manifest for reuse in Claude Code.

---

### Caveats
- The octopus mascot is upscaled from a small region of `duPolvo2.jpg`, so it's slightly soft. A clean, high-res / transparent PNG would sharpen the hero and CTA.
- Lucide is a stand-in for the brand's (absent) icon set.
- Animation timing was built from the written brief; `animations.mp4` could not be sampled frame-by-frame here.
