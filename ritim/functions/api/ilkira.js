import { json } from '../../lib/http.js';

// İl kira ortalamaları (Site Asistan): kişiye özel güncelleme geçmişi.
// udocs (owner, col 'ilkira', id 'hist') içinde [{ at, date, rows: { il: tutar } }] olarak saklanır; Ritim istemcisi bu koleksiyonu yok sayar.
// GET → { snaps } · POST { date, rows } → yeni kayıt ekler · POST { undo: true } → son kaydı siler. En çok 60 kayıt tutulur.
const IL_RE = /^[A-Za-zÇĞİÖŞÜçğıöşü .'-]{2,30}$/u, D_RE = /^20\d{2}-[01]\d-[0-3]\d$/;
async function load(env, owner) {
  const r = await env.DB.prepare("SELECT data FROM udocs WHERE owner = ? AND col = 'ilkira' AND id = 'hist'").bind(owner).first();
  try { return r && r.data ? JSON.parse(r.data) : []; } catch (_) { return []; }
}
async function store(env, owner, snaps) {
  await env.DB.prepare("INSERT INTO udocs (owner, col, id, data, rev) VALUES (?, 'ilkira', 'hist', ?, ?) ON CONFLICT (owner, col, id) DO UPDATE SET data = excluded.data, rev = excluded.rev")
    .bind(owner, JSON.stringify(snaps), Date.now()).run();
}
export async function onRequestGet({ env, data }) {
  return json({ snaps: await load(env, data.user.username) });
}
export async function onRequestPost({ request, env, data }) {
  const owner = data.user.username;
  let b; try { b = await request.json(); } catch (_) { return json({ error: 'Geçersiz istek.' }, 400); }
  const snaps = await load(env, owner);
  if (b && b.undo) { snaps.pop(); await store(env, owner, snaps); return json({ snaps }); }
  const rows = {};
  for (const [k, v] of Object.entries((b && b.rows) || {})) {
    const n = Math.round(Number(v));
    if (!IL_RE.test(k) || !Number.isFinite(n) || n <= 0 || n > 1e8) return json({ error: 'Geçersiz değer: ' + k }, 400);
    rows[k] = n;
  }
  if (!Object.keys(rows).length || Object.keys(rows).length > 81) return json({ error: 'Kayıtta il yok.' }, 400);
  snaps.push({ at: Date.now(), date: D_RE.test(String(b.date || '')) ? b.date : new Date().toISOString().slice(0, 10), rows });
  snaps.sort((x, y) => (x.date + x.at).localeCompare(y.date + y.at) || x.at - y.at);
  while (snaps.length > 60) snaps.shift();
  await store(env, owner, snaps);
  return json({ snaps });
}
