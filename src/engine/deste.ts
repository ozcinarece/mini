// 🧺 deste motoru — kartı SİSTEM seçer (seçim yorgunluğu bu derdin kendisidir).
// Kurallar (CLAUDE.md): son 3 kart tekrar gelmez; zorluk-3'ten sonra zorluk-3 gelmez;
// 3. "başka kart"ta deste düzenleme önerilir; bağlam filtresi opsiyonel.

import type { Kart } from "../data/katalog";

export function kartCek(
  kartlar: Kart[],
  gecmis: string[], // son çekilenler, yeniden eskiye
  baglam: string | null = null
): Kart | null {
  if (kartlar.length === 0) return null;

  let havuz = kartlar.filter((k) => !gecmis.slice(0, 3).includes(k.id));

  if (baglam) havuz = havuz.filter((k) => k.baglam === baglam);

  const sonKart = gecmis.length ? kartlar.find((k) => k.id === gecmis[0]) : null;
  if (sonKart?.zorluk === 3) havuz = havuz.filter((k) => k.zorluk !== 3);

  if (havuz.length === 0) havuz = kartlar;

  return havuz[Math.floor(Math.random() * havuz.length)];
}

// 3. "başka kart"ta deste düzenleme önerilir
export const DUZENLEME_ONERI_ESIGI = 2;
