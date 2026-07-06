"use client";

import { useRealtimeTable } from "@/lib/hooks/use-realtime-table";
import { createClient } from "@/lib/supabase/client";
import type { Contact, ContactCategory, ContactInteraction } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CONTACTS_KEY = ["contacts"] as const;

export type ContactFilters = {
  categoria?: ContactCategory;
  busca?: string;
};

export function useContacts(filters: ContactFilters = {}) {
  const queryKey = [...CONTACTS_KEY, filters] as const;
  useRealtimeTable("contacts", CONTACTS_KEY);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase.from("contacts").select("*").order("nome");

      if (filters.categoria) {
        query = query.eq("categoria", filters.categoria);
      }
      if (filters.busca) {
        const termo = filters.busca.replace(/[%_]/g, "");
        query = query.or(`nome.ilike.%${termo}%,empresa.ilike.%${termo}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Contact[];
    },
  });
}

export function useContact(id: string | null) {
  return useQuery({
    queryKey: [...CONTACTS_KEY, "detail", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Contact;
    },
    enabled: !!id,
  });
}

type ContactInput = Pick<Contact, "categoria" | "nome"> &
  Partial<
    Pick<
      Contact,
      "empresa" | "telefone" | "email" | "endereco" | "notas" | "tags"
    >
  >;

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ContactInput) => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("contacts")
        .insert({ ...input, created_by: auth.user?.id })
        .select()
        .single();
      if (error) throw error;
      return data as Contact;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...patch
    }: Partial<ContactInput> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("contacts")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Contact;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("contacts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}

export function useContactInteractions(contactId: string | null) {
  const queryKey = ["contact_interactions", contactId] as const;
  useRealtimeTable("contact_interactions", queryKey);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("contact_interactions")
        .select("*")
        .eq("contact_id", contactId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ContactInteraction[];
    },
    enabled: !!contactId,
  });
}

export function useAddInteraction(contactId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nota: string) => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const { error } = await supabase.from("contact_interactions").insert({
        contact_id: contactId,
        nota,
        created_by: auth.user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["contact_interactions", contactId],
      }),
  });
}
