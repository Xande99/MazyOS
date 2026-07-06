import { KanbanBoard } from "@/components/kanban/kanban-board";

export default function KanbanPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-text">Kanban</h1>
      <KanbanBoard />
    </div>
  );
}
