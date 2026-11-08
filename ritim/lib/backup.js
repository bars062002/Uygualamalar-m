// Haftalık otomatik yedek: her kullanıcının tüm belgeleri (görev, not, liste, alışveriş…) pazar 03:00'te
// sıkıştırılıp D1'e yazılır; son 4 yedek tutulur. Kullanıcı Ritim › Yedekle ve taşı'dan indirebilir.
const KEEP = 4, MAX = 1900 * 1000;
const trNow = () => { const d = new Date(Date.now() + 3 * 3600e3); return { ymd: d.toISOString().slice(0, 10), min: d.getUTCHours() * 60 + d.getUTCMinutes(), dow: d.getUTCDay() }; };
async function gz(str) { const s = new Blob([str]).stream().pipeThrough(new CompressionStream('gzip')); return new Uint8Array(await new Response(s).arrayBuffer()); }
export async function gunzip(buf) { const s = new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip')); return await new Response(s).text(); }
export async function backupOwner(env, owner) {
  const rows = (await env.DB.prepare('SELECT col, id, data FROM udocs WHERE owner = ? AND data IS NOT NULL').bind(owner).all()).results || [];
  const at = Date.now(), json = JSON.stringify({ v: 1, app: 'ritim', owner, at, docs: rows.map(r => ({ col: r.col, id: r.id, data: JSON.parse(r.data) })) });
  const data = await gz(json);
  if (data.length > MAX) { console.log('yedek çok büyük', owner, data.length); return null; }
  await env.DB.batch([
    env.DB.prepare('INSERT OR REPLACE INTO backups (owner, at, size, n, data) VALUES (?, ?, ?, ?, ?)').bind(owner, at, data.length, rows.length, data.buffer),
    env.DB.prepare('DELETE FROM backups WHERE owner = ? AND at NOT IN (SELECT at FROM backups WHERE owner = ? ORDER BY at DESC LIMIT ?)').bind(owner, owner, KEEP),
  ]);
  return { at, size: data.length, n: rows.length };
}
export async function runBackup(env) {
  const now = trNow();
  if (now.dow !== 0 || now.min < 180 || now.min >= 190) return;   // pazar 03:00–03:10
  const owners = (await env.DB.prepare('SELECT DISTINCT owner FROM udocs').all()).results || [];
  for (const { owner } of owners) {
    const r = await env.DB.prepare('INSERT OR IGNORE INTO push_log (k, at) VALUES (?, ?)').bind(`bk:${owner}:${now.ymd}`, Date.now()).run();
    if (!(r.meta && r.meta.changes)) continue;
    try { const b = await backupOwner(env, owner); console.log('haftalık yedek', owner, b && b.n, b && b.size); } catch (e) { console.log('yedek hatası', owner, String(e)); }
  }
}
