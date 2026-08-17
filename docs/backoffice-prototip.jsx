import React, { useState } from "react";

// ═══════════ minik · BACKOFFICE — oyun yönetim paneli (tasarım prototipi) ═══════════
// Mimari: bu panel tek bir oyun-config JSON'unu düzenler; uygulama bu config'den beslenir.

const css = `
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; } button { cursor: pointer; -webkit-tap-highlight-color: transparent; } button:focus { outline: none; }
input, select, textarea { font-family: 'Figtree', sans-serif; outline: none; }
::-webkit-scrollbar { width: 8px; height: 8px; } ::-webkit-scrollbar-thumb { background: #C9CFC2; border-radius: 8px; }
`;
const C = { bg: "#F3F4F0", yan: "#2C352E", yanAcik: "#3A453C", kart: "#FFFFFF", cizgi: "#E3E6DE",
  ink: "#2C352E", soluk: "#7C8578", yesil: "#6F9A44", yesilK: "#587C34", altin: "#C99A3F", kirmizi: "#C75B4A", mavi: "#4A8FA0" };
const GUNLER = ["pzt", "sal", "çar", "per", "cum", "cmt", "paz"];
const YASAK = ["kaçırdın", "başarısız", "seri", "streak", "maalesef", "hadi", "haydi", "utanç", "tembel"];

