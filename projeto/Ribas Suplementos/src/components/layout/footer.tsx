export function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-10 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 text-sm text-zinc-500 sm:px-6 dark:text-zinc-500">
        <p>© {new Date().getFullYear()} Ribas Suplementos. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
