import { createFileRoute } from "@tanstack/react-router";
import { CvButton } from "@/components/CvButton";
import { AboutText } from "@/components/AboutText";
import { ConnectWithMe } from "@/components/ConnectWithMe";
import { PROFILE } from "@/lib/portfolio";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Vedang Tiwari" },
      {
        name: "description",
        content:
          "Vedang Tiwari: final-year B.Tech CSE (AIML) student working on applied machine learning, AI engineering and forward-deployed engineering.",
      },
      { property: "og:title", content: "About — Vedang Tiwari" },
      {
        property: "og:description",
        content: "Final-year CSE (AIML) student working on applied ML and AI engineering.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-4xl font-bold sm:text-5xl">About me</h1>
      <div className="mt-6 rule-flame w-24" />
      {/* Owner-editable copy (see /owner); falls back to PROFILE.about */}
      <AboutText className="mt-8 text-lg text-muted-foreground" />

      <dl className="mt-10 grid gap-4 sm:grid-cols-2">
        {[
          { k: "Education", v: PROFILE.degree },
          { k: "Role", v: PROFILE.role },
          { k: "Based in", v: PROFILE.location },
          { k: "Email", v: PROFILE.email },
        ].map((row) => (
          <div key={row.k} className="border border-border bg-card p-4">
            <dt className="font-mono text-xs uppercase tracking-[0.16em] text-flame-red">
              {row.k}
            </dt>
            <dd className="mt-1.5 text-sm">{row.v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <CvButton />
      </div>

      {/* Connect with Me — owner-managed links, view-only for everyone */}
      <ConnectWithMe className="mt-14" />
    </section>
  );
}
