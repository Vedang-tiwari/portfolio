import { Download, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useOwner } from "@/lib/use-owner";
import { useRegistration } from "@/lib/use-registration";
import { PROFILE } from "@/lib/portfolio";

type Kind = "resume" | "cv";

const LABELS: Record<Kind, string> = { resume: "Resume", cv: "CV" };

/**
 * Download button for the owner's resume / CV.
 *
 * Visitors must be registered before the real download link appears; until
 * then the button routes them to the registration form on /resume.
 * Uses the owner-uploaded file when present, otherwise the static
 * placeholder in /public/cv.
 */
export function DownloadButton({
  kind,
  size = "md",
}: {
  kind: Kind;
  size?: "sm" | "md";
}) {
  const { content } = useOwner();
  const { registration } = useRegistration();

  const uploaded = content[kind];
  const href = uploaded?.dataUrl ?? PROFILE.cvUrl;
  const fileName = uploaded?.name ?? PROFILE.cvFileName;

  const base =
    size === "sm"
      ? "inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-sm font-medium transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      : "inline-flex items-center gap-2 rounded-sm border px-5 py-3 text-[15px] font-semibold transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
  const solid = "border-foreground bg-foreground text-background shadow-block-sm";
  const outline = "border-foreground bg-flame-soft text-foreground hover:bg-foreground hover:text-background";
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  if (!registration) {
    return (
      <Link to="/resume" className={`${base} ${outline}`}>
        <Lock className={icon} aria-hidden="true" />
        Register to Unlock {LABELS[kind]}
      </Link>
    );
  }

  const handleDownloadClick = () => {
    if (registration) {
      fetch("/api/register-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "notify-download",
          email: registration.email,
          name: registration.name,
        }),
      }).catch(() => {});
    }
  };

  return (
    <a
      href={href}
      download={fileName}
      onClick={handleDownloadClick}
      className={`${base} ${solid}`}
    >
      <Download className={icon} aria-hidden="true" />
      Download {LABELS[kind]}
    </a>
  );
}

