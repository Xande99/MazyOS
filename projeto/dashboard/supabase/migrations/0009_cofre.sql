-- Cofre de acesso — segredos guardados via Supabase Vault (pgsodium),
-- nunca em texto puro. `vault_entries` só guarda a referência
-- (secret_id) pro segredo de verdade, que vive em vault.secrets já
-- cifrado. Criar/editar/excluir/revelar só acontece através das
-- funções abaixo, chamadas exclusivamente pelo service_role a partir
-- de Server Actions — o client autenticado comum nunca toca o Vault
-- diretamente, então toda revelação passa pelo log de auditoria.

create extension if not exists supabase_vault cascade;

create type public.vault_categoria as enum (
  'dominio', 'hospedagem', 'social', 'ads', 'email', 'financeiro', 'outro'
);

create table public.vault_entries (
  id uuid primary key default gen_random_uuid(),
  rotulo text not null,
  categoria public.vault_categoria not null default 'outro',
  usuario text,
  secret_id uuid not null,
  url text,
  notas text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vault_entries enable row level security;

-- Só select direto — criar/editar/excluir passam pelas funções.
create policy "vault_entries_select_authenticated"
  on public.vault_entries for select
  to authenticated
  using (true);

create trigger vault_entries_set_updated_at
  before update on public.vault_entries
  for each row execute procedure public.set_updated_at();

create table public.vault_access_log (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.vault_entries (id) on delete cascade,
  revelado_por uuid references public.profiles (id),
  revelado_em timestamptz not null default now()
);

alter table public.vault_access_log enable row level security;

create policy "vault_access_log_select_authenticated"
  on public.vault_access_log for select
  to authenticated
  using (true);

create policy "vault_access_log_insert_authenticated"
  on public.vault_access_log for insert
  to authenticated
  with check (true);

create function public.cofre_criar_entrada(
  p_rotulo text,
  p_categoria public.vault_categoria,
  p_usuario text,
  p_url text,
  p_notas text,
  p_senha text
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

  insert into public.vault_entries (rotulo, categoria, usuario, secret_id, url, notas)
  values (p_rotulo, p_categoria, p_usuario, novo_secret_id, p_url, p_notas)
  returning * into nova_entrada;

  return nova_entrada;
end;
$$;

create function public.cofre_atualizar_entrada(
  p_id uuid,
  p_rotulo text,
  p_categoria public.vault_categoria,
  p_usuario text,
  p_url text,
  p_notas text,
  p_senha text
)
returns void
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  o_secret_id uuid;
begin
  select secret_id into o_secret_id from public.vault_entries where id = p_id;

  if p_senha is not null and p_senha <> '' then
    perform vault.update_secret(o_secret_id, p_senha);
  end if;

  update public.vault_entries
  set rotulo = p_rotulo,
      categoria = p_categoria,
      usuario = p_usuario,
      url = p_url,
      notas = p_notas
  where id = p_id;
end;
$$;

create function public.cofre_excluir_entrada(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  o_secret_id uuid;
begin
  select secret_id into o_secret_id from public.vault_entries where id = p_id;
  delete from public.vault_entries where id = p_id;
  delete from vault.secrets where id = o_secret_id;
end;
$$;

create function public.cofre_revelar_segredo(p_id uuid)
returns text
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  o_secret_id uuid;
  valor text;
begin
  select secret_id into o_secret_id from public.vault_entries where id = p_id;
  select decrypted_secret into valor from vault.decrypted_secrets where id = o_secret_id;
  return valor;
end;
$$;

revoke execute on function public.cofre_criar_entrada(text, public.vault_categoria, text, text, text, text) from public, anon, authenticated;
revoke execute on function public.cofre_atualizar_entrada(uuid, text, public.vault_categoria, text, text, text, text) from public, anon, authenticated;
revoke execute on function public.cofre_excluir_entrada(uuid) from public, anon, authenticated;
revoke execute on function public.cofre_revelar_segredo(uuid) from public, anon, authenticated;

grant execute on function public.cofre_criar_entrada(text, public.vault_categoria, text, text, text, text) to service_role;
grant execute on function public.cofre_atualizar_entrada(uuid, text, public.vault_categoria, text, text, text, text) to service_role;
grant execute on function public.cofre_excluir_entrada(uuid) to service_role;
grant execute on function public.cofre_revelar_segredo(uuid) to service_role;

alter publication supabase_realtime add table public.vault_entries;
alter publication supabase_realtime add table public.vault_access_log;
