export default function CarregandoProduto() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
        <div className="flex flex-col gap-4">
          <div className="h-3 w-24 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-8 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-6 w-32 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}
