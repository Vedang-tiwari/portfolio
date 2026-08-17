import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { AboutStats } from "@/components/AboutStats";
import { AboutText } from "@/components/AboutText";
import { CvButton } from "@/components/CvButton";
import { ConnectWithMe } from "@/components/ConnectWithMe";
import { SectionSidebar } from "@/components/SectionSidebar";
import { PROFILE, SECTIONS, SECTION_ORDER, DEFAULT_ITEMS } from "@/lib/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vedang Tiwari — AI/ML Engineer & CS Student" },
      {
        name: "description",
        content:
          "Vedang Tiwari builds AI-native systems: applied ML, data science and AI engineering projects, notes, writing and credentials.",
      },
      { property: "og:title", content: "Vedang Tiwari — AI/ML Engineer & CS Student" },
      {
        property: "og:description",
        content:
          "Applied ML, data science and AI engineering — projects, notes, writing and credentials.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="border-b border-border bg-flame-soft">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:pt-28">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-flame-red">
            {PROFILE.degree}
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[0.95] sm:text-7xl">
            {PROFILE.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            I'm {PROFILE.name} — {PROFILE.role} working across machine learning, data science
            and forward-deployed engineering.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <CvButton />
          </div>

          <div className="mt-10 rule-flame max-w-md" />
        </div>
      </section>

      <SectionSidebar />

      {/* Sections are rendered in a fixed order: About → … → Resume.
          The sidebar mirrors this same order for scroll highlighting. */}
      <section id="about" className="mx-auto max-w-6xl px-5 py-16 scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">About me</h2>
            <div className="mt-5 rule-flame w-16" />
            <AboutText className="mt-4 text-muted-foreground" />
            <Link
              to="/about"
              className="mt-5 inline-flex items-center gap-1 font-medium underline decoration-flame-orange decoration-2 underline-offset-4"
            >
              Read more <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <AboutStats />
        </div>
      </section>

      {SECTION_ORDER.map((key) => {
        const s = SECTIONS[key];
        return (
          <section
            key={key}
            id={key}
            className="border-t border-border scroll-mt-24"
          >
            <div className="mx-auto max-w-6xl px-5 py-16">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-xl">
                  <h2 className="text-3xl font-bold sm:text-4xl">{s.title}</h2>
                  <p className="mt-3 text-muted-foreground">{s.blurb}</p>
                </div>
                <Link
                  to={s.path}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-foreground px-4 py-2.5 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
                >
                  Open {s.label} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-6 rule-flame w-16" />
              {/* PLACEHOLDER entries — from DEFAULT_ITEMS in src/lib/portfolio.ts */}
              <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {DEFAULT_ITEMS[key].slice(0, 3).map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col border border-border bg-card p-5"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-red">
                      {item.meta}
                    </p>
                    <h3 className="mt-2 text-lg font-bold leading-snug">{item.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <section className="border-t border-border scroll-mt-24">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-3xl font-bold sm:text-4xl">CV</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Register once to download the CV. Details stay in your browser.
          </p>
          <div className="mt-6 rule-flame w-16" />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CvButton />
          </div>
        </div>
      </section>


      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-16">
          {/* Owner-managed social links; view-only for visitors */}
          <ConnectWithMe />
        </div>
      </section>
    </>
  );
}

