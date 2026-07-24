/**
 * particles-field — fundo ambiente de partículas conectadas (canvas 2D puro).
 * Porte do componente do duPolvo Vault (`components/backgrounds/particles-field`),
 * adaptado pra rodar dentro de uma seção de conteúdo (não fullscreen/fixed): o
 * canvas é dimensionado pelo elemento pai (`canvas.parentElement`), mesmo padrão
 * de `src/scripts/shader-background.ts`.
 *
 * MAX_PARTICLES existe porque, ao contrário do demo original (viewport fixo), a
 * altura desta seção cresce com o número de projetos no grid — sem o teto, o
 * custo O(n²) das linhas entre partículas (documentado no NOTES.md do vault)
 * escalaria sem limite conforme o portfólio cresce.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export interface ParticlesField {
  destroy: () => void;
}

const DENSITY = 12000;
const MAX_PARTICLES = 160;
const MAX_SPEED = 0.35;
const LINK_DIST = 130;
const MOUSE_LINK_DIST = 180;
const DOT_COLOR = "138, 138, 255"; // --color-brand-400
const LINE_COLOR = "138, 138, 255"; // --color-brand-400
const MOUSE_COLOR = "168, 174, 255"; // --color-brand-300

export function initParticlesField(canvas: HTMLCanvasElement): ParticlesField {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Contexto 2D indisponível");
  // Reatribuído a um nome novo pra o TS estreitar o tipo pra não-nulo dentro
  // das closures abaixo (narrowing de `const` não atravessa fronteira de
  // função aninhada, só o nome novo carrega o tipo correto).
  const ctx = context;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mouse = { x: -9999, y: -9999 };
  let particles: Particle[] = [];
  let width = 0;
  let height = 0;
  let frameId: number | null = null;

  function build() {
    const rect = canvas.parentElement?.getBoundingClientRect();
    width = rect?.width || window.innerWidth;
    height = rect?.height || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(Math.floor((width * height) / DENSITY), MAX_PARTICLES);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * MAX_SPEED,
      vy: (Math.random() - 0.5) * MAX_SPEED,
      r: Math.random() * 1.6 + 0.8,
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      if (!reduceMotion) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
      ctx.beginPath();
      ctx.fillStyle = `rgba(${DOT_COLOR}, 0.7)`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DIST) {
          ctx.strokeStyle = `rgba(${LINE_COLOR}, ${(1 - dist / LINK_DIST) * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      const dm = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
      if (dm < MOUSE_LINK_DIST) {
        ctx.strokeStyle = `rgba(${MOUSE_COLOR}, ${(1 - dm / MOUSE_LINK_DIST) * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    frameId = requestAnimationFrame(frame);
  }

  function handleMouseMove(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  function handleMouseLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
  }

  let resizeTimer: ReturnType<typeof setTimeout>;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  }

  build();
  frameId = requestAnimationFrame(frame);

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseleave", handleMouseLeave);
  window.addEventListener("resize", handleResize);

  const destroy = () => {
    if (frameId !== null) cancelAnimationFrame(frameId);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseleave", handleMouseLeave);
    window.removeEventListener("resize", handleResize);
    clearTimeout(resizeTimer);
  };

  return { destroy };
}
