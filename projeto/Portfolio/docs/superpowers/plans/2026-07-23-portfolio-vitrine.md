# Portfolio — Vitrine de Projetos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir a página única do portfólio (Hero, Projetos, Skills, Contato) em `projeto/Portfolio/`, com identidade visual própria já aplicada em `theme.css`, content collection de projetos começando com Vinicius Brito, e vídeo de fundo no Hero.

**Architecture:** Astro (Tipo A, já scaffoldado). Uma página (`src/pages/index.astro`) compõe 4 seções independentes (`src/sections/`). Projetos vêm de uma Content Collection (`src/content/projetos/`, Content Layer API do Astro 7 — `glob()` loader + schema Zod com `image()`); Skills vêm de um array estático (`src/data/skills.ts`).

**Tech Stack:** Astro 7.1.3, Tailwind v4 (CSS-first, tokens em `theme.css`), TypeScript strict, GSAP (reveal já herdado do starter). Fira Sans (`@fontsource/fira-sans@5.3.0`, pesos 400/500/700) já instalada.

**Sem framework de testes automatizados** — projeto é conteúdo estático sem lógica de negócio; a verificação de cada task é `npm run check` (typecheck + sync da content collection) + `npm run build` + inspeção visual real via Playwright MCP (dev server), consistente com o pipeline de QA do `MazyOS/CLAUDE.md` (Lighthouse + `mcp-accessibility-scanner` na Task 6).

## Global Constraints

- Stack: Astro + Tailwind v4 + TypeScript strict (já configurado, não alterar).
- Componentes só referenciam tokens SEMÂNTICOS do `_memoria/tokens-contract.md` (`--color-brand`, `--color-surface`, `--color-text-inverse`...) — nunca primitivos (`--color-brand-500` etc.) nem hex/px soltos. **Exceção documentada** (já registrada em `MazyOS/projetos/Portfolio/CLAUDE.md`): pills/badges (skills e tags de projeto) usam `bg-brand-50`/`text-brand` — não existe semântico dedicado a "fundo de badge" no contrato.
- Motion: só anima `transform`/`opacity`; tudo que usa GSAP passa por `gsap.matchMedia()` respeitando `prefers-reduced-motion` (sistema `.reveal` já existe, não recriar).
- Tipografia: só Fira Sans (`--font-display` e `--font-body` já apontam pra ela em `theme.css`) — nunca outra família em componente.
- **O vídeo de fundo do Hero é decisão fechada** (Cloudinary, `https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4`) — não trocar por imagem estática. Em `prefers-reduced-motion: reduce`, o vídeo some via CSS e um gradiente estático (mesmos tokens de cor) aparece no lugar; um botão pausar/tocar sempre visível fora do modo reduced-motion (WCAG 2.2.2 — autoplay >5s exige controle de pausa).
- Grid de projetos: content collection, filtra só `status: "entregue"`. Cresce por novo arquivo `.md`, sem tocar em código.
- Skills a ativar durante a implementação visual (Task 6, polimento): `storybrand-messaging`, `copywriting`, `frontend-design`, `web-typography`, `refactoring-ui`/`ux-heuristics`, `microinteractions`. **Não usar** `hooked-ux` nem `cro-methodology` (removidas do escopo pelo usuário).
- **Commits: nunca automáticos.** Cada task termina com build/QA verificado (`npm run check`/`npm run build`/screenshot), não com `git commit` — só commitar quando o usuário pedir explicitamente (política da sessão).
- Não criar páginas de case study nem CMS/admin — fora de escopo (ver spec).

Spec completa: `docs/superpowers/specs/2026-07-23-portfolio-vitrine-design.md`.

---

### Task 1: Content Collection de projetos + entrada Vinicius Brito

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/projetos/vinicius-brito.md`
- Já existe: `src/content/projetos/vinicius-brito.png` (screenshot capturado via Playwright na fase de planejamento, 1440×900, mostra o hero da LP real)

**Interfaces:**
- Produces: collection `"projetos"` — schema `{ titulo: string; descricao: string; url?: string; screenshot: ImageFunction; tags: string[]; status: "entregue" | "em-desenvolvimento" }`. Tasks 3 consome via `getCollection("projetos", filter)`.

- [ ] **Step 1: Criar o schema da collection**

Criar `src/content.config.ts`:

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projetos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projetos" }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      descricao: z.string(),
      url: z.string().url().optional(),
      screenshot: image(),
      tags: z.array(z.string()),
      status: z.enum(["entregue", "em-desenvolvimento"]),
    }),
});

export const collections = { projetos };
```

