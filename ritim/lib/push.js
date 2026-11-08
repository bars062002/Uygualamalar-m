// Web Push (RFC 8291 aes128gcm + RFC 8292 VAPID) — yalnız WebCrypto, dış kütüphane yok.
// VAPID anahtarı sunucuda bir kez üretilir ve D1'de (meta) saklanır; özel anahtar hiçbir yere gönderilmez.
const enc = new TextEncoder();
export const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export const unb64u = s => Uint8Array.from(atob(String(s).replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((String(s).length + 3) % 4)), c => c.charCodeAt(0));
const cat = (...a) => { const n = a.reduce((x, y) => x + y.length, 0), o = new Uint8Array(n); let i = 0; for (const x of a) { o.set(x, i); i += x.length; } return o; };
async function hmac(key, data) { const k = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); return new Uint8Array(await crypto.subtle.sign('HMAC', k, data)); }

const SUBJECT = 'https://ritim-app.brsakpnr.workers.dev';
let vapidCache = null;
export async function vapid(env) {
  if (vapidCache) return vapidCache;
  let row = await env.DB.prepare("SELECT v FROM meta WHERE k = 'vapid'").first();
  if (!row) {
    const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
    const jwk = await crypto.subtle.exportKey('jwk', kp.privateKey);
    const pub = b64u(await crypto.subtle.exportKey('raw', kp.publicKey));
    await env.DB.prepare("INSERT OR IGNORE INTO meta (k, v) VALUES ('vapid', ?)").bind(JSON.stringify({ jwk, pub })).run();
    row = await env.DB.prepare("SELECT v FROM meta WHERE k = 'vapid'").first();
  }
  const { jwk, pub } = JSON.parse(row.v);
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  vapidCache = { key, pub };
  return vapidCache;
}
async function vapidAuth(env, endpoint) {
  const { key, pub } = await vapid(env);
  const aud = new URL(endpoint).origin;
  const h = b64u(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const c = b64u(enc.encode(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 3600, sub: SUBJECT })));
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(h + '.' + c));
  return `vapid t=${h}.${c}.${b64u(sig)}, k=${pub}`;
}
// Yük şifreleme (aes128gcm, tek kayıt)
export async function encrypt(payload, p256dh, authSecret) {
  const ua = unb64u(p256dh), auth = unb64u(authSecret);
  const eph = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPub = new Uint8Array(await crypto.subtle.exportKey('raw', eph.publicKey));
  const uaKey = await crypto.subtle.importKey('raw', ua, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, eph.privateKey, 256));
  const prkKey = await hmac(auth, shared);
  const ikm = await hmac(prkKey, cat(enc.encode('WebPush: info\0'), ua, asPub, new Uint8Array([1])));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const prk = await hmac(salt, ikm);
  const cek = (await hmac(prk, cat(enc.encode('Content-Encoding: aes128gcm\0'), new Uint8Array([1])))).slice(0, 16);
  const nonce = (await hmac(prk, cat(enc.encode('Content-Encoding: nonce\0'), new Uint8Array([1])))).slice(0, 12);
  const key = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, cat(enc.encode(payload), new Uint8Array([2]))));
  const rs = new Uint8Array([0, 0, 16, 0]); // 4096
  return cat(salt, rs, new Uint8Array([asPub.length]), asPub, ct);
}
// Bir aboneliğe gönder. Dönüş: HTTP durumu (404/410 → abonelik geçersiz). Hata gövdesi sendPush.lastReason'da.
export async function sendPush(env, sub, msg, ttl = 86400) {
  const body = await encrypt(JSON.stringify(msg), sub.p256dh, sub.auth);
  const r = await fetch(sub.endpoint, { method: 'POST', body, headers: {
    'content-encoding': 'aes128gcm', 'content-type': 'application/octet-stream', ttl: String(ttl), urgency: 'normal',
    ...(msg.tag ? { topic: String(msg.tag).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32) } : {}),
    authorization: await vapidAuth(env, sub.endpoint) } });
  sendPush.lastReason = r.status >= 300 ? (await r.text().catch(() => '')).slice(0, 160) : '';
  if (r.status >= 300) console.log('push reddedildi', r.status, new URL(sub.endpoint).host, sendPush.lastReason);
  return r.status;
}
/* Abonelik kalıcı olarak geçersiz mi? 404/410 her zaman; 403 + anahtar uyuşmazlığı (abonelik başka bir VAPID anahtarıyla açılmış) */
export const deadSub = (st, why) => st === 404 || st === 410 || (st === 403 && /mismatch|VapidPkHash|ExpiredSubscription/i.test(why || ''));

