-- Calendário: eventos com início/fim, opcionalmente vinculados a um
-- contato do CRM (reunião com cliente X).

create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  inicio timestamptz not null,
  fim timestamptz not null,
  dia_inteiro boolean not null default false,
  contact_id uuid references public.contacts (id) on delete set null,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index calendar_events_inicio_idx on public.calendar_events (inicio);

alter table public.calendar_events enable row level security;

create policy "calendar_events_all_authenticated"
  on public.calendar_events for all
  to authenticated
  using (true)
  with check (true);

create trigger calendar_events_set_updated_at
  before update on public.calendar_events
  for each row execute procedure public.set_updated_at();

alter publication supabase_realtime add table public.calendar_events;
