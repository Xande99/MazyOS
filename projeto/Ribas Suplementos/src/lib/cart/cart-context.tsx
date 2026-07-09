"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type ItemCarrinho = {
  produtoId: string;
  varianteId: string | null;
  nome: string;
  precoCentavos: number;
  imagemUrl: string | null;
  quantidade: number;
};

type CarrinhoContextValor = {
  itens: ItemCarrinho[];
  adicionar: (item: Omit<ItemCarrinho, "quantidade">, quantidade?: number) => void;
  remover: (produtoId: string, varianteId: string | null) => void;
  atualizarQuantidade: (
    produtoId: string,
    varianteId: string | null,
    quantidade: number,
  ) => void;
  limpar: () => void;
  totalCentavos: number;
  totalItens: number;
  pronto: boolean;
};

const CHAVE_STORAGE = "ribas-carrinho";

const CarrinhoContext = createContext<CarrinhoContextValor | null>(null);

function mesmoItem(
  item: ItemCarrinho,
  produtoId: string,
  varianteId: string | null,
) {
  return item.produtoId === produtoId && item.varianteId === varianteId;
}

function lerCarrinhoSalvo(): ItemCarrinho[] {
  if (typeof window === "undefined") return [];
  try {
    const salvo = localStorage.getItem(CHAVE_STORAGE);
    return salvo ? JSON.parse(salvo) : [];
  } catch {
    // localStorage indisponível (modo privado) — carrinho fica só em memória.
    return [];
  }
}

const inscreverSemNoop = () => () => {};

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>(lerCarrinhoSalvo);
  // Servidor sempre renderiza vazio; "pronto" só vira true após montar no
  // client, pra badge/telas do carrinho baterem com o HTML do SSR até lá.
  const pronto = useSyncExternalStore(
    inscreverSemNoop,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!pronto) return;
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(itens));
    } catch {
      // idem — falha silenciosa, não é crítico.
    }
  }, [itens, pronto]);

  const valor = useMemo<CarrinhoContextValor>(() => {
    const adicionar: CarrinhoContextValor["adicionar"] = (item, quantidade = 1) => {
      setItens((atual) => {
        const existente = atual.find((i) =>
          mesmoItem(i, item.produtoId, item.varianteId),
        );
        if (existente) {
          return atual.map((i) =>
            mesmoItem(i, item.produtoId, item.varianteId)
              ? { ...i, quantidade: i.quantidade + quantidade }
              : i,
          );
        }
        return [...atual, { ...item, quantidade }];
      });
    };

    const remover: CarrinhoContextValor["remover"] = (produtoId, varianteId) => {
      setItens((atual) =>
        atual.filter((i) => !mesmoItem(i, produtoId, varianteId)),
      );
    };

    const atualizarQuantidade: CarrinhoContextValor["atualizarQuantidade"] = (
      produtoId,
      varianteId,
      quantidade,
    ) => {
      if (quantidade <= 0) {
        remover(produtoId, varianteId);
        return;
      }
      setItens((atual) =>
        atual.map((i) =>
          mesmoItem(i, produtoId, varianteId) ? { ...i, quantidade } : i,
        ),
      );
    };

    const limpar = () => setItens([]);

    const totalCentavos = itens.reduce(
      (soma, i) => soma + i.precoCentavos * i.quantidade,
      0,
    );
    const totalItens = itens.reduce((soma, i) => soma + i.quantidade, 0);

    return {
      itens,
      adicionar,
      remover,
      atualizarQuantidade,
      limpar,
      totalCentavos,
      totalItens,
      pronto,
    };
  }, [itens, pronto]);

  return (
    <CarrinhoContext.Provider value={valor}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const contexto = useContext(CarrinhoContext);
  if (!contexto) {
    throw new Error("useCarrinho precisa estar dentro de <CarrinhoProvider>");
  }
  return contexto;
}
