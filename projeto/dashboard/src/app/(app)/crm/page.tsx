"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ResponsiveTable, type ResponsiveTableColumn } from "@/components/ui/responsive-table";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactDialog } from "@/components/crm/contact-dialog";
import { ContactDetailDialog } from "@/components/crm/contact-detail-dialog";
import { CATEGORIA_BADGE, CATEGORIA_LABELS } from "@/lib/constants/crm";
import { useContact, useContacts } from "@/lib/hooks/use-contacts";
import type { Contact, ContactCategory } from "@/lib/types";
import { useState } from "react";

const COLUMNS: ResponsiveTableColumn<Contact>[] = [
  { header: "Nome", mobile: "title", cell: (c) => <span className="text-text">{c.nome}</span> },
  {
    header: "Categoria",
    mobile: "subtitle",
    cell: (c) => (
      <Badge variant={CATEGORIA_BADGE[c.categoria]}>
        {CATEGORIA_LABELS[c.categoria]}
      </Badge>
    ),
  },
  {
    header: "Empresa",
    cell: (c) => <span className="text-text-muted">{c.empresa ?? "—"}</span>,
  },
  {
    header: "Contato",
    cell: (c) => (
      <span className="text-text-muted">{c.telefone ?? c.email ?? "—"}</span>
    ),
  },
];

export default function CrmPage() {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<ContactCategory | "">("");
  const [criarAberto, setCriarAberto] = useState(false);
  const [editarId, setEditarId] = useState<string | null>(null);
  const [detalheId, setDetalheId] = useState<string | null>(null);

  const { data: contacts, isLoading, isError } = useContacts({
    busca: busca || undefined,
    categoria: categoria || undefined,
  });

  const { data: contatoEmEdicao } = useContact(editarId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-text">CRM</h1>
        <Button onClick={() => setCriarAberto(true)}>Novo contato</Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Buscar por nome ou empresa..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select
          value={categoria}
          onChange={(e) =>
            setCategoria(e.target.value as ContactCategory | "")
          }
          className="sm:max-w-[180px]"
        >
          <option value="">Todas categorias</option>
          {Object.entries(CATEGORIA_LABELS).map(([valor, label]) => (
            <option key={valor} value={valor}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-danger">
          Não foi possível carregar os contatos.
        </p>
      )}

      {contacts && contacts.length === 0 && (
        <EmptyState
          title="Nenhum contato encontrado"
          description="Ajuste a busca ou cadastre o primeiro contato."
        />
      )}

      {contacts && contacts.length > 0 && (
        <ResponsiveTable
          data={contacts}
          keyField={(c) => c.id}
          columns={COLUMNS}
          onRowClick={(c) => setDetalheId(c.id)}
        />
      )}

      <ContactDialog open={criarAberto} onClose={() => setCriarAberto(false)} />

      <ContactDialog
        open={!!editarId}
        onClose={() => setEditarId(null)}
        contact={contatoEmEdicao}
      />

      <ContactDetailDialog
        contactId={detalheId}
        open={!!detalheId}
        onClose={() => setDetalheId(null)}
        onEdit={() => {
          if (detalheId) {
            setEditarId(detalheId);
            setDetalheId(null);
          }
        }}
      />
    </div>
  );
}
