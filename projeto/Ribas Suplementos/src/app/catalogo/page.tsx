import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/configurado";
import { SupabaseNaoConfigurado } from "@/components/ui/supabase-nao-configurado";
import { ProdutoCard } from "@/components/catalogo/produto-card";
import type { Categoria, Produto } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

async function buscarCategorias(): Promise<Categoria[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("categorias").select("*").order("nome");
  return data ?? [];
}

async function buscarProdutos(categoriaId?: string): Promise<Produto[]> {
  const supabase = await createClient();
  let query = supabase
    .from("produtos")
    .select("*, categorias(id, nome, slug)")
    .eq("ativo", true)
    .order("nome");

  if (categoriaId) {
    query = query.eq("categoria_id", categoriaId);
  }

  const { data } = await query;
  return data ?? [];
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  if (!supabaseConfigurado()) {
    return <SupabaseNaoConfigurado />;
  }

  const { categoria } = await searchParams;
  const categorias = await buscarCategorias();
  const categoriaAtual = categorias.find((cat) => cat.slug === categoria);
  const produtos = await buscarProdutos(categoriaAtual?.id);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        Catálogo
      </h1>

      {categorias.length > 0 && (
        <nav
          aria-label="Filtrar por categoria"
          className="mb-8 flex flex-wrap gap-2"
        >
          <Link
            href="/catalogo"
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              !categoria
                ? "border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-400",
            )}
          >
            Todos
          </Link>
          {categorias.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogo?categoria=${cat.slug}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                categoria === cat.slug
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-400",
              )}
            >
              {cat.nome}
            </Link>
          ))}
        </nav>
      )}

      {produtos.length === 0 ? (
        <p className="py-16 text-center text-sm text-zinc-500 dark:text-zinc-500">
          Nenhum produto encontrado nessa categoria.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {produtos.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} />
          ))}
        </div>
      )}
    </div>
  );
}
