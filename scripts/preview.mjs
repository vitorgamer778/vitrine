// Local static preview with SPA fallback and compressed, content-hashed assets.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { gzipSync } from "node:zlib";
const root = resolve("dist");
const cache = new Map();
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon",
  ".json": "application/json",
};
createServer(async (request, response) => {
  try {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405);
      response.end();
      return;
    }
    const route = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const name = route === "/" || !extname(route) ? "/index.html" : route;
    const file = resolve(root, "." + name);
    if (!file.startsWith(root + sep)) {
      response.writeHead(403);
      response.end();
      return;
    }
    let entry = name === "/index.html" ? undefined : cache.get(file);
    if (!entry) {
      const data = await readFile(file);
      const compressed = [".html", ".js", ".css", ".svg", ".json"].includes(
        extname(file),
      );
      entry = { data, gzip: compressed ? gzipSync(data) : null };
      if (name !== "/index.html") cache.set(file, entry);
    }
    const encoding =
      entry.gzip && /\bgzip\b/.test(request.headers["accept-encoding"] ?? "");
    const body = encoding ? entry.gzip : entry.data;
    response.writeHead(200, {
      "Content-Type": mime[extname(file)] ?? "application/octet-stream",
      "Content-Length": body.length,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control":
        name === "/index.html"
          ? "no-cache"
          : "public, max-age=31536000, immutable",
      Vary: "Accept-Encoding",
      ...(encoding ? { "Content-Encoding": "gzip" } : {}),
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(404);
    response.end("Arquivo não encontrado. Execute npm run build:web primeiro.");
  }
}).listen(8084, "127.0.0.1", () =>
  console.log("Vitrine preview: http://127.0.0.1:8084"),
);
