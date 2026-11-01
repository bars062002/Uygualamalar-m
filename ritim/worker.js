// Workers entry point: the same app and API as the Pages project, for hosting on workers.dev.
// Static files come from ./public; /api requests reuse the Pages Functions handlers.
import { onRequest as guard } from './functions/api/_middleware.js';
import { onRequestGet as sync } from './functions/api/sync.js';
import { onRequestPost as batch } from './functions/api/batch.js';
import { onRequestPost as quick } from './functions/api/quick.js';
import { onRequestPost as register } from './functions/api/register.js';
import { onRequestPost as login } from './functions/api/login.js';
import { onRequestGet as meGet, onRequestPost as mePost } from './functions/api/me.js';
import { onRequestPost as claim } from './functions/api/claim.js';
import { onRequestPost as filePost, onRequestGet as fileGet, onRequestDelete as fileDel } from './functions/api/file.js';
import { json } from './lib/http.js';

const routes = { 'GET /api/sync': sync, 'POST /api/batch': batch, 'POST /api/quick': quick, 'POST /api/register': register, 'POST /api/login': login, 'GET /api/me': meGet, 'POST /api/me': mePost, 'POST /api/claim': claim, 'POST /api/file': filePost, 'GET /api/file': fileGet, 'DELETE /api/file': fileDel };

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (!pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    const handler = routes[`${request.method} ${pathname}`];
    const ctx = { request, env, data: {} };
    ctx.next = () => (handler ? handler(ctx) : json({ error: 'Bulunamadı.' }, 404));
    return guard(ctx);
  },
};
