import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type RegistryEntry = {
  channel: RealtimeChannel;
  refCount: number;
  removalTimer: ReturnType<typeof setTimeout> | null;
};

/**
 * O client do Supabase reaproveita uma única conexão websocket pra
 * toda a aplicação. Um canal por instância de componente montada
 * (lista + dialog + navegação entre páginas, tudo ao mesmo tempo)
 * gera abre/fecha demais nessa conexão compartilhada e derruba o
 * socket pra todo mundo — não só pra quem causou. Esse registro
 * garante no máximo um canal por (tabela, queryKey), reaproveitado
 * entre todos os componentes que o usam ao mesmo tempo, com um
 * pequeno atraso antes de remover (a última instância desmontando
 * durante uma navegação rápida não derruba o canal se outra remontar
 * logo em seguida).
 */
const registry = new Map<string, RegistryEntry>();

/**
 * Assina mudanças em tempo real de uma tabela do Supabase e invalida o
 * cache do TanStack Query correspondente, pra manter os 4 sócios
 * sincronizados sem precisar dar refresh manual.
 */
export function useRealtimeTable(table: string, queryKey: readonly unknown[]) {
  const queryClient = useQueryClient();
  const queryKeyDep = JSON.stringify(queryKey);

  useEffect(() => {
    const key = `${table}:${queryKeyDep}`;
    let entry = registry.get(key);

    if (entry?.removalTimer) {
      clearTimeout(entry.removalTimer);
      entry.removalTimer = null;
    }

    if (!entry) {
      const supabase = createClient();
      const channel = supabase
        .channel(`realtime:${key}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          () => {
            queryClient.invalidateQueries({ queryKey });
          },
        )
        .subscribe((status, err) => {
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            console.error(`realtime "${table}" falhou ao inscrever:`, status, err);
          }
        });

      entry = { channel, refCount: 0, removalTimer: null };
      registry.set(key, entry);
    }

    entry.refCount += 1;

    return () => {
      const current = registry.get(key);
      if (!current) return;

      current.refCount -= 1;
      if (current.refCount > 0) return;

      current.removalTimer = setTimeout(() => {
        const stillUnused = registry.get(key);
        if (stillUnused && stillUnused.refCount <= 0) {
          const supabase = createClient();
          supabase.removeChannel(stillUnused.channel);
          registry.delete(key);
        }
      }, 1000);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, queryClient, queryKeyDep]);
}
