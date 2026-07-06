"use client";

import { useRealtimeTable } from "@/lib/hooks/use-realtime-table";
import { createClient } from "@/lib/supabase/client";
import type { LivroPreco, LivroPrecoItem } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const LIVROS_KEY = ["livros_precos"] as const;
const ITENS_KEY = ["livro_preco_itens"] as const;

export function usePriceBooks() {
  useRealtimeTable("livros_precos", LIVROS_KEY);

  return useQuery({
    queryKey: LIVROS_KEY,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("livros_precos")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data as LivroPreco[];
    },
  });
}

type PriceBookInput = {
  nome: string;
  valido_de: string | null;
  valido_ate: string | null;
};

export function useCreatePriceBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: PriceBookInput) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("livros_precos")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as LivroPreco;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LIVROS_KEY }),
  });
}

export function useUpdatePriceBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...patch
    }: Partial<PriceBookInput> & { id: string }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("livros_precos")
        .update(patch)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LIVROS_KEY }),
  });
}

export function useDeletePriceBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("livros_precos")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LIVROS_KEY }),
  });
}

export function usePriceBookItems(livroId: string | null) {
  const queryKey = [...ITENS_KEY, livroId] as const;
  useRealtimeTable("livro_preco_itens", queryKey);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("livro_preco_itens")
        .select("*")
        .eq("livro_preco_id", livroId);
      if (error) throw error;
      return data as LivroPrecoItem[];
    },
    enabled: !!livroId,
  });
}

export function useSetPriceBookItem(livroId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      produto_id,
      preco,
    }: {
      produto_id: string;
      preco: number;
    }) => {
      const supabase = createClient();
      const { error } = await supabase.from("livro_preco_itens").upsert(
        { livro_preco_id: livroId, produto_id, preco },
        { onConflict: "livro_preco_id,produto_id" },
      );
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [...ITENS_KEY, livroId] }),
  });
}

export function useDeletePriceBookItem(livroId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("livro_preco_itens")
        .delete()
        .eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [...ITENS_KEY, livroId] }),
  });
}
