"use client";

import { useState } from "react";
import { useCarrinho } from "@/lib/cart/cart-context";
import type { Produto, ProdutoVariante } from "@/lib/types";

export function AdicionarAoCarrinho({ produto }: { produto: Produto }) {
  const { adicionar } = useCarrinho();
  const variantes = produto.produto_variantes ?? [];
  const [varianteId, setVarianteId] = useState<string | null>(
    variantes[0]?.id ?? null,
  );
  const [adicionado, setAdicionado] = useState(false);

  const variante: ProdutoVariante | undefined = variantes.find(
    (v) => v.id === varianteId,
  );
  const semEstoque = variantes.length > 0
    ? (variante?.estoque ?? 0) <= 0
    : produto.estoque <= 0;

  function handleAdicionar() {
    adicionar({
      produtoId: produto.id,
      varianteId: variante?.id ?? null,
      nome: variante ? `${produto.nome} — ${variante.nome}` : produto.nome,
      precoCentavos: variante?.preco_centavos ?? produto.preco_centavos,
      imagemUrl: produto.imagem_url,
    });
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      {variantes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {variantes.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVarianteId(v.id)}
              aria-pressed={varianteId === v.id}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                varianteId === v.id
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-400"
              }`}
            >
              {v.nome}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleAdicionar}
        disabled={semEstoque}
        className="w-full rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600"
      >
        {semEstoque ? "Esgotado" : adicionado ? "Adicionado ✓" : "Adicionar ao carrinho"}
      </button>
    </div>
  );
}
