# duPolvo Studio — MazyOS

Operação da agência. Aqui ficam todos os clientes, propostas, conteúdo e entregas da duPolvo Studio.

**Estrutura de pastas:**
- `_memoria/` — quem é a agência, como falamos, foco atual
- `identidade/` — marca da duPolvo (aplicada nas peças internas e de cliente)
- `clientes/` — uma subpasta por cliente, autossuficiente
- `briefings/` — briefings antes de virar cliente
- `propostas/` — propostas em andamento
- `marketing/` — conteúdo institucional da agência
- `saidas/` — documentos pontuais, análises
- `dados/` — arquivos a analisar (relatórios de cliente, exports)
- `scripts/` — automações e scripts internos
- `projeto/` — pasta de desenvolvimento dos sites e LPs dos clientes

## Pastas vinculadas

| Pasta | Caminho | Para que serve |
|---|---|---|
| `projeto/` | `C:\Users\Xande\Desktop\MazyOS\projeto\` | Desenvolvimento dos sites e LPs (stack e regras técnicas no `projeto/CLAUDE.md`) |
| `cerebro/` | `C:\Users\Xande\Desktop\cerebro\` | Base de conhecimento técnico (referência, não editar) |

---

## Sobre a agência

Agência criativa e digital, 4 pessoas, Guaratinguetá SP. Atendemos pequenos negócios locais e empreendedores que já têm operação mas nunca investiram de verdade em presença digital. Nossos pilares: Programação, Design, Vídeo/Edição, Tráfego Pago.

## Clientes ativos

- **Vinicius-Brito** — LP entregável em `clientes/Vinicius-Brito/landing-page/`
- **Ribas Suplementos** — em desenvolvimento (`projeto/Ribas Suplementos/`), briefing em `clientes/Ribas Suplementos/`

## O que mais produzimos aqui

- Propostas comerciais pra novos clientes
- Carrosséis e conteúdo institucional da agência
- Landing pages e peças de tráfego pago
- Relatórios de performance para clientes

## Tom de voz

Direto, criativo, ousado sem ser arrogante. Frases curtas. "Fora do óbvio" como assinatura. Resultado sem prometer milagre.

Evitar: alavancar, ecossistema, jornada, entregar valor, metodologia ágil, mindset, expertise, bullet com emoji, copy de comitê, entusiasmo vazio.

## Regras do sistema

- Cliente novo → criar pasta `clientes/<Nome>/` com briefing, estratégia e subpastas conforme as entregas contratadas
- Projeto de desenvolvimento novo → classificar no briefing como **Tipo A** (LP/site institucional → Astro) ou **Tipo B** (sistema/SaaS/área logada → Next.js + Supabase), conforme a regra de stack do `projeto/CLAUDE.md`. Registrar o tipo no briefing.
- Proposta nova → `propostas/<cliente>-<data>.html` antes de fechar
- Casos de sucesso ficam em `clientes/<Nome>/caso.md` (reuso em pitches)
- Toda peça visual consulta `identidade/design-guide.md` antes de criar

## Ferramentas conectadas

- [x] Playwright MCP — verificação visual/funcional de páginas renderizadas
- [x] Context7 MCP — documentação atualizada de libs (GSAP, Motion, Next.js, Tailwind etc.)
- [ ] Notion
- [ ] Gmail
- [ ] Google Calendar
- [ ] Meta Ads
- [ ] Google Ads

*(Marcar conforme for instalando os MCPs)*

---

## Skills de animação (nível referência)

Instaladas via marketplace `freshtechbro/claudedesignskills` (bundles `core-3d-animation`, `extended-3d-scroll`, `animation-components`). Regra de stack de animação completa (hierarquia CSS → View Transitions → GSAP → Motion) já vive em `projeto/CLAUDE.md` — aqui só o mapa de qual skill nova puxar em cada caso.

**Tipo A (Astro/GSAP) — puxar por padrão:**
- `gsap-scrolltrigger` — scroll storytelling, pinning, scrub, timelines (a base, já é stack oficial)
- `locomotive-scroll` — smooth scroll + parallax quando a LP pede uma camada extra de imersão
- `lightweight-3d-effects` (Zdog/Vanta/Vanilla-Tilt) — profundidade decorativa leve em hero sem WebGL pesado
- `scroll-reveal-libraries` (AOS) — só pra fade/slide simples quando GSAP for overkill
- `animejs` — SVG morphing e coreografias timeline fora do escopo do GSAP
- `barba-js` — transição entre páginas, quando a View Transitions API nativa não bastar
- `threejs-webgl` / `pixijs-2d` — só se a peça pedir um centro 3D/2D ambicioso (hero de impacto); usar com moderação, pesa no Lighthouse

**Tipo B (Next.js/Motion) — puxar por padrão:**
- `motion-framer` — já é a stack oficial (`motion`, App Router)
- `react-spring-physics` — gestos com inércia e física real (drag, swipe) além do que Motion cobre bem
- `animated-component-libraries` (Magic UI/React Bits) — componentes prontos pra dashboards quando não vale a pena entalhar do zero
- `react-three-fiber` — 3D declarativo dentro de app React (configurador de produto, dataviz)

**Uso cruzado (A ou B):**
- `lottie-animations` — ícones animados, loading states, micro-interações vindas do design
- `babylonjs-engine` / `playcanvas-engine` / `aframe-webxr` — engines de jogo/VR completas; raramente necessárias pra LP/sistema de agência, só se o projeto for literalmente um jogo/experiência 3D

## Regras obrigatórias de front-end

Valendo pra qualquer projeto (LP, site, sistema, dashboard) — comportamento automático, sem precisar pedir:

1. Ao criar ou editar qualquer interface visual, avaliar automaticamente se motion design agrega (consultando as skills acima) antes de entregar uma seção estática. Motion é avaliado sempre, mesmo que a resposta seja "não precisa".
2. Usar o Context7 MCP antes de escrever código com GSAP, Motion, Next.js ou Tailwind — API sempre atual, nunca de memória.
3. Verificar todo trabalho visual com o Playwright MCP antes de dar como concluído: abrir a página, testar a animação renderizada, confirmar que não quebrou layout nem performance.
4. Padrão de qualidade é nível referência (Awwwards, godly.website): tipografia intencional, espaçamento preciso, micro-interações, hierarquia visual forte. "Funciona" não é suficiente. Se uma entrega estiver visualmente genérica, apontar isso proativamente e propor o upgrade.
5. Animação é deliberada, não decorativa — cada movimento revela, guia o olhar ou conta a história do scroll. Evitar fade genérico espalhado; preferir um momento orquestrado de impacto.
6. Performance e acessibilidade não são negociáveis: `prefers-reduced-motion` sempre implementado, animar só `transform`/`opacity` (regra que já existe em `projeto/CLAUDE.md`, reforçada aqui pro nível de ambição subir).

---

## Contexto do negócio

No início de toda conversa, ler os seguintes arquivos (quando existirem e estiverem preenchidos):

1. `_memoria/empresa.md` — quem é a duPolvo, o que faz, como funciona
2. `_memoria/preferencias.md` — tom de voz, estilo de escrita, o que evitar, e como prefiro colaborar em projetos técnicos (validação antes de migrations, evidência medida, etc.)
3. `_memoria/estrategia.md` — foco atual, prioridades, prazos

Usar essas informações como base pra qualquer resposta ou decisão. Ao sugerir prioridades, formatos ou abordagens, considerar o foco atual descrito em `estrategia.md`.

Pra qualquer tarefa visual (carrossel, post, landing page), consultar `identidade/design-guide.md` como referência de estilo.

Antes de começar a desenvolver qualquer sistema novo (fora de LP/site institucional), consultar `_memoria/oportunidades-sistemas.md` — ele já tem o mapa de possibilidades, os 10 sistemas verticais priorizados por nicho, a recomendação de por onde começar e o esboço de arquitetura de cada um. Não repetir essa análise do zero; usar como base e só aprofundar o que for pedido.

Ao iniciar um projeto novo que precisa de banco de dados/Supabase, consultar `_memoria/checklist-novo-projeto-supabase.md` antes de pedir pro usuário qualquer configuração manual.

Não é necessário listar o que foi lido nem confirmar a leitura. Apenas usar o contexto naturalmente.

---

## Fluxo de novo projeto

Quando iniciar um novo projeto de cliente:

1. Rodar `/novo-projeto` e responder as perguntas do cliente
2. O briefing gerado fica em `clientes/<Nome>/briefing.md` — incluir no briefing o tipo do projeto (Tipo A: Astro / Tipo B: Next.js + Supabase). O `/novo-projeto` já ativa sozinho, sem precisar pedir: skills de animação (mapa acima), Context7 MCP, Playwright MCP, padrão de qualidade nível referência e (se Tipo B) o checklist Supabase — o resumo do comando confirma o que foi ativado.
3. Comunicar o caminho do briefing pro Claude Code em `projeto/`:
   ```
   Lê o briefing em C:\Users\Xande\Desktop\MazyOS\clientes\<Nome>\briefing.md,
   consulta o cérebro em C:\Users\Xande\Desktop\cerebro
   e cria a estrutura do site.
   ```
4. Desenvolvimento acontece dentro de `projeto/<Nome>/`
5. Deploy conforme o tipo: Tipo A → Netlify ou Cloudflare Pages; Tipo B → Vercel + Supabase
6. Quando pronto, mover a pasta `projeto/<Nome>/` pro Desktop

---

## Fluxo de trabalho

Antes de executar qualquer tarefa, verificar se existe skill relevante em `.claude/skills/`. Se encontrar, seguir as instruções da skill. Se não encontrar, executar a tarefa normalmente.

Sempre que o pedido envolver fazer ou melhorar algo com skill, buscar entre todas as skills já analisadas (catálogo em `saidas/outros/arsenal-skills.html`) qual(is) a mais adequada(s) — não só a mais óbvia. As skills nativas do MazyOS (abrir, novo-projeto, instalar, salvar, mapear-rotinas, atualizar, carrossel, seo, anuncio-google, aprovar-post, publicar-tema, relatorio-ads, responder-avaliacoes, email-profissional, analisar-dados) continuam óbvias, uso direto. As demais (adicionadas depois) devem ser usadas tanto pra executar o que foi pedido quanto pra auxiliar a melhoria do próprio MazyOS.

Ao concluir uma tarefa que não tinha skill mas parece repetível (o usuário provavelmente vai pedir de novo no futuro), perguntar:

> "Isso pode virar uma skill pra próxima vez. Quer que eu crie?"

Não perguntar pra tarefas pontuais ou perguntas simples. Só quando o padrão de repetição for claro.

---

## Aprender com correções

Quando o usuário corrigir algo, melhorar uma resposta ou dar uma instrução que parece permanente (frases como "na verdade é assim", "não faça mais isso", "prefiro assim", "sempre que...", "evita...", "da próxima vez..."), perguntar:

> "Quer que eu salve isso pra não precisar repetir?"

Se sim, identificar onde faz mais sentido salvar:

- **Sobre o negócio** (clientes, serviços, mercado) → `_memoria/empresa.md`
- **Sobre preferências e estilo** (tom de voz, formato, o que evitar) → `_memoria/preferencias.md`
- **Sobre prioridades e foco** (projetos, metas, prazos) → `_memoria/estrategia.md`
- **Regra de comportamento nessa pasta** → próprio `CLAUDE.md`

Salvar com uma linha nova clara, sem reformatar o arquivo inteiro. Confirmar mostrando a linha adicionada.

Não perguntar se a correção for óbvia de contexto imediato (ex: "na verdade o arquivo se chama X"). Só perguntar quando a informação tiver valor duradouro.

---

## Manter contexto atualizado

Ao terminar uma tarefa que mudou algo relevante (cliente novo, skill nova, mudança de foco, processo novo, ferramenta instalada, estrutura alterada), perguntar:

> "Isso mudou algo no teu contexto. Quer que eu atualize a memória?"

Se sim, identificar o que atualizar:

- **Cliente, serviço, ferramenta, equipe** → `_memoria/empresa.md`
- **Mudança de prioridade ou foco** → `_memoria/estrategia.md`
- **Tom ou estilo** → `_memoria/preferencias.md`
- **Pasta, regra de organização, skill criada** → `CLAUDE.md`
- **Visual (cores, fontes, logo)** → `identidade/design-guide.md`

Mostrar o que vai mudar antes de salvar. Não reformatar o arquivo inteiro, só adicionar ou editar a linha relevante.

**Quando NÃO perguntar:**
- Tarefas pontuais sem impacto no contexto (escrever um email avulso, criar um post)
- Perguntas simples ou conversas sem ação
- Mudanças já salvas pelo bloco "Aprender com correções"

**Dica:** rode `/atualizar` pra uma varredura completa quando houver dúvida.

---

## Pendências conhecidas

Levantadas em `saidas/relatorio-estado-mazyos.md` (2026-07-09), decisão de resolver adiada — não remover esta seção até cada item ser tratado:

- **`propostas/` e `briefings/` nunca foram criadas** — nenhum dos 2 clientes ativos tem proposta formal registrada, apesar do fluxo padrão prever isso.
- **`duPolvoNovo` (site institucional) não segue a stack oficial de Tipo A** — é HTML/CSS/JS vanilla, não Astro. Migração pendente de decisão (quando/se vale a pena).
- **`projeto/curriculo_digital`** é um repositório git próprio, sem relação clara com a agência — confirmar se deve continuar dentro de `projeto/` ou sair daqui.

## Criação de skills

Quando o usuário pedir skill nova:

1. Verificar se existe template relevante em `templates/skills/`. Se existir, usar como base e adaptar pro contexto
2. Perguntar se é específica desse projeto ou útil em qualquer:
   - Específica → `.claude/skills/nome-da-skill/SKILL.md` (local)
   - Universal → `~/.claude/skills/nome-da-skill/SKILL.md` (global)
3. Ler `_memoria/empresa.md` e `_memoria/preferencias.md` pra calibrar o conteúdo da skill ao contexto do negócio
4. Se a skill precisar de arquivos de apoio (templates, exemplos), criar dentro da pasta da skill
5. Seguir o fluxo da skill-creator nativa do Claude Code
