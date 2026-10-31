import { json } from '../../lib/http.js';
import { hashPassword, newSession, sameString } from '../../lib/auth.js';

// POST /api/login {username, password} → oturum
export async function onRequestPost({ request, env }) {
  let b; try { b = await request.json(); } catch { return json({ error: 'Geçersiz istek.' }, 400); }
  const username = String(b.username || '').trim().toLocaleLowerCase('tr-TR').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
  const u = await env.DB.prepare('SELECT username, name, salt, hash FROM users WHERE username = ?').bind(username).first();
  const ok = u && sameString((await hashPassword(String(b.password || ''), u.salt)).hash, u.hash);
  if (!ok) { await new Promise(r => setTimeout(r, 600)); return json({ error: 'Kullanıcı adı ya da şifre yanlış.' }, 401); }
  return json({ ok: true, token: await newSession(env, u.username), username: u.username, name: u.name });
}
