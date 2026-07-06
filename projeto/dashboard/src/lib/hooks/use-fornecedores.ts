"use client";

import { useRealtimeTable } from "@/lib/hooks/use-realtime-table";
import { createClient } from "@/lib/supabase/client";
import type { Fornecedor } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const FORNECEDORES_KEY = ["fornecedores"] as const;

export function useFornecedores(busca?: string) {
  useRealtimeTable("fornecedores", FORNECEDORES_KEY);

  return useQuery({
    queryKey: [...FORNECEDORES_KEY, busca ?? ""],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase.from("fornecedores").select("*").order("nome");

      if (busca) {
        const termo = busca.replace(/[%_]/g, "");
        query = query.ilike("nome", `%${termo}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Fornecedor[];
    },
  });
}

type FornecedorInput = {
  nome: string;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  notas: string | null;
};

export function useCreateFornecedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: FornecedorInput) => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("fornecedores")
        .insert({ ...input, created_by: auth.user?.id })
        .select()
        .single();
      if (error) throw error;
      return data as Fornecedor;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: FORNECEDORES_KEY }),
  });
}

export function useUpdateFornecedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...patch
    }: Partial<FornecedorInput> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("fornecedores")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Fornecedor;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: FORNECEDORES_KEY }),
  });
}

export function useDeleteFornecedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("fornecedores")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: FORNECEDORES_KEY }),
  });
}
