# Davranış Motoru Mimarisi v1.1
### 7 Arketip · 3 Katman · Topluluk Katmanı

> Temel ilke: Kullanıcı sınırsız hedef yazabilir; sistem her hedefi 7 kalıptan biriyle karşılar. Derinlik kalıpta, çeşitlilik içerikte, kişiselleştirme LLM'dedir.

---

## 1 · Üç katman

| Katman | Ne yapar | Kim üretir | Ölçek |
|---|---|---|---|
| **Arketip motoru** | Mekaniği belirler: ölçüm, tetik, tarif yapısı, günlük döngü | Elle tasarlanır, sabit | 7 kalıp → sonsuz hedef |
| **Paketler** | Yaygın hedeflere küratörlü içerik giydirir: hazır desteler, özel kıvılcımlar, metodoloji | Elle tasarlanır, büyüyen | ~15 paket (MVP: 4) |
| **LLM uzun kuyruk** | Paketi olmayan hedefe, arketip şablonu içinde kalarak kişisel içerik üretir | LLM, şablon-kısıtlı | Geri kalan her şey |

Kural: LLM mekanik **icat edemez** — sadece seçili arketipin şablonundaki boşlukları doldurur (deste kartı metni, mikro öneri, çapa önerisi). Motivasyon kıvılcımları her durumda küratörlü havuzdan gelir.

---

## 2 · Ana mekanik tablo

| Arketip | Örnek hedefler | Ölçüm | Tetik | Tarif yapısı | Ana kitap |
|---|---|---|---|---|---|
| 🌱 **Başlama** | spor, okuma, meditasyon, günlük | Günlük damga (yaptım) | Çapa (istifleme) | Tek mikro tarif | Fogg, Clear |
| ✂️ **Bırakma** | sigara, tırnak yeme, gece atıştırması | Temiz gün sayacı | İstek anı (içsel) | Karşı-hamle tarifi | Duhigg |
| 🤏 **Azaltma** | şeker, ekran, kahve, alışveriş | Adet/limit (bugün X, hedef ≤Y) | İstek anı + shield (ekranda) | Yerine-koyma tarifi | Eyal, Duhigg |
| 🕰️ **Düzen** | uyku saati, su, ilaç, düzenli yemek | Pencere uyumu (saatinde mi) | Sabit an (saat/rutin) | Sabitleme tarifi | Clear |
| 🐌 **Erteleme yenme** | tez, proje, evrak, başvuru | Oturum damgası (başladım) | Çapa + takvim bloğu | 2-dakika kapı tarifi | Steel, Newport |
| 🌊 **Duygu anı** | öfke, kaygı, panik, tartışma | Olay damgası (an geldi, uyguladım) | Durumun kendisi (çapasız) | Anlık protokol | Eyal (10 dk), McGonigal |
| 🧺 **Dağınık bakım** | ev toplama, mail/evrak, biriken işler | Kart sayısı (bugün N kart) | Kullanıcı-pull: "2 dakikam var" | **Görev destesi** | Fogg + Allen'dan esinti |

---

## 3 · Arketip detayları

### 🌱 Başlama
Klasik kalıp; mevcut prototip bunun üstüne kurulu. Tek mikro eylem + çapa + günlük damga. Kilit risk: hedef büyütme isteği → tarif 2 hafta kilitli, büyütme sadece pazar ritüelinde.
İlk Yardım varyantı: standart merdiven (küçült → kasa → ses → izin).

### ✂️ Bırakma
Ölçüm tersine döner: eylem değil, **eylemsizlik** sayılır — temiz gün. Ama Duhigg'in dersi: rutin bastırılmaz, değiştirilir. Onboarding'de ek soru: "İstek genelde ne zaman/nerede geliyor?" (işaret tespiti). Tarif bir karşı-hamledir: istek → 1 bardak su / 10 dk erteleme / el meşguliyeti.
Oy mantığı: gün sonunda temiz gün oyu + istek anında karşı-hamle uygulanırsa anlık "direnç oyu" (ikili kanıt).
İlk Yardım varyantı: "istek çok güçlü" butonu → 10 dakika sayacı + dikkat dağıtma protokolü; kaçamak olursa suçsuz kayıt ("veri, suç değil") + işaret güncellenir.
Dikkat: temiz gün sayacı streak'e benzer — kırılınca sıfırlanan büyük sayı göstermeyiz; "son 30 günde 26 temiz gün" oran dili kullanılır.

