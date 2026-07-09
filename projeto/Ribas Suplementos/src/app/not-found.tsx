import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
        Página não encontrada
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        O produto ou a página que você procura não existe mais.
      </p>
      <Link
        href="/catalogo"
        className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        Voltar ao catálogo
      </Link>
    </div>
  );
}
