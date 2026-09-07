/**
 * Session lookup used by the root loader and authMiddleware.
 * In the Grok App Builder preview this is provided by the host Better Auth broker.
 * Standalone checkout: read the Better Auth session and return { id, email } or null.
 */
export type SessionUser = { id: string; email: string | null };

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const mod = await import("@/lib/auth/server");
    const session = await mod.auth.api.getSession({
      headers: (await import("@tanstack/react-start/server")).getRequestHeaders(),
    });
    const user = session?.user;
    if (!user?.id) return null;
    return { id: user.id, email: user.email ?? null };
  } catch {
    return null;
  }
}