### 🤏 Azaltma
Bırakmanın yumuşak kardeşi; hedef sıfır değil, tavan. Günlük limit ve adet takibi: "bugün 2/3 kahve." Ekran süresi hedefinde shield/interception bu arketipin doğal uzantısı.
Tarif: yerine-koyma ("tatlı isteği → önce meyve") + limit düşürme kademeli: sistem limiti haftada bir tık indirir, kullanıcı onayıyla.
Oy: limit altında biten gün oy alır.
İlk Yardım varyantı: "limiti aşacağım" → izin çerçevesi: "Bugün taşarsa taşar; yarın limit aynı yerde." (yasak psikolojisini kırmak için).

### 🕰️ Düzen
Mesele eylemin kendisi değil, **zamanlaması**. Ölçüm: hedef pencereye uyum ("23:30'dan önce yattın mı"). Tetik sabit an; bildirim penceresi burada en katı çalışır.
Tarif: sabitleme + akşamdan hazırlık ("yatma alarmı + telefonu salona bırak").
Oy: pencere tutturulan gün.
Dikkat: bebekli/vardiyalı hayatlarda pencere esnek tanımlanabilmeli ("bebek uyuduktan sonraki 1 saat" gibi göreli pencere) — mutlak saat dayatması bu kitleyi kaybettirir.

### 🐌 Erteleme yenme
Ölçülen şey tamamlama değil, **başlama**. Oturum damgası: dosyayı açtın, 2 dakika kaldın → oy. Steel'in dört faktörü bu arketipte teşhis motorunun varsayılan merceği.
Tarif: 2-dakika kapısı + isteğe bağlı takvim bloğu (Newport). Zeigarnik notu: oturum kapanırken "yarın nereden devam?" tek cümle — açık döngü bırakma tekniği.
İlk Yardım varyantı: "başlayamıyorum" → görevi böl: LLM görevin ilk 2 dakikalık parçasını somutlaştırır ("tezi aç" değil, "3. bölümün ilk cümlesini kopyala-yapıştır düzelt").

