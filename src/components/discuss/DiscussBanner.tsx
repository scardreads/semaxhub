import {
  DISCUSS_BANNER,
  DISCUSS_RULES_COMPACT,
} from "@/lib/discuss-copy";

export function DiscussBanner() {
  return (
    <div className="disclosure px-4 py-4 text-sm leading-relaxed">
      {DISCUSS_BANNER.split("\n").map((line, i) => (
        <p key={i} className={i === 0 ? undefined : "mt-2"}>
          {line}
        </p>
      ))}
      <p className="disclosure-meta mt-3 text-xs tracking-wide">
        {DISCUSS_RULES_COMPACT}
      </p>
    </div>
  );
}
