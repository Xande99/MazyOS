import { ProdutoGridSkeleton } from "@/components/catalogo/produto-grid-skeleton";

export default function CarregandoCatalogo() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
      <div className="mb-8 h-8 w-40 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
      <ProdutoGridSkeleton />
    </div>
  );
}
