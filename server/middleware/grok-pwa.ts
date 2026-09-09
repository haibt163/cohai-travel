import type { IncomingMessage, ServerResponse } from "node:http";

export default function grokPwaMiddleware(_req: IncomingMessage, _res: ServerResponse, next?: () => void) {
  // The Vite plugin owns the dev-preview injection. Keep this middleware as a
  // harmless deploy-time compatibility hook so the tracked server tree does
  // not depend on an ignored preview-only file.
  next?.();
}
