"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFornecedores } from "@/lib/hooks/use-fornecedores";
import {
  useCreateProduto,
  useDeleteProduto,
  useUpdateProduto,
} from "@/lib/hooks/use-produtos";
import type { Produto } from "@/lib/types";
import { FormEvent, useState } from "react";

export function ProdutoDialog({
  open,
  onClose,
  produto,
}: {
  open: boolean;
  onClose: () => void;
  produto?: Produto;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={produto ? "Editar produto" : "Novo produto"}
    >
      {open && <ProdutoForm produto={produto} onClose={onClose} />}
    </Dialog>
  );
}

function ProdutoForm({
  produto,
  onClose,
}: {
  produto?: Produto;
  onClose: () => void;
}) {
  const isEdit = !!produto;
  const { data: fornecedores } = useFornecedores();
  const createProduto = useCreateProduto();
  const updateProduto = useUpdateProduto();
  const deleteProduto = useDeleteProduto();
  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState({
    sku: produto?.sku ?? "",
    nome: produto?.nome ?? "",
    descricao: produto?.descricao ?? "",
    unidade: produto?.unidade ?? "un",
    preco_custo: produto?.preco_custo ?? "0",
    preco_venda: produto?.preco_venda ?? "0",
    estoque: produto?.estoque ?? "0",
    fornecedor_id: produto?.fornecedor_id ?? "",
  });

  const pending = createProduto.isPending || updateProduto.isPending;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    const payload = {
      sku: form.sku.trim() || null,
      nome: form.nome.trim(),
      descricao: form.descricao.trim() || null,
      unidade: form.unidade.trim() || "un",
      preco_custo: parseFloat(form.preco_custo) || 0,
      preco_venda: parseFloat(form.preco_venda) || 0,
      estoque: parseFloat(form.estoque) || 0,
      fornecedor_id: form.fornecedor_id || null,
    };

    try {
      if (isEdit) {
        await updateProduto.mutateAsync({ id: produto.id, ...payload });
      } else {
        await createProduto.mutateAsync(payload);
      }
      onClose();
    } catch {
      setErro("Não foi possível salvar. Tenta de novo.");
    }
  }

  async function handleDelete() {
    if (!produto) return;
    if (!window.confirm(`Excluir o produto "${produto.nome}"?`)) return;
    await deleteProduto.mutateAsync(produto.id);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nome *">
          <Input
            required
            value={form.nome}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
          />
        </Field>

        <Field label="SKU">
          <Input
            value={form.sku}
            onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
          />
        </Field>
      </div>

      <Field label="Descrição">
        <Textarea
          rows={2}
          value={form.descricao}
          onChange={(e) =>
            setForm((f) => ({ ...f, descricao: e.target.value }))
          }
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Unidade">
          <Input
            value={form.unidade}
            onChange={(e) =>
              setForm((f) => ({ ...f, unidade: e.target.value }))
            }
            placeholder="un, kg, h..."
          />
        </Field>

        <Field label="Fornecedor">
          <Select
            value={form.fornecedor_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, fornecedor_id: e.target.value }))
            }
          >
            <option value="">Nenhum</option>
            {fornecedores?.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Preço de custo">
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.preco_custo}
            onChange={(e) =>
              setForm((f) => ({ ...f, preco_custo: e.target.value }))
            }
          />
        </Field>

        <Field label="Preço de venda">
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.preco_venda}
            onChange={(e) =>
              setForm((f) => ({ ...f, preco_venda: e.target.value }))
            }
          />
        </Field>

        <Field label="Estoque">
          <Input
            type="number"
            step="0.01"
            value={form.estoque}
            onChange={(e) =>
              setForm((f) => ({ ...f, estoque: e.target.value }))
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
