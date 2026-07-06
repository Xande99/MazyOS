import type {
  FaturaStatus,
  OrcamentoStatus,
  OrdemCompraStatus,
  OrdemVendaStatus,
} from "@/lib/types";

type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "accent";

export const ORCAMENTO_STATUS_LABELS: Record<OrcamentoStatus, string> = {
  rascunho: "Rascunho",
  enviado: "Enviado",
  aprovado: "Aprovado",
  recusado: "Recusado",
};

export const ORCAMENTO_STATUS_BADGE: Record<OrcamentoStatus, BadgeVariant> = {
  rascunho: "neutral",
  enviado: "warning",
  aprovado: "success",
  recusado: "danger",
};

export const ORDEM_VENDA_STATUS_LABELS: Record<OrdemVendaStatus, string> = {
  aberta: "Aberta",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

export const ORDEM_VENDA_STATUS_BADGE: Record<OrdemVendaStatus, BadgeVariant> = {
  aberta: "warning",
  concluida: "success",
  cancelada: "danger",
};

export const ORDEM_COMPRA_STATUS_LABELS: Record<OrdemCompraStatus, string> = {
  aberta: "Aberta",
  recebida: "Recebida",
  cancelada: "Cancelada",
};

export const ORDEM_COMPRA_STATUS_BADGE: Record<OrdemCompraStatus, BadgeVariant> = {
  aberta: "warning",
  recebida: "success",
  cancelada: "danger",
};

export const FATURA_STATUS_LABELS: Record<FaturaStatus, string> = {
  pendente: "Pendente",
  pago: "Pago",
};
