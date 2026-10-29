// LEAD52 landing page server: static files (with HTTP Range, which iOS Safari
// needs for <video>) plus a tiny JSON API for sign-ups. No dependencies.
//   node server.mjs            → http://localhost:4173
//   PORT=8080 node server.mjs
import fs from "node:fs";
import fsp from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(ROOT, "public");
const DATA = path.join(ROOT, "data", "subscribers.json");
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".ico": "image/x-icon",
};

// ---------- sign-ups ----------
let subscribers = [];
try {
  subscribers = JSON.parse(fs.readFileSync(DATA, "utf8"));
} catch {
  subscribers = [];
}
let writing = Promise.resolve();
const save = () =>
  (writing = writing.then(async () => {
    await fsp.mkdir(path.dirname(DATA), { recursive: true });
    await fsp.writeFile(DATA, JSON.stringify(subscribers, null, 1));
  }));

// 5 sign-up attempts per IP per 10 minutes.
const hits = new Map();
const limited = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60e3);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (res, status, body) => {
  res.writeHead(status, { "content-type": TYPES[".json"], "cache-control": "no-store" });
  res.end(JSON.stringify(body));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => {
      raw += c;
      if (raw.length > 4096) reject(new Error("too large"));
    });
    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });

const api = async (req, res, url) => {
  if (url.pathname === "/api/stats" && req.method === "GET") {
    return json(res, 200, { subscribers: subscribers.length });
  }
  if (url.pathname === "/api/subscribe" && req.method === "POST") {
    if (limited(req.socket.remoteAddress ?? "")) return json(res, 429, { error: "Too many tries. Please wait a few minutes." });
    let body;
    try {
      body = JSON.parse(await readBody(req));
    } catch {
      return json(res, 400, { error: "Invalid request." });
    }
    // Honeypot: bots fill the hidden "company" field.
    if (body.company) return json(res, 200, { ok: true, count: subscribers.length });
    const name = String(body.name ?? "").trim().slice(0, 60);
    const email = String(body.email ?? "").trim().toLowerCase().slice(0, 120);
    if (!name) return json(res, 422, { error: "Please add your first name.", field: "name" });
    if (!EMAIL.test(email)) return json(res, 422, { error: "That email doesn't look right.", field: "email" });
    if (subscribers.some((s) => s.email === email)) {
      return json(res, 200, { ok: true, already: true, count: subscribers.length });
    }
    subscribers.push({ name, email, at: new Date().toISOString(), source: String(body.source ?? "landing").slice(0, 20) });
    await save();
    return json(res, 201, { ok: true, count: subscribers.length });
  }
  return json(res, 404, { error: "Not found." });
};

// ---------- static ----------
const serveStatic = async (req, res, url) => {
  let rel = decodeURIComponent(url.pathname);
  if (rel.endsWith("/")) rel += "index.html";
  const file = path.normalize(path.join(PUBLIC, rel));
  if (!file.startsWith(PUBLIC)) return json(res, 403, { error: "Forbidden" });
  let stat;
  try {
    stat = await fsp.stat(file);
    if (stat.isDirectory()) return serveStatic(req, res, new URL(url.pathname + "/", url));
  } catch {
    res.writeHead(404, { "content-type": TYPES[".html"] });
    return res.end("<h1>404</h1>");
  }
  const type = TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";
  const headers = {
    "content-type": type,
    "accept-ranges": "bytes",
    // Media is immutable per render; pages revalidate so edits show at once.
    "cache-control": /\.(mp4|jpg|png)$/.test(file) ? "public, max-age=86400" : "no-cache",
  };
  const range = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
  if (range) {
    const start = range[1] ? Number(range[1]) : stat.size - Number(range[2]);
    const end = range[1] && range[2] ? Math.min(Number(range[2]), stat.size - 1) : stat.size - 1;
    if (start >= stat.size || start > end) {
      res.writeHead(416, { "content-range": `bytes */${stat.size}` });
      return res.end();
    }
    res.writeHead(206, { ...headers, "content-range": `bytes ${start}-${end}/${stat.size}`, "content-length": end - start + 1 });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { ...headers, "content-length": stat.size });
  if (req.method === "HEAD") return res.end();
  fs.createReadStream(file).pipe(res);
};

http
  .createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    try {
      if (url.pathname.startsWith("/api/")) return await api(req, res, url);
      return await serveStatic(req, res, url);
    } catch (e) {
      console.error(e);
      if (!res.headersSent) json(res, 500, { error: "Something went wrong." });
    }
  })
  .listen(PORT, () => console.log(`LEAD52 landing → http://localhost:${PORT}`));
