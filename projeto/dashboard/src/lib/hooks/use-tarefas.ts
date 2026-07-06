"use client";

import { useRealtimeTable } from "@/lib/hooks/use-realtime-table";
import { createClient } from "@/lib/supabase/client";
import type { TodoItem, TodoProject } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const PROJECTS_KEY = ["todo_projects"] as const;
const ITEMS_KEY = ["todo_items"] as const;

export function useProjects() {
  useRealtimeTable("todo_projects", PROJECTS_KEY);

  return useQuery({
    queryKey: PROJECTS_KEY,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("todo_projects")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data as TodoProject[];
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nome: string) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("todo_projects")
        .insert({ nome })
        .select()
        .single();
      if (error) throw error;
      return data as TodoProject;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROJECTS_KEY }),
  });
}

export type ItemFilters = {
  projectId?: string | null;
  responsavelId?: string;
};

export function useItems(filters: ItemFilters = {}) {
  useRealtimeTable("todo_items", ITEMS_KEY);

  return useQuery({
    queryKey: [...ITEMS_KEY, filters],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase.from("todo_items").select("*").order("posicao");

      if (filters.projectId === null) {
        query = query.is("project_id", null);
      } else if (filters.projectId) {
        query = query.eq("project_id", filters.projectId);
      }

      if (filters.responsavelId) {
        query = query.eq("responsavel_id", filters.responsavelId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TodoItem[];
    },
  });
}

type ItemInput = {
  project_id: string | null;
  responsavel_id: string | null;
  titulo: string;
  posicao: number;
};

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ItemInput) => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("todo_items")
        .insert({ ...input, created_by: auth.user?.id })
        .select()
        .single();
      if (error) throw error;
      return data as TodoItem;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ITEMS_KEY }),
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...patch
    }: Partial<ItemInput & { feito: boolean }> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("todo_items")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as TodoItem;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ITEMS_KEY }),
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("todo_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ITEMS_KEY }),
  });
}

export function useReorderItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: { id: string; posicao: number }[]) => {
      const supabase = createClient();
      await Promise.all(
        updates.map(({ id, posicao }) =>
          supabase.from("todo_items").update({ posicao }).eq("id", id),
        ),
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ITEMS_KEY }),
  });
}
