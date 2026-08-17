// Tarife üretimi — SAF katman (yan etki yok, test edilebilir).
// İlke: bildirimler pencere içine eşit dağıtılır + hafif rastgelelik;
// saatler KULLANICIYA ASLA GÖSTERİLMEZ. Günlük toplam tavan 5 (güvenlik kelepçesi).

import { GUNLUK_TAVAN, PENCERELER } from "../data/paketler";

// tarife girdisi: bir bildirim kaynağı (bahçe vizyonunda görev havuzu)
export type TarifeGirdisi = {
  ad: string;
  komutlar: string[];
  gunler: number[]; // 0 = pazartesi ... 6 = pazar
  adet: number;
  pencere: number | null; // PENCERELER indeksi
  pencereGun: Record<number, number> | null;
  aktif: boolean;
};

export type PlanMaddesi = {
  tarih: Date;
  komut: string;
  paketAd: string;
};

// 0 = pazartesi ... 6 = pazar
function gunIdx(t: Date): number {
  return (t.getDay() + 6) % 7;
}

// slot ortası ± slotun %25'i kadar kayma — "hafif rastgelelik"
function slotZamani(
  gun: Date,
  bas: number,
  bit: number,
  i: number,
  adet: number,
  rastgele: () => number
): Date {
  const pencereDk = (bit - bas) * 60;
  const slotDk = pencereDk / adet;
  const ortaDk = slotDk * (i + 0.5);
  const kaymaDk = (rastgele() - 0.5) * slotDk * 0.5;
  const dk = Math.min(pencereDk - 1, Math.max(1, Math.round(ortaDk + kaymaDk)));
  const t = new Date(gun);
  t.setHours(bas, 0, 0, 0);
  t.setMinutes(t.getMinutes() + dk);
  return t;
}

// simdi'den itibaren gunSayisi gün için plan üretir (geçmiş saatler atlanır).
// Rotasyon: plan boyunca son 3 komut tekrar etmez; başlangıç geçmişi DB'den verilir.
export function planUret(
  abonelikler: TarifeGirdisi[],
  simdi: Date,
  gunSayisi: number,
  baslangicGecmisi: string[] = [],
  rastgele: () => number = Math.random
): PlanMaddesi[] {
  const aktifler = abonelikler.filter((a) => a.aktif && a.komutlar.length > 0);
  if (aktifler.length === 0) return [];

  const plan: PlanMaddesi[] = [];
  const son: string[] = [...baslangicGecmisi].slice(0, 3);

  const komutSec = (a: TarifeGirdisi): string => {
    let havuz = a.komutlar.filter((k) => !son.includes(k));
    if (havuz.length === 0) havuz = a.komutlar;
    const k = havuz[Math.floor(rastgele() * havuz.length)];
    son.unshift(k);
    if (son.length > 3) son.pop();
    return k;
  };

  for (let g = 0; g < gunSayisi; g++) {
    const gun = new Date(simdi.getFullYear(), simdi.getMonth(), simdi.getDate() + g);
    const idx = gunIdx(gun);
    const gunMaddeleri: PlanMaddesi[] = [];

    for (const a of aktifler) {
      if (!a.gunler.includes(idx)) continue;
      const pencereIdx = a.pencereGun ? a.pencereGun[idx] : a.pencere;
      if (pencereIdx == null) continue;
      const { bas, bit } = PENCERELER[pencereIdx];
      for (let i = 0; i < a.adet; i++) {
        const t = slotZamani(gun, bas, bit, i, a.adet, rastgele);
        if (t.getTime() <= simdi.getTime()) continue;
        gunMaddeleri.push({ tarih: t, komut: "", paketAd: a.ad });
        // komut, zaman sırasına göre aşağıda atanır (rotasyon doğru işlesin)
        (gunMaddeleri[gunMaddeleri.length - 1] as PlanMaddesi & { _a?: TarifeGirdisi })._a = a;
      }
    }

    gunMaddeleri.sort((x, y) => x.tarih.getTime() - y.tarih.getTime());
    // günlük tavan: sihirbaz zaten toplam adet ≤ 5 tutar; yine de kelepçe
    for (const m of gunMaddeleri.slice(0, GUNLUK_TAVAN)) {
      m.komut = komutSec((m as PlanMaddesi & { _a: TarifeGirdisi })._a);
      delete (m as PlanMaddesi & { _a?: TarifeGirdisi })._a;
      plan.push(m);
    }
  }

  return plan;
}
