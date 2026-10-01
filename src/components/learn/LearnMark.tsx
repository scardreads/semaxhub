import type { CSSProperties } from "react";
import { learnVisual } from "@/lib/learn-visuals";
import { LearnIcon } from "./LearnIcon";

type LearnMarkStyle = CSSProperties & {
  "--topic-tile": string;
  "--topic-ink": string;
};

/** Guide icon tile. Shares the Discuss tile chrome, with Learn’s own map. */
export function LearnMark({
  href,
  className = "",
}: {
  href: string;
  className?: string;
}) {
  const visual = learnVisual(href);
  const style: LearnMarkStyle = {
    "--topic-tile": visual.tile,
    "--topic-ink": visual.ink,
  };

  return (
    <span
      className={`topic-mark ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <LearnIcon name={visual.icon} />
    </span>
  );
}
