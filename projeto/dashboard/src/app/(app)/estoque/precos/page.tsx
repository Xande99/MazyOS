"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ResponsiveTable, type ResponsiveTableColumn } from "@/components/ui/responsive-table";
import { Skeleton } from "@/components/ui/skeleton";
import { PriceBookDetailDialog } from "@/components/estoque/price-book-detail-dialog";
import { PriceBookDialog } from "@/components/estoque/price-book-dialog";
import { usePriceBooks } from "@/lib/hooks/use-precos";
import type { LivroPreco } from "@/lib/types";
import { useState } from "react";

const COLUMNS: ResponsiveTableColumn<LivroPreco>[] = [
  { header: "Nome", mobile: "title", cell: (l) => <span className="text-text">{l.nome}</span> },
  {
    header: "Válido de",
    cell: (l) => <span className="text-text-muted">{l.valido_de ?? "—"}</span>,
  },
  {
    header: "Válido até",
    cell: (l) => <span className="text-text-muted">{l.valido_ate ?? "—"}</span>,
  },
];

export default function PrecosPage() {
  const { data: livros, isLoading, isError } = usePriceBooks();
  const [editLivro, setEditLivro] = useState<LivroPreco | undefined>();
  const [detalheLivro, setDetalheLivro] = useState<LivroPreco | undefined>();
  const [criarAberto, setCriarAberto] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <Button
          onClick={() => {
            setEditLivro(undefined);
            setCriarAberto(true);
          }}
        >
          Novo livro de preços
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
          Não foi possível carregar os livros de preços.
        </p>
      )}

      {livros && livros.length === 0 && (
        <EmptyState
          title="Nenhum livro de preços cadastrado"
          description="Crie um livro pra agrupar preços por tabela, cliente ou período."
        />
      )}

      {livros && livros.length > 0 && (
        <ResponsiveTable
          data={livros}
          keyField={(l) => l.id}
          columns={COLUMNS}
          onRowClick={(l) => setDetalheLivro(l)}
        />
      )}

      <PriceBookDialog
        open={criarAberto}
        onClose={() => setCriarAberto(false)}
      />

      <PriceBookDialog
        open={!!editLivro}
        onClose={() => setEditLivro(undefined)}
        livro={editLivro}
      />

      <PriceBookDetailDialog
        livro={detalheLivro}
        open={!!detalheLivro}
        onClose={() => setDetalheLivro(undefined)}
        onEdit={() => {
          setEditLivro(detalheLivro);
          setDetalheLivro(undefined);
        }}
      />
    </div>
  );
}
