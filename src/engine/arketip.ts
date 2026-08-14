// Arketip motoru — mekanik burada, kullanıcı metinleri src/i18n/tr.ts'de.
// 7 arketip; her hedefin mekaniğini arketip belirler (docs/mimari.md).

import type { ArketipId } from "../i18n/tr";

export type Hedef = {
  metin: string;
  arketip: ArketipId;
  // 🧺 hedeflerinde katalogdaki alt hedef (F01, D01, ...); diğerlerinde null
  altHedefId: string | null;
};

export type OnboardingSonuc = {
  hedefler: Hedef[];
  aktif: number;
  mikro: string;
  capa: string;
  kimlik: string;
};

// tetik = istek/duygu anı olan arketipler (çapa adımı atlanır, tetik notu gösterilir)
export const TETIKLI: ReadonlySet<ArketipId> = new Set(["birakma", "azaltma", "duygu"]);

// kullanıcı-pull arketip: çapa da mikro seçimi de yok, deste var
export const PULL: ArketipId = "daginik";

// serbest metin → arketip tespiti (MVP: anahtar kelime; ileri faz: LLM sınıflandırma)
export function arketipTespit(metin: string): ArketipId {
  const s = metin.toLocaleLowerCase("tr");
  if (/topla|temizl|dağınık|evrak|biriken/.test(s)) return "daginik";
  if (/bırak|sigara|tırnak/.test(s)) return "birakma";
  if (/azalt|daha az|şeker|tatlı|ekran|scroll/.test(s)) return "azaltma";
  if (/her gün|düzen|uyku|su iç|erken/.test(s)) return "duzenlilik";
  if (/ertele|başlayam|proje|tez|rapor/.test(s)) return "erteleme";
  if (/öfke|sinir|kaygı|tartış|sakin|panik/.test(s)) return "duygu";
  return "baslama";
}

// onboarding sayfa akışı: hedef sayısına ve arketipe göre dallanır (v19)
export type OnboardingSayfa =
  | "hedefler"
  | "nedenTek"
  | "secim"
  | "nedenKucuk"
  | "mikro"
  | "deste"
  | "tetikNotu"
  | "nedenCapa"
  | "capa"
  | "soz";

export function akisKur(hedefSayisi: number, aktif: Hedef | null): OnboardingSayfa[] {
  const pull = aktif?.arketip === PULL;
  const tetikli = aktif ? TETIKLI.has(aktif.arketip) : false;
  return [
    "hedefler",
    ...(hedefSayisi > 1 ? (["nedenTek", "secim"] as const) : []),
    "nedenKucuk",
    pull ? "deste" : "mikro",
    ...(tetikli ? (["tetikNotu"] as const) : pull ? [] : (["nedenCapa", "capa"] as const)),
    "soz",
  ];
}
