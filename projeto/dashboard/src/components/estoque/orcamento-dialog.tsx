"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ORCAMENTO_STATUS_LABELS } from "@/lib/constants/estoque";
import { useContacts } from "@/lib/hooks/use-contacts";
import {
  useCreateOrcamento,
  useDeleteOrcamento,
  useUpdateOrcamento,
} from "@/lib/hooks/use-orcamentos";
import type { Orcamento, OrcamentoStatus } from "@/lib/types";
import { FormEvent, useState } from "react";

const STATUSES = Object.keys(ORCAMENTO_STATUS_LABELS) as OrcamentoStatus[];

export function OrcamentoDialog({
  open,
  onClose,
  orcamento,
}: {
  open: boolean;
  onClose: () => void;
  orcamento?: Orcamento;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={orcamento ? "Editar orçamento" : "Novo orçamento"}
    >
      {open && <OrcamentoForm orcamento={orcamento} onClose={onClose} />}
    </Dialog>
  );
}

function OrcamentoForm({
  orcamento,
  onClose,
}: {
  orcamento?: Orcamento;
  onClose: () => void;
}) {
  const isEdit = !!orcamento;
  const { data: contacts } = useContacts();
  const createOrcamento = useCreateOrcamento();
  const updateOrcamento = useUpdateOrcamento();
  const deleteOrcamento = useDeleteOrcamento();
  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState({
    contact_id: orcamento?.contact_id ?? "",
    status: orcamento?.status ?? ("rascunho" as OrcamentoStatus),
    validade: orcamento?.validade ?? "",
  });

  const pending = createOrcamento.isPending || updateOrcamento.isPending;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    const payload = {
      contact_id: form.contact_id || null,
      status: form.status,
      validade: form.validade || null,
    };

    try {
      if (isEdit) {
        await updateOrcamento.mutateAsync({ id: orcamento.id, ...payload });
      } else {
        await createOrcamento.mutateAsync(payload);
      }
      onClose();
    } catch {
      setErro("Não foi possível salvar. Tenta de novo.");
    }
  }

  async function handleDelete() {
    if (!orcamento) return;
    if (!window.confirm("Excluir esse orçamento?")) return;
    await deleteOrcamento.mutateAsync(orcamento.id);
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

      <div className="grid grid-cols-2 gap-4">
        <Field label="Status">
          <Select
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                status: e.target.value as OrcamentoStatus,
              }))
            }
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {ORCAMENTO_STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Validade">
          <Input
            type="date"
            value={form.validade}
            onChange={(e) =>
              setForm((f) => ({ ...f, validade: e.target.value }))
            }
          />
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
