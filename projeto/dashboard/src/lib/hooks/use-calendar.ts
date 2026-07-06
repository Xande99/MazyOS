"use client";

import { useRealtimeTable } from "@/lib/hooks/use-realtime-table";
import { createClient } from "@/lib/supabase/client";
import type { CalendarEvent } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const EVENTS_KEY = ["calendar_events"] as const;

export function useEvents(range: { start: Date; end: Date }) {
  const rangeKey = { start: range.start.toISOString(), end: range.end.toISOString() };
  useRealtimeTable("calendar_events", EVENTS_KEY);

  return useQuery({
    queryKey: [...EVENTS_KEY, rangeKey],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .lte("inicio", rangeKey.end)
        .gte("fim", rangeKey.start)
        .order("inicio");
      if (error) throw error;
      return data as CalendarEvent[];
    },
  });
}

export function useEvent(id: string | null) {
  return useQuery({
    queryKey: [...EVENTS_KEY, "detail", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as CalendarEvent;
    },
    enabled: !!id,
  });
}

type EventInput = {
  titulo: string;
  descricao: string | null;
  inicio: string;
  fim: string;
  dia_inteiro: boolean;
  contact_id: string | null;
};

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: EventInput) => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("calendar_events")
        .insert({ ...input, created_by: auth.user?.id })
        .select()
        .single();
      if (error) throw error;
      return data as CalendarEvent;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EVENTS_KEY }),
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<EventInput> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("calendar_events")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as CalendarEvent;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EVENTS_KEY }),
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EVENTS_KEY }),
  });
}
