export type Categoria = {
  id: string;
  nome: string;
  slug: string;
};

export type ProdutoVariante = {
  id: string;
  produto_id: string;
  nome: string;
  sku: string | null;
  preco_centavos: number | null;
  estoque: number;
};

export type Produto = {
  id: string;
  categoria_id: string | null;
  nome: string;
  slug: string;
  descricao: string | null;
  preco_centavos: number;
  imagem_url: string | null;
  estoque: number;
  ativo: boolean;
  categorias?: Categoria | null;
  produto_variantes?: ProdutoVariante[];
};

export type EnderecoEntrega = {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
};

export type StatusPedido =
  | "aguardando_pagamento"
  | "pago"
  | "enviado"
  | "entregue"
  | "cancelado";
