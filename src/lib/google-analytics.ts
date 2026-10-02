/**
 * Google Analytics 4 (gtag.js) measurement ID.
 *
 * `NEXT_PUBLIC_GA_MEASUREMENT_ID` overrides the ID on any environment, including
 * local dev and Vercel Preview. A blank value disables the tag everywhere.
 *
 * When the variable is unset, the public Semax Hub ID below is used only on
 * the Vercel production deployment (`VERCEL_ENV=production`). Local dev, local
 * builds, and preview deployments do not load gtag unless the variable is set.
 */
export const GA_MEASUREMENT_ID = "G-78DELVNFMX";

const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/;

export function resolveGaMeasurementId(
  configured: string | undefined,
  vercelEnv: string | undefined,
): string | null {
  if (configured !== undefined) {
    const trimmed = configured.trim();
    if (!trimmed || !GA_MEASUREMENT_ID_PATTERN.test(trimmed)) return null;
    return trimmed;
  }

  if (vercelEnv === "production") return GA_MEASUREMENT_ID;
  return null;
}

/** Inline bootstrap equivalent to the standard gtag.js snippet. */
export function gaTagSnippet(measurementId: string): string {
  const id = JSON.stringify(measurementId);
  return [
    "window.dataLayer = window.dataLayer || [];",
    "function gtag(){dataLayer.push(arguments);}",
    "gtag('js', new Date());",
    `gtag('config', ${id});`,
  ].join("\n");
}
