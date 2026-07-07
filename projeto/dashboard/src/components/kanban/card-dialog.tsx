"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PRIORIDADE_LABELS } from "@/lib/constants/kanban";
import { useContacts } from "@/lib/hooks/use-contacts";
import {
  useCreateCard,
  useDeleteCard,
  useUpdateCard,
} from "@/lib/hooks/use-kanban";
import { useProfiles } from "@/lib/hooks/use-profiles";
import type { KanbanCard, KanbanPriority } from "@/lib/types";
import { FormEvent, useState } from "react";

const PRIORIDADES = Object.keys(PRIORIDADE_LABELS) as KanbanPriority[];

export function CardDialog({
  open,
  onClose,
  card,
  columnId,
  novaPosicao,
}: {
  open: boolean;
  onClose: () => void;
  card?: KanbanCard;
  columnId?: string;
  novaPosicao?: number;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={card ? "Editar card" : "Novo card"}>
      {open && (
        <CardForm
          card={card}
          columnId={columnId}
          novaPosicao={novaPosicao}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
}

function CardForm({
  card,
  columnId,
  novaPosicao,
  onClose,
}: {
  card?: KanbanCard;
  columnId?: string;
  novaPosicao?: number;
  onClose: () => void;
}) {
  const isEdit = !!card;
  const { data: profiles } = useProfiles();
  const { data: contacts } = useContacts();
  const createCard = useCreateCard();
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();
  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState({
    titulo: card?.titulo ?? "",
    descricao: card?.descricao ?? "",
    responsavel_id: card?.responsavel_id ?? "",
    prazo: card?.prazo ?? "",
    prioridade: card?.prioridade ?? ("media" as KanbanPriority),
    contact_id: card?.contact_id ?? "",
  });

  const pending = createCard.isPending || updateCard.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);

    const payload = {
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim() || null,
      responsavel_id: form.responsavel_id || null,
      prazo: form.prazo || null,
      prioridade: form.prioridade,
      contact_id: form.contact_id || null,
    };

    try {
      if (isEdit) {
        await updateCard.mutateAsync({ id: card.id, ...payload });
      } else if (columnId) {
        await createCard.mutateAsync({
          ...payload,
          column_id: columnId,
          posicao: novaPosicao ?? 0,
        });
      }
      onClose();
    } catch {
      setErro("Não foi possível salvar. Tenta de novo.");
    }
  }

  async function handleDelete() {
    if (!card) return;
    if (!window.confirm(`Excluir o card "${card.titulo}"?`)) return;
    await deleteCard.mutateAsync(card.id);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Título *">
        <Input
          required
          value={form.titulo}
          onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
        />
      </Field>

      <Field label="Descrição">
        <Textarea
          rows={3}
          value={form.descricao}
          onChange={(e) =>
            setForm((f) => ({ ...f, descricao: e.target.value }))
          }
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Responsável">
          <Select
            value={form.responsavel_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, responsavel_id: e.target.value }))
            }
          >
            <option value="">Ninguém</option>
            {profiles?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Prazo">
          <Input
            type="date"
            value={form.prazo}
            onChange={(e) => setForm((f) => ({ ...f, prazo: e.target.value }))}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Prioridade">
          <Select
            value={form.prioridade}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                prioridade: e.target.value as KanbanPriority,
              }))
            }
          >
            {PRIORIDADES.map((p) => (
              <option key={p} value={p}>
                {PRIORIDADE_LABELS[p]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Cliente vinculado">
          <Select
            value={form.contact_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, contact_id: e.target.value }))
            }
          >
            <option value="">Nenhum</option>
            {contacts?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {erro && (
        <p role="alert" className="text-sm text-danger">
          {erro}
        </p>
      )}

      <div className="mt-2 flex justify-between gap-3">
        {isEdit ? (
          <Button type="button" variant="secondary" onClick={handleDelete}>
            Excluir
          </Button>
        ) : (
          <span />
        )}

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
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
