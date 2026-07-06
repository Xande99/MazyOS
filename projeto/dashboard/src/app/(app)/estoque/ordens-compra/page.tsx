"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { OrdemCompraDetailDialog } from "@/components/estoque/ordem-compra-detail-dialog";
import { OrdemCompraDialog } from "@/components/estoque/ordem-compra-dialog";
import {
  ORDEM_COMPRA_STATUS_BADGE,
  ORDEM_COMPRA_STATUS_LABELS,
} from "@/lib/constants/estoque";
import { useFornecedores } from "@/lib/hooks/use-fornecedores";
import { useOrdemCompra, useOrdensCompra } from "@/lib/hooks/use-ordens-compra";
import { formatBRL } from "@/lib/utils/currency";
import { useState } from "react";

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
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Fornecedor</th>
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
                    {ordem.fornecedor_id
                      ? (fornecedoresById.get(ordem.fornecedor_id)?.nome ?? "—")
                      : "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={ORDEM_COMPRA_STATUS_BADGE[ordem.status]}>
                      {ORDEM_COMPRA_STATUS_LABELS[ordem.status]}
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
