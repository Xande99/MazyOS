# Portfolio — Vitrine de Projetos (design)

**Data:** 2026-07-23
**Projeto:** `projeto/Portfolio/` (Tipo A — Astro), contexto em `MazyOS/projetos/Portfolio/briefing.md`

## Objetivo

Site pessoal de uma página pra Xande mostrar, pra clientes em potencial e pra consulta própria, os projetos (sites/LPs) já entregues pela duPolvo. Foco em prova de trabalho, não em currículo formal.

## Escopo

**Dentro:**
- Página única (`/`) com Hero, Projetos, Skills, Contato.
- Content Collection de projetos, começando com 1 item real (Vinicius Brito).
- Identidade visual própria (paleta roxo `#5500FF` + Fira Sans), já aplicada em `theme.css` na fase de scaffolding.

**Fora (por enquanto):**
- Páginas de case study individuais por projeto (link "Ver site" aponta pro site do cliente, não pra uma página interna de detalhe).
- CMS/admin pra cadastrar projeto sem editar arquivo — resolvido com Content Collection (editar/criar `.md` é suficiente pro volume esperado).
- Blog, área logada, qualquer coisa que exija Tipo B.
- Vinicius Brito e qualquer projeto futuro sem `status: entregue` não aparecem no grid ainda.

## Arquitetura

Astro (starter Tipo A já scaffoldado, build confirmado). Uma página (`src/pages/index.astro`) que compõe as seções abaixo, usando `Layout.astro` existente.

### Content Collection — `src/content/projetos/`

Schema (`src/content/config.ts`):

```ts
titulo: string
descricao: string          // 1-2 frases, usado no card
url: string.url().optional()   // ausente = ainda não deployado
screenshot: image()         // via astro:assets, width/height explícitos
tags: string[]              // ex: ["Landing Page", "Fitness"]
status: "entregue" | "em-desenvolvimento"
```

`ProjetosGrid.astro` filtra e renderiza só `status: "entregue"`.

**Conteúdo inicial:** lança com 1 entrada, `vinicius-brito.md` — Landing Page de consultoria online fitness (briefing em `clientes/Vinicius-Brito/briefing.md`). Sem `url` (ainda não deployado) → card mostra "Em breve" no lugar do link. Screenshot capturado via Playwright a partir do `index.html` local do cliente (`clientes/Vinicius-Brito/landing-page/index.html`).

Grid pensado pra crescer incrementalmente: outros projetos (Cozinha e Tal, Ribas Suplementos etc.) entram como novo arquivo `.md` na collection conforme forem tendo o screenshot capturado — não é preciso esperar todos prontos pra lançar.

### Skills — `src/data/skills.ts`

Array estático (não muda com frequência, não justifica content collection):
HTML, CSS, JavaScript, TypeScript, Astro, Next.js, Tailwind CSS, GSAP, Motion, Figma, UI Design.

## Componentes (`src/sections/`)

Cada seção é um `.astro` independente, consumindo só tokens semânticos do `theme.css`.

1. **`Hero.astro`** — vídeo de fundo full-screen (Cloudinary, cinematográfico/escuro), foco só em Xande como marca pessoal (sem menção à duPolvo Studio), headline direta (sem clichê de agência — "fora do óbvio" como tom de voz), CTA pra seção de projetos. Poster estático de fallback (frame do vídeo) pra quando `prefers-reduced-motion` estiver ativo ou o vídeo não carregar. Botão pausar/tocar discreto (WCAG 2.2.2 — conteúdo autoplay >5s precisa de controle de pausa).
2. **`ProjetosGrid.astro`** — grid responsivo (1 col mobile, 2-3 desktop) de cards: screenshot, título, descrição curta, tags (pills), botão "Ver site" ou "Em breve" (desabilitado, sem link morto).
3. **`Skills.astro`** — pills com fundo `--color-brand-50`, texto `--color-brand`, lendo de `src/data/skills.ts`.
4. **`Contato.astro`** — fundo escuro (`--color-surface-inverse`), big type "CONTATO" translúcido de fundo (mesmo padrão do currículo original), 3 canais: WhatsApp (`(12) 97814-5247`), Instagram (`@ale.drj_`), e-mail (`alexandre.resendedj@hotmail.com`).

