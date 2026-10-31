import { json, COLLECTIONS, ID_RE } from '../../lib/http.js';

// POST /api/batch  [{ col, id, data }]  → upserts each document; data: null deletes it.
export async function onRequestPost({ request, env, data: ctx }) {
  const owner = ctx.user.username;
  let items;
  try { items = await request.json(); } catch { return json({ error: 'Geçersiz JSON.' }, 400); }
  if (!Array.isArray(items) || items.length > 500) return json({ error: 'İstek 1-500 belge içermeli.' }, 400);

  const rev = Date.now();
  const stmts = [];
  for (const it of items) {
    if (!it || !COLLECTIONS.has(it.col) || !ID_RE.test(String(it.id))) return json({ error: 'Geçersiz belge yolu.' }, 400);
    if (it.data !== null && (typeof it.data !== 'object' || Array.isArray(it.data))) return json({ error: 'Belge bir nesne olmalı.' }, 400);
    const data = it.data === null ? null : JSON.stringify(it.data);
    if (data && data.length > 100000) return json({ error: 'Belge 100 KB sınırını aşıyor.' }, 413);
    stmts.push(
      env.DB.prepare('INSERT INTO udocs (owner, col, id, data, rev) VALUES (?, ?, ?, ?, ?) ON CONFLICT (owner, col, id) DO UPDATE SET data = excluded.data, rev = excluded.rev')
        .bind(owner, it.col, String(it.id), data, rev)
    );
  }
  if (stmts.length) await env.DB.batch(stmts);
  return json({ ok: true, rev });
}
