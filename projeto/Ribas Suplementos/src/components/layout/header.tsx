"use client";

import Link from "next/link";
import { useCarrinho } from "@/lib/cart/cart-context";

export function Header() {
  const { totalItens, pronto } = useCarrinho();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-black/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
        >
          Ribas Suplementos
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-6 text-sm font-medium text-zinc-600 sm:flex dark:text-zinc-400"
        >
          <Link
            href="/catalogo"
            className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            Catálogo
          </Link>
          <Link
            href="/conta"
            className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            Minha conta
          </Link>
        </nav>

        <Link
          href="/carrinho"
          aria-label={`Carrinho com ${pronto ? totalItens : 0} ${
            pronto && totalItens === 1 ? "item" : "itens"
          }`}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h1.5l1.5 12.5A2 2 0 0 0 8 17.5h9a2 2 0 0 0 2-1.6L20.5 7H6"
            />
            <circle cx="9" cy="21" r="1.25" fill="currentColor" stroke="none" />
            <circle cx="17" cy="21" r="1.25" fill="currentColor" stroke="none" />
          </svg>
          {pronto && totalItens > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-950 px-1 text-xs font-semibold text-white dark:bg-zinc-50 dark:text-zinc-950">
              {totalItens}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
