import { json } from '../../lib/http.js';

// Kira Takip (Site Asistan): sahada tamamlanan yenileme / tekrarlama işaretleri.
// Ortak liste: oturum açan herkes görür; her işarette işaretleyen kişi ve zaman saklanır, değişiklikler kira_log'a yazılır.
// Anahtar: <yıl>:Y:<kontrat no>  ya da  <yıl>:T:<kontrat no>:<hedef ayı>   ·   d: işlem tarihi (YYYY-MM-DD), null = geri al
const K_RE = /^\d{4}:[YT]:[A-Za-z0-9._-]{1,40}(:\d{1,2})?$/, D_RE = /^20\d{2}-[01]\d-[0-3]\d$/;
const all = async env => (await env.DB.prepare('SELECT k, d, who, name, at FROM kira_marks').all()).results || [];

export async function onRequestGet({ env, data }) {
  return json({ me: { username: data.user.username, name: data.user.name || '' }, marks: await all(env) });
}
export async function onRequestPost({ request, env, data }) {
  let b; try { b = await request.json(); } catch (_) { return json({ error: 'Geçersiz istek.' }, 400); }
  const k = String(b.k || ''), d = b.d == null ? null : String(b.d);
  if (!K_RE.test(k) || (d !== null && !D_RE.test(d))) return json({ error: 'Geçersiz saha ya da tarih.' }, 400);
  const u = data.user, now = Date.now();
  await env.DB.batch([
    d === null ? env.DB.prepare('DELETE FROM kira_marks WHERE k = ?').bind(k)
      : env.DB.prepare('INSERT INTO kira_marks (k, d, who, name, at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(k) DO UPDATE SET d = excluded.d, who = excluded.who, name = excluded.name, at = excluded.at').bind(k, d, u.username, u.name || '', now),
    env.DB.prepare('INSERT INTO kira_log (k, d, who, at) VALUES (?, ?, ?, ?)').bind(k, d, u.username, now),
  ]);
  return json({ ok: true, marks: await all(env) });
}
