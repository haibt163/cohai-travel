#!/usr/bin/env node
/**
 * Server-route smoke test using the same PGLite path as local development.
 *
 * CI does not provide Neon, so this starts Vite directly with DATABASE_URL
 * unset. That exercises the dev-server PGLite bootstrap, migrations, and
 * schema verification before real catalog requests are made.
 */
import { spawn } from "node:child_process";

const port = Number(process.env.SMOKE_PORT ?? 3000);
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [
  "scripts/with-app-env.mjs",
  "vite",
  "dev",
  "--host",
  "127.0.0.1",
  "--port",
  String(port),
], {
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

async function get(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const body = await response.text();
  if (!response.ok) {
    throw new Error(
      `GET ${path} returned HTTP ${response.status}\n${body.slice(0, 1200)}\n${output.trim()}`,
    );
  }
  if (/provenance_state does not exist|Something went wrong/i.test(body)) {
    throw new Error(
      `GET ${path} returned an application error page\n${body.slice(0, 1200)}\n${output.trim()}`,
    );
  }
  return { response, body };
}

try {
  let response;
  let lastError;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(
        `development server exited with code ${server.exitCode}\n${output.trim()}`,
      );
    }
    try {
      response = await fetch(`${baseUrl}/robots.txt`);
      break;
    } catch (err) {
      lastError = err;
      await sleep(250);
    }
  }

  if (!response) {
    throw new Error(
      `server did not become ready: ${lastError?.message ?? "unknown error"}\n${output.trim()}`,
    );
  }
  if (!response.ok) {
    throw new Error(`GET /robots.txt returned HTTP ${response.status}\n${output.trim()}`);
  }

  const body = await response.text();
  if (
    !/^User-agent:\s*\*\s*$/m.test(body) ||
    !/Sitemap:\s+.+\/sitemap\.xml\s*$/m.test(body)
  ) {
    throw new Error("GET /robots.txt did not return the expected robots directives");
  }

  for (const path of ["/en/", "/en/destinations", "/en/contact"]) {
    const page = await get(path);
    if (!/CoHai Travel/i.test(page.body)) {
      throw new Error(`GET ${path} did not render the CoHai Travel application shell`);
    }
    console.log(`[smoke] GET ${path} -> ${page.response.status}; application route verified.`);
  }

  if (!/\[db\] applied 0010_repair_provenance_schema|\[db\] applying/.test(output)) {
    throw new Error(
      "development server did not report a PGLite migration pass; migration bootstrap was not exercised",
    );
  }
  console.log("[smoke] PGLite migration bootstrap reported successfully.");
  console.log("[smoke] GET /robots.txt -> 200; robots directives verified.");
} finally {
  server.kill("SIGTERM");
  await sleep(250);
  if (server.exitCode === null) server.kill("SIGKILL");
}

if (output.trim()) console.log(output.trim());
