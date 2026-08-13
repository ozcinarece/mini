# BASLANGIC.md — telefondan sıfıra kurulum

Lokal makine yok; üç oyuncu var: **GitHub** (kodun evi), **Claude Code** (ellerin), **Expo Go + EAS** (test ve derleme). Sıra:

## 1 · Hazırlık (telefonda, ~10 dk, bir kere)
1. github.com → yeni **private repo**: `mini` (boş, README'siz).
2. Bu paketteki dosyaları repoya yükle: repo sayfası → Add file → Upload files (mobil tarayıcıda "Masaüstü sitesi iste" gerekebilir). CLAUDE.md köke; data/ ve docs/ klasör yapısıyla.
3. expo.dev → ücretsiz hesap aç → Account Settings → Access Tokens → token oluştur.
4. GitHub repo → Settings → Secrets and variables → Actions → New secret: `EXPO_TOKEN` = az önceki token.
5. Telefona **Expo Go** uygulamasını indir (App Store / Play).

## 2 · İlk Claude Code oturumu
Claude uygulamasından Claude Code oturumu aç, `mini` reposuna bağla ve şu komutu yapıştır:

---
CLAUDE.md'yi ve docs/ altındaki dosyaları oku. Sonra:
1. Bu repoda Expo (TypeScript) projesi kur: `npx create-expo-app@latest . --template blank-typescript` (mevcut CLAUDE.md, data/, docs/ dosyalarını koru).
2. Paketleri ekle: expo-notifications, expo-sqlite, expo-haptics, expo-av, expo-updates. EAS'i başlat: `npx eas init` ve `eas update:configure`.
3. `.github/workflows/eas-update.yml` oluştur: main'e her push'ta `eas update --branch preview --auto` çalışsın (EXPO_TOKEN secret'ı ile, node 20, `npx expo install --fix` sonrası).
4. `src/theme.ts` (BOŞLUK tokenları) ve `src/i18n/tr.ts` dosyalarını CLAUDE.md'deki kurallara göre kur.
5. İlk ekran olarak docs/prototip-v19.jsx'teki intro + onboarding akışını React Native'e porte etmeye başla (web'e özgü kısımları — CSS keyframes vb. — Animated/Reanimated ile karşıla). MVP sırası CLAUDE.md'de.
6. Her anlamlı adımda commit + push at.
---

## 3 · Test döngüsü (her seferinde)
Push → Actions `eas update`'i yayınlar → telefonda Expo Go → hesabınla giriş → minik projesi → preview branch'ini aç. Kod değişti mi, Expo Go'da yenile. (Native modül eklendiğinde bir kez `eas build --profile development` gerekir — Claude Code'a "development build al" demen yeter; link telefona gelir, kurarsın.)

## 4 · Çalışma ritmi önerisi
- Her oturuma "CLAUDE.md'yi oku" ile başlamana gerek yok — Claude Code otomatik okur; ama büyük karar değişikliklerini CLAUDE.md'ye işlemesini iste.
- Veri düzenleme: xlsx senin masan; değişince Claude Code'a "xlsx'ten katalog-daginik.json'u yeniden üret" de (script'i ilk seferde yazdır: `scripts/katalog-export`).
- Dal disiplini: küçük işler doğrudan main; riskli denemeler `deneme/...` dalında, Expo Go'da ayrı branch olarak test edilebilir.

## 5 · Bilinen sınırlar (şaşırma)
- Expo Go bildirimleri kısıtlı gösterebilir; bildirim işi ciddileşince development build'e geçilir (yukarıdaki tek komut).
- iOS mağaza çıkışı için Apple Developer hesabı ($99/yıl) gerekecek — MVP testinde gerekmez.
- Actions'ta ilk `eas update` çalışması 3-5 dk sürer; sabır.
