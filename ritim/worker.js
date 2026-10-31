// Workers entry point: the same app and API as the Pages project, for hosting on workers.dev.
// Static files come from ./public; /api requests reuse the Pages Functions handlers.
import { onRequest as guard } from './functions/api/_middleware.js';
import { onRequestGet as sync } from './functions/api/sync.js';
import { onRequestPost as batch } from './functions/api/batch.js';
import { onRequestPost as quick } from './functions/api/quick.js';
import { json } from './lib/http.js';

const routes = { 'GET /api/sync': sync, 'POST /api/batch': batch, 'POST /api/quick': quick };

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (!pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    const handler = routes[`${request.method} ${pathname}`];
    return guard({
      request,
      env,
      next: () => (handler ? handler({ request, env }) : json({ error: 'Bulunamadı.' }, 404)),
    });
  },
};
