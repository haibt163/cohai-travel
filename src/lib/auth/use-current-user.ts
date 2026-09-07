import { useEffect, useState } from "react";

export type CurrentUser = {
  id: string;
  email?: string | null;
  displayName?: string | null;
};

export function useCurrentUserState() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isPending, setPending] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/get-session", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        const u = data?.user;
        setUser(
          u?.id
            ? {
                id: u.id,
                email: u.email,
                displayName: u.name ?? u.email ?? null,
              }
            : null,
        );
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setPending(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, isPending };
}
