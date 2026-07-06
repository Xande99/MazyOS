"use client";

import { useRealtimeTable } from "@/lib/hooks/use-realtime-table";
import { createClient } from "@/lib/supabase/client";
import type { PedidoItem } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type NovoPedidoItem = {
  produto_id: string | null;
  nome_produto: string;
  preco_unitario: number;
  quantidade: number;
};

/** Fábrica de hooks reutilizada pelos 3 tipos de item (orçamento,
 * ordem de venda, ordem de compra) — mesma forma, tabela e coluna do
 * pai diferentes. */
export function createPedidoItemHooks(table: string, parentColumn: string) {
  function useItems(parentId: string | null) {
    const queryKey = [table, parentId] as const;
    useRealtimeTable(table, queryKey);

    return useQuery({
      queryKey,
      queryFn: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .eq(parentColumn, parentId as string);
        if (error) throw error;
        return data as PedidoItem[];
      },
      enabled: !!parentId,
    });
  }

  function useAddItem(parentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (item: NovoPedidoItem) => {
        const supabase = createClient();
        const { error } = await supabase
          .from(table)
          .insert({ [parentColumn]: parentId, ...item });
        if (error) throw error;
      },
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: [table, parentId] }),
    });
  }

  function useUpdateItem(parentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({
        id,
        ...patch
      }: Partial<NovoPedidoItem> & { id: string }) => {
        const supabase = createClient();
        const { error } = await supabase.from(table).update(patch).eq("id", id);
        if (error) throw error;
      },
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: [table, parentId] }),
    });
  }

  function useDeleteItem(parentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (id: string) => {
        const supabase = createClient();
        const { error } = await supabase.from(table).delete().eq("id", id);
        if (error) throw error;
      },
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: [table, parentId] }),
    });
  }

  return { useItems, useAddItem, useUpdateItem, useDeleteItem };
}
