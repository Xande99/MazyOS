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
- ~~O vídeo de fundo do Hero é decisão fechada (Cloudinary)~~ — **[SUBSTITUÍDO 2026-07-23, Task 7]** trocado por shader WebGL local (Three.js, `src/scripts/shader-background.ts`, TypeScript vanilla — sem ilha React), removendo a dependência de rede/conta de terceiro. Em `prefers-reduced-motion: reduce`, o shader não inicializa e um gradiente estático (mesmos tokens de cor, mesmo elemento `.hero-fallback` de antes) aparece no lugar; um botão pausar/tocar sempre visível fora do modo reduced-motion (WCAG 2.2.2 — conteúdo animado >5s exige controle de pausa).
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

---

### Task 7: Shader WebGL local no lugar do vídeo do Hero (adendo pós-lançamento)

Pedido pelo usuário depois do QA final da Task 6, motivado pela pendência de confiabilidade/licenciamento do vídeo hotlinked de Cloudinary de terceiro. Ver `docs/superpowers/specs/2026-07-23-portfolio-vitrine-design.md`, seção "Task 7", pro raciocínio completo.

**Files:**
- Create: `src/scripts/shader-background.ts`
- Modify: `src/sections/Hero.astro` (troca `<video>` por `<canvas>`, remove tratamento de erro de vídeo, adiciona `<script>` de inicialização do shader)
- Modify: `package.json` (adiciona `three` + `@types/three`, versões pinadas exatas)

**Interfaces:**
- Produces: `initShaderBackground(canvas: HTMLCanvasElement): ShaderBackground`, onde `ShaderBackground = { pause(): void; resume(): void; isPaused(): boolean; destroy(): void }`. Consumido só por `Hero.astro`.

- [ ] **Step 1: Instalar as dependências**

```bash
npm install --save-exact three@0.185.1
npm install --save-exact -D @types/three@0.185.1
```

Verificar que ambas entram pinadas exatas (sem `^`/`~`) em `package.json`.

- [ ] **Step 2: Criar o módulo do shader**

Criar `src/scripts/shader-background.ts`:

```ts
/**
 * Shader de fundo animado do Hero (Three.js/WebGL) — substitui o vídeo
 * hotlinked de Cloudinary de terceiro por uma animação renderizada
 * localmente, sem dependência de rede. TypeScript vanilla (sem React),
 * mesmo padrão de src/scripts/reveal.ts — não há estado reativo aqui, só
 * setup imperativo de WebGL, então uma ilha React não se justifica
 * (ver .claude/decisions.md).
 */
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  ShaderMaterial,
  PlaneGeometry,
  Mesh,
  Vector2,
} from "three";

const VERTEX_SHADER = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float iTime;
  uniform vec2 iResolution;

  #define NUM_OCTAVES 3

  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);

    float res = mix(
      mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
      mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
    return res * res;
  }

  float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.3;
    vec2 shift = vec2(100);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
      v += a * noise(x);
      x = rot * x * 2.0 + shift;
      a *= 0.4;
    }
    return v;
  }

  void main() {
    vec2 shake = vec2(sin(iTime * 1.2) * 0.005, cos(iTime * 2.1) * 0.005);
    vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
    vec2 v;
    vec4 o = vec4(0.0);

    float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

    for (float i = 0.0; i < 35.0; i++) {
      v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5 + vec2(sin(iTime * 3.0 + i) * 0.003, cos(iTime * 3.5 - i) * 0.003);
      float tailNoise = fbm(v + vec2(iTime * 0.5, i)) * 0.3 * (1.0 - (i / 35.0));
      vec4 auroraColors = vec4(
        0.1 + 0.3 * sin(i * 0.2 + iTime * 0.4),
        0.3 + 0.5 * cos(i * 0.3 + iTime * 0.5),
        0.7 + 0.3 * sin(i * 0.4 + iTime * 0.3),
        1.0
      );
      vec4 currentContribution = auroraColors * exp(sin(i * i + iTime * 0.8)) / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));
      float thinnessFactor = smoothstep(0.0, 1.0, i / 35.0) * 0.6;
      o += currentContribution * (1.0 + tailNoise * 0.8) * thinnessFactor;
    }

    o = tanh(pow(o / 100.0, vec4(1.6)));
    gl_FragColor = o * 1.5;
  }
`;

export interface ShaderBackground {
  pause: () => void;
  resume: () => void;
  isPaused: () => boolean;
  destroy: () => void;
}

