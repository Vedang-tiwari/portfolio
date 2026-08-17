import { useCallback, useEffect, useState } from "react";
import {
  COLLECTION_CHANGE_EVENT,
  PROFILE,
  readCollection,
  type SectionKey,
} from "./portfolio";

export interface AboutStat {
  key: string;
  label: string;
  value: string;
}

/** Whole years elapsed since PROFILE.codingSince — increments on its own. */
function yearsSince(iso: string) {
  const start = new Date(iso).getTime();
  if (Number.isNaN(start)) return 0;
  const years = (Date.now() - start) / (365.2425 * 24 * 60 * 60 * 1000);
  return Math.max(0, Math.floor(years));
}

function count(section: SectionKey) {
  return readCollection(section).length;
}

function derive(): AboutStat[] {
  const projects = count("projects");
  const certificates = count("certificates");
  const years = yearsSince(PROFILE.codingSince);
  return [
    { key: "projects", label: "Projects shipped", value: projects ? `${projects}` : "—" },
    { key: "certificates", label: "Certificates", value: `${certificates}` },
    { key: "years", label: "Years coding", value: years ? `${years}+` : "<1" },
    { key: "focus", label: "Focus", value: PROFILE.focus },
  ];
}

/**
 * Stats derived from the live data source (the section collections + the
 * coding-since date). Nothing is hard-coded: adding a project or certificate
 * — in this tab or another — updates these numbers immediately.
 */
export function useAboutStats() {
  // Start from the defaults so SSR and the first client render agree.
  const [stats, setStats] = useState<AboutStat[]>(() => derive());

  const refresh = useCallback(() => setStats(derive()), []);

  useEffect(() => {
    refresh();
    window.addEventListener(COLLECTION_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener(COLLECTION_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  return stats;
}
