import type { ReactNode } from "react";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { signOut } from "@/lib/auth/client";

export function SignedIn({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending || !user) return null;
  return <>{children}</>;
}

export function SignedOut({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending || user) return null;
  return <>{children}</>;
}

export function RedirectToSignIn() {
  const navigate = useNavigate();
  useEffect(() => {
    void navigate({ to: "/login" });
  }, [navigate]);
  return null;
}

export function UserButton() {
  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center text-xs font-medium"
      onClick={() => void signOut()}
    >
      Sign out
    </button>
  );
}
