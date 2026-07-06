"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { OrcamentoDetailDialog } from "@/components/estoque/orcamento-detail-dialog";
import { OrcamentoDialog } from "@/components/estoque/orcamento-dialog";
import {
  ORCAMENTO_STATUS_BADGE,
  ORCAMENTO_STATUS_LABELS,
} from "@/lib/constants/estoque";
import { useContacts } from "@/lib/hooks/use-contacts";
import { useOrcamento, useOrcamentos } from "@/lib/hooks/use-orcamentos";
import { formatBRL } from "@/lib/utils/currency";
import { useState } from "react";

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
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Cliente</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Validade</th>
                <th className="px-4 py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {orcamentos.map((orcamento) => (
                <tr
                  key={orcamento.id}
                  onClick={() => setDetalheId(orcamento.id)}
                  className="cursor-pointer border-t border-border hover:bg-surface-2"
                >
                  <td className="px-4 py-2.5 text-text">
                    {orcamento.contact_id
                      ? (contactsById.get(orcamento.contact_id)?.nome ?? "—")
                      : "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={ORCAMENTO_STATUS_BADGE[orcamento.status]}>
                      {ORCAMENTO_STATUS_LABELS[orcamento.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5 text-text-muted">
                    {orcamento.validade ?? "—"}
                  </td>
                  <td className="px-4 py-2.5 text-text-muted">
                    {formatBRL(orcamento.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
