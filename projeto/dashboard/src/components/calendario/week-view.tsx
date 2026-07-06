"use client";

import type { CalendarEvent } from "@/lib/types";
import {
  addDays,
  endOfDay,
  isSameDay,
  startOfDay,
  startOfWeek,
} from "@/lib/utils/calendar";
import { cn } from "@/lib/utils/cn";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function WeekView({
  reference,
  events,
  onDayClick,
  onEventClick,
}: {
  reference: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}) {
  const start = startOfWeek(reference);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const hoje = new Date();

  function eventsForDay(day: Date) {
    const inicioDia = startOfDay(day);
    const fimDia = endOfDay(day);
    return events
      .filter(
        (ev) => new Date(ev.inicio) <= fimDia && new Date(ev.fim) >= inicioDia,
      )
      .sort(
        (a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime(),
      );
  }

  return (
    <div className="grid grid-cols-7 gap-3">
      {days.map((day) => (
        <div
          key={day.toISOString()}
          className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3"
        >
          <button
            type="button"
            onClick={() => onDayClick(day)}
            className="flex items-center justify-between text-left"
          >
            <span className="text-xs capitalize text-text-muted">
              {format(day, "EEE", { locale: ptBR })}
            </span>
            <span
              className={cn(
                "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                isSameDay(day, hoje) ? "bg-accent text-white" : "text-text",
              )}
            >
              {day.getDate()}
            </span>
          </button>

          <div className="flex flex-col gap-1.5">
            {eventsForDay(day).map((ev) => (
              <button
                key={ev.id}
                type="button"
                onClick={() => onEventClick(ev)}
                className="rounded-lg bg-accent/15 px-2 py-1 text-left text-xs text-accent hover:bg-accent/25"
              >
                {!ev.dia_inteiro && (
                  <span className="mr-1 font-medium">
                    {format(new Date(ev.inicio), "HH:mm")}
                  </span>
                )}
                {ev.titulo}
              </button>
            ))}
            {eventsForDay(day).length === 0 && (
              <span className="text-xs text-text-muted">—</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