### 🌊 Duygu anı
En farklı kalıp: gün planlanamaz, olay geldiğinde protokol çalışır. Çapa yok — durum tetiktir. Ölçüm olay bazlı: "bugün 1 öfke anı geldi, protokolü uyguladın."
Tarif: anlık protokol (3 nefes / 10'a say / odayı değiştir) — 10 saniyede hatırlanabilir olmalı, o an ekrana bakılmaz.
Günlük döngü farkı: akşam tek soru gelir: "Bugün o an geldi mi?" → geldi+uyguladım / geldi+uygulayamadım / gelmedi. Üçü de suçsuz veri.
Oy: uygulanan her an. Uygulayamamak teşhise gider: hangi durumda kaçtı, protokol mü uzun?
Dikkat: Bu arketip klinik alana komşu (kaygı, panik). Sınır net çizilir: uygulama başa çıkma aracı sunar, terapi değildir; şiddetli tablolarda profesyonel destek yönlendirmesi paket içeriğine gömülüdür.

### 🧺 Dağınık bakım (yeni)
Görev **destesi** modeli. Hedef tek eylem değil, 2 dakikalık kartlardan havuz: "tezgahı sil", "gözüne ilişen 5 şeyi yerine koy", "bir çekmece", "kirlileri makineye."
Tetik ters: kullanıcı-pull. Ana ekranda/widget'ta "**2 dakikam var**" butonu → sistem desteden kart çeker (kullanıcı seçmez; seçim yorgunluğu bu derdin kendisidir). İsteğe bağlı: tanımlı saat aralıklarında günde ≤2 nazik dürtme.
Ölçüm: çekilen+tamamlanan kart sayısı; hedef gün bazlı değil hafta bazlı ("haftada 10 kart").
Oy: kart başına.
Deste kaynağı: pakette hazır desteler (oda bazlı), LLM kullanıcının evine göre kişiselleştirir ("çalışma masam felaket" → masaya özel 5 kart).
İlk Yardım varyantı: "nereden başlayacağımı bilmiyorum" zaten yapısal olarak çözülü — kartı sistem seçer. Ek: "bugün ev beni yendi" → tek karta düşür + kasa kanıtı.

---

## 4 · Paket katmanı

Bir paket = arketip + küratörlü içerik. Alanları:
- Hazır mikro/karşı-hamle/deste seti (hedefe özel)
- Hedefe özel kıvılcım kartları (10-15 adet)
- Metodoloji notları (Liman'daki mini okumalara eklenir)
- Özel onboarding sorusu (gerekirse; ör. bırakmada işaret sorusu)
- Teşhis ağırlık önerileri (ör. şekerde gecikme faktörü baskın başlar)

**MVP paketleri (4):** Ev düzeni 🧺 · Spora başlama 🌱 · Okuma 🌱 · Ekran süresi 🤏
**İkinci dalga:** Uyku 🕰️ · Şeker 🤏 · Erteleme/tez 🐌 · Sakin kalma 🌊 · Su 🕰️ · Sigara ✂️

---

## 5 · LLM sınırları (uzun kuyruk)

LLM'in doldurabileceği alanlar: deste kartı metinleri, mikro öneriler, çapa önerileri, görev bölme (erteleme), sezon hikayesi.
LLM'in dokunamayacağı alanlar: arketip mekaniği, ölçüm tipi, oy kuralları, motivasyon kıvılcımları, bildirim frekansı.
Her LLM üretimi kullanıcı onayından geçer ("şu 5 kartı hazırladım — düzenlemek ister misin?") — özerklik ilkesi içerik üretiminde de geçerli.

---

## 6 · Onboarding'e etkisi

1. Hedef yazılır → arketip tespiti (anahtar kelime + LLM sınıflandırma; emin değilse tek soruyla netleştirir: "Bu daha çok başlamak mı, azaltmak mı?")
2. Arketipe göre akış dallanır: çapa adımı (🌱🕰️🐌), işaret sorusu (✂️🤏), pencere tanımı (🕰️), deste önizleme (🧺), protokol seçimi (🌊)
3. Paket varsa içerik zenginleşir; yoksa LLM şablon doldurur, kullanıcı onaylar
4. Sözleşme ekranı arketipe göre cümle kurar ("İstek geldiği an, bir bardak su." / "Haftada 10 kart.")

---

## 7 · Topluluk katmanı

> İlke: Topluluk ana **duygudur**, ana **mekanik değildir**. Mekanik kimlik + kanıt olarak kalır; topluluk "neden bırakmıyorum"un cevabıdır. Feed yok, sohbet yok, profil yok — kalabalık hissettirilir, konuşturulmaz.

### 7.1 Ortak sezon takvimi (temel karar)
Sezonlar kişisel değil, kolektif başlar: yılda 4 ana sezon + aylık giriş dalgaları. "Eylül Sezonu 1 Eylül'de açılıyor. 12 hafta. Hep birlikte."
Tek kararın çözdükleri:
- **Gerçek kohortlar:** Aynı gün yola çıkanlar — yapay eşleştirme değil, ortak başlangıç.
- **Soğuk başlangıç hafifler:** Kullanıcılar dalgalara toplanır; salon hiç boş görünmez.
- **Pazarlama ritmi:** Her sezon açılışı doğal kampanya anı (Dry January / Whole30 modeli).
Sezon arasında gelen kullanıcı: hemen "ısınma turu" ile başlar (tek hedef, hafif mod), ana sezona dalga ile katılır.

### 7.2 Eşzamanlılık sinyalleri (hissettiren dokunuşlar)
| Nerede | Sinyal | Kural |
|---|---|---|
| Kohort kartı (Bugün) | "27 kişiden %71'i vadiyi geçti" | Yalnızca olumlu-çoğunluk veya kahraman-azınlık çerçevesi (negatif sosyal kanıt yasak) |
| Liman nefes ekranı | "Şu an seninle nefes alan 4 kişi" | Gerçek sayı; 0 ise sinyal gizlenir, asla sahte kalabalık |
| 🧺 kart çekimi | "Bugün seninle aynı kartı çeken 12 kişi" | Aynı kural |
| Vadi haftası | "Kohortun vadiye girdi — birlikte geçiyoruz" | Kolektif çerçeveleme, bireysel kıyas yok |
| Sezon sonu | Kohort mezuniyeti: toplam oy, tamamlama, kolektif hikaye | Paylaşılabilir kart |
| Cümle havuzu | "Senin gibi biri, 3 gün önce: …" | Topluluğun tek "sesi"; anonim, moderasyonlu, İlk Yardım'da gösterilir |

### 7.3 Kurucu Kohort (soğuk başlangıç stratejisi)
Küçüklük saklanmaz, rozete dönüşür: ilk sezonlar "Kurucu Kohort" olarak çerçevelenir — "Şu an 87 kişiyiz ve bu bir özellik. İlk yüzün içindesin; uygulamayı seninle şekillendiriyoruz." Kurucu üyeler kalıcı işaret taşır (oy duvarında kurucu damgası), geri bildirimleri ürün döngüsüne görünür biçimde girer ("bu özellik kurucu kohorttan geldi").

### 7.4 Sınırlar
- **Opt-out her zaman açık:** Onboarding'de tek soru — "Yalnız mı, kohortla mı?" Yalnız seçen için tüm topluluk sinyalleri kapanır; uygulama tamamen solo çalışır. (Doz felsefesinin topluluk karşılığı.)
- Kohort içi bireysel görünürlük yok: kimse kimin kaçırdığını görmez.
- Sahte sayı, şişirilmiş kalabalık, bot cümle: yasak. Güven ürünüdür.
- İkili sözleşme (partner) ve segmentli kohortlar (bebekli anneler vb.) ikinci dalga — çekirdek his ortak sezonla kurulur.

---

## 8 · Konumlandırma cümleleri (isim çalışmasına girdi)

Duygusal katman: *görülmek + birlikte yürümek*. Mekanik katman: *kimlik + kanıt*. Adaylar:

1. **"Yalnız başlamak zorunda değilsin."** — topluluk-önde, ana aday
2. "Küçük başla. Birlikte devam et." — mekanik + topluluk dengesi
3. "Kim olduğuna her gün oy veriyorsun. Yanında sayım yapanlar var." — kimlik + tanıklık
4. "Sana hayır diyebilen, yanından ayrılmayan uygulama." — karakter-önde (azaltma felsefesi + sadakat)
5. "Herkes bir yerden başlıyor. Bu sezon, birlikte." — sezon ritmi-önde

Test notu: 1 ve 5 topluluk vaadi verdiği için kritik kütleye bağımlı; lansmanda 2 ile başlayıp topluluk yoğunlaştıkça 1'e kaymak güvenli rota olabilir.

---

## 9 · Açık sorular (sonraki oturumlara)

- Çoklu aktif hedef açıldığında farklı arketipler aynı Bugün ekranında nasıl birlikte yaşar? (ör. 🌱 damga + 🧺 kart butonu)
- 🧺 "2 dakikam var" butonu widget/kilit ekranı olarak ne kadar öne çıkmalı — uygulamanın ikinci giriş kapısı olabilir mi?
- 🌊 arketipinde akşam yoklaması bildirim bütçesini (günde 1) nasıl paylaşır?
- Temiz gün oranı gösterimi (✂️) ile oy duvarı estetiği nasıl birleşir?
- Sezon dışı katılan kullanıcının "ısınma turu" ne kadar sürmeli — ana sezona kadar mı, sabit 2 hafta mı?
- Eşzamanlılık sinyalleri için gereken minimum eş-zamanlı kullanıcı eşiği ne (kaçın altında sinyal gizlenir)?
- Kurucu kohort rozeti kalıcı ayrıcalık mı taşımalı (ör. premium indirimi) yoksa sadece kimlik işareti mi?
