/**
 * Better Auth server instance.
 * Preview host injects Google + X via the Grok broker.
 * Standalone: construct `betterAuth({ database, socialProviders })` here
 * and keep `/api/auth/$` pointed at `auth.handler`.
 */
export const auth = {
  handler: async (_request: Request) => {
    return new Response(JSON.stringify({ error: "Auth host not wired" }), {
      status: 501,
      headers: { "content-type": "application/json" },
    });
  },
  api: {
    getSession: async (_opts: { headers: Headers }) =>
      null as null | {
        user?: { id: string; email?: string | null };
      },
  },
};
