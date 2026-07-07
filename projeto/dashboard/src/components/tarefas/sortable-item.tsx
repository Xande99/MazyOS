"use client";

import { Badge } from "@/components/ui/badge";
import { useUpdateItem } from "@/lib/hooks/use-tarefas";
import type { Profile, TodoItem, TodoProject } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem({
  item,
  project,
  responsavel,
  onEdit,
}: {
  item: TodoItem;
  project?: TodoProject;
  responsavel?: Profile;
  onEdit: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });
  const updateItem = useUpdateItem();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Reordenar"
        className="flex h-11 w-6 shrink-0 cursor-grab items-center justify-center text-text-muted active:cursor-grabbing"
      >
        ⠿
      </button>

      <label className="flex h-11 w-6 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={item.feito}
          onChange={(e) =>
            updateItem.mutate({ id: item.id, feito: e.target.checked })
          }
          className="h-4 w-4 rounded border-border accent-[--color-accent]"
          aria-label={`Marcar "${item.titulo}" como concluída`}
        />
      </label>

      <button
        type="button"
        onClick={onEdit}
        className={cn(
          "flex-1 text-left text-sm",
          item.feito ? "text-text-muted line-through" : "text-text",
        )}
      >
        {item.titulo}
      </button>

      {project && <Badge>{project.nome}</Badge>}
      {responsavel && <Badge variant="accent">{responsavel.nome}</Badge>}
    </div>
  );
}
