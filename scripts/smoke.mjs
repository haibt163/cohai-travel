#!/usr/bin/env node
/**
 * Post-build smoke test for the standalone production build.
 * The configured Vercel/Nitro build is previewed with Vite's production
 * preview server; the previous `start -> .output/server` path was incompatible
 * with the checked-in `vercel` Nitro preset, which emits `.vercel/output`.
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
      response = await fetch(`${baseUrl}/`);
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
    throw new Error(`GET / returned HTTP ${response.status}\n${output.trim()}`);
  }

  const html = await response.text();
  if (!/<title[^>]*>CoHai Travel<\/title>/i.test(html)) {
    throw new Error("GET / did not return the expected CoHai Travel document title");
  }

  console.log(`[smoke] GET / -> ${response.status}; title verified.`);
} finally {
  server.kill("SIGTERM");
  await sleep(250);
  if (server.exitCode === null) server.kill("SIGKILL");
}

if (output.trim()) console.log(output.trim());
