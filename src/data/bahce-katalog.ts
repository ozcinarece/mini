// Bahçe kataloğu — ekonomi anayasasına bağlı (CLAUDE.md):
// 🌰 tohum görevden gelir, canlıya harcanır; 🪙 para SADECE hasattan, dekora/alana.
// Sebze hasadı tohumu AYNEN iade eder + para kârı. Çiçekler kalıcı, hasat edilmez.
// Aşamalar yalnız görevle atlanır (zaman/zamanlayıcı yasak).
// aile: hangi kategorinin görevi bu bitkiyi sular (null = ortak: her görev sular).

import type { KategoriId } from "./kategoriler";

export type VarlikTip = "cicek" | "sebze" | "dekor";

export type KatalogKalemi = {
  ad: string;
  tip: VarlikTip;
  aile: KategoriId | null; // dekor için null; sebzeler ortak (null)
  fiyatTohum?: number; // canlılar 🌰
  fiyatPara?: number; // dekorlar 🪙
  maxAsama?: number; // canlılar: 0 tümsek → 1 filiz → ... → max olgun
  para?: number; // sebze hasat kârı 🪙
  esik?: number; // toplam kanıt eşiğiyle açılır (kilitliler dükkânda GÖRÜNÜR)
  sandiktan?: boolean; // yalnız haftalık sandıktan (gül)
};

export const BAHCE_KATALOG: Record<string, KatalogKalemi> = {
  // kategori çiçekleri — her ailenin temel çiçeği (yer tutucu çizim; sprite gelince değişir)
  aycicegi: { ad: "ayçiçeği", tip: "cicek", aile: "duzen", fiyatTohum: 4, maxAsama: 3 },
  gelincik: { ad: "gelincik", tip: "cicek", aile: "gelisim", fiyatTohum: 4, maxAsama: 3 },
  unutmabeni: { ad: "unutma beni", tip: "cicek", aile: "huzur", fiyatTohum: 4, maxAsama: 3 },
  menekse: { ad: "menekşe", tip: "cicek", aile: "odak", fiyatTohum: 4, maxAsama: 3 },
  kadife: { ad: "kadife çiçeği", tip: "cicek", aile: "isler", fiyatTohum: 4, maxAsama: 3 },

  // özel çiçekler
  lavanta: { ad: "lavanta", tip: "cicek", aile: "odak", fiyatTohum: 5, maxAsama: 2, esik: 15 },
  gul: { ad: "gül ✨", tip: "cicek", aile: "gelisim", fiyatTohum: 6, maxAsama: 2, sandiktan: true },

  // sebzeler — ortak aile: her görev sular; hasat = tohum iadesi + para
  domates: { ad: "domates", tip: "sebze", aile: null, fiyatTohum: 6, maxAsama: 3, para: 4 },
  kabak: { ad: "kabak", tip: "sebze", aile: null, fiyatTohum: 10, maxAsama: 3, para: 8, esik: 30 },

  // dekorlar — kalıcı süs, yalnız parayla
  cit: { ad: "çit", tip: "dekor", aile: null, fiyatPara: 6 },
  fener: { ad: "fener", tip: "dekor", aile: null, fiyatPara: 14 },
  bank: { ad: "bank", tip: "dekor", aile: null, fiyatPara: 20 },
  kusbanyosu: { ad: "kuş banyosu", tip: "dekor", aile: null, fiyatPara: 25, esik: 25 },
};

// kategori → temel çiçek (onboarding hoş geldin hediyesi bundan ekilir)
export const KATEGORI_CICEGI: Record<KategoriId, string> = {
  duzen: "aycicegi",
  gelisim: "gelincik",
  huzur: "unutmabeni",
  odak: "menekse",
  isler: "kadife",
};

// ── sahne geometrisi ──
export const IZGARA = { sutun: 7, satir: 5, kilitliSutunBasi: 5 } as const;
export const BOLGE_FIYATI = 40; // 🪙

// ── kazanç kuralları ──
export const GOREV_TOHUM = 2; // her "yaptım"
export const ILK_KANIT_BONUS = 1; // günün ilk kanıtı
