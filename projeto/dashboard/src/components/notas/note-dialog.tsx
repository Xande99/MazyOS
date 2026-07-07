"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFolders, useCreateNote, useDeleteNote, useUpdateNote } from "@/lib/hooks/use-notes";
import type { Note } from "@/lib/types";
import { FormEvent, useState } from "react";

export function NoteDialog({
  open,
  onClose,
  note,
  folderIdPadrao,
}: {
  open: boolean;
  onClose: () => void;
  note?: Note;
  folderIdPadrao?: string | null;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={note ? "Editar nota" : "Nova nota"} className="max-w-xl">
      {open && (
        <NoteForm note={note} folderIdPadrao={folderIdPadrao} onClose={onClose} />
      )}
    </Dialog>
  );
}

function NoteForm({
  note,
  folderIdPadrao,
  onClose,
}: {
  note?: Note;
  folderIdPadrao?: string | null;
  onClose: () => void;
}) {
  const isEdit = !!note;
  const { data: folders } = useFolders();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState({
    titulo: note?.titulo ?? "",
    folder_id: note?.folder_id ?? folderIdPadrao ?? "",
    tags: note?.tags?.join(", ") ?? "",
    conteudo: note?.conteudo ?? "",
  });

  const pending = createNote.isPending || updateNote.isPending;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    const payload = {
      titulo: form.titulo.trim(),
      folder_id: form.folder_id || null,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      conteudo: form.conteudo.trim() || null,
    };

    try {
      if (isEdit) {
        await updateNote.mutateAsync({ id: note.id, ...payload });
      } else {
        await createNote.mutateAsync(payload);
      }
      onClose();
    } catch {
      setErro("Não foi possível salvar. Tenta de novo.");
    }
  }

  async function handleDelete() {
    if (!note) return;
    if (!window.confirm(`Excluir a nota "${note.titulo}"?`)) return;
    await deleteNote.mutateAsync(note.id);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Título *">
          <Input
            required
            value={form.titulo}
            onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
          />
        </Field>

        <Field label="Pasta">
          <Select
            value={form.folder_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, folder_id: e.target.value }))
            }
          >
            <option value="">Sem pasta</option>
            {folders?.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.nome}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Tags (separadas por vírgula)">
        <Input
          value={form.tags}
          onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
        />
      </Field>

      <Field label="Conteúdo">
        <Textarea
          rows={10}
          value={form.conteudo}
          onChange={(e) =>
            setForm((f) => ({ ...f, conteudo: e.target.value }))
          }
        />
      </Field>

      {erro && (
        <p role="alert" className="text-sm text-danger">
          {erro}
        </p>
      )}

      <div className="mt-2 flex justify-between gap-3">
        {isEdit ? (
          <Button type="button" variant="secondary" onClick={handleDelete}>
            Excluir
          </Button>
        ) : (
          <span />
        )}

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-text-muted">{label}</span>
      {children}
    </label>
  );
}
