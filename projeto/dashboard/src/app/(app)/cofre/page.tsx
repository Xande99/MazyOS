"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ResponsiveTable, type ResponsiveTableColumn } from "@/components/ui/responsive-table";
import { Skeleton } from "@/components/ui/skeleton";
import { VaultEntryDetailDialog } from "@/components/cofre/vault-entry-detail-dialog";
import { VaultEntryDialog } from "@/components/cofre/vault-entry-dialog";
import { VAULT_CATEGORIA_LABELS } from "@/lib/constants/cofre";
import { useVaultEntries } from "@/lib/hooks/use-cofre";
import type { VaultEntry } from "@/lib/types";
import { useState } from "react";

const COLUMNS: ResponsiveTableColumn<VaultEntry>[] = [
  {
    header: "Rótulo",
    mobile: "title",
    cell: (e) => <span className="text-text">{e.rotulo}</span>,
  },
  {
    header: "Categoria",
    mobile: "subtitle",
    cell: (e) => (
      <Badge variant="accent">{VAULT_CATEGORIA_LABELS[e.categoria]}</Badge>
    ),
  },
  {
    header: "Usuário",
    cell: (e) => <span className="text-text-muted">{e.usuario ?? "—"}</span>,
  },
];

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
        <ResponsiveTable
          data={entries}
          keyField={(e) => e.id}
          columns={COLUMNS}
          onRowClick={(e) => setDetalheEntry(e)}
        />
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
