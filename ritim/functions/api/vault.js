import { json } from '../../lib/http.js';
import { storeFile, fileResponse, MAX_USER } from './file.js';

// Dosyalarım: yalnız sahibinin görebildiği özel dosya alanı. Bağlantıyla paylaşılamaz; her istek oturum ister.
//   GET    /api/vault          → { files: [{id, name, type, size, created}], used, max }
//   GET    /api/vault?id=      → dosya içeriği (yalnız sahibi)
//   POST   /api/vault          gövde = dosya, x-file-name başlığı → {id, name, type, size, created}
//   DELETE /api/vault?id=      (yalnız sahibi)
export async function onRequestGet({ request, env, data }) {
  const owner = data.user.username, id = new URL(request.url).searchParams.get('id') || '';
  if (id) {
    const f = await env.DB.prepare('SELECT f.name, f.type, f.size, f.parts FROM vault v JOIN files f ON f.id = v.id WHERE v.id = ? AND v.owner = ? AND f.owner = ?').bind(id, owner, owner).first();
    if (!f) return json({ error: 'Dosya bulunamadı.' }, 404);
    return fileResponse(env, id, f, 'private, no-store');
  }
  const rows = (await env.DB.prepare('SELECT f.id, f.name, f.type, f.size, f.created FROM vault v JOIN files f ON f.id = v.id WHERE v.owner = ? ORDER BY f.created DESC').bind(owner).all()).results || [];
  const used = (await env.DB.prepare('SELECT COALESCE(SUM(size),0) s FROM files WHERE owner = ?').bind(owner).first()).s || 0;
  return json({ files: rows, used, max: MAX_USER });
}

export async function onRequestPost({ request, env, data }) {
  const owner = data.user.username;
  const r = await storeFile(request, env, owner);
  if (r instanceof Response) return r;
  await env.DB.prepare('INSERT INTO vault (id, owner, created) VALUES (?, ?, ?)').bind(r.id, owner, r.created).run();
  return json({ id: r.id, name: r.name, type: r.type, size: r.size, created: r.created });
}

export async function onRequestDelete({ request, env, data }) {
  const owner = data.user.username, id = new URL(request.url).searchParams.get('id') || '';
  const v = await env.DB.prepare('SELECT owner FROM vault WHERE id = ?').bind(id).first();
  if (!v) return json({ ok: true });
  if (v.owner !== owner) return json({ error: 'Bu dosya senin değil.' }, 403);
  await env.DB.batch([env.DB.prepare('DELETE FROM file_parts WHERE id = ?').bind(id), env.DB.prepare('DELETE FROM files WHERE id = ?').bind(id), env.DB.prepare('DELETE FROM vault WHERE id = ?').bind(id)]);
  return json({ ok: true });
}
