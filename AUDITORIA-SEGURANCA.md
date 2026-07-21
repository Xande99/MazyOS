# Auditoria de Segurança — MazyOS (FASE 0)

Data: 2026-07-20
Escopo: MazyOS raiz, `_memoria/`, `.claude/`, `projeto/dashboard`, `projeto/Ribas Suplementos`, `projeto/duPolvoNovo`, `projeto/curriculo_digital`, `templates/starter-tipo-a`, `templates/starter-tipo-b`.

Nenhum valor de segredo foi impresso, copiado ou movido durante esta auditoria — apenas caminhos e nomes de variável, conforme regra combinada.

---

## Resumo executivo

Nenhum segredo real exposto (fora do `.gitignore` ou commitado no histórico). Nenhuma versão de framework vulnerável a CVE conhecida. O maior risco concreto encontrado é o **site institucional em produção carregando GSAP e Lucide via CDN público sem SRI**. O resto dos achados é ausência de camadas de defesa (headers, supply-chain pinning, RLS tests formais) que hoje não causam incidente mas não têm rede de proteção — exatamente o que as fases 1–5 propostas endereçam.

---

## Achados por severidade

### 🔴 Crítico
Nenhum.

### 🟠 Alto

1. **CDN de terceiro sem SRI em produção** — `projeto/duPolvoNovo/duPolvo/index.html` carrega:
   ```
   unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js
   unpkg.com/gsap@3.15.0/dist/gsap.min.js
   unpkg.com/gsap@3.15.0/dist/ScrollTrigger.min.js
   ```
   Sem `integrity`/`crossorigin`. Se o unpkg for comprometido ou a versão for alterada, código arbitrário roda no site institucional público. Também presente (menor prioridade, não é a página pública) em `guidelines/brand-logo.html` e `sections/preview.html`, e em `curriculo_digital/index.html` (repo separado).
   → Endereçado na Fase 2.2 (self-host).

2. **`projeto/dashboard/.env.local` e `projeto/Ribas Suplementos/.env.local` contêm a service role key do Supabase** — protegidos corretamente hoje (untracked, cobertos por `.gitignore`, nunca apareceram no histórico do git), mas por precaução de higiene, recomendo rotação preventiva (ação manual sua, listada em `ACOES-MANUAIS.md`). Não é uma falha de configuração — é o estado esperado — mas toda credencial que já existiu em disco por tempo suficiente vale rotacionar como prática.

### 🟡 Médio

1. **Nenhum projeto tem `.npmrc`/`ignore-scripts`** — supply chain aberta a scripts de instalação arbitrários de qualquer dependência transitiva. Vale para dashboard, Ribas, e os dois templates starter.
2. **100% das dependências em ranges soltos (`^`)** — nenhum projeto pina versão exata. Facilita supply-chain attack via minor/patch malicioso.
3. **Nenhum header de segurança configurado em nenhum projeto** — confirmado: sem `headers()` no `next.config.ts` (dashboard, Ribas), sem CSP no `astro.config.mjs` do starter-tipo-a (Astro 7.0.9 já suporta CSP nativo, não usado), sem `vercel.json`/`netlify.toml`/`_headers` em nenhum projeto.
4. **`postcss` vendorizado no Next (16.2.10) com 2 CVEs moderadas** (GHSA-qx2v-qp2m-jg93, XSS via `</style>` não escapado) em dashboard e Ribas — sem fix limpo disponível (`npm audit fix --force` forçaria downgrade do Next para 9.3.3, inaceitável). Já documentado como decisão pendente em `_memoria/licoes-tecnicas.md`.
5. **`cofre/actions.ts` (dashboard) não valida input com Zod** antes de repassar pro RPC do Supabase — única exceção encontrada à política de validação server-side. Risco baixo (só os 4 sócios autenticados chamam isso), mas quebra o padrão.
6. **`criarPedido` (Ribas Suplementos, `checkout/actions.ts:75-85`) nunca grava `cliente_user_id`** no insert de `pedidos` — bug funcional com efeito de segurança: a policy RLS "dono vê os próprios pedidos" nunca retorna nada em `/conta`, porque a coluna fica sempre `null`. Vale corrigir junto do hardening.
7. **`projeto/dashboard/.claude/settings.local.json` tem `TEST_EMAIL`/`TEST_PASSWORD` (senha de teste em texto puro) embutidos em strings de allowlist `Bash(...)`** — não é credencial de produção, mas está em texto plano num arquivo local. Recomendo mover para env var.
8. **Formulários públicos** (LP duPolvo e possíveis outros) não têm proteção anti-bot/rate limiting confirmada — a checar caso a caso na Fase 2.3.

### 🟢 Baixo / informativo

