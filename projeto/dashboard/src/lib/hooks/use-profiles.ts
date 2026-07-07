"use client";

import { useRealtimeTable } from "@/lib/hooks/use-realtime-table";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export function useUpdateFavoritos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { userId: string; favoritos: string[] }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ favoritos: input.favoritos })
        .eq("id", input.userId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFILES_KEY }),
  });
}
