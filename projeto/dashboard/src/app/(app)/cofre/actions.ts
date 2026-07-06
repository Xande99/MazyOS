"use server";

import { createClient as createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { VaultCategoria } from "@/lib/types";

async function exigirUsuario() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");
  return { supabase, user };
}

export async function criarEntradaCofre(input: {
  rotulo: string;
  categoria: VaultCategoria;
  usuario: string | null;
  url: string | null;
  notas: string | null;
  senha: string;
}) {
  const { user } = await exigirUsuario();

  const service = createServiceClient();
  const { error } = await service.rpc("cofre_criar_entrada", {
    p_rotulo: input.rotulo,
    p_categoria: input.categoria,
    p_usuario: input.usuario,
    p_url: input.url,
    p_notas: input.notas,
    p_senha: input.senha,
    p_created_by: user.id,
  });
  if (error) throw new Error(error.message);
}

export async function atualizarEntradaCofre(input: {
  id: string;
  rotulo: string;
  categoria: VaultCategoria;
  usuario: string | null;
  url: string | null;
  notas: string | null;
  senha: string | null;
}) {
  await exigirUsuario();

  const service = createServiceClient();
  const { error } = await service.rpc("cofre_atualizar_entrada", {
    p_id: input.id,
    p_rotulo: input.rotulo,
    p_categoria: input.categoria,
    p_usuario: input.usuario,
    p_url: input.url,
    p_notas: input.notas,
    p_senha: input.senha,
  });
  if (error) throw new Error(error.message);
}

export async function excluirEntradaCofre(id: string) {
  await exigirUsuario();

  const service = createServiceClient();
  const { error } = await service.rpc("cofre_excluir_entrada", { p_id: id });
  if (error) throw new Error(error.message);
}

export async function revelarSegredo(entryId: string): Promise<string> {
  const { supabase, user } = await exigirUsuario();

  const service = createServiceClient();
  const { data, error } = await service.rpc("cofre_revelar_segredo", {
    p_id: entryId,
  });
  if (error) throw new Error(error.message);

  await supabase.from("vault_access_log").insert({
    entry_id: entryId,
    revelado_por: user.id,
  });

  return data as string;
}
