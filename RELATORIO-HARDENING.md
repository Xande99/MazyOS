# Relatório de Hardening de Segurança — MazyOS

**Período:** 2026-07-20 a 2026-07-21
**Escopo:** MazyOS raiz, `projeto/dashboard`, `projeto/Ribas Suplementos`, `projeto/duPolvoNovo`, `templates/starter-tipo-a`, `templates/starter-tipo-b`, `.claude/` (configuração do Claude Code)
**Status:** As 6 fases do plano original (Fase 0 – Fase 5) estão concluídas e mescladas em `main`. Este documento é a entrega final consolidada.

Ponto de partida: `AUDITORIA-SEGURANCA.md` (Fase 0, 2026-07-20) — nenhum achado crítico, um achado 🟠 Alto (CDN sem SRI), oito achados 🟡 Médio (headers ausentes, deps soltas, sem `.npmrc`, Zod faltando no Cofre, bug de `cliente_user_id`, etc.). Esse relatório permanece como registro histórico do estado "antes"; este documento aqui é o "depois" + o consolidado do trabalho.

---

## 1. O que foi alterado, por fase

Três branches de trabalho, todas preservadas no histórico local (nenhuma deletada) e mescladas em `main` via merge commit dedicado.

### Fase 0 — Auditoria (branch `security-hardening`)

- `6ea107d` — Fase 0: auditoria de segurança e mapeamento do MazyOS

Gerou `AUDITORIA-SEGURANCA.md` e `ACOES-MANUAIS.md`. Varredura completa de segredos, dependências, versões vulneráveis, auth/RLS — sem achado crítico.

### Fase 1 — Fundação (branch `security-hardening`)

- `6391899` — pinagem exata de deps, `ignore-scripts` e install command travado
- `8602317` — adiciona comando `/deps-review`

Pinagem exata em todos os `package.json` com dependência solta, `.npmrc` (`ignore-scripts=true`) em todos os projetos com `package.json`, `npm ci` forçado no build (`vercel.json`/`netlify.toml`).

### Fase 2 — Headers/CSP/CDN/Formulários (branch `security-hardening`)

- `e8272b3` — registra por que CSP nativo do Astro não foi ativado (conflito com View Transitions)
- `df083d6` — self-host GSAP/ScrollTrigger/Lucide no duPolvoNovo
- `b96d308` — `headers()` de segurança no Next.js (dashboard + Ribas)
- `7b57631` — honeypot + delay mínimo no checkout público (Ribas)

### Fase 3 — Supabase (branch `security-hardening`)

- `fc47536` — testes de impersonação RLS (dashboard verificado ao vivo, Ribas escrito)
- `ef527d4` — valida input do `cofre/actions.ts` com Zod
- `40c78dd` — corrige `cliente_user_id` nunca preenchido no checkout (Ribas)
- `7ba28fd` — consolida em `ACOES-MANUAIS.md` tudo pendente do Supabase do Ribas

### Fase 4 — Claude Code hardening (branch `security-hardening`)

- `d8f6cf8` — allowlist + deny rules + hook `PreToolUse` no `settings.json` raiz

Merge em `main`: `cf96a4f`.

### Fora do plano original, tratado na mesma janela — intro/hero do duPolvoNovo (branch `design/intro-duPolvo`)

Não é item de segurança — é uma correção visual que tinha sido commitada (`c33a9d6`) dentro de `security-hardening` por engano, revertida de lá (`b7f57a8`) por estar fora de escopo, e recuperada numa branch própria a pedido do usuário:

- `9146374` — simplifica intro splash e remove `hero__blob`
- `8922166` — registra a decisão (antes fazia falta esse registro, causa raiz do "reaparecer sozinho" ao trocar de branch — resolvido isolando em git worktree)
- `4d541c3` — remove o glow circular atrás do mascote na hero

Merge em `main`: `19cc14d`.

### Fase 5 — Herança Automática (branch `heranca-automatica`)

- `162a759` — templates seguros por stack, `/novo-projeto` atualizado, skill `/security-init` nova, gate de segurança no QA
- `3d5daf7` — lembretes recorrentes de segurança no dashboard (item 5)

