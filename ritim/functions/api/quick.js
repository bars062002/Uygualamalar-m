import { json as jsonRes } from '../../lib/http.js';
// Kestirme bildirimi düz cümle göstersin: yanıt düz metin (hata da)
const json = (b, status = 200) => new Response(b.message || b.error || (b.ok ? 'Tamam' : 'Hata'), { status, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
void jsonRes;
import { ensureSchema } from '../../lib/auth.js';

// POST /api/quick — iPhone Kestirmeler / Eylem Düğmesi için hızlı ekleme.
// Gövde: {"text": "..."} ya da düz metin.
//   "not …"                      → Notlar'daki "Karalamalar" notunun başına tarihli satır
//   "KSEMR32087 kira görüşmesi"  → saha kodlu görev (ilk kelime harf+rakam ise saha kodu)
//   "yarın 14:30 …" / "bugün …"  → son tarih ve hatırlatma saati
const TZ = 'Europe/Istanbul';
const dayStr = d => new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
const stamp = d => { const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d).map(x => [x.type, x.value])); return `${p.day}.${p.month} ${p.hour}:${p.minute}`; };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const up = s => s.toLocaleUpperCase('tr-TR');

export const onRequestGet = ctx => onRequestPost(ctx);
export async function onRequestPost({ request, env }) {
  // Kişisel kestirme anahtarı: ?k=… (Ritim → Yedekle ve taşı penceresindeki adres)
  const k = new URL(request.url).searchParams.get('k') || '';
  const who = k.length >= 20 ? await env.DB.prepare('SELECT username FROM users WHERE qkey = ?').bind(k).first() : null;
  if (!who) return json({ error: 'Kestirme adresi geçersiz. Ritim → Yedekle ve taşı penceresindeki kişisel adresi kullanın.' }, 401);
  const owner = who.username;
  let text = '';
  const ct = (request.headers.get('content-type') || '').toLowerCase();
  const pick = o => { if (!o || typeof o !== 'object') return ''; const v = o.text ?? o.metin ?? o.input ?? o.not ?? Object.values(o)[0]; return v == null ? '' : String(v); };
  try {
    // Kestirmeler İstek Gövdesi: JSON, Form ya da Dosya/düz metin — hepsi kabul edilir; GET'te ?text=
    if (request.method === 'GET') text = new URL(request.url).searchParams.get('text') || '';
    else if (ct.includes('json')) { const raw = await request.text(); try { const b = JSON.parse(raw); text = typeof b === 'string' ? b : pick(b); } catch { text = raw; } }
    else if (ct.includes('form')) { const f = await request.formData(); text = pick(Object.fromEntries([...f.entries()].filter(([, v]) => typeof v === 'string'))); }
    else text = await request.text();
  } catch { return json({ error: 'Metin okunamadı.' }, 400); }
  // "text=Not+deneme" gibi kodlanmış gövde gelirse çöz
  if (/^(text|metin|input)=/i.test(text)) { try { text = new URLSearchParams(text).get(text.split('=')[0]) || text; } catch {} }
  text = text.trim().slice(0, 2000);
  if (!text) return json({ error: 'Boş metin geldi. Kestirmede “URL İçeriğini Al” → Yöntem POST, İstek Gövdesi JSON, alan text = Dikte Edilen Metin olmalı.' }, 400);

  const now = new Date(), rev = Date.now();
  const note = text.match(/^not(?:\b|(?=[\s:,.-]))[\s:,.-]*([\s\S]+)$/i);
  if (note) {
    const rows = (await env.DB.prepare("SELECT id, data FROM udocs WHERE owner = ? AND col = 'notes' AND data IS NOT NULL").bind(owner).all()).results || [];
    let id = null, doc = null;
    for (const r of rows) { try { const d = JSON.parse(r.data); if (d && d.src === 'scratch') { id = r.id; doc = d; break; } } catch {} }
    const line = `- ${stamp(now)} · ${note[1].trim()}`;
    if (!doc) { id = uid(); doc = { id, title: 'Karalamalar', body: '', site: '', pinned: false, created: now.toISOString(), src: 'scratch' }; }
    doc.body = line + (doc.body ? '\n' + doc.body : ''); doc.updated = now.toISOString();
    await env.DB.prepare('INSERT INTO udocs (owner, col, id, data, rev) VALUES (?, ?, ?, ?, ?) ON CONFLICT (owner, col, id) DO UPDATE SET data = excluded.data, rev = excluded.rev')
      .bind(owner, 'notes', id, JSON.stringify(doc), rev).run();
    return json({ ok: true, kind: 'note', message: 'Not Karalamalar’a eklendi' });
  }

  let rest = text, site = '', due = null, remind = null;
  const sm = rest.match(/^\[?([A-Za-zÇĞİÖŞÜçğıöşü]{2,}[-]?\d{2,}|[A-Za-zÇĞİÖŞÜçğıöşü]{4,6})\]?[\s:,-]+(.+)$/s);
  if (sm && /\d/.test(sm[1]) || (sm && /^\[/.test(rest))) { site = up(sm[1]); rest = sm[2]; }
  const dm = rest.match(/\b(bugün|yarın)\b/i);
  if (dm) { const d = new Date(now); if (/yarın/i.test(dm[1])) d.setDate(d.getDate() + 1); due = dayStr(d); rest = rest.replace(dm[0], ' '); }
  const tm = rest.match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)\b/);
  if (tm) { remind = tm[1].padStart(2, '0') + ':' + tm[2]; if (!due) due = dayStr(now); rest = rest.replace(tm[0], ' '); }
  if (!due) due = dayStr(now);  // tarih söylenmediyse Bugün'e: Pano'da ve listenin üstünde görünür
  const title = rest.replace(/\s+/g, ' ').replace(/^[\s,:-]+|[\s,:-]+$/g, '').slice(0, 140) || text.slice(0, 140);
  const id = uid();
  const task = { id, title, site, cat: 'is', pri: 'med', due, remind, notes: '', star: false, done: false, doneAt: null, repeat: null, subs: [], pomo: 0, createdAt: Date.now(), src: 'quick' };
  await env.DB.prepare('INSERT INTO udocs (owner, col, id, data, rev) VALUES (?, ?, ?, ?, ?)').bind(owner, 'tasks', id, JSON.stringify(task), rev).run();
  return json({ ok: true, kind: 'task', message: `Görev eklendi: ${site ? site + ' · ' : ''}${title}` });
}
