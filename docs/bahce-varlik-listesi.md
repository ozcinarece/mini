# Bahçe · Gemini varlık üretim listesi

Stil referansı: kullanıcının ürettiği büyük bahçe görseli (her üretimde AYNI sohbette referans olarak ekle).
Kural: her varlık TEK TEK, düz krem zeminde (#F5F0E4), yüksek çözünürlük. Prompt kalıbı:
"Using this image as exact style reference (same line art, colors, top-left lighting): [VARLIK], isolated on a plain solid cream background, centered, no text."

## Önden (dik sprite) — bitkiler
Her bitki için ek prompt: "...shown in 4 growth stages side by side: seed mound, small sprout, closed bud/green stage, full grown."
1. ayçiçeği (4 aşama) — başlangıç çiçeği
2. lale (4 aşama)
3. lavanta (4 aşama) — 15 kanıt eşiği
4. gül (4 aşama) — haftalık sandık ödülü ✨
5. domates (4 aşama, son aşama kırmızı meyveli) — başlangıç sebzesi
6. kabak (4 aşama) — 30 kanıt eşiği
7. havuç sırası (4 aşama)
8. papatya (4 aşama)

## İzo perspektif — zemine yayılanlar
Ek prompt: "...drawn in isometric view, 45-degree angle from above, matching the ground perspective of the reference garden."
9. çim karosu (2 ton) + toprak karosu + taş yol karosu
10. gölet (nilüfer + sazlarla, 2 boy)
11. ahşap köprü
12. çit parçası (düz + köşe)
13. yabani ot karosu (kilitli bölge için, 2-3 varyasyon)

## Önden — dekor & yapılar
14. büyük ağaç · 15. elma ağacı (meyveli/meyvesiz 2 hal) · 16. çalı (çiçekli)
17. bank · 18. kuş banyosu (25 kanıt eşiği) · 19. kuş evi (direkli)
20. fener (ışıklı) · 21. arı kovanı · 22. saksı/testi seti · 23. sulama kabı · 24. taş grubu · 25. mantar ailesi

## İşleme hattı
Üret → buraya yükle veya Claude'a gönder → arka plan otomatik temizlenir (kırpma scripti: scripts/sprite-temizle) → assets/bahce/ altına PNG → iskelet sahneye bağlar.


## ONBOARDING & UI GÖRSELLERİ (yaşayan liste — geliştirdikçe buraya eklenir)
Referans akış: docs/bahce-onboarding-prototip.jsx

### Kapak & anlatı
26. KAPAK: olgun, ışıl ışıl "hedef bahçe" sahnesi (E1 kapı ekranı + mağaza görseli) — mevcut büyük bahçe kullanılabilir
27. BAŞLANGIÇ bahçesi: aynı arsa, boş/mütevazı hali (onboarding sonu "işte bahçen")
28. UYUYAN çiçek yakın plan: boynu bükük + 💤, şefkatli (güvence ekranı)
29. Renk-aile tanıtım görselleri: sarı/kırmızı/mavi/mor/turuncu çiçek KÜMESİ, her renkten tek görsel (E2)

### Kategori renk aileleri (çiçek setleri — her aileden 2-3 tür, 4 büyüme aşamalı)
30. SARI (düzen & tertip): ayçiçeği ✓, papatya, sarı lale
31. KIRMIZI (gelişim): gül, kırmızı lale, gerbera
32. MAVİ (huzur & hareket): nilüfer, mavi kardelen, mavi yıldız çiçeği
33. MOR (zihin & odak): lavanta, mor sümbül
34. TURUNCU (minik işler): kadife çiçeği, turuncu gerbera

### UI parçaları
35. tohum kesesi ikonu 🌰 · para kesesi 🪙 · su damlası/depo göstergesi 💧
36. haftalık sandık: kapalı + açılmış (ışık saçan) 2 hal
37. dükkân raf arka planı (ahşap, sıcak)
38. boş kare "ekim işareti" (toprakta ışıldayan yuva)
39. kademe yıldızı/ışıltı parçacıkları (K3 tarhlar için)
40. uygulama ikonu adayları: tek çiçekli minik ada, 2-3 varyasyon
