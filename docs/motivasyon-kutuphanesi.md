# Davranış OS · Motivasyon İçerik Kütüphanesi v0.1

> Temel ilke: içerik push edilmez, **tetiklenir**. Her kart bir duruma bağlıdır, risk profiline göre seçilir, kıtlık kuralıyla korunur.
> Not: Kitap içerikleri birebir alıntı değil, Türkçe **uyarlama/özet** olarak yazılmıştır (telif + ton tutarlılığı).

---

## 1 · İçerik veri modeli

Her kart tek bir JSON kaydıdır:

```json
{
  "id": "clear-iki-kez-01",
  "tip": "cumle | hikaye | veri_kaniti | kendi_sesi | kasa",
  "tetikleyici": "ilk_kacirma",
  "risk_profili": ["beklenti", "genel"],
  "kaynak": "Atomik Alışkanlıklar",
  "metin": "...",
  "cooldown_gun": 45,
  "oncelik": 2,
  "sezon_penceresi": null
}
```

- **cooldown_gun:** aynı kart bu süre geçmeden tekrar gösterilmez (kıtlık ilkesi).
- **oncelik:** aynı tetikleyicide birden fazla aday varsa seçim sırası; eşitse risk profili eşleşmesi kazanır.
- **sezon_penceresi:** bazı kartlar sadece belirli haftalarda anlamlı (ör. vadi kartları hafta 3–5).

---

## 2 · Tetikleyici taksonomisi

| Kod | Durum | Sıklık tahmini |
|---|---|---|
| `onboarding_mikro` | Kullanıcı mikro hedef adımında | 1× |
| `onboarding_kimlik` | Kimlik cümlesi yazılırken | 1× |
| `ilk_damga` | İlk oy damgası | 1× |
| `seri_3` | 3 gün üst üste damga | seyrek |
| `seri_7` | 7 gün üst üste damga | seyrek |
| `ilk_kacirma` | 1 gün kaçtı (sessizlik sonrası, 2. gün sabahı) | orta |
| `ikinci_kacirma` | 2. gün de kaçtı, mikro-mikro öneriyle birlikte | orta |
| `teshis_sonrasi` | Teşhis motoru reçete üretti | orta |
| `geri_donus` | Kaçırma serisinden sonra ilk damga | orta |
| `hedef_buyutme` | Kullanıcı tarifi büyütmeye çalıştı | orta |
| `shield_acilis` | Hedef uygulama açıldı (level 4) | sık |
| `vadi_uyarisi` | Hafta 3 başı, proaktif | 1×/sezon |
| `vadi_ici` | Hafta 3–5 arasında skor düşüşü | seyrek |
| `hafta_ritueli` | Pazar ritüeli açılışı | haftalık |
| `sezon_orta` | Hafta 6 mini retro | 1×/sezon |
| `sezon_sonu` | Hafta 12 raporu | 1×/sezon |
| `kilit_acilis` | 2. hedef hakkı kazanıldı | seyrek |

---

## 3 · Ana matris: tetikleyici × risk profili → kaynak

Hücre = o durumda o profile hangi kitabın sesi konuşur.

| Tetikleyici | Beklenti riski | Değer riski | Gecikme riski | Dürtüsellik riski |
|---|---|---|---|---|
| `onboarding_mikro` | **Fogg** (küçüklük) | Clear (kimlik) | Fogg | Fogg |
| `ilk_kacirma` | **Clear** (iki kez kuralı) | Clear | **Steel** (ödül yakınlaştır) | Eyal |
| `ikinci_kacirma` | **Fogg** (mikro-mikro) | **Duhigg** (Lisa hikayesi) | Steel | **Eyal** (ortam) |
| `hedef_buyutme` | **Fogg** | Fogg | Moran (12 hafta sabrı) | Fogg |
| `shield_acilis` | — | Clear (oy metaforu) | Steel (şimdi vs sonra) | **Eyal** (10 dk kuralı) |
| `vadi_uyarisi` | **Clear** (bıkkınlık vadisi) | **Clear** (British Cycling) | Moran (skor, sonuç değil) | Newport (sıkılma toleransı) |
| `hafta_ritueli` | Moran | **McKeown** (neyi yapmayacaksın) | Moran | McKeown |
| `sezon_sonu` | Clear (oy toplamı) | Clear (kimlik kanıtı) | Moran (retro) | Eyal (ekran verisi) |

