"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { PriceBookDetailDialog } from "@/components/estoque/price-book-detail-dialog";
import { PriceBookDialog } from "@/components/estoque/price-book-dialog";
import { usePriceBooks } from "@/lib/hooks/use-precos";
import type { LivroPreco } from "@/lib/types";
import { useState } from "react";

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
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Nome</th>
                <th className="px-4 py-2 font-medium">Válido de</th>
                <th className="px-4 py-2 font-medium">Válido até</th>
              </tr>
            </thead>
            <tbody>
              {livros.map((livro) => (
                <tr
                  key={livro.id}
                  onClick={() => setDetalheLivro(livro)}
                  className="cursor-pointer border-t border-border hover:bg-surface-2"
                >
                  <td className="px-4 py-2.5 text-text">{livro.nome}</td>
                  <td className="px-4 py-2.5 text-text-muted">
                    {livro.valido_de ?? "—"}
                  </td>
                  <td className="px-4 py-2.5 text-text-muted">
                    {livro.valido_ate ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
