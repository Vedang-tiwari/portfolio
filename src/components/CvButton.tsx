import { DownloadButton } from "./DownloadButton";

/**
 * Backwards-compatible CV button — now registration-gated for visitors.
 * See DownloadButton for the access rules.
 */
export function CvButton({ size = "md" }: { size?: "sm" | "md" }) {
  return <DownloadButton kind="cv" size={size} />;
}
