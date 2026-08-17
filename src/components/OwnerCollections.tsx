import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { SECTION_ORDER, SECTIONS, type SectionKey } from "@/lib/portfolio";
import { useCollection } from "@/lib/use-collection";
import { ConfirmDelete } from "@/components/ConfirmDelete";


/**
 * Owner-only content manager. Hosts the Add / Delete / Restore defaults
 * controls for every section (Projects, Skills, Achievements, Certificates,
 * Notes, Blog). Visitor pages are strictly read-only.
 */
export function OwnerCollections() {
  return (
    <>
      <h2 className="mt-12 text-2xl font-bold">Sections</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Add, delete and restore entries for every section shown to visitors.
      </p>
      <div className="mt-6 grid gap-6">
        {SECTION_ORDER.map((key) => (
          <SectionManager key={key} section={key} />
        ))}
      </div>
    </>
  );
}

function SectionManager({ section }: { section: SectionKey }) {
  const meta = SECTIONS[section];
  const { items, addItem, removeItem, reset } = useCollection(section);
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [itemMeta, setItemMeta] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  /** item id to delete, "reset" for restore-defaults, null when idle */
  const [pending, setPending] = useState<string | null>(null);


  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addItem({
      title: title.trim(),
      meta: itemMeta.trim() || meta.metaLabel,
      description: description.trim(),
      ...(url.trim() ? { url: url.trim() } : {}),
    });
    setTitle("");
    setItemMeta("");
    setDescription("");
    setUrl("");
    setFormOpen(false);
  }

  return (
    <div className="border border-foreground bg-card p-5 shadow-block-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">{meta.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPending("reset")}
            className="rounded-sm border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Restore defaults
          </button>
          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            aria-expanded={formOpen}
            className="inline-flex items-center gap-1.5 rounded-sm border border-foreground bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            {formOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Plus className="h-4 w-4" aria-hidden="true" />
            )}
            {formOpen ? "Cancel" : `Add ${meta.itemNoun}`}
          </button>
        </div>
      </div>

      {formOpen && (
        <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="font-medium">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={120}
              className="mt-1.5 w-full rounded-sm border border-input bg-background px-3 py-2 outline-none focus-visible:border-flame-orange"
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">{meta.metaLabel}</span>
            <input
              value={itemMeta}
              onChange={(e) => setItemMeta(e.target.value)}
              maxLength={120}
              className="mt-1.5 w-full rounded-sm border border-input bg-background px-3 py-2 outline-none focus-visible:border-flame-orange"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="font-medium">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={600}
              className="mt-1.5 w-full rounded-sm border border-input bg-background px-3 py-2 outline-none focus-visible:border-flame-orange"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="font-medium">Link (optional)</span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="url"
              placeholder="https://"
              maxLength={300}
              className="mt-1.5 w-full rounded-sm border border-input bg-background px-3 py-2 outline-none focus-visible:border-flame-orange"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-sm bg-flame-orange px-4 py-2 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Save {meta.itemNoun}
            </button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">
          Nothing here yet. Use “Add {meta.itemNoun}” to create the first entry.
        </p>
      ) : (
        <ul className="mt-5 grid gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 border border-border px-4 py-2.5"
            >
              <span className="min-w-0 text-sm">
                <span className="font-medium">{item.title}</span>{" "}
                <span className="font-mono text-xs text-muted-foreground">{item.meta}</span>
              </span>
              <button
                type="button"
                onClick={() => setPending(item.id)}
                aria-label={`Delete ${item.title}`}
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
            ? `Restore default ${meta.title}?`
            : `Delete “${items.find((i) => i.id === pending)?.title ?? ""}”?`
        }
        description={
          pending === "reset"
            ? "Your added entries in this section will be replaced by the defaults."
            : "This entry will disappear from the visitor view."
        }
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending === "reset") reset();
          else if (pending) removeItem(pending);
          setPending(null);
        }}
      />
    </div>

  );
}
