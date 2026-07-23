# Briefing — Cozinha e Tal

**Tipo:** A — Astro
**Deploy:** Netlify ou Cloudflare Pages

## Sobre

Vender o e-book "Receitas Cozinha e Tal" através de uma landing page própria, convertendo a audiência de 191 mil seguidores da Claudia (Cozinha e Tal) em compradores diretos.

## Entregas previstas

- Landing page de vendas do e-book

## Ativação automática

- Skills de animação: GSAP + ScrollTrigger (View Transitions ativo via `ClientRouter`)
- MCPs em uso: Context7, Playwright
- Checklist Supabase: não aplicável (Tipo A)

## Identidade visual

Identidade própria e já consolidada (logo, Instagram, LP anterior) — não herda a linha visual da duPolvo.

**Paleta:**
- `#29C584` — verde, cor de marca principal
- `#FFFFFF` — branco
- `#E3233E` — vermelho, destaque/CTA
- `#F2BFBD` — rosa claro, suporte

**Tipografia:**
- Winter Christmas (script) — nome "Cozinha e tal"
- Candara (Microsoft, proprietária) — complemento "por Claudia Fernandes"

**Decisão de tratamento de fonte** (ver `.claude/decisions.md` em `projeto/Cozinha e Tal/` quando o projeto rodar o passo de setup):
- Candara: usada só como *system font stack* (`"Candara", "Segoe UI", system-ui, sans-serif`) — fonte proprietária Microsoft, não pode ser self-hosted sem licença própria.
- Winter Christmas: **pendência** — cliente não confirmou ter licença de uso web/comercial dos arquivos da fonte. `--font-display` no `theme.css` já referencia o nome da fonte (com fallback `cursive`), mas nenhum arquivo foi embutido. Resolver antes da entrega final: (a) confirmar licença e fornecer arquivos woff2/ttf, ou (b) trocar por fonte script licenciada equivalente.

**Logo:** casinha com wi-fi no telhado e garfo/faca formando a "porta" — ícone consolidado, presente no Instagram e na LP atual.

**Imagens já disponíveis** em `MazyOS/imagens/`: `capa_ebook.jpeg`, `logo.jpg`, `perfil.jpeg`.

## Nicho de mercado (Cérebro)

**Nicho: infoprodutos** (síntese de 2026-07-15, 13 notas reais de infoproduto).

Resumo aplicável a este projeto:
- Esqueleto padrão: hero com transformação (benefício encadeado) → prova social específica (número real) → grid de módulos/conteúdo → tiers de preço (1 destacado) → FAQ/objeção → CTA
- Perfil "infoprodutor solo com 1 produto" é o caso mais comum e se aplica aqui — hero focado no resultado prometido, prova social individual
- Framework de copy mais robusto: Problema → História Real → Resultados Específicos → Próximo Passo
- Pergunta de diagnóstico obrigatória: hero deve ser a criadora (Claudia, com 191k seguidores) ou o resultado (o e-book)? — a favor de hero com a Claudia + prova social de audiência, dado o porte da audiência já existente
- Bullets curtos respondendo "o que vou aprender/receber" reforçam conversão
- Tipo A confirmado como suficiente pro nicho (sem dashboard/matrícula)

**Tipografia por nicho:** não aplicada — cliente já tem identidade visual própria e consolidada (Winter Christmas + Candara), que prevalece sobre a curadoria padrão do nicho (Sora + Inter, par Principal de infoprodutos).

## Pendências

- Fonte Winter Christmas: confirmar licença de uso web/comercial antes da entrega final (ver seção Identidade visual acima).
- Domínio do cliente: ainda não definido — `astro.config.mjs` está com placeholder (`https://exemplo.duPolvo.com.br`), atualizar assim que houver domínio real (canonical/OG dependem disso).
- Depoimentos: seção ainda com placeholder ("Depoimento real do cliente entra aqui" × 3) — coletar depoimentos reais antes da entrega final.
- QA rodado em 2026-07-23 (build estático `dist/` já existente, servido localmente — ver `.claude/decisions.md` pro motivo): Lighthouse desktop 100/100/100/100, mobile 99/100/100/100. `astro@7.0.9` atualizado pra `7.1.3` (mesmo patch de segurança aplicado no Portfolio/starter — XSS via View Transitions), `npm audit`: 0 vulnerabilidades.