Merge em `main`: `8eeae7d`.

---

## 2. Estado antes → depois

| Métrica | Antes (Fase 0) | Depois |
|---|---|---|
| Projetos com header de segurança configurado | 0 | **4** (dashboard, Ribas, starter-tipo-a, starter-tipo-b) |
| Dependências pinadas em versão exata | 0% (100% em `^`/`~`) | **64 dependências, 4 projetos, 0 soltas** |
| Projetos com `.npmrc`/`ignore-scripts` | 0 | **4** + raiz do MazyOS |
| CDN de terceiro sem self-host em produção | 1 achado 🟠 Alto (duPolvoNovo: GSAP, ScrollTrigger, Lucide) | **0** — 3 libs vendorizadas, + 2 páginas secundárias corrigidas |
| Checkout público com proteção anti-spam | 0 | **1** (Ribas — honeypot + delay mínimo) |
| Server Actions do Cofre validando input com Zod | 0 de 5 | **5 de 5** |
| Bug `cliente_user_id` (RLS nunca aplicável) | presente | **corrigido** (não verificado end-to-end — ver Riscos residuais) |
| Testes formais de impersonação RLS | 0 | **1 arquivo** (`security/rls-tests.sql`), dashboard verificado ao vivo, Ribas escrito |
| Resultado dos testes RLS do dashboard (contra projeto real) | — | **8/8 casos de teste + 2/2 verificações de limpeza — 10/10 checks, zero achado crítico, zero linha residual** |
| `.claude/settings.json` raiz — deny rules | 0 | **8** (`.env*` × 6, `git push --force`/`-f` × 2) |
| `.claude/settings.json` raiz — allowlist estruturada | 1 entrada pontual | **25 entradas** |
| Hook `PreToolUse` bloqueando ações perigosas | nenhum | **1** (`.env` read, `rm -rf` catastrófico, `curl\|sh`, `psql` remoto → deny; `git push --force` → ask) |
| Bateria de teste do hook | — | **38/38** (17 casos perigosos bloqueados, 3 de force-push pedem confirmação, 17 comandos reais do dia a dia passam livre, incluindo a regressão do falso-positivo de heredoc encontrado ao vivo) |
| Templates com postura de segurança herdada automaticamente | 0 | **2** (starter-tipo-a, starter-tipo-b) |
| Skill de hardening pra projeto existente | não existia | **`/security-init`** |
| Gate de segurança no pipeline de QA obrigatório | não existia | **item 0, bloqueante**, antes do Lighthouse |
| Lembretes de rotina de segurança visíveis no dia a dia | só em markdown (`ACOES-MANUAIS.md`) | **dashboard MazyOS** (projeto "Segurança", visível aos 4 sócios) |

---

## 3. `ACOES-MANUAIS.md` — fonte viva de pendências

[`ACOES-MANUAIS.md`](./ACOES-MANUAIS.md) está atualizado e é a referência única pra tudo que ainda depende de uma ação manual sua ou de um recurso externo que não existe ainda. Resumo do que está lá agora:

- **Prioridade alta:** rotação preventiva das service role keys (dashboard + Ribas); criação do projeto Supabase do Ribas — com o checklist ordenado do que rodar assim que ele existir (aplicar migration → `security/rls-tests.sql` seção Ribas → confirmar o fix do `cliente_user_id` → rate limit via tabela/trigger → configuração de painel).
- **Rotina recorrente:** migrada pro dashboard MazyOS (projeto "Segurança" em Tarefas) — o markdown fica só como referência rápida, a fonte de verdade agora é o dashboard.
- **Pendência separada:** CDN sem SRI em `projeto/curriculo_digital` (repositório git próprio, fora de escopo até a decisão de organização do `CLAUDE.md` raiz ser tomada).

---

## 4. Riscos residuais conhecidos

Nada crítico foi deixado sem tratamento, mas alguns itens ficaram deliberadamente incompletos — cada um com o motivo explícito:

