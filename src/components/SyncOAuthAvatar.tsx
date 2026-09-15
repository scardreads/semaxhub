"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

/**
 * One-shot client sync: when the primary Clerk profile has no custom image
 * but a linked OAuth account (prefer Google) does, copy that image into the
 * primary profile so UserButton shows it everywhere.
 */
export function SyncOAuthAvatar() {
  const { isLoaded, user } = useUser();
  const attemptedUserIds = useRef(new Set<string>());

  useEffect(() => {
    if (!isLoaded || !user || user.hasImage) return;
    if (attemptedUserIds.current.has(user.id)) return;
    attemptedUserIds.current.add(user.id);

    const accounts = user.externalAccounts ?? [];
    const google = accounts.find(
      (a) => a.provider === "google" && Boolean(a.imageUrl?.trim()),
    );
    const fallback = accounts.find((a) => Boolean(a.imageUrl?.trim()));
    const source = google ?? fallback;
    const imageUrl = source?.imageUrl?.trim();
    if (!imageUrl) return;

    void (async () => {
      try {
        await user.setProfileImage({ file: imageUrl });
        return;
      } catch {
        // String URL may fail; try blob fetch next.
      }
      try {
        const res = await fetch(imageUrl, { referrerPolicy: "no-referrer" });
        if (!res.ok) return;
        const blob = await res.blob();
        const file = new File([blob], "avatar", {
          type: blob.type || "image/jpeg",
        });
        await user.setProfileImage({ file });
      } catch {
        // Swallow: avatar sync is best-effort.
      }
    })();
  }, [isLoaded, user]);

  return null;
}
