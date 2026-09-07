import { createMiddleware } from "@tanstack/react-start";
import { getSessionUser } from "@/lib/auth/verify.server";

/** Requires a signed-in user. Attaches userId for booking / contact writes. */
export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const user = await getSessionUser();
    if (!user) throw new Error("Sign in to hold a seat.");
    return next({ context: { userId: user.id, email: user.email } });
  },
);
