# Relatório de estado — MazyOS

**Data:** 2026-07-09
**Sobre:** MazyOS é o repositório de operação da duPolvo Studio, agência criativa e digital de 4 pessoas em Guaratinguetá-SP (Programação, Design, Vídeo/Edição, Tráfego Pago). Fase declarada: pré-lançamento. Este documento descreve o estado real do repositório nesta data, para leitura por alguém sem contexto prévio do projeto.

---

## 1. Inventário geral

### 1.1 Projetos em `projeto/`

| Projeto | Stack | Estágio |
|---|---|---|
| `duPolvoNovo` | HTML/CSS/JS vanilla + tokens CSS próprios, sem build | **Pronto e publicado** — é o site institucional ao vivo da própria agência |
| `dashboard` | Next.js (App Router) + TypeScript + Tailwind v4 + Supabase | **Pronto** — 6 fases (CRM, Kanban, Calendário, Notas, Tarefas, Estoque/Financeiro, Cofre de acesso) implementadas e verificadas |
| `Ribas Suplementos` | Next.js + Supabase (Tipo B) | **Scaffold inicial / em desenvolvimento** — criado em 2026-07-09 |
| `curriculo_digital` | HTML/CSS/JS + `.git` próprio | **Fora do escopo da agência** — repositório git independente, ignorado pelo MazyOS |

Detalhes:

- **duPolvoNovo** — o site institucional da duPolvo (não é cliente). A entrega real é `duPolvo/index.html` + `css/style.css` + `js/main.js`, sem framework, consumindo tokens de `tokens/*.css`. A pasta também está estruturada como projeto de Design Sync do claude.ai (`SKILL.md`, `_ds_manifest.json`, `_ds_bundle.js` na raiz da pasta) e contém material reutilizável extraído em 2026-07-09: `sections/` (blocos de seção genéricos pra outras LPs), `motion-kit/` (sistema de animação vanilla-JS documentado, com receitas equivalentes em GSAP/Motion para Astro/Next.js), `guidelines/` (specimens de marca em HTML) e `tokens/` (cores, tipografia, spacing, motion). Hoje foi adicionada a primeira animação de scroll com GSAP + ScrollTrigger (ver seção 2) — ainda não testada visualmente num navegador real.
- **dashboard** ("Painel duPolvo") — CRM, Kanban, calendário, notas, tarefas, estoque/financeiro (orçamentos → ordens → faturas) e cofre de acesso (credenciais cifradas via Supabase Vault, com log de auditoria), tudo sincronizado em tempo real entre os 4 sócios. Projeto Supabase remoto real, já linkado (`nexflcqiwfovdvhfevyc`). Tem build (`.next`) e `node_modules` presentes — já foi rodado. Próximo passo, segundo `_memoria/estrategia.md`, é uso real pelos sócios ou extensão além do escopo original.
- **Ribas Suplementos** — loja de suplementos (whey, creatina, pré-treino) com catálogo, carrinho e checkout. Rotas de UI existem (catálogo, carrinho, checkout, conta, login), mas: projeto Supabase **ainda não criado/linkado**, **sem gateway de pagamento** integrado (checkout cria pedido com status "aguardando pagamento", confirmação manual), **sem painel de administração** (catálogo é editado direto no Supabase Studio), carrinho é só `localStorage` (client-side, não persiste entre dispositivos). O `README.md` do projeto ainda é o texto padrão gerado pelo `create-next-app` — não foi editado.
- **curriculo_digital** — tem `.git` próprio; nenhum commit do histórico do MazyOS toca essa pasta, confirmando que é um repositório separado, meramente hospedado dentro de `projeto/`. Não aparece como cliente nem projeto da agência em nenhum outro documento. Vale confirmar com o usuário se deveria estar nessa pasta.

### 1.2 Clientes em `clientes/`

