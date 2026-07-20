/**
 * Sistema .reveal — fade + slide-up ao entrar no viewport, via o preset
 * `reveal()` de `src/sections/motion.ts` (GSAP ScrollTrigger, lendo
 * --duration-slow/--ease-out-expo do theme.css do projeto).
 *
 * Uso: adicionar a classe `reveal` em qualquer elemento de seção.
 * Delay manual opcional: `data-reveal-delay="0.15"` (segundos).
 *
 * Tudo envolto em gsap.matchMedia() — a timeline de animação só roda
 * se o usuário não pediu `prefers-reduced-motion: reduce`. Nesse caso,
 * os elementos só recebem opacity/transform finais sem transição
 * (o CSS em global.css já cobre o estado visual, isso garante que o
 * JS não tente animar por cima).
 *
 * Reexecuta automaticamente após navegação com View Transitions
 * (evento `astro:page-load`), porque o DOM é trocado sem reload.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { reveal } from "../sections/motion";

gsap.registerPlugin(ScrollTrigger);

function initReveal() {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const items = gsap.utils.toArray<HTMLElement>(".reveal");

    items.forEach((el) => {
      const delay = Number(el.dataset.revealDelay ?? 0);
      reveal(el, { delay });
    });

    // cleanup ao trocar de página via View Transitions
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(".reveal", { opacity: 1, y: 0 });
  });
}

initReveal();

// Astro View Transitions troca o <body> sem recarregar a página —
// precisamos reinicializar o ScrollTrigger a cada navegação.
document.addEventListener("astro:page-load", initReveal);
document.addEventListener("astro:after-swap", () => {
  ScrollTrigger.refresh();
});
