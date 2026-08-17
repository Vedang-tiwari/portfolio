export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  
  // Safe console error reporting outside of Lovable preview environment
  if (import.meta.env.DEV) {
    console.error("[Runtime Error]", error, context);
  }
}
