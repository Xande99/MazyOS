# Ações manuais — só você pode fazer

Gerado pela FASE 0 da auditoria de segurança (2026-07-20). Nenhum destes itens foi executado automaticamente — são todos passos em painéis, DNS/hosting, ou decisões suas.

## Prioridade alta

- [ ] **Rotacionar a service role key do Supabase** de `projeto/dashboard` e de `projeto/Ribas Suplementos` — por precaução de higiene (não porque vazaram; estão corretamente protegidas hoje, mas nunca foram rotacionadas). Painel: Supabase → Settings → API Keys → Secret keys.
- [ ] **Ribas Suplementos: criar o projeto Supabase** (ainda não existe/linkado) — sem isso, o RLS descrito nas migrations não está aplicado em lugar nenhum, e uma série de itens abaixo fica bloqueada. Seguir `_memoria/checklist-novo-projeto-supabase.md`.

  **Tudo que está pendente de verificação só por causa disso — rodar nesta ordem assim que o projeto existir:**

  1. [ ] Aplicar a migration existente (`supabase/migrations/20260709042944_schema_inicial.sql`) via `npx supabase db push` (checklist da CLI já cobre isso).
  2. [ ] Rodar a seção **"RIBAS SUPLEMENTOS"** de `security/rls-tests.sql` (Casos 1–3) — escrita em 2026-07-20 com base só na migration, nunca executada de verdade (sem projeto, sem Docker nesta máquina). Confirma: anon consegue inserir pedido de convidado (esperado); anon/outro autenticado não enxerga pedido de terceiro; dono autenticado enxerga só os próprios.
  3. [ ] Especificamente dentro do Caso 3 acima: confirmar que o **fix do `cliente_user_id`** (`checkout/actions.ts`, 2026-07-20 — antes o insert nunca preenchia essa coluna, nem pra cliente logado) realmente faz o pedido aparecer em `/conta`. `lint`/`build` já passam, mas isso nunca foi testado contra um banco de verdade.
  4. [ ] Criar tabela + trigger de rate limit pro checkout público (`criarPedido`) — registra tentativas por IP/e-mail, rejeita acima de N pedidos em X minutos. Mitiga bot com IP rotativo, o que o honeypot+delay (Fase 2.3, já em produção) não cobre — camada adicional, não substitui o que já existe.
  5. [ ] Configuração de painel: senha mínima 12 caracteres (Settings → Authentication → Policies), ativar "Leaked password protection" (HaveIBeenPwned, mesmo menu), confirmação de e-mail obrigatória no signup, rate limits de auth (login/signup/reset), desabilitar introspecção de schema do PostgREST em produção, revisar CORS (Settings → API) restringindo aos domínios reais.

## Rotina recorrente

Movido pro dashboard MazyOS em 2026-07-21 (Fase 5, item 5 — "Herança Automática") — projeto **"Segurança"** em Tarefas, visível pros 4 sócios, 4 itens com descrição curta explicando o porquê de cada um. **Sem recorrência automática**: `todo_items` é checklist simples, sem motor de repetição — quando alguém marcar como feito, fica marcado, ninguém reabre sozinho no próximo ciclo. Reabrir/recriar quando vencer o intervalo é manual. Lista aqui só pra referência rápida (a fonte de verdade agora é o dashboard, não este arquivo):

- [ ] Rotação de chaves Supabase/GitHub a cada 90 dias, ou imediatamente se houver suspeita de exposição
- [ ] Revisão mensal de dependências via `/deps-review`
- [ ] Re-teste de RLS a cada mudança de schema (rodar `security/rls-tests.sql` — dashboard já verificado em 2026-07-20, Ribas ainda pendente do provisionamento, ver checklist acima)
- [ ] Verificação mensal de novas CVEs dos frameworks em uso (Next.js, Astro)

## Pendência separada — fora do escopo desta frente

- [ ] **`projeto/curriculo_digital/index.html` carrega CDN de terceiro sem SRI** (mesmo achado 🟠 Alto do `duPolvoNovo`, corrigido na Fase 2.2) — não tratado junto porque é um repositório git próprio, com status de organização dentro do MazyOS ainda pendente (ver `CLAUDE.md` raiz, seção "Pendências conhecidas"). Resolver quando essa decisão de organização for tomada, ou separadamente se o repo for tratado como projeto ativo antes disso.

## Observação — sem achado crítico de segredo

A varredura completa do repositório (arquivos, configs e histórico git inteiro) não encontrou nenhum segredo commitado ou exposto fora do `.gitignore`. Os únicos valores sensíveis reais (`SUPABASE_SERVICE_ROLE_KEY` em dois `.env.local`) estão corretamente protegidos hoje. A rotação acima é recomendação preventiva, não resposta a um incidente.
