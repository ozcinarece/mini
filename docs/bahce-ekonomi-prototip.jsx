import React, { useState } from "react";

// ═══════ minik · BAHÇE EKONOMİSİ — oynanabilir v2 ═══════
// görev → tohum → ek → görevle büyüt → hasat → tohum geri + PARA → dekor & alan aç
// haftalık: 7 günün 5'inde kanıt → sandık (para + nadir tohum). sulama yok: görev = su.

const TW = 84, TH = 42, DEPTH = 14, COLS = 7, ROWS = 5; // son 2 sütun kilitli bölge
const W = 560, H = 470, OX = 262, OY = 130;
const pos = (c, r) => ({ x: OX + (c - r) * TW / 2, y: OY + (c + r) * TH / 2 });

const css = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&family=Nunito:wght@600;800&display=swap');
button { -webkit-tap-highlight-color: transparent; cursor: pointer; } button:focus { outline: none; }
@keyframes pop { from { transform: scale(0); } 70% { transform: scale(1.14); } to { transform: scale(1); } }
.pop { animation: pop .55s cubic-bezier(.34,1.3,.5,1) both; transform-origin: center bottom; }
@keyframes sway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
.sway { animation: sway 4s ease-in-out infinite; transform-origin: center bottom; }
@keyframes floatUp { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-28px); opacity: 0; } }
.float-up { animation: floatUp 1.1s ease both; }
@keyframes pulseT { 0%,100% { opacity: .3; } 50% { opacity: .65; } }
.pulse-t { animation: pulseT 1.1s ease-in-out infinite; }
@keyframes hasatGlow { 0%,100% { opacity: .25; } 50% { opacity: .7; } }
.hasat-glow { animation: hasatGlow 1.3s ease-in-out infinite; }
`;

/* ── SVG varlıklar ── */
const Golge = ({ w = 30 }) => <ellipse cx="0" cy="2" rx={w / 2} ry={w / 6.5} fill="#41502F" opacity=".14" />;
const Filiz = () => (<g><Golge w={18} /><path d="M0 0 L0 -11" stroke="#5F8138" strokeWidth="2.6" strokeLinecap="round" />
  <ellipse cx="-5" cy="-10" rx="6" ry="3" fill="#7CA24D" transform="rotate(-28 -5 -10)" />
  <ellipse cx="5" cy="-12" rx="6" ry="3" fill="#8DB35E" transform="rotate(24 5 -12)" /></g>);
const Tumsek = () => (<g><Golge w={20} /><ellipse cx="0" cy="-1" rx="10" ry="5" fill="#8A6B4A" /><ellipse cx="0" cy="-3" rx="6" ry="3" fill="#9C7B57" /></g>);

function Aycicegi({ s }) {
  if (s === 0) return <Tumsek />; if (s === 1) return <Filiz />;
  if (s === 2) return (<g><Golge w={20} /><path d="M0 0 C 1 -10 -1 -16 0 -22" stroke="#5F8138" strokeWidth="3" fill="none" strokeLinecap="round" />
    <ellipse cx="-6" cy="-11" rx="7" ry="3.4" fill="#7CA24D" transform="rotate(-26 -6 -11)" /><circle cx="0" cy="-26" r="6" fill="#C9A544" /></g>);
  return (<g><Golge w={24} /><path d="M0 0 C 1 -12 -1 -22 0 -30" stroke="#5F8138" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    <ellipse cx="-7" cy="-13" rx="8" ry="3.8" fill="#7CA24D" transform="rotate(-26 -7 -13)" />
    <ellipse cx="7" cy="-18" rx="8" ry="3.8" fill="#8DB35E" transform="rotate(24 7 -18)" />
    {Array.from({ length: 11 }).map((_, i) => <ellipse key={i} cx="0" cy="-43" rx="4" ry="7.6" fill={i % 2 ? "#F2C14E" : "#F6CF6B"} transform={`rotate(${i * 32.7} 0 -33)`} />)}
    <circle cx="0" cy="-33" r="7" fill="#7A5230" /></g>);
}
function Lavanta({ s }) {
  if (s === 0) return <Tumsek />; if (s === 1) return <Filiz />;
  const sap = (dx, h) => (<g key={dx} transform={`translate(${dx} 0)`}><path d={`M0 0 L0 ${-h}`} stroke="#6E8F4B" strokeWidth="2.4" strokeLinecap="round" />
    {Array.from({ length: 4 }).map((_, i) => <ellipse key={i} cx="0" cy={-h - 2 - i * 5} rx={3.6 - i * .4} ry="3" fill="#9D8DF2" />)}</g>);
  return (<g><Golge w={24} />{sap(-8, 12)}{sap(0, 17)}{sap(8, 13)}</g>);
}
function Domates({ s }) {
  if (s === 0) return <Tumsek />; if (s === 1) return <Filiz />;
  const kazik = <path d="M0 2 L0 -30" stroke="#A97B4F" strokeWidth="3" strokeLinecap="round" />;
  if (s === 2) return (<g><Golge w={24} />{kazik}
    <path d="M0 -4 C -8 -10 -7 -20 0 -26 C 7 -20 8 -10 0 -4" fill="#6FA84F" />
    <circle cx="-4" cy="-14" r="3" fill="#8FCB69" /><circle cx="5" cy="-19" r="3" fill="#8FCB69" /></g>);
  return (<g><Golge w={26} />{kazik}
    <path d="M0 -4 C -9 -10 -8 -22 0 -28 C 8 -22 9 -10 0 -4" fill="#6FA84F" />
    <circle cx="-5" cy="-12" r="4.2" fill="#E05A4E" /><circle cx="6" cy="-17" r="4.2" fill="#E86A5E" /><circle cx="0" cy="-23" r="4.2" fill="#E05A4E" />
    <circle cx="-6.5" cy="-13.5" r="1.4" fill="#F28C80" /></g>);
}
function Kabak({ s }) {
  if (s === 0) return <Tumsek />; if (s === 1) return <Filiz />;
  if (s === 2) return (<g><Golge w={26} /><path d="M-12 0 Q 0 -14 12 -2" stroke="#6E8F4B" strokeWidth="3" fill="none" strokeLinecap="round" />
    <ellipse cx="-10" cy="-2" rx="7" ry="3.4" fill="#7CA24D" transform="rotate(-16 -10 -2)" /><circle cx="10" cy="-4" r="5" fill="#8FCB69" /></g>);
  return (<g><Golge w={32} /><path d="M-14 -2 Q -2 -16 10 -8" stroke="#6E8F4B" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    <ellipse cx="0" cy="-8" rx="13" ry="10" fill="#E8913C" /><ellipse cx="-5" cy="-8" rx="4" ry="9.4" fill="#F2A552" />
    <ellipse cx="6" cy="-8" rx="3.4" ry="9" fill="#D97F2E" /><path d="M0 -17 L 0 -21" stroke="#6E8F4B" strokeWidth="3.4" strokeLinecap="round" /></g>);
}
function Bank() {
  return (<g><Golge w={44} />
    <rect x="-19" y="-16" width="38" height="5" rx="2" fill="#BC8E60" /><rect x="-19" y="-24" width="38" height="4" rx="2" fill="#A97B4F" />
    <rect x="-16" y="-11" width="4" height="11" rx="1.6" fill="#8F6642" /><rect x="12" y="-11" width="4" height="11" rx="1.6" fill="#8F6642" /></g>);
}
function KusBanyosu() {
  return (<g><Golge w={30} /><path d="M-4 0 L -3 -12 L 3 -12 L 4 0 Z" fill="#B9B3A6" />
    <ellipse cx="0" cy="-14" rx="13" ry="5" fill="#CFC9BC" /><ellipse cx="0" cy="-15" rx="9" ry="3.2" fill="#8FD0E0" />
    <ellipse cx="-2" cy="-15.6" rx="3" ry="1" fill="#C6EAF2" /></g>);
}
function Fener() {
  return (<g><Golge w={20} /><circle cx="0" cy="-26" r="13" fill="#FFD98A" opacity=".45" />
    <rect x="-2" y="-19" width="4" height="19" rx="2" fill="#6B5A4A" /><rect x="-6" y="-30" width="12" height="12" rx="3.4" fill="#4E4238" />
    <rect x="-3.8" y="-27.8" width="7.6" height="7.6" rx="2" fill="#FFD98A" /></g>);
}
function Cit() {
  const post = (x, y) => (<g key={x} transform={`translate(${x} ${y})`}><rect x="-2.2" y="-15" width="4.4" height="15" rx="1.8" fill="#A97B4F" /><rect x="-2.2" y="-15" width="1.8" height="15" fill="#BC8E60" /></g>);
  return (<g>{post(-30, 15)}{post(0, 0)}{post(30, -15)}
    <path d="M-30 7 L 30 -23" stroke="#A97B4F" strokeWidth="3.8" strokeLinecap="round" />
    <path d="M-30 11 L 30 -19" stroke="#8F6642" strokeWidth="3.8" strokeLinecap="round" /></g>);
}
function Gul({ s }) {
  if (s === 0) return <Tumsek />; if (s === 1) return <Filiz />;
  return (<g><Golge w={24} /><path d="M0 0 L 0 -18" stroke="#5F8138" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="-6" cy="-9" rx="7" ry="3.4" fill="#7CA24D" transform="rotate(-28 -6 -9)" />
    <circle cx="0" cy="-25" r="8" fill="#E05A7E" /><circle cx="0" cy="-25" r="5" fill="#EB7D9A" /><circle cx="0" cy="-25" r="2.4" fill="#F2A5B8" /></g>);
}
function Yabani({ i }) {
  return (<g opacity=".85">{[[-14, 2], [8, -4], [-2, 8]].map(([x, y], j) => (
    <g key={j} transform={`translate(${x} ${y})`}><path d="M0 0 C -3 -6 -1 -9 0 -12 M0 0 C 3 -5 4 -8 3 -11 M0 0 C -1 -7 1 -10 -2 -13"
      stroke={j % 2 ? "#7E8F5B" : "#8FA06B"} strokeWidth="2" fill="none" strokeLinecap="round" /></g>))}
    {i % 3 === 0 && <circle cx="10" cy="4" r="4" fill="#9C8A70" />}</g>);
}

const VARLIK = { aycicegi: Aycicegi, lavanta: Lavanta, domates: Domates, kabak: Kabak, gul: Gul, bank: Bank, kusbanyosu: KusBanyosu, fener: Fener, cit: Cit };
const KATALOG = {
  aycicegi: { ad: "ayçiçeği", tip: "cicek", fT: 4, max: 3 },            // başlangıç
  lavanta: { ad: "lavanta", tip: "cicek", fT: 5, max: 2, esik: 15 },    // 15 kanıtta açılır
  gul: { ad: "gül ✨", tip: "cicek", fT: 6, max: 2, kilitli: true },
  domates: { ad: "domates", tip: "sebze", fT: 6, max: 3, para: 4 },
  kabak: { ad: "kabak", tip: "sebze", fT: 10, max: 3, para: 8, esik: 30 },
  cit: { ad: "çit", tip: "dekor", fP: 6 },
  fener: { ad: "fener", tip: "dekor", fP: 14 },
  bank: { ad: "bank", tip: "dekor", fP: 20 },
  kusbanyosu: { ad: "kuş banyosu", tip: "dekor", fP: 25, esik: 25 },
};
const KOMUTLAR = ["gözüne ilişen beş şeyi yerine koy", "bir bardak su iç", "iki sayfa kitap oku", "tezgahı boşalt ve sil", "o randevuyu şimdi al"];
const MiniIkon = ({ id }) => { const C = VARLIK[id]; const k = KATALOG[id]; return <svg width="40" height="42" viewBox="-22 -40 44 46"><C s={k.max ?? 0} /></svg>; };

export default function BahceEkonomi() {
  const [tohum, setTohum] = useState(8);
  const [para, setPara] = useState(0);
  const [gun, setGun] = useState(1);           // haftanın günü 1..7
  const [kanitliGun, setKanitliGun] = useState([]); // kanıt bırakılan günler
  const [bugunKanit, setBugunKanit] = useState(0);
  const [toplamKanit, setToplamKanit] = useState(9); // demo: lavantaya 6 kaldı
  const [sandik, setSandik] = useState(false); // haftalık sandık alındı mı
  const [gulAcik, setGulAcik] = useState(false);
  const [acikBolge, setAcikBolge] = useState(false); // sağdaki 2 sütun
  const [mod, setMod] = useState(null);        // {tip:"ek", id}
  const [panel, setPanel] = useState("bugun");
  const [dTab, setDTab] = useState("tohum");
  const [kNo, setKNo] = useState(0);
  const [roz, setRoz] = useState(null);        // {txt} uçan rozet
  const [dunya, setDunya] = useState({ "1,1": { id: "aycicegi", s: 3 }, "2,2": { id: "domates", s: 2 }, "0,3": { id: "cit" } });

  const rozet = (txt) => { setRoz(txt); setTimeout(() => setRoz(null), 1100); };

  const yaptim = () => {
    const bonus = bugunKanit === 0 ? 1 : 0;
    setTohum(t => t + 2 + bonus);
    rozet(`+${2 + bonus} 🌰`);
    setBugunKanit(k => k + 1);
    setToplamKanit(t => {
      const y = t + 1;
      Object.values(KATALOG).forEach(k => { if (k.esik === y) setTimeout(() => rozet(`yeni: ${k.ad} 🌱`), 1200); });
      return y;
    });
    if (!kanitliGun.includes(gun)) setKanitliGun(g => [...g, gun]);
    setDunya(d => Object.fromEntries(Object.entries(d).map(([k, v]) => {
      const kat = KATALOG[v.id];
      return [k, kat.max != null && v.s < kat.max ? { ...v, s: v.s + 1 } : v];
    })));
    setKNo(n => (n + 1) % KOMUTLAR.length);
  };
  const yeniGun = () => { setGun(g => Math.min(7, g + 1)); setBugunKanit(0); };
  const sandikAl = () => { setSandik(true); setPara(p => p + 15); setGulAcik(true); };

  const satinAl = (id) => {
    const k = KATALOG[id];
    if (k.tip === "dekor") { if (para < k.fP || (k.esik && toplamKanit < k.esik)) return; setPara(p => p - k.fP); }
    else { if (tohum < k.fT || (k.kilitli && !gulAcik) || (k.esik && toplamKanit < k.esik)) return; setTohum(t => t - k.fT); }
    setMod({ tip: "ek", id });
  };
  const kareTikla = (c, r) => {
    const key = `${c},${r}`;
    const kilitliKare = c >= 5 && !acikBolge;
    if (kilitliKare) { if (para >= 40) { setPara(p => p - 40); setAcikBolge(true); rozet("bölge açıldı 🌿"); } return; }
    const v = dunya[key];
    if (mod?.tip === "ek" && !v) { setDunya(d => ({ ...d, [key]: { id: mod.id, s: KATALOG[mod.id].max != null ? 0 : undefined } })); setMod(null); return; }
    if (v) { // hasat?
      const kat = KATALOG[v.id];
      if (kat.tip === "sebze" && v.s >= kat.max) {
        setTohum(t => t + kat.fT); setPara(p => p + kat.para);
        rozet(`+${kat.fT} 🌰  +${kat.para} 🪙`);
        setDunya(d => { const n = { ...d }; delete n[key]; return n; });
      }
    }
  };

  const haftaOk = kanitliGun.length >= 5;
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#F6FAEE,#E4EFD6)", display: "flex", flexDirection: "column",
      alignItems: "center", padding: "12px 8px 8px", fontFamily: "'Nunito',sans-serif" }}>
      <style>{css}</style>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* üst: cüzdan + hafta */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px" }}>
          <div style={{ position: "relative", display: "flex", gap: 6 }}>
            <span style={{ background: "#FFF", borderRadius: 999, padding: "5px 12px", fontWeight: 800, color: "#41502F", fontSize: 13.5, boxShadow: "0 3px 10px rgba(65,80,47,.10)" }}>🌰 {tohum}</span>
            <span style={{ background: "#FFF", borderRadius: 999, padding: "5px 12px", fontWeight: 800, color: "#8A6B2E", fontSize: 13.5, boxShadow: "0 3px 10px rgba(65,80,47,.10)" }}>🪙 {para}</span>
            {roz && <span className="float-up" style={{ position: "absolute", left: 10, top: -14, fontWeight: 800, color: "#7CA24D", fontSize: 13, whiteSpace: "nowrap" }}>{roz}</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 11, color: "#8CA06B", fontWeight: 800 }}>✓ {toplamKanit} kanıt</span><button onClick={yeniGun} style={{ fontSize: 11, color: "#AFC08F", background: "none", border: "none", fontWeight: 800 }}>gün {gun}/7 ⏭</button></div>
        </div>

        {/* haftalık sandık çubuğu */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 4px 2px" }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} style={{ width: 14, height: 14, borderRadius: 999, background: kanitliGun.includes(i + 1) ? "#7CA24D" : "#E2EAD0",
              border: i + 1 === gun ? "2px solid #5F8138" : "none" }} />
          ))}
          <span style={{ fontSize: 11, color: "#8CA06B", fontWeight: 800, marginLeft: 2 }}>{kanitliGun.length}/5 gün</span>
          {haftaOk && !sandik && (
            <button onClick={sandikAl} className="pop" style={{ marginLeft: "auto", fontFamily: "'Baloo 2',sans-serif", fontSize: 12.5, fontWeight: 700,
              color: "#FFF", background: "#E8913C", border: "none", borderRadius: 999, padding: "6px 13px", boxShadow: "0 4px 0 #C4741F" }}>
              🎁 sandığı aç
            </button>
          )}
          {sandik && <span style={{ marginLeft: "auto", fontSize: 11, color: "#8CA06B", fontWeight: 800 }}>sandık: +15 🪙 + gül ✨</span>}
        </div>

        {/* sahne */}
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", marginTop: -6 }}>
          {Array.from({ length: ROWS }).flatMap((_, r) => Array.from({ length: COLS }).map((_, c) => {
            const { x, y } = pos(c, r); const key = `${c},${r}`;
            const kilit = c >= 5 && !acikBolge;
            const acik = (c + r) % 2 === 0;
            const v = dunya[key];
            const hasatVar = v && KATALOG[v.id].tip === "sebze" && v.s >= KATALOG[v.id].max;
            return (
              <g key={key} transform={`translate(${x} ${y})`} onClick={() => kareTikla(c, r)} style={{ cursor: "pointer" }}>
                <polygon points={`${-TW/2},0 0,${TH/2} 0,${TH/2+DEPTH} ${-TW/2},${DEPTH}`} fill={kilit ? "#7E6C55" : "#8A6B4A"} />
                <polygon points={`${TW/2},0 0,${TH/2} 0,${TH/2+DEPTH} ${TW/2},${DEPTH}`} fill={kilit ? "#6A5A46" : "#75573B"} />
                <polygon points={`0,${-TH/2} ${TW/2},0 0,${TH/2} ${-TW/2},0`}
                  fill={kilit ? (acik ? "#9AA57E" : "#8E9A72") : (acik ? "#AFD37B" : "#A0C86C")} stroke={kilit ? "#828E68" : "#8FBB5B"} strokeWidth="1" />
                {kilit && <Yabani i={c * 7 + r} />}
                {hasatVar && <polygon className="hasat-glow" points={`0,${-TH/2} ${TW/2},0 0,${TH/2} ${-TW/2},0`} fill="#FFE9A8" />}
                {mod && !v && !kilit && <polygon className="pulse-t" points={`0,${-TH/2} ${TW/2},0 0,${TH/2} ${-TW/2},0`} fill="#FFF" />}
              </g>
            );
          }))}
          {/* kilitli bölge etiketi */}
          {!acikBolge && (() => { const { x, y } = pos(5.5, 2); return (
            <g transform={`translate(${x} ${y - 26})`} style={{ cursor: "pointer" }} onClick={() => kareTikla(5, 2)}>
              <rect x="-46" y="-14" width="92" height="26" rx="13" fill="#FFF" opacity=".92" />
              <text x="0" y="4" textAnchor="middle" fontFamily="Nunito" fontWeight="800" fontSize="12.5" fill={para >= 40 ? "#7CA24D" : "#A9987F"}>🔒 aç: 40 🪙</text>
            </g>); })()}
          {/* varlıklar */}
          {Object.entries(dunya)
            .sort((a, b) => { const [c1,r1]=a[0].split(",").map(Number), [c2,r2]=b[0].split(",").map(Number); return (c1+r1)-(c2+r2); })
            .map(([key, v]) => {
              const [c, r] = key.split(",").map(Number); const { x, y } = pos(c, r);
              const C = VARLIK[v.id]; const canli = KATALOG[v.id].max != null;
              return (
                <g key={key + "-" + (v.s ?? "d")} transform={`translate(${x} ${y})`} onClick={() => kareTikla(c, r)} style={{ cursor: "pointer" }}>
                  <g className="pop"><g className={canli && v.s >= 1 ? "sway" : ""}><C s={v.s ?? 0} /></g></g>
                </g>
              );
            })}
        </svg>
        <p style={{ textAlign: "center", fontSize: 11, color: mod ? "#7CA24D" : "#AFC08F", fontWeight: 800, minHeight: 15, marginTop: -4 }}>
          {mod ? `${KATALOG[mod.id].ad} — boş kareye dokun` : "olgun sebzeler parlar — dokun, hasat et"}
        </p>

        {/* alt panel */}
        <div style={{ background: "#FFF", borderRadius: 22, boxShadow: "0 8px 24px rgba(65,80,47,.10)", padding: "10px 14px 12px", marginTop: 4 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 9 }}>
            {[["bugun", "bugün"], ["dukkan", "dükkân"]].map(([id, ad]) => (
              <button key={id} onClick={() => setPanel(id)} style={{ fontFamily: "'Baloo 2',sans-serif", fontSize: 13, fontWeight: 700,
                color: panel === id ? "#FFF" : "#8CA06B", background: panel === id ? "#7CA24D" : "#F1F5E6", border: "none", borderRadius: 999, padding: "6px 16px" }}>{ad}</button>
            ))}
          </div>
          {panel === "bugun" ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Baloo 2',sans-serif", fontSize: 15.5, color: "#41502F", fontWeight: 600, marginBottom: 9 }}>{KOMUTLAR[kNo]}</p>
              <button onClick={yaptim} style={{ fontFamily: "'Baloo 2',sans-serif", fontWeight: 700, fontSize: 14.5, color: "#FFF",
                background: "#7CA24D", border: "none", borderRadius: 999, padding: "11px 34px", boxShadow: "0 5px 0 #5F8138" }}>
                Yaptım · +2 🌰{bugunKanit === 0 ? " (+1 ilk kanıt)" : ""}
              </button>
              <div style={{ marginTop: 6 }}>
                <button onClick={() => setKNo(n => (n + 1) % KOMUTLAR.length)} style={{ fontSize: 11.5, color: "#8CA06B", background: "none", border: "none", fontWeight: 700 }}>şimdi olmadı</button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 8 }}>
                {[["tohum", "🌰 tohumluk"], ["dekor", "🪙 dekor"]].map(([id, ad]) => (
                  <button key={id} onClick={() => setDTab(id)} style={{ fontSize: 11.5, fontWeight: 800, color: dTab === id ? "#41502F" : "#AFC08F",
                    background: dTab === id ? "#F1F5E6" : "transparent", border: "none", borderRadius: 999, padding: "4px 12px" }}>{ad}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 2 }}>
                {Object.entries(KATALOG).filter(([, k]) => dTab === "tohum" ? k.tip !== "dekor" : k.tip === "dekor").map(([id, k]) => {
                  const fiyat = k.tip === "dekor" ? k.fP : k.fT;
                  const birim = k.tip === "dekor" ? "🪙" : "🌰";
                  const esikte = k.esik && toplamKanit < k.esik;
                  const yok = (k.tip === "dekor" ? para : tohum) < fiyat || (k.kilitli && !gulAcik) || esikte;
                  return (
                    <button key={id} onClick={() => satinAl(id)} style={{ minWidth: 70, background: "#F7FAF0",
                      border: `1.5px solid ${yok ? "#E6ECD8" : "#D5E2BC"}`, borderRadius: 14, padding: "7px 4px 6px", opacity: yok ? .45 : 1, textAlign: "center" }}>
                      <MiniIkon id={id} />
                      <div style={{ fontSize: 10.5, fontWeight: 800, color: "#41502F" }}>{k.ad}</div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: esikte ? "#A9987F" : "#7CA24D" }}>
                        {k.kilitli && !gulAcik ? "sandıktan ✨" : esikte ? `🔒 ${toplamKanit}/${k.esik} kanıt` : `${fiyat} ${birim}`}{!esikte && k.tip === "sebze" ? ` → +${k.para} 🪙` : ""}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
