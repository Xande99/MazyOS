import { cn } from "@/lib/utils/cn";
import { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "neutral" | "success" | "warning" | "danger" | "accent";
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "neutral" && "bg-surface-2 text-text-muted",
        variant === "success" && "bg-success/15 text-success",
        variant === "warning" && "bg-warning/15 text-warning",
        variant === "danger" && "bg-danger/15 text-danger",
        variant === "accent" && "bg-accent/15 text-accent",
        className,
      )}
      {...props}
    />
  );
}
