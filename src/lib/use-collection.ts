import { useCallback, useEffect, useState } from "react";
import {
  COLLECTION_CHANGE_EVENT,
  DEFAULT_ITEMS,
  fetchPortfolioData,
  savePortfolioData,
  newId,
  readCollection,
  storageKey,
  type PortfolioItem,
  type SectionKey,
} from "./portfolio";

/**
 * Section content backed by data/portfolio.json (API sync across devices) + localStorage fallback.
 */
export function useCollection(section: SectionKey) {
  const [items, setItems] = useState<PortfolioItem[]>(DEFAULT_ITEMS[section]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // 1. Immediate load from local storage / memory
    try {
      const local = readCollection(section);
      if (local && local.length > 0) {
        setItems(local);
      }
    } catch {
      /* ignore */
    }

    // 2. Async fetch from /api/portfolio or data/portfolio.json for cross-device sync
    fetchPortfolioData().then((remoteData) => {
      if (cancelled) return;
      if (remoteData && Array.isArray(remoteData[section])) {
        setItems(remoteData[section]);
        try {
          window.localStorage.setItem(storageKey(section), JSON.stringify(remoteData[section]));
        } catch {
          /* ignore */
        }
      }
      setHydrated(true);
    });

    // Stay in sync across tabs or in-tab events
    const sync = () => setItems(readCollection(section));
    window.addEventListener(COLLECTION_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelled = true;
      window.removeEventListener(COLLECTION_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [section]);

  const persist = useCallback(
    (next: PortfolioItem[]) => {
      setItems(next);
      try {
        window.localStorage.setItem(storageKey(section), JSON.stringify(next));
      } catch {
        /* storage full or blocked — keep in-memory state */
      }
      // Save remotely to data/portfolio.json via API
      savePortfolioData({ [section]: next });

      // Notify derived views in this tab
      window.dispatchEvent(new Event(COLLECTION_CHANGE_EVENT));
    },
    [section],
  );

  const addItem = useCallback(
    (item: Omit<PortfolioItem, "id">) => persist([{ ...item, id: newId() }, ...items]),
    [items, persist],
  );

  const removeItem = useCallback(
    (id: string) => persist(items.filter((i) => i.id !== id)),
    [items, persist],
  );

  const reset = useCallback(() => persist(DEFAULT_ITEMS[section]), [persist, section]);

  return { items, hydrated, addItem, removeItem, reset };
}
