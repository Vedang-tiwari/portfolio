/**
 * Dual-interface model: OWNER (editable) vs VISITOR (view-only).
 *
 * Everything lives in the browser (localStorage), per the project's
 * browser-only persistence choice. The owner "signs in" with a local
 * passcode — this is a UI gate for a single-owner static site, not
 * server-side authentication.
 */

import type { SocialLink } from "./portfolio";

export const OWNER_SESSION_KEY = "vt-portfolio:owner-session";
export const OWNER_CONTENT_KEY = "vt-portfolio:owner-content";
export const OWNER_CHANGE_EVENT = "vt-owner-change";

// PLACEHOLDER: change this to your own passcode.
export const OWNER_PASSCODE = "vedang-owner";

/** A file the owner uploaded, kept as a data URL so it survives reloads. */
export interface StoredFile {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  updatedAt: string;
}

export interface OwnerContent {
  /** Paragraphs of the About Me section (owner-editable). */
  about: string[] | null;
  resume: StoredFile | null;
  cv: StoredFile | null;
  /** Owner-managed "Connect with Me" links; null = use the defaults. */
  socials: SocialLink[] | null;
}

export const EMPTY_CONTENT: OwnerContent = {
  about: null,
  resume: null,
  cv: null,
  socials: null,
};

export function readOwnerContent(): OwnerContent {
  try {
    const raw = window.localStorage.getItem(OWNER_CONTENT_KEY);
    if (!raw) return EMPTY_CONTENT;
    return { ...EMPTY_CONTENT, ...(JSON.parse(raw) as OwnerContent) };
  } catch {
    return EMPTY_CONTENT;
  }
}

export function writeOwnerContent(next: OwnerContent) {
  window.localStorage.setItem(OWNER_CONTENT_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(OWNER_CHANGE_EVENT));
}

export function readOwnerSession(): boolean {
  try {
    return window.localStorage.getItem(OWNER_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function setOwnerSession(on: boolean) {
  try {
    if (on) window.localStorage.setItem(OWNER_SESSION_KEY, "1");
    else window.localStorage.removeItem(OWNER_SESSION_KEY);
  } catch {
    /* ignore blocked storage */
  }
  window.dispatchEvent(new Event(OWNER_CHANGE_EVENT));
}

export function fileToStored(file: File): Promise<StoredFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () =>
      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: String(reader.result),
        updatedAt: new Date().toISOString(),
      });
    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
