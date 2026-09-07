import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth/server";

export type SessionUser = { id: string; email: string | null };

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    });
    const user = session?.user;
    if (!user?.id) return null;
    return { id: user.id, email: user.email ?? null };
  } catch {
    return null;
  }
}
