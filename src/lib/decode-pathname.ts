/**
 * Percent-encoded request paths that decode to a normal pathname.
 * Returns null when the path is already decoded, malformed, or would
 * change directory structure (`.` / `..`).
 */
export function safeDecodedPathname(pathname: string): string | null {
  if (!pathname.includes("%")) return null;

  let decoded = pathname;
  for (let i = 0; i < 2; i++) {
    if (!decoded.includes("%")) break;
    let next: string;
    try {
      next = decodeURIComponent(decoded);
    } catch {
      return null;
    }
    if (next === decoded) break;
    decoded = next;
  }

  if (decoded === pathname) return null;
  if (!decoded.startsWith("/") || decoded.startsWith("//")) return null;
  if (decoded.includes("\0") || decoded.includes("\\") || decoded.includes("://")) {
    return null;
  }

  const segments = decoded.split("/");
  if (segments.some((segment) => segment === "." || segment === "..")) return null;
  return decoded;
}
