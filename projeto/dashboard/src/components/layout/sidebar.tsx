"use client";

import { cn } from "@/lib/utils/cn";
import { navItems } from "@/lib/nav-items";
import { useProfiles, useUpdateFavoritos } from "@/lib/hooks/use-profiles";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar({
  userId,
  onNavigate,
  className,
}: {
  userId: string;
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const { data: profiles } = useProfiles();
  const updateFavoritos = useUpdateFavoritos();

  const favoritos = profiles?.find((p) => p.id === userId)?.favoritos ?? [];

  function toggleFavorito(href: string) {
    if (!userId) return;
    const novo = favoritos.includes(href)
      ? favoritos.filter((f) => f !== href)
      : [...favoritos, href];
    updateFavoritos.mutate({ userId, favoritos: novo });
  }

  const itensOrdenados = [
    ...navItems.filter((item) => favoritos.includes(item.href)),
    ...navItems.filter((item) => !favoritos.includes(item.href)),
  ];

  return (
    <nav
      className={cn(
        "flex w-60 shrink-0 flex-col gap-1 bg-surface p-4",
        className,
      )}
    >
      <span className="mb-3 px-2 text-sm font-semibold text-text">
        duPolvo
      </span>

      {itensOrdenados.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        const favoritado = favoritos.includes(item.href);

        return (
          <div key={item.href} className="flex items-center gap-1">
            <Link
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-11 flex-1 items-center rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-accent text-white"
                  : "text-text-muted hover:bg-surface-2 hover:text-text",
              )}
            >
              {item.label}
            </Link>

            <button
              type="button"
              onClick={() => toggleFavorito(item.href)}
              aria-label={
                favoritado
                  ? `Remover ${item.label} dos favoritos`
                  : `Favoritar ${item.label}`
              }
              aria-pressed={favoritado}
              className={cn(
                "flex h-11 w-9 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                favoritado
                  ? "text-warning hover:text-warning/80"
                  : "text-text-muted/40 hover:text-text-muted",
              )}
            >
              <StarIcon filled={favoritado} />
            </button>
          </div>
        );
      })}
    </nav>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        strokeLinejoin="round"
        d="M10 2.5l2.36 4.78 5.28.77-3.82 3.72.9 5.26L10 14.6l-4.72 2.43.9-5.26-3.82-3.72 5.28-.77L10 2.5z"
      />
    </svg>
  );
}
