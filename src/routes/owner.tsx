import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FileUp, LogOut, Plus, Save, Trash2, X } from "lucide-react";
import { PROFILE, SOCIALS, type SocialLink } from "@/lib/portfolio";
import { fileToStored, formatBytes, type StoredFile } from "@/lib/owner";
import { useOwner } from "@/lib/use-owner";
import { OwnerCollections } from "@/components/OwnerCollections";
import { ConfirmDelete } from "@/components/ConfirmDelete";


export const Route = createFileRoute("/owner")({
  head: () => ({
    meta: [
      { title: "Owner studio — Vedang Tiwari" },
      {
        name: "description",
        content:
          "Private owner interface for Vedang Tiwari's site: edit the About Me text and upload the resume and CV files visitors download.",
      },
      { property: "og:title", content: "Owner studio — Vedang Tiwari" },
      {
        property: "og:description",
        content: "Edit About Me and upload the resume and CV served to visitors.",
      },
    ],
  }),
  component: OwnerPage,
});

const MAX_BYTES = 4 * 1024 * 1024; // localStorage-friendly ceiling

function OwnerPage() {
  const { hydrated, isOwner, content, signIn, signOut, saveAbout, saveFile, saveSocials } =
    useOwner();
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);

  // Seed the editor with the current About Me copy once state is hydrated.
  useEffect(() => {
    if (!hydrated) return;
    setDraft((content.about ?? PROFILE.about).join("\n\n"));
  }, [hydrated, content.about]);

  if (!hydrated) {
    return <section className="mx-auto max-w-3xl px-5 py-20" aria-busy="true" />;
  }

  // ---------------------------------------------------------- owner sign-in
  if (!isOwner) {
    return (
      <section className="mx-auto max-w-xl px-5 py-16">
        <h1 className="text-4xl font-bold sm:text-5xl">Owner sign-in</h1>
        <div className="mt-6 rule-flame w-24" />
        <p className="mt-6 text-muted-foreground">
          This page is the editable interface. Visitors never see edit or upload controls.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!signIn(code)) setCodeError("Incorrect passcode.");
            else setCodeError("");
            setCode("");
          }}
          className="mt-8 grid gap-4 border border-foreground bg-card p-6 shadow-block-sm"
        >
          <label className="text-sm">
            <span className="font-medium">Owner passcode</span>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-sm border border-input bg-background px-3 py-2 outline-none focus-visible:border-flame-orange"
            />
          </label>
          {codeError && (
            <p role="alert" className="text-sm text-destructive">
              {codeError}
            </p>
          )}
          <button
            type="submit"
            className="justify-self-start rounded-sm border border-foreground bg-foreground px-5 py-3 text-[15px] font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            Enter owner mode
          </button>
        </form>
      </section>
    );
  }

  // ------------------------------------------------------------ owner tools
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold sm:text-5xl">Owner studio</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Editable interface — same layout as the visitor view, plus controls.
          </p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          Leave owner mode
        </button>
      </div>
      <div className="mt-6 rule-flame w-24" />

      <h2 className="mt-12 text-2xl font-bold">Edit About Me</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        One paragraph per blank line. Saved text replaces the About Me copy everywhere.
      </p>
      <textarea
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          setSaved(false);
        }}
        rows={12}
        className="mt-4 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-flame-orange"
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            const paras = draft
              .split(/\n{2,}/)
              .map((p) => p.trim())
              .filter(Boolean);
            saveAbout(paras.length ? paras : null);
            setSaved(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-sm bg-flame-orange px-4 py-2 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Save About Me
        </button>
        <button
          type="button"
          onClick={() => {
            saveAbout(null);
            setDraft(PROFILE.about.join("\n\n"));
            setSaved(false);
          }}
          className="rounded-sm border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          Restore default text
        </button>
        {saved && <span className="text-sm text-muted-foreground">Saved.</span>}
      </div>

      <h2 className="mt-12 text-2xl font-bold">Files</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <UploadCard label="CV" file={content.cv} onPick={(f) => saveFile("cv", f)} />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Files are stored in this browser. Keep each under {formatBytes(MAX_BYTES)}; for larger
        documents drop the PDF in <code className="font-mono">public/cv/</code> instead.
      </p>


      <SocialsManager
        socials={content.socials ?? SOCIALS}
        isCustom={content.socials !== null}
        onSave={saveSocials}
      />

      <OwnerCollections />
    </section>
  );
}

/**
 * Owner-only manager for the "Connect with Me" links.
 * Visitors never render this component.
 */
