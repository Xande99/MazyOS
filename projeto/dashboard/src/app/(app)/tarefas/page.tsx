"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ItemDialog } from "@/components/tarefas/item-dialog";
import { SortableItem } from "@/components/tarefas/sortable-item";
import { useProfiles } from "@/lib/hooks/use-profiles";
import {
  useCreateProject,
  useItems,
  useProjects,
  useReorderItems,
} from "@/lib/hooks/use-tarefas";
import type { TodoItem } from "@/lib/types";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FormEvent, useState } from "react";

export default function TarefasPage() {
  const [projectFilter, setProjectFilter] = useState<string>("");
  const [responsavelFilter, setResponsavelFilter] = useState<string>("");
  const [novoProjeto, setNovoProjeto] = useState("");
  const [editItem, setEditItem] = useState<TodoItem | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: projects } = useProjects();
  const { data: profiles } = useProfiles();
  const createProject = useCreateProject();
  const reorderItems = useReorderItems();

  const {
    data: items,
    isLoading,
    isError,
  } = useItems({
    projectId: projectFilter || undefined,
    responsavelId: responsavelFilter || undefined,
  });

  const projectsById = new Map((projects ?? []).map((p) => [p.id, p]));
  const profilesById = new Map((profiles ?? []).map((p) => [p.id, p]));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  async function handleCreateProject(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!novoProjeto.trim()) return;
    await createProject.mutateAsync(novoProjeto.trim());
    setNovoProjeto("");
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || !items || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordenado = arrayMove(items, oldIndex, newIndex);
    reorderItems.mutate(
      reordenado.map((item, index) => ({ id: item.id, posicao: index })),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-text">Tarefas</h1>
        <Button
          onClick={() => {
            setEditItem(undefined);
            setDialogOpen(true);
          }}
        >
          Nova tarefa
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="max-w-[200px]"
        >
          <option value="">Todos os projetos</option>
          {projects?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </Select>

        <Select
          value={responsavelFilter}
          onChange={(e) => setResponsavelFilter(e.target.value)}
          className="max-w-[200px]"
        >
          <option value="">Todos os responsáveis</option>
          {profiles?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </Select>

        <form onSubmit={handleCreateProject} className="w-full sm:ml-auto sm:w-auto">
          <input
            value={novoProjeto}
            onChange={(e) => setNovoProjeto(e.target.value)}
            placeholder="+ novo projeto"
            className="min-h-11 w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent sm:w-auto"
          />
        </form>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-danger">
          Não foi possível carregar as tarefas.
        </p>
      )}

      {items && items.length === 0 && (
        <EmptyState
          title="Nenhuma tarefa por aqui"
          description="Ajuste os filtros ou crie a primeira tarefa."
        />
      )}

      {items && items.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  project={
                    item.project_id
                      ? projectsById.get(item.project_id)
                      : undefined
                  }
                  responsavel={
                    item.responsavel_id
                      ? profilesById.get(item.responsavel_id)
                      : undefined
                  }
                  onEdit={() => {
                    setEditItem(item);
                    setDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <ItemDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        item={editItem}
        projectIdPadrao={projectFilter || null}
        novaPosicao={items?.length ?? 0}
      />
    </div>
  );
}