- [ ] **Step 2: Criar a entrada do Vinicius Brito**

Criar `src/content/projetos/vinicius-brito.md`:

```md
---
titulo: "Vinicius Brito — Consultoria Online Fitness"
descricao: "Landing page para consultoria online de um personal trainer, com hero de impacto, prova social e CTA direto pro WhatsApp."
screenshot: "./vinicius-brito.png"
tags: ["Landing Page", "Fitness"]
status: "entregue"
---
```

(Sem corpo — a descrição do card vem do frontmatter, não é renderizada como markdown.)

- [ ] **Step 3: Verificar que a collection carrega e o schema valida**

Rodar:
```bash
npm run check
```
Esperado: `0 errors`, `0 warnings` (o `astro check` roda `astro sync` internamente, que executa o `glob()` loader e valida o frontmatter contra o schema — se o `status` ou a URL da imagem estiverem errados, falha aqui).

Se der erro do tipo "Did not match union" no campo `status`, confira o valor exato no frontmatter (`entregue`, sem acento, minúsculo).

---

### Task 2: Hero (vídeo de fundo + headline)

**Files:**
- Create: `src/sections/Hero.astro`

**Interfaces:**
- Produces: componente `Hero.astro` (sem props) — usado por `src/pages/index.astro` (Task 6).

- [ ] **Step 1: Criar o componente**

Criar `src/sections/Hero.astro`:

```astro
---
/**
 * Hero — abertura do portfólio. Vídeo de fundo full-screen é decisão
 * fechada do usuário (ver docs/superpowers/specs/2026-07-23-portfolio-
 * vitrine-design.md) — não trocar por imagem estática mesmo que pese
 * no Lighthouse; ajustar peso/condicional se a medição em Task 6 pedir.
 *
 * Em prefers-reduced-motion, o <video> não é exibido — cai num
 * gradiente estático com os mesmos tokens de cor (--color-brand +
 * --color-surface-inverse via color-mix), sem precisar extrair um
 * frame/poster do vídeo externo.
 */
const VIDEO_SRC =
  "https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4";
---

<section id="hero" class="relative flex min-h-screen items-center overflow-hidden bg-surface-inverse">
  <video
    class="hero-video absolute inset-0 z-0 h-full w-full object-cover"
    autoplay
    loop
    muted
    playsinline
    aria-hidden="true"
  >
    <source src={VIDEO_SRC} type="video/mp4" />
  </video>

  <div class="hero-fallback absolute inset-0 z-0" aria-hidden="true"></div>

  <div class="hero-overlay absolute inset-0 z-10" aria-hidden="true"></div>

  <div class="container-du relative z-20">
    <p class="reveal mb-4 font-body text-xs font-bold uppercase tracking-[0.18em] text-brand">
      Portfólio
    </p>
    <h1 class="reveal font-display text-5xl leading-[0.96] font-bold text-text-inverse md:text-6xl">
      Sites fora do óbvio,<br /> prontos pra converter.
    </h1>
    <p class="reveal mt-6 max-w-prose text-lg text-text-inverse/80" data-reveal-delay="0.1">
      Eu sou o Xande. Projeto e desenvolvo sites e landing pages — dá uma olhada no que já fiz.
    </p>
    <div class="reveal mt-8" data-reveal-delay="0.2">
      <a
        href="#projetos"
        class="inline-flex rounded-full bg-brand px-6 py-3 font-body font-bold text-brand-contrast transition-transform duration-300 hover:-translate-y-0.5"
      >
        Ver projetos
      </a>
    </div>
  </div>

  <button
    type="button"
    class="hero-toggle absolute bottom-6 right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-text-inverse/30 text-text-inverse transition-colors duration-300 hover:bg-surface-inverse/60"
    aria-label="Pausar vídeo de fundo"
    aria-pressed="false"
  >
    <svg class="icon-pause h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14"></rect>
      <rect x="14" y="5" width="4" height="14"></rect>
    </svg>
    <svg class="icon-play hidden h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="7,4 20,12 7,20"></polygon>
    </svg>
  </button>
</section>

<style>
  .hero-fallback {
    display: none;
    background: linear-gradient(
      160deg,
      color-mix(in oklch, var(--color-brand) 35%, var(--color-surface-inverse)),
      var(--color-surface-inverse)
    );
  }

  .hero-overlay {
    background: linear-gradient(
      180deg,
      color-mix(in oklch, var(--color-surface-inverse) 15%, transparent),
      color-mix(in oklch, var(--color-surface-inverse) 80%, transparent)
    );
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-video {
      display: none;
    }

    .hero-fallback {
      display: block;
    }

    .hero-toggle {
      display: none;
    }
  }
</style>

<script>
  const toggle = document.querySelector<HTMLButtonElement>(".hero-toggle");
  const video = document.querySelector<HTMLVideoElement>(".hero-video");

  toggle?.addEventListener("click", () => {
    if (!video) return;
    const wasPlaying = !video.paused;

    if (wasPlaying) {
      video.pause();
    } else {
      video.play();
    }

    toggle.setAttribute("aria-pressed", String(wasPlaying));
    toggle.setAttribute("aria-label", wasPlaying ? "Tocar vídeo de fundo" : "Pausar vídeo de fundo");
    toggle.querySelector(".icon-pause")?.classList.toggle("hidden", wasPlaying);
    toggle.querySelector(".icon-play")?.classList.toggle("hidden", !wasPlaying);
  });
</script>
```

