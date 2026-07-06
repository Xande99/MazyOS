import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useId } from "react";

/**
 * Assina mudanças em tempo real de uma tabela do Supabase e invalida o
 * cache do TanStack Query correspondente, pra manter os 4 sócios
 * sincronizados sem precisar dar refresh manual.
 *
 * O nome do canal inclui `useId()` porque o client do Supabase reaproveita
 * o mesmo objeto de canal quando duas instâncias do hook (ex: o mesmo
 * hook usado ao mesmo tempo no board e num dialog) pedem o mesmo nome —
 * a segunda tentativa de registrar o listener quebra porque o canal já
 * está inscrito. Um id por instância evita a colisão.
 */
export function useRealtimeTable(table: string, queryKey: readonly unknown[]) {
  const queryClient = useQueryClient();
  const queryKeyDep = JSON.stringify(queryKey);
  const instanceId = useId();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`realtime:${table}:${queryKeyDep}:${instanceId}`)
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

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, queryClient, queryKeyDep, instanceId]);
}
