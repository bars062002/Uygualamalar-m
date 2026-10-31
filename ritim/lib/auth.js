// Ritim hesapları: kullanıcı adı + şifre (PBKDF2), oturum anahtarı, kişiye ayrılmış belgeler.
const enc = new TextEncoder();
const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64 = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
export const randomKey = (n = 32) => b64(crypto.getRandomValues(new Uint8Array(n)));
export const sha = async s => b64(await crypto.subtle.digest('SHA-256', enc.encode(s)));
export const USER_RE = /^[a-z0-9._-]{3,32}$/;

export async function hashPassword(password, saltB64) {
  const salt = saltB64 ? unb64(saltB64) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100000 }, key, 256);
  return { salt: b64(salt), hash: b64(bits) };
}
export function sameString(a, b) {
  if (a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

let schemaReady = false;
export async function ensureSchema(env) {
  if (schemaReady) return;
  await env.DB.batch([
    env.DB.prepare('CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, name TEXT, salt TEXT NOT NULL, hash TEXT NOT NULL, qkey TEXT, created INTEGER)'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, username TEXT NOT NULL, created INTEGER)'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS udocs (owner TEXT NOT NULL, col TEXT NOT NULL, id TEXT NOT NULL, data TEXT, rev INTEGER NOT NULL, PRIMARY KEY (owner, col, id))'),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS udocs_rev ON udocs (owner, rev)'),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS users_qkey ON users (qkey)'),
  ]);
  schemaReady = true;
}
export async function newSession(env, username) {
  const token = randomKey(32);
  await env.DB.prepare('INSERT INTO sessions (token, username, created) VALUES (?, ?, ?)').bind(await sha(token), username, Date.now()).run();
  return token;
}
export async function userFromToken(env, token) {
  if (!token || token.length < 20) return null;
  const row = await env.DB.prepare('SELECT u.username, u.name FROM sessions s JOIN users u ON u.username = s.username WHERE s.token = ?').bind(await sha(token)).first();
  return row || null;
}
export const bearer = request => { const a = request.headers.get('authorization') || ''; return a.startsWith('Bearer ') ? a.slice(7).trim() : ''; };