/* ── ortak parçalar ── */
const Kart = ({ baslik, alt, children, style }) => (
  <div style={{ background: C.kart, borderRadius: 14, border: `1px solid ${C.cizgi}`, padding: "16px 18px", ...style }}>
    {baslik && <div style={{ fontWeight: 800, fontSize: 14.5, color: C.ink }}>{baslik}</div>}
    {alt && <div style={{ fontSize: 12, color: C.soluk, marginTop: 2, marginBottom: 10 }}>{alt}</div>}
    {children}
  </div>
);
const Num = ({ v, on, w = 64 }) => (
  <input type="number" value={v} onChange={e => on(Number(e.target.value))}
    style={{ width: w, padding: "6px 8px", borderRadius: 8, border: `1.5px solid ${C.cizgi}`, fontWeight: 700, fontSize: 13.5, color: C.ink, textAlign: "center" }} />
);
const Metin = ({ v, on, ph, w = "100%" }) => (
  <input value={v} onChange={e => on(e.target.value)} placeholder={ph}
    style={{ width: w, padding: "7px 10px", borderRadius: 8, border: `1.5px solid ${C.cizgi}`, fontSize: 13, color: C.ink }} />
);
const Sec = ({ v, on, ops }) => (
  <select value={v} onChange={e => on(e.target.value)}
    style={{ padding: "6px 8px", borderRadius: 8, border: `1.5px solid ${C.cizgi}`, fontSize: 12.5, fontWeight: 600, color: C.ink, background: "#FFF" }}>
    {ops.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);
const Anahtar = ({ v, on }) => (
  <button onClick={() => on(!v)} style={{ width: 40, height: 22, borderRadius: 999, border: "none", background: v ? C.yesil : "#D4D8CE", position: "relative", transition: "background .25s" }}>
    <span style={{ position: "absolute", top: 2.5, left: v ? 20 : 3, width: 17, height: 17, borderRadius: 999, background: "#FFF", transition: "left .25s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
  </button>
);
const Cip = ({ txt, ton = C.soluk, bg = "#F0F2EC" }) => (
  <span style={{ fontSize: 11, fontWeight: 800, color: ton, background: bg, borderRadius: 999, padding: "3px 9px", whiteSpace: "nowrap" }}>{txt}</span>
);
const SuDizi = ({ asama, su = [], on }) => (
  <span style={{ display: "inline-flex", gap: 3 }}>
    {Array.from({ length: Math.max(0, asama - 1) }).map((_, i) => (
      <input key={i} type="number" value={su[i] ?? 1}
        onChange={e => { const y = [...su]; y[i] = Number(e.target.value); on(y); }}
        style={{ width: 30, padding: "4px 2px", borderRadius: 6, border: `1.5px solid ${C.cizgi}`, fontWeight: 700, fontSize: 12, textAlign: "center", color: C.ink }} />
    ))}
  </span>
);
const Sil = ({ on }) => <button onClick={on} style={{ border: "none", background: "none", color: C.kirmizi, fontWeight: 800, fontSize: 15 }}>×</button>;
const Ekle = ({ on, txt = "+ ekle" }) => (
  <button onClick={on} style={{ border: `1.5px dashed ${C.yesil}`, background: "none", color: C.yesil, fontWeight: 800, fontSize: 12.5, borderRadius: 999, padding: "6px 14px" }}>{txt}</button>
);
const yasakBul = (t) => YASAK.filter(y => (t || "").toLowerCase().includes(y));

/* ── başlangıç config ── */
const ILK = {
  ekonomi: {
    anlikSu: 1, gunlukTohum: 2, haftalikBonus: 4, ilkKanitBonus: 1,
    gorevTavani: 5, suDepoMax: 10, kademeMax: 3, hasatKademeCarpani: true,
    sandikPara: 15, sandikKural: 5, uykuGun: 2, kademeEkSu: 1,
  },
  paketler: [
    { id: "ev", ad: "ev düzeni", emoji: "🏡", renk: "#E8945A", aile: "bahçe çiçekleri", yoklama: "bugün eve bir dokunuş yaptın mı?", aktif: true,
      komutlar: [
        { id: 1, metin: "gözüne ilişen beş şeyi yerine koy", zorluk: 1, ctx: "her yer", aktif: true, bil: true, pen: "varsayılan", gunler: ["pzt", "çar", "cum"], bildirimler: [{ id: 1, metin: "beş şey, beş dakika — göz gezdir yeter 🌷", aktif: true }, { id: 2, metin: "ortalıkta beş kaçak var, yerlerine dönmek istiyorlar", aktif: true }] },
        { id: 2, metin: "bir yüzeyi tamamen boşalt", zorluk: 2, ctx: "her yer", aktif: true, bil: true, pen: "gün boyu", gunler: ["cmt"], bildirimler: [{ id: 1, metin: "tek yüzey: tezgah mı sehpa mı, seçim senin", aktif: true }] },
        { id: 3, metin: "bir çekmeceyi düzenle — sadece bir", zorluk: 2, ctx: "her yer", aktif: true, bil: false, pen: "varsayılan", gunler: [], bildirimler: [] },
      ] },
    { id: "kitap", ad: "kitap okuma", emoji: "📖", renk: "#C9A544", aile: "ayçiçekleri", yoklama: "bugün kitap okudun mu?", aktif: true,
      komutlar: [
        { id: 1, metin: "bir paragraf yeter — kapıyı arala", zorluk: 1, ctx: "her yer", aktif: true, bil: true, pen: "akşam", gunler: ["pzt", "sal", "çar", "per", "cum", "cmt", "paz"], bildirimler: [{ id: 1, metin: "bir paragraf ayçiçeğini sular 🌻", aktif: true }] },
        { id: 2, metin: "iki sayfa: söz bu kadar", zorluk: 1, ctx: "her yer", aktif: true, bil: true, pen: "akşam", gunler: ["paz"], bildirimler: [] },
      ] },
    { id: "su", ad: "su & hareket", emoji: "💧", renk: "#4A8FA0", aile: "su kenarı", yoklama: "bugün bedenine iyi baktın mı?", aktif: true,
      komutlar: [ { id: 1, metin: "bir bardak su", zorluk: 1, ctx: "her yer", aktif: true, bil: true, pen: "gün boyu", gunler: ["pzt", "sal", "çar", "per", "cum"], bildirimler: [{ id: 1, metin: "bir bardak su — nilüferin de susadı 💧", aktif: true }] } ] },
    { id: "ekran", ad: "ekran molası", emoji: "🌿", renk: "#9D8DF2", aile: "lavantalar", yoklama: "bugün ekransız bir an yaşadın mı?", aktif: false,
      komutlar: [ { id: 1, metin: "ekransız beş dakika", zorluk: 1, ctx: "her yer", aktif: true, bil: true, pen: "varsayılan", gunler: [], bildirimler: [] } ] },
  ],
  ekGorevler: [
    { id: 1, ad: "hafta sonu bahçe turu", tip: "haftalık", paket: "ev", odulTip: "tohum", odul: 5, aktif: true },
    { id: 2, ad: "bu ay 3 kitap görevi üst üste", tip: "özel", paket: "kitap", odulTip: "para", odul: 10, aktif: false },
  ],
  katalog: [
    { id: "aycicegi", ad: "ayçiçeği", tip: "çiçek", aile: "ayçiçekleri", fiyat: 4, birim: "tohum", asama: 4, gelir: 2, su: [1, 2, 3], esik: 0, sprite: true, aktif: true },
    { id: "papatya", ad: "papatya", tip: "çiçek", aile: "bahçe çiçekleri", fiyat: 3, birim: "tohum", asama: 3, gelir: 2, su: [1, 2], esik: 0, sprite: false, aktif: true },
    { id: "domates", ad: "domates", tip: "sebze", aile: "bahçe çiçekleri", fiyat: 6, birim: "tohum", asama: 4, gelir: 4, su: [1, 2, 2], esik: 0, sprite: false, aktif: true },
    { id: "lavanta", ad: "lavanta", tip: "çiçek", aile: "lavantalar", fiyat: 5, birim: "tohum", asama: 4, gelir: 3, su: [1, 2, 3], esik: 15, sprite: false, aktif: true },
    { id: "nilüfer", ad: "nilüfer", tip: "çiçek", aile: "su kenarı", fiyat: 6, birim: "tohum", asama: 3, gelir: 3, su: [1, 2], esik: 20, sprite: false, aktif: true },
    { id: "kabak", ad: "kabak", tip: "sebze", aile: "bahçe çiçekleri", fiyat: 10, birim: "tohum", asama: 4, gelir: 8, su: [2, 2, 3], esik: 30, sprite: false, aktif: true },
    { id: "gul", ad: "gül ✨", tip: "çiçek", aile: "bahçe çiçekleri", fiyat: 6, birim: "tohum", asama: 4, gelir: 4, su: [1, 2, 2], esik: -1, sprite: false, aktif: true },
    { id: "cit", ad: "çit", tip: "dekor", aile: "-", fiyat: 6, birim: "para", asama: 0, gelir: 0, esik: 0, sprite: false, aktif: true },
    { id: "fener", ad: "fener", tip: "dekor", aile: "-", fiyat: 14, birim: "para", asama: 0, gelir: 0, esik: 0, sprite: false, aktif: true },
    { id: "bank", ad: "bank", tip: "dekor", aile: "-", fiyat: 20, birim: "para", asama: 0, gelir: 0, esik: 25, sprite: false, aktif: true },
  ],
  bolgeler: [
    { id: 1, ad: "başlangıç bahçesi", fiyat: 0, kanit: 0, boyut: "5×5", aktif: true },
    { id: 2, ad: "doğu tarlası", fiyat: 40, kanit: 25, boyut: "2×5", aktif: true },
    { id: 3, ad: "gölet kıyısı", fiyat: 80, kanit: 60, boyut: "3×4", aktif: true },
  ],
  pencereler: [ { id: 1, ad: "sabah", saat: "08–12" }, { id: 2, ad: "gün boyu", saat: "09–21" }, { id: 3, ad: "akşam", saat: "18–23" } ],
  bildirimYedek: "küçük bir şey var: {görev}",
};

/* ═══════ SAYFALAR ═══════ */
function Panel({ cfg }) {
  const st = [
    ["aktif paket", cfg.paketler.filter(p => p.aktif).length, "toplam " + cfg.paketler.length],
    ["komut havuzu", cfg.paketler.reduce((a, p) => a + p.komutlar.filter(k => k.aktif).length, 0), "aktif komut"],
    ["katalog", cfg.katalog.filter(k => k.aktif).length + " öğe", cfg.katalog.filter(k => k.sprite).length + " sprite hazır"],
    ["günlük ses tavanı", cfg.ekonomi.gorevTavani, "bildirim/gün"],
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12 }}>
      {st.map(([a, b, c]) => (
        <Kart key={a}><div style={{ fontSize: 12, color: C.soluk, fontWeight: 700 }}>{a}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.ink, margin: "4px 0 2px" }}>{b}</div>
          <div style={{ fontSize: 11.5, color: C.soluk }}>{c}</div></Kart>
      ))}
      <Kart baslik="canlı metrikler" alt="uygulama canlıya bağlanınca dolar" style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["DAU / WAU", "günlük ort. kanıt", "yoklama cevap oranı", "anlık görev dönüş oranı", "sandık açılma", "D7 tutundurma", "ort. bahçe kademesi"].map(m => <Cip key={m} txt={m} />)}
        </div>
      </Kart>
    </div>
  );
}

