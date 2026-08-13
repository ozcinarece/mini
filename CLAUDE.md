# CLAUDE.md — minik

> Bu dosya projenin anayasasıdır. Her oturumda önce bunu oku. Buradaki kararlar tartışılarak alındı; değiştirmeden önce docs/mimari.md'ye bak ve kullanıcıya sor.

## Ürün nedir
minik, bir alışkanlık uygulaması değil — **davranış tasarım motoru**. 10 davranış bilimi kitabının (Clear, Fogg, Duhigg, Steel, Eyal, Moran, McKeown, Newport, McGonigal, Tracy) yöntemlerini tek üründe birleştirir. Ana tez: motivasyon pompalanmaz, kanıt biriktirilir. Kullanıcı günde tek küçük söz verir; tuttuğunda "oy/kanıt" birikir ve kimliği pekişir ("ben okur biriyim").

## Değişmez ilkeler
1. **Azaltma ürünün ruhudur.** "Sana hayır diyebilen uygulama": tek aktif hedef, en fazla 4 haftalık söz, günde en fazla 1 bildirim, "günde 3 dakikan yeter" sözü. Özellik eklerken filtre: bu, azaltma ruhuyla çelişiyor mu?
2. **Suçluluk sözlüğü yasak:** "kaçırdın", "başarısız", "seri bozuldu", "maalesef" hiçbir ekranda geçmez. Kaçırma = veri. Streak yok; oran dili var ("son 30 günde 26 temiz gün").
3. **Soru formu, emir değil:** "2 şınav?" — özerklik esastır. Uygulama önerir, dayatmaz; seviye yükseltmeyi bile sadece önerir.
4. **Topluluk duygudur, mekanik değildir:** feed yok, sohbet yok, profil yok. Kohort tek satır yaşar; sahte kalabalık asla.
5. **Motivasyon push edilmez, tetiklenir:** kıvılcım kartları duruma bağlı, kıtlık kuralı (cooldown) pazarlık edilemez. Kart havuzu küratörlüdür; LLM kart yazamaz (bkz. docs/motivasyon-kutuphanesi.md).

## Davranış motoru (docs/mimari.md — tam hali)
7 arketip; her hedefin mekaniğini arketip belirler:
- 🌱 baslama / 🕰️ duzenlilik / 🐌 erteleme: çapa (istifleme) + günlük damga
- ✂️ birakma / 🤏 azaltma: tetik = istek anı; karşı-hamle tarifi; temiz gün ORAN dili (sayaç değil)
- 🌊 duygu: çapasız; akşam yoklaması (geldi+uyguladım / geldi+uygulayamadım / gelmedi — üçü de suçsuz)
- 🧺 daginik: görev destesi + kullanıcı-pull "iki dakikam var"; kartı SİSTEM seçer; hafta hedefi (gün değil)
Deste kuralları: son 3 kart tekrar gelmez; zorluk-3'ten sonra zorluk-3 gelmez; 3. "başka kart"ta deste düzenleme önerilir; bağlam filtresi opsiyonel.
Veri: data/katalog-daginik.json (24 alt hedef, 173 kart, anahtar kelimeler, kimlik cümleleri). Serbest metin → anahtar kelime eşleşmesi → alt hedef önerisi → kullanıcı seçer.

## Onboarding (v19 akışı)
intro (2 nefes, "geç" hakkı) → "peki — senin için ne değişsin?" (serbest metin + canlı öneri; sınırsız hedef, bekleme listesi) → [birden çok hedefse: neden-tek + seçim] → neden-küçük → mikro/deste → [çapa gerekliyse: neden-çapa + çapa; tetikli arketipte tetik notu] → sözleşme (kimlik cümlesi katalogdan OTOMATİK, kullanıcıya sorulmaz; iki taraflı söz).
Tek hedefte seçim sayfaları atlanır. Tanıma/doz soruları kaldırıldı (ileri faz).

## Tasarım dili: "BOŞLUK" (referans: docs/prototip-v19.jsx)
- Sabah denizi gradyanı zemin; kutu YOK, kart YOK, buton YOK, gölge YOK, üst bar YOK.
- Seçenekler kelimedir; seçilen kalır, diğerleri ~1sn'de solar, akış otomatik ilerler.
- Tek vurgu rengi: kayısı güneş #EEBB8D. Metin #F5F0E4 / #AEC3C6 / #849BA1. Çizgi rgba(245,240,228,.20).
- Tipografi: Marcellus (başlık/serif, tek ağırlık) + Figtree (gövde). Her şey küçük harf.
- İmza metafor: ufuk + güneş. Görev yapılınca güneş 1.6-1.8sn'de doğar. KURAL: metafor sadece büyük anda; veri ekranlarında süs yok, sayı konuşur (Kimlik ekranı: büyük sayı). Liman = gece denizi (nefes alan ay + su yansıması + süzülen dalgalar).
- Animasyonlar yavaş (0.7-1.8sn), prefers-reduced-motion desteklenir. Emoji neredeyse hiç.
- Alanlar: bugün · liman · kimlik (sezon ekranı bilinçli kaldırıldı; haftalık sözler ileride nereye konacak açık soru).

## Teknik kararlar
- **Expo (React Native + TypeScript)**, managed + dev-build. EAS Build (bulut) — geliştirici makinesi YOK, her şey GitHub üzerinden.
- Telefon-only akış: kod GitHub'da; CI = GitHub Actions; her push'ta `eas update` → kullanıcı Expo Go ile test eder. EXPO_TOKEN repo secret'ı.
- Yerel veri: expo-sqlite. Bildirim: expo-notifications (çapa saatli, günde 1). Ses: expo-av (İlk Yardım ses notu, sezonda max 2 çalma). Haptik: expo-haptics (damga anı).
- Faz 2 (şimdi YAPMA): Android UsageStats/interception, iOS ScreenTime (entitlement), widget, kohort backend, LLM koç.
- Kod stili: fonksiyonel bileşenler, tema tokenları tek dosyada (theme.ts), Türkçe kullanıcı metinleri i18n dosyasında (tr.ts) — metinler koda gömülmez.

## MVP kapsamı (sırayla)
1. Onboarding v19 birebir → 2. Bugün: 🌱 damga + 🧺 deste (katalogdan) → 3. Kutlama (güneş doğar + not) → 4. İlk Yardım merdiveni → 5. Liman (nefes + okumalar + kasa) → 6. Kimlik (parametrik sayaç + boş hal) → 7. Bildirim + SQLite kalıcılık → 8. ✂️/🤏/🌊 ekranları.
Yapılmayacaklar (MVP'de): sezon/kohort backend'i, interception, widget, sesli not kaydı UI'ı ötesi.

## Kaynak dosyalar
- docs/prototip-v19.jsx — çalışan referans prototip (tasarım + akış + deste motoru buradan porte edilir)
- docs/mimari.md — motor mimarisi + topluluk katmanı + açık sorular
- docs/motivasyon-kutuphanesi.md — kıvılcım kartları, tetikleyici taksonomisi, kurallar
- data/katalog-daginik.json — 🧺 veri kataloğu (xlsx'in dışa aktarımı; xlsx kullanıcının düzenleme masasıdır)
