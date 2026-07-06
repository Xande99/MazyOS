"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useContacts } from "@/lib/hooks/use-contacts";
import {
  useCreateEvent,
  useDeleteEvent,
  useUpdateEvent,
} from "@/lib/hooks/use-calendar";
import type { CalendarEvent } from "@/lib/types";
import { parseDateOnly } from "@/lib/utils/date";
import {
  endOfDay,
  startOfDay,
  toDateInputValue,
  toTimeInputValue,
} from "@/lib/utils/calendar";
import { FormEvent, useState } from "react";

export function EventDialog({
  open,
  onClose,
  event,
  dataPadrao,
}: {
  open: boolean;
  onClose: () => void;
  event?: CalendarEvent;
  dataPadrao?: Date;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={event ? "Editar evento" : "Novo evento"}>
      {open && (
        <EventForm event={event} dataPadrao={dataPadrao} onClose={onClose} />
      )}
    </Dialog>
  );
}

function EventForm({
  event,
  dataPadrao,
  onClose,
}: {
  event?: CalendarEvent;
  dataPadrao?: Date;
  onClose: () => void;
}) {
  const isEdit = !!event;
  const { data: contacts } = useContacts();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const [erro, setErro] = useState<string | null>(null);

  const referencia = dataPadrao ?? new Date();
  const inicioInicial = event ? new Date(event.inicio) : referencia;
  const fimInicial = event ? new Date(event.fim) : referencia;

  const [form, setForm] = useState({
    titulo: event?.titulo ?? "",
    descricao: event?.descricao ?? "",
    diaInteiro: event?.dia_inteiro ?? true,
    dataInicio: toDateInputValue(inicioInicial),
    horaInicio: toTimeInputValue(inicioInicial),
    dataFim: toDateInputValue(fimInicial),
    horaFim: toTimeInputValue(fimInicial),
    contact_id: event?.contact_id ?? "",
  });

  const pending = createEvent.isPending || updateEvent.isPending;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    const inicioBase = parseDateOnly(form.dataInicio);
    const fimBase = parseDateOnly(form.dataFim);

    let inicio: Date;
    let fim: Date;

    if (form.diaInteiro) {
      inicio = startOfDay(inicioBase);
      fim = endOfDay(fimBase);
    } else {
      const [hi, mi] = form.horaInicio.split(":").map(Number);
      const [hf, mf] = form.horaFim.split(":").map(Number);
      inicio = new Date(inicioBase);
      inicio.setHours(hi, mi);
      fim = new Date(fimBase);
      fim.setHours(hf, mf);
    }

    if (fim < inicio) {
      setErro("O fim não pode ser antes do início.");
      return;
    }

    const payload = {
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim() || null,
      inicio: inicio.toISOString(),
      fim: fim.toISOString(),
      dia_inteiro: form.diaInteiro,
      contact_id: form.contact_id || null,
    };

    try {
      if (isEdit) {
        await updateEvent.mutateAsync({ id: event.id, ...payload });
      } else {
        await createEvent.mutateAsync(payload);
      }
      onClose();
    } catch {
      setErro("Não foi possível salvar. Tenta de novo.");
    }
  }

  async function handleDelete() {
    if (!event) return;
    if (!window.confirm(`Excluir o evento "${event.titulo}"?`)) return;
    await deleteEvent.mutateAsync(event.id);
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
          rows={2}
          value={form.descricao}
          onChange={(e) =>
            setForm((f) => ({ ...f, descricao: e.target.value }))
          }
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-text">
        <input
          type="checkbox"
          checked={form.diaInteiro}
          onChange={(e) =>
            setForm((f) => ({ ...f, diaInteiro: e.target.checked }))
          }
          className="h-4 w-4 rounded border-border accent-[--color-accent]"
        />
        Dia inteiro
      </label>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Início">
          <div className="flex gap-2">
            <Input
              type="date"
              required
              value={form.dataInicio}
              onChange={(e) =>
                setForm((f) => ({ ...f, dataInicio: e.target.value }))
              }
            />
            {!form.diaInteiro && (
              <Input
                type="time"
                required
                value={form.horaInicio}
                onChange={(e) =>
                  setForm((f) => ({ ...f, horaInicio: e.target.value }))
                }
              />
            )}
          </div>
        </Field>

        <Field label="Fim">
          <div className="flex gap-2">
            <Input
              type="date"
              required
              value={form.dataFim}
              onChange={(e) =>
                setForm((f) => ({ ...f, dataFim: e.target.value }))
              }
            />
            {!form.diaInteiro && (
              <Input
                type="time"
                required
                value={form.horaFim}
                onChange={(e) =>
                  setForm((f) => ({ ...f, horaFim: e.target.value }))
                }
              />
            )}
          </div>
        </Field>
      </div>

      <Field label="Vincular a um contato">
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
