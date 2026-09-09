import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const extensionsPath = "/__grok/extensions.js";

function htmlHeadInjection(html) {
  if (html.includes(extensionsPath)) return html;
  return html.replace(
    /<head([^>]*)>/i,
    `<head$1><script src="https://grok.com/grok-app-builder/extensions.js"></script>`,
  );
}

function pluginAsset(name) {
  const candidates = [
    resolve(process.cwd(), "public", "__grok", name),
    resolve(process.cwd(), "public", name),
  ];
  return candidates.find((path) => existsSync(path));
}

export function grokPwaPlugin() {
  return {
    name: "app-builder:grok-pwa",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/__grok/extensions.js") {
          const path = pluginAsset("extensions.js");
          if (!path) {
            res.statusCode = 404;
            res.end("Not Found");
            return;
          }
          res.setHeader("content-type", "application/javascript; charset=utf-8");
          res.end(readFileSync(path));
          return;
        }
        next();
      });
    },
    transformIndexHtml: {
      order: "post",
      handler(html) {
        return htmlHeadInjection(html);
      },
    },
  };
}
