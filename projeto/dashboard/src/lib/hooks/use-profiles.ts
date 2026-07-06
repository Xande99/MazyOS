"use client";

import { useRealtimeTable } from "@/lib/hooks/use-realtime-table";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const PROFILES_KEY = ["profiles"] as const;

export function useProfiles() {
  useRealtimeTable("profiles", PROFILES_KEY);

  return useQuery({
    queryKey: PROFILES_KEY,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data as Profile[];
    },
  });
}
