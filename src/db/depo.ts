// Yerel kalıcılık — expo-sqlite (vizyon 2.0: paket abonelikleri + kanıtlar).
// Kaçırma diye bir kayıt yoktur; yalnızca yapılanlar ("yaptım" = kanıt) saklanır.

import * as SQLite from "expo-sqlite";
import type { PaketId } from "../data/paketler";

export type Abonelik = {
  id: number;
  paketId: PaketId;
  ad: string;
  komutlar: string[];
  gunler: number[]; // 0 = pazartesi ... 6 = pazar
  adet: number;
  pencere: number | null; // PENCERELER indeksi; null = gün bazlı
  pencereGun: Record<number, number> | null; // gün indeksi -> pencere indeksi
  aktif: boolean;
};

export type YeniAbonelik = Omit<Abonelik, "id" | "aktif">;

const db = SQLite.openDatabaseSync("minik.db");

db.execSync(`
  PRAGMA journal_mode = WAL;
  DROP TABLE IF EXISTS ayarlar;
  DROP TABLE IF EXISTS oylar;
  DROP TABLE IF EXISTS kart_gecmisi;
  CREATE TABLE IF NOT EXISTS abonelikler (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paket_id TEXT NOT NULL,
    ad TEXT NOT NULL,
    komutlar TEXT NOT NULL,
    gunler TEXT NOT NULL,
    adet INTEGER NOT NULL,
    pencere INTEGER,
    pencere_gun TEXT,
    aktif INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS kanitlar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gun TEXT NOT NULL,
    zaman TEXT NOT NULL,
    komut TEXT NOT NULL,
    paket_ad TEXT NOT NULL
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

// 0 = pazartesi ... 6 = pazar (JS getDay: 0 = pazar)
export function bugunGunIdx(): number {
  return (new Date().getDay() + 6) % 7;
}

type AbonelikSatiri = {
  id: number;
  paket_id: string;
  ad: string;
  komutlar: string;
  gunler: string;
  adet: number;
  pencere: number | null;
  pencere_gun: string | null;
  aktif: number;
};

function satirdanAbonelik(s: AbonelikSatiri): Abonelik {
  return {
    id: s.id,
    paketId: s.paket_id as PaketId,
    ad: s.ad,
    komutlar: JSON.parse(s.komutlar),
    gunler: JSON.parse(s.gunler),
    adet: s.adet,
    pencere: s.pencere,
    pencereGun: s.pencere_gun ? JSON.parse(s.pencere_gun) : null,
    aktif: s.aktif === 1,
  };
}

export function abonelikleriYukle(): Abonelik[] {
  return db
    .getAllSync<AbonelikSatiri>("SELECT * FROM abonelikler ORDER BY id")
    .map(satirdanAbonelik);
}

export function abonelikEkle(a: YeniAbonelik): Abonelik {
  const sonuc = db.runSync(
    `INSERT INTO abonelikler (paket_id, ad, komutlar, gunler, adet, pencere, pencere_gun, aktif)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    a.paketId,
    a.ad,
    JSON.stringify(a.komutlar),
    JSON.stringify(a.gunler),
    a.adet,
    a.pencere,
    a.pencereGun ? JSON.stringify(a.pencereGun) : null
  );
  return { ...a, id: Number(sonuc.lastInsertRowId), aktif: true };
}

export function abonelikAktifDegistir(id: number, aktif: boolean): void {
  db.runSync("UPDATE abonelikler SET aktif = ? WHERE id = ?", aktif ? 1 : 0, id);
}

export function kanitEkle(komut: string, paketAd: string): void {
  const simdi = new Date();
  db.runSync(
    "INSERT INTO kanitlar (gun, zaman, komut, paket_ad) VALUES (?, ?, ?, ?)",
    isoGun(simdi),
    simdi.toISOString(),
    komut,
    paketAd
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

// son N günün kanıt sayıları, eskiden yeniye (bugün dahil)
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

// rotasyon kuralı için: son çekilen komutlar (yeniden eskiye)
export function sonKomutlar(adet: number): string[] {
  return db
    .getAllSync<{ komut: string }>("SELECT komut FROM son_komutlar ORDER BY id DESC LIMIT ?", adet)
    .map((s) => s.komut);
}

export function sonKomutEkle(komut: string): void {
  db.runSync("INSERT INTO son_komutlar (komut, zaman) VALUES (?, ?)", komut, new Date().toISOString());
}
