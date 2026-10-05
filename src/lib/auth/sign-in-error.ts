/**
 * Turn whatever `signIn()` threw into a short, safe string for the sign-in page.
 * Better Auth client errors carry a plain `message` (no secrets), so it is
 * shown as a diagnostic next to the generic localized text.
 */
export function describeSignInError(err: unknown): string {
  const raw = err instanceof Error ? err.message : typeof err === "string" ? err : "";
  return raw.trim().slice(0, 200);
}
