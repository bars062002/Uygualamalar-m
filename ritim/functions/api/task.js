import { json } from '../../lib/http.js';

// POST /api/task (oturum) — başka bir uygulamadan (Site Asistan › Kira Takip) tek görev ekler.
// Gövde: { title, site?, due? (YYYY-AA-GG), remind? (SS:DD), notes?, ref? }
// ref verilirse aynı kaynaktan ikinci görev açılmaz; mevcut görev döner.
const D_RE = /^20\d{2}-[01]\d-[0-3]\d$/, T_RE = /^([01]\d|2[0-3]):[0-5]\d$/, REF_RE = /^[A-Za-z0-9:._-]{1,80}$/;
const TZ = 'Europe/Istanbul';
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
export async function onRequestPost({ request, env, data }) {
  const owner = data.user.username;
  let b; try { b = await request.json(); } catch (_) { return json({ error: 'Geçersiz istek.' }, 400); }
  const title = String(b.title || '').replace(/\s+/g, ' ').trim().slice(0, 140);
  if (!title) return json({ error: 'Görev başlığı boş.' }, 400);
  const site = String(b.site || '').trim().toUpperCase().slice(0, 20);
  const due = D_RE.test(String(b.due || '')) ? b.due : today();
  const remind = T_RE.test(String(b.remind || '')) ? b.remind : null;
  const notes = String(b.notes || '').slice(0, 2000);
  const ref = REF_RE.test(String(b.ref || '')) ? String(b.ref) : '';
  const id = ref ? 'ref-' + ref.replace(/[^A-Za-z0-9_-]/g, '_') : Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  if (ref) {
    const ex = await env.DB.prepare("SELECT data FROM udocs WHERE owner = ? AND col = 'tasks' AND id = ? AND data IS NOT NULL").bind(owner, id).first();
    if (ex) { try { const t = JSON.parse(ex.data); if (!t.done) return json({ ok: true, existed: true, task: t }); } catch (_) {} }
  }
  const task = { id, title, site, cat: 'is', pri: 'high', due, remind, notes, star: false, done: false, doneAt: null, repeat: null, subs: [], pomo: 0, createdAt: Date.now(), src: String(b.src || 'sa').slice(0, 20), ref };
  await env.DB.prepare('INSERT INTO udocs (owner, col, id, data, rev) VALUES (?, ?, ?, ?, ?) ON CONFLICT (owner, col, id) DO UPDATE SET data = excluded.data, rev = excluded.rev')
    .bind(owner, 'tasks', id, JSON.stringify(task), Date.now()).run();
  return json({ ok: true, task });
}
