"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ItensEditor } from "@/components/estoque/itens-editor";
import {
  ORCAMENTO_STATUS_BADGE,
  ORCAMENTO_STATUS_LABELS,
} from "@/lib/constants/estoque";
import { useContacts } from "@/lib/hooks/use-contacts";
import {
  useAddOrcamentoItem,
  useDeleteOrcamentoItem,
  useGerarOrdemVenda,
  useOrcamento,
  useOrcamentoItens,
  useUpdateOrcamentoItem,
} from "@/lib/hooks/use-orcamentos";
import { useProdutos } from "@/lib/hooks/use-produtos";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OrcamentoDetailDialog({
  orcamentoId,
  open,
  onClose,
  onEdit,
}: {
  orcamentoId: string | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Orçamento"
      className="max-w-2xl"
    >
      {open && orcamentoId && (
        <OrcamentoDetailContent
          key={orcamentoId}
          orcamentoId={orcamentoId}
          onClose={onClose}
          onEdit={onEdit}
        />
      )}
    </Dialog>
  );
}

function OrcamentoDetailContent({
  orcamentoId,
  onClose,
  onEdit,
}: {
  orcamentoId: string;
  onClose: () => void;
  onEdit: () => void;
}) {
  const router = useRouter();
  const { data: orcamento, isLoading } = useOrcamento(orcamentoId);
  const { data: itens, isLoading: itensLoading } = useOrcamentoItens(orcamentoId);
  const { data: produtos } = useProdutos();
  const { data: contacts } = useContacts();
  const addItem = useAddOrcamentoItem(orcamentoId);
  const updateItem = useUpdateOrcamentoItem(orcamentoId);
  const deleteItem = useDeleteOrcamentoItem(orcamentoId);
  const gerarOrdem = useGerarOrdemVenda();
  const [erro, setErro] = useState<string | null>(null);

  if (isLoading || !orcamento) {
    return <Skeleton className="h-40 w-full" />;
  }

  const cliente = contacts?.find((c) => c.id === orcamento.contact_id);

  async function handleGerarOrdem() {
    if (!orcamento) return;
    setErro(null);
    try {
      await gerarOrdem.mutateAsync(orcamento);
      onClose();
      router.push("/estoque/ordens-venda");
    } catch {
      setErro("Não foi possível gerar a ordem de venda.");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={ORCAMENTO_STATUS_BADGE[orcamento.status]}>
            {ORCAMENTO_STATUS_LABELS[orcamento.status]}
          </Badge>
          <span className="text-sm text-text">{cliente?.nome ?? "—"}</span>
        </div>
        <Button variant="secondary" onClick={onEdit}>
          Editar
        </Button>
      </div>

      <ItensEditor
        itens={itens}
        isLoading={itensLoading}
        produtos={produtos}
        precoPadrao={(produto) => produto.preco_venda}
        total={orcamento.total}
        onAdd={(item) => addItem.mutateAsync(item)}
        onUpdate={(id, patch) => updateItem.mutate({ id, ...patch })}
        onRemove={(id) => deleteItem.mutate(id)}
      />

      {erro && (
        <p role="alert" className="text-sm text-danger">
          {erro}
        </p>
      )}

      <div className="flex justify-end border-t border-border pt-4">
        <Button onClick={handleGerarOrdem} disabled={gerarOrdem.isPending}>
          {gerarOrdem.isPending ? "Gerando..." : "Gerar Ordem de Venda"}
        </Button>
      </div>
    </div>
  );
}
