"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ResponsiveTable, type ResponsiveTableColumn } from "@/components/ui/responsive-table";
import { Skeleton } from "@/components/ui/skeleton";
import { OrdemCompraDetailDialog } from "@/components/estoque/ordem-compra-detail-dialog";
import { OrdemCompraDialog } from "@/components/estoque/ordem-compra-dialog";
import {
  ORDEM_COMPRA_STATUS_BADGE,
  ORDEM_COMPRA_STATUS_LABELS,
} from "@/lib/constants/estoque";
import { useFornecedores } from "@/lib/hooks/use-fornecedores";
import { useOrdemCompra, useOrdensCompra } from "@/lib/hooks/use-ordens-compra";
import type { Fornecedor, OrdemCompra } from "@/lib/types";
import { formatBRL } from "@/lib/utils/currency";
import { useState } from "react";

function buildColumns(
  fornecedoresById: Map<string, Fornecedor>,
): ResponsiveTableColumn<OrdemCompra>[] {
  return [
    {
      header: "Fornecedor",
      mobile: "title",
      cell: (o) => (
        <span className="text-text">
          {o.fornecedor_id ? (fornecedoresById.get(o.fornecedor_id)?.nome ?? "—") : "—"}
        </span>
      ),
    },
    {
      header: "Status",
      mobile: "subtitle",
      cell: (o) => (
        <Badge variant={ORDEM_COMPRA_STATUS_BADGE[o.status]}>
          {ORDEM_COMPRA_STATUS_LABELS[o.status]}
        </Badge>
      ),
    },
    {
      header: "Total",
      cell: (o) => <span className="text-text-muted">{formatBRL(o.total)}</span>,
    },
  ];
}

export default function OrdensCompraPage() {
  const { data: ordens, isLoading, isError } = useOrdensCompra();
  const { data: fornecedores } = useFornecedores();
  const fornecedoresById = new Map((fornecedores ?? []).map((f) => [f.id, f]));

  const [editId, setEditId] = useState<string | null>(null);
  const [detalheId, setDetalheId] = useState<string | null>(null);
  const [criarAberto, setCriarAberto] = useState(false);

  const { data: ordemEmEdicao } = useOrdemCompra(editId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <Button onClick={() => setCriarAberto(true)}>Nova ordem de compra</Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-danger">
          Não foi possível carregar as ordens de compra.
        </p>
      )}

      {ordens && ordens.length === 0 && (
        <EmptyState
          title="Nenhuma ordem de compra criada"
          description="Crie uma ordem pra registrar uma compra de fornecedor."
        />
      )}

      {ordens && ordens.length > 0 && (
        <ResponsiveTable
          data={ordens}
          keyField={(o) => o.id}
          columns={buildColumns(fornecedoresById)}
          onRowClick={(o) => setDetalheId(o.id)}
        />
      )}

      <OrdemCompraDialog open={criarAberto} onClose={() => setCriarAberto(false)} />

      <OrdemCompraDialog
        open={!!editId}
        onClose={() => setEditId(null)}
        ordem={ordemEmEdicao}
      />

      <OrdemCompraDetailDialog
        ordemId={detalheId}
        open={!!detalheId}
        onClose={() => setDetalheId(null)}
        onEdit={() => {
          if (detalheId) {
            setEditId(detalheId);
            setDetalheId(null);
          }
        }}
      />
    </div>
  );
}