1. **CSP nativo do Astro não ativado** (`starter-tipo-a`) — avaliado e descartado: a documentação oficial do Astro declara `security.csp` incompatível com `<ClientRouter />`/View Transitions, que já é decisão arquitetural em uso no starter (nível 2 da hierarquia de animação do `projeto/CLAUDE.md`). Registrado em `templates/starter-tipo-a/.claude/decisions.md` como investigação futura, não como pendência ativa da Fase 2.

2. **RLS do Ribas Suplementos escrito, não verificado** — `security/rls-tests.sql` (seção Ribas, 3 casos) foi escrito com base na migration existente, mas nunca rodou de verdade: o projeto Supabase do Ribas não existe/não está linkado, e não há Docker nesta máquina pra simular localmente. Mesma razão pela qual o fix do bug `cliente_user_id` não foi verificado end-to-end (só `lint`/`build`). Checklist de execução completo em `ACOES-MANUAIS.md`.

3. **Rate limit do checkout do Ribas é só honeypot + delay mínimo** — mitiga bot simples, não cobre IP rotativo/ataque direcionado. A opção mais robusta (tabela + trigger no Supabase) está registrada como próximo passo assim que o projeto Supabase do Ribas existir — não implementada agora porque dependia de uma premissa errada (achou-se que a infra já existia; corrigido em conversa com o usuário antes de prosseguir).

4. **CVEs moderadas do `postcss` vendorizado no Next 16.2.10** (dashboard, Ribas) — sem fix limpo disponível (`npm audit fix --force` forçaria downgrade inaceitável do Next). Decisão pendente já documentada em `_memoria/licoes-tecnicas.md`, fora do escopo desta auditoria resolver.

5. **CDN sem SRI em `curriculo_digital`** — mesmo achado do duPolvoNovo, não corrigido porque é repositório git próprio com status de organização dentro do MazyOS ainda em aberto. Ver `ACOES-MANUAIS.md`.

6. **Hook `bloquear-acoes-perigosas.js` é heurística por regex, não um parser de shell real** — cobre os padrões conhecidos (testado 38/38, incluindo o falso-positivo de heredoc encontrado e corrigido ao vivo durante a Fase 4), mas não é uma sandbox: um comando ofuscado o suficiente pode escapar da detecção. É camada adicional de defesa, não substitui o julgamento em cada ação.

7. **Itens de painel do Supabase pendentes nos dois projetos** — senha mínima, leaked password protection, confirmação de e-mail obrigatória, rate limit de auth, introspecção de schema, CORS — são configuração de painel web, fora do alcance de qualquer ferramenta usada nesta auditoria. Listados em `ACOES-MANUAIS.md`.

---

## 5. O que muda daqui pra frente

**Projeto novo, via `/novo-projeto`:** já nasce com o baseline de segurança sem nenhuma ação extra — deps pinadas em versão exata, `.npmrc` com `ignore-scripts=true`, headers de segurança (`netlify.toml` no Tipo A, `next.config.ts` no Tipo B), e `zod` já instalado no Tipo B com a convenção de validação documentada no README do starter. O resumo do Passo 5 do skill agora lista isso explicitamente — deixou de ser algo implícito que dependia de alguém lembrar depois.

**Projeto que entrar por fora** (legado, importado, ou criado antes desta auditoria) — `/security-init` aplica o mesmo hardening sob demanda: detecta a stack, pina dependências, adiciona `.npmrc` e headers, gera o esqueleto de `security/rls-tests.sql` se detectar Supabase, confirma `.env*` no `.gitignore`. Nunca instala dependência nova nem toca Supabase sozinho — isso sempre vira pendência manual no relatório final que o comando gera, mesmo formato deste documento aqui, só que por projeto.

**No dia a dia:** o gate de segurança no pipeline de QA (item 0, bloqueante) impede que uma entrega nova saia sem headers confirmados na resposta real, sem `deps:audit` limpo, sem checar CDN de terceiro. O hook `PreToolUse` intercepta tentativa de ler `.env`, `rm -rf` catastrófico, `curl|sh` e `psql` remoto em qualquer sessão de Claude Code neste repositório, e a rotina recorrente de segurança agora aparece no dashboard que os 4 sócios já usam, não só num markdown que só quem abre o repo vê.
