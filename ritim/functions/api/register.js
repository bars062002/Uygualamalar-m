import { json } from '../../lib/http.js';
import { USER_RE, hashPassword, newSession, randomKey } from '../../lib/auth.js';

// POST /api/register {username, password, name} → yeni hesap ve oturum
export async function onRequestPost({ request, env }) {
  let b; try { b = await request.json(); } catch { return json({ error: 'Geçersiz istek.' }, 400); }
  const username = String(b.username || '').trim().toLocaleLowerCase('tr-TR').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
  const password = String(b.password || ''), name = String(b.name || '').trim().slice(0, 60);
  if (!USER_RE.test(username)) return json({ error: 'Kullanıcı adı 3–32 karakter olmalı; harf, rakam, nokta, alt çizgi ya da tire kullanın.' }, 400);
  if (password.length < 6) return json({ error: 'Şifre en az 6 karakter olmalı.' }, 400);
  if (await env.DB.prepare('SELECT 1 FROM users WHERE username = ?').bind(username).first()) return json({ error: 'Bu kullanıcı adı alınmış.' }, 409);
  const { salt, hash } = await hashPassword(password);
  await env.DB.prepare('INSERT INTO users (username, name, salt, hash, qkey, created) VALUES (?, ?, ?, ?, ?, ?)').bind(username, name || username, salt, hash, randomKey(24), Date.now()).run();
  return json({ ok: true, token: await newSession(env, username), username, name: name || username });
}
