import {
  formatTopicActivity,
  type TopicActivityCounts,
} from "@/lib/discuss-activity";

export function TopicActivityLine({
  threadCount,
  replyCount,
  lastActivityAt,
}: TopicActivityCounts) {
  return (
    <p className="topic-activity">
      {formatTopicActivity({ threadCount, replyCount, lastActivityAt })}
    </p>
  );
}
