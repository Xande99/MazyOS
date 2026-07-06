"use client";

import { useRealtimeTable } from "@/lib/hooks/use-realtime-table";
import { createClient } from "@/lib/supabase/client";
import type { KanbanCard, KanbanColumn, KanbanPriority } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const COLUMNS_KEY = ["kanban_columns"] as const;
const CARDS_KEY = ["kanban_cards"] as const;

export function useColumns() {
  useRealtimeTable("kanban_columns", COLUMNS_KEY);

  return useQuery({
    queryKey: COLUMNS_KEY,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("kanban_columns")
        .select("*")
        .order("posicao");
      if (error) throw error;
      return data as KanbanColumn[];
    },
  });
}

export function useCards() {
  useRealtimeTable("kanban_cards", CARDS_KEY);

  return useQuery({
    queryKey: CARDS_KEY,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("kanban_cards")
        .select("*")
        .order("posicao");
      if (error) throw error;
      return data as KanbanCard[];
    },
  });
}

type CardInput = {
  column_id: string;
  titulo: string;
  descricao: string | null;
  responsavel_id: string | null;
  prazo: string | null;
  prioridade: KanbanPriority;
  contact_id: string | null;
  posicao: number;
};

export function useCreateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CardInput) => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("kanban_cards")
        .insert({ ...input, created_by: auth.user?.id })
        .select()
        .single();
      if (error) throw error;
      return data as KanbanCard;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CARDS_KEY }),
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...patch
    }: Partial<CardInput> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("kanban_cards")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as KanbanCard;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CARDS_KEY }),
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("kanban_cards")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CARDS_KEY }),
  });
}

/** Aplica em lote a nova coluna/posição de cada card depois de um drag-and-drop. */
export function useMoveCards() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      updates: { id: string; column_id: string; posicao: number }[],
    ) => {
      const supabase = createClient();
      await Promise.all(
        updates.map(({ id, column_id, posicao }) =>
          supabase
            .from("kanban_cards")
            .update({ column_id, posicao })
            .eq("id", id),
        ),
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CARDS_KEY }),
  });
}

export function useRenameColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, nome }: { id: string; nome: string }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("kanban_columns")
        .update({ nome })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: COLUMNS_KEY }),
  });
}

export { CARDS_KEY, COLUMNS_KEY };
