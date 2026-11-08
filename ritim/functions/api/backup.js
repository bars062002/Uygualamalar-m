import { json } from '../../lib/http.js';
import { backupOwner, gunzip } from '../../lib/backup.js';

// Otomatik yedekler (oturum, yalnız kendi yedeklerin)
//   GET  /api/backup        → { list: [{ at, size, n }] }
//   GET  /api/backup?at=    → yedek dosyası (JSON, indirme)
//   POST /api/backup        → şimdi yedek al
export async function onRequestGet({ request, env, data }) {
  const owner = data.user.username, at = Number(new URL(request.url).searchParams.get('at') || 0);
  if (at) {
    const r = await env.DB.prepare('SELECT data FROM backups WHERE owner = ? AND at = ?').bind(owner, at).first();
    if (!r) return json({ error: 'Yedek bulunamadı.' }, 404);
    const txt = await gunzip(new Uint8Array(r.data)), d = new Date(at + 3 * 3600e3).toISOString().slice(0, 10);
    return new Response(txt, { headers: { 'content-type': 'application/json; charset=utf-8', 'content-disposition': `attachment; filename="ritim-yedek-${d}.json"`, 'cache-control': 'private, no-store' } });
  }
  const list = (await env.DB.prepare('SELECT at, size, n FROM backups WHERE owner = ? ORDER BY at DESC').bind(owner).all()).results || [];
  return json({ list });
}
export async function onRequestPost({ env, data }) {
  const r = await backupOwner(env, data.user.username);
  if (!r) return json({ error: 'Yedek alınamadı (veri çok büyük).' }, 413);
  return json({ ok: true, ...r });
}
