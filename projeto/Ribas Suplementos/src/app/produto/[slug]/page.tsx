import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/configurado";
import { SupabaseNaoConfigurado } from "@/components/ui/supabase-nao-configurado";
import { AdicionarAoCarrinho } from "@/components/catalogo/adicionar-ao-carrinho";
import { formatarPreco } from "@/lib/utils/currency";
import type { Produto } from "@/lib/types";

async function buscarProduto(slug: string): Promise<Produto | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("produtos")
    .select("*, categorias(id, nome, slug), produto_variantes(*)")
    .eq("slug", slug)
    .eq("ativo", true)
    .maybeSingle();

  return data;
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!supabaseConfigurado()) {
    return <SupabaseNaoConfigurado />;
  }

  const { slug } = await params;
  const produto = await buscarProduto(slug);

  if (!produto) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
          {produto.imagem_url ? (
            <Image
              src={produto.imagem_url}
              alt={produto.nome}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-400">
              Sem imagem
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {produto.categorias?.nome && (
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
              {produto.categorias.nome}
            </span>
          )}
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            {produto.nome}
          </h1>
          <p className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            {formatarPreco(produto.preco_centavos)}
          </p>
          {produto.descricao && (
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {produto.descricao}
            </p>
          )}

          <div className="mt-2">
            <AdicionarAoCarrinho produto={produto} />
          </div>
        </div>
      </div>
    </div>
  );
}
