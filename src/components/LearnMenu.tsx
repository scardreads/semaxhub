"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { learnNav } from "@/lib/nav";

const triggerClass =
  "rounded-full px-2.5 py-1.5 text-sm text-ink/75 transition hover:bg-stone-200/60 hover:text-ink";

function fineHover(): boolean {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function LearnMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  useEffect(() => () => cancelClose(), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        cancelClose();
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        cancelClose();
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => {
        if (!fineHover()) return;
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={() => {
        if (!fineHover()) return;
        cancelClose();
        closeTimer.current = window.setTimeout(() => {
          closeTimer.current = null;
          setOpen(false);
        }, 150);
      }}
    >
      <button
        type="button"
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => {
          if (!fineHover()) setOpen((current) => !current);
        }}
      >
        Learn
      </button>
      {open ? (
        <div className="absolute left-1/2 top-full z-50 min-w-52 -translate-x-1/2 pt-1.5">
          <div
            role="menu"
            className="rounded-2xl border border-border bg-card p-2 shadow-lg"
          >
            {learnNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className="block rounded-xl px-3 py-2 text-sm text-ink/80 hover:bg-stone-100"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
