import Image from "next/image";
import Link from "next/link";
import type { Produto } from "@/lib/types";
import { formatarPreco } from "@/lib/utils/currency";

export function ProdutoCard({ produto }: { produto: Produto }) {
  const semEstoque = produto.estoque <= 0;

  return (
    <Link
      href={`/produto/${produto.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 transition-colors hover:border-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700"
    >
      <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-900">
        {produto.imagem_url ? (
          <Image
            src={produto.imagem_url}
            alt={produto.nome}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            Sem imagem
          </div>
        )}
        {semEstoque && (
          <span className="absolute left-3 top-3 rounded-full bg-zinc-950/90 px-2.5 py-1 text-xs font-medium text-white">
            Esgotado
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {produto.categorias?.nome && (
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
            {produto.categorias.nome}
          </span>
        )}
        <h3 className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
          {produto.nome}
        </h3>
        <p className="mt-auto text-base font-semibold text-zinc-950 dark:text-zinc-50">
          {formatarPreco(produto.preco_centavos)}
        </p>
      </div>
    </Link>
  );
}
