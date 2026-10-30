// Builds ritim/public/index.html from ../ritim-gorevler.html (the single source of the app).
// Run from the repository root:  node ritim/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
let page = readFileSync(join(here, '..', 'ritim-gorevler.html'), 'utf8');

const SORTABLE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.0/Sortable.min.js';
if (!page.includes(SORTABLE_CDN)) throw new Error('Sortable script tag not found in ritim-gorevler.html');
page = page.replace(SORTABLE_CDN, '/vendor/Sortable.min.js');

const head = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="description" content="Görevler, takvim, hatırlatıcılar ve odak zamanlayıcısı.">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" type="image/png" href="/icons/icon-192.png">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Ritim">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="theme-color" content="#e4e5e9" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#26272c" media="(prefers-color-scheme: dark)">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);color-scheme:light}body{margin:0}img{max-width:100%}</style>
</head>
<body>
`;

writeFileSync(join(here, 'public', 'index.html'), head + page + '\n</body>\n</html>\n');
console.log('ritim/public/index.html yazıldı');
