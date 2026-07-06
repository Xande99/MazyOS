"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FornecedorDialog } from "@/components/estoque/fornecedor-dialog";
import { useFornecedores } from "@/lib/hooks/use-fornecedores";
import type { Fornecedor } from "@/lib/types";
import { useState } from "react";

export default function FornecedoresPage() {
  const [busca, setBusca] = useState("");
  const [editFornecedor, setEditFornecedor] = useState<Fornecedor | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: fornecedores, isLoading, isError } = useFornecedores(busca);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Buscar fornecedor..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-xs"
        />
        <Button
          onClick={() => {
            setEditFornecedor(undefined);
            setDialogOpen(true);
          }}
        >
          Novo fornecedor
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
          Não foi possível carregar os fornecedores.
        </p>
      )}

      {fornecedores && fornecedores.length === 0 && (
        <EmptyState
          title="Nenhum fornecedor cadastrado"
          description="Cadastre o primeiro fornecedor."
        />
      )}

      {fornecedores && fornecedores.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Nome</th>
                <th className="px-4 py-2 font-medium">Telefone</th>
                <th className="px-4 py-2 font-medium">E-mail</th>
              </tr>
            </thead>
            <tbody>
              {fornecedores.map((fornecedor) => (
                <tr
                  key={fornecedor.id}
                  onClick={() => {
                    setEditFornecedor(fornecedor);
                    setDialogOpen(true);
                  }}
                  className="cursor-pointer border-t border-border hover:bg-surface-2"
                >
                  <td className="px-4 py-2.5 text-text">{fornecedor.nome}</td>
                  <td className="px-4 py-2.5 text-text-muted">
                    {fornecedor.telefone ?? "—"}
                  </td>
                  <td className="px-4 py-2.5 text-text-muted">
                    {fornecedor.email ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FornecedorDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fornecedor={editFornecedor}
      />
    </div>
  );
}
