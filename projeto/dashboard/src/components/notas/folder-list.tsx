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
    <div className="flex flex-row flex-wrap gap-2 md:w-48 md:shrink-0 md:flex-col md:gap-1">
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

      <form onSubmit={handleCreate} className="md:mt-2">
        <input
          value={novaPasta}
          onChange={(e) => setNovaPasta(e.target.value)}
          placeholder="+ nova pasta"
          className="min-h-11 w-36 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent md:w-full"
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
        "flex min-h-11 items-center rounded-lg px-3 py-1.5 text-left text-sm",
        active
          ? "bg-accent text-white"
          : "text-text-muted hover:bg-surface-2 hover:text-text",
      )}
    >
      {label}
    </button>
  );
}
