import { json } from '../../lib/http.js';
import { hashPassword, sameString, sha, bearer } from '../../lib/auth.js';

// Dosyalarım kilidi: hesap şifresiyle 15 dakikalık açma anahtarı.
//   POST /api/vault-unlock { password } → { v, exp }
// Anahtar oturum anahtarına bağlıdır (sunucuda saklanmaz): v = "exp.imza", imza = sha(oturum|vault|exp).
export const VAULT_TTL = 15 * 60 * 1000;
export const vaultSig = (token, exp) => sha(token + '|vault|' + exp);
export async function vaultOk(request) {
  const v = String(request.headers.get('x-vault') || ''), i = v.indexOf('.');
  if (i < 1) return false;
  const exp = Number(v.slice(0, i)), sig = v.slice(i + 1);
  if (!Number.isFinite(exp) || exp < Date.now() || exp > Date.now() + VAULT_TTL + 60000) return false;
  return sameString(await vaultSig(bearer(request), exp), sig);
}

export async function onRequestPost({ request, env, data }) {
  let b; try { b = await request.json(); } catch { return json({ error: 'Geçersiz istek.' }, 400); }
  const u = await env.DB.prepare('SELECT salt, hash FROM users WHERE username = ?').bind(data.user.username).first();
  const ok = u && sameString((await hashPassword(String(b.password || ''), u.salt)).hash, u.hash);
  if (!ok) { await new Promise(r => setTimeout(r, 700)); return json({ error: 'Şifre yanlış.' }, 401); }
  const exp = Date.now() + VAULT_TTL;
  return json({ ok: true, v: exp + '.' + await vaultSig(bearer(request), exp), exp });
}
