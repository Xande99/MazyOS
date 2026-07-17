# Painel duPolvo

Painel interno da duPolvo Studio — CRM, Kanban, tarefas, calendário, notas, estoque/financeiro (produtos, fornecedores, livro de preços, orçamentos, ordens de venda/compra, faturas) e cofre de acesso num lugar só, sincronizado em tempo real pros 4 sócios.

Plano completo de fases e arquitetura: `C:\Users\Xande\.claude\plans\clever-scribbling-newt.md`. Todas as 6 fases do plano original (0 a 5) estão implementadas e verificadas.

## Stack

Next.js (App Router) + TypeScript + Tailwind v4, Supabase (Postgres + Auth + Realtime + Vault), deploy na Vercel.

## Setup — Supabase

1. Criar um projeto em [supabase.com](https://supabase.com) (plano free serve pro início).
2. Em **Project Settings → API**, copiar a **Project URL**, a **anon public key** e a **service_role key**.
3. Copiar `.env.example` pra `.env.local` e preencher:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
   A `SUPABASE_SERVICE_ROLE_KEY` só é usada em Server Actions do Cofre de acesso — nunca aparece no client. Reiniciar o `npm run dev` depois de adicionar (Next.js só lê `.env.local` na subida).
4. Antes de rodar as migrations do Cofre, confirmar no dashboard do Supabase (**Database → Extensions**) que `supabase_vault` (pgsodium) está ativa.
5. Rodar as migrations, em ordem, no **SQL Editor**: os arquivos em `supabase/migrations/`, de `0001` até o mais recente.
   - Toda tabela nova termina com `alter publication supabase_realtime add table ...` (é o que liga a tabela ao hook `useRealtimeTable`).
6. Criar as 4 contas fixas em **Authentication → Users → Add user** (e-mail + senha). O trigger da migration `0001` já cria a linha correspondente em `profiles` sozinho — o nome de exibição vira o que estiver antes do `@` do e-mail até alguém editar.
7. Rodar `npm install` e `npm run dev`, acessar `http://localhost:3000` e logar com uma das 4 contas.

## Cofre de acesso — segurança

Os segredos são guardados via **Supabase Vault** (pgsodium), não com hash (irreversível) nem com uma chave própria em variável de ambiente. `vault_entries` só guarda a referência (`secret_id`) pro segredo cifrado — criar/editar/excluir/revelar passam exclusivamente por Server Actions (`src/app/(app)/cofre/actions.ts`) usando um client `service_role` (`src/lib/supabase/service.ts`). O client autenticado comum só consegue ler os metadados (rótulo, categoria, usuário, url) — nunca o segredo em si. Toda revelação grava em `vault_access_log` (quem, quando).

## Módulos

- **CRM** — clientes/parceiros/gráficas, tags, histórico de interação.
- **Kanban** — board com colunas editáveis, cards vinculados a contato, drag-and-drop.
- **Calendário** — visão mês/semana, eventos vinculáveis a contato.
- **Notas** — pastas, tags, busca.
- **Tarefas** — lista agrupável por projeto/responsável, reordenar por drag-and-drop.
- **Estoque/Financeiro** — Produtos, Fornecedores, Livro de Preços, Orçamentos (→ gera Ordem de Venda → gera Fatura), Ordens de Compra.
- **Cofre de acesso** — credenciais cifradas via Supabase Vault, com log de auditoria.
