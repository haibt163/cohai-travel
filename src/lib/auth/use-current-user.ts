import { authClient } from "@/lib/auth/client";

export type CurrentUser = {
  id: string;
  email?: string | null;
  displayName?: string | null;
};

export function useCurrentUserState() {
  const { data, isPending } = authClient.useSession();
  const u = data?.user;
  return {
    user: u?.id
      ? {
          id: u.id,
          email: u.email ?? null,
          displayName: u.name ?? u.email ?? null,
        }
      : null,
    isPending,
  };
}
