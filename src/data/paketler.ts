// Küratörlü paketler — v28 prototipinden birebir (katalogdan damıtıldı).
// Komutlar içeriktir (kullanıcı düzenleyebilir); UI metinleri src/i18n/tr.ts'dedir.

export type PaketId = "ev" | "kitap" | "su" | "ekran" | "minik" | "kendi";

export const PAKETLER: Record<PaketId, { ad: string; komutlar: string[] }> = {
  ev: {
    ad: "ev düzeni",
    komutlar: [
      "gözüne ilişen beş şeyi yerine koy",
      "bir yüzeyi tamamen boşalt",
      "ortalıktaki çöpleri topla",
      "bir çekmeceyi düzenle — sadece bir",
      "su şişesi turu: hepsi mutfağa",
      "evine dönmemiş bir eşyayı odasına götür",
    ],
  },
  kitap: {
    ad: "kitap okuma",
    komutlar: [
      "bir paragraf yeter — kapıyı arala",
      "kitabı eline al, gerisi kendi gelir",
      "iki sayfa: söz bu kadar",
      "scroll yerine üç cümle?",
      "yatmadan bir sayfa",
    ],
  },
  su: {
    ad: "su & hareket",
    komutlar: [
      "bir bardak su",
      "ayağa kalk, omuzlarını çevir",
      "otuz saniye esne",
      "pencereyi aç, üç derin nefes",
    ],
  },
  ekran: {
    ad: "ekran molası",
    komutlar: [
      "telefonu bırak, gözlerini uzağa dinlendir",
      "ekransız beş dakika",
      "bildirimleri bir saat sustur",
    ],
  },
  minik: {
    ad: "minik işler",
    komutlar: [
      "o randevuyu şimdi al",
      "kargo kodunu al, çantana koy",
      "ertelediğin işi takvime tarih vererek yaz",
      "o parayı gönder ya da iste",
      "iade işlemini başlat",
    ],
  },
  kendi: { ad: "kendi paketim", komutlar: [] },
};

// GLOBAL GÜNLÜK TAVAN — pazarlık edilemez (CLAUDE.md)
export const GUNLUK_TAVAN = 5;

// gün indeksleri: 0 = pazartesi ... 6 = pazar (etiketler tr.ts'de)
export const GUN_SAYISI = 7;

// bildirim pencereleri: [başlangıç saati, bitiş saati] (etiketler tr.ts'de)
export const PENCERELER: ReadonlyArray<{ bas: number; bit: number }> = [
  { bas: 8, bit: 12 },
  { bas: 9, bit: 21 },
  { bas: 18, bit: 23 },
];