// ---------- Zamanlanmış bildirimler (her dakika) ----------
// Türkiye saati (UTC+3, yaz saati yok)
const trNow = () => { const d = new Date(Date.now() + 3 * 3600e3); return { ymd: d.toISOString().slice(0, 10), hm: d.toISOString().slice(11, 16), min: d.getUTCHours() * 60 + d.getUTCMinutes() }; };
const dayDiff = (a, b) => Math.round((Date.parse(a) - Date.parse(b)) / 864e5);
const DIGEST_MIN = 8 * 60 + 30; // 08:30
async function once(env, k) {
  const r = await env.DB.prepare('INSERT OR IGNORE INTO push_log (k, at) VALUES (?, ?)').bind(k, Date.now()).run();
  return !!(r.meta && r.meta.changes);
}
async function deliver(env, subs, msg) {
  const res = [];
  for (const s of subs) {
    let st = 0;
    for (let i = 0; i < 2 && !(st >= 200 && st < 300) && st !== 404 && st !== 410; i++) {  // geçici ağ hatasında bir kez daha dene
      try { st = await sendPush(env, s, msg); } catch (e) { st = -1; console.log('push ağ hatası', String(e && e.message || e)); }
    }
    if (deadSub(st, sendPush.lastReason)) await env.DB.prepare('DELETE FROM push_subs WHERE endpoint = ?').bind(s.endpoint).run();
    res.push(st);
  }
  return res;
}
// Son gönderim durumu (Ayarlar'da gösterilir): meta 'ps:<kullanıcı>'
export async function note(env, owner, kind, info) {
  try {
    const k = 'ps:' + owner; const row = await env.DB.prepare('SELECT v FROM meta WHERE k = ?').bind(k).first();
    const cur = row ? JSON.parse(row.v) : {}; cur[kind] = { at: Date.now(), ...info };
    await env.DB.prepare('INSERT INTO meta (k, v) VALUES (?, ?) ON CONFLICT (k) DO UPDATE SET v = excluded.v').bind(k, JSON.stringify(cur)).run();
  } catch (e) { console.log('durum kaydı', String(e)); }
}
export async function pushStatus(env, owner) {
  const row = await env.DB.prepare('SELECT v FROM meta WHERE k = ?').bind('ps:' + owner).first();
  const n = await env.DB.prepare('SELECT COUNT(*) AS n FROM push_subs WHERE owner = ?').bind(owner).first();
  return { devices: (n && n.n) || 0, ...(row ? JSON.parse(row.v) : {}) };
}
export async function runSchedule(env) {
  const now = trNow();
  const all = (await env.DB.prepare('SELECT endpoint, owner, p256dh, auth, prefs, contracts FROM push_subs').all()).results || [];
  if (!all.length) return;
  const byOwner = new Map(); for (const s of all) { if (!byOwner.has(s.owner)) byOwner.set(s.owner, []); byOwner.get(s.owner).push(s); }
  for (const [owner, subs] of byOwner) {
    const digest = now.min >= DIGEST_MIN && now.min < DIGEST_MIN + 30;
    /* her dakika çalışır: özet saati dışında yalnız bugünün saatli görevleri okunur */
    const rows = (await (digest
      ? env.DB.prepare("SELECT id, data FROM udocs WHERE owner = ? AND col = 'tasks' AND data IS NOT NULL").bind(owner)
      : env.DB.prepare("SELECT id, data FROM udocs WHERE owner = ? AND col = 'tasks' AND data IS NOT NULL AND json_extract(data, '$.due') = ? AND json_extract(data, '$.remind') IS NOT NULL").bind(owner, now.ymd)).all()).results || [];
    const tasks = rows.map(r => { try { return Object.assign(JSON.parse(r.data), { id: r.id }); } catch { return null; } }).filter(t => t && !t.done && !t.sample);
    // 1) Saatli hatırlatmalar: bugün, saati gelmiş (son 30 dk içinde) ve daha önce gönderilmemiş
    for (const t of tasks) {
      if (t.due !== now.ymd || !/^\d\d:\d\d$/.test(t.remind || '')) continue;
      const [h, m] = t.remind.split(':').map(Number); const at = h * 60 + m;
      if (at > now.min || now.min - at > 30) continue;
      if (!(await once(env, `t:${owner}:${t.id}:${t.due}:${t.remind}`))) continue;
      const st = await deliver(env, subs, { title: '⏰ ' + String(t.title || 'Görev').slice(0, 80), body: [t.remind, t.site].filter(Boolean).join(' · '), tag: 't' + t.id, url: './?m=rt' });
      console.log('hatırlatma', owner, t.remind, st.join(','));
      await note(env, owner, 'remind', { title: String(t.title || '').slice(0, 60), time: t.remind, status: st });
    }
    // 2) Sabah özeti 08:30: bugünün ve gecikenlerin sayısı + 7 gün içinde biten sözleşmeler
    if (digest && await once(env, `d:${owner}:${now.ymd}`)) {
      const today = tasks.filter(t => t.due === now.ymd).length, late = tasks.filter(t => t.due && t.due < now.ymd).length;
      let con = []; for (const s of subs) { try { const c = JSON.parse(s.contracts || '[]'); if (c.length > con.length) con = c; } catch {} }
      const soon = con.map(c => ({ ...c, d: dayDiff(c.b, now.ymd) })).filter(c => c.d >= 0 && c.d <= 7).sort((a, b) => a.d - b.d);
      const parts = [];
      if (today || late) parts.push(`${today} görev bugün${late ? `, ${late} gecikmiş` : ''}`);
      if (soon.length) parts.push(`${soon.length} sözleşme 7 gün içinde bitiyor: ` + soon.slice(0, 4).map(c => `${c.k} (${c.d ? c.d + ' gün' : 'bugün'})`).join(', ') + (soon.length > 4 ? '…' : ''));
      /* Söylenecek bir şey olmasa da özet gelir: sistemin çalıştığı her sabah görünür */
      const body = parts.length ? parts.join('\n') : 'Bugün için planlı ya da geciken görev yok. 7 gün içinde biten sözleşme yok.';
      const st = await deliver(env, subs, { title: 'Günaydın · Günün özeti', body, tag: 'ozet', url: './?m=home' });
      console.log('günün özeti', owner, now.ymd, now.hm, st.join(','));
      await note(env, owner, 'digest', { ymd: now.ymd, time: now.hm, status: st, empty: !parts.length });
    }
    // 3) Sözleşme bitişine 90 / 60 / 30 gün kala ayrı bildirim (sabah özetiyle aynı saatte, günde bir kez)
    if (digest && await once(env, `c:${owner}:${now.ymd}`)) {
      let con = []; for (const s of subs) { try { const c = JSON.parse(s.contracts || '[]'); if (c.length > con.length) con = c; } catch {} }
      const seen = new Set(), hit = { 30: [], 60: [], 90: [] };
      con.forEach(c => { const d = dayDiff(c.b, now.ymd); if (hit[d] && !seen.has(c.k + c.b)) { seen.add(c.k + c.b); hit[d].push(c); } });
      for (const d of [30, 60, 90]) {
        const L = hit[d]; if (!L.length) continue;
        const body = L.slice(0, 5).map(c => `${c.k}${c.a ? ' · ' + c.a : ''}`).join('\n') + (L.length > 5 ? `\n+${L.length - 5} sözleşme daha` : '');
        const st = await deliver(env, subs, { title: `${L.length} sözleşme ${d} gün sonra bitiyor`, body, tag: 'bitis' + d, url: './?m=kt' });
        console.log('bitiş hatırlatması', owner, d, L.length, st.join(','));
        await note(env, owner, 'contract', { days: d, n: L.length, status: st });
      }
    }
  }
  // eski kayıtları temizle (14 gün) — saatte bir
  if (now.min % 60 === 0) await env.DB.prepare('DELETE FROM push_log WHERE at < ?').bind(Date.now() - 14 * 864e5).run();
}
