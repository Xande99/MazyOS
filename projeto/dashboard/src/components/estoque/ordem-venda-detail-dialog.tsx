"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ItensEditor } from "@/components/estoque/itens-editor";
import {
  ORDEM_VENDA_STATUS_BADGE,
  ORDEM_VENDA_STATUS_LABELS,
} from "@/lib/constants/estoque";
import { useContacts } from "@/lib/hooks/use-contacts";
import {
  useAddOrdemVendaItem,
  useDeleteOrdemVendaItem,
  useGerarFatura,
  useOrdemVenda,
  useOrdemVendaItens,
  useUpdateOrdemVendaItem,
} from "@/lib/hooks/use-ordens-venda";
import { useProdutos } from "@/lib/hooks/use-produtos";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OrdemVendaDetailDialog({
  ordemId,
  open,
  onClose,
  onEdit,
}: {
  ordemId: string | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} title="Ordem de venda" className="max-w-2xl">
      {open && ordemId && (
        <OrdemVendaDetailContent
          key={ordemId}
          ordemId={ordemId}
          onClose={onClose}
          onEdit={onEdit}
        />
      )}
    </Dialog>
  );
}

function OrdemVendaDetailContent({
  ordemId,
  onClose,
  onEdit,
}: {
  ordemId: string;
  onClose: () => void;
  onEdit: () => void;
}) {
  const router = useRouter();
  const { data: ordem, isLoading } = useOrdemVenda(ordemId);
  const { data: itens, isLoading: itensLoading } = useOrdemVendaItens(ordemId);
  const { data: produtos } = useProdutos();
  const { data: contacts } = useContacts();
  const addItem = useAddOrdemVendaItem(ordemId);
  const updateItem = useUpdateOrdemVendaItem(ordemId);
  const deleteItem = useDeleteOrdemVendaItem(ordemId);
  const gerarFatura = useGerarFatura();
  const [erro, setErro] = useState<string | null>(null);

  if (isLoading || !ordem) {
    return <Skeleton className="h-40 w-full" />;
  }

  const cliente = contacts?.find((c) => c.id === ordem.contact_id);

  async function handleGerarFatura() {
    if (!ordem) return;
    setErro(null);
    try {
      await gerarFatura.mutateAsync(ordem);
      onClose();
      router.push("/estoque/faturas");
    } catch {
      setErro("Não foi possível gerar a fatura.");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={ORDEM_VENDA_STATUS_BADGE[ordem.status]}>
            {ORDEM_VENDA_STATUS_LABELS[ordem.status]}
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
        total={ordem.total}
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
        <Button onClick={handleGerarFatura} disabled={gerarFatura.isPending}>
          {gerarFatura.isPending ? "Gerando..." : "Gerar Fatura"}
        </Button>
      </div>
    </div>
  );
}
