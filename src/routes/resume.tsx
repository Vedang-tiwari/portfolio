import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DownloadButton } from "@/components/DownloadButton";
import { PROFILE, RESUME, type Registration } from "@/lib/portfolio";
import { useRegistration } from "@/lib/use-registration";
import { validateRealEmail } from "@/lib/email-validator";
import { Lock, UserCheck, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume & CV Access — Vedang Tiwari" },
      {
        name: "description",
        content:
          "Register with your name and real email to unlock Vedang Tiwari's full resume and downloadable CV.",
      },
      { property: "og:title", content: "Resume & CV Access — Vedang Tiwari" },
      {
        property: "og:description",
        content: "Register to unlock the full resume and download the CV.",
      },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  const { registration, hydrated, register: saveRegistration, clear } = useRegistration();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const purpose = String(form.get("purpose") ?? "").trim();

    if (name.length < 2 || name.length > 80) {
      setError("Please enter your real full name (2–80 characters).");
      return;
    }

    const validation = validateRealEmail(email);
    if (!validation.valid) {
      setError(validation.reason || "Please enter a valid, non-disposable email address.");
      return;
    }

    if (purpose.length > 300) {
      setError("Please keep the reason under 300 characters.");
      return;
    }

    const entry: Registration = {
      name,
      email,
      purpose,
      registeredAt: new Date().toISOString(),
    };

    setLoading(true);

    try {
      // Dispatch registration & owner email notification via backend endpoint
      const response = await fetch("/api/register-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Could not verify your email address. Please enter a real email.");
        setLoading(false);
        return;
      }

      // Access granted
      saveRegistration(entry);
    } catch {
      // Fallback — grant local access if offline
      saveRegistration(entry);
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) {
    return <section className="mx-auto max-w-3xl px-5 py-20" aria-busy="true" />;
  }

  if (!registration) {
    return (
      <section className="mx-auto max-w-xl px-5 py-16">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-flame-soft text-flame-red">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">Register to Unlock CV</h1>
            <p className="text-sm text-muted-foreground">
              Please provide your real details to view the resume and download the CV.
            </p>
          </div>
        </div>
        <div className="mt-6 rule-flame w-24" />

        <form
          onSubmit={register}
          className="mt-8 grid gap-5 border border-foreground bg-card p-6 shadow-block-sm"
          noValidate
        >
          <label className="text-sm">
            <span className="font-semibold text-foreground">Full Name *</span>
            <input
              name="name"
              required
              placeholder="Enter your full name (e.g. Alex Smith)"
              autoComplete="name"
              className="mt-1.5 w-full rounded-sm border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus-visible:border-flame-orange"
            />
          </label>

          <label className="text-sm">
            <span className="font-semibold text-foreground">Real Email Address *</span>
            <input
              name="email"
              type="email"
              required
              placeholder="Enter your real email (e.g. alex@gmail.com)"
              autoComplete="email"
              className="mt-1.5 w-full rounded-sm border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus-visible:border-flame-orange"
            />
            <span className="mt-1 block text-xs text-muted-foreground">
              Disposable or fake email addresses (e.g. tempmail/mailinator) will be rejected.
            </span>
          </label>

          <label className="text-sm">
            <span className="font-semibold text-foreground">Purpose / Reason (optional)</span>
            <textarea
              name="purpose"
              rows={3}
              maxLength={300}
              placeholder="Why are you interested in downloading the CV? (e.g. Hiring for AI/ML Engineer role, research collaboration...)"
              className="mt-1.5 w-full rounded-sm border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus-visible:border-flame-orange"
            />
          </label>

          {error && (
            <div className="rounded-sm border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-foreground bg-foreground px-6 py-3.5 text-base font-semibold text-background transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <UserCheck className="h-5 w-5" aria-hidden="true" />
            {loading ? "Verifying Email..." : "Register & Unlock CV Download"}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-bold sm:text-5xl">Resume</h1>
          <p className="mt-2 text-sm font-medium text-foreground">
            ✓ Unlocked for <span className="underline decoration-flame-orange">{registration.name}</span> ({registration.email})
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DownloadButton kind="cv" size="sm" />
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Re-register / Lock
          </button>
        </div>
      </div>

      <p className="mt-8 text-lg text-muted-foreground">{RESUME.summary}</p>

      <h2 className="mt-12 text-2xl font-bold">Experience</h2>
      <ul className="mt-5 space-y-5">
        {RESUME.experience.map((job) => (
          <li key={job.role} className="border border-border bg-card p-5">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-flame-red">
              {job.period}
            </p>
            <h3 className="mt-1.5 text-lg font-bold">
              {job.role} — {job.org}
            </h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              {job.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-2xl font-bold">Education</h2>
      <ul className="mt-5 space-y-5">
        {RESUME.education.map((ed) => (
          <li key={ed.degree} className="border border-border bg-card p-5">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-flame-red">
              {ed.period}
            </p>
            <h3 className="mt-1.5 text-lg font-bold">
              {ed.degree} — {ed.org}
            </h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              {ed.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-muted-foreground">
        Prefer a PDF? Use the download buttons — served from{" "}
        <code className="font-mono">{PROFILE.cvUrl}</code>.
      </p>
    </section>
  );
}
