# Dashboard interno — Supabase

Projeto Supabase remoto: **duPolvo - dashbord** (ref `nexflcqiwfovdvhfevyc`).

## CLI

- Supabase CLI é dev dependency local (`npx supabase ...`), não instalação global.
- Login já feito via token pessoal (fica no config global da CLI, fora do projeto). Se expirar, gerar novo token em https://supabase.com/dashboard/account/tokens e rodar `npx supabase login --token <token> --name <nome>` (o usuário roda isso via `!`, precisa de TTY — não funciona via Bash/PowerShell tool direto).
- Projeto já linkado (`npx supabase link --project-ref nexflcqiwfovdvhfevyc`).

## Migrations — regra de automação

Sempre que uma nova migration for criada em `supabase/migrations/`, aplicar automaticamente com `npx supabase db push` sem pedir confirmação antes.

**Depois** de aplicar (nunca antes), avisar o usuário: qual migration foi aplicada e o que ela mudou (resumo do SQL). Se der erro, avisar o erro em vez de tentar contornar sozinho.

Antes de rodar push numa migration nova, rodar `npx supabase migration list` pra conferir que o histórico local/remoto está consistente (evita reaplicar algo já rodado manualmente).