function Paketler({ cfg, set }) {
  const [sec, setSec] = useState(cfg.paketler[0].id);
  const p = cfg.paketler.find(x => x.id === sec);
  const gnc = (patch) => set(c => ({ ...c, paketler: c.paketler.map(x => x.id === sec ? { ...x, ...patch } : x) }));
  const komutGnc = (kid, patch) => gnc({ komutlar: p.komutlar.map(k => k.id === kid ? { ...k, ...patch } : k) });
  const RENKLER = ["#E8945A", "#C9A544", "#4A8FA0", "#9D8DF2", "#6F9A44", "#C75B7A"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "190px 1fr", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {cfg.paketler.map(x => (
          <button key={x.id} onClick={() => setSec(x.id)} style={{ textAlign: "left", background: sec === x.id ? "#FFF" : "transparent",
            border: `1px solid ${sec === x.id ? C.cizgi : "transparent"}`, borderRadius: 10, padding: "9px 11px", fontWeight: 700, fontSize: 13, color: x.aktif ? C.ink : C.soluk }}>
            {x.emoji} {x.ad} {!x.aktif && <Cip txt="pasif" />}
          </button>
        ))}
        <Ekle txt="+ yeni paket" on={() => { const id = "p" + Date.now(); set(c => ({ ...c, paketler: [...c.paketler, { id, ad: "yeni paket", emoji: "📦", renk: "#6F9A44", aile: "-", yoklama: "", aktif: false, komutlar: [] }] })); setSec(id); }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Kart baslik="paket kimliği">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <Metin v={p.emoji} on={v => gnc({ emoji: v })} w={52} />
            <Metin v={p.ad} on={v => gnc({ ad: v })} w={160} />
            <span style={{ fontSize: 12, color: C.soluk, fontWeight: 700 }}>tohum ailesi:</span>
            <Metin v={p.aile} on={v => gnc({ aile: v })} w={140} ph="ör. lavantalar" />
            <span style={{ fontSize: 12, color: C.soluk, fontWeight: 700 }}>renk:</span>
            {RENKLER.map(r => (
              <button key={r} onClick={() => gnc({ renk: r })} style={{ width: 22, height: 22, borderRadius: 999, background: r, border: p.renk === r ? "3px solid #2C352E" : "2px solid #FFF", boxShadow: "0 1px 4px rgba(0,0,0,.15)" }} />
            ))}
            <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: C.soluk, fontWeight: 700 }}>aktif</span><Anahtar v={p.aktif} on={v => gnc({ aktif: v })} />
            </span>
          </div>
          <div style={{ fontSize: 11.5, color: C.soluk, marginTop: 8 }}>renk + aile = bahçedeki kategori ayrışması: bu paketin görevleri bu ailenin bitkilerini besler.</div>
        </Kart>
        <Kart baslik="🌙 günlük yoklama sorusu" alt="akşam tek soru — evet = +tohum. suçluluk sözlüğü denetlenir.">
          <Metin v={p.yoklama} on={v => gnc({ yoklama: v })} ph="bugün ... yaptın mı?" />
          {yasakBul(p.yoklama).length > 0 && <div style={{ color: C.kirmizi, fontSize: 12, fontWeight: 700, marginTop: 6 }}>⚠ yasak sözlük: {yasakBul(p.yoklama).join(", ")}</div>}
        </Kart>
        <Kart baslik="🔔 anlık görev komutları" alt="görev İÇERİĞİ burada · bildirim metinleri/saatleri 🔔 bildirimler sayfasında görev bazlı yönetilir · rotasyon: son 3 tekrar etmez, zorluk-3 üst üste gelmez">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ color: C.soluk, fontSize: 11.5, textAlign: "left" }}>
              <th style={{ padding: "4px 6px" }}>komut</th><th>zorluk</th><th>bağlam</th><th>aktif</th><th /></tr></thead>
            <tbody>
              {p.komutlar.map(k => (
                <tr key={k.id} style={{ borderTop: `1px solid ${C.cizgi}` }}>
                  <td style={{ padding: "6px 6px", width: "55%" }}>
                    <Metin v={k.metin} on={v => komutGnc(k.id, { metin: v })} />
                    {yasakBul(k.metin).length > 0 && <div style={{ color: C.kirmizi, fontSize: 11, fontWeight: 700 }}>⚠ {yasakBul(k.metin).join(", ")}</div>}
                  </td>
                  <td><Sec v={k.zorluk} on={v => komutGnc(k.id, { zorluk: Number(v) })} ops={[1, 2, 3]} /></td>
                  <td><Sec v={k.ctx} on={v => komutGnc(k.id, { ctx: v })} ops={["her yer", "ev", "mutfak", "telefon", "dışarı"]} /></td>
                  <td><Anahtar v={k.aktif} on={v => komutGnc(k.id, { aktif: v })} /></td>
                  <td><Sil on={() => gnc({ komutlar: p.komutlar.filter(x => x.id !== k.id) })} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 8 }}><Ekle txt="+ komut" on={() => gnc({ komutlar: [...p.komutlar, { id: Date.now(), metin: "", zorluk: 1, ctx: "her yer", aktif: true, bil: true, pen: "varsayılan", gunler: [], bildirimler: [] }] })} /></div>
        </Kart>
      </div>
    </div>
  );
}

