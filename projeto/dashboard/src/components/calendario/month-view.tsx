"use client";

import type { CalendarEvent } from "@/lib/types";
import {
  buildMonthGrid,
  endOfDay,
  isSameDay,
  startOfDay,
} from "@/lib/utils/calendar";
import { cn } from "@/lib/utils/cn";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function MonthView({
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
  const weeks = buildMonthGrid(reference);
  const hoje = new Date();

  function eventsForDay(day: Date) {
    const inicioDia = startOfDay(day);
    const fimDia = endOfDay(day);
    return events.filter(
      (ev) => new Date(ev.inicio) <= fimDia && new Date(ev.fim) >= inicioDia,
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-7 bg-surface-2 text-xs font-medium text-text-muted">
        {DIAS_SEMANA.map((dia) => (
          <div key={dia} className="px-2 py-2 text-center">
            {dia}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {weeks.flat().map((day) => {
          const doMes = day.getMonth() === reference.getMonth();
          const diaEventos = eventsForDay(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onDayClick(day)}
              className={cn(
                "flex min-h-[100px] flex-col gap-1 border-b border-r border-border p-2 text-left align-top hover:bg-surface-2",
                !doMes && "opacity-40",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  isSameDay(day, hoje) && "bg-accent text-white",
                  !isSameDay(day, hoje) && "text-text-muted",
                )}
              >
                {day.getDate()}
              </span>

              <div className="flex flex-col gap-1">
                {diaEventos.slice(0, 3).map((ev) => (
                  <span
                    key={ev.id}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(ev);
                    }}
                    className="truncate rounded bg-accent/15 px-1.5 py-0.5 text-xs text-accent hover:bg-accent/25"
                  >
                    {ev.titulo}
                  </span>
                ))}
                {diaEventos.length > 3 && (
                  <span className="text-xs text-text-muted">
                    +{diaEventos.length - 3} mais
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