## Copy e direção visual

A cópia final (headline do hero, descrição do projeto, microcopy dos botões) é escrita na fase de implementação usando as skills de copy/design abaixo — não fica fixada aqui como texto definitivo, só a direção:

- Tom: direto, sem "alavancar/ecossistema/jornada" (ver `_memoria/preferencias.md` da raiz).
- Headline do hero: apresenta Xande + duPolvo, sem enrolação, sem prometer milagre.
- Descrição do projeto: 1-2 frases objetivas (segmento do cliente + o que foi entregue), não um resumo de proposta comercial.

**Skills a ativar durante a implementação** (pedido explícito do usuário — cobrir design, front-end, UI/UX e copy, não só fazer "funcionar"):
- `storybrand-messaging` → `copywriting` — headline e microcopy do hero/CTA/contato
- `frontend-design` — baseline de qualidade visual (nível Awwwards/godly.website, conforme `CLAUDE.md`)
- `web-typography` — hierarquia tipográfica com Fira Sans (só 1 família, display e body — cuidado redobrado com escala/peso pra não ficar monótono)
- `refactoring-ui` / `ux-heuristics` — polimento visual e usabilidade dos cards/pills/grid
- `microinteractions` — hover de card, botão pausar/tocar do hero, transições de link

## Estados

- Card de projeto sem `url` → botão "Em breve" desabilitado (`aria-disabled`, sem `href`), nunca link quebrado.
- Screenshot com `width`/`height` explícitos via `astro:assets` (evita CLS), `loading="lazy"` (abaixo da dobra), `eager`/`fetchpriority="high"` só na imagem do hero se houver.
- Hover em card: elevação leve + zoom sutil no screenshot — só `transform`/`opacity`.
- Vídeo do hero: fallback pra poster estático se falhar o carregamento (`<video>` com `poster="..."`) e se `prefers-reduced-motion: reduce`.
- Grid vazio (0 projetos `entregue`): não deve acontecer no lançamento (1 item real), mas o componente não quebra se a collection ficar vazia — trata como array vazio, sem placeholder textual necessário agora (YAGNI; revisitar se o caso real aparecer).

## Motion e acessibilidade

- Reveal on scroll já herdado do starter (`.reveal` + GSAP `ScrollTrigger`, `gsap.matchMedia()`).
- Vídeo do hero: autoplay + muted + loop + `playsinline`; pausa automática/poster estático se `prefers-reduced-motion: reduce`; controle manual de pausar/tocar sempre visível (não só condicional a reduced motion).
- Contraste: texto sobre vídeo precisa de overlay escuro (gradiente) suficiente pra manter contraste AA mesmo em frames mais claros do vídeo.
- `alt` descritivo nos screenshots de projeto.

## Performance

- Vídeo do hero fica — decisão confirmada, não é negociável trocar por imagem estática. Mas a sequência de implementação mede o Lighthouse cedo (assim que o Hero com vídeo estiver de pé, antes de polir as demais seções) pra decidir se precisa de ajuste de peso/condicional (comprimir vídeo de origem, poster como LCP element, autoplay condicional por conexão) — decisão tomada com dado medido, não a priori, mas o vídeo em si está fora de discussão.

## SEO

- `title`/`description` da página personalizados (não usar os textos de exemplo do starter).
- `og:image` = frame de destaque do hero ou screenshot do primeiro projeto.

## QA obrigatório antes de considerar pronto

Pipeline padrão do `MazyOS/CLAUDE.md`: gate de segurança → build → Playwright (desktop + mobile) → `mcp-accessibility-scanner` → thresholds (Performance ≥ 90, Accessibility = 100, Best Practices ≥ 95, SEO ≥ 95). Atenção especial ao vídeo de fundo no Performance/LCP — é o ponto mais provável de reprovar o threshold.

## Fora de escopo / pendências conhecidas

- Domínio ainda não definido (`astro.config.mjs` com placeholder).
- Screenshot do Vinicius Brito precisa ser capturado (Playwright) antes da implementação do card.
- Projetos futuros (Cozinha e Tal, Ribas Suplementos etc.) entram como novo arquivo em `src/content/projetos/` conforme forem tendo o screenshot capturado — não bloqueia o lançamento com 1 item só.
