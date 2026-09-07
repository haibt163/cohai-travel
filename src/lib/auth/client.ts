export const authEnabled = true;

export const GROK_PROVIDERS = [
  { providerId: "google", label: "Google" },
  { providerId: "twitter", label: "X" },
] as const;

export type ProviderId = (typeof GROK_PROVIDERS)[number]["providerId"];

/** Preview host replaces this with the Better Auth client. */
export async function signIn(providerId: ProviderId, opts?: { callbackURL?: string }) {
  const callbackURL = opts?.callbackURL ?? "/account";
  window.location.href = `/api/auth/signin/${providerId}?callbackURL=${encodeURIComponent(callbackURL)}`;
}

export async function signOut() {
  window.location.href = "/api/auth/signout";
}
