import { json } from '../../lib/http.js';
import { storeFile, fileResponse, MAX_USER } from './file.js';
import { vaultOk } from './vault-unlock.js';

// Kilit: listeleme, açma, bağlama ve silme şifreyle açılmış anahtar ister (x-vault). Yükleme kilitsiz (ziyaret fotoğrafları).
const locked = () => json({ error: 'Dosyalarım kilitli. Şifrenle aç.', vault: true }, 403);

// Dosyalarım: yalnız sahibinin görebildiği özel dosya alanı. Bağlantıyla paylaşılamaz; her istek oturum ister.
//   GET    /api/vault          → { files: [{id, name, type, size, created}], used, max }
//   GET    /api/vault?id=      → dosya içeriği (yalnız sahibi)
//   POST   /api/vault          gövde = dosya, x-file-name başlığı → {id, name, type, size, created}
//   PUT    /api/vault?id=      { site } → dosyayı bir saha koduna bağlar (boş: bağı kaldırır)
//   DELETE /api/vault?id=      (yalnız sahibi)
let cols = false;
async function ensureCols(env) { if (cols) return; try { await env.DB.prepare('ALTER TABLE vault ADD COLUMN site TEXT').run(); } catch (_) {} cols = true; }
const siteOf = v => String(v || '').trim().toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20);

export async function onRequestGet({ request, env, data }) {
  if (!(await vaultOk(request))) return locked();
  await ensureCols(env);
  const owner = data.user.username, id = new URL(request.url).searchParams.get('id') || '';
  if (id) {
    const f = await env.DB.prepare('SELECT f.name, f.type, f.size, f.parts FROM vault v JOIN files f ON f.id = v.id WHERE v.id = ? AND v.owner = ? AND f.owner = ?').bind(id, owner, owner).first();
    if (!f) return json({ error: 'Dosya bulunamadı.' }, 404);
    return fileResponse(env, id, f, 'private, no-store');
  }
  const rows = (await env.DB.prepare('SELECT f.id, f.name, f.type, f.size, f.created, v.site FROM vault v JOIN files f ON f.id = v.id WHERE v.owner = ? ORDER BY f.created DESC').bind(owner).all()).results || [];
  const used = (await env.DB.prepare('SELECT COALESCE(SUM(size),0) s FROM files WHERE owner = ?').bind(owner).first()).s || 0;
  return json({ files: rows, used, max: MAX_USER });
}

export async function onRequestPost({ request, env, data }) {
  const owner = data.user.username;
  await ensureCols(env);
  const site = siteOf(request.headers.get('x-site'));
  const r = await storeFile(request, env, owner);
  if (r instanceof Response) return r;
  await env.DB.prepare('INSERT INTO vault (id, owner, created, site) VALUES (?, ?, ?, ?)').bind(r.id, owner, r.created, site || null).run();
  return json({ id: r.id, name: r.name, type: r.type, size: r.size, created: r.created, site });
}

export async function onRequestPut({ request, env, data }) {
  if (!(await vaultOk(request))) return locked();
  await ensureCols(env);
  const owner = data.user.username, id = new URL(request.url).searchParams.get('id') || '';
  let b; try { b = await request.json(); } catch (_) { return json({ error: 'Geçersiz istek.' }, 400); }
  const site = siteOf(b && b.site);
  const r = await env.DB.prepare('UPDATE vault SET site = ? WHERE id = ? AND owner = ?').bind(site || null, id, owner).run();
  if (!r.meta || !r.meta.changes) return json({ error: 'Dosya bulunamadı.' }, 404);
  return json({ ok: true, site });
}

export async function onRequestDelete({ request, env, data }) {
  if (!(await vaultOk(request))) return locked();
  const owner = data.user.username, id = new URL(request.url).searchParams.get('id') || '';
  const v = await env.DB.prepare('SELECT owner FROM vault WHERE id = ?').bind(id).first();
  if (!v) return json({ ok: true });
  if (v.owner !== owner) return json({ error: 'Bu dosya senin değil.' }, 403);
  await env.DB.batch([env.DB.prepare('DELETE FROM file_parts WHERE id = ?').bind(id), env.DB.prepare('DELETE FROM files WHERE id = ?').bind(id), env.DB.prepare('DELETE FROM vault WHERE id = ?').bind(id)]);
  return json({ ok: true });
}
