import { PROFILE } from "@/lib/portfolio";
import { useOwner } from "@/lib/use-owner";

/**
 * About Me copy. Renders the owner's saved text when present, otherwise the
 * placeholder paragraphs from PROFILE.about. Read-only for everyone —
 * editing happens on /owner.
 */
export function AboutText({ className = "" }: { className?: string }) {
  const { content } = useOwner();
  const paragraphs = content.about ?? PROFILE.about;

  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <p key={`${i}-${p.slice(0, 20)}`} className={i === 0 ? "" : "mt-4"}>
          {p}
        </p>
      ))}
    </div>
  );
}
