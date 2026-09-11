"use client";

import { useTransition } from "react";
import { hideContent } from "@/app/actions/discuss";

export function AdminHideButton({
  targetType,
  targetId,
  topicSlug,
  threadId,
  isHidden,
  isAdminUser,
}: {
  targetType: "thread" | "reply";
  targetId: string;
  topicSlug: string;
  threadId?: string;
  isHidden: boolean;
  isAdminUser: boolean;
}) {
  const [pending, startTransition] = useTransition();
  if (!isAdminUser) return null;

  return (
    <button
      type="button"
      disabled={pending}
      className="text-xs text-amber-800 hover:underline disabled:opacity-60"
      onClick={() => {
        startTransition(async () => {
          const fd = new FormData();
          fd.set("targetType", targetType);
          fd.set("targetId", targetId);
          fd.set("action", isHidden ? "unhide" : "hide");
          fd.set("topicSlug", topicSlug);
          if (threadId) fd.set("threadId", threadId);
          await hideContent(fd);
        });
      }}
    >
      {isHidden ? "Unhide" : "Hide"}
    </button>
  );
}
