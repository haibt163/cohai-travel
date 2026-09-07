import { createAuthClient } from "better-auth/react";

export const authEnabled = true;

export const GROK_PROVIDERS = [
  { providerId: "google", label: "Google" },
  { providerId: "twitter", label: "X" },
] as const;

export type ProviderId = (typeof GROK_PROVIDERS)[number]["providerId"];

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
});

export async function signIn(providerId: ProviderId, opts?: { callbackURL?: string }) {
  const callbackURL = opts?.callbackURL ?? "/account";
  await authClient.signIn.social({
    provider: providerId,
    callbackURL,
  });
}

export async function signOut() {
  await authClient.signOut();
  window.location.href = "/";
}
