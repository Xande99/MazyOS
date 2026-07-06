-- Estoque/Financeiro — fase 4b: orçamentos → ordens de venda/compra →
-- faturas. Cada tabela de item guarda uma "foto" do produto (nome e
-- preço no momento em que foi adicionado) — editar o produto depois
-- não deve mudar orçamento/ordem já fechados.

-- Função genérica: recalcula o total do "pedido" pai somando os
-- subtotais da tabela de itens que disparou o trigger. Os dois
-- argumentos do trigger dizem qual tabela/coluna é o pai.
create function public.recalcular_total_pedido()
returns trigger
language plpgsql
as $$
declare
  parent_table text := TG_ARGV[0];
  parent_id_col text := TG_ARGV[1];
  row_data jsonb := case when TG_OP = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  target_id uuid := (row_data ->> parent_id_col)::uuid;
begin
  execute format(
    'update public.%I set total = coalesce((select sum(subtotal) from public.%I where %I = $1), 0) where id = $1',
    parent_table, TG_TABLE_NAME, parent_id_col
  ) using target_id;
  return null;
end;
$$;

-- ===== Orçamentos =====

create type public.orcamento_status as enum ('rascunho', 'enviado', 'aprovado', 'recusado');

create table public.orcamentos (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.contacts (id) on delete set null,
  status public.orcamento_status not null default 'rascunho',
  validade date,
  total numeric(12, 2) not null default 0,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orcamentos enable row level security;

create policy "orcamentos_all_authenticated"
  on public.orcamentos for all to authenticated using (true) with check (true);

create trigger orcamentos_set_updated_at
  before update on public.orcamentos
  for each row execute procedure public.set_updated_at();

create table public.orcamento_itens (
  id uuid primary key default gen_random_uuid(),
  orcamento_id uuid not null references public.orcamentos (id) on delete cascade,
  produto_id uuid references public.produtos (id) on delete set null,
  nome_produto text not null,
  preco_unitario numeric(12, 2) not null,
  quantidade numeric(12, 2) not null default 1,
  subtotal numeric(12, 2) generated always as (quantidade * preco_unitario) stored
);

alter table public.orcamento_itens enable row level security;

create policy "orcamento_itens_all_authenticated"
  on public.orcamento_itens for all to authenticated using (true) with check (true);

create trigger orcamento_itens_recalc
  after insert or update or delete on public.orcamento_itens
  for each row execute procedure public.recalcular_total_pedido('orcamentos', 'orcamento_id');

-- ===== Ordens de venda =====

create type public.ordem_venda_status as enum ('aberta', 'concluida', 'cancelada');

create table public.ordens_venda (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.contacts (id) on delete set null,
  orcamento_id uuid references public.orcamentos (id) on delete set null,
  status public.ordem_venda_status not null default 'aberta',
  total numeric(12, 2) not null default 0,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ordens_venda enable row level security;

create policy "ordens_venda_all_authenticated"
  on public.ordens_venda for all to authenticated using (true) with check (true);

create trigger ordens_venda_set_updated_at
  before update on public.ordens_venda
  for each row execute procedure public.set_updated_at();

create table public.ordens_venda_itens (
  id uuid primary key default gen_random_uuid(),
  ordem_id uuid not null references public.ordens_venda (id) on delete cascade,
  produto_id uuid references public.produtos (id) on delete set null,
  nome_produto text not null,
  preco_unitario numeric(12, 2) not null,
  quantidade numeric(12, 2) not null default 1,
  subtotal numeric(12, 2) generated always as (quantidade * preco_unitario) stored
);

alter table public.ordens_venda_itens enable row level security;

create policy "ordens_venda_itens_all_authenticated"
  on public.ordens_venda_itens for all to authenticated using (true) with check (true);

create trigger ordens_venda_itens_recalc
  after insert or update or delete on public.ordens_venda_itens
  for each row execute procedure public.recalcular_total_pedido('ordens_venda', 'ordem_id');

-- ===== Ordens de compra =====

create type public.ordem_compra_status as enum ('aberta', 'recebida', 'cancelada');

create table public.ordens_compra (
  id uuid primary key default gen_random_uuid(),
  fornecedor_id uuid references public.fornecedores (id) on delete set null,
  status public.ordem_compra_status not null default 'aberta',
  total numeric(12, 2) not null default 0,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ordens_compra enable row level security;

create policy "ordens_compra_all_authenticated"
  on public.ordens_compra for all to authenticated using (true) with check (true);

create trigger ordens_compra_set_updated_at
  before update on public.ordens_compra
  for each row execute procedure public.set_updated_at();

create table public.ordens_compra_itens (
  id uuid primary key default gen_random_uuid(),
  ordem_id uuid not null references public.ordens_compra (id) on delete cascade,
  produto_id uuid references public.produtos (id) on delete set null,
  nome_produto text not null,
  preco_unitario numeric(12, 2) not null,
  quantidade numeric(12, 2) not null default 1,
  subtotal numeric(12, 2) generated always as (quantidade * preco_unitario) stored
);

alter table public.ordens_compra_itens enable row level security;

create policy "ordens_compra_itens_all_authenticated"
  on public.ordens_compra_itens for all to authenticated using (true) with check (true);

create trigger ordens_compra_itens_recalc
  after insert or update or delete on public.ordens_compra_itens
  for each row execute procedure public.recalcular_total_pedido('ordens_compra', 'ordem_id');

-- ===== Faturas =====
-- "Atrasado" não é um status guardado — é calculado na UI comparando
-- pendente + vencimento no passado. Evita precisar de job agendado
-- só pra manter esse campo em dia.

create type public.fatura_status as enum ('pendente', 'pago');

create table public.faturas (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.contacts (id) on delete set null,
  ordem_venda_id uuid references public.ordens_venda (id) on delete set null,
  valor numeric(12, 2) not null,
  vencimento date not null,
  status public.fatura_status not null default 'pendente',
  pago_em timestamptz,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.faturas enable row level security;

create policy "faturas_all_authenticated"
  on public.faturas for all to authenticated using (true) with check (true);

create trigger faturas_set_updated_at
  before update on public.faturas
  for each row execute procedure public.set_updated_at();

alter publication supabase_realtime add table public.orcamentos;
alter publication supabase_realtime add table public.orcamento_itens;
alter publication supabase_realtime add table public.ordens_venda;
alter publication supabase_realtime add table public.ordens_venda_itens;
alter publication supabase_realtime add table public.ordens_compra;
alter publication supabase_realtime add table public.ordens_compra_itens;
alter publication supabase_realtime add table public.faturas;