function EkGorevler({ cfg, set }) {
  const gnc = (id, patch) => set(c => ({ ...c, ekGorevler: c.ekGorevler.map(g => g.id === id ? { ...g, ...patch } : g) }));
  return (
    <Kart baslik="ek görevler" alt="haftalık hedefler ve dönemsel özel görevler — ana akışın üstüne bonus">
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead><tr style={{ color: C.soluk, fontSize: 11.5, textAlign: "left" }}>
          <th style={{ padding: "4px 6px" }}>görev</th><th>tip</th><th>paket</th><th>ödül</th><th>miktar</th><th>aktif</th><th /></tr></thead>
        <tbody>
          {cfg.ekGorevler.map(g => (
            <tr key={g.id} style={{ borderTop: `1px solid ${C.cizgi}` }}>
              <td style={{ padding: "6px", width: "38%" }}><Metin v={g.ad} on={v => gnc(g.id, { ad: v })} /></td>
              <td><Sec v={g.tip} on={v => gnc(g.id, { tip: v })} ops={["haftalık", "özel", "mevsimlik"]} /></td>
              <td><Sec v={g.paket} on={v => gnc(g.id, { paket: v })} ops={["hepsi", ...cfg.paketler.map(p => p.id)]} /></td>
              <td><Sec v={g.odulTip} on={v => gnc(g.id, { odulTip: v })} ops={["tohum", "para", "su", "nadir tohum"]} /></td>
              <td><Num v={g.odul} on={v => gnc(g.id, { odul: v })} w={56} /></td>
              <td><Anahtar v={g.aktif} on={v => gnc(g.id, { aktif: v })} /></td>
              <td><Sil on={() => set(c => ({ ...c, ekGorevler: c.ekGorevler.filter(x => x.id !== g.id) }))} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 8 }}><Ekle txt="+ ek görev" on={() => set(c => ({ ...c, ekGorevler: [...c.ekGorevler, { id: Date.now(), ad: "", tip: "haftalık", paket: "hepsi", odulTip: "tohum", odul: 3, aktif: false }] }))} /></div>
    </Kart>
  );
}

function Katalog({ cfg, set }) {
  const gnc = (id, patch) => set(c => ({ ...c, katalog: c.katalog.map(k => k.id === id ? { ...k, ...patch } : k) }));
  return (
    <Kart baslik="bahçe kataloğu" alt="eşik: -1 = sadece sandıktan · 💧 su/aşama: her aşama geçişi için gereken sulama (görev) sayısı, soldan sağa · gelir kademe ile çarpılır">
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 720 }}>
          <thead><tr style={{ color: C.soluk, fontSize: 11, textAlign: "left" }}>
            <th style={{ padding: "4px 6px" }}>ad</th><th>tip</th><th>aile</th><th>fiyat</th><th>birim</th><th>aşama</th><th>💧 su/aşama</th><th>gelir</th><th>eşik (kanıt)</th><th>sprite</th><th>aktif</th><th /></tr></thead>
          <tbody>
            {cfg.katalog.map(k => (
              <tr key={k.id} style={{ borderTop: `1px solid ${C.cizgi}` }}>
                <td style={{ padding: "5px 6px" }}><Metin v={k.ad} on={v => gnc(k.id, { ad: v })} w={110} /></td>
                <td><Sec v={k.tip} on={v => gnc(k.id, { tip: v })} ops={["çiçek", "sebze", "dekor", "ağaç"]} /></td>
                <td><Sec v={k.aile} on={v => gnc(k.id, { aile: v })} ops={["-", ...new Set(cfg.paketler.map(p => p.aile))]} /></td>
                <td><Num v={k.fiyat} on={v => gnc(k.id, { fiyat: v })} w={56} /></td>
                <td><Sec v={k.birim} on={v => gnc(k.id, { birim: v })} ops={["tohum", "para"]} /></td>
                <td><Num v={k.asama} on={v => gnc(k.id, { asama: v })} w={50} /></td>
                <td>{k.tip === "dekor" ? <span style={{ fontSize: 11, color: C.soluk }}>—</span> : <SuDizi asama={k.asama} su={k.su} on={v => gnc(k.id, { su: v })} />}</td>
                <td><Num v={k.gelir} on={v => gnc(k.id, { gelir: v })} w={50} /></td>
                <td><Num v={k.esik} on={v => gnc(k.id, { esik: v })} w={60} /></td>
                <td>{k.sprite ? <Cip txt="hazır ✓" ton={C.yesilK} bg="#EAF2DF" /> : <Cip txt="bekliyor" ton={C.altin} bg="#F7EFD9" />}</td>
                <td><Anahtar v={k.aktif} on={v => gnc(k.id, { aktif: v })} /></td>
                <td><Sil on={() => set(c => ({ ...c, katalog: c.katalog.filter(x => x.id !== k.id) }))} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 8 }}><Ekle txt="+ katalog öğesi" on={() => set(c => ({ ...c, katalog: [...c.katalog, { id: "k" + Date.now(), ad: "", tip: "çiçek", aile: "-", fiyat: 4, birim: "tohum", asama: 4, gelir: 2, esik: 0, sprite: false, aktif: false }] }))} /></div>
    </Kart>
  );
}

