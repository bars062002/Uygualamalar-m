export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export const COLLECTIONS = new Set(['tasks', 'lists', 'focus', 'shop', 'shophist']);
export const ID_RE = /^[A-Za-z0-9_.:-]{1,100}$/;
