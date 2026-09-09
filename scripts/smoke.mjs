#!/usr/bin/env node
/**
 * Post-build smoke test for the standalone production build.
 *
 * The Vercel/Nitro build uses `vercel` output, so the smoke test uses Vite's
 * production preview server. CI has no real Neon database, therefore the
 * smoke gate probes a DB-independent TanStack server route rather than
 * asserting that the optional PGlite fallback is bundled into the function.
 */
import { spawn } from "node:child_process";

const port = Number(process.env.SMOKE_PORT ?? 3000);
const baseUrl = `http://127.0.0.1:${port}`;
const command = process.platform === "win32" ? "npm.cmd" : "npm";
const server = spawn(command, ["run", "preview", "--", "--host", "127.0.0.1", "--port", String(port)], {
  env: {
    ...process.env,
    DATABASE_URL: "",
    BETTER_AUTH_SECRET:
      process.env.BETTER_AUTH_SECRET ?? "ci-only-secret-that-is-at-least-32-bytes-long",
    BETTER_AUTH_URL: baseUrl,
    VITE_BETTER_AUTH_URL: baseUrl,
    PORT: String(port),
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let output = "";
server.stdout.on("data", (chunk) => {
  output += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  output += chunk.toString();
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  let response;
  let lastError;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`production preview exited with code ${server.exitCode}\n${output.trim()}`);
    }
    try {
      response = await fetch(`${baseUrl}/robots.txt`);
      break;
    } catch (err) {
      lastError = err;
      await sleep(500);
    }
  }

  if (!response) {
    throw new Error(`server did not become ready: ${lastError?.message ?? "unknown error"}\n${output.trim()}`);
  }
  if (!response.ok) {
    throw new Error(`GET /robots.txt returned HTTP ${response.status}\n${output.trim()}`);
  }

  const body = await response.text();
  if (!/^User-agent:\s*\*\s*$/m.test(body) || !/Sitemap:\s+.+\/sitemap\.xml\s*$/m.test(body)) {
    throw new Error("GET /robots.txt did not return the expected robots directives");
  }

  console.log(`[smoke] GET /robots.txt -> ${response.status}; robots directives verified.`);
} finally {
  server.kill("SIGTERM");
  await sleep(250);
  if (server.exitCode === null) server.kill("SIGKILL");
}

if (output.trim()) console.log(output.trim());
