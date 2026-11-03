# Ritim — çalışma notları

## Tasarım ve arayüz: UI UX Pro Max (zorunlu)
Arayüzü, görünümü ya da etkileşimi etkileyen her işte `.claude/skills/ui-ux-pro-max` becerisini kullan:
- Başlamadan `SKILL.md`'yi oku; denetimde `references/quick-reference.md` kurallarını uygula.
- Kontrol listesi: kontrast ≥ 4.5:1, dokunma alanı ≥ 44×44 px, giriş yazısı ≥ 16 px, emoji yerine çizgi simge,
  görünür odak çerçevesi, `prefers-reduced-motion`.

## Proje kuralları
- Tek kaynak `ritim-gorevler.html`; değişiklikten sonra `node ritim/build.mjs` ile `ritim/public/index.html` üretilir (ikisi birlikte commit edilir).
- Ritim, Site Asistan içinde `?embed=1` ile iframe olarak açılır; `html.embed` kuralları orada geçerlidir.
- Ana dala birleştirince Cloudflare Workers Builds `ritim-app`'i yayınlar.
- Commit/PR'larda model adı geçmez.
