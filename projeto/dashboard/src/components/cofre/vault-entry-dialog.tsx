"use client";

import {
  atualizarEntradaCofre,
  criarEntradaCofre,
  excluirEntradaCofre,
} from "@/app/(app)/cofre/actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VAULT_CATEGORIA_LABELS } from "@/lib/constants/cofre";
import type { VaultCategoria, VaultEntry } from "@/lib/types";
import { FormEvent, useState } from "react";

const CATEGORIAS = Object.keys(VAULT_CATEGORIA_LABELS) as VaultCategoria[];

export function VaultEntryDialog({
  open,
  onClose,
  entry,
}: {
  open: boolean;
  onClose: () => void;
  entry?: VaultEntry;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={entry ? "Editar credencial" : "Nova credencial"}
    >
      {open && <VaultEntryForm entry={entry} onClose={onClose} />}
    </Dialog>
  );
}

function VaultEntryForm({
  entry,
  onClose,
}: {
  entry?: VaultEntry;
  onClose: () => void;
}) {
  const isEdit = !!entry;
  const [erro, setErro] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [form, setForm] = useState({
    rotulo: entry?.rotulo ?? "",
    categoria: entry?.categoria ?? ("outro" as VaultCategoria),
    usuario: entry?.usuario ?? "",
    url: entry?.url ?? "",
    notas: entry?.notas ?? "",
    senha: "",
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    if (!isEdit && !form.senha) {
      setErro("Informe a senha/segredo.");
      return;
    }

    setPending(true);
    try {
      const payload = {
        rotulo: form.rotulo.trim(),
        categoria: form.categoria,
        usuario: form.usuario.trim() || null,
        url: form.url.trim() || null,
        notas: form.notas.trim() || null,
      };

      if (isEdit) {
        await atualizarEntradaCofre({
          id: entry.id,
          ...payload,
          senha: form.senha || null,
        });
      } else {
        await criarEntradaCofre({ ...payload, senha: form.senha });
      }
      onClose();
    } catch {
      setErro("Não foi possível salvar. Tenta de novo.");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!entry) return;
    if (!window.confirm(`Excluir a credencial "${entry.rotulo}"? Não dá pra desfazer.`)) {
      return;
    }
    setPending(true);
    try {
      await excluirEntradaCofre(entry.id);
      onClose();
    } catch {
      setErro("Não foi possível excluir.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Rótulo *">
          <Input
            required
            value={form.rotulo}
            onChange={(e) => setForm((f) => ({ ...f, rotulo: e.target.value }))}
            placeholder="Domínio squarespace, Meta Ads..."
          />
        </Field>

        <Field label="Categoria">
          <Select
            value={form.categoria}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                categoria: e.target.value as VaultCategoria,
              }))
            }
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {VAULT_CATEGORIA_LABELS[c]}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Usuário / login">
          <Input
            value={form.usuario}
            onChange={(e) => setForm((f) => ({ ...f, usuario: e.target.value }))}
          />
        </Field>

        <Field label="URL">
          <Input
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          />
        </Field>
      </div>

      <Field label={isEdit ? "Nova senha (deixe em branco pra não alterar)" : "Senha / segredo *"}>
        <Input
          type="password"
          required={!isEdit}
          value={form.senha}
          onChange={(e) => setForm((f) => ({ ...f, senha: e.target.value }))}
        />
      </Field>

      <Field label="Notas">
        <Textarea
          rows={2}
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
