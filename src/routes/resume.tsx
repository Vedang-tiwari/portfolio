import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DownloadButton } from "@/components/DownloadButton";
import { PROFILE, RESUME, type Registration } from "@/lib/portfolio";
import { useRegistration } from "@/lib/use-registration";
import { validateRealEmail } from "@/lib/email-validator";
import { Lock, Mail, ShieldCheck, ArrowLeft, RefreshCw, KeyRound, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume & CV Access — Vedang Tiwari" },
      {
        name: "description",
        content:
          "Verify your email address to unlock Vedang Tiwari's full resume and downloadable CV.",
      },
      { property: "og:title", content: "Resume & CV Access — Vedang Tiwari" },
      {
        property: "og:description",
        content: "Verify email to unlock the full resume and download the CV.",
      },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  const { registration, hydrated, register: saveRegistration, clear } = useRegistration();
  
  // Form step state: "details" | "otp"
  const [step, setStep] = useState<"details" | "otp">("details");
  const [formData, setFormData] = useState({ name: "", email: "", purpose: "" });
  const [otp, setOtp] = useState("");
  
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Submit details -> Request OTP code
  async function handleSendOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setInfo("");

    const name = formData.name.trim();
    const email = formData.email.trim();
    const purpose = formData.purpose.trim();

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

    setLoading(true);

    try {
      const response = await fetch("/api/register-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-otp", name, email, purpose }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Failed to send verification code. Please check your email address.");
        setLoading(false);
        return;
      }

      setInfo(data.message || `Verification code sent to ${email}. Check your email inbox!`);
      setStep("otp");
    } catch {
      setError("Network error connecting to verification server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Submit OTP -> Verify & Unlock
  async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setInfo("");

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      setError("Please enter the complete 6-digit numerical code sent to your email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify-otp",
          email: formData.email.trim(),
          otp: cleanOtp,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setError(data.error || "Invalid or expired verification code. Please try again.");
        setLoading(false);
        return;
      }

      // Access granted!
      const entry: Registration = data.entry || {
        name: formData.name.trim(),
        email: formData.email.trim(),
        purpose: formData.purpose.trim(),
        registeredAt: new Date().toISOString(),
      };

      saveRegistration(entry);
    } catch {
      setError("Verification server unavailable. Please try again in a few moments.");
    } finally {
      setLoading(false);
    }
  }

  // Resend OTP
  async function handleResendCode() {
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const response = await fetch("/api/register-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-otp", ...formData }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Could not resend verification code.");
      } else {
        setInfo(`A new 6-digit code was sent to ${formData.email}.`);
      }
    } catch {
      setError("Could not reach verification server.");
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
            {step === "details" ? (
              <Lock className="h-5 w-5" aria-hidden="true" />
            ) : (
              <KeyRound className="h-5 w-5" aria-hidden="true" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">
              {step === "details" ? "Register to Unlock CV" : "Verify Email Address"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {step === "details"
                ? "Enter your real email to receive a 6-digit verification code and access the CV."
                : `Enter the 6-digit OTP code sent to ${formData.email}`}
            </p>
          </div>
        </div>
        <div className="mt-6 rule-flame w-24" />

        {step === "details" ? (
          <form
            onSubmit={handleSendOtp}
            className="mt-8 grid gap-5 border border-foreground bg-card p-6 shadow-block-sm"
            noValidate
          >
            <label className="text-sm">
              <span className="font-semibold text-foreground">Full Name *</span>
              <input
                name="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your real email (e.g. alex@gmail.com)"
                autoComplete="email"
                className="mt-1.5 w-full rounded-sm border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus-visible:border-flame-orange"
              />
              <span className="mt-1 block text-xs text-muted-foreground">
                We will send a 6-digit verification code to this address. Made-up/disposable emails are blocked.
              </span>
            </label>

            <label className="text-sm">
              <span className="font-semibold text-foreground">Purpose / Reason (optional)</span>
              <textarea
                name="purpose"
                rows={3}
                maxLength={300}
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="Why are you interested in downloading the CV? (e.g. Hiring for AI/ML Engineer role, collaboration...)"
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
              <Mail className="h-5 w-5" aria-hidden="true" />
              {loading ? "Sending Verification Code..." : "Send Email Verification Code"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleVerifyOtp}
            className="mt-8 grid gap-5 border border-foreground bg-card p-6 shadow-block-sm"
            noValidate
          >
            <div className="rounded-sm border border-border bg-muted/40 p-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-flame-orange" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Verification code sent!</p>
                  <p className="text-muted-foreground">
                    We sent a 6-digit code to <strong className="text-foreground">{formData.email}</strong>.
                    Please enter it below to confirm your identity.
                  </p>
                </div>
              </div>
            </div>

            <label className="text-sm">
              <span className="font-semibold text-foreground">6-Digit Verification Code (OTP) *</span>
              <input
                name="otp"
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                autoComplete="one-time-code"
                className="mt-2 w-full tracking-[0.4em] text-center font-mono text-2xl font-bold rounded-sm border border-input bg-background py-3 outline-none focus-visible:border-flame-orange"
              />
            </label>

            {info && (
              <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {info}
              </div>
            )}

            {error && (
              <div className="rounded-sm border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-foreground bg-foreground px-6 py-3.5 text-base font-semibold text-background transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              {loading ? "Verifying Code..." : "Verify Code & Unlock CV"}
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setStep("details");
                  setError("");
                  setInfo("");
                }}
                className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Edit Name / Email
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="font-semibold text-flame-red hover:underline disabled:opacity-50"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-bold sm:text-5xl">Resume</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Verified & Unlocked for <span className="underline decoration-flame-orange">{registration.name}</span> ({registration.email})
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
