import type { ReactNode } from "react";

/** Session state lives on the Better Auth client (`authClient.useSession`). */
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
