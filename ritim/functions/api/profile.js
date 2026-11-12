import { json } from '../../lib/http.js';

// Site Asistan profili: fotoğraf, ad ve görev unvanı hesapta saklanır; cihaz değişince ya da uygulama
// yeniden eklenince geri gelir.  GET /api/profile → {avatar, name, title, updated, layout}
// POST /api/profile {avatar?, name?, title?, layout?} → yalnız gönderilen alanlar güncellenir ("" siler)
// layout: Site Asistan'ın kişisel düzeni (ana sayfa, alt menü, sekmeler, modül kartları) · JSON metni, en çok 20 bin karakter
const MAX_AVATAR = 200000;   // 320 px JPEG veri adresi ≈ 30–60 bin karakter
const MAX_LAYOUT = 20000;    // düzen JSON'u birkaç bin karakter
const clean = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : undefined);

export async function onRequestGet({ env, data }) {
  const r = await env.DB.prepare('SELECT avatar, name, title, updated FROM profiles WHERE username = ?').bind(data.user.username).first();
  const p = await env.DB.prepare('SELECT layout FROM prefs WHERE username = ?').bind(data.user.username).first();
  return json(Object.assign(r || { avatar: '', name: '', title: '', updated: 0 }, { layout: (p && p.layout) || '' }));
}

export async function onRequestPost({ request, env, data }) {
  let b; try { b = await request.json(); } catch (_) { return json({ error: 'Geçersiz istek.' }, 400); }
  const avatar = typeof b.avatar === 'string' ? b.avatar : undefined;
  if (avatar !== undefined && avatar !== '' && (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(avatar) || avatar.length > MAX_AVATAR))
    return json({ error: 'Fotoğraf biçimi ya da boyutu uygun değil.' }, 400);
  const name = clean(b.name, 80), title = clean(b.title, 120);
  const now = Date.now();
  if (b.layout !== undefined) {
    const lay = typeof b.layout === 'string' ? b.layout : '';
    if (lay.length > MAX_LAYOUT) return json({ error: 'Düzen çok büyük.' }, 400);
    if (lay) { try { JSON.parse(lay); } catch (_) { return json({ error: 'Düzen biçimi geçersiz.' }, 400); } }
    await env.DB.prepare('INSERT INTO prefs (username, layout, updated) VALUES (?, ?, ?) ON CONFLICT(username) DO UPDATE SET layout = excluded.layout, updated = excluded.updated')
      .bind(data.user.username, lay, now).run();
    if (avatar === undefined && name === undefined && title === undefined) return json({ ok: true, updated: now });
  }
  const cur = (await env.DB.prepare('SELECT avatar, name, title FROM profiles WHERE username = ?').bind(data.user.username).first()) || { avatar: '', name: '', title: '' };
  const next = { avatar: avatar !== undefined ? avatar : cur.avatar || '', name: name !== undefined ? name : cur.name || '', title: title !== undefined ? title : cur.title || '' };
  await env.DB.prepare('INSERT INTO profiles (username, avatar, name, title, updated) VALUES (?, ?, ?, ?, ?) ON CONFLICT(username) DO UPDATE SET avatar = excluded.avatar, name = excluded.name, title = excluded.title, updated = excluded.updated')
    .bind(data.user.username, next.avatar, next.name, next.title, now).run();
  return json({ ok: true, updated: now });
}
