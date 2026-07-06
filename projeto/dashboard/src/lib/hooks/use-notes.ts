"use client";

import { useRealtimeTable } from "@/lib/hooks/use-realtime-table";
import { createClient } from "@/lib/supabase/client";
import type { Note, NoteFolder } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const FOLDERS_KEY = ["note_folders"] as const;
const NOTES_KEY = ["notes"] as const;

export function useFolders() {
  useRealtimeTable("note_folders", FOLDERS_KEY);

  return useQuery({
    queryKey: FOLDERS_KEY,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("note_folders")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data as NoteFolder[];
    },
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nome: string) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("note_folders")
        .insert({ nome })
        .select()
        .single();
      if (error) throw error;
      return data as NoteFolder;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FOLDERS_KEY }),
  });
}

export type NoteFilters = {
  folderId?: string | null;
  busca?: string;
};

export function useNotes(filters: NoteFilters = {}) {
  useRealtimeTable("notes", NOTES_KEY);

  return useQuery({
    queryKey: [...NOTES_KEY, filters],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (filters.folderId === null) {
        query = query.is("folder_id", null);
      } else if (filters.folderId) {
        query = query.eq("folder_id", filters.folderId);
      }

      if (filters.busca) {
        const termo = filters.busca.replace(/[%_]/g, "");
        query = query.or(`titulo.ilike.%${termo}%,tags.cs.{${termo}}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Note[];
    },
  });
}

export function useNote(id: string | null) {
  return useQuery({
    queryKey: [...NOTES_KEY, "detail", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Note;
    },
    enabled: !!id,
  });
}

type NoteInput = {
  folder_id: string | null;
  titulo: string;
  conteudo: string | null;
  tags: string[];
};

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: NoteInput) => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("notes")
        .insert({ ...input, created_by: auth.user?.id })
        .select()
        .single();
      if (error) throw error;
      return data as Note;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTES_KEY }),
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<NoteInput> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("notes")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Note;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTES_KEY }),
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTES_KEY }),
  });
}
