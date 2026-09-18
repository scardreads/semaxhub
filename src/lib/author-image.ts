export function imageUrlFromUser(user: {
  hasImage?: boolean | null;
  has_image?: boolean | null;
  imageUrl?: string | null;
  image_url?: string | null;
  externalAccounts?: Array<{
    provider: string;
    imageUrl?: string | null;
    image_url?: string | null;
  }>;
  external_accounts?: Array<{
    provider: string;
    image_url?: string | null;
    imageUrl?: string | null;
  }>;
}): string | null {
  const hasImage = user.hasImage ?? user.has_image ?? false;
  const imageUrl = user.imageUrl ?? user.image_url ?? null;
  if (hasImage && imageUrl) return imageUrl;
  const accounts = user.externalAccounts ?? user.external_accounts ?? [];
  const normalized = accounts.map((a) => ({
    provider: a.provider,
    imageUrl: a.imageUrl ?? a.image_url ?? null,
  }));
  const google = normalized.find((a) => a.provider === "google" && a.imageUrl);
  if (google?.imageUrl) return google.imageUrl;
  const any = normalized.find((a) => a.imageUrl);
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
