import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { topicVisual } from "@/lib/topic-visuals";
import { TopicMark } from "./TopicMark";

type TopicRoomStyle = CSSProperties & {
  "--topic-spine": string;
  "--topic-tile": string;
  "--topic-ink": string;
};

export function TopicRoomFrame({
  slug,
  href,
  variant = "row",
  children,
}: {
  slug: string;
  href?: string;
  variant?: "row" | "banner";
  children: ReactNode;
}) {
  const visual = topicVisual(slug);
  const style: TopicRoomStyle = {
    "--topic-spine": visual.spine,
    "--topic-tile": visual.tile,
    "--topic-ink": visual.ink,
  };
  const className = `topic-room surface${
    variant === "banner" ? " topic-room-banner" : ""
  }`;
  const inner = (
    <div className="topic-room-body">
      <TopicMark slug={slug} className="topic-room-icon" />
      <div className="topic-room-copy">{children}</div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {inner}
      </Link>
    );
  }

  return (
    <section className={className} style={style}>
      {inner}
    </section>
  );
}
