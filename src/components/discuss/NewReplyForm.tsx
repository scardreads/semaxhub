"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createReply } from "@/app/actions/discuss";
import { PLACEHOLDER_NEW_REPLY } from "@/lib/discuss-copy";

export function NewReplyForm({
  threadId,
  topicSlug,
}: {
  threadId: string;
  topicSlug: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3 rounded-2xl border border-border bg-card p-5"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        setError(null);
        startTransition(async () => {
          try {
            await createReply(fd);
            form.reset();
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not reply");
          }
        });
      }}
    >
      <input type="hidden" name="threadId" value={threadId} />
      <input type="hidden" name="topicSlug" value={topicSlug} />
      <textarea
        name="body"
        required
        rows={4}
        maxLength={10000}
        placeholder={PLACEHOLDER_NEW_REPLY}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-ink outline-none focus:border-teal-800/40"
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900 disabled:opacity-60"
      >
        {pending ? "Posting…" : "Post reply"}
      </button>
    </form>
  );
}
