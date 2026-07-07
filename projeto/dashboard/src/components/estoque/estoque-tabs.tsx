"use client";

import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/estoque/produtos", label: "Produtos" },
  { href: "/estoque/fornecedores", label: "Fornecedores" },
  { href: "/estoque/precos", label: "Livro de Preços" },
  { href: "/estoque/orcamentos", label: "Orçamentos" },
  { href: "/estoque/ordens-venda", label: "Ordens de Venda" },
  { href: "/estoque/ordens-compra", label: "Ordens de Compra" },
  { href: "/estoque/faturas", label: "Faturas" },
] as const;

export function EstoqueTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border">
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex min-h-11 shrink-0 items-center border-b-2 px-3 py-2 text-sm",
              active
                ? "border-accent text-text"
                : "border-transparent text-text-muted hover:text-text",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
