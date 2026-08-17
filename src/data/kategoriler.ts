// Hayat alanları (bahçe onboarding referansı: docs/bahce-onboarding-prototip.jsx).
// Her kategori bir çiçek ailesidir: o kategorinin görevi = o ailenin suyu.
// Komutlar içeriktir (katalog + v28 paketlerinden damıtıldı); UI metinleri tr.ts'de.

export type KategoriId = "duzen" | "gelisim" | "huzur" | "odak" | "isler";

export type AltKategori = {
  id: string;
  ad: string;
  komutlar: string[];
};

export type Kategori = {
  id: KategoriId;
  ad: string;
  renk: string;
  cicekAd: string;
  alt: AltKategori[];
};

export const KATEGORILER: Kategori[] = [
  {
    id: "duzen",
    ad: "düzen & tertip",
    renk: "#E9B93C",
    cicekAd: "sarı çiçekler",
    alt: [
      {
        id: "ev-toplama",
        ad: "ev toplama",
        komutlar: [
          "gözüne ilişen beş şeyi yerine koy",
          "bir yüzeyi tamamen boşalt",
          "ortalıktaki çöpleri topla",
          "bir çekmeceyi düzenle — sadece bir",
          "evine dönmemiş bir eşyayı odasına götür",
        ],
      },
      {
        id: "mutfak",
        ad: "mutfak",
        komutlar: [
          "tezgahı tamamen boşalt ve sil",
          "makineyi boşalt veya doldur — ikisi değil",
          "buzdolabından tarihi geçmiş üç şey çıkar",
          "çöpü çıkar, yeni poşet tak",
        ],
      },
      {
        id: "calisma-masasi",
        ad: "çalışma masası",
        komutlar: [
          "masa üstünü tamamen boşalt, laptop hariç",
          "kağıt yığınından beş parça: dosyala ya da at",
          "kabloları topla, birini düzenle",
          "bardak turu: mutfağa",
        ],
      },
      {
        id: "dijital-duzen",
        ad: "dijital düzen",
        komutlar: [
          "on maili sil ya da arşivle",
          "bir bültenden çık",
          "galerinden on gereksiz fotoğraf sil",
          "masaüstünü topla",
        ],
      },
    ],
  },
  {
    id: "gelisim",
    ad: "gelişim",
    renk: "#D95D4E",
    cicekAd: "kırmızı çiçekler",
    alt: [
      {
        id: "kitap",
        ad: "kitap okuma",
        komutlar: [
          "bir paragraf yeter — kapıyı arala",
          "kitabı eline al, gerisi kendi gelir",
          "iki sayfa: söz bu kadar",
          "yatmadan bir sayfa",
        ],
      },
      {
        id: "dil",
        ad: "dil öğrenme",
        komutlar: [
          "beş yeni kelimeye bak",
          "on dakika pratik",
          "bir kısa diyalog dinle",
        ],
      },
      {
        id: "beceri",
        ad: "yeni beceri",
        komutlar: [
          "on beş dakika pratik yap",
          "bir eğitim videosu izle",
          "öğrendiğini bir cümleyle not et",
        ],
      },
    ],
  },
  {
    id: "huzur",
    ad: "huzur & hareket",
    renk: "#5A93C4",
    cicekAd: "mavi çiçekler",
    alt: [
      {
        id: "su",
        ad: "su içmek",
        komutlar: ["bir bardak su", "şişeni doldur, yanına koy"],
      },
      {
        id: "hareket",
        ad: "esneme & yürüyüş",
        komutlar: [
          "ayağa kalk, omuzlarını çevir",
          "otuz saniye esne",
          "on dakika yürü — kapıya kadar da olur",
        ],
      },
      {
        id: "nefes",
        ad: "nefes & sükunet",
        komutlar: [
          "pencereyi aç, üç derin nefes",
          "bir dakika gözlerini kapat",
          "içinden ona kadar say",
        ],
      },
    ],
  },
  {
    id: "odak",
    ad: "zihin & odak",
    renk: "#9D8DF2",
    cicekAd: "mor çiçekler",
    alt: [
      {
        id: "ekran",
        ad: "ekran molası",
        komutlar: [
          "telefonu bırak, gözlerini uzağa dinlendir",
          "ekransız beş dakika",
          "bildirimleri bir saat sustur",
        ],
      },
      {
        id: "derin-odak",
        ad: "derin odak",
        komutlar: [
          "bildirimleri kapat, yirmi dakika tek iş",
          "telefonu masandan kaldır",
          "tek sekmeye in",
        ],
      },
      {
        id: "uyku",
        ad: "uyku ritmi",
        komutlar: [
          "yatmadan yarım saat ekranı bırak",
          "yatma alarmını kur",
          "telefonu salona bırak",
        ],
      },
    ],
  },
  {
    id: "isler",
    ad: "minik işler",
    renk: "#E8913C",
    cicekAd: "turuncu çiçekler",
    alt: [
      {
        id: "randevular",
        ad: "randevular & evrak",
        komutlar: [
          "o randevuyu şimdi al",
          "kargo kodunu al, çantana koy",
          "iade işlemini başlat",
          "o parayı gönder ya da iste",
        ],
      },
      {
        id: "mail",
        ad: "mail kutusu",
        komutlar: [
          "cevap bekleyen üç maili yıldızla",
          "tek maile iki cümlelik cevap yaz",
          "en eski okunmamışa in: beş karar",
        ],
      },
      {
        id: "erteleme",
        ad: "erteleme listesi",
        komutlar: [
          "ertelediğin işi takvime tarih vererek yaz",
          "ilk iki dakikalık parçayı yap",
          "o formu doldur — ilk sayfası da olur",
        ],
      },
    ],
  },
];

export const kategoriBul = (id: KategoriId): Kategori => KATEGORILER.find((k) => k.id === id)!;
