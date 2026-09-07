import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import pg from "pg";

const connectionString = process.env.DATABASE_URL ?? "";

const pool = new pg.Pool({
  connectionString,
  max: 4,
  ssl:
    connectionString.includes("localhost") || connectionString.includes("pglite")
      ? false
      : { rejectUnauthorized: false },
});

const googleId = process.env.GOOGLE_CLIENT_ID ?? "";
const googleSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";
const twitterId = process.env.TWITTER_CLIENT_ID ?? "";
const twitterSecret = process.env.TWITTER_CLIENT_SECRET ?? "";

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.VITE_BETTER_AUTH_URL,
  trustedOrigins: [
    process.env.BETTER_AUTH_URL,
    process.env.VITE_BETTER_AUTH_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ].filter(Boolean) as string[],
  emailAndPassword: { enabled: false },
  socialProviders: {
    ...(googleId && googleSecret
      ? {
          google: {
            clientId: googleId,
            clientSecret: googleSecret,
          },
        }
      : {}),
    ...(twitterId && twitterSecret
      ? {
          twitter: {
            clientId: twitterId,
            clientSecret: twitterSecret,
          },
        }
      : {}),
  },
  plugins: [tanstackStartCookies()],
});
