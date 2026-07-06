import { EstoqueTabs } from "@/components/estoque/estoque-tabs";

export default function EstoqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-text">Estoque / Financeiro</h1>
      <EstoqueTabs />
      {children}
    </div>
  );
}
