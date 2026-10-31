import { json } from '../../lib/http.js';
import { sha, bearer } from '../../lib/auth.js';

// GET /api/me → hesap bilgisi ve kişisel kestirme adresi;  POST /api/me {logout:true} → oturumu kapat
export async function onRequestGet({ request, env, data }) {
  const u = await env.DB.prepare('SELECT username, name, qkey FROM users WHERE username = ?').bind(data.user.username).first();
  const origin = new URL(request.url).origin;
  return json({ username: u.username, name: u.name, quickUrl: `${origin}/api/quick?k=${encodeURIComponent(u.qkey)}` });
}
export async function onRequestPost({ request, env }) {
  await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(await sha(bearer(request))).run();
  return json({ ok: true });
}
