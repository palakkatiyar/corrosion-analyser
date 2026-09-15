// Vercel serverless function: proxies requests to the Gemini API so the
// key stays server-side (set GEMINI_API_KEY in Vercel project settings).
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: { message: 'Method not allowed' } });
    return;
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    res.status(500).json({ error: { message: 'GEMINI_API_KEY is not configured on the server' } });
    return;
  }

  try {
    let r;
    // Retry on transient overload (503) / rate limit (429) with backoff
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await new Promise(ok => setTimeout(ok, 1500 * attempt));
      r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.body),
        }
      );
      if (r.status !== 503 && r.status !== 429) break;
    }
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    res.status(502).json({ error: { message: 'Upstream request failed: ' + err.message } });
  }
}