/**
 * Inicializa o shader no canvas informado. Lança (throw) se o navegador não
 * conseguir criar um contexto WebGL — quem chama deve envolver em try/catch
 * e cair no fallback estático (.hero-fallback) nesse caso.
 *
 * Retorna controles de pause/resume/destroy:
 * - pause()/resume() só param/retomam o loop de requestAnimationFrame
 *   (WCAG 2.2.2 — conteúdo animado >5s precisa de controle de pausa).
 * - destroy() libera os recursos de GPU (geometry/material/renderer) —
 *   chamar se o canvas sair do DOM (ex: navegação via View Transitions).
 */
export function initShaderBackground(canvas: HTMLCanvasElement): ShaderBackground {
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const getSize = (): [number, number] => {
    const rect = canvas.parentElement?.getBoundingClientRect();
    return [rect?.width || window.innerWidth, rect?.height || window.innerHeight];
  };

  const [initialWidth, initialHeight] = getSize();
  renderer.setSize(initialWidth, initialHeight);

  const material = new ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new Vector2(initialWidth, initialHeight) },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
  });

  const geometry = new PlaneGeometry(2, 2);
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

  let frameId: number | null = null;
  let paused = false;

  const tick = () => {
    material.uniforms.iTime.value += 0.016;
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(tick);
  };

  const start = () => {
    if (frameId === null) {
      paused = false;
      tick();
    }
  };

  const pause = () => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
    paused = true;
  };

  const handleResize = () => {
    const [width, height] = getSize();
    renderer.setSize(width, height);
    material.uniforms.iResolution.value.set(width, height);
  };
  window.addEventListener("resize", handleResize);

  const destroy = () => {
    pause();
    window.removeEventListener("resize", handleResize);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };

  start();

  return { pause, resume: start, isPaused: () => paused, destroy };
}
```

- [ ] **Step 3: Reescrever `Hero.astro`**

Substituir todo o conteúdo de `src/sections/Hero.astro`:

```astro
---
/**
 * Hero — abertura do portfólio. Fundo animado via shader WebGL (Three.js),
 * renderizado localmente — substitui o vídeo hotlinked de Cloudinary de
 * terceiro (ver docs/superpowers/specs/2026-07-23-portfolio-vitrine-design.md,
 * seção "Task 7"; motivo completo em .claude/decisions.md).
 *
 * Em prefers-reduced-motion, o shader nem chega a inicializar — cai direto
 * no gradiente estático (.hero-fallback), reaproveitado sem alteração do
 * design original do vídeo.
 */
---

<section id="hero" class="relative flex min-h-screen items-center overflow-hidden bg-surface-inverse">
  <canvas class="hero-shader absolute inset-0 z-0 h-full w-full" aria-hidden="true"></canvas>

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
    aria-label="Pausar animação de fundo"
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
    .hero-shader {
      display: none;
    }

    .hero-fallback {
      display: block;
    }

    .hero-toggle {
      display: none;
    }
  }

  /* Fallback forçado por JS quando o WebGL falha ao inicializar (ex:
     contexto indisponível) — mesmo tratamento visual do
     prefers-reduced-motion, sem depender de media query. */
  #hero.hero-shader-error .hero-shader {
    display: none;
  }

  #hero.hero-shader-error .hero-fallback {
    display: block;
  }

  #hero.hero-shader-error .hero-toggle {
    display: none;
  }
</style>

<script>
  import { initShaderBackground } from "../scripts/shader-background";

  const hero = document.querySelector<HTMLElement>("#hero");
  const toggle = document.querySelector<HTMLButtonElement>(".hero-toggle");
  const canvas = document.querySelector<HTMLCanvasElement>(".hero-shader");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && !prefersReducedMotion) {
    try {
      const shader = initShaderBackground(canvas);

      toggle?.addEventListener("click", () => {
        const wasPaused = shader.isPaused();

        if (wasPaused) {
          shader.resume();
        } else {
          shader.pause();
        }

        toggle.setAttribute("aria-pressed", String(!wasPaused));
        toggle.setAttribute(
          "aria-label",
          wasPaused ? "Pausar animação de fundo" : "Tocar animação de fundo",
        );
        toggle.querySelector(".icon-pause")?.classList.toggle("hidden", !wasPaused);
        toggle.querySelector(".icon-play")?.classList.toggle("hidden", wasPaused);
      });
    } catch {
      hero?.classList.add("hero-shader-error");
    }
  }
