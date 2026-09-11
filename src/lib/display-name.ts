export function displayNameFromUser(user: {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
}): string {
  const first = (user.firstName ?? "").trim();
  const last = (user.lastName ?? "").trim();

  if (first && last) {
    const initial = last.charAt(0).toUpperCase();
    return `${first} ${initial}.`;
  }
  if (first) return first;
  if (last) return last;

  const username = (user.username ?? "").trim();
  if (username) return username;
  return "Member";
}