- [ ] **Step 2: Verificar o build**

```bash
npm run build
```
Esperado: build completo sem erros (o `<script>` do botão é typecheckado pelo `astro check` que já roda dentro do `qa`; pra essa etapa `build` sozinho basta).

- [ ] **Step 3: Wire temporário pra visualizar (removido na Task 6, que faz o wire definitivo)**

Adicionar `<Hero />` temporariamente em `src/pages/index.astro` (substituindo o conteúdo de exemplo do starter) só pra conferir visualmente agora — a versão final de `index.astro` com todas as seções é escrita na Task 6, então não se preocupe em deixar isso "bonito" ainda:

```astro
---
import Layout from "../layouts/Layout.astro";
import Hero from "../sections/Hero.astro";
---

<Layout title="Portfólio (WIP)" description="Em construção.">
  <Hero />
</Layout>
```

- [ ] **Step 4: Rodar o dev server e conferir visualmente**

```bash
npm run dev
```
Usar o Playwright MCP: `browser_navigate` pra `http://localhost:4321/`, `browser_take_screenshot`. Confirmar: headline e CTA legíveis sobre o vídeo/gradiente, botão de pausar visível no canto inferior direito, sem erro no console (`browser_console_messages`, level `error`).

Parar o dev server depois de conferir.

---

### Task 3: ProjetoCard + seção Projetos (grid)

**Files:**
- Create: `src/components/ProjetoCard.astro`
- Create: `src/sections/ProjetosGrid.astro`

**Interfaces:**
- Consumes: collection `"projetos"` (Task 1) via `getCollection("projetos", filter)`.
- Produces: `ProjetosGrid.astro` (sem props) — usado por `src/pages/index.astro` (Task 6).

- [ ] **Step 1: Criar o card**

Criar `src/components/ProjetoCard.astro`:

```astro
---
import { Image } from "astro:assets";
import type { CollectionEntry } from "astro:content";

interface Props {
  projeto: CollectionEntry<"projetos">;
  delay?: number;
}

const { projeto, delay = 0 } = Astro.props;
const { titulo, descricao, url, screenshot, tags } = projeto.data;
---

<article
  class="reveal group overflow-hidden rounded-lg bg-surface-alt shadow-sm transition-shadow duration-300 hover:shadow-md"
  data-reveal-delay={delay.toFixed(2)}
>
  <div class="overflow-hidden">
    <Image
      src={screenshot}
      alt={`Captura de tela do projeto ${titulo}`}
      width={800}
      height={500}
      loading="lazy"
      class="w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  </div>
  <div class="p-6">
    <h3 class="font-display text-xl font-bold text-text">{titulo}</h3>
    <p class="mt-2 text-text-muted">{descricao}</p>
    <ul class="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li class="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand">{tag}</li>
      ))}
    </ul>
    {url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        class="mt-6 inline-flex rounded-full bg-brand px-5 py-2 text-sm font-bold text-brand-contrast transition-transform duration-300 hover:-translate-y-0.5"
      >
        Ver site
      </a>
    ) : (
      <span
        class="mt-6 inline-flex cursor-not-allowed rounded-full bg-surface px-5 py-2 text-sm font-bold text-text-muted"
        aria-disabled="true"
      >
        Em breve
      </span>
    )}
  </div>
</article>
```

