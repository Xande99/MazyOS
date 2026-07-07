"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ResponsiveTable, type ResponsiveTableColumn } from "@/components/ui/responsive-table";
import { Skeleton } from "@/components/ui/skeleton";
import { FornecedorDialog } from "@/components/estoque/fornecedor-dialog";
import { useFornecedores } from "@/lib/hooks/use-fornecedores";
import type { Fornecedor } from "@/lib/types";
import { useState } from "react";

const COLUMNS: ResponsiveTableColumn<Fornecedor>[] = [
  { header: "Nome", mobile: "title", cell: (f) => <span className="text-text">{f.nome}</span> },
  {
    header: "Telefone",
    mobile: "subtitle",
    cell: (f) => <span className="text-text-muted">{f.telefone ?? "—"}</span>,
  },
  {
    header: "E-mail",
    cell: (f) => <span className="text-text-muted">{f.email ?? "—"}</span>,
  },
];

export default function FornecedoresPage() {
  const [busca, setBusca] = useState("");
  const [editFornecedor, setEditFornecedor] = useState<Fornecedor | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: fornecedores, isLoading, isError } = useFornecedores(busca);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Buscar fornecedor..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="sm:max-w-xs"
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
        <ResponsiveTable
          data={fornecedores}
          keyField={(f) => f.id}
          columns={COLUMNS}
          onRowClick={(f) => {
            setEditFornecedor(f);
            setDialogOpen(true);
          }}
        />
      )}

      <FornecedorDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fornecedor={editFornecedor}
      />
    </div>
  );
}
