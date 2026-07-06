"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIA_LABELS } from "@/lib/constants/crm";
import { useCreateContact, useUpdateContact } from "@/lib/hooks/use-contacts";
import type { Contact, ContactCategory } from "@/lib/types";
import { FormEvent, useState } from "react";

const CATEGORIAS = Object.keys(CATEGORIA_LABELS) as ContactCategory[];

export function ContactDialog({
  open,
  onClose,
  contact,
}: {
  open: boolean;
  onClose: () => void;
  contact?: Contact;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={contact ? "Editar contato" : "Novo contato"}
    >
      {open && <ContactForm contact={contact} onClose={onClose} />}
    </Dialog>
  );
}

function ContactForm({
  contact,
  onClose,
}: {
  contact?: Contact;
  onClose: () => void;
}) {
  const isEdit = !!contact;
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState({
    categoria: contact?.categoria ?? ("cliente" as ContactCategory),
    nome: contact?.nome ?? "",
    empresa: contact?.empresa ?? "",
    telefone: contact?.telefone ?? "",
    email: contact?.email ?? "",
    endereco: contact?.endereco ?? "",
    tags: contact?.tags?.join(", ") ?? "",
    notas: contact?.notas ?? "",
  });

  const pending = createContact.isPending || updateContact.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);

    const payload = {
      categoria: form.categoria,
      nome: form.nome.trim(),
      empresa: form.empresa.trim() || null,
      telefone: form.telefone.trim() || null,
      email: form.email.trim() || null,
      endereco: form.endereco.trim() || null,
      notas: form.notas.trim() || null,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (isEdit) {
        await updateContact.mutateAsync({ id: contact.id, ...payload });
      } else {
        await createContact.mutateAsync(payload);
      }
      onClose();
    } catch {
      setErro("Não foi possível salvar. Tenta de novo.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Categoria">
          <Select
            value={form.categoria}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                categoria: e.target.value as ContactCategory,
              }))
            }
          >
            {CATEGORIAS.map((categoria) => (
              <option key={categoria} value={categoria}>
                {CATEGORIA_LABELS[categoria]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Nome *">
          <Input
            required
            value={form.nome}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Empresa">
          <Input
            value={form.empresa}
            onChange={(e) =>
              setForm((f) => ({ ...f, empresa: e.target.value }))
            }
          />
        </Field>

        <Field label="Telefone / WhatsApp">
          <Input
            value={form.telefone}
            onChange={(e) =>
              setForm((f) => ({ ...f, telefone: e.target.value }))
            }
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="E-mail">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </Field>

        <Field label="Tags (separadas por vírgula)">
          <Input
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
          />
        </Field>
      </div>

      <Field label="Endereço">
        <Input
          value={form.endereco}
          onChange={(e) =>
            setForm((f) => ({ ...f, endereco: e.target.value }))
          }
        />
      </Field>

      <Field label="Notas">
        <Textarea
          rows={3}
          value={form.notas}
          onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
        />
      </Field>

      {erro && (
        <p role="alert" className="text-sm text-danger">
          {erro}
        </p>
      )}

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-text-muted">{label}</span>
      {children}
    </label>
  );
}
