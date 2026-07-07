"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ResponsiveTable, type ResponsiveTableColumn } from "@/components/ui/responsive-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ProdutoDialog } from "@/components/estoque/produto-dialog";
import { useFornecedores } from "@/lib/hooks/use-fornecedores";
import { useProdutos } from "@/lib/hooks/use-produtos";
import type { Fornecedor, Produto } from "@/lib/types";
import { formatBRL } from "@/lib/utils/currency";
import { useState } from "react";

function buildColumns(
  fornecedoresById: Map<string, Fornecedor>,
): ResponsiveTableColumn<Produto>[] {
  return [
    { header: "Nome", mobile: "title", cell: (p) => <span className="text-text">{p.nome}</span> },
    {
      header: "SKU",
      mobile: "subtitle",
      cell: (p) => <span className="text-text-muted">{p.sku ?? "—"}</span>,
    },
    {
      header: "Custo",
      cell: (p) => <span className="text-text-muted">{formatBRL(p.preco_custo)}</span>,
    },
    {
      header: "Venda",
      cell: (p) => <span className="text-text-muted">{formatBRL(p.preco_venda)}</span>,
    },
    {
      header: "Estoque",
      cell: (p) => (
        <span className="text-text-muted">
          {p.estoque} {p.unidade}
        </span>
      ),
    },
    {
      header: "Fornecedor",
      cell: (p) => (
        <span className="text-text-muted">
          {p.fornecedor_id ? (fornecedoresById.get(p.fornecedor_id)?.nome ?? "—") : "—"}
        </span>
      ),
    },
  ];
}

export default function ProdutosPage() {
  const [busca, setBusca] = useState("");
  const [editProduto, setEditProduto] = useState<Produto | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: produtos, isLoading, isError } = useProdutos(busca);
  const { data: fornecedores } = useFornecedores();
  const fornecedoresById = new Map((fornecedores ?? []).map((f) => [f.id, f]));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Buscar por nome ou SKU..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="sm:max-w-xs"
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
        <ResponsiveTable
          data={produtos}
          keyField={(p) => p.id}
          columns={buildColumns(fornecedoresById)}
          onRowClick={(p) => {
            setEditProduto(p);
            setDialogOpen(true);
          }}
        />
      )}

      <ProdutoDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        produto={editProduto}
      />
    </div>
  );
}