function Ekonomi({ cfg, set }) {
  const e = cfg.ekonomi;
  const g = (k, v) => set(c => ({ ...c, ekonomi: { ...c.ekonomi, [k]: v } }));
  const Satir = ({ ad, alt, k, birim }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderTop: `1px solid ${C.cizgi}` }}>
      <div><div style={{ fontWeight: 700, fontSize: 13.5, color: C.ink }}>{ad}</div><div style={{ fontSize: 11.5, color: C.soluk }}>{alt}</div></div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Num v={e[k]} on={v => g(k, v)} /><span style={{ fontSize: 12, color: C.soluk, fontWeight: 700, width: 42 }}>{birim}</span></div>
    </div>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 12 }}>
      <Kart baslik="kazanç kuralları">
        <Satir ad="🔔 anlık görev → su" alt="bildirimden 'yaptım': bitki büyür / depo dolar" k="anlikSu" birim="💧" />
        <Satir ad="🌙 günlük yoklama → tohum" alt="paket başına akşam tek soru" k="gunlukTohum" birim="🌰" />
        <Satir ad="📅 haftalık ritim bonusu" alt="paketin haftalık hedefi tuttuysa" k="haftalikBonus" birim="🌰" />
        <Satir ad="günün ilk kanıtı bonusu" alt="ilk 'yaptım'a ek" k="ilkKanitBonus" birim="🌰" />
      </Kart>
      <Kart baslik="sınırlar (huzur korumaları)">
        <Satir ad="günlük ses tavanı" alt="tüm paketlerin toplam bildirimi — pazarlıksız" k="gorevTavani" birim="adet" />
        <Satir ad="su deposu kapasitesi" alt="ekili bitki yokken biriken su" k="suDepoMax" birim="💧" />
        <Satir ad="maks. yatak kademesi" alt="K1→K3: her döngüde daha görkemli" k="kademeMax" birim="kd" />
        <Satir ad="uykuya dalma eşiği" alt="bu kadar gün kanıt yoksa bitkiler uyur (ölmez)" k="uykuGun" birim="gün" />
        <Satir ad="kademe başına ek su" alt="K2 aşamaları +1, K3 +2 su ister — döngüler olgunlaştıkça uzar" k="kademeEkSu" birim="💧" />
      </Kart>
      <Kart baslik="hasat & sandık">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0" }}>
          <div><div style={{ fontWeight: 700, fontSize: 13.5 }}>kademe geliri çarpar</div><div style={{ fontSize: 11.5, color: C.soluk }}>K2 hasadı 2×, K3 hasadı 3× para</div></div>
          <Anahtar v={e.hasatKademeCarpani} on={v => g("hasatKademeCarpani", v)} />
        </div>
        <Satir ad="🎁 sandık parası" alt="haftalık sandığın para ödülü (+ nadir tohum)" k="sandikPara" birim="🪙" />
        <Satir ad="sandık kuralı" alt="7 günün kaçında kanıt gerekir (oran dili, seri değil)" k="sandikKural" birim="gün" />
      </Kart>
      <Kart baslik="ekonomi ilkeleri (kilitli)" alt="CLAUDE.md anayasası — panelden değiştirilemez">
        {["💧 su KATEGORİYE akar: görev hangi paketten geldiyse o ailenin bitkilerini büyütür (aile boşsa depoya)", "para SADECE hasattan gelir", "zaman değil emek büyütür (bekleme sayacı yasak)", "sulama mekaniği yok: görev = su", "tohum verilmez, seçilir (hediye = nadir an)", "bitki ölmez, uyur", "suçluluk sözlüğü yasak"].map(t => (
          <div key={t} style={{ fontSize: 12.5, color: C.soluk, padding: "5px 0", borderTop: `1px solid ${C.cizgi}` }}>🔒 {t}</div>
        ))}
      </Kart>
    </div>
  );
}

