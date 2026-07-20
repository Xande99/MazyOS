/**
 * motion.ts — presets GSAP nomeados da duPolvo.
 *
 * Lê os tokens de motion do contrato (_memoria/tokens-contract.md:
 * --duration-*, --ease-*) via getComputedStyle no elemento raiz, em vez
 * de valores fixos no JS — assim o preset se adapta sozinho ao
 * theme.css de cada projeto sem precisar recompilar nada. Se o token
 * não existir (tema muito antigo, ou execução em SSR sem DOM), cada
 * preset cai no valor default do contrato.
 *
 * Consumido por `src/scripts/reveal.ts` (sistema `.reveal` existente) e
 * disponível pra qualquer seção nova que precise de stagger/parallax
 * além do reveal simples.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function durationSeconds(name: string, fallbackMs: number): number {
  const raw = cssVar(name, `${fallbackMs}ms`);
  const match = raw.match(/([\d.]+)\s*(ms|s)?/);
  if (!match) return fallbackMs / 1000;
  const value = parseFloat(match[1]);
  const unit = match[2] ?? "ms";
  return (unit === "s" ? value * 1000 : value) / 1000;
}

const tokens = {
  get durationSlow() {
    return durationSeconds("--duration-slow", 600);
  },
  get durationBase() {
    return durationSeconds("--duration-base", 300);
  },
  get easeOutExpo() {
    return cssVar("--ease-out-expo", "cubic-bezier(0.16, 1, 0.3, 1)");
  },
  get easeInOutSoft() {
    return cssVar("--ease-in-out-soft", "cubic-bezier(0.45, 0, 0.55, 1)");
  },
};

/** Entrada de seção ao scroll — fade + slide-up, disparado quando o topo do elemento cruza 85% do viewport. */
export function reveal(el: Element, opts: { delay?: number; distance?: number } = {}) {
  return gsap.fromTo(
    el,
    { opacity: 0, y: opts.distance ?? 26 },
    {
      opacity: 1,
      y: 0,
      duration: tokens.durationSlow,
      delay: opts.delay ?? 0,
      ease: tokens.easeOutExpo,
      scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
    },
  );
}

/** Entrada escalonada de itens de grid (cards de oferta, planos, FAQ). */
export function stagger(
  els: Element[] | NodeListOf<Element>,
  opts: { each?: number; distance?: number } = {},
) {
  const targets = Array.from(els);
  if (targets.length === 0) return;

  return gsap.fromTo(
    targets,
    { opacity: 0, y: opts.distance ?? 26 },
    {
      opacity: 1,
      y: 0,
      duration: tokens.durationSlow,
      ease: tokens.easeOutExpo,
      stagger: opts.each ?? 0.1,
      scrollTrigger: { trigger: targets[0], start: "top 85%", toggleActions: "play none none none" },
    },
  );
}

/** Profundidade leve em hero/imagens — desloca o elemento conforme o scroll passa por ele. */
export function parallax(el: Element, opts: { distance?: number } = {}) {
  return gsap.fromTo(
    el,
    { y: 0 },
    {
      y: -(opts.distance ?? 60),
      ease: tokens.easeInOutSoft,
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    },
  );
}
