import { describe, expect, it } from "vitest";
import { normalizeRedirectUrl } from "./normalize-redirect-url";

describe("normalizeRedirectUrl", () => {
  it("falls back without accessing window during server rendering", () => {
    expect(normalizeRedirectUrl(undefined, "/posts")).toBe(
      "http://localhost/posts",
    );
  });

  it("normalizes same-origin relative redirects", () => {
    expect(
      normalizeRedirectUrl("/dashboard?tab=profile", "/", "https://example.com"),
    ).toBe("https://example.com/dashboard?tab=profile");
  });

  it("rejects untrusted external redirects", () => {
    expect(
      normalizeRedirectUrl(
        "https://evil.example/phish",
        "/",
        "https://example.com",
      ),
    ).toBe("https://example.com/");
  });
});
