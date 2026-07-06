"use client";

import { useCreateFolder, useFolders } from "@/lib/hooks/use-notes";
import { cn } from "@/lib/utils/cn";
import { FormEvent, useState } from "react";

export type FolderFilter = "todas" | "sem-pasta" | string;

export function FolderList({
  selected,
  onSelect,
}: {
  selected: FolderFilter;
  onSelect: (value: FolderFilter) => void;
}) {
  const { data: folders } = useFolders();
  const createFolder = useCreateFolder();
  const [novaPasta, setNovaPasta] = useState("");

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!novaPasta.trim()) return;
    await createFolder.mutateAsync(novaPasta.trim());
    setNovaPasta("");
  }

  return (
    <div className="flex w-48 shrink-0 flex-col gap-1">
      <FolderItem
        label="Todas as notas"
        active={selected === "todas"}
        onClick={() => onSelect("todas")}
      />
      <FolderItem
        label="Sem pasta"
        active={selected === "sem-pasta"}
        onClick={() => onSelect("sem-pasta")}
      />

      {folders?.map((folder) => (
        <FolderItem
          key={folder.id}
          label={folder.nome}
          active={selected === folder.id}
          onClick={() => onSelect(folder.id)}
        />
      ))}

      <form onSubmit={handleCreate} className="mt-2">
        <input
          value={novaPasta}
          onChange={(e) => setNovaPasta(e.target.value)}
          placeholder="+ nova pasta"
          className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </form>
    </div>
  );
}

function FolderItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-2.5 py-1.5 text-left text-sm",
        active
          ? "bg-accent text-white"
          : "text-text-muted hover:bg-surface-2 hover:text-text",
      )}
    >
      {label}
    </button>
  );
}
