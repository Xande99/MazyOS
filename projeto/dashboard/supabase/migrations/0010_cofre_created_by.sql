-- cofre_criar_entrada não gravava created_by (diferente do resto do
-- painel). Adiciona o parâmetro e passa o autor a partir da Server
-- Action.

drop function if exists public.cofre_criar_entrada(text, public.vault_categoria, text, text, text, text);

create function public.cofre_criar_entrada(
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

  insert into public.vault_entries (rotulo, categoria, usuario, secret_id, url, notas, created_by)
  values (p_rotulo, p_categoria, p_usuario, novo_secret_id, p_url, p_notas, p_created_by)
  returning * into nova_entrada;

  return nova_entrada;
end;
$$;

revoke execute on function public.cofre_criar_entrada(text, public.vault_categoria, text, text, text, text, uuid) from public, anon, authenticated;
grant execute on function public.cofre_criar_entrada(text, public.vault_categoria, text, text, text, text, uuid) to service_role;
