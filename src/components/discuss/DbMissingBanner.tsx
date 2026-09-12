import { DB_NOT_CONFIGURED } from "@/lib/discuss-copy";

export function DbMissingBanner() {
  return (
    <div className="surface px-4 py-3 text-sm text-ink">
      {DB_NOT_CONFIGURED}
    </div>
  );
}
