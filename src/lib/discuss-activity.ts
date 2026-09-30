export type TopicActivityCounts = {
  threadCount: number;
  replyCount: number;
  lastActivityAt: Date | null;
};

function plural(count: number, singular: string, pluralLabel: string): string {
  return `${count} ${count === 1 ? singular : pluralLabel}`;
}

function formatActivityWhen(value: Date, now: Date): string {
  const sameYear = value.getFullYear() === now.getFullYear();
  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

/** Calm index line: "3 threads · 1 reply · last activity Sep 28". */
export function formatTopicActivity(
  activity: TopicActivityCounts,
  now = new Date(),
): string {
  const threads = plural(activity.threadCount, "thread", "threads");
  const replies = plural(activity.replyCount, "reply", "replies");
  const last = activity.lastActivityAt
    ? `last activity ${formatActivityWhen(activity.lastActivityAt, now)}`
    : "no activity yet";
  return `${threads} · ${replies} · ${last}`;
}
