export function imageUrlFromUser(user: {
  hasImage?: boolean | null;
  imageUrl?: string | null;
  externalAccounts?: Array<{ provider: string; imageUrl?: string | null }>;
}): string | null {
  if (user.hasImage && user.imageUrl) return user.imageUrl;
  const google = user.externalAccounts?.find(
    (a) => a.provider === "google" && a.imageUrl,
  );
  if (google?.imageUrl) return google.imageUrl;
  const any = user.externalAccounts?.find((a) => a.imageUrl);
  return any?.imageUrl ?? null;
}

/** First letters of up to 2 words, uppercase; "Member" → "M". */
export function initialsFromDisplayName(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) return "?";
  return parts.map((p) => p.charAt(0).toUpperCase()).join("");
}
