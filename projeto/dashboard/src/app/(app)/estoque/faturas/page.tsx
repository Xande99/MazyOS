"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { FaturaDialog } from "@/components/estoque/fatura-dialog";
import { useContacts } from "@/lib/hooks/use-contacts";
import { useFaturas, useMarcarFaturaPaga } from "@/lib/hooks/use-faturas";
import type { Fatura } from "@/lib/types";
import { formatBRL } from "@/lib/utils/currency";
import { startOfDay } from "@/lib/utils/calendar";
import { parseDateOnly } from "@/lib/utils/date";
import { useState } from "react";

function estaAtrasada(fatura: Fatura) {
  return fatura.status === "pendente" && parseDateOnly(fatura.vencimento) < startOfDay(new Date());
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
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Cliente</th>
                <th className="px-4 py-2 font-medium">Valor</th>
                <th className="px-4 py-2 font-medium">Vencimento</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {faturas.map((fatura) => {
                const atrasada = estaAtrasada(fatura);
                return (
                  <tr key={fatura.id} className="border-t border-border hover:bg-surface-2">
                    <td
                      onClick={() => {
                        setEditFatura(fatura);
                        setDialogOpen(true);
                      }}
                      className="cursor-pointer px-4 py-2.5 text-text"
                    >
                      {fatura.contact_id
                        ? (contactsById.get(fatura.contact_id)?.nome ?? "—")
                        : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-text-muted">
                      {formatBRL(fatura.valor)}
                    </td>
                    <td className="px-4 py-2.5 text-text-muted">
                      {fatura.vencimento}
                    </td>
                    <td className="px-4 py-2.5">
                      {fatura.status === "pago" ? (
                        <Badge variant="success">Pago</Badge>
                      ) : atrasada ? (
                        <Badge variant="danger">Atrasado</Badge>
                      ) : (
                        <Badge variant="warning">Pendente</Badge>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {fatura.status === "pendente" && (
                        <button
                          type="button"
                          onClick={() => marcarPago.mutate(fatura.id)}
                          className="text-xs text-text-muted hover:text-success"
                        >
                          marcar como pago
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <FaturaDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fatura={editFatura}
      />
    </div>
  );
}
