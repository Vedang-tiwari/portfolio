import { createFileRoute } from "@tanstack/react-router";
import { CollectionSection } from "@/components/CollectionSection";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Vedang Tiwari" },
      {
        name: "description",
        content:
          "Applied ML and AI-native projects by Vedang Tiwari: retrieval systems, edge vision models and forecasting pipelines.",
      },
      { property: "og:title", content: "Projects — Vedang Tiwari" },
      {
        property: "og:description",
        content: "Applied ML and AI-native builds, from data pipeline to deployed interface.",
      },
    ],
  }),
  component: () => <CollectionSection section="projects" />,
});
