"use client";

import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { useProfiles } from "@/lib/hooks/use-profiles";

export default function HomePage() {
  const user = useCurrentUser();
  const { data: profiles } = useProfiles();
  const meuNome = profiles?.find((p) => p.id === user?.id)?.nome;

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-semibold text-text">
        Bem-vindo, {meuNome ?? user?.email}
      </h1>
      <p className="text-sm text-text-muted">
        Escolha um módulo na barra lateral.
      </p>
    </div>
  );
}
