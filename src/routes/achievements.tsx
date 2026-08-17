import { createFileRoute } from "@tanstack/react-router";
import { CollectionSection } from "@/components/CollectionSection";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — Vedang Tiwari" },
      {
        name: "description",
        content:
          "Competitions, ranks and recognition earned by Vedang Tiwari across AI/ML contests and research work.",
      },
      { property: "og:title", content: "Achievements — Vedang Tiwari" },
      {
        property: "og:description",
        content: "Competitions, ranks and recognition in AI/ML.",
      },
    ],
  }),
  component: () => <CollectionSection section="achievements" />,
});
