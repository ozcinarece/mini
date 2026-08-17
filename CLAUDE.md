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


## BAHÇE KATMANI (2026-08 eklendi — oyunlaştırma vizyonu)
Uygulamaya izometrik bir bahçe metası ekleniyor: görevler bahçeyi büyütür. Referans: docs/bahce-ekonomi-prototip.jsx (oynanabilir), stil referansı kullanıcının Gemini üretimleri (assets/bahce/), üretim listesi docs/bahce-varlik-listesi.md.

### Ekonomi anayasası (pazarlıksız kurallar)
1. **İki para:** 🌰 tohum = görevden gelir (her "yaptım" +2, günün ilki +1 bonus; tavan 5 görevle uyumlu), canlıya harcanır. 🪙 para = SADECE hasattan gelir, dekora/ağaca/alan açmaya harcanır.
2. **Hasat kuralı:** sebze hasadı ektiğin tohumu AYNEN geri verir + üstüne para kârı (ör. domates 6🌰 → hasatta 6🌰 + 4🪙). Çiçekler kalıcı güzellik (hasat edilmez), dekorlar kalıcı süs.
3. **Zaman değil emek büyütür:** bitkiler yalnız "yaptım" ile aşama atlar (tohum→filiz→ara→olgun). Bekleme sayacı, gerçek-zaman zamanlayıcı YASAK.
4. **Sulama mekaniği YOK; görev = su.** ~2 gün hiç kanıt yoksa bitkiler UYUR (💤 solgun), ölmez; ilk görevle hep birden uyanır. Ceza/kayıp dili yasak.
5. **Tohum verilmez, seçilir:** kullanıcı dükkândan kendi alır. Hediye tohum yalnız nadir anlarda: haftalık sandık, hoş geldin, mevsim kutlaması.
6. **Sıralı açılış:** dükkân sade başlar (ayçiçeği + domates + 2 ucuz dekor). Yeni türler toplam kanıt eşikleriyle açılır (lavanta 15, kuş banyosu 25, kabak 30...). Kilitliler dükkânda "🔒 12/15 kanıt" ilerlemesiyle GÖRÜNÜR (hedef hissi). Gül yalnız sandıktan.
7. **Haftalık sandık:** 7 günün 5'inde en az bir kanıt → sandık (+para + nadir tohum). ORAN dili, seri değil; 2 gün kaçırma hakkı baştan var.
8. **Bölge açma:** bahçe küçük başlar; yabani-otlu kilitli bölgeler parayla açılır (orta vadeli hedef).
9. **Paket-tohum bağı (v2, MVP'de YAPMA):** koleksiyon rozetleri üzerinden ("30 kitap görevi → altın ayçiçeği"); katı tür kilidi asla.

### Görsel üretim hattı
İskelet ve sahne kodu (izo karolar, derinlik sıralama, ekim/büyüme/hasat) koddadır; bitki/dekor görselleri kullanıcının Gemini (nano banana) üretimi PNG sprite'lardır. Bitkiler ÖNDEN dik sprite, zemine yayılanlar (gölet, yol, çit, köprü) İZO perspektif üretilir. Arka plan temizleme scripti scripts/ altında tutulur.

### Bahçe MVP sırası
1. İzo sahne + ekim/büyüme/hasat (prototipten porte) → 2. iki cüzdan + dükkân (kilit eşikleriyle) → 3. "yaptım" entegrasyonu (mevcut bugün ekranı bahçeyi besler) → 4. haftalık sandık → 5. uyku/uyanma → 6. bölge açma. Sprite'lar hazır oldukça SVG yer-tutucular değişir.


## ONBOARDING v2 — "bahçe anlatısı" (2026-08, uygulama baştan)
Referans: docs/bahce-onboarding-prototip.jsx. Akış: kapı ("burası senin bahçen") → renk-alan bağı (sarı=düzen, kırmızı=gelişim, mavi=huzur, mor=odak, turuncu=minik işler) → güvence ("çiçek ölmez, uyur" — kategori seçiminden ÖNCE verilir) → kategori seçimi: ana+alt kategoriler akordeon, yanında CANLI bahçe önizlemesi (seçtikçe o rengin kümesi belirir; "ister tek alana yoğunlaş ister hepsine — bahçe senin") → hoş geldin hediyesi: seçilen her alandan 1 tohum otomatik ekilir, filizler önizlemede → nasıl çalışır (3 satır: 🌙 günlük hedef=tohum · 💧 mini iş=o alanın çiçeği sulanır · 🧺 topla=dekor) → ses tercihi (tavan 5 notu) → "işte bahçen" + ilk görev daveti.
Kurallar: ekran başına tek fikir, dokun-geç ritmi, ilerleme çizgisi üstte, "geri" hep var. Tüm görseller Gemini üretimi; yaşayan liste: docs/bahce-varlik-listesi.md (26-40 arası onboarding/UI kalemleri).

## UYGULAMA KARARLARI (2026-08-17 — bahçe portu, kod tarafı)
1. **Su akışı MVP yorumu:** çiçekler kategori-bazlı sulanır (görevin ailesi); **sebzeler ortak ailedir** — her kategorinin görevi sular. Bitki+aşama bazlı su dizisi backoffice config'iyle gelecek.
2. **Kategori temel çiçekleri:** ayçiçeği=düzen · gelincik=gelişim · unutma beni=huzur · menekşe=odak · kadife=işler. Hepsi kod-çizimi yer tutucu (src/components/bahce/varliklar.tsx); assets/bahce/ sprite'ları geldikçe yalnız bu dosya değişir, arayüz (varlik+asama) sabittir.
3. **Bildirim MVP modeli:** seçili alt kategorilerin komutları tek havuz; ses tercihi adede çevrilir (günde1→1, 2-3→3, hiç→0), pencere gün boyu 09–21, günler her gün. Komut-başına varyant/pencere/gün backoffice config'ine ertelendi; v28 kurulum sihirbazı (gün/pencere ayarı) da o fazda geri gelir.
4. **MVP dışı bırakılanlar:** haftalık sandık, uyku/uyanma, paket-tohum bağı (sırada). Bölge açma (40 🪙) dahil edildi.
5. **Cüzdan 0🌰/0🪙 başlar;** hoş geldin hediyesi ekili filizlerdir (her seçili alandan 1).
6. **Tasarım dili:** bahçe ekranları bahçe dilini konuşur (açık zemin #F6FAEE, Baloo 2 + Nunito, hap butonlar — src/theme.ts `bahce` tokenları). BOŞLUK tokenları duruyor; eski v28 BOŞLUK ekranları koddan kaldırıldı (git geçmişinde).
7. Yer tutucu SVG'lerde animasyon yok (pop/sway sprite fazında ele alınacak).

## BACKOFFICE (yönetim paneli)
Referans: docs/backoffice-prototip.jsx. Mimari: panel tek bir data/oyun-config.json düzenler; uygulama ondan beslenir. Bölümler: panel(metrik) · paketler&görevler(kimlik/renk/aile, yoklama sorusu, komut CRUD) · ek görevler(haftalık/özel/mevsimlik ödüller) · bahçe kataloğu(tip/aile/fiyat/aşama/💧su-aşama dizisi/gelir/eşik/sprite durumu) · ekonomi(tüm sayılar + kilitli ilkeler) · ilerleme&bölgeler · bildirimler · dışa aktar.
Kritik kurallar: (1) 💧 SU KATEGORİYE AKAR — görev hangi paketten geldiyse o ailenin bitkilerini büyütür, aile boşsa depoya. (2) Su gereksinimi bitki+aşama bazlı yönetilir (su dizisi) + kademe başına ek su parametresi. (3) BİLDİRİMLER GÖREV BAZLI: her komutun kendi metin varyantları (rotasyonlu), penceresi ve günleri panelden girilir; varyant yoksa yedek şablon. Panel ayarları kullanıcının kurulumuyla KESİŞTİRİLİR, asla genişletmez; tavan 5 delinemez. (4) Yasak-sözlük linter'ı tüm metin alanlarında canlı.
