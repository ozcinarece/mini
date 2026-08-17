// Bahçe motoru — SAF katman (yan etki yok, test edilebilir).
// Ekonomi anayasası (CLAUDE.md): zaman değil emek büyütür; su kategoriye akar;
// hasat tohumu aynen iade eder + para kârı; türler kanıt eşikleriyle açılır.

import {
  BAHCE_KATALOG,
  GOREV_TOHUM,
  ILK_KANIT_BONUS,
  IZGARA,
} from "../data/bahce-katalog";
import type { KategoriId } from "../data/kategoriler";
import type { Kare } from "../db/depo";

// "yaptım" kazancı: +2 🌰, günün ilk kanıtına +1
export function tohumKazanci(bugunOncekiKanit: number): number {
  return GOREV_TOHUM + (bugunOncekiKanit === 0 ? ILK_KANIT_BONUS : 0);
}

// SU KATEGORİYE AKAR: görevin kategorisindeki çiçekler + ortak aileli canlılar
// (sebzeler) bir aşama büyür. Dekorlar ve olgunlar olduğu gibi kalır.
export function sula(kareler: Kare[], kategori: KategoriId): Kare[] {
  return kareler.map((k) => {
    const kalem = BAHCE_KATALOG[k.varlik];
    if (!kalem || kalem.maxAsama == null || k.asama == null) return k; // dekor
    if (k.asama >= kalem.maxAsama) return k; // olgun
    const ailesiUyuyor = kalem.aile !== null && kalem.aile !== kategori;
    if (ailesiUyuyor) return k;
    return { ...k, asama: k.asama + 1 };
  });
}

// hasat edilebilir mi? (yalnız olgun sebzeler — çiçekler kalıcı güzellik)
export function hasatEdilebilir(kare: Kare): boolean {
  const kalem = BAHCE_KATALOG[kare.varlik];
  return (
    !!kalem &&
    kalem.tip === "sebze" &&
    kalem.maxAsama != null &&
    kare.asama != null &&
    kare.asama >= kalem.maxAsama
  );
}

// hasat getirisi: ektiğin tohum AYNEN geri + para kârı
export function hasatGetirisi(varlik: string): { tohum: number; para: number } {
  const kalem = BAHCE_KATALOG[varlik];
  return { tohum: kalem?.fiyatTohum ?? 0, para: kalem?.para ?? 0 };
}

// bu kanıt sayısıyla yeni açılan türler (rozet göstermek için)
export function yeniAcilanlar(toplamKanit: number): string[] {
  return Object.entries(BAHCE_KATALOG)
    .filter(([, k]) => k.esik === toplamKanit)
    .map(([id]) => id);
}

// dükkân durumu
export type DukkanDurumu =
  | { tur: "alinabilir" }
  | { tur: "yetersiz" } // cüzdan yetmiyor
  | { tur: "esikte"; mevcut: number; esik: number } // kanıt eşiği (kilidi GÖRÜNÜR)
  | { tur: "sandiktan" };

export function dukkanDurumu(
  varlik: string,
  tohum: number,
  para: number,
  toplamKanit: number
): DukkanDurumu {
  const k = BAHCE_KATALOG[varlik];
  if (k.sandiktan) return { tur: "sandiktan" };
  if (k.esik && toplamKanit < k.esik) return { tur: "esikte", mevcut: toplamKanit, esik: k.esik };
  const yeter = k.tip === "dekor" ? para >= (k.fiyatPara ?? 0) : tohum >= (k.fiyatTohum ?? 0);
  return yeter ? { tur: "alinabilir" } : { tur: "yetersiz" };
}

export function kilitliKareMi(c: number, bolgeAcik: boolean): boolean {
  return c >= IZGARA.kilitliSutunBasi && !bolgeAcik;
}

// hoş geldin hediyesi: seçilen her kategoriden 1 filiz — sahnedeki hazır konumlara
const HEDIYE_KONUMLARI: Record<KategoriId, [number, number]> = {
  duzen: [1, 1],
  gelisim: [2, 2],
  huzur: [3, 1],
  odak: [1, 3],
  isler: [3, 3],
};

export function hediyeFilizleri(
  kategoriler: KategoriId[],
  kategoriCicegi: Record<KategoriId, string>
): Kare[] {
  return kategoriler.map((kid) => ({
    c: HEDIYE_KONUMLARI[kid][0],
    r: HEDIYE_KONUMLARI[kid][1],
    varlik: kategoriCicegi[kid],
    asama: 1, // filiz
  }));
}