function Ilerleme({ cfg, set }) {
  const esikli = cfg.katalog.filter(k => k.esik > 0).sort((a, b) => a.esik - b.esik);
  const gncB = (id, patch) => set(c => ({ ...c, bolgeler: c.bolgeler.map(b => b.id === id ? { ...b, ...patch } : b) }));
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Kart baslik="açılış merdiveni" alt="katalogdaki eşiklerden otomatik derlenir — dükkânda '🔒 12/15 kanıt' olarak görünür">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <Cip txt="başlangıç: eşiksiz öğeler" ton={C.yesilK} bg="#EAF2DF" />
          {esikli.map(k => <Cip key={k.id} txt={`${k.esik} kanıt → ${k.ad}`} />)}
          <Cip txt="sandık → gül ✨" ton={C.altin} bg="#F7EFD9" />
        </div>
      </Kart>
      <Kart baslik="bölgeler" alt="bahçe genişlemesi: para + toplam kanıt koşulu">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ color: C.soluk, fontSize: 11.5, textAlign: "left" }}>
            <th style={{ padding: "4px 6px" }}>bölge</th><th>boyut</th><th>fiyat 🪙</th><th>kanıt koşulu</th><th>aktif</th><th /></tr></thead>
          <tbody>
            {cfg.bolgeler.map(b => (
              <tr key={b.id} style={{ borderTop: `1px solid ${C.cizgi}` }}>
                <td style={{ padding: "5px 6px" }}><Metin v={b.ad} on={v => gncB(b.id, { ad: v })} w={160} /></td>
                <td><Metin v={b.boyut} on={v => gncB(b.id, { boyut: v })} w={60} /></td>
                <td><Num v={b.fiyat} on={v => gncB(b.id, { fiyat: v })} /></td>
                <td><Num v={b.kanit} on={v => gncB(b.id, { kanit: v })} /></td>
                <td><Anahtar v={b.aktif} on={v => gncB(b.id, { aktif: v })} /></td>
                <td><Sil on={() => set(c => ({ ...c, bolgeler: c.bolgeler.filter(x => x.id !== b.id) }))} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 8 }}><Ekle txt="+ bölge" on={() => set(c => ({ ...c, bolgeler: [...c.bolgeler, { id: Date.now(), ad: "yeni bölge", fiyat: 100, kanit: 80, boyut: "3×3", aktif: false }] }))} /></div>
      </Kart>
    </div>
  );
}

