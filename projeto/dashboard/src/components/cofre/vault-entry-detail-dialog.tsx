"use client";

import { revelarSegredo } from "@/app/(app)/cofre/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { VAULT_CATEGORIA_LABELS } from "@/lib/constants/cofre";
import { useVaultAccessLog } from "@/lib/hooks/use-cofre";
import { useProfiles } from "@/lib/hooks/use-profiles";
import type { VaultEntry } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

export function VaultEntryDetailDialog({
  entry,
  open,
  onClose,
  onEdit,
}: {
  entry: VaultEntry | undefined;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={entry?.rotulo ?? "Credencial"}
      className="max-w-lg"
    >
      {open && entry && (
        <VaultEntryDetailContent key={entry.id} entry={entry} onEdit={onEdit} />
      )}
    </Dialog>
  );
}

function VaultEntryDetailContent({
  entry,
  onEdit,
}: {
  entry: VaultEntry;
  onEdit: () => void;
}) {
  const { data: log, isLoading: logLoading } = useVaultAccessLog(entry.id);
  const { data: profiles } = useProfiles();
  const [segredo, setSegredo] = useState<string | null>(null);
  const [revelando, setRevelando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  function nomeDoAutor(id: string | null) {
    return profiles?.find((p) => p.id === id)?.nome ?? "alguém";
  }

  async function handleRevelar() {
    setErro(null);
    setRevelando(true);
    try {
      const valor = await revelarSegredo(entry.id);
      setSegredo(valor);
    } catch {
      setErro("Não foi possível revelar. Tenta de novo.");
    } finally {
      setRevelando(false);
    }
  }

  async function handleCopiar() {
    if (!segredo) return;
    await navigator.clipboard.writeText(segredo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent">{VAULT_CATEGORIA_LABELS[entry.categoria]}</Badge>
        {entry.usuario && (
          <span className="text-sm text-text-muted">{entry.usuario}</span>
        )}
      </div>

      {entry.url && (
        <a
          href={entry.url}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-accent hover:underline"
        >
          {entry.url}
        </a>
      )}

      <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-3 py-2.5">
        <span className="flex-1 font-mono text-sm text-text">
          {segredo ?? "••••••••••••"}
        </span>
        {segredo ? (
          <>
            <Button variant="secondary" onClick={handleCopiar}>
              {copiado ? "Copiado!" : "Copiar"}
            </Button>
            <Button variant="secondary" onClick={() => setSegredo(null)}>
              Ocultar
            </Button>
          </>
        ) : (
          <Button onClick={handleRevelar} disabled={revelando}>
            {revelando ? "Revelando..." : "Revelar"}
          </Button>
        )}
      </div>

      {erro && (
        <p role="alert" className="text-sm text-danger">
          {erro}
        </p>
      )}

      {entry.notas && (
        <p className="whitespace-pre-wrap text-sm text-text-muted">
          {entry.notas}
        </p>
      )}

      <div className="flex justify-end border-b border-border pb-4">
        <Button variant="secondary" onClick={onEdit}>
          Editar
        </Button>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text">
          Histórico de acesso
        </h3>

        {logLoading && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-full" />
          </div>
        )}

        {!logLoading && log?.length === 0 && (
          <p className="text-sm text-text-muted">Ninguém revelou essa credencial ainda.</p>
        )}

        {log && log.length > 0 && (
          <ul className="flex flex-col gap-2">
            {log.map((item) => (
              <li key={item.id} className="text-sm text-text-muted">
                {nomeDoAutor(item.revelado_por)} ·{" "}
                {formatDistanceToNow(new Date(item.revelado_em), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
