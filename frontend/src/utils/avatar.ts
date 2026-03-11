export function getInitials(first?: string, last?: string, username?: string): string {
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first[0].toUpperCase();
  if (username) return username[0].toUpperCase();
  return "?";
}

export function getAvatarColor(id: string): string {
  const colors = [
    "#627F67", "#7a6a8a", "#7a8a6a", "#6a7a8a",
    "#8a6a6a", "#6a8a7a", "#8a7a6a", "#6a6a8a",
  ];
  const sum = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[sum % colors.length];
}