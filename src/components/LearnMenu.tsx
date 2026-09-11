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

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
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
        if (fineHover()) setOpen(true);
      }}
      onMouseLeave={() => {
        if (fineHover()) setOpen(false);
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
        <div
          role="menu"
          className="absolute left-1/2 top-full z-50 mt-1 min-w-52 -translate-x-1/2 rounded-2xl border border-border bg-card p-2 shadow-lg"
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
      ) : null}
    </div>
  );
}
