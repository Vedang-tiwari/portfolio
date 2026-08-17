/**
 * Portfolio content model + browser persistence.
 *
 * PLACEHOLDER CONTENT: every default entry below is a placeholder.
 * Replace the strings with Vedang's real content, or edit/delete them
 * live in the UI (changes are stored in the visitor's localStorage).
 */

export type SectionKey =
  | "projects"
  | "skills"
  | "achievements"
  | "certificates"
  | "notes"
  | "blog";

export interface PortfolioItem {
  id: string;
  title: string;
  /** Short kicker: tech stack, issuer, date, tag... */
  meta: string;
  description: string;
  /** Optional external link (repo, article, credential). */
  url?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  handle: string;
}

/* ---------------------------------------------------------------- profile */

// PLACEHOLDER: replace with real personal details.
export const PROFILE = {
  name: "Vedang Tiwari",
  siteName: "VedangTiwari.dev",
  role: "AI/ML Engineer",
  headline: "Building AI-native systems that ship.",
  degree: "B.Tech Computer Science (AIML) · 4th year",
  location: "India",
  email: "vedangt027@gmail.com",
  about: [
    "I'm a final-year B.Tech Computer Science student specialising in Artificial Intelligence and Machine Learning. I work at the seam between research and production: turning models into products that people actually use.",
    "My focus areas are applied machine learning, data science, AI engineering and forward-deployed engineering — sitting close to users, shipping fast, and instrumenting everything. I care about evaluation, latency, and cost as much as accuracy.",
    "Outside of coursework I build side projects end to end: data pipelines, fine-tunes, retrieval systems, agent loops, and the frontends that make them legible.",
  ],
  // PLACEHOLDER: drop your CV at public/cv/vedang-tiwari-cv.pdf
  // PLACEHOLDER: the date you started coding. Years of work are computed
  // from this, so the About section ages itself with no manual edits.
  codingSince: "2021-08-01",
  focus: "AI/ML",
  cvUrl: "/cv/vedang-tiwari-cv.pdf",
  cvFileName: "vedang-tiwari-cv.pdf",
};

export const SOCIALS: SocialLink[] = [
  {
    label: "LinkedIn",
    handle: "in/vedang-tiwari",
    href: "https://www.linkedin.com/in/vedang-tiwari-39b035296/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BxiIxd0%2BTQ3y%2BU3BYDnUaOA%3D%3D",
  },
  { label: "Instagram", handle: "@iblamevedang", href: "https://www.instagram.com/iblamevedang/" },
  { label: "Gmail", handle: "vedangt027@gmail.com", href: "mailto:vedangt027@gmail.com" },
  { label: "GitHub", handle: "@Vedang-tiwari", href: "https://github.com/Vedang-tiwari" },
  { label: "LeetCode", handle: "@VEDANG-TIWARI", href: "https://leetcode.com/u/VEDANG-TIWARI/" },
  { label: "Kaggle", handle: "@vedang01tiwari", href: "https://www.kaggle.com/vedang01tiwari" },
];


/* --------------------------------------------------------------- sections */

export interface SectionMeta {
  key: SectionKey;
  path: string;
  label: string;
  title: string;
  blurb: string;
  itemNoun: string;
  metaLabel: string;
}

export const SECTIONS: Record<SectionKey, SectionMeta> = {
  projects: {
    key: "projects",
    path: "/projects",
    label: "Projects",
    title: "Projects",
    blurb:
      "Applied ML and AI-native builds — from data pipeline to deployed interface.",
    itemNoun: "project",
    metaLabel: "Stack",
  },
  skills: {
    key: "skills",
    path: "/skills",
    label: "Skills",
    title: "Skills & stack",
    blurb: "The tools I reach for across modelling, data and delivery.",
    itemNoun: "skill",
    metaLabel: "Level",
  },
  achievements: {
    key: "achievements",
    path: "/achievements",
    label: "Achievements",
    title: "Achievements",
    blurb: "Competitions, ranks, and things I was recognised for.",
    itemNoun: "achievement",
    metaLabel: "Year",
  },
  certificates: {
    key: "certificates",
    path: "/certificates",
    label: "Certificates",
    title: "Certificates",
    blurb: "Verified coursework and credentials.",
    itemNoun: "certificate",
    metaLabel: "Issuer",
  },
  notes: {
    key: "notes",
    path: "/notes",
    label: "Notes",
    title: "Notes",
    blurb: "Study notes and distilled references I keep coming back to.",
    itemNoun: "note",
    metaLabel: "Topic",
  },
  blog: {
    key: "blog",
    path: "/blog",
    label: "Blog",
    title: "Blog",
    blurb: "Longer writing on models, evaluation and engineering practice.",
    itemNoun: "post",
    metaLabel: "Date",
  },
};

