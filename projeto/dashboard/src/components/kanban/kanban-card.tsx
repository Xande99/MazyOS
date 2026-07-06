"use client";

import { Badge } from "@/components/ui/badge";
import { PRIORIDADE_BADGE, PRIORIDADE_LABELS } from "@/lib/constants/kanban";
import type { Contact, KanbanCard as KanbanCardType, Profile } from "@/lib/types";
import { parseDateOnly } from "@/lib/utils/date";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";

export function KanbanCard({
  card,
  responsavel,
  contact,
  onClick,
}: {
  card: KanbanCardType;
  responsavel?: Profile;
  contact?: Contact;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="cursor-grab rounded-lg border border-border bg-surface p-3 text-sm shadow-sm transition-colors active:cursor-grabbing hover:border-accent/50"
    >
      <p className="font-medium text-text">{card.titulo}</p>

      {contact && (
        <p className="mt-1 text-xs text-text-muted">{contact.nome}</p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge variant={PRIORIDADE_BADGE[card.prioridade]}>
          {PRIORIDADE_LABELS[card.prioridade]}
        </Badge>
        {card.prazo && (
          <Badge>{format(parseDateOnly(card.prazo), "dd/MM")}</Badge>
        )}
        {responsavel && <Badge variant="accent">{responsavel.nome}</Badge>}
      </div>
    </div>
  );
}
