-- Perfis dos 4 sócios, espelhando auth.users.
-- Padrão de RLS usado em todo o painel: qualquer usuário autenticado
-- lê e escreve tudo (não existe hierarquia de permissão entre os sócios).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  cor_avatar text not null default '#FD4B90',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Cria o profile automaticamente quando uma das 4 contas é criada no
-- Supabase Auth (dashboard > Authentication > Add user).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Habilita realtime nessa tabela. Toda tabela nova consumida pelo hook
-- useRealtimeTable precisa dessa mesma linha na sua migration.
alter publication supabase_realtime add table public.profiles;
