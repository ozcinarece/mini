// Yerel kalıcılık — expo-sqlite. Tek veri kaynağı: sayılar buradan konuşur.
// Kaçırma = veri; hiçbir tablo "başarısızlık" tutmaz, sadece yapılanlar kaydedilir.

import * as SQLite from "expo-sqlite";
import type { OnboardingSonuc } from "../engine/arketip";

export type OyTuru = "damga" | "kart" | "direnc";

export type Kayit = {
  sozlesme: OnboardingSonuc;
  baslangicTarihi: string; // ISO gün (sözleşme günü)
};

const db = SQLite.openDatabaseSync("minik.db");

db.execSync(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS ayarlar (
    anahtar TEXT PRIMARY KEY,
    deger TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS oylar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gun TEXT NOT NULL,
    zaman TEXT NOT NULL,
    tur TEXT NOT NULL,
    kart_id TEXT
  );
  CREATE TABLE IF NOT EXISTS kart_gecmisi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kart_id TEXT NOT NULL,
    zaman TEXT NOT NULL
  );
`);

// yerel saat diliminde ISO gün (YYYY-MM-DD)
export function bugunIso(): string {
  const s = new Date();
  return `${s.getFullYear()}-${String(s.getMonth() + 1).padStart(2, "0")}-${String(
    s.getDate()
  ).padStart(2, "0")}`;
}

export function kayitYukle(): Kayit | null {
  const satir = db.getFirstSync<{ deger: string }>(
    "SELECT deger FROM ayarlar WHERE anahtar = 'kayit'"
  );
  if (!satir) return null;
  try {
    return JSON.parse(satir.deger) as Kayit;
  } catch {
    return null;
  }
}

export function kayitSakla(sozlesme: OnboardingSonuc): Kayit {
  const kayit: Kayit = { sozlesme, baslangicTarihi: bugunIso() };
  db.runSync(
    "INSERT OR REPLACE INTO ayarlar (anahtar, deger) VALUES ('kayit', ?)",
    JSON.stringify(kayit)
  );
  return kayit;
}

export function oyEkle(tur: OyTuru, kartId: string | null = null): void {
  db.runSync(
    "INSERT INTO oylar (gun, zaman, tur, kart_id) VALUES (?, ?, ?, ?)",
    bugunIso(),
    new Date().toISOString(),
    tur,
    kartId
  );
}

export function toplamOy(): number {
  const satir = db.getFirstSync<{ n: number }>("SELECT COUNT(*) AS n FROM oylar");
  return satir?.n ?? 0;
}

export function bugunOyVar(): boolean {
  const satir = db.getFirstSync<{ n: number }>(
    "SELECT COUNT(*) AS n FROM oylar WHERE gun = ?",
    bugunIso()
  );
  return (satir?.n ?? 0) > 0;
}

// içinde bulunulan haftanın (sözleşme gününe göre) kart oyu sayısı — 🧺 hafta hedefi
export function buHaftaKartSayisi(baslangicTarihi: string): number {
  const baslangic = new Date(baslangicTarihi + "T00:00:00");
  const bugun = new Date(bugunIso() + "T00:00:00");
  const gecenGun = Math.floor((bugun.getTime() - baslangic.getTime()) / 86400000);
  const haftaBasi = new Date(baslangic.getTime() + Math.floor(gecenGun / 7) * 7 * 86400000);
  const haftaBasiIso = `${haftaBasi.getFullYear()}-${String(haftaBasi.getMonth() + 1).padStart(2, "0")}-${String(haftaBasi.getDate()).padStart(2, "0")}`;
  const satir = db.getFirstSync<{ n: number }>(
    "SELECT COUNT(*) AS n FROM oylar WHERE tur = 'kart' AND gun >= ?",
    haftaBasiIso
  );
  return satir?.n ?? 0;
}

// deste kuralı için: son çekilen kartların kimlikleri (yeniden eskiye)
export function sonKartlar(adet: number): string[] {
  const satirlar = db.getAllSync<{ kart_id: string }>(
    "SELECT kart_id FROM kart_gecmisi ORDER BY id DESC LIMIT ?",
    adet
  );
  return satirlar.map((s) => s.kart_id);
}

export function kartGecmisineEkle(kartId: string): void {
  db.runSync(
    "INSERT INTO kart_gecmisi (kart_id, zaman) VALUES (?, ?)",
    kartId,
    new Date().toISOString()
  );
}

// kaçıncı haftadayız (1'den başlar) — sözleşme gününe göre
export function haftaNo(baslangicTarihi: string): number {
  const baslangic = new Date(baslangicTarihi + "T00:00:00");
  const bugun = new Date(bugunIso() + "T00:00:00");
  const gecenGun = Math.floor((bugun.getTime() - baslangic.getTime()) / 86400000);
  return Math.floor(Math.max(0, gecenGun) / 7) + 1;
}

// yalnızca geliştirme/testte kullanılır
export function tumunuSil(): void {
  db.execSync("DELETE FROM ayarlar; DELETE FROM oylar; DELETE FROM kart_gecmisi;");
}
