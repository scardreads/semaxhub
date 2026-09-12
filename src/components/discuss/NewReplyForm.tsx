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
      className="surface space-y-3 p-5"
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
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-ink outline-none focus:border-accent"
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary disabled:opacity-60"
      >
        {pending ? "Posting…" : "Post reply"}
      </button>
    </form>
  );
}
