# CLAUDE.md — minik

> Projenin anayasası. Her oturumda önce bunu oku. **Vizyon 2026-08'de pivot yaptı** (aşağıda); eski akıllı-motor mimarisi docs/arsiv/'dedir ve UYGULANMAZ.

## Ürün nedir (FINAL VİZYON — "paketler")
minik, kontrolü tamamen kullanıcıda olan, huzurlu bir **paket-bazlı hatırlatıcı + kanıt biriktirici**dir.
- Kullanıcı sınırlı sayıda küratörlü **paket**ten seçer: ev düzeni · kitap okuma · su & hareket · ekran molası · minik işler · kendi paketim.
- Her pakette hazır **komutlar** vardır (data/katalog-daginik.json'dan damıtılır); kullanıcı komut çıkarabilir, kendi komutunu ekleyebilir.
- Kullanıcı **hangi günler**, **günde kaç kez** (GLOBAL GÜNLÜK TAVAN: 5 — pazarlık edilemez), **hangi saat aralığında** (tek pencere VEYA gün-bazlı pencere: her gün için sabah 08–12 / gün boyu 09–21 / akşam 18–23) bildirim istediğini seçer.
- Bildirimler havuzdan rotasyonla gelir (son 3 komut tekrar etmez). **Tarife kullanıcıya asla ajanda gibi gösterilmez** — saat listesi, sıra, plan ekranı YOK. Bugün ekranı çek-esaslıdır.
- **"yaptım" = +1 kanıt**: güneş doğar, sayaç büyür. "şimdi olmadı" = sıfır suçluluk, komut sonra tekrar denenir.

## Referans prototip: docs/prototip-v28.jsx (birebir kaynak)
Ekranlar: intro (2 nefes: "küçük bir söz için yer vardır" + "burada kontrol sende") → Kurulum sihirbazı (paket → komut düzenleme → günler → adet [kalan tavan kadar seçenek] → pencere [+ gün bazlı] → özet) → alanlar: **bugün · geçmiş · paketler · kimlik**.
- bugün: güneş + "iki dakikam var" (havuzdan komut çeker) + yaptım/şimdi olmadı + "ara ara ben de seslenirim — saatlerini dert etme" satırı.
- geçmiş: son 14 gün, günde 1 nokta/kanıt (maks 5), bugün parlak; oran dili ("14 günün 11'inde..."); kapanış: "boş günler kayıp değil — sadece sessiz."
- paketler: abonelik listesi, sessize al/aç, günlük ses sayacı (X/5), + yeni paket.
- kimlik: "sen sözünü tutan birisin." + büyük kanıt sayısı; boş hal: "şimdilik bu bir iddia... bugüne git".

## Değişmez ilkeler (pivotta korunanlar)
1. Suçluluk sözlüğü yasak ("kaçırdın/başarısız/seri bozuldu" asla). Boş gün = sessiz gün.
2. Azaltma ruhu: tavan 5; "fazla ses, sesi görünmez yapar." Uygulama tutundurma için yalvarma/dark pattern kullanmaz.
3. Metafor kuralı: güneş/ufuk yalnız büyük anlarda (yaptım, özet); veri ekranında süs yok, sayı konuşur.
4. Tasarım dili "BOŞLUK": sabah denizi gradyanı; kutu/kart/buton/gölge/üst bar YOK; seçenekler kelimedir (seçilen kalır, diğerleri solar); Marcellus + Figtree; hep küçük harf; animasyon 0.7–1.8sn; tek vurgu #EEBB8D. Tokenlar: src/theme.ts.
5. Çoklu seçim asla gömülmez — kendi ekranını/halkalı desenini alır.
6. Kullanıcı metinleri src/i18n/tr.ts'te; koda gömülmez.

## Teknik (değişmedi)
Expo RN+TS, telefon-only akış: push → GitHub Actions eas-update → Expo Go. Bildirim: expo-notifications (tarifeyi pencere içine eşit dağıt + hafif rastgelelik; kullanıcıya saat gösterme). Veri: expo-sqlite (abonelikler, günlük kanıt sayları, komut havuz durumu). Haptik: yaptım anında.

## MVP sırası (yeni)
1. Kurulum sihirbazı (v28 birebir) → 2. bugün (çek + yaptım + kanıt) → 3. bildirim motoru (tarife üretimi, rotasyon, tavan) → 4. SQLite kalıcılık → 5. geçmiş → 6. paketler yönetimi → 7. kimlik.
Mevcut src/ dosyaları eski vizyondan kalanlar içerebilir (engine/arketip, screens/Onboarding vb.) — v28'e göre sadeleştir/uyarla; kullanılmayanları sil.

## Kaynaklar
docs/prototip-v28.jsx (REFERANS) · data/katalog-daginik.json (ev & minik işler komut kaynağı) · docs/motivasyon-kutuphanesi.md (bildirim metni tonu için) · docs/arsiv/ (eski motor — uygulama, sadece tarih)
