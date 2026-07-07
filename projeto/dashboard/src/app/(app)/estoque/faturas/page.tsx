"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ResponsiveTable, type ResponsiveTableColumn } from "@/components/ui/responsive-table";
import { Skeleton } from "@/components/ui/skeleton";
import { FaturaDialog } from "@/components/estoque/fatura-dialog";
import { useContacts } from "@/lib/hooks/use-contacts";
import { useFaturas, useMarcarFaturaPaga } from "@/lib/hooks/use-faturas";
import type { Contact, Fatura } from "@/lib/types";
import { formatBRL } from "@/lib/utils/currency";
import { startOfDay } from "@/lib/utils/calendar";
import { parseDateOnly } from "@/lib/utils/date";
import { useState } from "react";

function estaAtrasada(fatura: Fatura) {
  return fatura.status === "pendente" && parseDateOnly(fatura.vencimento) < startOfDay(new Date());
}

function buildColumns(
  contactsById: Map<string, Contact>,
  marcarPago: ReturnType<typeof useMarcarFaturaPaga>,
): ResponsiveTableColumn<Fatura>[] {
  return [
    {
      header: "Cliente",
      mobile: "title",
      cell: (f) => (
        <span className="text-text">
          {f.contact_id ? (contactsById.get(f.contact_id)?.nome ?? "—") : "—"}
        </span>
      ),
    },
    {
      header: "Status",
      mobile: "subtitle",
      cell: (f) =>
        f.status === "pago" ? (
          <Badge variant="success">Pago</Badge>
        ) : estaAtrasada(f) ? (
          <Badge variant="danger">Atrasado</Badge>
        ) : (
          <Badge variant="warning">Pendente</Badge>
        ),
    },
    {
      header: "Valor",
      cell: (f) => <span className="text-text-muted">{formatBRL(f.valor)}</span>,
    },
    {
      header: "Vencimento",
      cell: (f) => <span className="text-text-muted">{f.vencimento}</span>,
    },
    {
      header: "",
      cell: (f) =>
        f.status === "pendente" ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              marcarPago.mutate(f.id);
            }}
            className="min-h-11 text-xs text-text-muted hover:text-success"
          >
            marcar como pago
          </button>
        ) : null,
    },
  ];
}

export default function FaturasPage() {
  const { data: faturas, isLoading, isError } = useFaturas();
  const { data: contacts } = useContacts();
  const contactsById = new Map((contacts ?? []).map((c) => [c.id, c]));
  const marcarPago = useMarcarFaturaPaga();

  const [editFatura, setEditFatura] = useState<Fatura | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <Button
          onClick={() => {
            setEditFatura(undefined);
            setDialogOpen(true);
          }}
        >
          Nova fatura
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
          Não foi possível carregar as faturas.
        </p>
      )}

      {faturas && faturas.length === 0 && (
        <EmptyState
          title="Nenhuma fatura criada"
          description="Crie manualmente ou gere a partir de uma ordem de venda."
        />
      )}

      {faturas && faturas.length > 0 && (
        <ResponsiveTable
          data={faturas}
          keyField={(f) => f.id}
          columns={buildColumns(contactsById, marcarPago)}
          onRowClick={(f) => {
            setEditFatura(f);
            setDialogOpen(true);
          }}
        />
      )}

      <FaturaDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fatura={editFatura}
      />
    </div>
  );
}
