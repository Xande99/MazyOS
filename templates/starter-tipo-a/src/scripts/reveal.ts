/**
 * Sistema .reveal — fade + slide-up ao entrar no viewport, via GSAP ScrollTrigger.
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
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Easing assinatura da duPolvo (--ease-out-expo em identidade/design-guide.md)
CustomEase.create("duEaseOut", "0.16, 1, 0.3, 1");

function initReveal() {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const items = gsap.utils.toArray<HTMLElement>(".reveal");

    items.forEach((el) => {
      const delay = Number(el.dataset.revealDelay ?? 0);

      gsap.fromTo(
        el,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.76,
          delay,
          ease: "duEaseOut",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
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
