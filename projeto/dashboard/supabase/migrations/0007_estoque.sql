-- Estoque/Financeiro — fase 4a: fornecedores, produtos e livros de preço.
-- 4b (orçamentos, ordens, faturas) vem numa migration separada depois.

create table public.fornecedores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text,
  email text,
  endereco text,
  notas text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.fornecedores enable row level security;

create policy "fornecedores_all_authenticated"
  on public.fornecedores for all
  to authenticated
  using (true)
  with check (true);

create trigger fornecedores_set_updated_at
  before update on public.fornecedores
  for each row execute procedure public.set_updated_at();

create table public.produtos (
  id uuid primary key default gen_random_uuid(),
  sku text,
  nome text not null,
  descricao text,
  unidade text not null default 'un',
  preco_custo numeric(12, 2) not null default 0,
  preco_venda numeric(12, 2) not null default 0,
  estoque numeric(12, 2) not null default 0,
  fornecedor_id uuid references public.fornecedores (id) on delete set null,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index produtos_fornecedor_id_idx on public.produtos (fornecedor_id);

alter table public.produtos enable row level security;

create policy "produtos_all_authenticated"
  on public.produtos for all
  to authenticated
  using (true)
  with check (true);

create trigger produtos_set_updated_at
  before update on public.produtos
  for each row execute procedure public.set_updated_at();

create table public.livros_precos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  valido_de date,
  valido_ate date,
  created_at timestamptz not null default now()
);

alter table public.livros_precos enable row level security;

create policy "livros_precos_all_authenticated"
  on public.livros_precos for all
  to authenticated
  using (true)
  with check (true);

create table public.livro_preco_itens (
  id uuid primary key default gen_random_uuid(),
  livro_preco_id uuid not null references public.livros_precos (id) on delete cascade,
  produto_id uuid not null references public.produtos (id) on delete cascade,
  preco numeric(12, 2) not null,
  unique (livro_preco_id, produto_id)
);

create index livro_preco_itens_livro_id_idx on public.livro_preco_itens (livro_preco_id);

alter table public.livro_preco_itens enable row level security;

create policy "livro_preco_itens_all_authenticated"
  on public.livro_preco_itens for all
  to authenticated
  using (true)
  with check (true);

alter publication supabase_realtime add table public.fornecedores;
alter publication supabase_realtime add table public.produtos;
alter publication supabase_realtime add table public.livros_precos;
alter publication supabase_realtime add table public.livro_preco_itens;