- **Vinicius-Brito** (Personal Trainer, consultoria online fitness) — tem `CLAUDE.md`, `briefing.md` completo (público-alvo, oferta, diferenciais, CTAs, depoimentos, paleta de cor, estrutura de LP sugerida em 7 seções) e uma entrega em `landing-page/index.html` + imagem de referência do cliente.
- **Ribas Suplementos** — tem `briefing.md` (curto: tipo de projeto, o que vende), `CLAUDE.md` e `settings.local.json`. O desenvolvimento de fato roda em `projeto/Ribas Suplementos/`; os documentos de negócio (briefing, contexto) ficam em `clientes/Ribas Suplementos/` — essa separação bate com o fluxo descrito no `CLAUDE.md` raiz.
- Nenhum dos dois clientes tem proposta comercial registrada — as pastas `propostas/` e `briefings/` citadas na estrutura do `CLAUDE.md` raiz **não existem** no repositório (nem vazias).

### 1.3 Skills

**Skills nativas do MazyOS** (citadas explicitamente no `CLAUDE.md` raiz, uso direto): `abrir` (carrega contexto no início de sessão), `novo-projeto` (briefing de cliente novo), `instalar`, `salvar` (versiona no git), `mapear-rotinas`, `atualizar` (varredura de memória), `carrossel`, `seo`, `anuncio-google`, `aprovar-post`, `publicar-tema`, `relatorio-ads`, `responder-avaliacoes`, `email-profissional`, `analisar-dados`.

**Catálogo global** — `~/.claude/skills/` (aplicado a todo o repositório, incluindo os projetos dentro de `projeto/`) tem cerca de **100 skills** no total, agrupadas por área:
- **Design/UI/UX:** frontend-design, ui-ux-pro-max, refactoring-ui, web-typography, top-design, ios-hig-design, design-everyday-things, microinteractions, design-is, design-sprint, impeccable, steve-jobs-design-review, ux-heuristics.
- **Copy/marketing:** copywriting, ogilvy, storybrand-messaging, one-page-marketing, made-to-stick, hundred-million-offers, scorecard-marketing, contagious, influence-psychology.
- **Estratégia/produto:** jobs-to-be-done, mom-test, lean-startup, lean-ux, lean-analytics, blue-ocean-strategy, crossing-the-chasm, good-strategy-bad-strategy, traction-eos, inspired-product, continuous-discovery, obviously-awesome, cold-start-problem, monetizing-innovation, predictable-revenue, negotiation.
- **Engenharia/arquitetura:** clean-code, clean-architecture, domain-driven-design, refactoring-patterns, system-design, ddia-systems, working-with-legacy-code, test-driven-development, high-perf-browser, software-design-philosophy, pragmatic-programmer, release-it.
- **Fluxo de trabalho do Claude Code:** brainstorming, executing-plans, writing-plans, using-git-worktrees, verification-before-completion, subagent-driven-development, dispatching-parallel-agents, systematic-debugging, task-observer, standup, learn-codebase, find-skills, writing-skills.
- **Gestão/times:** high-output-management, team-topologies, drive-motivation, hooked-ux, improve-retention.
- **Animação e 3D (instaladas hoje, 2026-07-09)** — via `claude plugin install`, marketplace `freshtechbro/claudedesignskills`, escopo `~/.claude/plugins/` (não em `.claude/skills/` local): `gsap-scrolltrigger`, `motion-framer`, `threejs-webgl`, `react-three-fiber`, `babylonjs-engine`, `playcanvas-engine`, `aframe-webxr`, `pixijs-2d`, `animejs`, `lottie-animations`, `react-spring-physics`, `scroll-reveal-libraries`, `locomotive-scroll`, `barba-js`, `lightweight-3d-effects`, `animated-component-libraries` — 14 skills novas.

Cada projeto técnico (`dashboard/`, `Ribas Suplementos/`, `duPolvoNovo/`, `curriculo_digital/`) tem sua própria pasta `.claude/` (settings locais, e em dois casos `decisions.md` — ver seção 2), mas não existe uma pasta `.claude/skills/` compartilhada dentro de `projeto/` — as skills que se aplicam a todos os projetos vêm do catálogo global da raiz.

