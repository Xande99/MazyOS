"use client";

import { useRealtimeTable } from "@/lib/hooks/use-realtime-table";
import { createClient } from "@/lib/supabase/client";
import type { Fatura, FaturaStatus } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const FATURAS_KEY = ["faturas"] as const;

export function useFaturas() {
  useRealtimeTable("faturas", FATURAS_KEY);

  return useQuery({
    queryKey: FATURAS_KEY,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("faturas")
        .select("*")
        .order("vencimento");
      if (error) throw error;
      return data as Fatura[];
    },
  });
}

type FaturaInput = {
  contact_id: string | null;
  valor: number;
  vencimento: string;
  status: FaturaStatus;
};

export function useCreateFatura() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: FaturaInput) => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("faturas")
        .insert({ ...input, created_by: auth.user?.id })
        .select()
        .single();
      if (error) throw error;
      return data as Fatura;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FATURAS_KEY }),
  });
}

export function useUpdateFatura() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...patch
    }: Partial<FaturaInput> & { id: string }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("faturas")
        .update(patch)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FATURAS_KEY }),
  });
}

export function useDeleteFatura() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("faturas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FATURAS_KEY }),
  });
}

export function useMarcarFaturaPaga() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("faturas")
        .update({ status: "pago", pago_em: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FATURAS_KEY }),
  });
}
