import { SOCIALS } from "@/lib/portfolio";
import { useOwner } from "@/lib/use-owner";

/**
 * "Connect with Me" — read-only list of the owner's social/platform links.
 * Owner-managed links (from /owner) win over the defaults in portfolio.ts.
 * No add / delete controls here: visitors and owner see the same list.
 */
export function ConnectWithMe({
  title = "Contact Me",
  className = "",
}: {
  title?: string;
  className?: string;
}) {
  const { content } = useOwner();
  const links = content.socials ?? SOCIALS;

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      <div className="mt-4 rule-flame w-16" />
      {links.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No links published yet.</p>
      ) : (
        <ul className="mt-6 flex flex-wrap gap-3">
          {links.map((s) => (
            <li key={`${s.label}-${s.href}`}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:border-foreground"
              >
                {s.label}
                {s.handle && (
                  <span className="font-mono text-xs text-muted-foreground">{s.handle}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