Kalın olanlar varsayılan; profil eşleşmezse "genel" havuzdan seçilir.

---

## 4 · Çekirdek kart seti (seed ~35 kart)

### `onboarding_mikro`
1. *(Fogg)* "Bir davranışı kalıcı yapmak istiyorsan önce onu gülünç derecede küçült. Küçüklük zayıflık değil, tasarım."
2. *(Fogg)* "Motivasyon dalga gibidir; gelir ve gider. Küçük hedef, dalga çekildiğinde bile ayakta kalır."
3. *(Clear)* "Hedefini %1 küçültmek, %100 bırakmaktan iyidir."

### `onboarding_kimlik`
4. *(Clear)* "Hedef kitap bitirmek değil; okur olmak. Davranış, kimliğin gölgesidir."
5. *(Clear)* "Sorulacak soru 'ne başarmak istiyorum' değil, 'kim olmak istiyorum'."

### `ilk_damga`
6. *(Fogg)* "Şu an hissettiğin şey var ya — beynin onu tekrar isteyecek. Alışkanlığı kablolayan tekrar değil, bu duygu."
7. *(Clear)* "İlk oy atıldı. Sandık artık boş değil."

### `seri_3` / `seri_7`
8. *(Clear)* "Her tekrar, olmak istediğin kişiye atılmış bir oy. Üç gün, üç oy."
9. *(Duhigg)* "Küçük kazanımlar zincir kurar; her biri bir sonrakinin kapısını aralar."
10. *(Clear, seri_7)* "Bir hafta oldu. Artık 'deniyorum' değil, 'yapıyorum' diyebilirsin."

### `ilk_kacirma`
11. *(Clear, genel+beklenti)* "Asla iki kez üst üste kaçırma. Bir hata kazadır; iki hata yeni bir alışkanlığın başlangıcıdır."
12. *(Steel, gecikme)* "Ödül çok uzakta hissediliyorsa sorun sende değil, mesafede. Bugün yaparsan damga hemen burada."
13. *(Fogg)* "Kaçan gün veridir, suç değil. Sistem tam da bunun için var."

### `ikinci_kacirma`
14. *(Fogg, beklenti)* "Bugün sadece kıyafeti giy. Evet, sadece o. Sayılır — çünkü zincirin halkası davranış değil, karar."
15. *(Duhigg, değer — hikaye kartı)* "Lisa Allen sigarayı, borcu ve kiloyu tek alışkanlıkla devirdi: koşu. Tek bir kilit alışkanlık, dominonun ilk taşıdır. Seninki bu."
16. *(Eyal, dürtüsellik)* "İrade savaşı kaybedilir; ortam savaşı kazanılır. Bu akşam telefonu başka odaya koy, gerisini tarifin halleder."

### `hedef_buyutme`
17. *(Fogg)* "Coşku bugünün hediyesi, yarının borcu. Tarifi büyütme — taşarsa zaten yaparsın, söz hep küçük kalsın."
18. *(Moran, gecikme)* "12 haftanın 2'sindesin. Skoru büyüt, hedefi değil."

### `shield_acilis` (kısa, tek nefeslik)
19. *(Eyal)* "Bu bir yasak değil, bir soru: şimdi mi, 10 dakika sonra mı?"
20. *(Clear)* "Bugün 4. açılış. Bir sonraki dokunuş bir oy — kime atıyorsun?"
21. *(Steel)* "Scroll'un ödülü 15 saniye sürer. Bir paragraf, akşama kadar seninle kalır."

### `vadi_uyarisi` (hafta 3 başı, proaktif)
22. *(Clear)* "Önümüzdeki hafta muhtemelen sıkılacaksın. Bu, sistemin bozulduğu değil, çalıştığı anlamına gelir. Sonuçlar gecikmeli gelir — buna bıkkınlık vadisi denir ve herkes geçer."
23. *(Clear, değer — hikaye)* "British Cycling 5 yıl boyunca %1'lik iyileştirmeler yaptı ve hiçbir şey değişmiyor gibiydi. Sonra her şey değişti. Vadi, çıkışın kanıtıdır."

### `vadi_ici`
24. *(Newport, dürtüsellik)* "Sıkılmak bir hata mesajı değil, antrenman. Odak da kas gibi — direnç hissettiğin an büyüdüğü andır."
25. *(Moran)* "Bu hafta %60 mı? Skor düşer, kimlik düşmez. Pazar günü tarifi küçültelim."

