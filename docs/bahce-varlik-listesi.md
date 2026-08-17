# Bahçe & Uygulama · Gemini Varlık Üretim Listesi (YAŞAYAN DOKÜMAN)

> Her üretimde stil referansını (büyük bahçe görseli) AYNI sohbete ekle. Tek tek üret, düz krem zemin (#F5F0E4), yüksek çözünürlük, no text.
> Prompt kalıpları en altta. Durum: ⬜ bekliyor · 🟡 üretildi, temizlenecek · ✅ repoda (assets/bahce/)

## 🔴 P1 — MVP BAŞLANGIÇ SETİ (bunlar olmadan bahçe açılmaz, ~15 üretim)
| # | varlık | tip | not | durum |
|---|--------|-----|-----|-------|
| 1 | ayçiçeği · 4 aşama | önden | sarı aile amiral gemisi | 🟡 (tek hali var) |
| 2 | papatya · 4 aşama | önden | sarı, ucuz başlangıç | ⬜ |
| 3 | gül · 4 aşama | önden | kırmızı aile + sandık ödülü | ⬜ |
| 4 | nilüfer · 3 aşama | önden/su | mavi aile | ⬜ |
| 5 | lavanta · 4 aşama | önden | mor aile | ⬜ |
| 6 | kadife çiçeği · 4 aşama | önden | turuncu aile | ⬜ |
| 7 | domates · 4 aşama | önden | ilk sebze (hasat ekonomisi) | ⬜ |
| 8 | çim karosu (2 ton) + toprak karosu | izo | zemin seti | ⬜ |
| 9 | yabani ot karosu · 2 varyasyon | izo | kilitli bölge | ⬜ |
| 10 | çit parçası (düz + köşe) | izo | ilk dekor | ⬜ |
| 11 | fener (ışıklı) | önden | ilk premium dekor | ⬜ |
| 12 | KAPAK: olgun hedef bahçe | sahne | onboarding E1 + mağaza | ✅ (eldeki büyük bahçe) |
| 13 | BAŞLANGIÇ bahçesi (aynı arsa, boş) | sahne | onboarding sonu | ⬜ |
| 14 | uyuyan çiçek yakın plan (💤 şefkatli) | sahne | güvence ekranı | ⬜ |
| 15 | uygulama ikonu · 2-3 aday | ikon | tek çiçekli minik ada | ⬜ |

## 🟠 P2 — ZENGİNLEŞTİRME (ilk sürümden sonra, ~12 üretim)
16. sarı lale · kırmızı lale · gerbera (aile çeşitliliği, 4'er aşama)
17. mavi kardelen · mor sümbül · turuncu gerbera
18. kabak · havuç sırası (sebze çeşitliliği)
19. gölet (2 boy) + ahşap köprü (izo)
20. büyük ağaç · elma ağacı (meyveli/meyvesiz)
21. bank · kuş banyosu · kuş evi · çalı
22. taş yol karosu + taş grubu + mantar ailesi

## 🟡 P3 — CİLA & UI (kod-çizimi de idare eder, Gemini güzelleştirir)
23. haftalık sandık: kapalı + açılmış (ışık saçan)
24. tohum kesesi · para kesesi · su damlası/depo ikonları
25. dükkân raf arka planı (ahşap sıcak)
26. ekim işareti (toprakta ışıldayan yuva) · kademe ışıltı parçacıkları
27. renk-aile tanıtım kümeleri (5 renk, onboarding E2)
28. mevsim varyasyonları (sonbahar yaprakları, kış örtüsü — çok ileri)

## PROMPT KALIPLARI
**Bitki (4 aşama):** "Using this image as exact style reference (same line art, colors, top-left lighting): a [ÇİÇEK], shown in 4 growth stages side by side — seed mound, small sprout with two leaves, budding stage, full bloom. Isolated on a plain solid cream background (#F5F0E4), centered, no text."
**İzo zemin/dekor:** "...: a [VARLIK], drawn in isometric view, 45-degree angle from above, matching the ground perspective of the reference garden. Plain cream background, no text."
**Sahne:** "...: [SAHNE TARİFİ]. Wide composition, plain cream background outside the diorama, no characters, no text."

## İŞLEME HATTI
Gemini'de üret → Claude'a/repoya gönder → arka plan temizlenir + kırpılır (scripts/sprite-temizle) → assets/bahce/[aile]/[ad]-[asama].png → kod bağlar → bu tabloda durum güncellenir.
