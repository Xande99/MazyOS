## [2026-07-09] Carrinho em localStorage, não em tabela do banco

**Decisão:** Carrinho vive só no client (`src/lib/cart/cart-context.tsx`, `localStorage`). Não existe tabela `carrinho_itens`.
**Motivo:** Carrinho é estado efêmero e não precisa sobreviver entre dispositivos nesta primeira versão — criar tabela + RLS + sincronização pra isso é complexidade sem necessidade comprovada ainda.
**Alternativas descartadas:** Tabela `carrinho_itens` com `session_id`/`user_id` — mais "correta" pra carrinho persistente entre dispositivos, mas overengineering pro MVP.
**Impacto:** Se pedirem carrinho persistente (ex.: cliente loga no celular e quer ver o carrinho do desktop), essa decisão precisa ser revisada.

## [2026-07-09] Checkout aceita convidado, sem exigir login

**Decisão:** `pedidos.cliente_user_id` é nullable; checkout funciona sem conta. Proxy (`src/lib/supabase/proxy.ts`) só protege `/conta`, não `/checkout`.
**Motivo:** Login obrigatório no checkout é fricção de conversão clássica em e-commerce (CRO) — a maioria das lojas pequenas perde venda por isso.
**Alternativas descartadas:** Forçar cadastro antes de comprar — rejeitado por impacto direto na taxa de conversão.
**Impacto:** Pedido de convidado não aparece em nenhum "meus pedidos" (não tem `user_id` pra vincular). Se precisar rastrear pedido de convidado, futuro: e-mail com link/token único por pedido.

## [2026-07-09] Preço e nome do produto sempre recalculados no servidor no checkout

**Decisão:** A Server Action `criarPedido` (`src/app/checkout/actions.ts`) busca produto/variante no banco pelo id e usa o preço e nome de lá — nunca confia no `precoCentavos`/`nome` que vêm do client (localStorage pode ser editado no devtools).
**Motivo:** OWASP — nunca confiar em dado de preço vindo do client. Impede alguém alterar o preço no localStorage e fechar pedido mais barato.
**Alternativas descartadas:** Confiar no total calculado no client e só validar formato — rejeitado por ser a vulnerabilidade mais óbvia de qualquer checkout.
**Impacto:** Toda mudança de preço de produto reflete automaticamente no próximo checkout, sem cache client desatualizado enganando ninguém.

## [2026-07-09] Sem gateway de pagamento integrado ainda

**Decisão:** Checkout cria o pedido com status `aguardando_pagamento` e não processa pagamento algum. Confirmação de pagamento é manual por enquanto.
**Motivo:** Briefing não especificou gateway. Integrar payment (Mercado Pago, Stripe, Pagar.me) exige decisão do cliente (taxas, PIX vs. cartão, split) antes de implementar — não dá pra chutar.
**Alternativas descartadas:** Nenhuma — não há gateway padrão óbvio o suficiente pra decidir sem o cliente.
**Impacto:** Rota `/api/webhooks/pagamento` (ou equivalente) e atualização de `pedidos.status` via `service.ts` (service role) ficam para quando o gateway for escolhido.

## [2026-07-09] Sem tabela/UI de admin — catálogo gerenciado via Supabase Studio

**Decisão:** Não existe painel de admin pra CRUD de produtos/categorias. Cadastro é direto na tabela via Supabase Studio (que usa o role `postgres`, ignora RLS).
**Motivo:** Prioridade de simplicidade — o briefing pede loja, não painel administrativo. RLS já bloqueia insert/update/delete de `anon`/`authenticated` nas tabelas de catálogo por padrão (nenhuma policy de escrita foi criada).
**Alternativas descartadas:** Tela de admin dentro do próprio Next.js — adiada até haver pedido explícito, pra não construir abstração sem uso confirmado.
**Impacto:** Se o cliente quiser editar produtos sem entrar no Supabase Studio, isso vira uma entrega nova (painel de admin), não parte do escopo atual.