export const SECTION_ORDER: SectionKey[] = [
  "projects",
  "skills",
  "achievements",
  "certificates",
  "notes",
  "blog",
];

/* ------------------------------------------------------- placeholder data */

export const DEFAULT_ITEMS: Record<SectionKey, PortfolioItem[]> = {
  projects: [
    {
      id: "p1",
      title: "Retrieval agent for lecture archives",
      meta: "Python · FastAPI · pgvector · LangGraph",
      description:
        "PLACEHOLDER — Hybrid BM25 + dense retrieval over 400 hours of transcribed lectures, with a tool-using agent loop and an eval harness scoring groundedness.",
      url: "https://github.com/",
    },
    {
      id: "p2",
      title: "On-device defect classifier",
      meta: "PyTorch · ONNX · Quantisation",
      description:
        "PLACEHOLDER — Fine-tuned vision backbone distilled to 4MB and quantised to int8 for edge inference at 30 FPS on a Raspberry Pi.",
      url: "https://github.com/",
    },
    {
      id: "p3",
      title: "Forecasting pipeline for demand data",
      meta: "Polars · Prefect · LightGBM",
      description:
        "PLACEHOLDER — Feature store plus backtesting framework with walk-forward validation; beat the seasonal-naive baseline by 18% MAPE.",
      url: "https://github.com/",
    },
  ],
  skills: [
    {
      id: "s1",
      title: "Machine learning",
      meta: "Core",
      description:
        "PLACEHOLDER — PyTorch, scikit-learn, transformers, fine-tuning (LoRA/QLoRA), distillation, evaluation design.",
    },
    {
      id: "s2",
      title: "Data engineering",
      meta: "Strong",
      description:
        "PLACEHOLDER — SQL, Polars/pandas, dbt, Airflow/Prefect, Postgres, vector stores, streaming basics.",
    },
    {
      id: "s3",
      title: "AI engineering",
      meta: "Core",
      description:
        "PLACEHOLDER — RAG systems, agent loops, structured output, prompt + context engineering, latency and cost budgeting.",
    },
    {
      id: "s4",
      title: "Production & delivery",
      meta: "Working",
      description:
        "PLACEHOLDER — FastAPI, Docker, CI/CD, observability, TypeScript/React frontends for model-facing tools.",
    },
  ],
  achievements: [
    {
      id: "a1",
      title: "Top 3% — Kaggle tabular playground",
      meta: "2025",
      description:
        "PLACEHOLDER — Ensembled gradient boosting with target-encoded features and careful leakage control.",
    },
    {
      id: "a2",
      title: "National hackathon finalist",
      meta: "2024",
      description:
        "PLACEHOLDER — Built a multimodal accessibility assistant in 36 hours; placed 4th of 210 teams.",
    },
    {
      id: "a3",
      title: "Departmental research assistantship",
      meta: "2024",
      description:
        "PLACEHOLDER — Worked on efficient inference for small language models under faculty supervision.",
    },
  ],
  certificates: [
    {
      id: "c1",
      title: "Deep Learning Specialization",
      meta: "DeepLearning.AI",
      description: "PLACEHOLDER — Five-course sequence covering CNNs, sequence models and tuning.",
      url: "https://coursera.org/",
    },
    {
      id: "c2",
      title: "Machine Learning Engineering for Production",
      meta: "DeepLearning.AI",
      description: "PLACEHOLDER — MLOps lifecycle, data-centric AI, deployment and monitoring.",
      url: "https://coursera.org/",
    },
    {
      id: "c3",
      title: "Cloud Practitioner",
      meta: "AWS",
      description: "PLACEHOLDER — Core cloud services, pricing models and shared-responsibility security.",
      url: "https://aws.amazon.com/",
    },
  ],
  notes: [
    {
      id: "n1",
      title: "Transformer internals, from scratch",
      meta: "Deep learning",
      description:
        "PLACEHOLDER — Attention derivations, KV caching, positional schemes, and where the FLOPs actually go.",
    },
    {
      id: "n2",
      title: "Probability & statistics refresher",
      meta: "Maths",
      description:
        "PLACEHOLDER — Estimators, confidence intervals, hypothesis testing and common experiment-design traps.",
    },
    {
      id: "n3",
      title: "System design for ML services",
      meta: "Systems",
      description:
        "PLACEHOLDER — Batching, queues, caching layers, and failure modes of model-serving endpoints.",
    },
  ],
  blog: [
    {
      id: "b1",
      title: "Evals are the product",
      meta: "Mar 2026",
      description:
        "PLACEHOLDER — Why a scrappy eval suite beats prompt tinkering, and how to build one in an afternoon.",
      url: "https://example.com/",
    },
    {
      id: "b2",
      title: "Forward-deployed engineering, as a student",
      meta: "Jan 2026",
      description:
        "PLACEHOLDER — Lessons from sitting with users while shipping an internal AI tool.",
      url: "https://example.com/",
    },
    {
      id: "b3",
      title: "Small models, big wins",
      meta: "Nov 2025",
      description:
        "PLACEHOLDER — When distillation and quantisation beat calling a frontier model on every request.",
      url: "https://example.com/",
    },
  ],
};