### 1.4 MCPs configurados

- **claude.ai TranscriptAPI** — pré-existente, transcrição de vídeos do YouTube.
- **Playwright** (`npx @playwright/mcp@latest`) — instalado hoje. Ainda não foi exercido nesta sessão (ver seção 3).
- **Context7** (`npx -y @upstash/context7-mcp`) — instalado hoje. Ainda não foi exercido nesta sessão (ver seção 3).

### 1.5 Comandos customizados

Não existe pasta `.claude/commands/` em nenhum ponto do repositório (raiz ou subprojetos). O que o `CLAUDE.md` raiz chama de "skills nativas do MazyOS" (`/abrir`, `/novo-projeto` etc.) são skills, não slash-commands customizados registrados separadamente.

### 1.6 Arquivos de memória (`_memoria/`)

- **empresa.md** — identidade da agência: fundador, equipe, os 4 pilares, perfil de cliente-alvo, processo de trabalho em 4 etapas, diferencial competitivo.
- **estrategia.md** — fase atual (pré-lançamento), prioridade (deixar a base operacional pronta antes de captar cliente), e o estado do projeto "Painel interno duPolvo" (todas as fases concluídas).
- **preferencias.md** — tom de voz, palavras/formatos a evitar, e regras de colaboração em projetos técnicos (aprovar schema antes de rodar, exigir evidência medida, nunca commitar sem pedido, testar fluxo completo antes de dar como pronto) — mais uma linha adicionada hoje sobre priorizar nível de referência em front-end.
- **oportunidades-sistemas.md** — mapa de possibilidades de sistemas internos/SaaS (8 categorias) e 10 sistemas verticais recorrentes por nicho, com matriz de encaixe e recomendação de por onde começar (agendamento + lembrete de recorrência, nicho barbearia). Nada disso foi construído — é material de decisão, não backlog.
- **checklist-novo-projeto-supabase.md** — passos manuais para criar um projeto Supabase novo (região, chaves de API, `.env.local`, link via CLI) antes da automação de migrations assumir.

---

## 2. O que foi feito recentemente

**Nesta sessão (2026-07-09):**
- Instalação dos MCPs Playwright e Context7.
- Instalação de 14 skills de animação/3D via marketplace externo (`freshtechbro/claudedesignskills`).
- Atualização do `CLAUDE.md` raiz: MCPs marcados como conectados, mapa de qual skill de animação usar por tipo de projeto (Tipo A/Astro vs. Tipo B/Next.js), e 6 regras obrigatórias de front-end (avaliar motion sempre, consultar Context7 antes de código com GSAP/Motion/Next/Tailwind, verificar com Playwright antes de concluir, padrão de qualidade nível Awwwards, animação deliberada não decorativa, performance/acessibilidade).
- Atualização de `_memoria/preferencias.md` com o objetivo permanente de elevar o front-end a nível de referência.
- Implementação da primeira animação usando as skills novas: seção "solução" (etapas do processo) do site institucional (`duPolvoNovo/duPolvo/`) ganhou uma barra de progresso e ativação sequencial de ícones, pinada e sincronizada ao scroll via GSAP + ScrollTrigger (CDN, versão 3.15.0), com fallback de acessibilidade (`prefers-reduced-motion` e ausência de JS mantêm a seção sempre visível no estado final).

**Commits recentes no histórico do repositório** (do mais novo pro mais velho, resumido): scaffold inicial do Ribas Suplementos (Tipo B) → Supabase CLI adicionada como dependência do dashboard → atualização de permissões locais do Claude Code → atualização de memória com regras Tipo A/B e oportunidades → skill de QA visual pré-entrega (Lighthouse + conformidade de tokens) → conexão do `/novo-projeto` às skills de design → biblioteca de seções e kit de animação reutilizáveis extraídos do duPolvoNovo → unificação do design system da duPolvo e correção de contraste WCAG do rosa da marca → eliminação de renderização dinâmica desnecessária no dashboard → favoritos na sidebar do dashboard → criação do painel interno duPolvo → catálogo de skills com auto-classificação.

