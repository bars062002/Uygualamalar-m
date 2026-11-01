import { json } from '../../lib/http.js';
import { randomKey } from '../../lib/auth.js';

// Görev ekleri. Dosyalar D1'de ~1 MB'lık parçalar hâlinde durur.
//   POST   /api/file            (oturum)  gövde = dosya, x-file-name başlığı → {id, k, name, type, size}
//   GET    /api/file?id=&k=     (anahtarlı bağlantı, oturum gerekmez — bağlantı yalnız sahibinin görevinde durur)
//   DELETE /api/file?id=        (oturum, yalnız sahibi)
export const MAX_FILE = 10 * 1024 * 1024;      // dosya başına 10 MB
export const MAX_USER = 150 * 1024 * 1024;     // kişi başına toplam 150 MB
const PART = 1000 * 1000;
// Tarayıcıda doğrudan açılmasında sakınca olmayan türler; diğerleri indirilir (uygulama adresinde betik çalışmasın diye).
const INLINE = /^(image\/(jpeg|png|gif|webp|heic|heif)|application\/pdf|text\/plain|video\/(mp4|quicktime|webm)|audio\/[a-z0-9.+-]+)$/;

export async function onRequestPost({ request, env, data }) {
  const owner = data.user.username;
  const size = Number(request.headers.get('content-length') || 0);
  if (size > MAX_FILE) return json({ error: 'Dosya 10 MB’tan büyük olamaz.' }, 413);
  const used = (await env.DB.prepare('SELECT COALESCE(SUM(size),0) s FROM files WHERE owner = ?').bind(owner).first()).s || 0;
  const buf = new Uint8Array(await request.arrayBuffer());
  if (!buf.length) return json({ error: 'Dosya boş.' }, 400);
  if (buf.length > MAX_FILE) return json({ error: 'Dosya 10 MB’tan büyük olamaz.' }, 413);
  if (used + buf.length > MAX_USER) return json({ error: 'Dosya alanın doldu (150 MB). Eski ekleri silerek yer açabilirsin.' }, 413);
  let name = 'dosya'; try { name = decodeURIComponent(request.headers.get('x-file-name') || 'dosya'); } catch (e) {}
  name = name.replace(/[\u0000-\u001f\\/]/g, '_').slice(0, 120) || 'dosya';
  const type = String(request.headers.get('content-type') || 'application/octet-stream').split(';')[0].trim().toLowerCase().slice(0, 100);
  const id = randomKey(12), k = randomKey(24), parts = Math.ceil(buf.length / PART);
  const st = [];
  for (let n = 0; n < parts; n++) st.push(env.DB.prepare('INSERT INTO file_parts (id, n, data) VALUES (?, ?, ?)').bind(id, n, buf.slice(n * PART, (n + 1) * PART).buffer));
  st.push(env.DB.prepare('INSERT INTO files (id, owner, k, name, type, size, parts, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, owner, k, name, type, buf.length, parts, Date.now()));
  await env.DB.batch(st);
  return json({ id, k, name, type, size: buf.length });
}

export async function onRequestGet({ request, env }) {
  const u = new URL(request.url), id = u.searchParams.get('id') || '', k = u.searchParams.get('k') || '';
  const f = id && k ? await env.DB.prepare('SELECT name, type, size, parts, k FROM files WHERE id = ?').bind(id).first() : null;
  if (!f || f.k !== k) return new Response('Dosya bulunamadı.', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  const rows = (await env.DB.prepare('SELECT data FROM file_parts WHERE id = ? ORDER BY n').bind(id).all()).results || [];
  const out = new Uint8Array(f.size); let o = 0;
  for (const r of rows) { const b = new Uint8Array(r.data); out.set(b, o); o += b.length; }
  const inline = INLINE.test(f.type);
  const enc = encodeURIComponent(f.name).replace(/['()]/g, escape);
  return new Response(out, { headers: {
    'content-type': inline ? (f.type === 'text/plain' ? 'text/plain; charset=utf-8' : f.type) : 'application/octet-stream',
    'content-disposition': `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${enc}`,
    'x-content-type-options': 'nosniff',
    'content-security-policy': "default-src 'none'; img-src 'self'; media-src 'self'; style-src 'unsafe-inline'",
    'cache-control': 'private, max-age=86400',
  } });
}

export async function onRequestDelete({ request, env, data }) {
  const id = new URL(request.url).searchParams.get('id') || '';
  const f = await env.DB.prepare('SELECT owner FROM files WHERE id = ?').bind(id).first();
  if (!f) return json({ ok: true });
  if (f.owner !== data.user.username) return json({ error: 'Bu dosya senin değil.' }, 403);
  await env.DB.batch([env.DB.prepare('DELETE FROM file_parts WHERE id = ?').bind(id), env.DB.prepare('DELETE FROM files WHERE id = ?').bind(id)]);
  return json({ ok: true });
}
