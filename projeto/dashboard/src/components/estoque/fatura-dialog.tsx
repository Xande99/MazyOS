"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FATURA_STATUS_LABELS } from "@/lib/constants/estoque";
import { useContacts } from "@/lib/hooks/use-contacts";
import {
  useCreateFatura,
  useDeleteFatura,
  useUpdateFatura,
} from "@/lib/hooks/use-faturas";
import type { Fatura, FaturaStatus } from "@/lib/types";
import { FormEvent, useState } from "react";

const STATUSES = Object.keys(FATURA_STATUS_LABELS) as FaturaStatus[];

export function FaturaDialog({
  open,
  onClose,
  fatura,
}: {
  open: boolean;
  onClose: () => void;
  fatura?: Fatura;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={fatura ? "Editar fatura" : "Nova fatura"}
    >
      {open && <FaturaForm fatura={fatura} onClose={onClose} />}
    </Dialog>
  );
}

function FaturaForm({
  fatura,
  onClose,
}: {
  fatura?: Fatura;
  onClose: () => void;
}) {
  const isEdit = !!fatura;
  const { data: contacts } = useContacts();
  const createFatura = useCreateFatura();
  const updateFatura = useUpdateFatura();
  const deleteFatura = useDeleteFatura();
  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState({
    contact_id: fatura?.contact_id ?? "",
    valor: fatura?.valor ?? "0",
    vencimento: fatura?.vencimento ?? "",
    status: fatura?.status ?? ("pendente" as FaturaStatus),
  });

  const pending = createFatura.isPending || updateFatura.isPending;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    const payload = {
      contact_id: form.contact_id || null,
      valor: parseFloat(form.valor) || 0,
      vencimento: form.vencimento,
      status: form.status,
    };

    try {
      if (isEdit) {
        await updateFatura.mutateAsync({ id: fatura.id, ...payload });
      } else {
        await createFatura.mutateAsync(payload);
      }
      onClose();
    } catch {
      setErro("Não foi possível salvar. Tenta de novo.");
    }
  }

  async function handleDelete() {
    if (!fatura) return;
    if (!window.confirm("Excluir essa fatura?")) return;
    await deleteFatura.mutateAsync(fatura.id);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Cliente *">
        <Select
          required
          value={form.contact_id}
          onChange={(e) =>
            setForm((f) => ({ ...f, contact_id: e.target.value }))
          }
        >
          <option value="">Selecione...</option>
          {contacts?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Valor *">
          <Input
            type="number"
            step="0.01"
            min="0"
            required
            value={form.valor}
            onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
          />
        </Field>

        <Field label="Vencimento *">
          <Input
            type="date"
            required
            value={form.vencimento}
            onChange={(e) =>
              setForm((f) => ({ ...f, vencimento: e.target.value }))
            }
          />
        </Field>
      </div>

      <Field label="Status">
        <Select
          value={form.status}
          onChange={(e) =>
            setForm((f) => ({ ...f, status: e.target.value as FaturaStatus }))
          }
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {FATURA_STATUS_LABELS[s]}
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
