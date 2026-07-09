@AGENTS.md

# Ribas Suplementos — loja (Next.js + Supabase)

Tipo B: loja de suplementos (whey, creatina, pré-treino) com catálogo, carrinho e checkout. Stack e regras técnicas gerais em `projeto/claude.md`; briefing do cliente em `clientes/Ribas Suplementos/briefing.md`.

## Supabase

Projeto Supabase **ainda não criado/linkado**. Seguir `_memoria/checklist-novo-projeto-supabase.md` antes de qualquer migration. Depois de linkar, aplicar automaticamente `supabase/migrations/20260709042944_schema_inicial.sql` com `npx supabase db push` e avisar o que mudou.

Migrations novas: mesma regra do checklist — aplicar automático, avisar depois (nunca antes), rodar `npx supabase migration list` antes de um push pra conferir consistência.

## Carrinho

Client-side (localStorage via `src/lib/cart/cart-context.tsx`), não é tabela no banco. Só vira registro em `pedidos`/`pedido_itens` no momento do checkout. Ver `.claude/decisions.md`.

## Checkout

Sem gateway de pagamento integrado ainda — o pedido é criado com status `aguardando_pagamento` e o cliente é avisado que o pagamento será confirmado manualmente. Decisão do gateway (Mercado Pago, Stripe, Pagar.me etc.) depende do cliente e ainda não foi tomada.

## Auth

Loja é pública por padrão — só `/conta` exige login (guest checkout funciona sem conta). Ver `src/lib/supabase/proxy.ts`.
