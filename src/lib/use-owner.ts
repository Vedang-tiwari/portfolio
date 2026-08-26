import { useCallback, useEffect, useState } from "react";
import { fetchPortfolioData, savePortfolioData, type SocialLink } from "./portfolio";
import {
  EMPTY_CONTENT,
  OWNER_CHANGE_EVENT,
  OWNER_PASSCODE,
  readOwnerContent,
  readOwnerSession,
  setOwnerSession,
  writeOwnerContent,
  type OwnerContent,
  type StoredFile,
} from "./owner";

/**
 * Owner vs visitor state. `isOwner` is false until proven otherwise, so the
 * visitor (view-only) interface is always the default render.
 */
export function useOwner() {
  const [isOwner, setIsOwner] = useState(false);
  const [content, setContent] = useState<OwnerContent>(EMPTY_CONTENT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const sync = () => {
      setIsOwner(readOwnerSession());
      setContent(readOwnerContent());
    };
    sync();
    setHydrated(true);

    fetchPortfolioData().then((remote) => {
      if (cancelled || !remote) return;
      const current = readOwnerContent();
      const nextContent: OwnerContent = {
        ...current,
        about: current.about !== null ? current.about : (remote.about ?? null),
        socials: current.socials !== null ? current.socials : (remote.socials ?? null),
      };
      writeOwnerContent(nextContent);
      setContent(nextContent);
    });

    window.addEventListener(OWNER_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelled = true;
      window.removeEventListener(OWNER_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const signIn = useCallback((passcode: string) => {
    if (passcode !== OWNER_PASSCODE) return false;
    setOwnerSession(true);
    return true;
  }, []);

  const signOut = useCallback(() => setOwnerSession(false), []);

  const saveAbout = useCallback((paragraphs: string[] | null) => {
    const updated = { ...readOwnerContent(), about: paragraphs };
    writeOwnerContent(updated);
    savePortfolioData({ about: paragraphs });
  }, []);

  const saveFile = useCallback((kind: "resume" | "cv", file: StoredFile | null) => {
    writeOwnerContent({ ...readOwnerContent(), [kind]: file });
  }, []);

  /** Owner-only: replace the "Connect with Me" list (null restores defaults). */
  const saveSocials = useCallback((socials: SocialLink[] | null) => {
    const updated = { ...readOwnerContent(), socials };
    writeOwnerContent(updated);
    savePortfolioData({ socials });
  }, []);

  return { hydrated, isOwner, content, signIn, signOut, saveAbout, saveFile, saveSocials };
}
