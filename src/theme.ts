// BOŞLUK tasarım dili — tek kaynak (referans: docs/prototip-v19.jsx)
// Kutu yok, kart yok, buton yok, gölge yok. Kelimeler ve boşluk.

export const renk = {
  // sabah denizi gradyanı (zemin) — yukarıdan aşağıya
  gokyuzu: ["#517682", "#3A5B66", "#2A434C"] as const,
  gokyuzuDuraklar: [0, 0.52, 1] as const,

  // metin kademeleri
  ink: "#F5F0E4",
  faint: "#AEC3C6",
  dim: "#849BA1",

  // tek vurgu: kayısı güneş
  sun: "#EEBB8D",
  sunSoft: "rgba(238,187,141,0.16)",

  // gece: ay
  moon: "#EAE7DD",
  moonBright: "#F2EFE6",

  line: "rgba(245,240,228,0.20)",
} as const;

export const font = {
  serif: "Marcellus_400Regular",
  sans: "Figtree_400Regular",
  sansMedium: "Figtree_500Medium",
  sansSemi: "Figtree_600SemiBold",
} as const;

// animasyonlar yavaş: 0.7–1.8sn (prefers-reduced-motion'da kapatılır)
export const sure = {
  belirme: 900,
  belirmeYavas: 1400,
  gunDogumu: 1800,
  ortuAcilis: 1000,
  ortuKapanis: 700,
  secimSolma: 900,
  secimBekleme: 850,
  nefes: 11000,
} as const;

export const bosluk = {
  sayfaYatay: 32,
  maxGenislik: 290,
} as const;

// ── BAHÇE paleti (2026-08 bahçe vizyonu) ──
// Bahçe ekranları kendi dilini konuşur: açık yeşil zemin, Baloo 2 + Nunito,
// yumuşak hap butonlar. BOŞLUK tokenları eski ekran dili için yukarıda durur.
export const bahce = {
  zemin: ["#F6FAEE", "#E7F0D9"] as const,
  ink: "#41502F",
  faint: "#8CA06B",
  dim: "#AFC08F",
  yesil: "#7CA24D",
  koyu: "#5F8138",
  beyaz: "#FFFFFF",
  kartCizgi: "#E9EEDD",
  cipZemin: "#F3F6EB",
  turuncu: "#E8913C",
  turuncuKoyu: "#C4741F",
  altin: "#8A6B2E",
  kilitliMetin: "#A9987F",
} as const;

export const bahceFont = {
  baslik: "Baloo2_700Bold",
  govde: "Nunito_600SemiBold",
  govdeKalin: "Nunito_700Bold",
  govdeEnKalin: "Nunito_800ExtraBold",
} as const;

