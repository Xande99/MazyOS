export function SupabaseNaoConfigurado() {
  return (
    <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
      <h1 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
        Banco de dados ainda não configurado
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Falta criar o projeto no Supabase e preencher o{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-900">
          .env.local
        </code>
        . Veja o passo a passo em{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-900">
          _memoria/checklist-novo-projeto-supabase.md
        </code>
        .
      </p>
    </div>
  );
}