function SocialsManager({
  socials,
  isCustom,
  onSave,
}: {
  socials: SocialLink[];
  isCustom: boolean;
  onSave: (next: SocialLink[] | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [handle, setHandle] = useState("");
  const [href, setHref] = useState("");
  /** index to delete, "reset" for restore-defaults, null when idle */
  const [pending, setPending] = useState<number | "reset" | null>(null);


  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim() || !href.trim()) return;
    onSave([...socials, { label: label.trim(), handle: handle.trim(), href: href.trim() }]);
    setLabel("");
    setHandle("");
    setHref("");
    setOpen(false);
  }

  return (
    <>
      <div className="mt-12 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Connect with Me</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            These links appear in the About section and on the home page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isCustom && (
            <button
              type="button"
              onClick={() => setPending("reset")}
              className="rounded-sm border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Restore defaults
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-1.5 rounded-sm border border-foreground bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            {open ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Plus className="h-4 w-4" aria-hidden="true" />
            )}
            {open ? "Cancel" : "Add Social Media/Platform"}
          </button>
        </div>
      </div>

      {open && (
        <form
          onSubmit={add}
          className="mt-5 grid gap-4 border border-foreground bg-card p-5 shadow-block-sm sm:grid-cols-3"
        >
          <label className="text-sm">
            <span className="font-medium">Platform</span>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              maxLength={60}
              placeholder="GitHub"
              className="mt-1.5 w-full rounded-sm border border-input bg-background px-3 py-2 outline-none focus-visible:border-flame-orange"
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">Handle</span>
            <input
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              maxLength={60}
              placeholder="@vedang"
              className="mt-1.5 w-full rounded-sm border border-input bg-background px-3 py-2 outline-none focus-visible:border-flame-orange"
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">URL</span>
            <input
              value={href}
              onChange={(e) => setHref(e.target.value)}
              type="url"
              required
              placeholder="https://"
              maxLength={300}
              className="mt-1.5 w-full rounded-sm border border-input bg-background px-3 py-2 outline-none focus-visible:border-flame-orange"
            />
          </label>
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="rounded-sm bg-flame-orange px-4 py-2 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Save platform
            </button>
          </div>
        </form>
      )}

      {socials.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No links yet.</p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {socials.map((s, i) => (
            <li
              key={`${s.label}-${s.href}`}
              className="flex items-center justify-between gap-3 border border-border bg-card px-4 py-3"
            >
              <span className="min-w-0 text-sm">
                <span className="font-medium">{s.label}</span>{" "}
                <span className="font-mono text-xs text-muted-foreground">{s.handle}</span>
              </span>
              <button
                type="button"
                onClick={() => setPending(i)}
                aria-label={`Delete ${s.label}`}
                className="inline-flex items-center gap-1 rounded-sm border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDelete
        open={pending !== null}
        title={
          pending === "reset"
            ? "Restore default links?"
            : `Delete ${typeof pending === "number" ? socials[pending]?.label : ""}?`
        }
        description={
          pending === "reset"
            ? "Every custom link you added will be removed."
            : "This link will be removed from the About section."
        }
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending === "reset") onSave(null);
          else if (typeof pending === "number")
            onSave(socials.filter((_, idx) => idx !== pending));
          setPending(null);
        }}
      />
    </>
  );

}

/** Upload / replace / remove one document. Owner-only by construction. */
function UploadCard({
  label,
  file,
  onPick,
}: {
  label: string;
  file: StoredFile | null;
  onPick: (file: StoredFile | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);


  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    if (picked.size > MAX_BYTES) {
      setError(`That file is ${formatBytes(picked.size)} — too large for browser storage.`);
      return;
    }
    try {
      onPick(await fileToStored(picked));
      setError("");
    } catch {
      setError("Upload failed. Try a smaller file.");
    }
  }

  return (
    <div className="border border-foreground bg-card p-5 shadow-block-sm">
      <h3 className="text-lg font-bold">{label}</h3>
      {file ? (
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-mono">{file.name}</span> · {formatBytes(file.size)}
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          No file uploaded — visitors get the placeholder in{" "}
          <code className="font-mono">public/cv/</code>.
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleChange}
        className="hidden"
      />
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-sm border border-foreground bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
        >
          <FileUp className="h-4 w-4" aria-hidden="true" />
          {file ? `Replace ${label}` : `Upload ${label}`}
        </button>
        {file && (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-1 rounded-sm border border-border px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Remove
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <ConfirmDelete
        open={confirming}
        title={`Remove the uploaded ${label}?`}
        description="Visitors will fall back to the placeholder document."
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          onPick(null);
          setConfirming(false);
        }}
      />
    </div>

  );
}
