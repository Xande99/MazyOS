import type { ContactCategory } from "@/lib/types";

export const CATEGORIA_LABELS: Record<ContactCategory, string> = {
  cliente: "Cliente",
  parceiro: "Parceiro",
  grafica: "Gráfica",
};

export const CATEGORIA_BADGE: Record<
  ContactCategory,
  "accent" | "success" | "warning"
> = {
  cliente: "accent",
  parceiro: "success",
  grafica: "warning",
};
