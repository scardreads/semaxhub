import type { LearnIconName } from "@/lib/learn-visuals";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function LearnIcon({ name }: { name: LearnIconName }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {name === "molecule" ? (
        <>
          <circle cx="7" cy="15.5" r="2.15" {...stroke} />
          <circle cx="12" cy="7" r="2.15" {...stroke} />
          <circle cx="17" cy="15.5" r="2.15" {...stroke} />
          <path d="M8.7 14.2 10.5 8.8M13.5 8.8 15.3 14.2M9.2 15.5h5.6" {...stroke} />
        </>
      ) : null}
      {name === "book" ? (
        <>
          <path
            d="M12 6.75c-1.9-1.15-4-1.45-6.25-1.15v11.7c2.15-.3 4.25.05 6.25 1.2 2-1.15 4.1-1.5 6.25-1.2V5.6c-2.15-.3-4.25.05-6.25 1.15Z"
            {...stroke}
          />
          <path d="M12 6.75v11.75" {...stroke} />
        </>
      ) : null}
      {name === "pathway" ? (
        <>
          <circle cx="6" cy="15" r="2" {...stroke} />
          <circle cx="12" cy="7.5" r="2" {...stroke} />
          <circle cx="18" cy="15" r="2" {...stroke} />
          <path d="M7.7 13.7 10.4 9.1M13.6 9.1 16.3 13.7" {...stroke} />
        </>
      ) : null}
      {name === "map" ? (
        <>
          <path
            d="M8.25 5.25 4.75 6.75v11.5l3.5-1.5 4 1.75 4-1.75 3.5 1.5V6.75l-3.5-1.5-4 1.75-4-1.75Z"
            {...stroke}
          />
          <path d="M8.25 5.25v11.5M12.25 7v11.5M16.25 5.25v11.5" {...stroke} />
        </>
      ) : null}
      {name === "shield" ? (
        <path
          d="M12 4.25 18.25 6.75v5.15c0 3.45-2.45 6.25-6.25 7.35-3.8-1.1-6.25-3.9-6.25-7.35V6.75L12 4.25Z"
          {...stroke}
        />
      ) : null}
      {name === "pair" ? (
        <>
          <rect x="4.25" y="6" width="6.5" height="12" rx="2" {...stroke} />
          <rect x="13.25" y="6" width="6.5" height="12" rx="2" {...stroke} />
        </>
      ) : null}
      {name === "columns" ? (
        <>
          <path d="M4.75 18.75h14.5" {...stroke} />
          <path d="M6.5 18.75V9M12 18.75V9M17.5 18.75V9" {...stroke} />
          <path d="M4.75 9h14.5" {...stroke} />
          <path d="M7.5 9V6.75h9V9" {...stroke} />
        </>
      ) : null}
      {name === "quote" ? (
        <>
          <path
            d="M9.1 16.75c-1.7 0-3-1.35-3-3.15 0-2.7 1.85-4.75 4.7-5.45v2.15c-1.2.5-1.85 1.35-1.85 2.4h2.15v4.05H9.1Z"
            {...stroke}
          />
          <path
            d="M16.6 16.75c-1.7 0-3-1.35-3-3.15 0-2.7 1.85-4.75 4.7-5.45v2.15c-1.2.5-1.85 1.35-1.85 2.4H19v4.05h-2.4Z"
            {...stroke}
          />
        </>
      ) : null}
      {name === "bookmark" ? (
        <path
          d="M8 5h8a1 1 0 0 1 1 1v13l-5-2.75L7 19V6a1 1 0 0 1 1-1Z"
          {...stroke}
        />
      ) : null}
    </svg>
  );
}
