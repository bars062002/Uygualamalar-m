import { json } from '../../lib/http.js';
import { sha, bearer } from '../../lib/auth.js';

// GET /api/me → hesap bilgisi ve kişisel kestirme adresi;  POST /api/me {logout:true} → oturumu kapat
export async function onRequestGet({ request, env, data }) {
  const u = await env.DB.prepare('SELECT username, name, qkey FROM users WHERE username = ?').bind(data.user.username).first();
  const origin = new URL(request.url).origin;
  // Hesaplardan önceki (tek kişilik) Ritim verisi henüz bir hesaba aktarılmadıysa sayısını bildir
  let legacy = null;
  if (!(await env.DB.prepare("SELECT 1 FROM meta WHERE k = 'legacy_owner'").first())) {
    const r = (await env.DB.prepare("SELECT col, COUNT(*) n FROM docs WHERE data IS NOT NULL GROUP BY col").all()).results || [];
    const c = Object.fromEntries(r.map(x => [x.col, x.n]));
    if ((c.tasks || 0) + (c.notes || 0) > 0) legacy = { tasks: c.tasks || 0, notes: c.notes || 0 };
  }
  return json({ username: u.username, name: u.name, quickUrl: `${origin}/api/quick?k=${encodeURIComponent(u.qkey)}`, legacy });
}
export async function onRequestPost({ request, env }) {
  await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(await sha(bearer(request))).run();
  return json({ ok: true });
}