function Bildirimler({ cfg, set }) {
  const [sec, setSec] = useState(cfg.paketler[0].id);
  const p = cfg.paketler.find(x => x.id === sec);
  const kGnc = (kid, patch) => set(c => ({ ...c, paketler: c.paketler.map(x => x.id === sec ? { ...x, komutlar: x.komutlar.map(k => k.id === kid ? { ...k, ...patch } : k) } : x) }));
  const vGnc = (k, vid, patch) => kGnc(k.id, { bildirimler: k.bildirimler.map(b => b.id === vid ? { ...b, ...patch } : b) });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "190px 1fr", gap: 12 }}>
      {/* kategori seçimi */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {cfg.paketler.map(x => (
          <button key={x.id} onClick={() => setSec(x.id)} style={{ textAlign: "left", background: sec === x.id ? "#FFF" : "transparent",
            border: `1px solid ${sec === x.id ? C.cizgi : "transparent"}`, borderRadius: 10, padding: "9px 11px", fontWeight: 700, fontSize: 13,
            color: x.aktif ? C.ink : C.soluk, display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 9, height: 9, borderRadius: 999, background: x.renk }} />{x.emoji} {x.ad}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* görev bazlı bildirim kartları */}
        {p.komutlar.map(k => (
          <Kart key={k.id} style={{ borderLeft: `4px solid ${k.bil ? p.renk : C.cizgi}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontWeight: 800, fontSize: 13.5, color: C.ink, flex: 1 }}>{k.metin || "(isimsiz görev)"}</div>
              <span style={{ fontSize: 11.5, color: C.soluk, fontWeight: 700 }}>bildirim</span>
              <Anahtar v={k.bil} on={v => kGnc(k.id, { bil: v })} />
            </div>
            {k.bil && (
              <div style={{ marginTop: 10 }}>
                {/* varyant metinleri */}
                {(k.bildirimler || []).map(b => (
                  <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                    <div style={{ flex: 1 }}>
                      <Metin v={b.metin} on={v => vGnc(k, b.id, { metin: v })} ph="bildirim metni — kullanıcının göreceği cümle" />
                      {yasakBul(b.metin).length > 0 && <div style={{ color: C.kirmizi, fontSize: 11, fontWeight: 700, marginTop: 2 }}>⚠ yasak sözlük: {yasakBul(b.metin).join(", ")}</div>}
                    </div>
                    <Anahtar v={b.aktif} on={v => vGnc(k, b.id, { aktif: v })} />
                    <Sil on={() => kGnc(k.id, { bildirimler: k.bildirimler.filter(x => x.id !== b.id) })} />
                  </div>
                ))}
                <div style={{ margin: "4px 0 10px" }}>
                  <Ekle txt="+ metin varyantı" on={() => kGnc(k.id, { bildirimler: [...(k.bildirimler || []), { id: Date.now(), metin: "", aktif: true }] })} />
                  {(k.bildirimler || []).filter(b => b.aktif).length === 0 &&
                    <span style={{ fontSize: 11.5, color: C.altin, fontWeight: 700, marginLeft: 10 }}>varyant yok → yedek şablon kullanılır</span>}
                </div>
                {/* zamanlama: pencere + günler */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", borderTop: `1px solid ${C.cizgi}`, paddingTop: 9 }}>
                  <span style={{ fontSize: 12, color: C.soluk, fontWeight: 700 }}>pencere:</span>
                  <Sec v={k.pen} on={v => kGnc(k.id, { pen: v })} ops={["varsayılan", "sabah", "gün boyu", "akşam"]} />
                  <span style={{ fontSize: 12, color: C.soluk, fontWeight: 700, marginLeft: 6 }}>günler:</span>
                  {GUNLER.map(g => {
                    const on = (k.gunler || []).includes(g);
                    return (
                      <button key={g} onClick={() => kGnc(k.id, { gunler: on ? k.gunler.filter(x => x !== g) : [...(k.gunler || []), g] })}
                        style={{ fontSize: 11, fontWeight: 800, borderRadius: 999, padding: "4px 9px", border: `1.5px solid ${on ? p.renk : C.cizgi}`,
                          background: on ? p.renk : "#FFF", color: on ? "#FFF" : C.soluk }}>{g}</button>
                    );
                  })}
                  {(k.gunler || []).length === 0 && <span style={{ fontSize: 11.5, color: C.soluk }}>gün seçilmedi → kullanıcının paket takvimi geçerli</span>}
                </div>
              </div>
            )}
          </Kart>
        ))}

        {/* yedek şablon + ilkeler */}
        <Kart baslik="yedek şablon" alt="varyantı olmayan görevler için tek satır — {görev} yerine komut metni gelir">
          <Metin v={cfg.bildirimYedek} on={v => set(c => ({ ...c, bildirimYedek: v }))} />
          {yasakBul(cfg.bildirimYedek).length > 0 && <div style={{ color: C.kirmizi, fontSize: 11.5, fontWeight: 700, marginTop: 4 }}>⚠ yasak sözlük</div>}
        </Kart>
        <Kart baslik="zamanlama ilkeleri (kilitli)">
          {["günlük toplam tavan her koşulda geçerli (ekonomi sayfası)", "pencere/günler kullanıcının kendi kurulumuyla KESİŞTİRİLİR — asla genişletmez", "tarife kullanıcıya gösterilmez; saatler pencere içine hafif rastgele dağıtılır", "varyantlar rotasyonla döner, aynı metin üst üste gitmez"].map(t => (
            <div key={t} style={{ fontSize: 12.5, color: C.soluk, padding: "5px 0", borderTop: `1px solid ${C.cizgi}` }}>🔒 {t}</div>
          ))}
        </Kart>
      </div>
    </div>
  );
}

function Disari({ cfg }) {
  return (
    <Kart baslik="oyun-config.json" alt="uygulama bu dosyadan beslenir — Claude Code bunu repo'daki data/oyun-config.json'a yazar">
      <pre style={{ background: "#2C352E", color: "#D8E0D2", borderRadius: 10, padding: 14, fontSize: 11, overflow: "auto", maxHeight: 420, lineHeight: 1.5 }}>
        {JSON.stringify(cfg, null, 2)}
      </pre>
    </Kart>
  );
}

/* ═══════ KABUK ═══════ */
const MENU = [
  ["panel", "📊 panel"], ["paketler", "📦 paketler & görevler"], ["ek", "⭐ ek görevler"],
  ["katalog", "🌷 bahçe kataloğu"], ["ekonomi", "🪙 ekonomi"], ["ilerleme", "🔓 ilerleme & bölgeler"],
  ["bildirim", "🔔 bildirimler"], ["json", "🧾 dışa aktar"],
];
export default function Backoffice() {
  const [cfg, set] = useState(ILK);
  const [sayfa, setSayfa] = useState("panel");
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Figtree',sans-serif", display: "flex" }}>
      <style>{css}</style>
      {/* yan menü */}
      <div style={{ width: 210, background: C.yan, padding: "18px 12px", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
        <div style={{ color: "#FFF", fontWeight: 800, fontSize: 16, padding: "0 8px 12px" }}>minik <span style={{ color: "#9FB48E", fontWeight: 600, fontSize: 12 }}>· backoffice</span></div>
        {MENU.map(([id, ad]) => (
          <button key={id} onClick={() => setSayfa(id)} style={{ textAlign: "left", background: sayfa === id ? C.yanAcik : "none",
            color: sayfa === id ? "#FFF" : "#AAB6A2", border: "none", borderRadius: 9, padding: "9px 10px", fontWeight: 700, fontSize: 12.5 }}>{ad}</button>
        ))}
        <div style={{ marginTop: "auto", padding: 8 }}><Cip txt="ortam: taslak" ton="#D8C27A" bg="#3A453C" /></div>
      </div>
      {/* içerik */}
      <div style={{ flex: 1, padding: "18px 20px", overflowY: "auto", maxHeight: "100vh" }}>
        <div style={{ fontWeight: 800, fontSize: 17, color: C.ink, marginBottom: 12 }}>{MENU.find(m => m[0] === sayfa)[1]}</div>
        {sayfa === "panel" && <Panel cfg={cfg} />}
        {sayfa === "paketler" && <Paketler cfg={cfg} set={set} />}
        {sayfa === "ek" && <EkGorevler cfg={cfg} set={set} />}
        {sayfa === "katalog" && <Katalog cfg={cfg} set={set} />}
        {sayfa === "ekonomi" && <Ekonomi cfg={cfg} set={set} />}
        {sayfa === "ilerleme" && <Ilerleme cfg={cfg} set={set} />}
        {sayfa === "bildirim" && <Bildirimler cfg={cfg} set={set} />}
        {sayfa === "json" && <Disari cfg={cfg} />}
      </div>
    </div>
  );
}
