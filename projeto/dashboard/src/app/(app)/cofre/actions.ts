"use server";

import { z } from "zod";
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

const vaultCategoriaSchema = z.enum([
  "dominio",
  "hospedagem",
  "social",
  "ads",
  "email",
  "financeiro",
  "outro",
]) satisfies z.ZodType<VaultCategoria>;

const idSchema = z.uuid();

const criarEntradaSchema = z.object({
  sessionId: z.uuid(),
  rotulo: z.string().trim().min(1, "Informe o rótulo.").max(200),
  categoria: vaultCategoriaSchema,
  usuario: z.string().trim().max(200).nullable(),
  url: z.string().trim().max(2000).nullable(),
  notas: z.string().trim().max(2000).nullable(),
  senha: z.string().min(1, "Informe a senha."),
});

const atualizarEntradaSchema = z.object({
  id: z.uuid(),
  rotulo: z.string().trim().min(1, "Informe o rótulo.").max(200),
  categoria: vaultCategoriaSchema,
  usuario: z.string().trim().max(200).nullable(),
  url: z.string().trim().max(2000).nullable(),
  notas: z.string().trim().max(2000).nullable(),
  senha: z.string().nullable(),
});

export async function criarEntradaCofre(input: {
  sessionId: string;
  rotulo: string;
  categoria: VaultCategoria;
  usuario: string | null;
  url: string | null;
  notas: string | null;
  senha: string;
}) {
  const dados = criarEntradaSchema.parse(input);
  const { user } = await exigirUsuario();

  const service = createServiceClient();
  const { error } = await service.rpc("cofre_criar_entrada", {
    p_session_id: dados.sessionId,
    p_rotulo: dados.rotulo,
    p_categoria: dados.categoria,
    p_usuario: dados.usuario,
    p_url: dados.url,
    p_notas: dados.notas,
    p_senha: dados.senha,
    p_created_by: user.id,
  });
  if (error) throw new Error(error.message);
}

export async function excluirSessaoCofre(id: string) {
  const dados = idSchema.parse(id);
  await exigirUsuario();

  const service = createServiceClient();
  const { error } = await service.rpc("cofre_excluir_sessao", { p_id: dados });
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
  const dados = atualizarEntradaSchema.parse(input);
  await exigirUsuario();

  const service = createServiceClient();
  const { error } = await service.rpc("cofre_atualizar_entrada", {
    p_id: dados.id,
    p_rotulo: dados.rotulo,
    p_categoria: dados.categoria,
    p_usuario: dados.usuario,
    p_url: dados.url,
    p_notas: dados.notas,
    p_senha: dados.senha,
  });
  if (error) throw new Error(error.message);
}

export async function excluirEntradaCofre(id: string) {
  const dados = idSchema.parse(id);
  await exigirUsuario();

  const service = createServiceClient();
  const { error } = await service.rpc("cofre_excluir_entrada", { p_id: dados });
  if (error) throw new Error(error.message);
}

export async function revelarSegredo(entryId: string): Promise<string> {
  const dados = idSchema.parse(entryId);
  const { supabase, user } = await exigirUsuario();

  const service = createServiceClient();
  const { data, error } = await service.rpc("cofre_revelar_segredo", {
    p_id: dados,
  });
  if (error) throw new Error(error.message);

  await supabase.from("vault_access_log").insert({
    entry_id: dados,
    revelado_por: user.id,
  });

  return data as string;
}
