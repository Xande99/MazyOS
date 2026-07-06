-- Tarefas: lista estruturada agrupável por projeto ou por pessoa.
-- Deliberadamente sem fórmulas/células livres — é checklist, não
-- motor de planilha.

create table public.todo_projects (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  created_at timestamptz not null default now()
);

alter table public.todo_projects enable row level security;

create policy "todo_projects_all_authenticated"
  on public.todo_projects for all
  to authenticated
  using (true)
  with check (true);

create table public.todo_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.todo_projects (id) on delete set null,
  responsavel_id uuid references public.profiles (id),
  titulo text not null,
  feito boolean not null default false,
  posicao integer not null,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index todo_items_project_id_idx on public.todo_items (project_id, posicao);

alter table public.todo_items enable row level security;

create policy "todo_items_all_authenticated"
  on public.todo_items for all
  to authenticated
  using (true)
  with check (true);

create trigger todo_items_set_updated_at
  before update on public.todo_items
  for each row execute procedure public.set_updated_at();

alter publication supabase_realtime add table public.todo_projects;
alter publication supabase_realtime add table public.todo_items;
