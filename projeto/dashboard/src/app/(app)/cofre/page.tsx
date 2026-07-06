"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { VaultEntryDetailDialog } from "@/components/cofre/vault-entry-detail-dialog";
import { VaultEntryDialog } from "@/components/cofre/vault-entry-dialog";
import { VAULT_CATEGORIA_LABELS } from "@/lib/constants/cofre";
import { useVaultEntries } from "@/lib/hooks/use-cofre";
import type { VaultEntry } from "@/lib/types";
import { useState } from "react";

export default function CofrePage() {
  const [busca, setBusca] = useState("");
  const { data: entries, isLoading, isError } = useVaultEntries(busca);

  const [editEntry, setEditEntry] = useState<VaultEntry | undefined>();
  const [detalheEntry, setDetalheEntry] = useState<VaultEntry | undefined>();
  const [criarAberto, setCriarAberto] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-text">Cofre de acesso</h1>
        <Button onClick={() => setCriarAberto(true)}>Nova credencial</Button>
      </div>

      <Input
        placeholder="Buscar credencial..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="max-w-xs"
      />

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-danger">
          Não foi possível carregar as credenciais.
        </p>
      )}

      {entries && entries.length === 0 && (
        <EmptyState
          title="Nenhuma credencial guardada"
          description="Cadastre a primeira — o segredo fica cifrado no Supabase Vault, nunca em texto puro."
        />
      )}

      {entries && entries.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Rótulo</th>
                <th className="px-4 py-2 font-medium">Categoria</th>
                <th className="px-4 py-2 font-medium">Usuário</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  onClick={() => setDetalheEntry(entry)}
                  className="cursor-pointer border-t border-border hover:bg-surface-2"
                >
                  <td className="px-4 py-2.5 text-text">{entry.rotulo}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant="accent">
                      {VAULT_CATEGORIA_LABELS[entry.categoria]}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5 text-text-muted">
                    {entry.usuario ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <VaultEntryDialog open={criarAberto} onClose={() => setCriarAberto(false)} />

      <VaultEntryDialog
        open={!!editEntry}
        onClose={() => setEditEntry(undefined)}
        entry={editEntry}
      />

      <VaultEntryDetailDialog
        entry={detalheEntry}
        open={!!detalheEntry}
        onClose={() => setDetalheEntry(undefined)}
        onEdit={() => {
          setEditEntry(detalheEntry);
          setDetalheEntry(undefined);
        }}
      />
    </div>
  );
}
