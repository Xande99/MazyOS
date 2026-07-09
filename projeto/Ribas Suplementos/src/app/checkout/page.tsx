"use client";

import Link from "next/link";
import { useCarrinho } from "@/lib/cart/cart-context";
import { CheckoutForm } from "./checkout-form";

export default function CheckoutPage() {
  const { itens, pronto } = useCarrinho();

  if (!pronto) {
    return (
      <div className="mx-auto w-full max-w-xl flex-1 px-4 py-12 sm:px-6">
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
    <div className="mx-auto w-full max-w-xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        Checkout
      </h1>
      <CheckoutForm />
    </div>
  );
}
