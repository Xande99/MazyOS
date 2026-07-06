"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateFornecedor,
  useDeleteFornecedor,
  useUpdateFornecedor,
} from "@/lib/hooks/use-fornecedores";
import type { Fornecedor } from "@/lib/types";
import { FormEvent, useState } from "react";

export function FornecedorDialog({
  open,
  onClose,
  fornecedor,
}: {
  open: boolean;
  onClose: () => void;
  fornecedor?: Fornecedor;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={fornecedor ? "Editar fornecedor" : "Novo fornecedor"}
    >
      {open && <FornecedorForm fornecedor={fornecedor} onClose={onClose} />}
    </Dialog>
  );
}

function FornecedorForm({
  fornecedor,
  onClose,
}: {
  fornecedor?: Fornecedor;
  onClose: () => void;
}) {
  const isEdit = !!fornecedor;
  const createFornecedor = useCreateFornecedor();
  const updateFornecedor = useUpdateFornecedor();
  const deleteFornecedor = useDeleteFornecedor();
  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState({
    nome: fornecedor?.nome ?? "",
    telefone: fornecedor?.telefone ?? "",
    email: fornecedor?.email ?? "",
    endereco: fornecedor?.endereco ?? "",
    notas: fornecedor?.notas ?? "",
  });

  const pending = createFornecedor.isPending || updateFornecedor.isPending;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    const payload = {
      nome: form.nome.trim(),
      telefone: form.telefone.trim() || null,
      email: form.email.trim() || null,
      endereco: form.endereco.trim() || null,
      notas: form.notas.trim() || null,
    };

    try {
      if (isEdit) {
        await updateFornecedor.mutateAsync({ id: fornecedor.id, ...payload });
      } else {
        await createFornecedor.mutateAsync(payload);
      }
      onClose();
    } catch {
      setErro("Não foi possível salvar. Tenta de novo.");
    }
  }

  async function handleDelete() {
    if (!fornecedor) return;
    if (!window.confirm(`Excluir o fornecedor "${fornecedor.nome}"?`)) return;
    await deleteFornecedor.mutateAsync(fornecedor.id);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Nome *">
        <Input
          required
          value={form.nome}
          onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Telefone / WhatsApp">
          <Input
            value={form.telefone}
            onChange={(e) =>
              setForm((f) => ({ ...f, telefone: e.target.value }))
            }
          />
        </Field>

        <Field label="E-mail">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
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
