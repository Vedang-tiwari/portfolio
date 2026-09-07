import { Link } from "@tanstack/react-router";
import { PROFILE, SECTIONS, SECTION_ORDER, SOCIALS } from "@/lib/portfolio";
import { useRegistration } from "@/lib/use-registration";
import { useOwner } from "@/lib/use-owner";

export function SiteFooter() {
  const { registration } = useRegistration();
  const { content } = useOwner();

  const uploaded = content.cv;
  const href = uploaded?.dataUrl ?? PROFILE.cvUrl;
  const fileName = uploaded?.name ?? PROFILE.cvFileName;

  return (
    <footer className="mt-24 border-t border-border">
      <div className="rule-flame" />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold">{PROFILE.siteName}</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            {PROFILE.degree} — {PROFILE.role}, {PROFILE.location}.
          </p>
          <a
            href={`mailto:${PROFILE.email}`}
            className="mt-3 inline-block text-sm underline decoration-flame-orange decoration-2 underline-offset-4"
          >
            {PROFILE.email}
          </a>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Portfolio
          </p>
          <ul className="mt-3 space-y-2">
            {SECTION_ORDER.map((key) => (
              <li key={key}>
                <Link
                  to={SECTIONS[key].path}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {SECTIONS[key].label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            More
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About me
              </Link>
            </li>
            <li>
              {registration ? (
                <a
                  href={href}
                  download={fileName}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Download CV
                </a>
              ) : (
                <Link
                  to="/resume"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Register to unlock CV
                </Link>
              )}
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Elsewhere
          </p>
          <ul className="mt-3 space-y-2">
            {/* PLACEHOLDER links — configure in src/lib/portfolio.ts (SOCIALS) */}
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {s.label} <span className="text-xs">{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-10">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {PROFILE.name}. Built with TanStack Start.
        </p>
      </div>
    </footer>
  );
}
