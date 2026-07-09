import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/configurado";
import { SupabaseNaoConfigurado } from "@/components/ui/supabase-nao-configurado";
import { ProdutoCard } from "@/components/catalogo/produto-card";
import type { Produto } from "@/lib/types";

async function buscarDestaques(): Promise<Produto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("produtos")
    .select("*, categorias(id, nome, slug)")
    .eq("ativo", true)
    .order("criado_em", { ascending: false })
    .limit(8);

  return data ?? [];
}

export default async function Home() {
  if (!supabaseConfigurado()) {
    return <SupabaseNaoConfigurado />;
  }

  const destaques = await buscarDestaques();

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6">
          <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
            Whey, creatina e pré-treino pra treinar sério.
          </h1>
          <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
            Suplementação de academia com entrega rápida e preço justo.
          </p>
          <Link
            href="/catalogo"
            className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Ver catálogo
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Novidades
          </h2>
          <Link
            href="/catalogo"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Ver tudo
          </Link>
        </div>

        {destaques.length === 0 ? (
          <p className="py-16 text-center text-sm text-zinc-500 dark:text-zinc-500">
            Nenhum produto cadastrado ainda. Cadastre produtos no Supabase Studio
            pra eles aparecerem aqui.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {destaques.map((produto) => (
              <ProdutoCard key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
