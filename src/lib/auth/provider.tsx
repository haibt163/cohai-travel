import type { ReactNode } from "react";

/** Preview host wraps this with the real Better Auth client provider. */
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
