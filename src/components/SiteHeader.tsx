import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { PROFILE, SECTIONS, SECTION_ORDER } from "@/lib/portfolio";
import { CvButton } from "./CvButton";

const NAV = [
  { to: "/about", label: "About" },
  ...SECTION_ORDER.map((k) => ({ to: SECTIONS[k].path, label: SECTIONS[k].label })),
  { to: "/owner", label: "Owner" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-6 w-6 flex-col overflow-hidden rounded-[2px]">
            <span className="h-1/4 w-full bg-flame-yellow" />
            <span className="h-1/4 w-full bg-flame-amber" />
            <span className="h-1/4 w-full bg-flame-orange" />
            <span className="h-1/4 w-full bg-flame-red" />
          </span>
          <span className="font-display text-[15px] font-bold tracking-tight">
            {PROFILE.siteName}
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-sm px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <div className="hidden sm:block">
            <CvButton size="sm" />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-border lg:hidden"
          >
            <span className="flex flex-col gap-[3px]">
              <span className="h-[2px] w-4 bg-foreground" />
              <span className="h-[2px] w-4 bg-foreground" />
              <span className="h-[2px] w-4 bg-foreground" />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-5 py-3 lg:hidden">
          <ul className="grid grid-cols-2 gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-sm px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                  activeProps={{ className: "text-foreground font-medium" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 sm:hidden">
            <CvButton size="sm" />
          </div>
        </nav>
      )}
    </header>
  );
}
