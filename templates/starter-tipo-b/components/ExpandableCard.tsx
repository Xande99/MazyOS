"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * Exemplo de Client Component com Motion — padrão de referência pra
 * qualquer elemento condicional (modal, toast, dropdown, card
 * expansível) do projeto.
 *
 * `useReducedMotion()` é o equivalente, no lado React, do
 * `gsap.matchMedia()` usado no starter Tipo A: se o usuário pediu
 * `prefers-reduced-motion: reduce`, a transição vira só opacidade,
 * sem deslocamento/escala.
 */
export function ExpandableCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="rounded-lg border border-line bg-white p-6 shadow-[--du-shadow-card]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left font-bold text-blue"
      >
        {title}
        <span aria-hidden="true" className="text-pink-ink">
          {open ? "–" : "+"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.15 }
                : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
            }
            className="overflow-hidden"
          >
            <div className="pt-4 text-[--du-text-body]">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
