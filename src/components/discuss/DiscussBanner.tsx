import {
  DISCUSS_ORIENTATION,
  DISCUSS_RULES_COMPACT,
} from "@/lib/discuss-copy";

/** Short orientation for /discuss and topic lists. Do not mount on thread pages. */
export function DiscussBanner() {
  return (
    <div className="disclosure px-4 py-4 text-sm leading-relaxed">
      <p>{DISCUSS_ORIENTATION}</p>
      <p className="disclosure-meta mt-3 text-xs tracking-wide">
        {DISCUSS_RULES_COMPACT}
      </p>
    </div>
  );
}
