export const getImageUrl = (path?: string) => {
  if (!path) return "/default-avatar.png";

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  if (path.startsWith("http")) return path;

  if (path.startsWith("/uploads")) {
    return `${BASE_URL}${path}`;
  }

  return `${BASE_URL}/uploads/${path}`;
};