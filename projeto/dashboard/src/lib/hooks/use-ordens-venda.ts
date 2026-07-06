"use client";

import { createPedidoItemHooks } from "@/lib/hooks/use-pedido-itens";
import { useRealtimeTable } from "@/lib/hooks/use-realtime-table";
import { createClient } from "@/lib/supabase/client";
import type { OrdemVenda, OrdemVendaStatus } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ORDENS_KEY = ["ordens_venda"] as const;

export function useOrdensVenda() {
  useRealtimeTable("ordens_venda", ORDENS_KEY);

  return useQuery({
    queryKey: ORDENS_KEY,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("ordens_venda")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as OrdemVenda[];
    },
  });
}

export function useOrdemVenda(id: string | null) {
  return useQuery({
    queryKey: [...ORDENS_KEY, "detail", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("ordens_venda")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as OrdemVenda;
    },
    enabled: !!id,
  });
}

type OrdemVendaInput = {
  contact_id: string | null;
  status: OrdemVendaStatus;
};

export function useCreateOrdemVenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: OrdemVendaInput) => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("ordens_venda")
        .insert({ ...input, created_by: auth.user?.id })
        .select()
        .single();
      if (error) throw error;
      return data as OrdemVenda;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDENS_KEY }),
  });
}

export function useUpdateOrdemVenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...patch
    }: Partial<OrdemVendaInput> & { id: string }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("ordens_venda")
        .update(patch)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDENS_KEY }),
  });
}

export function useDeleteOrdemVenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("ordens_venda")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDENS_KEY }),
  });
}

const ordemVendaItemHooks = createPedidoItemHooks("ordens_venda_itens", "ordem_id");
export const useOrdemVendaItens = ordemVendaItemHooks.useItems;
export const useAddOrdemVendaItem = ordemVendaItemHooks.useAddItem;
export const useUpdateOrdemVendaItem = ordemVendaItemHooks.useUpdateItem;
export const useDeleteOrdemVendaItem = ordemVendaItemHooks.useDeleteItem;

/** Gera uma fatura a partir do total atual da ordem, vencimento em 30 dias. */
export function useGerarFatura() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ordem: OrdemVenda) => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();

      const vencimento = new Date();
      vencimento.setDate(vencimento.getDate() + 30);

      const { data, error } = await supabase
        .from("faturas")
        .insert({
          contact_id: ordem.contact_id,
          ordem_venda_id: ordem.id,
          valor: ordem.total,
          vencimento: vencimento.toISOString().slice(0, 10),
          created_by: auth.user?.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faturas"] });
    },
  });
}
