"use client";

import { excluirSessaoCofre } from "@/app/(app)/cofre/actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateVaultSession, useUpdateVaultSession } from "@/lib/hooks/use-cofre";
import type { VaultSession } from "@/lib/types";
import { FormEvent, useState } from "react";

export function SessionDialog({
  open,
  onClose,
  session,
  onDeleted,
}: {
  open: boolean;
  onClose: () => void;
  session?: VaultSession;
  onDeleted?: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={session ? "Editar sessão" : "Nova sessão"}
    >
      {open && (
        <SessionForm session={session} onClose={onClose} onDeleted={onDeleted} />
      )}
    </Dialog>
  );
}

function SessionForm({
  session,
  onClose,
  onDeleted,
}: {
  session?: VaultSession;
  onClose: () => void;
  onDeleted?: () => void;
}) {
  const isEdit = !!session;
  const createSession = useCreateVaultSession();
  const updateSession = useUpdateVaultSession();
  const [erro, setErro] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const [form, setForm] = useState({
    nome: session?.nome ?? "",
    notas: session?.notas ?? "",
  });

  const pending = createSession.isPending || updateSession.isPending;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    const payload = {
      nome: form.nome.trim(),
      notas: form.notas.trim() || null,
    };

    try {
      if (isEdit) {
        await updateSession.mutateAsync({ id: session.id, ...payload });
      } else {
        await createSession.mutateAsync(payload);
      }
      onClose();
    } catch {
      setErro("Não foi possível salvar. Tenta de novo.");
    }
  }

  async function handleDelete() {
    if (!session) return;
    const confirmado = window.confirm(
      `Excluir a sessão "${session.nome}"? Isso apaga também TODAS as credenciais guardadas dentro dela. Não dá pra desfazer.`,
    );
    if (!confirmado) return;

    setExcluindo(true);
    try {
      await excluirSessaoCofre(session.id);
      onClose();
      onDeleted?.();
    } catch {
      setErro("Não foi possível excluir.");
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Nome *">
        <Input
          required
          value={form.nome}
          onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
          placeholder="Bela Vista Panificadora, duPolvo interna..."
        />
      </Field>

      <Field label="Notas">
        <Textarea
          rows={3}
          value={form.notas}
          onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
        />
      </Field>

      {erro && (
        <p role="alert" className="text-sm text-danger">
          {erro}
        </p>
      )}

      <div className="mt-2 flex justify-between gap-3">
        {isEdit ? (
          <Button
            type="button"
            variant="secondary"
            onClick={handleDelete}
            disabled={excluindo}
          >
            {excluindo ? "Excluindo..." : "Excluir sessão"}
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
