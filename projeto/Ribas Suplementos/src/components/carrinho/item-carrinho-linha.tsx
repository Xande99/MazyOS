"use client";

import Image from "next/image";
import { useCarrinho, type ItemCarrinho } from "@/lib/cart/cart-context";
import { formatarPreco } from "@/lib/utils/currency";

export function ItemCarrinhoLinha({ item }: { item: ItemCarrinho }) {
  const { atualizarQuantidade, remover } = useCarrinho();

  return (
    <div className="flex gap-4 border-b border-zinc-200 py-4 last:border-0 dark:border-zinc-800">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
        {item.imagemUrl && (
          <Image
            src={item.imagemUrl}
            alt={item.nome}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            {item.nome}
          </p>
          <button
            type="button"
            onClick={() => remover(item.produtoId, item.varianteId)}
            aria-label={`Remover ${item.nome} do carrinho`}
            className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50"
          >
            Remover
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                atualizarQuantidade(
                  item.produtoId,
                  item.varianteId,
                  item.quantidade - 1,
                )
              }
              aria-label="Diminuir quantidade"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-400"
            >
              −
            </button>
            <span className="w-6 text-center text-sm">{item.quantidade}</span>
            <button
              type="button"
              onClick={() =>
                atualizarQuantidade(
                  item.produtoId,
                  item.varianteId,
                  item.quantidade + 1,
                )
              }
              aria-label="Aumentar quantidade"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-400"
            >
              +
            </button>
          </div>
          <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            {formatarPreco(item.precoCentavos * item.quantidade)}
          </p>
        </div>
      </div>
    </div>
  );
}
