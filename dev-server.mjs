// Local dev server that mimics Vercel: serves index.html and routes
// POST /api/analyse to the serverless function, with GEMINI_API_KEY
// loaded from .env. Run: node dev-server.mjs   (not used in production)
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import handler from './api/analyse.js';

const env = await readFile('.env', 'utf8').catch(() => '');
const m = env.match(/^\s*GEMINI_API_KEY\s*=\s*["']?([^\s"']+)/m);
if (m) process.env.GEMINI_API_KEY = m[1];

createServer(async (req, res) => {
  if (req.url === '/api/analyse') {
    let body = '';
    for await (const chunk of req) body += chunk;
    req.body = body ? JSON.parse(body) : {};
    res.status = code => { res.statusCode = code; return res; };
    res.json = obj => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); };
    return handler(req, res);
  }
  try {
    const html = await readFile('index.html');
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
  } catch {
    res.statusCode = 404;
    res.end('Not found');
  }
}).listen(8765, () => console.log('Dev server on http://localhost:8765'));
