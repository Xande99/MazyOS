export type ContactCategory = "cliente" | "parceiro" | "grafica";

export type Profile = {
  id: string;
  nome: string;
  cor_avatar: string;
  favoritos: string[];
};

export type Contact = {
  id: string;
  categoria: ContactCategory;
  nome: string;
  empresa: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  notas: string | null;
  tags: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactInteraction = {
  id: string;
  contact_id: string;
  nota: string;
  created_by: string | null;
  created_at: string;
};

export type KanbanPriority = "baixa" | "media" | "alta";

export type KanbanColumn = {
  id: string;
  board_id: string;
  nome: string;
  posicao: number;
};

export type KanbanCard = {
  id: string;
  column_id: string;
  titulo: string;
  descricao: string | null;
  responsavel_id: string | null;
  prazo: string | null;
  prioridade: KanbanPriority;
  contact_id: string | null;
  posicao: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type CalendarEvent = {
  id: string;
  titulo: string;
  descricao: string | null;
  inicio: string;
  fim: string;
  dia_inteiro: boolean;
  contact_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type NoteFolder = {
  id: string;
  nome: string;
  created_at: string;
};

export type Note = {
  id: string;
  folder_id: string | null;
  titulo: string;
  conteudo: string | null;
  tags: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type TodoProject = {
  id: string;
  nome: string;
  created_at: string;
};

export type TodoItem = {
  id: string;
  project_id: string | null;
  responsavel_id: string | null;
  titulo: string;
  feito: boolean;
  posicao: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Fornecedor = {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  notas: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

/** Colunas `numeric` do Postgres voltam como string via PostgREST —
 * usar Number(...) antes de qualquer operação aritmética/formatação. */
export type Produto = {
  id: string;
  sku: string | null;
  nome: string;
  descricao: string | null;
  unidade: string;
  preco_custo: string;
  preco_venda: string;
  estoque: string;
  fornecedor_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type LivroPreco = {
  id: string;
  nome: string;
  valido_de: string | null;
  valido_ate: string | null;
  created_at: string;
};

export type LivroPrecoItem = {
  id: string;
  livro_preco_id: string;
  produto_id: string;
  preco: string;
};

/** Linha de item de orçamento/ordem — guarda uma foto do produto
 * (nome e preço no momento em que foi adicionado). */
export type PedidoItem = {
  id: string;
  produto_id: string | null;
  nome_produto: string;
  preco_unitario: string;
  quantidade: string;
  subtotal: string;
};

export type OrcamentoStatus = "rascunho" | "enviado" | "aprovado" | "recusado";

export type Orcamento = {
  id: string;
  contact_id: string | null;
  status: OrcamentoStatus;
  validade: string | null;
  total: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type OrcamentoItem = PedidoItem & { orcamento_id: string };

export type OrdemVendaStatus = "aberta" | "concluida" | "cancelada";

export type OrdemVenda = {
  id: string;
  contact_id: string | null;
  orcamento_id: string | null;
  status: OrdemVendaStatus;
  total: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type OrdemVendaItem = PedidoItem & { ordem_id: string };

export type OrdemCompraStatus = "aberta" | "recebida" | "cancelada";

export type OrdemCompra = {
  id: string;
  fornecedor_id: string | null;
  status: OrdemCompraStatus;
  total: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type OrdemCompraItem = PedidoItem & { ordem_id: string };

export type FaturaStatus = "pendente" | "pago";

export type Fatura = {
  id: string;
  contact_id: string | null;
  ordem_venda_id: string | null;
  valor: string;
  vencimento: string;
  status: FaturaStatus;
  pago_em: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type VaultCategoria =
  | "dominio"
  | "hospedagem"
  | "social"
  | "ads"
  | "email"
  | "financeiro"
  | "outro";

export type VaultSession = {
  id: string;
  nome: string;
  notas: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

/** O segredo em si nunca trafega aqui — só a referência (secret_id)
 * pro Vault. Ver src/app/(app)/cofre/actions.ts. */
export type VaultEntry = {
  id: string;
  session_id: string;
  rotulo: string;
  categoria: VaultCategoria;
  usuario: string | null;
  secret_id: string;
  url: string | null;
  notas: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type VaultAccessLog = {
  id: string;
  entry_id: string;
  revelado_por: string | null;
  revelado_em: string;
};
