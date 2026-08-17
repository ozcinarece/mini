# Animasyon Rehberi — bahçe nasıl canlanır

Strateji: statik Gemini sprite + 4 katman. Kaynak demo: (sohbetteki animasyon-atolyesi) — tüm event animasyonları dönüşüm+parçacıkla kanıtlandı.
RN uygulaması: react-native-reanimated (dönüşümler) + gerekirse @shopify/react-native-skia (parçacık yoğunluğu artarsa). Lottie/Spine KULLANMA (araç zinciri telefon-only akışa uymaz). prefers-reduced-motion her animasyonda kontrol edilir.

## Katman 1 — Dönüşüm animasyonları (kod, tüm bitki/dekorlar)
Sprite HEP dipten sabitlenir: transformOrigin/anchor = alt-orta. Kurallar:
- rüzgar (idle): rotate ±2.2°, süre 3.8–5.9s, HER bitkiye rastgele faz+hız (koro yasak, meltem hedef). Küçük bitki hızlı, büyük yavaş.
- ekim: scale 0 → 1.18 → 0.94 → 1, ~0.8s, yaylı eğri (tek zıplama, jöle değil).
- sulama sevinci: squash&stretch scale(1.06,.92)→(.96,1.07), 0.7s + tepeden düşen tek damla (kod çizimi, 0.8s).
- dokunma (gıdık): rotate -4°→3° + hafif squash, 0.5s — bitkiye dokununca kişilik hissi.
- HASAT (v2 — durum sprite'lı koreografi): silkele (0.45s) → ÜRÜN/BAŞ sprite'ları kopar (2-3 adet, kademeli 0.12s arayla), önce yukarı kavis sonra CÜZDANA uçar (bezier, 1.05s, küçülerek), kese zıplar (+ödül) → gövde çöker-solar (0.5s) + toprak tozu parçacıkları → yeni kademe filizi zıplayarak doğar. GEREKLİ VARLIK: her hasatlanabilir bitkinin "kopmuş ürün/çiçek başı" sprite'ı (tekil, şeffaf).
- SOLMA/UYKU (v2 — çift sprite): sağlıklı ↔ SOLGUN sprite çapraz-solması (1.6s) + boyun bükme rotate 9° (1.8s) + düşen tek yaprak (zigzag, 2.2s) + süzülen 💤 döngüsü. Uyanış: sıcak ışık parlaması (1.1s) + doğrulma + sevinç esnemesi. GEREKLİ VARLIK: her bitkinin olgun halinin "solgun versiyonu" (baş düşük, taçlar kapalı, soluk renkler).
- kademe K3 ışıltısı: 2-3 altın nokta, yavaş parlayıp sönme (2.6s döngü).

## Katman 2 — Parçacıklar (kod)
- hasat patlaması: 5 renkli nokta, dipten yukarı yelpaze, 0.9s, kademeli gecikme (0.05s).
- ödül yazısı: "+4 🌰" yukarı süzülüp solma, 1s.
- su damlası, ışıltı, uçan tohum → hepsi kod. Görsel varlık İSTEMEZ.

## Katman 3 — İki-kare flipbook (Gemini üretimi, SADECE şunlar)
- kelebek: kanat açık / kapalı (2 kare) — bahçede rastgele süzülür (yol: kod).
- sandık: kapalı / açık-ışıklı (2 kare) + kod ışıltısı.
- gölet su parıltısı: 2 kare yansıma varyasyonu (opsiyonel; kod shimmer da yeter).
Prompt eki: "two frames side by side, identical except [FARK], same style, cream background".

## Katman 4 — Katmanlı sprite (P2 cilası, amiral bitkiler)
Ayçiçeği/gül için gövde ve baş AYRI üretilir; baş, gövdeden bağımsız +1° ekstra salınır (derinlik hissi). MVP'de yapılmaz.

## Sahne kuralları
- Aynı anda en fazla 1 event animasyonu + idle'lar. Event sırasında o bitkinin idle'ı durur.
- Ekran dışı bitkilerin idle'ı durdurulur (pil).
- Tüm süreler ve eğriler tek dosyada: src/animasyon.ts (token gibi).
