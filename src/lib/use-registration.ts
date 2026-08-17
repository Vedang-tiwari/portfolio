import { useCallback, useEffect, useState } from "react";
import { REGISTRATION_KEY, type Registration } from "./portfolio";

/** Visitor registration state — the gate in front of every download. */
export function useRegistration() {
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => {
      try {
        const raw = window.localStorage.getItem(REGISTRATION_KEY);
        setRegistration(raw ? (JSON.parse(raw) as Registration) : null);
      } catch {
        setRegistration(null);
      }
    };
    sync();
    setHydrated(true);
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const register = useCallback((entry: Registration) => {
    setRegistration(entry);
    try {
      window.localStorage.setItem(REGISTRATION_KEY, JSON.stringify(entry));
    } catch {
      /* session-only access if storage is blocked */
    }
  }, []);

  const clear = useCallback(() => {
    setRegistration(null);
    try {
      window.localStorage.removeItem(REGISTRATION_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { registration, hydrated, register, clear };
}
