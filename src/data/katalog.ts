// 🧺 dağınık bakım kataloğu — data/katalog-daginik.json'un tipli yüzü.
// xlsx kullanıcının düzenleme masasıdır; JSON oradan dışa aktarılır, elle düzenlenmez.

import katalogJson from "../../data/katalog-daginik.json";

export type Kart = {
  id: string;
  metin: string;
  sure_dk: number;
  zorluk: 1 | 2 | 3;
  baglam: string;
};

export type AltHedef = {
  kume_id: string;
  kume: string;
  ad: string;
  aciklama: string;
  anahtar_kelimeler: string[];
  paket: string;
  hafta_hedefi: number;
  kimlik: string;
  kartlar: Kart[];
};

export const altHedefler = katalogJson.alt_hedefler as unknown as Record<string, AltHedef>;

export function altHedef(id: string): AltHedef | undefined {
  return altHedefler[id];
}

// serbest metin → anahtar kelime eşleşmesi → alt hedef önerileri
export function katalogEslestir(metin: string): string[] {
  const s = metin.toLocaleLowerCase("tr");
  return Object.entries(altHedefler)
    .filter(([, h]) => h.anahtar_kelimeler.some((k) => s.includes(k.toLocaleLowerCase("tr"))))
    .map(([id]) => id);
}
