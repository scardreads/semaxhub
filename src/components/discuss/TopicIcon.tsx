import type { TopicIconName } from "@/lib/topic-visuals";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function TopicIcon({ name }: { name: TopicIconName }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {name === "clock" ? (
        <>
          <circle cx="12" cy="12" r="7.25" {...stroke} />
          <polyline points="12 8.75 12 12 14.25 13.5" {...stroke} />
        </>
      ) : null}
      {name === "layers" ? (
        <>
          <path d="M12 3.75 20 8 12 12.25 4 8 12 3.75Z" {...stroke} />
          <path d="M4 12 12 16.25 20 12" {...stroke} />
          <path d="M4 16 12 20.25 20 16" {...stroke} />
        </>
      ) : null}
      {name === "sun" ? (
        <>
          <circle cx="12" cy="12" r="3" {...stroke} />
          <path
            d="M12 5v1.5M12 17.5V19M5 12h1.5M17.5 12H19M6.7 6.7l1.1 1.1M16.2 16.2l1.1 1.1M17.3 6.7l-1.1 1.1M7.8 16.2l-1.1 1.1"
            {...stroke}
          />
        </>
      ) : null}
      {name === "seal" ? (
        <>
          <circle cx="12" cy="12" r="7.25" {...stroke} />
          <polyline points="8.5 12.25 11 14.75 15.75 9.75" {...stroke} />
        </>
      ) : null}
      {name === "droplet" ? (
        <path
          d="M12 3.75s5 5.1 5 8.9a5 5 0 0 1-10 0c0-3.8 5-8.9 5-8.9Z"
          {...stroke}
        />
      ) : null}
      {name === "split" ? (
        <>
          <path
            d="M10.25 5.5H8.2A2.2 2.2 0 0 0 6 7.7v8.6a2.2 2.2 0 0 0 2.2 2.2h2.05"
            {...stroke}
          />
          <path
            d="M13.75 5.5h2.05A2.2 2.2 0 0 1 18 7.7v8.6a2.2 2.2 0 0 1-2.2 2.2h-2.05"
            {...stroke}
          />
          <path d="M12 5v14" {...stroke} />
        </>
      ) : null}
      {name === "document" ? (
        <>
          <path
            d="M8 4.75h5.25L17.5 9v9.75a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 18.75V6.25A1.5 1.5 0 0 1 8 4.75Z"
            {...stroke}
          />
          <path d="M13 4.75V9h4.5" {...stroke} />
          <path d="M9 13h6M9 16h4.5" {...stroke} />
        </>
      ) : null}
      {name === "question" ? (
        <>
          <circle cx="12" cy="12" r="7.25" {...stroke} />
          <path
            d="M9.6 9.7a2.4 2.4 0 0 1 4.65.95c0 1.6-2.25 1.85-2.25 3.35"
            {...stroke}
          />
          <circle cx="12" cy="17.15" r="0.8" fill="currentColor" stroke="none" />
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
