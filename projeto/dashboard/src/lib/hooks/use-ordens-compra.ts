"use client";

import { createPedidoItemHooks } from "@/lib/hooks/use-pedido-itens";
import { useRealtimeTable } from "@/lib/hooks/use-realtime-table";
import { createClient } from "@/lib/supabase/client";
import type { OrdemCompra, OrdemCompraStatus } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ORDENS_KEY = ["ordens_compra"] as const;

export function useOrdensCompra() {
  useRealtimeTable("ordens_compra", ORDENS_KEY);

  return useQuery({
    queryKey: ORDENS_KEY,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("ordens_compra")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as OrdemCompra[];
    },
  });
}

export function useOrdemCompra(id: string | null) {
  return useQuery({
    queryKey: [...ORDENS_KEY, "detail", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("ordens_compra")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as OrdemCompra;
    },
    enabled: !!id,
  });
}

type OrdemCompraInput = {
  fornecedor_id: string | null;
  status: OrdemCompraStatus;
};

export function useCreateOrdemCompra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: OrdemCompraInput) => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("ordens_compra")
        .insert({ ...input, created_by: auth.user?.id })
        .select()
        .single();
      if (error) throw error;
      return data as OrdemCompra;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDENS_KEY }),
  });
}

export function useUpdateOrdemCompra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...patch
    }: Partial<OrdemCompraInput> & { id: string }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("ordens_compra")
        .update(patch)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDENS_KEY }),
  });
}

export function useDeleteOrdemCompra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("ordens_compra")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDENS_KEY }),
  });
}

const ordemCompraItemHooks = createPedidoItemHooks(
  "ordens_compra_itens",
  "ordem_id",
);
export const useOrdemCompraItens = ordemCompraItemHooks.useItems;
export const useAddOrdemCompraItem = ordemCompraItemHooks.useAddItem;
export const useUpdateOrdemCompraItem = ordemCompraItemHooks.useUpdateItem;
export const useDeleteOrdemCompraItem = ordemCompraItemHooks.useDeleteItem;
