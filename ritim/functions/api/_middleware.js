import { json } from '../../lib/http.js';

// /api istekleri: D1 bağlamasını ve tabloyu hazırlar. Şifre istenmez.
let schemaReady = false;

export async function onRequest({ request, env, next }) {
  if (!env.DB) return json({ error: 'D1 veritabanı bağlı değil. Pages ayarlarında DB adıyla bir D1 bağlaması ekleyin.' }, 500);
  // Şifre kaldırıldı (kullanıcının isteğiyle): uygulama ve API girişsiz çalışır.

  if (!schemaReady) {
    await env.DB.batch([
      env.DB.prepare('CREATE TABLE IF NOT EXISTS docs (col TEXT NOT NULL, id TEXT NOT NULL, data TEXT, rev INTEGER NOT NULL, PRIMARY KEY (col, id))'),
      env.DB.prepare('CREATE INDEX IF NOT EXISTS docs_rev ON docs (rev)'),
    ]);
    schemaReady = true;
  }
  return next();
}
