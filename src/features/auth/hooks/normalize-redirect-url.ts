const REDIRECT_URL_ALLOW_LIST: Array<string> = [];
const SERVER_RENDER_ORIGIN = "http://localhost";

function getRuntimeOrigin() {
  return typeof window === "undefined"
    ? SERVER_RENDER_ORIGIN
    : window.location.origin;
}

export function normalizeRedirectUrl(
  redirectTo: string | undefined,
  fallback: string,
  origin = getRuntimeOrigin(),
) {
  const safeFallback = `${origin}${fallback}`;

  if (!redirectTo) {
    return safeFallback;
  }

  try {
    const normalizedUrl = new URL(redirectTo, origin);
    const isSameOrigin = normalizedUrl.origin === origin;
    const isAllowedExternalHostname = REDIRECT_URL_ALLOW_LIST.includes(
      normalizedUrl.hostname,
    );

    if (!isSameOrigin && !isAllowedExternalHostname) {
      return safeFallback;
    }

    if (normalizedUrl.pathname.startsWith("/api/")) {
      return `${normalizedUrl.pathname}${normalizedUrl.search}${normalizedUrl.hash}`;
    }

    return normalizedUrl.toString();
  } catch {
    return safeFallback;
  }
}
