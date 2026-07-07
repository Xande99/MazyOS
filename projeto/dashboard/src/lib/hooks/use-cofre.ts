"use client";

import { useRealtimeTable } from "@/lib/hooks/use-realtime-table";
import { createClient } from "@/lib/supabase/client";
import type { VaultAccessLog, VaultEntry, VaultSession } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const SESSIONS_KEY = ["vault_sessions"] as const;
const ENTRIES_KEY = ["vault_entries"] as const;

export function useVaultSessions(busca?: string) {
  useRealtimeTable("vault_sessions", SESSIONS_KEY);

  return useQuery({
    queryKey: [...SESSIONS_KEY, busca ?? ""],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase.from("vault_sessions").select("*").order("nome");

      if (busca) {
        const termo = busca.replace(/[%_]/g, "");
        query = query.ilike("nome", `%${termo}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as VaultSession[];
    },
  });
}

export function useVaultSession(id: string | null) {
  const queryKey = [...SESSIONS_KEY, "detail", id] as const;
  useRealtimeTable("vault_sessions", queryKey);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("vault_sessions")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as VaultSession;
    },
    enabled: !!id,
  });
}

export function useCreateVaultSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { nome: string; notas: string | null }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("vault_sessions")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as VaultSession;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SESSIONS_KEY }),
  });
}

export function useUpdateVaultSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      id: string;
      nome: string;
      notas: string | null;
    }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("vault_sessions")
        .update({ nome: input.nome, notas: input.notas })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SESSIONS_KEY }),
  });
}

/** Só metadados — o segredo em si nunca passa por aqui, só via
 * Server Action (ver src/app/(app)/cofre/actions.ts). */
export function useVaultEntries(filters: { sessionId?: string; busca?: string } = {}) {
  useRealtimeTable("vault_entries", ENTRIES_KEY);

  return useQuery({
    queryKey: [...ENTRIES_KEY, filters],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase.from("vault_entries").select("*").order("rotulo");

      if (filters.sessionId) {
        query = query.eq("session_id", filters.sessionId);
      }

      if (filters.busca) {
        const termo = filters.busca.replace(/[%_]/g, "");
        query = query.ilike("rotulo", `%${termo}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as VaultEntry[];
    },
  });
}

export function useVaultAccessLog(entryId: string | null) {
  const queryKey = ["vault_access_log", entryId] as const;
  useRealtimeTable("vault_access_log", queryKey);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("vault_access_log")
        .select("*")
        .eq("entry_id", entryId)
        .order("revelado_em", { ascending: false });
      if (error) throw error;
      return data as VaultAccessLog[];
    },
    enabled: !!entryId,
  });
}
