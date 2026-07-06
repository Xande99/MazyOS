"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ItensEditor } from "@/components/estoque/itens-editor";
import {
  ORDEM_COMPRA_STATUS_BADGE,
  ORDEM_COMPRA_STATUS_LABELS,
} from "@/lib/constants/estoque";
import { useFornecedores } from "@/lib/hooks/use-fornecedores";
import {
  useAddOrdemCompraItem,
  useDeleteOrdemCompraItem,
  useOrdemCompra,
  useOrdemCompraItens,
  useUpdateOrdemCompraItem,
} from "@/lib/hooks/use-ordens-compra";
import { useProdutos } from "@/lib/hooks/use-produtos";

export function OrdemCompraDetailDialog({
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
    <Dialog open={open} onClose={onClose} title="Ordem de compra" className="max-w-2xl">
      {open && ordemId && (
        <OrdemCompraDetailContent key={ordemId} ordemId={ordemId} onEdit={onEdit} />
      )}
    </Dialog>
  );
}

function OrdemCompraDetailContent({
  ordemId,
  onEdit,
}: {
  ordemId: string;
  onEdit: () => void;
}) {
  const { data: ordem, isLoading } = useOrdemCompra(ordemId);
  const { data: itens, isLoading: itensLoading } = useOrdemCompraItens(ordemId);
  const { data: produtos } = useProdutos();
  const { data: fornecedores } = useFornecedores();
  const addItem = useAddOrdemCompraItem(ordemId);
  const updateItem = useUpdateOrdemCompraItem(ordemId);
  const deleteItem = useDeleteOrdemCompraItem(ordemId);

  if (isLoading || !ordem) {
    return <Skeleton className="h-40 w-full" />;
  }

  const fornecedor = fornecedores?.find((f) => f.id === ordem.fornecedor_id);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={ORDEM_COMPRA_STATUS_BADGE[ordem.status]}>
            {ORDEM_COMPRA_STATUS_LABELS[ordem.status]}
          </Badge>
          <span className="text-sm text-text">{fornecedor?.nome ?? "—"}</span>
        </div>
        <Button variant="secondary" onClick={onEdit}>
          Editar
        </Button>
      </div>

      <ItensEditor
        itens={itens}
        isLoading={itensLoading}
        produtos={produtos}
        precoPadrao={(produto) => produto.preco_custo}
        total={ordem.total}
        onAdd={(item) => addItem.mutateAsync(item)}
        onUpdate={(id, patch) => updateItem.mutate({ id, ...patch })}
        onRemove={(id) => deleteItem.mutate(id)}
      />
    </div>
  );
}
