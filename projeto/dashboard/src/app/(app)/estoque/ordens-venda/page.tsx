"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ResponsiveTable, type ResponsiveTableColumn } from "@/components/ui/responsive-table";
import { Skeleton } from "@/components/ui/skeleton";
import { OrdemVendaDetailDialog } from "@/components/estoque/ordem-venda-detail-dialog";
import { OrdemVendaDialog } from "@/components/estoque/ordem-venda-dialog";
import {
  ORDEM_VENDA_STATUS_BADGE,
  ORDEM_VENDA_STATUS_LABELS,
} from "@/lib/constants/estoque";
import { useContacts } from "@/lib/hooks/use-contacts";
import { useOrdemVenda, useOrdensVenda } from "@/lib/hooks/use-ordens-venda";
import type { Contact, OrdemVenda } from "@/lib/types";
import { formatBRL } from "@/lib/utils/currency";
import { useState } from "react";

function buildColumns(
  contactsById: Map<string, Contact>,
): ResponsiveTableColumn<OrdemVenda>[] {
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
        <Badge variant={ORDEM_VENDA_STATUS_BADGE[o.status]}>
          {ORDEM_VENDA_STATUS_LABELS[o.status]}
        </Badge>
      ),
    },
    {
      header: "Total",
      cell: (o) => <span className="text-text-muted">{formatBRL(o.total)}</span>,
    },
  ];
}

export default function OrdensVendaPage() {
  const { data: ordens, isLoading, isError } = useOrdensVenda();
  const { data: contacts } = useContacts();
  const contactsById = new Map((contacts ?? []).map((c) => [c.id, c]));

  const [editId, setEditId] = useState<string | null>(null);
  const [detalheId, setDetalheId] = useState<string | null>(null);
  const [criarAberto, setCriarAberto] = useState(false);

  const { data: ordemEmEdicao } = useOrdemVenda(editId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <Button onClick={() => setCriarAberto(true)}>Nova ordem de venda</Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-danger">
          Não foi possível carregar as ordens de venda.
        </p>
      )}

      {ordens && ordens.length === 0 && (
        <EmptyState
          title="Nenhuma ordem de venda criada"
          description="Crie manualmente ou gere a partir de um orçamento aprovado."
        />
      )}

      {ordens && ordens.length > 0 && (
        <ResponsiveTable
          data={ordens}
          keyField={(o) => o.id}
          columns={buildColumns(contactsById)}
          onRowClick={(o) => setDetalheId(o.id)}
        />
      )}

      <OrdemVendaDialog open={criarAberto} onClose={() => setCriarAberto(false)} />

      <OrdemVendaDialog
        open={!!editId}
        onClose={() => setEditId(null)}
        ordem={ordemEmEdicao}
      />

      <OrdemVendaDetailDialog
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
