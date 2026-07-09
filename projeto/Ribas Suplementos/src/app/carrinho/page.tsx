"use client";

import Link from "next/link";
import { useCarrinho } from "@/lib/cart/cart-context";
import { ItemCarrinhoLinha } from "@/components/carrinho/item-carrinho-linha";
import { formatarPreco } from "@/lib/utils/currency";

export default function CarrinhoPage() {
  const { itens, totalCentavos, pronto } = useCarrinho();

  if (!pronto) {
    return (
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <div className="h-8 w-40 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
      </div>
    );
  }

  if (itens.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
          Seu carrinho está vazio
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Adicione produtos do catálogo pra continuar.
        </p>
        <Link
          href="/catalogo"
          className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        Carrinho
      </h1>

      <div>
        {itens.map((item) => (
          <ItemCarrinhoLinha
            key={`${item.produtoId}-${item.varianteId ?? "base"}`}
            item={item}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <span className="text-base font-medium text-zinc-950 dark:text-zinc-50">
          Total
        </span>
        <span className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
          {formatarPreco(totalCentavos)}
        </span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 flex w-full items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        Ir para o checkout
      </Link>
    </div>
  );
}
