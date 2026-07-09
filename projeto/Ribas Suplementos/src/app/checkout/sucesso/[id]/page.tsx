import Link from "next/link";

export default async function PedidoConfirmadoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
        Pedido recebido!
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Número do pedido: <span className="font-mono">{id}</span>
        <br />
        Em breve entramos em contato pra confirmar o pagamento.
      </p>
      <Link
        href="/catalogo"
        className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        Continuar comprando
      </Link>
    </div>
  );
}
