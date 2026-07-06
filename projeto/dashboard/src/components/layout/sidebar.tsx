"use client";

import { cn } from "@/lib/utils/cn";
import { navItems } from "@/lib/nav-items";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex w-60 shrink-0 flex-col gap-1 border-r border-border bg-surface p-4">
      <span className="mb-3 px-2 text-sm font-semibold text-text">
        duPolvo
      </span>

      {navItems.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-accent text-white"
                : "text-text-muted hover:bg-surface-2 hover:text-text",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
