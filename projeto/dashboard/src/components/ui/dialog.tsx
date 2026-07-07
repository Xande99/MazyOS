"use client";

import { cn } from "@/lib/utils/cn";
import { useEffect, useRef } from "react";

export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "m-0 h-[100dvh] max-h-[100dvh] w-full overflow-y-auto rounded-none border-0 bg-surface p-4 text-text backdrop:bg-black/60 sm:m-auto sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-lg sm:rounded-xl sm:border sm:border-border sm:p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded text-text-muted hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          ✕
        </button>
      </div>
      <div className="mt-4">{children}</div>
    </dialog>
  );
}
