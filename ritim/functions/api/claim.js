import { json } from '../../lib/http.js';

// POST /api/claim — hesaplardan önceki tek kişilik Ritim verisini (docs) bu hesaba bir kez kopyalar.
// İlk talep eden hesap sahiplenir; sonra kimse alamaz. Eski tablo silinmez.
export async function onRequestPost({ env, data: ctx }) {
  const owner = ctx.user.username;
  const done = await env.DB.prepare("SELECT v FROM meta WHERE k = 'legacy_owner'").first();
  if (done) return json({ error: done.v === owner ? 'Önceki veriler zaten hesabına aktarıldı.' : 'Önceki veriler başka bir hesaba aktarılmış.' }, 409);
  const set = await env.DB.prepare("INSERT OR IGNORE INTO meta (k, v) VALUES ('legacy_owner', ?)").bind(owner).run();
  if (!set.meta || !set.meta.changes) return json({ error: 'Önceki veriler başka bir hesaba aktarılmış.' }, 409);
  const rev = Date.now();
  const r = await env.DB.prepare(
    'INSERT INTO udocs (owner, col, id, data, rev) SELECT ?, col, id, data, ? FROM docs WHERE data IS NOT NULL ' +
    'ON CONFLICT (owner, col, id) DO NOTHING').bind(owner, rev).run();
  return json({ ok: true, copied: (r.meta && r.meta.changes) || 0 });
}
