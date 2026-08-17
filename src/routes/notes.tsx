import { createFileRoute } from "@tanstack/react-router";
import { CollectionSection } from "@/components/CollectionSection";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes — Vedang Tiwari" },
      {
        name: "description",
        content:
          "Study notes and distilled references on transformers, statistics and ML system design.",
      },
      { property: "og:title", content: "Notes — Vedang Tiwari" },
      { property: "og:description", content: "Study notes and distilled ML references." },
    ],
  }),
  component: () => <CollectionSection section="notes" />,
});
