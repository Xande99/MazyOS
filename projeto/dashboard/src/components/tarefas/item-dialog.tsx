"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useProfiles } from "@/lib/hooks/use-profiles";
import {
  useCreateItem,
  useDeleteItem,
  useProjects,
  useUpdateItem,
} from "@/lib/hooks/use-tarefas";
import type { TodoItem } from "@/lib/types";
import { FormEvent, useState } from "react";

export function ItemDialog({
  open,
  onClose,
  item,
  projectIdPadrao,
  novaPosicao,
}: {
  open: boolean;
  onClose: () => void;
  item?: TodoItem;
  projectIdPadrao?: string | null;
  novaPosicao?: number;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={item ? "Editar tarefa" : "Nova tarefa"}>
      {open && (
        <ItemForm
          item={item}
          projectIdPadrao={projectIdPadrao}
          novaPosicao={novaPosicao}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
}

function ItemForm({
  item,
  projectIdPadrao,
  novaPosicao,
  onClose,
}: {
  item?: TodoItem;
  projectIdPadrao?: string | null;
  novaPosicao?: number;
  onClose: () => void;
}) {
  const isEdit = !!item;
  const { data: projects } = useProjects();
  const { data: profiles } = useProfiles();
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const [erro, setErro] = useState<string | null>(null);

  const [form, setForm] = useState({
    titulo: item?.titulo ?? "",
    project_id: item?.project_id ?? projectIdPadrao ?? "",
    responsavel_id: item?.responsavel_id ?? "",
  });

  const pending = createItem.isPending || updateItem.isPending;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    const payload = {
      titulo: form.titulo.trim(),
      project_id: form.project_id || null,
      responsavel_id: form.responsavel_id || null,
    };

    try {
      if (isEdit) {
        await updateItem.mutateAsync({ id: item.id, ...payload });
      } else {
        await createItem.mutateAsync({ ...payload, posicao: novaPosicao ?? 0 });
      }
      onClose();
    } catch {
      setErro("Não foi possível salvar. Tenta de novo.");
    }
  }

  async function handleDelete() {
    if (!item) return;
    if (!window.confirm(`Excluir a tarefa "${item.titulo}"?`)) return;
    await deleteItem.mutateAsync(item.id);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Título *">
        <Input
          required
          value={form.titulo}
          onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Projeto">
          <Select
            value={form.project_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, project_id: e.target.value }))
            }
          >
            <option value="">Sem projeto</option>
            {projects?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Responsável">
          <Select
            value={form.responsavel_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, responsavel_id: e.target.value }))
            }
          >
            <option value="">Ninguém</option>
            {profiles?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </Select>
        </Field>
      </div>

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