**Decisões técnicas documentadas** (`decisions.md`, existe em 2 dos 4 projetos técnicos — `dashboard` e `Ribas Suplementos`; **não existe em `duPolvoNovo`**):

*dashboard:*
- Sessão do cofre de acesso como tabela própria (`vault_sessions`), não campo solto, por precisar de CRUD independente e cascade de limpeza.
- Favoritos da sidebar como array na coluna `profiles.favoritos`, não tabela relacional — não há requisito de ordenação customizada.
- Busca de usuário movida para o client (`useCurrentUser()`), porque qualquer uso de sessão/cookies em Server Component forçava toda a rota a renderizar dinamicamente, impedindo prefetch/cache real — essa era a causa raiz de lentidão na navegação.
- Cor de destaque (`--color-accent`) escurecida de `#fd4b90` para `#c81f66` por falha de contraste WCAG AA (~3.2:1 sobre botão preenchido, mínimo exigido 4.5:1) — mesmo bug que existia na LP institucional, corrigido lá e herdado aqui.

*Ribas Suplementos:*
- Carrinho em `localStorage`, não em tabela do banco — estado efêmero, sem necessidade comprovada de persistência entre dispositivos ainda.
- Checkout aceita convidado, sem exigir login — login obrigatório é fricção de conversão conhecida em e-commerce.
- Preço e nome do produto sempre recalculados no servidor no checkout, nunca confiando no valor vindo do client (proteção contra manipulação via devtools).
- Sem gateway de pagamento ainda — depende de decisão do cliente sobre qual usar.
- Sem painel de administração — catálogo gerenciado direto via Supabase Studio, por ora.

---

## 3. Pendências e lacunas conhecidas

- **Mudanças não commitadas.** `git status` mostra 6 arquivos modificados e não commitados: `.claude/settings.local.json`, `CLAUDE.md`, `_memoria/preferencias.md`, e os 3 arquivos do site institucional alterados hoje (`style.css`, `index.html`, `js/main.js`). Nada do trabalho de hoje foi salvo no histórico do git ainda.
- **`CLAUDE.md` raiz desatualizado.** A seção "Clientes ativos" ainda diz *"Nenhum ainda — fase de pré-lançamento"*, mas já existem 2 clientes reais (Vinicius-Brito, Ribas Suplementos) com pastas, briefings e, no caso do Vinicius, uma landing page entregável.
- **Pastas `propostas/` e `briefings/` nunca foram criadas**, apesar de o fluxo documentado no `CLAUDE.md` raiz descrevê-las como parte do processo padrão ("Proposta nova → `propostas/<cliente>-<data>.html` antes de fechar"). Nenhum dos 2 clientes atuais tem proposta formal registrada.
- **duPolvoNovo não segue a própria regra de stack.** `projeto/CLAUDE.md` define Tipo A (LP/site institucional) como Astro + Tailwind + TypeScript + GSAP — mas o site institucional da própria agência é HTML/CSS/JS vanilla puro, sem framework, sem TypeScript, sem Tailwind (CSS com tokens customizados). É provavelmente anterior à regra, mas não foi migrado nem marcado como exceção.
- **Verificação pendente da animação nova.** A seção "solução" do site institucional ganhou hoje uma animação de scroll pinada, mas ainda não foi testada visualmente num navegador — o teste requer o MCP do Playwright, que foi instalado nesta mesma sessão e por isso ainda não estava disponível para uso (MCPs adicionados via linha de comando só carregam o conjunto de ferramentas no próximo boot da sessão do Claude Code).
- **MCPs Playwright e Context7 instalados mas não exercidos.** Mesma limitação acima — nenhuma chamada real foi feita a nenhum dos dois ainda.
- **`curriculo_digital` dentro de `projeto/` sem relação clara com a agência** — é um repositório git próprio e separado, não aparece como cliente nem projeto institucional em nenhum outro documento. Vale confirmar com o responsável se deveria estar nessa pasta.
- **Logo da duPolvo ainda não existe** — `identidade/design-guide.md` registra explicitamente "ainda não definido"; o site institucional usa só tipografia como marca (sem símbolo).
- **`decisions.md` não existe no projeto `duPolvoNovo`**, diferente de `dashboard` e `Ribas Suplementos`. A decisão técnica de hoje (usar GSAP + ScrollTrigger via CDN, sem build step) não foi registrada em nenhum arquivo de decisões — não existe onde registrar.
- **Nenhum sistema interno da lista de oportunidades foi construído ainda** (`_memoria/oportunidades-sistemas.md` é só material de decisão) — o que é esperado na fase atual, mas já há 2 clientes reais consumindo tempo da equipe, o que tensiona com a prioridade declarada em `estrategia.md` de "deixar a base operacional pronta antes de captar cliente".
- **Ribas Suplementos: README não editado.** O `README.md` do projeto ainda é o texto padrão do `create-next-app`, sem nenhuma informação real sobre o projeto (o `CLAUDE.md` do próprio projeto cobre isso, mas o README não).

