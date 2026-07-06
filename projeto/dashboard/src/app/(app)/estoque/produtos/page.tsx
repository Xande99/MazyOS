"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ProdutoDialog } from "@/components/estoque/produto-dialog";
import { useFornecedores } from "@/lib/hooks/use-fornecedores";
import { useProdutos } from "@/lib/hooks/use-produtos";
import type { Produto } from "@/lib/types";
import { formatBRL } from "@/lib/utils/currency";
import { useState } from "react";

export default function ProdutosPage() {
  const [busca, setBusca] = useState("");
  const [editProduto, setEditProduto] = useState<Produto | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: produtos, isLoading, isError } = useProdutos(busca);
  const { data: fornecedores } = useFornecedores();
  const fornecedoresById = new Map((fornecedores ?? []).map((f) => [f.id, f]));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Buscar por nome ou SKU..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-xs"
        />
        <Button
          onClick={() => {
            setEditProduto(undefined);
            setDialogOpen(true);
          }}
        >
          Novo produto
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-danger">
          Não foi possível carregar os produtos.
        </p>
      )}

      {produtos && produtos.length === 0 && (
        <EmptyState
          title="Nenhum produto cadastrado"
          description="Cadastre o primeiro produto."
        />
      )}

      {produtos && produtos.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Nome</th>
                <th className="px-4 py-2 font-medium">SKU</th>
                <th className="px-4 py-2 font-medium">Custo</th>
                <th className="px-4 py-2 font-medium">Venda</th>
                <th className="px-4 py-2 font-medium">Estoque</th>
                <th className="px-4 py-2 font-medium">Fornecedor</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr
                  key={produto.id}
                  onClick={() => {
                    setEditProduto(produto);
                    setDialogOpen(true);
                  }}
                  className="cursor-pointer border-t border-border hover:bg-surface-2"
                >
                  <td className="px-4 py-2.5 text-text">{produto.nome}</td>
                  <td className="px-4 py-2.5 text-text-muted">
                    {produto.sku ?? "—"}
                  </td>
                  <td className="px-4 py-2.5 text-text-muted">
                    {formatBRL(produto.preco_custo)}
                  </td>
                  <td className="px-4 py-2.5 text-text-muted">
                    {formatBRL(produto.preco_venda)}
                  </td>
                  <td className="px-4 py-2.5 text-text-muted">
                    {produto.estoque} {produto.unidade}
                  </td>
                  <td className="px-4 py-2.5 text-text-muted">
                    {produto.fornecedor_id
                      ? (fornecedoresById.get(produto.fornecedor_id)?.nome ?? "—")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProdutoDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        produto={editProduto}
      />
    </div>
  );
}
