import Link from "next/link";
import { LearnMark } from "./LearnMark";

export function LearnGuideCard({
  href,
  title,
  blurb,
  variant,
}: {
  href: string;
  title: string;
  blurb: string;
  variant: "full" | "light";
}) {
  const titleClass = "home-read-title";
  const blurbNode = <p className="home-read-blurb">{blurb}</p>;

  if (variant === "full") {
    return (
      <Link href={href} className="home-read-card learn-guide-card">
        <LearnMark href={href} className="learn-guide-mark" />
        <div className="learn-guide-copy">
          <h2 className={titleClass}>{title}</h2>
          {blurbNode}
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="home-read-card">
      <LearnMark href={href} className="home-learn-mark" />
      <h3 className={titleClass}>{title}</h3>
      {blurbNode}
    </Link>
  );
}
