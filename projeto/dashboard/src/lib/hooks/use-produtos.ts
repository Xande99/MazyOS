"use client";

import { useRealtimeTable } from "@/lib/hooks/use-realtime-table";
import { createClient } from "@/lib/supabase/client";
import type { Produto } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const PRODUTOS_KEY = ["produtos"] as const;

export function useProdutos(busca?: string) {
  useRealtimeTable("produtos", PRODUTOS_KEY);

  return useQuery({
    queryKey: [...PRODUTOS_KEY, busca ?? ""],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase.from("produtos").select("*").order("nome");

      if (busca) {
        const termo = busca.replace(/[%_]/g, "");
        query = query.or(`nome.ilike.%${termo}%,sku.ilike.%${termo}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Produto[];
    },
  });
}

type ProdutoInput = {
  sku: string | null;
  nome: string;
  descricao: string | null;
  unidade: string;
  preco_custo: number;
  preco_venda: number;
  estoque: number;
  fornecedor_id: string | null;
};

export function useCreateProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ProdutoInput) => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("produtos")
        .insert({ ...input, created_by: auth.user?.id })
        .select()
        .single();
      if (error) throw error;
      return data as Produto;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUTOS_KEY }),
  });
}

export function useUpdateProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...patch
    }: Partial<ProdutoInput> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("produtos")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Produto;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUTOS_KEY }),
  });
}

export function useDeleteProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("produtos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUTOS_KEY }),
  });
}