- [ ] **Step 2: Criar a seção que lista os cards**

Criar `src/sections/ProjetosGrid.astro`:

```astro
---
import { getCollection } from "astro:content";
import ProjetoCard from "../components/ProjetoCard.astro";

const projetos = await getCollection("projetos", ({ data }) => data.status === "entregue");
---

<section id="projetos" class="container-du section-y">
  <div class="relative">
    <p
      class="pointer-events-none absolute -top-6 left-0 select-none font-display text-7xl font-extrabold uppercase text-text/8 md:text-9xl"
      aria-hidden="true"
    >
      Projetos
    </p>
    <h2 class="reveal relative font-display text-3xl font-bold text-text md:text-4xl">Projetos</h2>
  </div>
  <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {projetos.map((projeto, i) => <ProjetoCard projeto={projeto} delay={i * 0.1} />)}
  </div>
</section>
```

- [ ] **Step 3: Verificar tipos e build**

```bash
npm run check && npm run build
```
Esperado: `0 errors` no check; build completo. Se `check` reclamar de `CollectionEntry<"projetos">` não encontrado, rodar `npm run dev` uma vez pra regenerar `.astro/types.d.ts` e tentar de novo.

- [ ] **Step 4: Conferir visualmente**

Trocar temporariamente o `index.astro` de WIP (Task 2) pra incluir também `<ProjetosGrid />` logo abaixo do `<Hero />`, rodar `npm run dev`, Playwright `browser_navigate` + `browser_take_screenshot` na seção `#projetos`. Confirmar: card do Vinicius Brito aparece com screenshot, título, descrição, as 2 tags, e o badge "Em breve" (não tem `url` ainda). Parar o dev server depois.

---

### Task 4: Skills (dados + seção)

**Files:**
- Create: `src/data/skills.ts`
- Create: `src/sections/Skills.astro`

**Interfaces:**
- Produces: `skills: Skill[]` (consumido só por `Skills.astro`), `Skills.astro` (sem props) — usado por `src/pages/index.astro` (Task 6).

- [ ] **Step 1: Criar os dados**

Criar `src/data/skills.ts`:

```ts
export interface Skill {
  nome: string;
}

export const skills: Skill[] = [
  { nome: "HTML" },
  { nome: "CSS" },
  { nome: "JavaScript" },
  { nome: "TypeScript" },
  { nome: "Astro" },
  { nome: "Next.js" },
  { nome: "Tailwind CSS" },
  { nome: "GSAP" },
  { nome: "Motion" },
  { nome: "Figma" },
  { nome: "UI Design" },
];
```

- [ ] **Step 2: Criar a seção**

Criar `src/sections/Skills.astro`:

```astro
---
import { skills } from "../data/skills";
---

<section id="skills" class="container-du section-y">
  <h2 class="reveal font-display text-3xl font-bold text-text md:text-4xl">Skills</h2>
  <ul class="mt-8 flex flex-wrap gap-3">
    {skills.map((skill, i) => (
      <li
        class="reveal rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand"
        data-reveal-delay={(i * 0.03).toFixed(2)}
      >
        {skill.nome}
      </li>
    ))}
  </ul>
</section>
```

- [ ] **Step 3: Verificar build**

```bash
npm run check && npm run build
```
Esperado: `0 errors`, build completo.

- [ ] **Step 4: Conferir visualmente**

Mesmo fluxo das tasks anteriores: incluir `<Skills />` no `index.astro` de WIP, `npm run dev`, Playwright screenshot da seção `#skills`. Confirmar: 11 pills visíveis, quebrando linha corretamente no mobile (testar em 375px de largura via `browser_resize`). Parar o dev server depois.

---

### Task 5: Contato

**Files:**
- Create: `src/sections/Contato.astro`

**Interfaces:**
- Produces: `Contato.astro` (sem props) — usado por `src/pages/index.astro` (Task 6).

- [ ] **Step 1: Criar o componente**

Criar `src/sections/Contato.astro`:

