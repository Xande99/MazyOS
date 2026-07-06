"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EventDialog } from "@/components/calendario/event-dialog";
import { MonthView } from "@/components/calendario/month-view";
import { WeekView } from "@/components/calendario/week-view";
import { useEvents } from "@/lib/hooks/use-calendar";
import type { CalendarEvent } from "@/lib/types";
import {
  addDays,
  buildMonthGrid,
  endOfDay,
  startOfWeek,
} from "@/lib/utils/calendar";
import { cn } from "@/lib/utils/cn";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

type Modo = "mes" | "semana";

export default function CalendarioPage() {
  const [modo, setModo] = useState<Modo>("mes");
  const [referencia, setReferencia] = useState(new Date());
  const [editEvent, setEditEvent] = useState<CalendarEvent | undefined>();
  const [novaData, setNovaData] = useState<Date | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const range =
    modo === "mes"
      ? (() => {
          const weeks = buildMonthGrid(referencia);
          return { start: weeks[0][0], end: endOfDay(weeks[5][6]) };
        })()
      : (() => {
          const start = startOfWeek(referencia);
          return { start, end: endOfDay(addDays(start, 6)) };
        })();

  const { data: events, isLoading, isError } = useEvents(range);

  function navegar(delta: number) {
    setReferencia((atual) => {
      const nova = new Date(atual);
      if (modo === "mes") nova.setMonth(nova.getMonth() + delta);
      else nova.setDate(nova.getDate() + delta * 7);
      return nova;
    });
  }

  function abrirNovoEvento(data: Date) {
    setEditEvent(undefined);
    setNovaData(data);
    setDialogOpen(true);
  }

  function abrirEdicao(evento: CalendarEvent) {
    setEditEvent(evento);
    setNovaData(undefined);
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-text first-letter:uppercase">
          {format(referencia, modo === "mes" ? "MMMM yyyy" : "'Semana de' d 'de' MMMM", {
            locale: ptBR,
          })}
        </h1>

        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setModo("mes")}
              className={cn(
                "px-3 py-1.5 text-sm",
                modo === "mes" ? "bg-accent text-white" : "text-text-muted",
              )}
            >
              Mês
            </button>
            <button
              type="button"
              onClick={() => setModo("semana")}
              className={cn(
                "px-3 py-1.5 text-sm",
                modo === "semana" ? "bg-accent text-white" : "text-text-muted",
              )}
            >
              Semana
            </button>
          </div>

          <Button variant="secondary" onClick={() => navegar(-1)}>
            ←
          </Button>
          <Button variant="secondary" onClick={() => setReferencia(new Date())}>
            Hoje
          </Button>
          <Button variant="secondary" onClick={() => navegar(1)}>
            →
          </Button>
          <Button onClick={() => abrirNovoEvento(new Date())}>Novo evento</Button>
        </div>
      </div>

      {isLoading && <Skeleton className="h-[500px] w-full" />}

      {isError && (
        <p className="text-sm text-danger">
          Não foi possível carregar os eventos.
        </p>
      )}

      {events &&
        (modo === "mes" ? (
          <MonthView
            reference={referencia}
            events={events}
            onDayClick={abrirNovoEvento}
            onEventClick={abrirEdicao}
          />
        ) : (
          <WeekView
            reference={referencia}
            events={events}
            onDayClick={abrirNovoEvento}
            onEventClick={abrirEdicao}
          />
        ))}

      <EventDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        event={editEvent}
        dataPadrao={novaData}
      />
    </div>
  );
}
