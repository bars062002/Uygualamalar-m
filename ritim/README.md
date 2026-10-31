# Ritim Görevler · Cloudflare kurulumu

Bu klasör, Ritim görev yöneticisini Cloudflare Pages üzerinde kendi uygulamanız olarak çalıştırır:

- iPhone'da Safari'den **Ana Ekrana Ekle** ile kendi simgesiyle, tam ekran açılır.
- Görevler Cloudflare D1 veritabanında saklanır ve tüm cihazlarınız arasında eşitlenir.
- İnternet yokken de çalışır; değişiklikler bağlantı gelince gönderilir.
- Her kişi kendi hesabını açar (kullanıcı adı + şifre, PBKDF2). Herkes yalnızca kendi görevlerini, notlarını ve listelerini görür (`udocs.owner`).
- Hesaplardan önceki tek kişilik veriler (`docs` tablosu) silinmedi ama hiçbir uçtan okunmaz; o cihazdaki kopya, ilk girişte onayla hesaba aktarılır.
- iPhone Kestirmeleri / Eylem Düğmesi: `POST /api/quick?k=<kişisel anahtar>` gövdesi `{"text": "…"}`. “not …” Notlar'a, diğerleri görev olarak eklenir (başta saha kodu, “yarın 14:30” anlaşılır).

## Klasör yapısı

| Yol | Ne işe yarar |
| --- | --- |
| `public/` | Yayınlanan dosyalar: uygulama, manifest, simgeler, service worker |
| `functions/api/` | Cloudflare Pages Functions: `sync` (okuma) ve `batch` (yazma), `quick` (hızlı ekleme); `_middleware.js` tabloyu hazırlar |
| `lib/http.js` | API için ortak yardımcılar |
| `build.mjs` | `public/index.html` dosyasını depo kökündeki `ritim-gorevler.html`'den üretir |

## Bir kerelik kurulum (yaklaşık 5 dakika)

1. **Pages projesini oluşturun.** Cloudflare panelinde **Workers & Pages → Create → Pages → Connect to Git** yolunu izleyin ve `bars062002/Uygualamalar-m` deposunu seçin.
2. **Derleme ayarları:**
   - Production branch: `main`
   - Framework preset: `None`
   - Build command: *(boş bırakın)*
   - Build output directory: `public`
   - Root directory (Advanced altında): `ritim`

   **Save and Deploy**'a basın. İlk yayın birkaç saniye sürer.
3. **Veritabanını oluşturun.** **Storage & Databases → D1 SQL Database → Create** ile `ritim` adında bir veritabanı açın. Tabloyu uygulama ilk istekte kendisi kurar.
4. **Veritabanını bağlayın.** Pages projenizde **Settings → Bindings → Add → D1 database**:
   - Variable name: `DB`
   - D1 database: `ritim`
5. **Şifreyi belirleyin.** **Settings → Variables and Secrets → Add**:
   - Type: `Secret`
   - Variable name: `APP_PASSWORD`
   - Value: en az 12 karakterlik, tahmin edilmesi zor bir şifre
6. **Yeniden yayınlayın.** **Deployments** sekmesinde son yayının yanındaki menüden **Retry deployment** seçin. Bağlama ve şifre ancak yeni yayından sonra etkin olur.
7. `https://<proje-adı>.pages.dev` adresini açın ve şifrenizle giriş yapın.

## Workers olarak yayınlama (workers.dev)

Bazı ağlar (örneğin şirket ağları) `pages.dev` adreslerini engeller. Aynı uygulama `ritim/worker.js` ve `ritim/wrangler.toml` ile Workers olarak da yayınlanır ve `ritim-app.<hesap>.workers.dev` adresinden açılır. İki sürüm aynı D1 veritabanını kullanır, görevler ortaktır.

1. **Workers & Pages → Create → Continue with GitHub** ile `bars062002/Uygualamalar-m` deposunu seçin.
2. Ayarlar:
   - Project name: `ritim-app` (wrangler.toml içindeki adla aynı olmalı)
   - Build command: *(boş)*
   - Deploy command: `npx wrangler deploy`
   - Path (Root directory): `ritim`
3. **Deploy**'a basın. D1 bağlaması `wrangler.toml` içinde tanımlıdır.
4. Worker'ın **Settings → Variables and Secrets** bölümüne `APP_PASSWORD` adında **Secret** ekleyin.

## iPhone'a ekleme

1. Uygulamanın adresini **Safari**'de açıp giriş yapın.
2. **Paylaş** butonu → **Ana Ekrana Ekle** → **Ekle**.
3. Ana ekrandan açtığınızda bir kez daha giriş yapın; ana ekran uygulamasının hafızası Safari'den ayrıdır.

## Görevleri claude.ai sürümünden taşıma

1. Eski sürümde (claude.ai bağlantısı) kenar çubuğundaki **Yedekle ve taşı → Dışa aktar ve kopyala**'ya basın.
2. Cloudflare sürümünde aynı pencereyi açın, metni yapıştırın ve **İçe aktar**'a basın.

## Uygulamayı güncelleme

Uygulamanın tek kaynağı depo kökündeki `ritim-gorevler.html` dosyasıdır. Değişiklikten sonra şunu çalıştırıp commit edin:

```sh
node ritim/build.mjs
```

`main` dalına her push'ta Cloudflare yeni sürümü otomatik yayınlar.

## Yerelde deneme

```sh
cd ritim
echo "APP_PASSWORD=deneme-sifresi" > .dev.vars
npx wrangler pages dev public --d1 DB=ritim-local
```

`.dev.vars` dosyası `.gitignore` içindedir; depoya gönderilmez.

## Bilinen sınırlar

- Hatırlatıcılar yalnızca uygulama açıkken çalışır; telefona bildirim göndermez.
- Aynı görevi iki cihazda aynı anda düzenlerseniz en son kaydedilen geçerli olur.
