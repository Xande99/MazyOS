"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeletePriceBookItem,
  usePriceBookItems,
  useSetPriceBookItem,
} from "@/lib/hooks/use-precos";
import { useProdutos } from "@/lib/hooks/use-produtos";
import type { LivroPreco } from "@/lib/types";
import { formatBRL } from "@/lib/utils/currency";
import { FormEvent, useState } from "react";

export function PriceBookDetailDialog({
  livro,
  open,
  onClose,
  onEdit,
}: {
  livro: LivroPreco | undefined;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={livro?.nome ?? "Livro de preços"}
      className="max-w-xl"
    >
      {open && livro && (
        <PriceBookItemsManager key={livro.id} livro={livro} onEdit={onEdit} />
      )}
    </Dialog>
  );
}

function PriceBookItemsManager({
  livro,
  onEdit,
}: {
  livro: LivroPreco;
  onEdit: () => void;
}) {
  const { data: items, isLoading, isError } = usePriceBookItems(livro.id);
  const { data: produtos } = useProdutos();
  const setItem = useSetPriceBookItem(livro.id);
  const deleteItem = useDeletePriceBookItem(livro.id);

  const [produtoId, setProdutoId] = useState("");
  const [preco, setPreco] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const produtosById = new Map((produtos ?? []).map((p) => [p.id, p]));
  const idsJaAdicionados = new Set((items ?? []).map((i) => i.produto_id));
  const produtosDisponiveis = (produtos ?? []).filter(
    (p) => !idsJaAdicionados.has(p.id),
  );

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    if (!produtoId || !preco) return;
    try {
      await setItem.mutateAsync({
        produto_id: produtoId,
        preco: parseFloat(preco),
      });
      setProdutoId("");
      setPreco("");
    } catch {
      setErro("Não foi possível adicionar o item.");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between text-sm text-text-muted">
        <span>
          {livro.valido_de ? `De ${livro.valido_de}` : "Sem data de início"}
          {livro.valido_ate ? ` até ${livro.valido_ate}` : ""}
        </span>
        <Button variant="secondary" onClick={onEdit}>
          Editar
        </Button>
      </div>

      {isLoading && <Skeleton className="h-24 w-full" />}
      {isError && (
        <p className="text-sm text-danger">
          Não foi possível carregar os itens.
        </p>
      )}

      {items && items.length === 0 && (
        <EmptyState title="Nenhum produto nesse livro ainda." />
      )}

      {items && items.length > 0 && (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm"
            >
              <span className="text-text">
                {produtosById.get(item.produto_id)?.nome ?? "Produto removido"}
              </span>
              <div className="flex items-center gap-3">
                <Badge variant="accent">{formatBRL(item.preco)}</Badge>
                <button
                  type="button"
                  onClick={() => deleteItem.mutate(item.id)}
                  className="text-xs text-text-muted hover:text-danger"
                >
                  remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleAdd}
        className="flex items-end gap-3 border-t border-border pt-4"
      >
        <Field label="Produto" className="flex-1">
          <Select
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
          >
            <option value="">Selecione...</option>
            {produtosDisponiveis.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Preço" className="w-32">
          <Input
            type="number"
            step="0.01"
            min="0"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </Field>
        <Button
          type="submit"
          disabled={!produtoId || !preco || setItem.isPending}
        >
          Adicionar
        </Button>
      </form>
      {erro && (
        <p role="alert" className="text-sm text-danger">
          {erro}
        </p>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className ?? ""}`}>
      <span className="text-text-muted">{label}</span>
      {children}
    </label>
  );
}
