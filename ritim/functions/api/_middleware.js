import { json } from '../../lib/http.js';
import { ensureSchema, userFromToken, bearer } from '../../lib/auth.js';

// Her /api isteği: tabloyu hazırlar; kayıt/giriş dışındaki istekler bir oturum ister.
// Herkes yalnızca kendi belgelerini görür (udocs.owner = kullanıcı adı).
const OPEN = new Set(['/api/register', '/api/login', '/api/quick']);

export async function onRequest(ctx) {
  const { request, env, next } = ctx;
  if (!env.DB) return json({ error: 'D1 veritabanı bağlı değil.' }, 500);
  await ensureSchema(env);
  const path = new URL(request.url).pathname;
  if (OPEN.has(path)) return next();
  const user = await userFromToken(env, bearer(request));
  if (!user) { await new Promise(r => setTimeout(r, 300)); return json({ error: 'Oturum açın.', auth: true }, 401); }
  ctx.data = ctx.data || {}; ctx.data.user = user;
  return next();
}
