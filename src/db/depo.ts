// Yerel kalıcılık — expo-sqlite (bahçe vizyonu v3).
// Kaçırma diye bir kayıt yoktur; yalnız yapılanlar ("yaptım" = kanıt) ve bahçe durumu saklanır.

import * as SQLite from "expo-sqlite";
import type { KategoriId } from "../data/kategoriler";

export type Secim = Partial<Record<KategoriId, string[]>>; // kategori -> seçili alt kategori id'leri

export type Cuzdan = { tohum: number; para: number };

export type Kare = {
  c: number;
  r: number;
  varlik: string; // BAHCE_KATALOG anahtarı
  asama: number | null; // canlılarda 0..max, dekorda null
};

export type SesTercihi = "gunde1" | "gunde3" | "hic";

const db = SQLite.openDatabaseSync("minik.db");

db.execSync(`
  PRAGMA journal_mode = WAL;
  DROP TABLE IF EXISTS abonelikler;
  CREATE TABLE IF NOT EXISTS ayarlar (
    anahtar TEXT PRIMARY KEY,
    deger TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS kareler (
    c INTEGER NOT NULL,
    r INTEGER NOT NULL,
    varlik TEXT NOT NULL,
    asama INTEGER,
    PRIMARY KEY (c, r)
  );
  CREATE TABLE IF NOT EXISTS kanitlar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gun TEXT NOT NULL,
    zaman TEXT NOT NULL,
    komut TEXT NOT NULL,
    kategori TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS son_komutlar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    komut TEXT NOT NULL,
    zaman TEXT NOT NULL
  );
`);

function isoGun(t: Date): string {
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(
    t.getDate()
  ).padStart(2, "0")}`;
}

export function bugunIso(): string {
  return isoGun(new Date());
}

// ── ayarlar (JSON anahtar-değer) ──

function ayarOku<T>(anahtar: string): T | null {
  const s = db.getFirstSync<{ deger: string }>(
    "SELECT deger FROM ayarlar WHERE anahtar = ?",
    anahtar
  );
  if (!s) return null;
  try {
    return JSON.parse(s.deger) as T;
  } catch {
    return null;
  }
}

function ayarYaz(anahtar: string, deger: unknown): void {
  db.runSync(
    "INSERT OR REPLACE INTO ayarlar (anahtar, deger) VALUES (?, ?)",
    anahtar,
    JSON.stringify(deger)
  );
}

export const secimOku = (): Secim | null => ayarOku<Secim>("secim");
export const secimYaz = (s: Secim): void => ayarYaz("secim", s);

export const sesTercihiOku = (): SesTercihi => ayarOku<SesTercihi>("ses") ?? "gunde3";
export const sesTercihiYaz = (s: SesTercihi): void => ayarYaz("ses", s);

export const cuzdanOku = (): Cuzdan => ayarOku<Cuzdan>("cuzdan") ?? { tohum: 0, para: 0 };
export const cuzdanYaz = (c: Cuzdan): void => ayarYaz("cuzdan", c);

export const bolgeAcikMi = (): boolean => ayarOku<boolean>("bolge") ?? false;
export const bolgeAc = (): void => ayarYaz("bolge", true);

// ── bahçe kareleri ──

export function kareleriYukle(): Kare[] {
  return db.getAllSync<Kare>("SELECT c, r, varlik, asama FROM kareler");
}

export function kareYaz(k: Kare): void {
  db.runSync(
    "INSERT OR REPLACE INTO kareler (c, r, varlik, asama) VALUES (?, ?, ?, ?)",
    k.c,
    k.r,
    k.varlik,
    k.asama
  );
}

export function kareSil(c: number, r: number): void {
  db.runSync("DELETE FROM kareler WHERE c = ? AND r = ?", c, r);
}

// ── kanıtlar ──

export function kanitEkle(komut: string, kategori: KategoriId): void {
  const simdi = new Date();
  db.runSync(
    "INSERT INTO kanitlar (gun, zaman, komut, kategori) VALUES (?, ?, ?, ?)",
    isoGun(simdi),
    simdi.toISOString(),
    komut,
    kategori
  );
}

export function toplamKanit(): number {
  return db.getFirstSync<{ n: number }>("SELECT COUNT(*) AS n FROM kanitlar")?.n ?? 0;
}

export function bugunKanit(): number {
  return (
    db.getFirstSync<{ n: number }>("SELECT COUNT(*) AS n FROM kanitlar WHERE gun = ?", bugunIso())
      ?.n ?? 0
  );
}

// son N günün kanıt sayıları, eskiden yeniye (bugün dahil) — geçmiş/uyku için
export function gunlukKanitlar(gunSayisi: number): number[] {
  const satirlar = db.getAllSync<{ gun: string; n: number }>(
    "SELECT gun, COUNT(*) AS n FROM kanitlar GROUP BY gun"
  );
  const sayilar = new Map(satirlar.map((s) => [s.gun, s.n]));
  const sonuc: number[] = [];
  const simdi = new Date();
  for (let i = gunSayisi - 1; i >= 0; i--) {
    const t = new Date(simdi.getFullYear(), simdi.getMonth(), simdi.getDate() - i);
    sonuc.push(sayilar.get(isoGun(t)) ?? 0);
  }
  return sonuc;
}

// ── komut rotasyonu ──

export function sonKomutlar(adet: number): string[] {
  return db
    .getAllSync<{ komut: string }>("SELECT komut FROM son_komutlar ORDER BY id DESC LIMIT ?", adet)
    .map((s) => s.komut);
}

export function sonKomutEkle(komut: string): void {
  db.runSync("INSERT INTO son_komutlar (komut, zaman) VALUES (?, ?)", komut, new Date().toISOString());
}
