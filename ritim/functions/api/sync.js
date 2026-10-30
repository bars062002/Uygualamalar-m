import { json } from '../../lib/http.js';

// GET /api/sync?since=<rev> → documents changed since that revision (deleted ones come back with data: null).
export async function onRequestGet({ request, env }) {
  const since = Number(new URL(request.url).searchParams.get('since')) || 0;
  const now = Date.now();
  const stmt = since
    ? env.DB.prepare('SELECT col, id, data FROM docs WHERE rev >= ?').bind(since)
    : env.DB.prepare('SELECT col, id, data FROM docs WHERE data IS NOT NULL');
  const { results } = await stmt.all();
  const docs = results.map(r => ({ col: r.col, id: r.id, data: r.data === null ? null : JSON.parse(r.data) }));
  // Hand back a revision slightly in the past so writes that land while this query runs are picked up next time.
  return json({ rev: Math.max(0, now - 5000), docs });
}
