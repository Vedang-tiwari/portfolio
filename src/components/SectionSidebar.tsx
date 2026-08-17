/**
 * SectionSidebar — fixed vertical icon rail for the home page.
 *
 * Appears once the visitor scrolls past the hero and highlights the section
 * currently in view. Order is fixed and matches the page order exactly.
 * Icons: lucide-react (https://lucide.dev — ISC licensed, bundled locally).
 */
import { useEffect, useState } from "react";
import {
  User,
  FolderGit2,
  Cpu,
  Trophy,
  BadgeCheck,
  NotebookPen,
  PenLine,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** id must match the element id rendered on the home page — same order. */
const NAV: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "about", label: "About", icon: User },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "skills", label: "Skills", icon: Cpu },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "certificates", label: "Certificates", icon: BadgeCheck },
  { id: "notes", label: "Notes", icon: NotebookPen },
  { id: "blog", label: "Blog", icon: PenLine },
];

export function SectionSidebar() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string>("about");

  useEffect(() => {
    /**
     * Scroll-highlight logic (deterministic, no random jumps):
     * walk the sections in their fixed document order and keep the LAST one
     * whose top edge has passed an anchor line a third down the viewport.
     * Because we scan in order, the highlight can only advance or retreat
     * one step at a time as the visitor scrolls.
     */
    const onScroll = () => {
      setVisible(window.scrollY > 240);

      const anchor = window.innerHeight * 0.33;
      let current = NAV[0]!.id;
      for (const { id } of NAV) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - anchor <= 0) current = id;
        else break; // sections are in order, so we can stop at the first one below
      }
      // At the very bottom, force the last section to be active.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = NAV[NAV.length - 1]!.id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav
      aria-label="Sections"
      className={cn(
        "fixed z-40 transition-all duration-300",
        // desktop: vertical rail on the left; mobile: horizontal bar at bottom
        "left-1/2 bottom-4 -translate-x-1/2 lg:left-4 lg:top-1/2 lg:bottom-auto lg:translate-x-0 lg:-translate-y-1/2",
        visible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none translate-y-3 opacity-0 lg:translate-y-[calc(-50%+0.75rem)]",
      )}
    >
      <ul className="flex gap-1.5 rounded-sm border border-border bg-card/95 p-2 shadow-sm backdrop-blur lg:flex-col lg:gap-2">
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-label={label}
                aria-current={isActive ? "true" : undefined}
                title={label}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-sm transition-colors lg:h-10 lg:w-10",
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-flame-soft hover:text-flame-red",
                )}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
