import { createFileRoute } from "@tanstack/react-router";
import { CollectionSection } from "@/components/CollectionSection";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills & stack — Vedang Tiwari" },
      {
        name: "description",
        content:
          "Vedang Tiwari's technical stack across machine learning, data engineering, AI engineering and production delivery.",
      },
      { property: "og:title", content: "Skills & stack — Vedang Tiwari" },
      {
        property: "og:description",
        content: "Tools across modelling, data and delivery.",
      },
    ],
  }),
  component: () => <CollectionSection section="skills" />,
});
