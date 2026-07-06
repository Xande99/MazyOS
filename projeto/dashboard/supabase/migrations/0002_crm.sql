-- CRM: contatos segmentados em cliente/parceiro/gráfica + timeline de
-- interação. Mesmo padrão de RLS do resto do painel: qualquer
-- autenticado lê e escreve tudo.

create type public.contact_category as enum ('cliente', 'parceiro', 'grafica');

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  categoria public.contact_category not null,
  nome text not null,
  empresa text,
  telefone text,
  email text,
  endereco text,
  notas text,
  tags text[] not null default '{}',
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contacts_categoria_idx on public.contacts (categoria);
create index contacts_tags_idx on public.contacts using gin (tags);

alter table public.contacts enable row level security;

create policy "contacts_all_authenticated"
  on public.contacts for all
  to authenticated
  using (true)
  with check (true);

create table public.contact_interactions (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete cascade,
  nota text not null,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index contact_interactions_contact_id_idx
  on public.contact_interactions (contact_id, created_at desc);

alter table public.contact_interactions enable row level security;

create policy "contact_interactions_all_authenticated"
  on public.contact_interactions for all
  to authenticated
  using (true)
  with check (true);

-- Mantém updated_at em dia a cada edição de contato.
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger contacts_set_updated_at
  before update on public.contacts
  for each row execute procedure public.set_updated_at();

alter publication supabase_realtime add table public.contacts;
alter publication supabase_realtime add table public.contact_interactions;