```astro
---
const WHATSAPP = "5512978145247"; // (12) 97814-5247 em formato internacional pro link wa.me
const INSTAGRAM_URL = "https://www.instagram.com/ale.drj_/";
const EMAIL = "alexandre.resendedj@hotmail.com";
---

<section id="contato" class="relative overflow-hidden bg-surface-inverse py-[var(--space-section-y-lg)]">
  <p
    class="pointer-events-none absolute -top-4 left-0 select-none font-display text-7xl font-extrabold uppercase text-text-inverse/8 md:text-9xl"
    aria-hidden="true"
  >
    Contato
  </p>
  <div class="container-du relative">
    <h2 class="reveal font-display text-3xl font-bold text-text-inverse md:text-4xl">
      Vamos conversar sobre o seu projeto.
    </h2>
    <ul class="mt-8 flex flex-col gap-4 text-lg md:flex-row md:gap-10">
      <li>
        <a
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          class="reveal font-bold text-text-inverse underline decoration-brand decoration-2 underline-offset-4 transition-colors duration-300 hover:text-brand"
        >
          WhatsApp
        </a>
      </li>
      <li>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          class="reveal font-bold text-text-inverse underline decoration-brand decoration-2 underline-offset-4 transition-colors duration-300 hover:text-brand"
          data-reveal-delay="0.1"
        >
          Instagram
        </a>
      </li>
      <li>
        <a
          href={`mailto:${EMAIL}`}
          class="reveal font-bold text-text-inverse underline decoration-brand decoration-2 underline-offset-4 transition-colors duration-300 hover:text-brand"
          data-reveal-delay="0.2"
        >
          {EMAIL}
        </a>
      </li>
    </ul>
  </div>
</section>
```

- [ ] **Step 2: Verificar build**

```bash
npm run check && npm run build
```
Esperado: `0 errors`, build completo.

- [ ] **Step 3: Conferir visualmente**

Incluir `<Contato />` no `index.astro` de WIP, `npm run dev`, Playwright screenshot da seção `#contato`. Confirmar: fundo escuro, "CONTATO" translúcido de fundo, os 3 links legíveis e com hover funcionando (`browser_hover` em cada link, conferir que muda pra cor `--color-brand`). Parar o dev server depois.

---

### Task 6: Montagem final, limpeza e QA obrigatório

**Files:**
- Modify: `src/pages/index.astro` (versão definitiva, substitui os WIPs das tasks anteriores)
- Delete: `src/assets/hero.svg` (não usado mais — só existia pro `index.astro` de exemplo do starter)

**Interfaces:**
- Consumes: `Hero`, `ProjetosGrid`, `Skills`, `Contato` (Tasks 2–5).

- [ ] **Step 1: Escrever a versão final de `index.astro`**

Substituir todo o conteúdo de `src/pages/index.astro`:

```astro
---
import Layout from "../layouts/Layout.astro";
import Hero from "../sections/Hero.astro";
import ProjetosGrid from "../sections/ProjetosGrid.astro";
import Skills from "../sections/Skills.astro";
import Contato from "../sections/Contato.astro";
---

<Layout
  title="Xande — Portfólio"
  description="Sites e landing pages que já entreguei — dá uma olhada no que já fiz."
>
  <Hero />
  <ProjetosGrid />
  <Skills />
  <Contato />
</Layout>
```

- [ ] **Step 2: Remover asset não usado**

```bash
rm src/assets/hero.svg
```

- [ ] **Step 3: Rodar o pipeline automatizável**

```bash
npm run qa
```
Esperado: `check` (0 erros) → `lint:css` (sem violação de token) → `build` completo. Se `lint:css` reclamar de alguma cor/fonte hardcoded fora do `theme.css`, corrigir pra usar o token semântico equivalente antes de seguir.

- [ ] **Step 4: Screenshot desktop + mobile via Playwright**

```bash
npm run dev
```
Playwright MCP: `browser_resize` pra 1440×900, `browser_navigate` pra `http://localhost:4321/`, `browser_take_screenshot` (fullPage: true). Repetir com `browser_resize` pra 375×812 (mobile). Checar `browser_console_messages` (level `error`) nas duas — esperado 0 erros.

- [ ] **Step 5: Emular `prefers-reduced-motion` e reconferir o Hero**