---

## 4. Capacidade atual de front-end

**Skills de animação:** as 14 skills instaladas hoje (GSAP/ScrollTrigger, Motion, Three.js/React Three Fiber, Babylon.js, PlayCanvas, A-Frame, PixiJS, Anime.js, Lottie, React Spring, AOS, Locomotive Scroll, Barba.js, Zdog/Vanta/Vanilla-Tilt, Magic UI/React Bits) estão instaladas e ativas, mas **foram usadas em código real uma única vez** — a seção "solução" do site institucional, implementada nesta mesma sessão e ainda não verificada visualmente em navegador.

**Nível honesto dos projetos existentes:**
- **duPolvoNovo** (site institucional) — é o mais avançado visualmente: identidade de marca consistente (cores, tipografia Bricolage Grotesque, easing assinatura, radius generoso), animações de entrada já bem trabalhadas antes de hoje (headline com split de palavras e stagger, reveals via IntersectionObserver, contador de números animado, ticker infinito, mascote flutuante, micro-interações de hover/press) e, a partir de hoje, uma seção com scroll storytelling pinado. Ainda assim, apenas 1 de ~10 seções tem tratamento de scroll avançado — o resto é fade/slide padrão. Nenhum 3D, WebGL, Lottie ou física de mola foi usado em nenhum lugar ainda.
- **dashboard e Ribas Suplementos** (Next.js/Tipo B) — usam Tailwind padrão e os componentes/transições que Next.js/React entregam de fábrica; **nenhum dos dois usa Motion** ainda, apesar de ser a stack oficial de animação definida para Tipo B em `projeto/CLAUDE.md`. Não há motion design intencional em nenhum dos dois — são interfaces funcionais, não pensadas para impressionar visualmente.
- **Vinicius-Brito** (LP de cliente) — não foi inspecionada a fundo nesta rodada (fora do escopo deste levantamento); merece a mesma avaliação quando houver necessidade.

**O que falta para nível de referência (Awwwards/godly.website):**
1. Verificar a animação já implementada com Playwright antes de considerá-la concluída (regra já existe no `CLAUDE.md`, ainda não exercida de ponta a ponta).
2. Estender o tratamento de scroll storytelling para as outras seções do site institucional, não só uma.
3. Aplicar Motion de fato nos projetos Next.js (dashboard, Ribas Suplementos) — hoje nenhum dos dois tem qualquer motion design além do padrão do framework.
4. Migrar ou justificar formalmente a exceção de stack do duPolvoNovo (vanilla em vez de Astro), já que ele é a vitrine visual da própria agência.
5. Consolidar o `motion-kit/` do duPolvoNovo como peça reutilizável de fato entre projetos, em vez de ficar isolado num único site.
6. Repetir o processo em pelo menos um projeto de cliente real (Ribas Suplementos ou Vinicius-Brito) para provar que o padrão novo não é exclusivo do site da própria agência.
