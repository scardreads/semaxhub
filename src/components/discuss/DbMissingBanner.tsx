import { DB_NOT_CONFIGURED } from "@/lib/discuss-copy";

export function DbMissingBanner() {
  return (
    <div className="rounded-2xl border border-amber-700/20 bg-amber-50 px-4 py-3 text-sm text-amber-950/85">
      {DB_NOT_CONFIGURED}
    </div>
  );
}
