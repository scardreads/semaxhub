"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createThread } from "@/app/actions/discuss";
import { PLACEHOLDER_NEW_THREAD } from "@/lib/discuss-copy";

export function NewThreadForm({
  topicId,
  topicSlug,
  starterPrompt,
}: {
  topicId: string;
  topicSlug: string;
  starterPrompt: string;
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
            const result = await createThread(fd);
            form.reset();
            router.push(`/discuss/${result.topicSlug}/${result.threadId}`);
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not post");
          }
        });
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Start a thread
      </p>
      <p className="text-sm italic text-ink/70">{starterPrompt}</p>
      <input type="hidden" name="topicId" value={topicId} />
      <input type="hidden" name="topicSlug" value={topicSlug} />
      <input
        name="title"
        required
        maxLength={200}
        placeholder="Thread title"
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-ink outline-none focus:border-teal-800/40"
      />
      <textarea
        name="body"
        required
        rows={5}
        maxLength={10000}
        placeholder={PLACEHOLDER_NEW_THREAD}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-ink outline-none focus:border-teal-800/40"
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900 disabled:opacity-60"
      >
        {pending ? "Posting…" : "Post thread"}
      </button>
    </form>
  );
}
