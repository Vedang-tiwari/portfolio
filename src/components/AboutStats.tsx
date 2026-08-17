import { useAboutStats } from "@/lib/use-about-stats";

/**
 * About-section stat cards. Values are derived from the live data source
 * (section collections + PROFILE.codingSince), never hard-coded.
 */
export function AboutStats({ className = "" }: { className?: string }) {
  const stats = useAboutStats();

  return (
    <ul className={`grid grid-cols-2 gap-4 self-start ${className}`}>
      {stats.map((s) => (
        <li key={s.key} className="border border-border bg-card p-5">
          <p className="font-display text-3xl font-bold">{s.value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
        </li>
      ))}
    </ul>
  );
}
