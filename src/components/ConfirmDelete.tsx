import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

/** Typed-confirmation phrase required before anything is deleted. */
export const PROJECT_NAME = "Vedang Tiwari";

/**
 * Destructive-action guard. Nothing is removed until the owner types the
 * project name exactly, so accidental clicks can never delete content.
 */
export function ConfirmDelete({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const matches = value.trim() === PROJECT_NAME;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/40 p-5"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md border border-foreground bg-card p-6 shadow-block"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" aria-hidden="true" />
          <div className="min-w-0">
            <h2 className="text-lg font-bold">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (matches) onConfirm();
          }}
          className="mt-5 grid gap-3"
        >
          <label className="text-sm">
            <span className="font-medium">
              Type <code className="font-mono">{PROJECT_NAME}</code> to confirm
            </span>
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={PROJECT_NAME}
              className="mt-1.5 w-full rounded-sm border border-input bg-background px-3 py-2 outline-none focus-visible:border-flame-orange"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={!matches}
              className="rounded-sm border border-destructive bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-sm border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
