import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/configurado";
import { SupabaseNaoConfigurado } from "@/components/ui/supabase-nao-configurado";
import { SairBotao } from "@/components/conta/sair-botao";
import { formatarPreco } from "@/lib/utils/currency";

export default async function ContaPage() {
  if (!supabaseConfigurado()) {
    return <SupabaseNaoConfigurado />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/conta");
  }

  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("id, status, total_centavos, criado_em")
    .order("criado_em", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Minha conta
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">{user.email}</p>
        </div>
        <SairBotao />
      </div>

      <h2 className="mb-4 text-base font-semibold text-zinc-950 dark:text-zinc-50">
        Meus pedidos
      </h2>

      {!pedidos || pedidos.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          Você ainda não fez nenhum pedido.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {pedidos.map((pedido) => (
            <li
              key={pedido.id}
              className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
            >
              <div>
                <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  Pedido #{pedido.id.slice(0, 8)}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  {new Date(pedido.criado_em).toLocaleDateString("pt-BR")} ·{" "}
                  {rotuloStatus(pedido.status)}
                </p>
              </div>
              <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                {formatarPreco(pedido.total_centavos)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function rotuloStatus(status: string) {
  const rotulos: Record<string, string> = {
    aguardando_pagamento: "Aguardando pagamento",
    pago: "Pago",
    enviado: "Enviado",
    entregue: "Entregue",
    cancelado: "Cancelado",
  };
  return rotulos[status] ?? status;
}
