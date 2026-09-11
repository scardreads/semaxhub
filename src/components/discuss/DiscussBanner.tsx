import {
  DISCUSS_BANNER,
  DISCUSS_RULES_COMPACT,
} from "@/lib/discuss-copy";

export function DiscussBanner() {
  return (
    <div className="rounded-2xl border border-teal-800/15 bg-teal-50/70 px-4 py-4 text-sm leading-relaxed text-teal-950/85">
      {DISCUSS_BANNER.split("\n").map((line, i) => (
        <p key={i} className={i === 0 ? undefined : "mt-2"}>
          {line}
        </p>
      ))}
      <p className="mt-3 text-xs tracking-wide text-teal-900/70">
        {DISCUSS_RULES_COMPACT}
      </p>
    </div>
  );
}
