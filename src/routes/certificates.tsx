import { createFileRoute } from "@tanstack/react-router";
import { CollectionSection } from "@/components/CollectionSection";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { title: "Certificates — Vedang Tiwari" },
      {
        name: "description",
        content:
          "Verified coursework and credentials held by Vedang Tiwari in deep learning, MLOps and cloud.",
      },
      { property: "og:title", content: "Certificates — Vedang Tiwari" },
      { property: "og:description", content: "Verified coursework and credentials." },
    ],
  }),
  component: () => <CollectionSection section="certificates" />,
});
