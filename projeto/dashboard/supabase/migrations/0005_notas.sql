-- Notas: pastas opcionais + texto livre com tags.

create table public.note_folders (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  created_at timestamptz not null default now()
);

alter table public.note_folders enable row level security;

create policy "note_folders_all_authenticated"
  on public.note_folders for all
  to authenticated
  using (true)
  with check (true);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid references public.note_folders (id) on delete set null,
  titulo text not null,
  conteudo text,
  tags text[] not null default '{}',
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notes_folder_id_idx on public.notes (folder_id);
create index notes_tags_idx on public.notes using gin (tags);

alter table public.notes enable row level security;

create policy "notes_all_authenticated"
  on public.notes for all
  to authenticated
  using (true)
  with check (true);

create trigger notes_set_updated_at
  before update on public.notes
  for each row execute procedure public.set_updated_at();

alter publication supabase_realtime add table public.note_folders;
alter publication supabase_realtime add table public.notes;