/* ------------------------------------------------------------- resume text */

// PLACEHOLDER: replace with the real resume content shown after registration.
export const RESUME = {
  summary:
    "Final-year B.Tech CSE (AIML) student focused on applied machine learning and AI engineering. Comfortable owning a problem from data collection through deployment and evaluation.",
  experience: [
    {
      role: "AI Engineering Intern",
      org: "PLACEHOLDER Company",
      period: "2025 — 2026",
      points: [
        "Shipped a retrieval-augmented assistant used by an internal support team.",
        "Cut median response latency 62% with caching and smaller routed models.",
        "Built the eval harness that gated every prompt and model change.",
      ],
    },
    {
      role: "Machine Learning Intern",
      org: "PLACEHOLDER Lab",
      period: "2024 — 2025",
      points: [
        "Trained and benchmarked vision models for a defect-detection dataset.",
        "Automated dataset curation, removing ~11% mislabeled samples.",
      ],
    },
  ],
  education: [
    {
      degree: "B.Tech, Computer Science (AI & ML)",
      org: "PLACEHOLDER University",
      period: "2022 — 2026",
      points: ["Coursework in ML, deep learning, data mining, distributed systems."],
    },
  ],
};

/* ----------------------------------------------------------- localStorage */

const PREFIX = "vt-portfolio:";

export function storageKey(section: SectionKey) {
  return `${PREFIX}${section}`;
}

/** Fired in-tab whenever any section collection changes. */
export const COLLECTION_CHANGE_EVENT = "vt-collection-change";

/** Read a section's current items (owner edits first, defaults otherwise). */
export function readCollection(section: SectionKey): PortfolioItem[] {
  if (typeof window === "undefined") return DEFAULT_ITEMS[section];
  try {
    const raw = window.localStorage.getItem(storageKey(section));
    if (raw) {
      const parsed = JSON.parse(raw) as PortfolioItem[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* fall through to defaults */
  }
  return DEFAULT_ITEMS[section];
}

export const REGISTRATION_KEY = `${PREFIX}registration`;

export interface Registration {
  name: string;
  email: string;
  purpose: string;
  registeredAt: string;
}

export function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export interface FullPortfolioData {
  projects: PortfolioItem[];
  skills: PortfolioItem[];
  achievements: PortfolioItem[];
  certificates: PortfolioItem[];
  notes: PortfolioItem[];
  blog: PortfolioItem[];
  about?: string[] | null;
  socials?: SocialLink[] | null;
}

let inMemoryCache: FullPortfolioData | null = null;

export async function fetchPortfolioData(): Promise<FullPortfolioData | null> {
  try {
    const res = await fetch("/api/portfolio");
    if (res.ok) {
      const data = (await res.json()) as FullPortfolioData;
      inMemoryCache = data;
      return data;
    }
  } catch {
    /* try static file fallback */
  }

  try {
    const res = await fetch("/data/portfolio.json");
    if (res.ok) {
      const data = (await res.json()) as FullPortfolioData;
      inMemoryCache = data;
      return data;
    }
  } catch {
    /* fallback to local defaults */
  }

  return inMemoryCache;
}

export async function savePortfolioData(partial: Partial<FullPortfolioData>): Promise<void> {
  const current = inMemoryCache ?? {
    projects: readCollection("projects"),
    skills: readCollection("skills"),
    achievements: readCollection("achievements"),
    certificates: readCollection("certificates"),
    notes: readCollection("notes"),
    blog: readCollection("blog"),
    about: null,
    socials: null,
  };

  const updated: FullPortfolioData = {
    ...current,
    ...partial,
  };

  inMemoryCache = updated;

  // Persist locally in localStorage as immediate fallback cache
  if (typeof window !== "undefined") {
    (Object.keys(updated) as Array<keyof FullPortfolioData>).forEach((key) => {
      if (SECTION_ORDER.includes(key as SectionKey)) {
        try {
          window.localStorage.setItem(storageKey(key as SectionKey), JSON.stringify(updated[key as SectionKey]));
        } catch {
          /* ignore */
        }
      }
    });
  }

  try {
    await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  } catch {
    /* static host without POST endpoint — local cache still persists */
  }
}
