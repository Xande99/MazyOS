"use client";

import { Button } from "@/components/ui/button";
import type {
  Contact,
  KanbanCard as KanbanCardType,
  KanbanColumn as KanbanColumnType,
  Profile,
} from "@/lib/types";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanCard } from "./kanban-card";

export function KanbanColumn({
  column,
  cards,
  profilesById,
  contactsById,
  onCardClick,
  onAddCard,
}: {
  column: KanbanColumnType;
  cards: KanbanCardType[];
  profilesById: Map<string, Profile>;
  contactsById: Map<string, Contact>;
  onCardClick: (card: KanbanCardType) => void;
  onAddCard: () => void;
}) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3 rounded-xl bg-surface p-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium text-text">{column.nome}</h3>
        <span className="text-xs text-text-muted">{cards.length}</span>
      </div>

      <div ref={setNodeRef} className="flex min-h-[40px] flex-col gap-2">
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              responsavel={
                card.responsavel_id
                  ? profilesById.get(card.responsavel_id)
                  : undefined
              }
              contact={
                card.contact_id ? contactsById.get(card.contact_id) : undefined
              }
              onClick={() => onCardClick(card)}
            />
          ))}
        </SortableContext>
      </div>

      <Button variant="secondary" onClick={onAddCard}>
        + Card
      </Button>
    </div>
  );
}
