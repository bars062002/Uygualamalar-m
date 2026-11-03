import { json } from '../../lib/http.js';
import { vapid, sendPush, pushStatus, note } from '../../lib/push.js';

// GET /api/push/key → { key } (VAPID genel anahtarı; açık)
export async function onRequestGetKey({ env }) { return json({ key: (await vapid(env)).pub }); }

const okEndpoint = u => { try { const x = new URL(u); return x.protocol === 'https:' && /(^|\.)push\.apple\.com$|(^|\.)googleapis\.com$|(^|\.)mozilla\.com$|(^|\.)windows\.com$|(^|\.)mozaws\.net$/.test(x.hostname); } catch { return false; } };
// POST /api/push/sub { sub:{endpoint,keys:{p256dh,auth}}, contracts:[{k,a,b}] }
export async function onRequestPostSub({ request, env, data: ctx }) {
  let b; try { b = await request.json(); } catch { return json({ error: 'Geçersiz JSON.' }, 400); }
  const s = b && b.sub, k = s && s.keys;
  if (!s || !okEndpoint(s.endpoint) || !k || !/^[A-Za-z0-9_-]{80,100}$/.test(k.p256dh || '') || !/^[A-Za-z0-9_-]{16,32}$/.test(k.auth || '')) return json({ error: 'Geçersiz abonelik.' }, 400);
  const con = (Array.isArray(b.contracts) ? b.contracts : []).slice(0, 300)
    .filter(c => c && /^\d{4}-\d\d-\d\d$/.test(c.b || '')).map(c => ({ k: String(c.k || '').slice(0, 24), a: String(c.a || '').slice(0, 60), b: c.b }));
  const now = Date.now();
  await env.DB.prepare('INSERT INTO push_subs (endpoint, owner, p256dh, auth, prefs, contracts, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (endpoint) DO UPDATE SET owner = excluded.owner, p256dh = excluded.p256dh, auth = excluded.auth, contracts = excluded.contracts, updated = excluded.updated')
    .bind(s.endpoint, ctx.user.username, k.p256dh, k.auth, '{}', JSON.stringify(con), now, now).run();
  return json({ ok: true });
}
// POST /api/push/unsub { endpoint }
export async function onRequestPostUnsub({ request, env, data: ctx }) {
  let b; try { b = await request.json(); } catch { return json({ error: 'Geçersiz JSON.' }, 400); }
  await env.DB.prepare('DELETE FROM push_subs WHERE endpoint = ? AND owner = ?').bind(String(b && b.endpoint || ''), ctx.user.username).run();
  return json({ ok: true });
}
// POST /api/push/test → bu kullanıcının tüm cihazlarına deneme bildirimi
export async function onRequestPostTest({ env, data: ctx }) {
  const subs = (await env.DB.prepare('SELECT endpoint, p256dh, auth FROM push_subs WHERE owner = ?').bind(ctx.user.username).all()).results || [];
  if (!subs.length) return json({ error: 'Bu hesapta bildirim açık cihaz yok.' }, 404);
  let ok = 0; const st = [];
  for (const s of subs) { try { const c = await sendPush(env, s, { title: 'Site Asistan', body: 'Bildirimler çalışıyor ✓', tag: 'deneme', url: './?m=home' }, 600); st.push(c); if (c >= 200 && c < 300) ok++; if (c === 404 || c === 410) await env.DB.prepare('DELETE FROM push_subs WHERE endpoint = ?').bind(s.endpoint).run(); } catch (e) { st.push(0); } }
  await note(env, ctx.user.username, 'test', { status: st });
  return json({ ok, total: subs.length, status: st });
}

// GET /api/push/status → { devices, digest:{at,ymd,time,status,empty}, remind:{...}, test:{...} }
export async function onRequestGetStatus({ env, data: ctx }) { return json(await pushStatus(env, ctx.user.username)); }
