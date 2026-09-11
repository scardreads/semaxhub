"use client";

import { useState, useTransition } from "react";
import { reportContent } from "@/app/actions/discuss";
import { REPORT_HELPER } from "@/lib/discuss-copy";

export function ReportButton({
  targetType,
  targetId,
  signedIn,
}: {
  targetType: "thread" | "reply";
  targetId: string;
  signedIn: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  if (!signedIn) return null;

  return (
    <button
      type="button"
      disabled={pending || done}
      title={REPORT_HELPER}
      className="text-xs text-muted hover:text-ink disabled:opacity-60"
      onClick={() => {
        const reason = window.prompt(
          REPORT_HELPER,
          "spam / harassment / buy link",
        );
        if (!reason) return;
        startTransition(async () => {
          const fd = new FormData();
          fd.set("targetType", targetType);
          fd.set("targetId", targetId);
          fd.set("reason", reason);
          await reportContent(fd);
          setDone(true);
        });
      }}
    >
      {done ? "Reported" : "Report"}
    </button>
  );
}
