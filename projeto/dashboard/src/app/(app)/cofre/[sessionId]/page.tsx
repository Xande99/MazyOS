"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ResponsiveTable, type ResponsiveTableColumn } from "@/components/ui/responsive-table";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionDialog } from "@/components/cofre/session-dialog";
import { VaultEntryDetailDialog } from "@/components/cofre/vault-entry-detail-dialog";
import { VaultEntryDialog } from "@/components/cofre/vault-entry-dialog";
import { VAULT_CATEGORIA_LABELS } from "@/lib/constants/cofre";
import { useVaultEntries, useVaultSession } from "@/lib/hooks/use-cofre";
import type { VaultEntry } from "@/lib/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

export default function SessaoCofrePage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;
  const router = useRouter();

  const {
    data: session,
    isLoading: sessionLoading,
    isError: sessionError,
  } = useVaultSession(sessionId);

  const [busca, setBusca] = useState("");
  const { data: entries, isLoading, isError } = useVaultEntries({
    sessionId,
    busca,
  });

  const [editEntry, setEditEntry] = useState<VaultEntry | undefined>();
  const [detalheEntry, setDetalheEntry] = useState<VaultEntry | undefined>();
  const [criarAberto, setCriarAberto] = useState(false);
  const [editSessaoAberto, setEditSessaoAberto] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/cofre" className="text-sm text-text-muted hover:text-text">
        ← Todas as sessões
      </Link>

      {sessionError && (
        <p className="text-sm text-danger">
          Não foi possível carregar essa sessão.
        </p>
      )}

      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {sessionLoading ? (
            <Skeleton className="h-6 w-48" />
          ) : (
            <h1 className="text-lg font-semibold text-text">{session?.nome}</h1>
          )}
          {session?.notas && (
            <p className="mt-1 text-sm text-text-muted">{session.notas}</p>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setEditSessaoAberto(true)}>
            Editar sessão
          </Button>
          <Button
            onClick={() => {
              setEditEntry(undefined);
              setCriarAberto(true);
            }}
          >
            Nova credencial
          </Button>
        </div>
      </div>

      <Input
        placeholder="Buscar credencial..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="sm:max-w-xs"
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
          title="Nenhuma credencial nessa sessão"
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

      <VaultEntryDialog
        open={criarAberto}
        onClose={() => setCriarAberto(false)}
        sessionId={sessionId}
      />

      <VaultEntryDialog
        open={!!editEntry}
        onClose={() => setEditEntry(undefined)}
        entry={editEntry}
        sessionId={sessionId}
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

      <SessionDialog
        open={editSessaoAberto}
        onClose={() => setEditSessaoAberto(false)}
        session={session}
        onDeleted={() => router.push("/cofre")}
      />
    </div>
  );
}
