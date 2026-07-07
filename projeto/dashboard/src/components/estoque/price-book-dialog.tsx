"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useCreatePriceBook,
  useDeletePriceBook,
  useUpdatePriceBook,
} from "@/lib/hooks/use-precos";
import type { LivroPreco } from "@/lib/types";
import { FormEvent, useState } from "react";

export function PriceBookDialog({
  open,
  onClose,
  livro,
}: {
  open: boolean;
  onClose: () => void;
  livro?: LivroPreco;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={livro ? "Editar livro de preços" : "Novo livro de preços"}
    >
      {open && <PriceBookForm livro={livro} onClose={onClose} />}
    </Dialog>
  );
}

function PriceBookForm({
  livro,
  onClose,
}: {
  livro?: LivroPreco;
  onClose: () => void;
}) {
  const isEdit = !!livro;
  const createLivro = useCreatePriceBook();
  const updateLivro = useUpdatePriceBook();
  const deleteLivro = useDeletePriceBook();
  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState({
    nome: livro?.nome ?? "",
    valido_de: livro?.valido_de ?? "",
    valido_ate: livro?.valido_ate ?? "",
  });

  const pending = createLivro.isPending || updateLivro.isPending;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    const payload = {
      nome: form.nome.trim(),
      valido_de: form.valido_de || null,
      valido_ate: form.valido_ate || null,
    };

    try {
      if (isEdit) {
        await updateLivro.mutateAsync({ id: livro.id, ...payload });
      } else {
        await createLivro.mutateAsync(payload);
      }
      onClose();
    } catch {
      setErro("Não foi possível salvar. Tenta de novo.");
    }
  }

  async function handleDelete() {
    if (!livro) return;
    if (!window.confirm(`Excluir o livro de preços "${livro.nome}"?`)) return;
    await deleteLivro.mutateAsync(livro.id);
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Válido de">
          <Input
            type="date"
            value={form.valido_de}
            onChange={(e) =>
              setForm((f) => ({ ...f, valido_de: e.target.value }))
            }
          />
        </Field>

        <Field label="Válido até">
          <Input
            type="date"
            value={form.valido_ate}
            onChange={(e) =>
              setForm((f) => ({ ...f, valido_ate: e.target.value }))
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
