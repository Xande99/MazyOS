"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderList, type FolderFilter } from "@/components/notas/folder-list";
import { NoteDialog } from "@/components/notas/note-dialog";
import { useNotes } from "@/lib/hooks/use-notes";
import type { Note } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

export default function NotasPage() {
  const [folderFilter, setFolderFilter] = useState<FolderFilter>("todas");
  const [busca, setBusca] = useState("");
  const [editNote, setEditNote] = useState<Note | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const folderId =
    folderFilter === "todas"
      ? undefined
      : folderFilter === "sem-pasta"
        ? null
        : folderFilter;

  const { data: notes, isLoading, isError } = useNotes({
    folderId,
    busca: busca || undefined,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-text">Notas</h1>
        <Button
          onClick={() => {
            setEditNote(undefined);
            setDialogOpen(true);
          }}
        >
          Nova nota
        </Button>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <FolderList selected={folderFilter} onSelect={setFolderFilter} />

        <div className="flex flex-1 flex-col gap-4">
          <Input
            placeholder="Buscar por título ou tag..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="max-w-xs"
          />

          {isLoading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {isError && (
            <p className="text-sm text-danger">
              Não foi possível carregar as notas.
            </p>
          )}

          {notes && notes.length === 0 && (
            <EmptyState
              title="Nenhuma nota por aqui"
              description="Crie a primeira nota dessa pasta."
            />
          )}

          {notes && notes.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => {
                    setEditNote(note);
                    setDialogOpen(true);
                  }}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4 text-left hover:border-accent/50"
                >
                  <p className="font-medium text-text">{note.titulo}</p>
                  {note.conteudo && (
                    <p className="line-clamp-3 text-sm text-text-muted">
                      {note.conteudo}
                    </p>
                  )}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {note.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  )}
                  <p className="mt-auto pt-2 text-xs text-text-muted">
                    Atualizado{" "}
                    {formatDistanceToNow(new Date(note.updated_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <NoteDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        note={editNote}
        folderIdPadrao={folderId}
      />
    </div>
  );
}
