import Script from "next/script";
import { gaTagSnippet, resolveGaMeasurementId } from "@/lib/google-analytics";

/**
 * Sitewide GA4 tag. Renders nothing when no measurement ID is configured
 * for this environment, so local and preview builds stay quiet by default.
 */
export function GoogleAnalytics() {
  const measurementId = resolveGaMeasurementId(
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    process.env.VERCEL_ENV,
  );
  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {gaTagSnippet(measurementId)}
      </Script>
    </>
  );
}
