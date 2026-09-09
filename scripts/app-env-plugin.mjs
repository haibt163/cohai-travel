import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export function appEnvPlugin() {
  return {
    name: "app-builder:app-env",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if ((req.url ?? "").split("?", 1)[0] !== "/__app-env") {
          next();
          return;
        }
        try {
          const path = resolve(process.cwd(), ".grok", "app-env.json");
          const body = await readFile(path, "utf8");
          res.statusCode = 200;
          res.setHeader("content-type", "application/json; charset=utf-8");
          res.end(body);
        } catch {
          res.statusCode = 404;
          res.setHeader("content-type", "application/json; charset=utf-8");
          res.end(JSON.stringify({}));
        }
      });
    },
  };
}
