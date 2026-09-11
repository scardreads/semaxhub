import { displayNameFromUser as formatName } from "./display-name";
import { isClerkConfigured, safeAuth, safeCurrentUser } from "./auth-safe";

export { formatName as displayNameFromUser };

export async function isAdmin(): Promise<boolean> {
  if (!isClerkConfigured()) return false;
  const { userId } = await safeAuth();
  if (!userId) return false;

  const envList = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (envList.includes(userId)) return true;

  const user = await safeCurrentUser();
  const role = user?.publicMetadata?.role;
  return role === "admin";
}
