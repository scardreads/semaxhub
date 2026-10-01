import type { CSSProperties } from "react";
import { topicVisual } from "@/lib/topic-visuals";
import { TopicIcon } from "./TopicIcon";

type TopicMarkStyle = CSSProperties & {
  "--topic-tile": string;
  "--topic-ink": string;
};

/** Room icon tile. Uses the shared Discuss accent map. Decorative next to the title. */
export function TopicMark({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const visual = topicVisual(slug);
  const style: TopicMarkStyle = {
    "--topic-tile": visual.tile,
    "--topic-ink": visual.ink,
  };

  return (
    <span
      className={`topic-mark ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <TopicIcon name={visual.icon} />
    </span>
  );
}
