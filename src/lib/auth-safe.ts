/**
 * Clerk helpers that degrade when keys are not configured (local/build without secrets).
 */

export function isClerkConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() &&
      process.env.CLERK_SECRET_KEY?.trim(),
  );
}

export async function safeAuth(): Promise<{ userId: string | null }> {
  if (!isClerkConfigured()) return { userId: null };
  try {
    const { auth } = await import("@clerk/nextjs/server");
    const session = await auth();
    return { userId: session.userId };
  } catch {
    return { userId: null };
  }
}

export async function safeCurrentUser() {
  if (!isClerkConfigured()) return null;
  try {
    const { currentUser } = await import("@clerk/nextjs/server");
    return await currentUser();
  } catch {
    return null;
  }
}
