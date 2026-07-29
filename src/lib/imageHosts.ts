/**
 * Hosts allowed for next/image and recipe/profile image URL fields.
 * Keep in sync with remotePatterns in next.config.ts.
 */
export const ALLOWED_IMAGE_HOSTS = [
  // Unsplash
  "images.unsplash.com",
  "plus.unsplash.com",
  "source.unsplash.com",
  // Google profile / OAuth avatar (common after Google email sign-in)
  "lh3.googleusercontent.com",
  "lh4.googleusercontent.com",
  "lh5.googleusercontent.com",
  "lh6.googleusercontent.com",
  // Gravatar / email avatars
  "www.gravatar.com",
  "secure.gravatar.com",
  "gravatar.com",
  // Pexels
  "images.pexels.com",
  "static.pexels.com",
  "www.pexels.com",
  "pexels.com",
  // Pixabay
  "cdn.pixabay.com",
  "pixabay.com",
  "www.pixabay.com",
  // Other common free image CDNs
  "i.imgur.com",
] as const;

const ALLOWED_HOST_SET = new Set<string>(ALLOWED_IMAGE_HOSTS);

/** Wildcard suffix hosts (any subdomain). */
const ALLOWED_HOST_SUFFIXES = [
  ".googleusercontent.com",
  ".unsplash.com",
  ".gravatar.com",
  ".pexels.com",
  ".pixabay.com",
] as const;

export function isLocalImagePath(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("//");
}

export function isAllowedImageUrl(src: string): boolean {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();
  if (isLocalImagePath(trimmed)) return true;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    if (ALLOWED_HOST_SET.has(host)) return true;
    return ALLOWED_HOST_SUFFIXES.some(
      (suffix) => host === suffix.slice(1) || host.endsWith(suffix),
    );
  } catch {
    return false;
  }
}

export const ALLOWED_IMAGE_HOSTS_HINT =
  "Use an HTTPS image from Unsplash, Google, Gravatar, Pexels, Pixabay, or Imgur.";