- Next.js 16.2.10 em todos os projetos Tipo B — **não vulnerável** a CVE-2025-29927 (bypass de middleware) nem ao lote de maio/2026 (corrigido em 15.5.18/16.2.6, ambos anteriores à versão em uso).
- Astro no `starter-tipo-a` já em **7.0.9** — à frente do alvo (Astro 6, CSP nativo). Nenhuma migração pendente, só ativar `csp: true` no config (Fase 2.1).
- `.claude/settings.json` raiz **não tem nenhuma regra de deny nem hook `PreToolUse`** — permissões hoje dependem inteiramente do prompt interativo padrão do Claude Code. `settings.local.json` tem allowlist ampla acumulada organicamente (`Bash(rm *)`, `Bash(git push *)`, `Bash(curl *)`, etc.) sem allowlist estruturada nem deny rules por cima. Base pra Fase 4.1.
- **Padrões de auth já corretos** no dashboard e Ribas: proxy (`proxy.ts`, renomeado de `middleware.ts` no Next 16) só renova sessão via `getUser()` (não `getSession()` — valida contra o servidor, não confia no cookie); Server Actions sensíveis fazem seu próprio check (`exigirUsuario()` no dashboard, `getUser()` + redirect em `Ribas Suplementos/conta/page.tsx`); `service.ts` com `import "server-only"` correto; nenhuma env `NEXT_PUBLIC_` carrega segredo.
- **RLS 100% coberto** nas 12 migrations do dashboard e nas 5 tabelas do Ribas — nenhuma tabela com RLS ligado e zero políticas. Dashboard usa modelo `using(true)` deliberado (painel interno de 4 sócios, sem hierarquia — documentado em `0001_profiles.sql:3`). Ribas usa `auth.uid()` corretamente em `pedidos`/`pedido_itens`.
- Cofre de acesso (dashboard) bem desenhado: segredo nunca sai do Supabase Vault, funções `security definer` com `revoke ... from public, anon, authenticated`, log de auditoria em toda revelação.
- Checkout do Ribas recalcula preço/nome do produto a partir do banco — não confia em valor vindo do client. Usa Zod (`checkoutSchema.safeParse`).
- Maioria das mutações do painel MazyOS (contatos, kanban, tarefas, notas, financeiro) roda **client-side** via hooks chamando `supabase.from()` direto com a anon key — segurança depende inteiramente das policies RLS `using(true)`. Consistente com o modelo de confiança do painel, mas significa que RLS é a única linha de defesa ali; qualquer policy futura mal escrita vira brecha imediata.
- Supabase do Ribas Suplementos **ainda não foi criado/linkado** — RLS descrito existe só como migration não aplicada.
- Nenhum `.env*` real jamais foi commitado no histórico git (nem no MazyOS, nem no repo separado `curriculo_digital`). Único `.env*` trackeado é `.env.example` (esperado).
- `dashboard/.env.example` não está trackeado no git (falta a exceção `!.env.example` que existe em Ribas e no starter-tipo-b) — inconsistência de organização, não risco.

---

## Plano das Fases 1–4 (adaptado aos achados)

**Fase 1 (Fundação)** — como proposto no prompt original, sem alteração de escopo. Prioridade extra: pinning + `.npmrc` nos 4 projetos com `package.json` (dashboard, Ribas, os dois starters).

**Fase 2 (Headers/CSP/CDN/Formulários)** — prioridade alta no item 2.2 (self-host GSAP/Lucide do duPolvoNovo, é o único achado alto de código). Astro CSP nativo já disponível, só ativar. Next.js precisa de `headers()` do zero (nenhum projeto tem hoje).

**Fase 3 (Supabase)** — escopo reduzido em relação ao previsto: RLS já está bem implementado nos dois projetos. Foco real: (a) escrever os testes formais de impersonação em `security/rls-tests.sql` pra documentar o que já existe e travar contra regressão, (b) adicionar Zod em `cofre/actions.ts`, (c) corrigir o bug de `cliente_user_id` no Ribas, (d) itens de painel do Supabase (senha mínima, leaked password protection, etc.) ficam em `ACOES-MANUAIS.md` — nenhum é aplicável ainda ao Ribas porque o projeto Supabase dele não existe.

**Fase 4 (Claude Code hardening)** — `.claude/settings.json` raiz está essencialmente vazio de regras de segurança; construir do zero (allowlist + deny rules + hook `PreToolUse`) sem quebrar a allowlist orgânica já acumulada em `settings.local.json`.

**Fase 5 (Herança automática)** — sem mudança de escopo. Nota: `templates/starter-tipo-b/proxy.ts` já vem com um bom padrão de auth (comentado, pronto pra ativar) — os templates seguros da Fase 5 devem reaproveitar esse arquivo como base, não recriar do zero.

---

## Nota sobre conteúdo de terceiros

Nenhuma instrução embutida em conteúdo externo foi encontrada durante esta auditoria. O harness sinalizou automaticamente um trecho do output de uma subagente (conteúdo de `settings.local.json`, que tem formato parecido com comando) como "instruction-shaped" — inspecionado manualmente, é só a allowlist local contendo strings `Bash(...)` de teste, sem nenhuma instrução direcionada a mim. Nada a reportar como tentativa de prompt injection.
