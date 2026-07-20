# Ações manuais — só você pode fazer

Gerado pela FASE 0 da auditoria de segurança (2026-07-20). Nenhum destes itens foi executado automaticamente — são todos passos em painéis, DNS/hosting, ou decisões suas.

## Prioridade alta

- [ ] **Rotacionar a service role key do Supabase** de `projeto/dashboard` e de `projeto/Ribas Suplementos` — por precaução de higiene (não porque vazaram; estão corretamente protegidas hoje, mas nunca foram rotacionadas). Painel: Supabase → Settings → API Keys → Secret keys.
- [ ] **Ribas Suplementos: criar o projeto Supabase** (ainda não existe/linkado) — sem isso, o RLS descrito nas migrations não está aplicado em lugar nenhum. Seguir `_memoria/checklist-novo-projeto-supabase.md`.

## Prioridade média (configuração de painel Supabase, quando o projeto existir/estiver ativo)

- [ ] Senha mínima 12 caracteres (Settings → Authentication → Policies)
- [ ] Ativar "Leaked password protection" (HaveIBeenPwned) — mesmo menu
- [ ] Confirmação de e-mail obrigatória no signup
- [ ] Configurar rate limits de auth (login, signup, reset de senha)
- [ ] Desabilitar introspecção de schema do PostgREST em produção (se exposto publicamente)
- [ ] Revisar CORS do projeto Supabase (Settings → API) — restringir aos domínios reais de produção

## Rotina recorrente (a criar no dashboard MazyOS ou lembrete seu)

- [ ] Rotação de chaves Supabase/GitHub a cada 90 dias, ou imediatamente se houver suspeita de exposição
- [ ] Revisão mensal de dependências via `/deps-review` (será criado na Fase 1.2)
- [ ] Re-teste de RLS a cada mudança de schema (rodar `security/rls-tests.sql`, a criar na Fase 3.3)
- [ ] Verificação mensal de novas CVEs dos frameworks em uso (Next.js, Astro)

## Observação — sem achado crítico de segredo

A varredura completa do repositório (arquivos, configs e histórico git inteiro) não encontrou nenhum segredo commitado ou exposto fora do `.gitignore`. Os únicos valores sensíveis reais (`SUPABASE_SERVICE_ROLE_KEY` em dois `.env.local`) estão corretamente protegidos hoje. A rotação acima é recomendação preventiva, não resposta a um incidente.
