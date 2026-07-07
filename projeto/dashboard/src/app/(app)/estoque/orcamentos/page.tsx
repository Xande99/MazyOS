"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ResponsiveTable, type ResponsiveTableColumn } from "@/components/ui/responsive-table";
import { Skeleton } from "@/components/ui/skeleton";
import { OrcamentoDetailDialog } from "@/components/estoque/orcamento-detail-dialog";
import { OrcamentoDialog } from "@/components/estoque/orcamento-dialog";
import {
  ORCAMENTO_STATUS_BADGE,
  ORCAMENTO_STATUS_LABELS,
} from "@/lib/constants/estoque";
import { useContacts } from "@/lib/hooks/use-contacts";
import { useOrcamento, useOrcamentos } from "@/lib/hooks/use-orcamentos";
import type { Contact, Orcamento } from "@/lib/types";
import { formatBRL } from "@/lib/utils/currency";
import { useState } from "react";

function buildColumns(
  contactsById: Map<string, Contact>,
): ResponsiveTableColumn<Orcamento>[] {
  return [
    {
      header: "Cliente",
      mobile: "title",
      cell: (o) => (
        <span className="text-text">
          {o.contact_id ? (contactsById.get(o.contact_id)?.nome ?? "—") : "—"}
        </span>
      ),
    },
    {
      header: "Status",
      mobile: "subtitle",
      cell: (o) => (
        <Badge variant={ORCAMENTO_STATUS_BADGE[o.status]}>
          {ORCAMENTO_STATUS_LABELS[o.status]}
        </Badge>
      ),
    },
    {
      header: "Validade",
      cell: (o) => <span className="text-text-muted">{o.validade ?? "—"}</span>,
    },
    {
      header: "Total",
      cell: (o) => <span className="text-text-muted">{formatBRL(o.total)}</span>,
    },
  ];
}

export default function OrcamentosPage() {
  const { data: orcamentos, isLoading, isError } = useOrcamentos();
  const { data: contacts } = useContacts();
  const contactsById = new Map((contacts ?? []).map((c) => [c.id, c]));

  const [editId, setEditId] = useState<string | null>(null);
  const [detalheId, setDetalheId] = useState<string | null>(null);
  const [criarAberto, setCriarAberto] = useState(false);

  const { data: orcamentoEmEdicao } = useOrcamento(editId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <Button onClick={() => setCriarAberto(true)}>Novo orçamento</Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-danger">
          Não foi possível carregar os orçamentos.
        </p>
      )}

      {orcamentos && orcamentos.length === 0 && (
        <EmptyState
          title="Nenhum orçamento criado"
          description="Crie o primeiro orçamento pra um cliente."
        />
      )}

      {orcamentos && orcamentos.length > 0 && (
        <ResponsiveTable
          data={orcamentos}
          keyField={(o) => o.id}
          columns={buildColumns(contactsById)}
          onRowClick={(o) => setDetalheId(o.id)}
        />
      )}

      <OrcamentoDialog open={criarAberto} onClose={() => setCriarAberto(false)} />

      <OrcamentoDialog
        open={!!editId}
        onClose={() => setEditId(null)}
        orcamento={orcamentoEmEdicao}
      />

      <OrcamentoDetailDialog
        orcamentoId={detalheId}
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
