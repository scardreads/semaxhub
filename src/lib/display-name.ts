export function displayNameFromUser(user: {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  primaryEmailAddress?: { emailAddress: string } | null;
}): string {
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (full) return full;
  if (user.username) return user.username;
  const email = user.primaryEmailAddress?.emailAddress;
  if (email) return email.split("@")[0] ?? "Member";
  return "Member";
}
