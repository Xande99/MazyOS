"use client";

import { useRealtimeTable } from "@/lib/hooks/use-realtime-table";
import { createClient } from "@/lib/supabase/client";
import type { VaultAccessLog, VaultEntry } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const ENTRIES_KEY = ["vault_entries"] as const;

/** Só metadados — o segredo em si nunca passa por aqui, só via
 * Server Action (ver src/app/(app)/cofre/actions.ts). */
export function useVaultEntries(busca?: string) {
  useRealtimeTable("vault_entries", ENTRIES_KEY);

  return useQuery({
    queryKey: [...ENTRIES_KEY, busca ?? ""],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase.from("vault_entries").select("*").order("rotulo");

      if (busca) {
        const termo = busca.replace(/[%_]/g, "");
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
