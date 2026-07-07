-- Cofre: agrupa credenciais em Sessões (geralmente um cliente, ou
-- "duPolvo interna"). Sessão não guarda segredo nenhum, então seu
-- CRUD de criar/editar é direto via RLS — só excluir passa por function
-- (precisa limpar os segredos das credenciais dentro dela no Vault).

create table public.vault_sessions (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  notas text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vault_sessions enable row level security;

create policy "vault_sessions_select_authenticated"
  on public.vault_sessions for select
  to authenticated
  using (true);

create policy "vault_sessions_insert_authenticated"
  on public.vault_sessions for insert
  to authenticated
  with check (true);

create policy "vault_sessions_update_authenticated"
  on public.vault_sessions for update
  to authenticated
  using (true)
  with check (true);

-- Sem policy de delete pra authenticated: só via cofre_excluir_sessao.

create trigger vault_sessions_set_updated_at
  before update on public.vault_sessions
  for each row execute procedure public.set_updated_at();

alter publication supabase_realtime add table public.vault_sessions;

-- vault_entries passa a pertencer a uma sessão.

alter table public.vault_entries
  add column session_id uuid references public.vault_sessions (id) on delete cascade;

-- Backfill: qualquer credencial já cadastrada (pré-existente a essa
-- migration) ganha uma sessão nova nomeada com o rótulo atual dela —
-- sem tentar adivinhar nome de cliente a partir de texto livre. Só
-- renomear a sessão depois pela tela de edição.
do $$
declare
  entrada record;
  nova_sessao_id uuid;
begin
  for entrada in
    select id, rotulo, created_by from public.vault_entries where session_id is null
  loop
    insert into public.vault_sessions (nome, created_by)
    values (entrada.rotulo, entrada.created_by)
    returning id into nova_sessao_id;

    update public.vault_entries
    set session_id = nova_sessao_id
    where id = entrada.id;
  end loop;
end;
$$;

alter table public.vault_entries
  alter column session_id set not null;

create index vault_entries_session_id_idx on public.vault_entries (session_id);

-- Limpeza do segredo no Vault quando a credencial some — seja por
-- exclusão direta (cofre_excluir_entrada) ou por cascade (sessão
-- excluída). security definer: roda com o dono da function, não com
-- o role de quem disparou o delete.
create function public.vault_entries_cleanup_secret()
returns trigger
language plpgsql
security definer
set search_path = public, vault
as $$
begin
  delete from vault.secrets where id = old.secret_id;
  return old;
end;
$$;

create trigger vault_entries_cleanup_secret
  after delete on public.vault_entries
  for each row execute procedure public.vault_entries_cleanup_secret();

-- cofre_criar_entrada agora exige a sessão.

drop function if exists public.cofre_criar_entrada(text, public.vault_categoria, text, text, text, text, uuid);

create function public.cofre_criar_entrada(
  p_session_id uuid,
  p_rotulo text,
  p_categoria public.vault_categoria,
  p_usuario text,
  p_url text,
  p_notas text,
  p_senha text,
  p_created_by uuid default null
)
returns public.vault_entries
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  novo_secret_id uuid;
  nova_entrada public.vault_entries;
begin
  novo_secret_id := vault.create_secret(p_senha, p_rotulo);

  insert into public.vault_entries (session_id, rotulo, categoria, usuario, secret_id, url, notas, created_by)
  values (p_session_id, p_rotulo, p_categoria, p_usuario, novo_secret_id, p_url, p_notas, p_created_by)
  returning * into nova_entrada;

  return nova_entrada;
end;
$$;

revoke execute on function public.cofre_criar_entrada(uuid, text, public.vault_categoria, text, text, text, text, uuid) from public, anon, authenticated;
grant execute on function public.cofre_criar_entrada(uuid, text, public.vault_categoria, text, text, text, text, uuid) to service_role;

-- cofre_excluir_entrada simplifica: a trigger cuida do segredo agora.

create or replace function public.cofre_excluir_entrada(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public, vault
as $$
begin
  delete from public.vault_entries where id = p_id;
end;
$$;

-- Excluir sessão: cascade apaga as credenciais, a trigger limpa os
-- segredos delas no Vault.

create function public.cofre_excluir_sessao(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public, vault
as $$
begin
  delete from public.vault_sessions where id = p_id;
end;
$$;

revoke execute on function public.cofre_excluir_sessao(uuid) from public, anon, authenticated;
grant execute on function public.cofre_excluir_sessao(uuid) to service_role;
