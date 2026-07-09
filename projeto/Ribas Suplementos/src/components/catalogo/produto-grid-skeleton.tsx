export function ProdutoGridSkeleton({ itens = 8 }: { itens?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: itens }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="aspect-square animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
        </div>
      ))}
    </div>
  );
}
