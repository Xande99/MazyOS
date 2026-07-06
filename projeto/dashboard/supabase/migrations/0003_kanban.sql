-- Kanban: um board único "Projetos" pra começar (múltiplos boards fica
-- pra quando fizer falta), colunas fixas editáveis e cards vinculáveis
-- a um contato do CRM.

create type public.kanban_priority as enum ('baixa', 'media', 'alta');

create table public.kanban_boards (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  created_at timestamptz not null default now()
);

create table public.kanban_columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.kanban_boards (id) on delete cascade,
  nome text not null,
  posicao integer not null,
  created_at timestamptz not null default now()
);

create index kanban_columns_board_id_idx on public.kanban_columns (board_id, posicao);

create table public.kanban_cards (
  id uuid primary key default gen_random_uuid(),
  column_id uuid not null references public.kanban_columns (id) on delete cascade,
  titulo text not null,
  descricao text,
  responsavel_id uuid references public.profiles (id),
  prazo date,
  prioridade public.kanban_priority not null default 'media',
  contact_id uuid references public.contacts (id) on delete set null,
  posicao integer not null,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index kanban_cards_column_id_idx on public.kanban_cards (column_id, posicao);

alter table public.kanban_boards enable row level security;
alter table public.kanban_columns enable row level security;
alter table public.kanban_cards enable row level security;

create policy "kanban_boards_all_authenticated"
  on public.kanban_boards for all to authenticated using (true) with check (true);

create policy "kanban_columns_all_authenticated"
  on public.kanban_columns for all to authenticated using (true) with check (true);

create policy "kanban_cards_all_authenticated"
  on public.kanban_cards for all to authenticated using (true) with check (true);

create trigger kanban_cards_set_updated_at
  before update on public.kanban_cards
  for each row execute procedure public.set_updated_at();

-- Seed do board padrão com as 4 colunas do briefing.
with board as (
  insert into public.kanban_boards (nome) values ('Projetos') returning id
)
insert into public.kanban_columns (board_id, nome, posicao)
select board.id, coluna.nome, coluna.posicao
from board, (values
  ('A fazer', 0),
  ('Em andamento', 1),
  ('Revisão', 2),
  ('Concluído', 3)
) as coluna (nome, posicao);

alter publication supabase_realtime add table public.kanban_columns;
alter publication supabase_realtime add table public.kanban_cards;