Usar `mcp__chrome-devtools__emulate` (ou o recurso equivalente de emulação de mídia disponível) pra forçar `prefers-reduced-motion: reduce`, recarregar a página e conferir: `.hero-video` não aparece, `.hero-fallback` (gradiente) aparece no lugar, `.hero-toggle` (botão pausar) não aparece. Sem essa checagem o comportamento de fallback só foi validado por leitura do CSS, não por execução real.

- [ ] **Step 6: Auditoria de acessibilidade**

Usar `mcp-accessibility-scanner` (`audit_site` ou `scan_page` na home, com o dev server no ar). Esperado: 0 violações. Prestar atenção especial em:
- Contraste do texto sobre o vídeo do Hero (o overlay gradiente existe justamente pra isso — se reprovar, escurecer o gradiente em `.hero-overlay`).
- Contraste dos links de Contato sobre `--color-surface-inverse`.

Corrigir qualquer violação encontrada antes de seguir — não reportar como pronto com violação pendente.

- [ ] **Step 7: Lighthouse (thresholds do MazyOS)**

```bash
npm run build && npm run preview
```
Usar `mcp__chrome-devtools__lighthouse_audit` (ou Lighthouse via Chrome DevTools MCP) na URL do preview. Thresholds obrigatórios (`MazyOS/CLAUDE.md`): Performance ≥ 90, Accessibility = 100, Best Practices ≥ 95, SEO ≥ 95.

**Atenção:** o vídeo de fundo externo (Cloudinary) é o candidato mais provável a derrubar o Performance/LCP. Se reprovar:
1. Confirmar que o elemento de LCP não é o próprio `<video>` (idealmente é o `<h1>` do Hero, já que o vídeo é `aria-hidden` e decorativo).
2. Se o vídeo mesmo assim atrasar o LCP ou pesar no Total Blocking Time, considerar (nessa ordem): comprimir/reduzir a resolução do vídeo de origem no Cloudinary (parâmetros de transformação de URL, ex. `q_auto,w_1920`), ou adicionar `preload="none"` + carregar via `IntersectionObserver`/`client:idle`-like pattern só quando o Hero entra em viewport (raro na prática já que é o primeiro elemento, mas vale checar se `preload="metadata"` já ajuda o LCP sem atrasar o vídeo).
3. **Não remover o vídeo** — é decisão fechada do usuário. Documentar a decisão tomada em `docs/superpowers/specs/2026-07-23-portfolio-vitrine-design.md` (seção Performance) se algum ajuste for feito.

- [ ] **Step 8: Registrar o resultado do QA**

Depois que os 4 thresholds baterem e a auditoria de acessibilidade estiver limpa, adicionar uma linha em `MazyOS/projetos/Portfolio/briefing.md`, seção "Pendências", confirmando a data e os números obtidos (ex: "QA rodado em 2026-07-XX: Performance 94, Accessibility 100, Best Practices 100, SEO 100 — vídeo do Hero sem impacto no LCP, elemento de LCP é o `<h1>`"). Só considerar a entrega pronta depois disso — nunca reportar como pronta com um threshold pendente.

- [ ] **Step 9: Parar o dev/preview server**

Encerrar qualquer processo `astro dev`/`astro preview` deixado rodando em background.

---

## Self-Review (registrado aqui, não é uma task pra executar)

- **Cobertura da spec:** Hero (Task 2) ✓, Projetos/grid/content collection (Tasks 1 e 3) ✓, Skills (Task 4) ✓, Contato (Task 5) ✓, montagem + SEO + QA obrigatório (Task 6) ✓. Estados (card sem `url`, hover, reduced-motion) cobertos nas respectivas tasks. Nenhuma seção da spec ficou sem task.
- **Placeholders:** nenhum "TBD"/"implementar depois" — todo código é completo e literal (copy final, URLs de contato reais, cores/oklch calculadas).
- **Consistência de tipos:** `CollectionEntry<"projetos">` (Task 1 define o schema, Task 3 consome o tipo) e `Skill`/`skills` (Task 4, único consumidor) batem entre definição e uso.
- **Escopo:** só o que está na spec — sem página de case study, sem CMS, sem Tipo B. Se `Cozinha e Tal`/`Ribas Suplementos` entrarem depois, é um novo arquivo `.md` em `src/content/projetos/`, sem exigir nova task de código.