### `geri_donus`
26. *(Clear)* "3 gün kayboldun ve geri döndün. Asıl mesele buydu — mükemmel insanlar değil, geri dönenler kazanır."
27. *(Fogg)* "Zincir kopmadı; sadece bir düğüm attık. Devam."

### `hafta_ritueli`
28. *(McKeown)* "Bu hafta neyi yapmayacaksın? Hayır demediğin her şey, evet dediklerinden çalar."
29. *(Moran)* "%85 mükemmellik değil, tutarlılık eşiği. Üstündeysen kutla, altındaysan tek soru: tarif mi büyük, hafta mı zordu?"

### `sezon_orta` / `sezon_sonu`
30. *(Moran)* "6 hafta geçti. Plan değil, uygulama skoru konuşsun: neyi kanıtladın?"
31. *(Clear, sezon_sonu)* "12 hafta önce bir cümle yazdın: 'Ben ___ biriyim.' Bugün o cümlenin altında __ oy var. Artık iddia değil, kanıt."

### `kilit_acilis`
32. *(McKeown)* "İkinci hedef hakkını kazandın. Almak zorunda değilsin — azlık, bu uygulamada güç demek."

### Veri-kanıtı kartları (`veri_kaniti`, anonim kohort)
33. "Senin tarifinle başlayanların %64'ü 4. haftada hâlâ devam ediyor."
34. "Küçük çocuklu kullanıcıların en tutarlı penceresi 21:30–22:15. Yalnız değilsin."
35. "Vadiyi geçen kullanıcıların sezon tamamlama oranı 3 kat yüksek."

---

## 5 · Kendi sesi + kanıt kasası tetik kuralları

| İçerik | Kayıt anı | Çalma/gösterme tetiği | Kural |
|---|---|---|---|
| 20 sn sesli not | Onboarding, kimlik cümlesi sonrası | 3. kaçırma günü (teşhisle birlikte) VEYA vadi_ici skoru <%50 | Sezonda en fazla 2 kez çalınır; sürprizliği korunur |
| Gelecek benliğe mektup | Sezon 1. hafta | Sezon sonu raporunun açılışı | 1×/sezon |
| Kanıt kasası öğesi | Kullanıcı istediği an ekler (foto/not) | `ikinci_kacirma` ve `vadi_ici` durumlarında rastgele 1 öğe: "Bunu sen yaptın. 23 gün önce." | Aynı öğe 30 gün cooldown |

---

## 6 · Küresel kurallar

1. **Günde en fazla 1 motivasyon kartı.** Bildirim sözüyle aynı bütçeden düşer.
2. **Kıtlık:** kütüphane 150–200 karta çıkar ama kullanıcı yılda ~40 kart görür. Cooldown pazarlık edilemez.
3. **Profil önce gelir:** aynı tetikleyicide risk profiline eşleşen kart, genel karttan üstündür.
4. **Kaçırma anında asla neşeli ton yok.** Kaçırma kartları sakin ve kısa; kutlama kartları enerjik. Ton, duruma kilitli.
5. **Hikaye kartları uzundur → sadece uygulama içinde** gösterilir, bildirimde asla. Bildirimlik kartlar tek cümle.
6. **LLM üretimi sezon raporunda serbest, kart havuzunda yasak:** kartlar küratörlü ve sabittir; tutarlılık ve kalite kontrolü için havuz elle genişletilir.
7. Kullanıcı bir kartı "bir daha gösterme" diye kapatabilir → kart o kullanıcı için emekli olur, sinyal içerik ekibine döner.

---

## 7 · MVP kapsamı önerisi

- Tetikleyiciler: `onboarding_mikro`, `onboarding_kimlik`, `ilk_damga`, `ilk_kacirma`, `ikinci_kacirma`, `hedef_buyutme`, `vadi_uyarisi`, `hafta_ritueli`, `sezon_sonu` (9 tetikleyici)
- Kart sayısı: ~50 (her tetikleyiciye 4–6 kart, 2 profil varyantı)
- Kendi sesi: MVP'de var (kayıt basit, etkisi büyük)
- Veri-kanıtı kartları: MVP'de **yok** (kohort verisi birikince, ~6. ay)
- Shield kartları: interception modülüyle birlikte gelir (faz 2)
