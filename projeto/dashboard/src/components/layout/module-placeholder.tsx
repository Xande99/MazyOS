import { EmptyState } from "@/components/ui/empty-state";

export function ModulePlaceholder({
  title,
  fase,
}: {
  title: string;
  fase: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-text">{title}</h1>
      <EmptyState
        title="Módulo ainda não construído"
        description={`Entra no plano na ${fase}.`}
      />
    </div>
  );
}