</script>
```

- [ ] **Step 4: Verificar build**

```bash
npm run check && npm run build
```
Esperado: `0 errors`, build completo. Se `check` reclamar de tipos do `three`, confirmar que `@types/three` instalou na mesma versão de `three`.

- [ ] **Step 5: Conferir visualmente (shader ativo)**

```bash
npm run dev
```
Playwright MCP: `browser_navigate` pra `http://localhost:4321/`, `browser_take_screenshot` (a animação em si não aparece em screenshot estático, mas confirmar que a seção renderiza sem tela preta/quebrada e sem erro no console via `browser_console_messages`). Testar o botão pausar/tocar: `browser_click` no `.hero-toggle`, confirmar troca de `aria-pressed`/ícone.

- [ ] **Step 6: Conferir o fallback de `prefers-reduced-motion`**

Emular `prefers-reduced-motion: reduce` (via `mcp__chrome-devtools__emulate` ou equivalente), recarregar, confirmar: `<canvas class="hero-shader">` não aparece (nunca inicializado), `.hero-fallback` (gradiente) visível, `.hero-toggle` ausente.

- [ ] **Step 7: Remedir o Lighthouse (thresholds do MazyOS)**

```bash
npm run build && npm run preview
```
Lighthouse via `mcp__chrome-devtools__lighthouse_audit` (ou equivalente). Thresholds: Performance ≥ 90, Accessibility = 100, Best Practices ≥ 95, SEO ≥ 95. **Comparar com o baseline da Task 6** (Performance 100 desktop / 99 mobile, medido ainda com o vídeo) — o shader WebGL contínuo tem custo de CPU/GPU diferente do vídeo, pode alterar o número. Se cair abaixo do threshold, mitigar (nessa ordem): reduzir o número de octaves/iterações do fragment shader (`NUM_OCTAVES`, o loop de 35 iterações), limitar `setPixelRatio` a 1 em vez de 2, ou desabilitar o shader em telas pequenas (mobile) caindo no fallback estático — decisão tomada com dado medido, não a priori. Documentar o resultado e qualquer ajuste em `docs/superpowers/specs/2026-07-23-portfolio-vitrine-design.md` (seção Performance) e em `MazyOS/projetos/Portfolio/briefing.md` (Pendências).

- [ ] **Step 8: Auditoria de acessibilidade**

`mcp-accessibility-scanner` (`scan_page`) na home com o dev server no ar. Esperado: 0 violações (mesmo resultado da Task 6, já que o `.hero-overlay`/contraste de texto não mudou).

- [ ] **Step 9: Atualizar `.claude/decisions.md`**

Registrar a troca vídeo → shader: decisão, motivo (remover dependência de conta de terceiro/Cloudinary), alternativas descartadas (self-host do vídeo original — descartada por ainda exigir hospedagem/banda de terceiro pra um asset que não é do usuário; ilha React — descartada por não haver estado reativo real, ver Global Constraints), impacto (bundle ganha peso de `three`, precisa monitorar Performance; remove qualquer risco de licenciamento/uptime do vídeo).

- [ ] **Step 10: Parar dev/preview server e revisar arquivos não utilizados**

Confirmar que não sobrou nenhuma referência a `VIDEO_SRC`/Cloudinary em `Hero.astro` ou em qualquer outro arquivo do projeto (`grep -r "cloudinary" src/`).

---

## Self-Review (registrado aqui, não é uma task pra executar)

- **Cobertura da spec:** Hero (Task 2) ✓, Projetos/grid/content collection (Tasks 1 e 3) ✓, Skills (Task 4) ✓, Contato (Task 5) ✓, montagem + SEO + QA obrigatório (Task 6) ✓. Estados (card sem `url`, hover, reduced-motion) cobertos nas respectivas tasks. Nenhuma seção da spec ficou sem task.
- **Placeholders:** nenhum "TBD"/"implementar depois" — todo código é completo e literal (copy final, URLs de contato reais, cores/oklch calculadas).
- **Consistência de tipos:** `CollectionEntry<"projetos">` (Task 1 define o schema, Task 3 consome o tipo) e `Skill`/`skills` (Task 4, único consumidor) batem entre definição e uso.
- **Escopo:** só o que está na spec — sem página de case study, sem CMS, sem Tipo B. Se `Cozinha e Tal`/`Ribas Suplementos` entrarem depois, é um novo arquivo `.md` em `src/content/projetos/`, sem exigir nova task de código.
