import { json } from '../../lib/http.js';

// Every /api request must carry the app password (set as the APP_PASSWORD secret in Cloudflare).
const enc = new TextEncoder();
let schemaReady = false;

async function sameSecret(a, b) {
  const [x, y] = await Promise.all([a, b].map(s => crypto.subtle.digest('SHA-256', enc.encode(s))));
  const u = new Uint8Array(x), v = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < u.length; i++) diff |= u[i] ^ v[i];
  return diff === 0;
}

export async function onRequest({ request, env, next }) {
  if (!env.DB) return json({ error: 'D1 veritabanı bağlı değil. Pages ayarlarında DB adıyla bir D1 bağlaması ekleyin.' }, 500);
  if (!env.APP_PASSWORD) return json({ error: 'APP_PASSWORD tanımlı değil. Pages ayarlarında şifreli bir değişken olarak ekleyin.' }, 500);

  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token || !(await sameSecret(token, env.APP_PASSWORD))) {
    await new Promise(r => setTimeout(r, 500));
    return json({ error: 'Şifre yanlış.' }, 401);
  }

  if (!schemaReady) {
    await env.DB.batch([
      env.DB.prepare('CREATE TABLE IF NOT EXISTS docs (col TEXT NOT NULL, id TEXT NOT NULL, data TEXT, rev INTEGER NOT NULL, PRIMARY KEY (col, id))'),
      env.DB.prepare('CREATE INDEX IF NOT EXISTS docs_rev ON docs (rev)'),
    ]);
    schemaReady = true;
  }
  return next();
}
