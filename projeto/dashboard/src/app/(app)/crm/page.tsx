"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactDialog } from "@/components/crm/contact-dialog";
import { ContactDetailDialog } from "@/components/crm/contact-detail-dialog";
import { CATEGORIA_BADGE, CATEGORIA_LABELS } from "@/lib/constants/crm";
import { useContact, useContacts } from "@/lib/hooks/use-contacts";
import type { ContactCategory } from "@/lib/types";
import { useState } from "react";

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

      <div className="flex gap-3">
        <Input
          placeholder="Buscar por nome ou empresa..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={categoria}
          onChange={(e) =>
            setCategoria(e.target.value as ContactCategory | "")
          }
          className="max-w-[180px]"
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
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Nome</th>
                <th className="px-4 py-2 font-medium">Categoria</th>
                <th className="px-4 py-2 font-medium">Empresa</th>
                <th className="px-4 py-2 font-medium">Contato</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={() => setDetalheId(contact.id)}
                  className="cursor-pointer border-t border-border hover:bg-surface-2"
                >
                  <td className="px-4 py-2.5 text-text">{contact.nome}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={CATEGORIA_BADGE[contact.categoria]}>
                      {CATEGORIA_LABELS[contact.categoria]}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5 text-text-muted">
                    {contact.empresa ?? "—"}
                  </td>
                  <td className="px-4 py-2.5 text-text-muted">
                    {contact.telefone ?? contact.email ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
