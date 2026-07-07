"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useContacts } from "@/lib/hooks/use-contacts";
import { useCards, useColumns, useMoveCards } from "@/lib/hooks/use-kanban";
import { useProfiles } from "@/lib/hooks/use-profiles";
import type { KanbanCard } from "@/lib/types";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { CardDialog } from "./card-dialog";
import { KanbanCardStatic } from "./kanban-card";
import { KanbanColumn } from "./kanban-column";

export function KanbanBoard() {
  const {
    data: columns,
    isLoading: columnsLoading,
    isError: columnsError,
  } = useColumns();
  const { data: cards, isLoading: cardsLoading, isError: cardsError } =
    useCards();
  const { data: profiles } = useProfiles();
  const { data: contacts } = useContacts();
  const moveCards = useMoveCards();

  const [editCard, setEditCard] = useState<KanbanCard | undefined>();
  const [createColumnId, setCreateColumnId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const profilesById = new Map((profiles ?? []).map((p) => [p.id, p]));
  const contactsById = new Map((contacts ?? []).map((c) => [c.id, c]));

  function cardsForColumn(columnId: string) {
    return (cards ?? [])
      .filter((c) => c.column_id === columnId)
      .sort((a, b) => a.posicao - b.posicao);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || !cards || !columns) return;

    const activeCard = cards.find((c) => c.id === active.id);
    if (!activeCard) return;

    const overColumn = columns.find((col) => col.id === over.id);
    const overCard = cards.find((c) => c.id === over.id);
    const destColumnId = overColumn?.id ?? overCard?.column_id;
    if (!destColumnId) return;

    const sourceColumnId = activeCard.column_id;
    if (sourceColumnId === destColumnId && !overCard) return;

    const destCards = cardsForColumn(destColumnId).filter(
      (c) => c.id !== activeCard.id,
    );
    const overIndex = overCard
      ? destCards.findIndex((c) => c.id === overCard.id)
      : destCards.length;
    destCards.splice(overIndex === -1 ? destCards.length : overIndex, 0, {
      ...activeCard,
      column_id: destColumnId,
    });

    const updates = destCards.map((c, index) => ({
      id: c.id,
      column_id: destColumnId,
      posicao: index,
    }));

    if (sourceColumnId !== destColumnId) {
      const sourceCards = cardsForColumn(sourceColumnId).filter(
        (c) => c.id !== activeCard.id,
      );
      updates.push(
        ...sourceCards.map((c, index) => ({
          id: c.id,
          column_id: sourceColumnId,
          posicao: index,
        })),
      );
    }

    moveCards.mutate(updates);
  }

  function moverCardParaColuna(card: KanbanCard, destColumnId: string) {
    if (!cards || card.column_id === destColumnId) return;

    const destCards = cardsForColumn(destColumnId);
    const sourceCards = cardsForColumn(card.column_id).filter(
      (c) => c.id !== card.id,
    );

    const updates = [
      ...destCards.map((c, index) => ({
        id: c.id,
        column_id: destColumnId,
        posicao: index,
      })),
      { id: card.id, column_id: destColumnId, posicao: destCards.length },
      ...sourceCards.map((c, index) => ({
        id: c.id,
        column_id: card.column_id,
        posicao: index,
      })),
    ];

    moveCards.mutate(updates);
  }

  if (columnsLoading || cardsLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        <Skeleton className="h-64 w-72 shrink-0" />
        <Skeleton className="h-64 w-72 shrink-0" />
        <Skeleton className="h-64 w-72 shrink-0" />
      </div>
    );
  }

  if (columnsError || cardsError) {
    return (
      <p className="text-sm text-danger">Não foi possível carregar o Kanban.</p>
    );
  }

  if (!columns || columns.length === 0) {
    return <EmptyState title="Nenhuma coluna configurada ainda." />;
  }

  return (
    <>
      <div className="hidden md:block">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={cardsForColumn(column.id)}
                profilesById={profilesById}
                contactsById={contactsById}
                onCardClick={(card) => {
                  setEditCard(card);
                  setDialogOpen(true);
                }}
                onAddCard={() => {
                  setEditCard(undefined);
                  setCreateColumnId(column.id);
                  setDialogOpen(true);
                }}
              />
            ))}
          </div>
        </DndContext>
      </div>

      <div className="flex flex-col gap-6 md:hidden">
        {columns.map((column) => {
          const columnCards = cardsForColumn(column.id);

          return (
            <div key={column.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-medium text-text">
                  {column.nome}
                </h3>
                <span className="text-xs text-text-muted">
                  {columnCards.length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {columnCards.length === 0 && (
                  <p className="px-1 text-xs text-text-muted">
                    Nenhum card aqui.
                  </p>
                )}

                {columnCards.map((card) => (
                  <div key={card.id} className="flex flex-col gap-2">
                    <KanbanCardStatic
                      card={card}
                      responsavel={
                        card.responsavel_id
                          ? profilesById.get(card.responsavel_id)
                          : undefined
                      }
                      contact={
                        card.contact_id
                          ? contactsById.get(card.contact_id)
                          : undefined
                      }
                      onClick={() => {
                        setEditCard(card);
                        setDialogOpen(true);
                      }}
                    />

                    <div className="flex items-center gap-2 px-1">
                      <label
                        htmlFor={`status-${card.id}`}
                        className="shrink-0 text-xs text-text-muted"
                      >
                        Mover para
                      </label>
                      <Select
                        id={`status-${card.id}`}
                        value={card.column_id}
                        onChange={(e) =>
                          moverCardParaColuna(card, e.target.value)
                        }
                        className="flex-1"
                      >
                        {columns.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                ))}

                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditCard(undefined);
                    setCreateColumnId(column.id);
                    setDialogOpen(true);
                  }}
                >
                  + Card
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <CardDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        card={editCard}
        columnId={createColumnId ?? undefined}
        novaPosicao={
          createColumnId ? cardsForColumn(createColumnId).length : undefined
        }
      />
    </>
  );
}
