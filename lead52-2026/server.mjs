// LEAD52 landing page — local server. No dependencies. Needs Node.js 18+.
//   node server.mjs        → http://localhost:8080
// It serves the site (with video seeking), and lets the in-page editor SAVE content.json and UPLOAD videos/images.
import http from 'node:http';
import fs from 'node:fs/promises';
import {createReadStream, statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 8080;
const types = {'.html': 'text/html;charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.mp4': 'video/mp4', '.webm': 'video/webm', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon'};
const readBody = (req) => new Promise((resolve, reject) => {
  const chunks = []; let n = 0;
  req.on('data', (d) => { n += d.length; if (n > 600e6) { reject(new Error('File too large')); req.destroy(); } else chunks.push(d); });
  req.on('end', () => resolve(Buffer.concat(chunks)));
  req.on('error', reject);
});

http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://localhost');
    if (u.pathname === '/api/ping') return res.end('ok');
    if (req.method === 'POST' && u.pathname === '/api/save') {
      const body = await readBody(req); JSON.parse(body.toString());           // must be valid JSON
      await fs.writeFile(path.join(root, 'content.json'), body); return res.end('saved');
    }
    if (req.method === 'POST' && u.pathname === '/api/subscribe') {              // sign-ups → subscribers.csv
      const d = JSON.parse((await readBody(req)).toString());
      const first = String(d.firstName || '').trim().slice(0, 80), email = String(d.email || '').trim().slice(0, 200);
      if (!first || !/^\S+@\S+\.\S+$/.test(email)) { res.statusCode = 400; return res.end('First name and a valid email are required'); }
      const cell = (v) => '"' + (/^[=+\-@\t\r]/.test(v) ? "'" + v : v).replace(/"/g, '""') + '"';   // quote + block spreadsheet formulas
      const file = path.join(root, 'subscribers.csv'); let head = '';
      try { await fs.access(file); } catch { head = 'date,first_name,email\n'; }
      await fs.appendFile(file, head + [new Date().toISOString(), cell(first), cell(email)].join(',') + '\n'); return res.end('ok');
    }
    if (req.method === 'POST' && u.pathname === '/api/upload') {
      const name = path.basename(u.searchParams.get('f') || '');
      if (!/\.(mp4|webm|jpe?g|png|svg|gif|webp)$/i.test(name)) { res.statusCode = 400; return res.end('Only mp4, webm, jpg, png, svg, gif or webp files'); }
      await fs.mkdir(path.join(root, 'assets'), {recursive: true});
      await fs.writeFile(path.join(root, 'assets', name), await readBody(req)); return res.end('ok');
    }
    let p = decodeURIComponent(u.pathname); if (p.endsWith('/')) p += 'index.html';
    const file = path.join(root, p);
    if (!file.startsWith(root) || ['server.mjs', 'subscribers.csv'].includes(path.basename(file))) { res.statusCode = 403; return res.end('Forbidden'); }
    const st = statSync(file), type = types[path.extname(file).toLowerCase()] || 'application/octet-stream', range = req.headers.range;
    if (range) {                                                                // video seeking
      const m = /bytes=(\d*)-(\d*)/.exec(range); const s = m[1] ? Number(m[1]) : 0, e = m[2] ? Number(m[2]) : st.size - 1;
      res.writeHead(206, {'Content-Type': type, 'Content-Range': `bytes ${s}-${e}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': e - s + 1});
      createReadStream(file, {start: s, end: e}).pipe(res);
    } else {
      res.writeHead(200, {'Content-Type': type, 'Content-Length': st.size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache'});
      createReadStream(file).pipe(res);
    }
  } catch (e) { res.statusCode = e.code === 'ENOENT' ? 404 : 500; res.end(e.code === 'ENOENT' ? 'Not found' : String(e.message)); }
}).listen(PORT, '127.0.0.1', () => console.log(`\n  LEAD52 landing page  →  http://localhost:${PORT}\n  To edit: click "✎ Edit page" (bottom-left), then Save.\n  To stop: press Ctrl+C\n`));
