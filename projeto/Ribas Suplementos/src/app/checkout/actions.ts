"use server";

import { createClient } from "@/lib/supabase/server";
import { checkoutSchema, type CheckoutInput } from "./schema";

type ResultadoCheckout =
  | { sucesso: true; pedidoId: string }
  | { sucesso: false; erro: string };

// Proteção anti-spam leve, sem dependência nova nem infra: honeypot (campo
// invisível que só bot preenche) + delay mínimo desde o carregamento da
// página (submit mais rápido que isso indica script, não humano digitando).
// Não pega bot direcionado com IP rotativo — isso fica pro rate limit via
// Supabase (tabela + trigger), listado em ACOES-MANUAIS.md pra quando o
// projeto Supabase do Ribas existir.
const DELAY_MINIMO_MS = 3000;

export async function criarPedido(
  input: CheckoutInput,
  protecaoAntiSpam: { honeypot: string; carregadoEm: number },
): Promise<ResultadoCheckout> {
  if (protecaoAntiSpam.honeypot.length > 0) {
    return { sucesso: false, erro: "Não foi possível processar seu pedido. Tente novamente." };
  }
  if (Date.now() - protecaoAntiSpam.carregadoEm < DELAY_MINIMO_MS) {
    return { sucesso: false, erro: "Não foi possível processar seu pedido. Tente novamente." };
  }

  const analisado = checkoutSchema.safeParse(input);
  if (!analisado.success) {
    return { sucesso: false, erro: analisado.error.issues[0].message };
  }

  const { nomeCliente, emailCliente, telefoneCliente, endereco, itens } =
    analisado.data;

  const supabase = await createClient();

  // Preço e nome nunca vêm do client — sempre recalculados a partir do
  // banco, pra não confiar em valor manipulado no localStorage/devtools.
  const produtoIds = [...new Set(itens.map((i) => i.produtoId))];
  const { data: produtos, error: erroProdutos } = await supabase
    .from("produtos")
    .select("id, nome, preco_centavos, estoque, ativo, produto_variantes(*)")
    .in("id", produtoIds);

  if (erroProdutos || !produtos) {
    return { sucesso: false, erro: "Não foi possível validar os produtos." };
  }

  const linhas: {
    produto_id: string;
    variante_id: string | null;
    nome_produto: string;
    quantidade: number;
    preco_unitario_centavos: number;
  }[] = [];

  for (const item of itens) {
    const produto = produtos.find((p) => p.id === item.produtoId);
    if (!produto || !produto.ativo) {
      return { sucesso: false, erro: "Um dos produtos não está mais disponível." };
    }

    const variante = item.varianteId
      ? produto.produto_variantes?.find((v) => v.id === item.varianteId)
      : null;

    const estoqueDisponivel = variante ? variante.estoque : produto.estoque;
    if (estoqueDisponivel < item.quantidade) {
      return {
        sucesso: false,
        erro: `Estoque insuficiente para "${produto.nome}".`,
      };
    }

    linhas.push({
      produto_id: produto.id,
      variante_id: variante?.id ?? null,
      nome_produto: variante ? `${produto.nome} — ${variante.nome}` : produto.nome,
      quantidade: item.quantidade,
      preco_unitario_centavos: variante?.preco_centavos ?? produto.preco_centavos,
    });
  }

  const totalCentavos = linhas.reduce(
    (soma, linha) => soma + linha.preco_unitario_centavos * linha.quantidade,
    0,
  );

  const { data: pedido, error: erroPedido } = await supabase
    .from("pedidos")
    .insert({
      nome_cliente: nomeCliente,
      email_cliente: emailCliente,
      telefone_cliente: telefoneCliente,
      endereco,
      total_centavos: totalCentavos,
    })
    .select("id")
    .single();

  if (erroPedido || !pedido) {
    return { sucesso: false, erro: "Não foi possível criar o pedido." };
  }

  const { error: erroItens } = await supabase.from("pedido_itens").insert(
    linhas.map((linha) => ({ ...linha, pedido_id: pedido.id })),
  );

  if (erroItens) {
    return { sucesso: false, erro: "Não foi possível registrar os itens do pedido." };
  }

  // Pagamento ainda não integrado — pedido fica "aguardando_pagamento".
  // Ver .claude/decisions.md sobre a escolha do gateway (Mercado Pago é a
  // recomendação padrão pro mercado brasileiro).
  return { sucesso: true, pedidoId: pedido.id };
}
