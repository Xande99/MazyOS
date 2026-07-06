"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import type { NovoPedidoItem } from "@/lib/hooks/use-pedido-itens";
import type { PedidoItem, Produto } from "@/lib/types";
import { formatBRL } from "@/lib/utils/currency";
import { FormEvent, useState } from "react";

export function ItensEditor({
  itens,
  isLoading,
  produtos,
  precoPadrao,
  total,
  onAdd,
  onUpdate,
  onRemove,
}: {
  itens: PedidoItem[] | undefined;
  isLoading: boolean;
  produtos: Produto[] | undefined;
  precoPadrao: (produto: Produto) => string;
  total: string;
  onAdd: (item: NovoPedidoItem) => Promise<unknown>;
  onUpdate: (id: string, patch: Partial<NovoPedidoItem>) => void;
  onRemove: (id: string) => void;
}) {
  const [produtoId, setProdutoId] = useState("");
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [erro, setErro] = useState<string | null>(null);
  const [adicionando, setAdicionando] = useState(false);

  function selecionarProduto(id: string) {
    setProdutoId(id);
    const produto = produtos?.find((p) => p.id === id);
    if (produto) {
      setNome(produto.nome);
      setPreco(precoPadrao(produto));
    }
  }

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    if (!nome.trim() || !preco) return;

    setAdicionando(true);
    try {
      await onAdd({
        produto_id: produtoId || null,
        nome_produto: nome.trim(),
        preco_unitario: parseFloat(preco) || 0,
        quantidade: parseFloat(quantidade) || 1,
      });
      setProdutoId("");
      setNome("");
      setPreco("");
      setQuantidade("1");
    } catch {
      setErro("Não foi possível adicionar o item.");
    } finally {
      setAdicionando(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <Skeleton className="h-20 w-full" />}

      {!isLoading && itens?.length === 0 && (
        <EmptyState title="Nenhum item adicionado ainda." />
      )}

      {itens && itens.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">Item</th>
                <th className="px-3 py-2 font-medium">Preço</th>
                <th className="px-3 py-2 font-medium">Qtd.</th>
                <th className="px-3 py-2 font-medium">Subtotal</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-3 py-2 text-text">{item.nome_produto}</td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={item.preco_unitario}
                      onBlur={(e) =>
                        onUpdate(item.id, {
                          preco_unitario: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-24"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={item.quantidade}
                      onBlur={(e) =>
                        onUpdate(item.id, {
                          quantidade: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-20"
                    />
                  </td>
                  <td className="px-3 py-2 text-text-muted">
                    {formatBRL(item.subtotal)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="text-xs text-text-muted hover:text-danger"
                    >
                      remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-border bg-surface-2">
                <td className="px-3 py-2 font-medium text-text" colSpan={3}>
                  Total
                </td>
                <td className="px-3 py-2 font-medium text-text" colSpan={2}>
                  {formatBRL(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <form
        onSubmit={handleAdd}
        className="flex flex-wrap items-end gap-3 border-t border-border pt-4"
      >
        <label className="flex flex-1 min-w-[160px] flex-col gap-1.5 text-sm">
          <span className="text-text-muted">Produto do catálogo</span>
          <Select
            value={produtoId}
            onChange={(e) => selecionarProduto(e.target.value)}
          >
            <option value="">Item avulso</option>
            {produtos?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </Select>
        </label>

        <label className="flex flex-1 min-w-[160px] flex-col gap-1.5 text-sm">
          <span className="text-text-muted">Nome *</span>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} required />
        </label>

        <label className="flex w-28 flex-col gap-1.5 text-sm">
          <span className="text-text-muted">Preço *</span>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />
        </label>

        <label className="flex w-20 flex-col gap-1.5 text-sm">
          <span className="text-text-muted">Qtd.</span>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />
        </label>

        <Button type="submit" disabled={adicionando}>
          {adicionando ? "Adicionando..." : "Adicionar"}
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
