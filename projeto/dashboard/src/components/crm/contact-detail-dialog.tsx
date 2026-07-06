"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIA_BADGE, CATEGORIA_LABELS } from "@/lib/constants/crm";
import {
  useAddInteraction,
  useContact,
  useContactInteractions,
  useDeleteContact,
} from "@/lib/hooks/use-contacts";
import { useProfiles } from "@/lib/hooks/use-profiles";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FormEvent, useState } from "react";

export function ContactDetailDialog({
  contactId,
  open,
  onClose,
  onEdit,
}: {
  contactId: string | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}) {
  const { data: contact } = useContact(open ? contactId : null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={contact?.nome ?? "Contato"}
      className="max-w-xl"
    >
      {open && contactId && (
        <ContactDetailContent
          key={contactId}
          contactId={contactId}
          onClose={onClose}
          onEdit={onEdit}
        />
      )}
    </Dialog>
  );
}

function ContactDetailContent({
  contactId,
  onClose,
  onEdit,
}: {
  contactId: string;
  onClose: () => void;
  onEdit: () => void;
}) {
  const { data: contact, isLoading, isError } = useContact(contactId);
  const { data: interactions, isLoading: interacoesCarregando } =
    useContactInteractions(contactId);
  const { data: profiles } = useProfiles();
  const addInteraction = useAddInteraction(contactId);
  const deleteContact = useDeleteContact();
  const [nota, setNota] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  async function handleAddInteraction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!nota.trim()) return;
    setErro(null);
    try {
      await addInteraction.mutateAsync(nota.trim());
      setNota("");
    } catch {
      setErro("Não foi possível salvar a nota. Tenta de novo.");
    }
  }

  async function handleDelete() {
    if (!contact) return;
    if (!window.confirm(`Excluir "${contact.nome}"? Não dá pra desfazer.`)) {
      return;
    }
    await deleteContact.mutateAsync(contact.id);
    onClose();
  }

  function nomeDoAutor(id: string | null) {
    return profiles?.find((p) => p.id === id)?.nome ?? "alguém";
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (isError || !contact) {
    return (
      <p className="text-sm text-danger">
        Não foi possível carregar esse contato.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={CATEGORIA_BADGE[contact.categoria]}>
          {CATEGORIA_LABELS[contact.categoria]}
        </Badge>
        {contact.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {contact.empresa && <Info label="Empresa" value={contact.empresa} />}
        {contact.telefone && (
          <Info label="Telefone" value={contact.telefone} />
        )}
        {contact.email && <Info label="E-mail" value={contact.email} />}
        {contact.endereco && (
          <Info label="Endereço" value={contact.endereco} />
        )}
      </dl>

      {contact.notas && (
        <p className="whitespace-pre-wrap text-sm text-text-muted">
          {contact.notas}
        </p>
      )}

      <div className="flex justify-end gap-3 border-b border-border pb-4">
        <Button variant="secondary" onClick={handleDelete}>
          Excluir
        </Button>
        <Button variant="secondary" onClick={onEdit}>
          Editar
        </Button>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text">
          Histórico de interação
        </h3>

        {interacoesCarregando && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}

        {!interacoesCarregando && interactions?.length === 0 && (
          <EmptyState title="Nenhuma interação registrada ainda." />
        )}

        {interactions && interactions.length > 0 && (
          <ul className="flex flex-col gap-3">
            {interactions.map((interaction) => (
              <li
                key={interaction.id}
                className="rounded-lg border border-border bg-surface-2 p-3 text-sm"
              >
                <p className="text-text">{interaction.nota}</p>
                <p className="mt-1 text-xs text-text-muted">
                  {nomeDoAutor(interaction.created_by)} ·{" "}
                  {formatDistanceToNow(new Date(interaction.created_at), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={handleAddInteraction}
          className="mt-4 flex flex-col gap-2"
        >
          <Textarea
            rows={2}
            placeholder="Registrar novo contato, reunião, retorno..."
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />
          {erro && (
            <p role="alert" className="text-sm text-danger">
              {erro}
            </p>
          )}
          <Button
            type="submit"
            variant="secondary"
            disabled={addInteraction.isPending || !nota.trim()}
            className="self-end"
          >
            {addInteraction.isPending ? "Salvando..." : "Adicionar"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-text-muted">{label}</dt>
      <dd className="text-text">{value}</dd>
    </div>
  );
}
