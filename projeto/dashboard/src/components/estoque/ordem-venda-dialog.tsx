"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { ORDEM_VENDA_STATUS_LABELS } from "@/lib/constants/estoque";
import { useContacts } from "@/lib/hooks/use-contacts";
import {
  useCreateOrdemVenda,
  useDeleteOrdemVenda,
  useUpdateOrdemVenda,
} from "@/lib/hooks/use-ordens-venda";
import type { OrdemVenda, OrdemVendaStatus } from "@/lib/types";
import { FormEvent, useState } from "react";

const STATUSES = Object.keys(ORDEM_VENDA_STATUS_LABELS) as OrdemVendaStatus[];

export function OrdemVendaDialog({
  open,
  onClose,
  ordem,
}: {
  open: boolean;
  onClose: () => void;
  ordem?: OrdemVenda;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={ordem ? "Editar ordem de venda" : "Nova ordem de venda"}
    >
      {open && <OrdemVendaForm ordem={ordem} onClose={onClose} />}
    </Dialog>
  );
}

function OrdemVendaForm({
  ordem,
  onClose,
}: {
  ordem?: OrdemVenda;
  onClose: () => void;
}) {
  const isEdit = !!ordem;
  const { data: contacts } = useContacts();
  const createOrdem = useCreateOrdemVenda();
  const updateOrdem = useUpdateOrdemVenda();
  const deleteOrdem = useDeleteOrdemVenda();
  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState({
    contact_id: ordem?.contact_id ?? "",
    status: ordem?.status ?? ("aberta" as OrdemVendaStatus),
  });

  const pending = createOrdem.isPending || updateOrdem.isPending;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    const payload = {
      contact_id: form.contact_id || null,
      status: form.status,
    };

    try {
      if (isEdit) {
        await updateOrdem.mutateAsync({ id: ordem.id, ...payload });
      } else {
        await createOrdem.mutateAsync(payload);
      }
      onClose();
    } catch {
      setErro("Não foi possível salvar. Tenta de novo.");
    }
  }

  async function handleDelete() {
    if (!ordem) return;
    if (!window.confirm("Excluir essa ordem de venda?")) return;
    await deleteOrdem.mutateAsync(ordem.id);
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

      <Field label="Status">
        <Select
          value={form.status}
          onChange={(e) =>
            setForm((f) => ({ ...f, status: e.target.value as OrdemVendaStatus }))
          }
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDEM_VENDA_STATUS_LABELS[s]}
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
