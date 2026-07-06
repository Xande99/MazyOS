"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { OrdemVendaDetailDialog } from "@/components/estoque/ordem-venda-detail-dialog";
import { OrdemVendaDialog } from "@/components/estoque/ordem-venda-dialog";
import {
  ORDEM_VENDA_STATUS_BADGE,
  ORDEM_VENDA_STATUS_LABELS,
} from "@/lib/constants/estoque";
import { useContacts } from "@/lib/hooks/use-contacts";
import { useOrdemVenda, useOrdensVenda } from "@/lib/hooks/use-ordens-venda";
import { formatBRL } from "@/lib/utils/currency";
import { useState } from "react";

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
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Cliente</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {ordens.map((ordem) => (
                <tr
                  key={ordem.id}
                  onClick={() => setDetalheId(ordem.id)}
                  className="cursor-pointer border-t border-border hover:bg-surface-2"
                >
                  <td className="px-4 py-2.5 text-text">
                    {ordem.contact_id
                      ? (contactsById.get(ordem.contact_id)?.nome ?? "—")
                      : "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={ORDEM_VENDA_STATUS_BADGE[ordem.status]}>
                      {ORDEM_VENDA_STATUS_LABELS[ordem.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5 text-text-muted">
                    {formatBRL(ordem.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
