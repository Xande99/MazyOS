-- Schema inicial da loja: categorias, produtos, variantes e pedidos.
-- Carrinho não vira tabela: fica em localStorage no client e só é
-- persistido no banco no momento do checkout (ver .claude/decisions.md).

create table categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  criado_em timestamptz not null default now()
);

create table produtos (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid references categorias(id) on delete set null,
  nome text not null,
  slug text not null unique,
  descricao text,
  preco_centavos integer not null check (preco_centavos >= 0),
  imagem_url text,
  estoque integer not null default 0 check (estoque >= 0),
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create index produtos_categoria_id_idx on produtos(categoria_id);

create table produto_variantes (
  id uuid primary key default gen_random_uuid(),
  produto_id uuid not null references produtos(id) on delete cascade,
  nome text not null, -- ex: "1kg — Chocolate"
  sku text unique,
  preco_centavos integer check (preco_centavos >= 0), -- null = usa o preço do produto
  estoque integer not null default 0 check (estoque >= 0),
  criado_em timestamptz not null default now()
);

create index produto_variantes_produto_id_idx on produto_variantes(produto_id);

create table pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente_user_id uuid references auth.users(id) on delete set null, -- null = checkout como convidado
  nome_cliente text not null,
  email_cliente text not null,
  telefone_cliente text not null,
  endereco jsonb not null, -- { rua, numero, complemento, bairro, cidade, uf, cep }
  status text not null default 'aguardando_pagamento'
    check (status in ('aguardando_pagamento', 'pago', 'enviado', 'entregue', 'cancelado')),
  total_centavos integer not null check (total_centavos >= 0),
  criado_em timestamptz not null default now()
);

create index pedidos_cliente_user_id_idx on pedidos(cliente_user_id);

create table pedido_itens (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  produto_id uuid references produtos(id) on delete set null,
  variante_id uuid references produto_variantes(id) on delete set null,
  nome_produto text not null, -- snapshot do nome no momento da compra
  quantidade integer not null check (quantidade > 0),
  preco_unitario_centavos integer not null check (preco_unitario_centavos >= 0)
);

create index pedido_itens_pedido_id_idx on pedido_itens(pedido_id);

-- RLS: sem exceção, em toda tabela.
alter table categorias enable row level security;
alter table produtos enable row level security;
alter table produto_variantes enable row level security;
alter table pedidos enable row level security;
alter table pedido_itens enable row level security;

-- Catálogo é público em leitura. Escrita fica só para o role postgres
-- (Supabase Studio/service role), sem policy de insert/update/delete
-- para anon/authenticated — negado por padrão.
create policy "categorias: leitura pública"
  on categorias for select
  to anon, authenticated
  using (true);

create policy "produtos: leitura pública de produtos ativos"
  on produtos for select
  to anon, authenticated
  using (ativo = true);

create policy "produto_variantes: leitura pública"
  on produto_variantes for select
  to anon, authenticated
  using (
    exists (
      select 1 from produtos
      where produtos.id = produto_variantes.produto_id
      and produtos.ativo = true
    )
  );

-- Pedidos: qualquer um (inclusive convidado) pode criar. Leitura só do
-- próprio dono quando autenticado — pedido de convidado não tem "meus
-- pedidos" nesta primeira versão (ver .claude/decisions.md).
create policy "pedidos: criação pública (checkout convidado)"
  on pedidos for insert
  to anon, authenticated
  with check (true);

create policy "pedidos: dono vê os próprios"
  on pedidos for select
  to authenticated
  using (cliente_user_id = auth.uid());

create policy "pedido_itens: criação pública (checkout convidado)"
  on pedido_itens for insert
  to anon, authenticated
  with check (true);

create policy "pedido_itens: dono vê os itens dos próprios pedidos"
  on pedido_itens for select
  to authenticated
  using (
    exists (
      select 1 from pedidos
      where pedidos.id = pedido_itens.pedido_id
      and pedidos.cliente_user_id = auth.uid()
    )
  );
