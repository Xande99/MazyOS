"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { ORDEM_COMPRA_STATUS_LABELS } from "@/lib/constants/estoque";
import { useFornecedores } from "@/lib/hooks/use-fornecedores";
import {
  useCreateOrdemCompra,
  useDeleteOrdemCompra,
  useUpdateOrdemCompra,
} from "@/lib/hooks/use-ordens-compra";
import type { OrdemCompra, OrdemCompraStatus } from "@/lib/types";
import { FormEvent, useState } from "react";

const STATUSES = Object.keys(ORDEM_COMPRA_STATUS_LABELS) as OrdemCompraStatus[];

export function OrdemCompraDialog({
  open,
  onClose,
  ordem,
}: {
  open: boolean;
  onClose: () => void;
  ordem?: OrdemCompra;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={ordem ? "Editar ordem de compra" : "Nova ordem de compra"}
    >
      {open && <OrdemCompraForm ordem={ordem} onClose={onClose} />}
    </Dialog>
  );
}

function OrdemCompraForm({
  ordem,
  onClose,
}: {
  ordem?: OrdemCompra;
  onClose: () => void;
}) {
  const isEdit = !!ordem;
  const { data: fornecedores } = useFornecedores();
  const createOrdem = useCreateOrdemCompra();
  const updateOrdem = useUpdateOrdemCompra();
  const deleteOrdem = useDeleteOrdemCompra();
  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState({
    fornecedor_id: ordem?.fornecedor_id ?? "",
    status: ordem?.status ?? ("aberta" as OrdemCompraStatus),
  });

  const pending = createOrdem.isPending || updateOrdem.isPending;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    const payload = {
      fornecedor_id: form.fornecedor_id || null,
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
    if (!window.confirm("Excluir essa ordem de compra?")) return;
    await deleteOrdem.mutateAsync(ordem.id);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Fornecedor *">
        <Select
          required
          value={form.fornecedor_id}
          onChange={(e) =>
            setForm((f) => ({ ...f, fornecedor_id: e.target.value }))
          }
        >
          <option value="">Selecione...</option>
          {fornecedores?.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nome}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Status">
        <Select
          value={form.status}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              status: e.target.value as OrdemCompraStatus,
            }))
          }
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDEM_COMPRA_STATUS_LABELS[s]}
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
