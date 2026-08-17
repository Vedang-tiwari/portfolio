import { ArrowUpRight } from "lucide-react";
import type { SectionKey } from "@/lib/portfolio";
import { SECTIONS } from "@/lib/portfolio";
import { useCollection } from "@/lib/use-collection";

/**
 * Visitor-facing portfolio section — strictly read-only.
 * Add / Delete / Restore defaults live in the owner studio (/owner).
 */
export function CollectionSection({ section }: { section: SectionKey }) {
  const meta = SECTIONS[section];
  const { items } = useCollection(section);

  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <div className="max-w-xl">
        <h1 className="text-4xl font-bold sm:text-5xl">{meta.title}</h1>
        <p className="mt-3 text-muted-foreground">{meta.blurb}</p>
      </div>

      <div className="mt-6 rule-flame w-24" />

      {items.length === 0 ? (
        <p className="mt-12 text-muted-foreground">
          Nothing published here yet — check back soon.
        </p>
      ) : (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="group flex flex-col border border-border bg-card p-5 transition-colors hover:border-foreground"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-red">
                {item.meta}
              </p>
              <h2 className="mt-2 text-lg font-bold leading-snug">{item.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.description}</p>
              <div className="mt-4">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 text-sm font-medium underline decoration-flame-orange decoration-2 underline-offset-4"
                  >
                    Open <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">No link</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
