import type { KanbanPriority } from "@/lib/types";

export const PRIORIDADE_LABELS: Record<KanbanPriority, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

export const PRIORIDADE_BADGE: Record<
  KanbanPriority,
  "neutral" | "warning" | "danger"
> = {
  baixa: "neutral",
  media: "warning",
  alta: "danger",
};
