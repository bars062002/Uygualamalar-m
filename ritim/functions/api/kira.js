import { json } from '../../lib/http.js';

// Kira Takip (Site Asistan): saha işaretleri. Ortak liste: oturum açan herkes görür; her işarette işaretleyen kişi ve zaman saklanır,
// değişiklikler kira_log'a yazılır.
// Anahtar: <yıl>:Y:<kontrat no>  ya da  <yıl>:T:<kontrat no>:<hedef ayı>
// s: 'ok' (sahada tamamlandı, d = işlem tarihi) · 'iptal' (n = sebep/detay zorunlu) · '' (yalnız not)
// n: not / detay (en çok 500 karakter). s boş ve n boşsa kayıt silinir (geri al).
const K_RE = /^\d{4}:[YT]:[A-Za-z0-9._-]{1,40}(:\d{1,2})?$/, D_RE = /^20\d{2}-[01]\d-[0-3]\d$/;
let cols = false;
async function ensureCols(env) {   // eski tabloya durum ve not sütunları (bir kez)
  if (cols) return;
  for (const c of ['s TEXT', 'n TEXT']) { try { await env.DB.prepare('ALTER TABLE kira_marks ADD COLUMN ' + c).run(); } catch (_) {} }
  try { await env.DB.prepare('ALTER TABLE kira_log ADD COLUMN s TEXT').run(); } catch (_) {}
  try { await env.DB.prepare('ALTER TABLE kira_log ADD COLUMN n TEXT').run(); } catch (_) {}
  cols = true;
}
const all = async env => (await env.DB.prepare('SELECT k, d, s, n, who, name, at FROM kira_marks').all()).results || [];

export async function onRequestGet({ env, data }) {
  await ensureCols(env);
  return json({ me: { username: data.user.username, name: data.user.name || '' }, marks: await all(env) });
}
export async function onRequestPost({ request, env, data }) {
  await ensureCols(env);
  let b; try { b = await request.json(); } catch (_) { return json({ error: 'Geçersiz istek.' }, 400); }
  const k = String(b.k || ''), n = String(b.n == null ? '' : b.n).replace(/\s+/g, ' ').trim().slice(0, 500);
  // eski istemci: yalnız d gönderir (d varsa OK, null ise geri al)
  const s = b.s == null ? (b.d == null ? '' : 'ok') : String(b.s);
  let d = b.d == null ? '' : String(b.d);
  if (!K_RE.test(k) || !['ok', 'iptal', ''].includes(s)) return json({ error: 'Geçersiz saha ya da durum.' }, 400);
  if (s === 'ok' && !D_RE.test(d)) return json({ error: 'Geçersiz tarih.' }, 400);
  if (s === 'iptal' && !n) return json({ error: 'İptal için detay yazın.' }, 400);
  if (s !== 'ok') d = s === 'iptal' ? new Date().toISOString().slice(0, 10) : (D_RE.test(d) ? d : '');
  const u = data.user, now = Date.now(), del = !s && !n;
  await env.DB.batch([
    del ? env.DB.prepare('DELETE FROM kira_marks WHERE k = ?').bind(k)
      : env.DB.prepare('INSERT INTO kira_marks (k, d, s, n, who, name, at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(k) DO UPDATE SET d = excluded.d, s = excluded.s, n = excluded.n, who = excluded.who, name = excluded.name, at = excluded.at')
        .bind(k, d, s, n, u.username, u.name || '', now),
    env.DB.prepare('INSERT INTO kira_log (k, d, s, n, who, at) VALUES (?, ?, ?, ?, ?, ?)').bind(k, del ? null : d, s, n, u.username, now),
  ]);
  return json({ ok: true, marks: await all(env) });
}
