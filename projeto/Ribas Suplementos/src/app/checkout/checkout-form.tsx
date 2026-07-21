"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCarrinho } from "@/lib/cart/cart-context";
import { formatarPreco } from "@/lib/utils/currency";
import { criarPedido } from "./actions";

export function CheckoutForm() {
  const router = useRouter();
  const { itens, totalCentavos, limpar } = useCarrinho();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  // Date.now() não pode rodar durante o render (regra de pureza do React) —
  // marcado no efeito de montagem, roda 1x logo depois do 1º paint.
  const carregadoEm = useRef(0);
  useEffect(() => {
    carregadoEm.current = Date.now();
  }, []);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    const dados = new FormData(evento.currentTarget);

    const resultado = await criarPedido(
      {
        nomeCliente: String(dados.get("nomeCliente") ?? ""),
        emailCliente: String(dados.get("emailCliente") ?? ""),
        telefoneCliente: String(dados.get("telefoneCliente") ?? ""),
        endereco: {
          rua: String(dados.get("rua") ?? ""),
          numero: String(dados.get("numero") ?? ""),
          complemento: String(dados.get("complemento") ?? ""),
          bairro: String(dados.get("bairro") ?? ""),
          cidade: String(dados.get("cidade") ?? ""),
          uf: String(dados.get("uf") ?? ""),
          cep: String(dados.get("cep") ?? ""),
        },
        itens: itens.map((item) => ({
          produtoId: item.produtoId,
          varianteId: item.varianteId,
          quantidade: item.quantidade,
        })),
      },
      {
        honeypot: String(dados.get("site") ?? ""),
        carregadoEm: carregadoEm.current,
      },
    );

    setEnviando(false);

    if (!resultado.sucesso) {
      setErro(resultado.erro);
      return;
    }

    limpar();
    router.push(`/checkout/sucesso/${resultado.pedidoId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* honeypot anti-spam: invisível pra humano, bot de formulário costuma preencher tudo */}
      <input
        type="text"
        name="site"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0"
      />

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-base font-semibold text-zinc-950 dark:text-zinc-50">
          Seus dados
        </legend>
        <Campo label="Nome completo" name="nomeCliente" autoComplete="name" required />
        <Campo label="E-mail" name="emailCliente" type="email" autoComplete="email" required />
        <Campo label="Telefone" name="telefoneCliente" autoComplete="tel" required />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-base font-semibold text-zinc-950 dark:text-zinc-50">
          Entrega
        </legend>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Campo label="Rua" name="rua" autoComplete="address-line1" required />
          </div>
          <Campo label="Número" name="numero" required />
        </div>
        <Campo label="Complemento" name="complemento" />
        <Campo label="Bairro" name="bairro" required />
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Campo label="Cidade" name="cidade" autoComplete="address-level2" required />
          </div>
          <Campo label="UF" name="uf" maxLength={2} autoComplete="address-level1" required />
        </div>
        <Campo label="CEP" name="cep" autoComplete="postal-code" required />
      </fieldset>

      {erro && (
        <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
          {erro}
        </p>
      )}

      <div className="flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <span className="text-base font-medium text-zinc-950 dark:text-zinc-50">
          Total
        </span>
        <span className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
          {formatarPreco(totalCentavos)}
        </span>
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="flex w-full items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        {enviando ? "Enviando pedido…" : "Finalizar pedido"}
      </button>
    </form>
  );
}

function Campo({
  label,
  name,
  type = "text",
  ...props
}: {
  label: string;
  name: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      <input
        name={name}
        type={type}
        className="rounded-lg border border-zinc-200 px-3 py-2 text-zinc-950 outline-none transition-colors focus:border-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50"
        {...props}
      />
    </label>
  );
}
