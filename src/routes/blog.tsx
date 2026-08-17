import { createFileRoute } from "@tanstack/react-router";
import { CollectionSection } from "@/components/CollectionSection";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Vedang Tiwari" },
      {
        name: "description",
        content:
          "Writing by Vedang Tiwari on evaluation, small models and forward-deployed AI engineering.",
      },
      { property: "og:title", content: "Blog — Vedang Tiwari" },
      {
        property: "og:description",
        content: "Writing on models, evaluation and engineering practice.",
      },
    ],
  }),
  component: () => <CollectionSection section="blog" />,
});
