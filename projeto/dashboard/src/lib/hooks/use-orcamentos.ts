"use client";

import { createPedidoItemHooks } from "@/lib/hooks/use-pedido-itens";
import { useRealtimeTable } from "@/lib/hooks/use-realtime-table";
import { createClient } from "@/lib/supabase/client";
import type { Orcamento, OrcamentoStatus, PedidoItem } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ORCAMENTOS_KEY = ["orcamentos"] as const;

export function useOrcamentos() {
  useRealtimeTable("orcamentos", ORCAMENTOS_KEY);

  return useQuery({
    queryKey: ORCAMENTOS_KEY,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orcamentos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Orcamento[];
    },
  });
}

export function useOrcamento(id: string | null) {
  return useQuery({
    queryKey: [...ORCAMENTOS_KEY, "detail", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orcamentos")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Orcamento;
    },
    enabled: !!id,
  });
}

type OrcamentoInput = {
  contact_id: string | null;
  status: OrcamentoStatus;
  validade: string | null;
};

export function useCreateOrcamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: OrcamentoInput) => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("orcamentos")
        .insert({ ...input, created_by: auth.user?.id })
        .select()
        .single();
      if (error) throw error;
      return data as Orcamento;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ORCAMENTOS_KEY }),
  });
}

export function useUpdateOrcamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...patch
    }: Partial<OrcamentoInput> & { id: string }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("orcamentos")
        .update(patch)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ORCAMENTOS_KEY }),
  });
}

export function useDeleteOrcamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("orcamentos")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ORCAMENTOS_KEY }),
  });
}

const orcamentoItemHooks = createPedidoItemHooks("orcamento_itens", "orcamento_id");
export const useOrcamentoItens = orcamentoItemHooks.useItems;
export const useAddOrcamentoItem = orcamentoItemHooks.useAddItem;
export const useUpdateOrcamentoItem = orcamentoItemHooks.useUpdateItem;
export const useDeleteOrcamentoItem = orcamentoItemHooks.useDeleteItem;

/** Copia o orçamento (dados + itens) pra uma nova ordem de venda. */
export function useGerarOrdemVenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orcamento: Orcamento) => {
      const supabase = createClient();

      const { data: itens, error: itensError } = await supabase
        .from("orcamento_itens")
        .select("*")
        .eq("orcamento_id", orcamento.id);
      if (itensError) throw itensError;

      const { data: auth } = await supabase.auth.getUser();
      const { data: ordem, error: ordemError } = await supabase
        .from("ordens_venda")
        .insert({
          contact_id: orcamento.contact_id,
          orcamento_id: orcamento.id,
          created_by: auth.user?.id,
        })
        .select()
        .single();
      if (ordemError) throw ordemError;

      const itensParaInserir = (itens as PedidoItem[]).map((item) => ({
        ordem_id: ordem.id,
        produto_id: item.produto_id,
        nome_produto: item.nome_produto,
        preco_unitario: item.preco_unitario,
        quantidade: item.quantidade,
      }));

      if (itensParaInserir.length > 0) {
        const { error: itensInsertError } = await supabase
          .from("ordens_venda_itens")
          .insert(itensParaInserir);
        if (itensInsertError) throw itensInsertError;
      }

      return ordem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens_venda"] });
    },
  });
}
