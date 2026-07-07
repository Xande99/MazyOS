"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionDialog } from "@/components/cofre/session-dialog";
import { useVaultEntries, useVaultSessions } from "@/lib/hooks/use-cofre";
import Link from "next/link";
import { useState } from "react";

export default function CofrePage() {
  const [busca, setBusca] = useState("");
  const { data: sessions, isLoading, isError } = useVaultSessions(busca);
  const { data: entries } = useVaultEntries();
  const [criarAberto, setCriarAberto] = useState(false);

  const acessosPorSessao = new Map<string, number>();
  for (const entry of entries ?? []) {
    acessosPorSessao.set(
      entry.session_id,
      (acessosPorSessao.get(entry.session_id) ?? 0) + 1,
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold text-text">Cofre de acesso</h1>
        <Button onClick={() => setCriarAberto(true)}>Nova sessão</Button>
      </div>

      <Input
        placeholder="Buscar sessão..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="sm:max-w-xs"
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-danger">
          Não foi possível carregar as sessões.
        </p>
      )}

      {sessions && sessions.length === 0 && (
        <EmptyState
          title="Nenhuma sessão criada"
          description="Crie uma sessão pra agrupar as credenciais de um cliente (ou da própria duPolvo)."
        />
      )}

      {sessions && sessions.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => {
            const acessos = acessosPorSessao.get(session.id) ?? 0;
            return (
              <Link
                key={session.id}
                href={`/cofre/${session.id}`}
                className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4 hover:border-accent/50"
              >
                <p className="font-medium text-text">{session.nome}</p>
                <p className="text-sm text-text-muted">
                  {acessos} {acessos === 1 ? "acesso" : "acessos"}
                </p>
              </Link>
            );
          })}
        </div>
      )}

      <SessionDialog open={criarAberto} onClose={() => setCriarAberto(false)} />
    </div>
  );
}
