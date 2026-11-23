# Ritim — çalışma notları

## Tasarım ve arayüz: UI UX Pro Max (zorunlu)
Arayüzü, görünümü ya da etkileşimi etkileyen her işte `.claude/skills/ui-ux-pro-max` becerisini kullan:
- Başlamadan `SKILL.md`'yi oku; denetimde `references/quick-reference.md` kurallarını uygula.
- Kontrol listesi: kontrast ≥ 4.5:1, dokunma alanı ≥ 44×44 px, giriş yazısı ≥ 16 px, emoji yerine çizgi simge,
  görünür odak çerçevesi, `prefers-reduced-motion`.

## Hareket ve dokunma: Apple Design (zorunlu)
Kaydırma, sürükleme, alt panel, yay animasyonu, basma geri bildirimi ya da geçiş içeren her işte `.claude/skills/apple-design` becerisini oku ve uygula (kaynak: github.com/emilkowalski/skills, MIT).
- Yay ekrandaki değerden başlar, parmağın hızını devralır; hareket hâlindeki öğe yakalanabilir.
- Karar konuma değil gidiş yönüne göre (momentum izdüşümü, d≈0,99); sınırda lastik direnç.
- Varsayılan yay sönüm 1,0 (sekmesiz); sekme yalnız fiskeden sonra (sönüm ≈0,8, tepki 0,3).
- Geri bildirim basışta anında; geri alınabilir işlemde "Geri al" bildirimi; "hareketi azalt" ve "saydamlığı azalt" ayarlarına uy.

## Site Asistan içindeki görünüm (16–17 Kasım 2026 kararları)
- Site Asistan'daki tema adı artık **Nöromorfik** (eski "Ritim" teması); bu uygulamanın adı "Ritim" olarak kalır.
- Bölüm sekmeleri (`.embed-nav`): ekrana sığan tek gömülü şerit, 6 eşit bölme, kaydırma yok; telefonda Görevler→Görev, Alışveriş→Sepet.
- Seçili bölüm Site Asistan'ın seçili/birincil rengiyle aynı düz dolgu; renk ev sahibinden `accHex` ile gelir (paletin tepe tonu ya da seçili vurgu).
- Nöromorfik + palet: yüzeyler nöromorfik gri kalır, yalnız vurgu/veri rengi değişir.

## Simetri ve tutarlı düzen (kullanıcı talebi, 17 Kasım 2026 — her işte zorunlu)
- **Sık düzen (23 Kasım 2026, kullanıcı kararı):** bilgisayarda hiçbir liste satırı tam genişliğe yayılmaz. Satırlar sık kartlara dönüşür ve ekran genişledikçe 2–3 sütuna dizilir (`repeat(auto-fill,minmax(300–420px,1fr))`); özet ve liste kartları yan yana. Kartın içinde bilgi ile düğmeler birbirine yakın durur (ör. Sahada OK / NOK yan yana, kartın altında). Yeni ekranda da sorulmadan uygulanır.
- Kullanıcı için simetri ve tutarlı tasarım "çok çok önemli": yeni özellik ya da özelleştirme ne kadar iyi olursa olsun mevcut tasarım diline ve düzene uymalı.
- Boş kalan alan bırakma: bir sütun kısa kalıyorsa içerik yan yana dizilir ya da alanı dolduracak şekilde yerleşir (ör. aday ayrıntısında fotoğraf + harita bilgi kartının altında yan yana, aynı boyda).
- Yan yana öğeler aynı boyda, aynı köşe yarıçapında, aynı aralıkla; hizalar ortak çizgide biter.
- Her işten önce ve sonra ekranı bilgisayar ve telefon boyutunda gözle kontrol et; asimetri, boşluk, tutarsız düğme/kart görünümü varsa sorulmadan düzelt ve kullanıcıya söyle.

## Proje kuralları
- Tek kaynak `ritim-gorevler.html`; değişiklikten sonra `node ritim/build.mjs` ile `ritim/public/index.html` üretilir (ikisi birlikte commit edilir).
- Ritim, Site Asistan içinde `?embed=1` ile iframe olarak açılır; `html.embed` kuralları orada geçerlidir.
- Ana dala birleştirince Cloudflare Workers Builds `ritim-app`'i yayınlar.
- Commit/PR'larda model adı geçmez.

## Yayın düzeni (kullanıcı onayı, 13 Kasım 2026)
- Değişiklikler dalda birikir; **günde en çok bir kez** ya da kullanıcı "yayınla" deyince ana dala birleştirilir (her sürüm, kurum ağında ~16 sn ilk açılış beklemesine yol açıyor).
- Uygulamayı bozan acil düzeltmeler hemen yayınlanabilir; kullanıcıya bildirilir.
- Her yayından önce kullanıcıya değişiklik listesi ve sürüm numarası verilir.
- PR açma ve birleştirme için ayrıca onay istenmez (kullanıcının kalıcı talimatı).
