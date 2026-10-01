"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { reportContent } from "@/app/actions/discuss";
import { REPORT_HELPER } from "@/lib/discuss-copy";

const REASONS = [
  { id: "spam", label: "Spam" },
  { id: "harassment", label: "Harassment" },
  { id: "buy-link", label: "Buy link" },
] as const;

type ReasonId = (typeof REASONS)[number]["id"];

function reportReason(label: string, note: string): string {
  const trimmed = note.trim();
  const reason = trimmed ? `${label}. ${trimmed}` : label;
  return reason.slice(0, 500);
}

export function ReportButton({
  targetType,
  targetId,
  signedIn,
  align = "start",
}: {
  targetType: "thread" | "reply";
  targetId: string;
  signedIn: boolean;
  align?: "start" | "end";
}) {
  const formId = useId();
  const panelRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(false);
  const [reasonId, setReasonId] = useState<ReasonId | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLButtonElement>("[role='radio']")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!signedIn) return null;

  function close() {
    setOpen(false);
    setError(null);
  }

  return (
    <div className="report-control">
      <button
        type="button"
        disabled={pending || done}
        title={REPORT_HELPER}
        aria-expanded={open}
        aria-controls={open ? formId : undefined}
        className="text-xs text-muted hover:text-ink disabled:opacity-60"
        onClick={() => {
          if (done) return;
          setOpen((value) => !value);
        }}
      >
        {done ? "Reported" : "Report"}
      </button>
      {open && !done ? (
        <form
          id={formId}
          ref={panelRef}
          className={`report-form report-form-${align}`}
          aria-label="Report this post"
          onSubmit={(event) => {
            event.preventDefault();
            const reason = REASONS.find((item) => item.id === reasonId);
            if (!reason) {
              setError("Choose a reason.");
              return;
            }
            setError(null);
            startTransition(async () => {
              try {
                const fd = new FormData();
                fd.set("targetType", targetType);
                fd.set("targetId", targetId);
                fd.set("reason", reportReason(reason.label, note));
                await reportContent(fd);
                setDone(true);
                setOpen(false);
              } catch {
                setError("Could not send this report. Try again.");
              }
            });
          }}
        >
          <p className="text-xs font-semibold text-ink">Report</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Spam, harassment, or a buy link.
          </p>
          <div className="report-chips" role="radiogroup" aria-label="Reason">
            {REASONS.map((reason) => {
              const selected = reasonId === reason.id;
              return (
                <button
                  key={reason.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className="report-chip"
                  onClick={() => setReasonId(reason.id)}
                >
                  {reason.label}
                </button>
              );
            })}
          </div>
          <label className="mt-3 block text-xs text-muted" htmlFor={`${formId}-note`}>
            Note, optional
            <textarea
              id={`${formId}-note`}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={2}
              maxLength={400}
              placeholder="Short detail, if it helps"
              className="report-note"
            />
          </label>
          {error ? <p className="mt-2 text-xs text-ink">{error}</p> : null}
          <div className="report-actions">
            <button type="button" className="report-cancel" onClick={close}>
              Cancel
            </button>
            <button
              type="submit"
              className="report-submit"
              disabled={pending || !reasonId}
            >
              {pending ? "Sending…" : "Submit"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
