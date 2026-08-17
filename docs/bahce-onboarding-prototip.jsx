import React, { useState } from "react";

// ═══════ minik · BAHÇE ONBOARDING — kurgu prototipi ═══════
// kapı → renk-alan bağı → güvence → kategori seçimi (CANLI önizleme) → hediye tohumlar → nasıl çalışır → ses → bahçen
// görseller Gemini'den gelecek; buradaki çizimler yer tutucu — etkileşim ve akış gerçek.

const css = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap');
button { cursor: pointer; -webkit-tap-highlight-color: transparent; } button:focus { outline: none; }
@keyframes ap { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.ap { animation: ap .8s ease both; }
@keyframes pop { from { transform: scale(0); } 70% { transform: scale(1.15); } to { transform: scale(1); } }
.pop { animation: pop .6s cubic-bezier(.34,1.3,.5,1) both; transform-origin: center bottom; }
@keyframes sway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
.sway { animation: sway 4s ease-in-out infinite; transform-origin: center bottom; }
`;

const KATEGORILER = [
  { id: "duzen", ad: "düzen & tertip", renk: "#E9B93C", cicek: "sarı çiçekler", alt: ["ev toplama", "mutfak", "çalışma masası", "dijital düzen"] },
  { id: "gelisim", ad: "gelişim", renk: "#D95D4E", cicek: "kırmızı çiçekler", alt: ["kitap okuma", "dil öğrenme", "yeni beceri"] },
  { id: "huzur", ad: "huzur & hareket", renk: "#5A93C4", cicek: "mavi çiçekler", alt: ["su içmek", "esneme & yürüyüş", "nefes & sükunet"] },
  { id: "odak", ad: "zihin & odak", renk: "#9D8DF2", cicek: "mor çiçekler", alt: ["ekran molası", "derin odak", "uyku ritmi"] },
  { id: "isler", ad: "minik işler", renk: "#E8913C", cicek: "turuncu çiçekler", alt: ["randevular & evrak", "mail kutusu", "erteleme listesi"] },
];

/* mini çiçek: yer tutucu (Gemini gelince sprite olacak) */
const Cicek = ({ renk, x, y, boy = 1, filiz = false }) => (
  <g transform={`translate(${x} ${y}) scale(${boy})`} className="pop">
    <g className="sway">
      <path d="M0 0 L0 -11" stroke="#5F8138" strokeWidth="2.4" strokeLinecap="round" />
      {filiz ? (<>
        <ellipse cx="-4" cy="-10" rx="5" ry="2.6" fill="#7CA24D" transform="rotate(-28 -4 -10)" />
        <ellipse cx="4" cy="-12" rx="5" ry="2.6" fill="#8DB35E" transform="rotate(24 4 -12)" />
      </>) : (<>
        {[0, 72, 144, 216, 288].map(a => <ellipse key={a} cx="0" cy="-17" rx="3.4" ry="5.4" fill={renk} transform={`rotate(${a} 0 -12)`} />)}
        <circle cx="0" cy="-12" r="3.2" fill="#F6E3A8" />
      </>)}
    </g>
  </g>
);

/* CANLI BAHÇE ÖNİZLEME: seçilen kategoriler renk kümeleri olarak belirir */
function Onizleme({ secim, filizler = false, genis = false }) {
  const YER = { duzen: [58, 46], gelisim: [128, 30], huzur: [186, 52], odak: [92, 74], isler: [160, 84] };
  const secili = KATEGORILER.filter(k => secim[k.id]?.length > 0);
  return (
    <svg viewBox="0 0 240 130" style={{ width: "100%", maxWidth: genis ? 340 : 250, display: "block", margin: "0 auto" }}>
      {/* zemin: izo çim adası */}
      <ellipse cx="120" cy="122" rx="112" ry="9" fill="#41502F" opacity=".12" />
      <polygon points="120,18 232,74 120,118 8,74" fill="#A8CE74" />
      <polygon points="120,26 218,74 120,110 22,74" fill="#B5D97E" />
      <polygon points="8,74 120,118 120,127 8,83" fill="#8A6B4A" />
      <polygon points="232,74 120,118 120,127 232,83" fill="#75573B" />
      {secili.length === 0 && (
        <text x="120" y="76" textAnchor="middle" fontFamily="Nunito" fontWeight="800" fontSize="11" fill="#7E9558">alan seçtikçe burada açacak 🌱</text>
      )}
      {secili.map(k => (
        <g key={k.id}>
          {k.alt.map((_, i) => (secim[k.id].length > i) && (
            <Cicek key={i} renk={k.renk} filiz={filizler}
              x={YER[k.id][0] + (i % 2 ? 14 : -6) + (i > 1 ? 6 : 0)} y={YER[k.id][1] + (i % 3) * 7}
              boy={.9 + (i % 2) * .2} />
          ))}
        </g>
      ))}
    </svg>
  );
}

const G = { bg: "linear-gradient(180deg,#F6FAEE 0%,#E7F0D9 100%)", ink: "#41502F", faint: "#8CA06B", dim: "#AFC08F", yesil: "#7CA24D", koyu: "#5F8138" };
const Buton = ({ children, onClick, ghost }) => (
  <button onClick={onClick} style={ghost
    ? { fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 12.5, color: G.faint, background: "none", border: "none" }
    : { fontFamily: "'Baloo 2',sans-serif", fontWeight: 700, fontSize: 15.5, color: "#FFF", background: G.yesil, border: "none", borderRadius: 999, padding: "13px 44px", boxShadow: `0 6px 0 ${G.koyu}` }}>
    {children}
  </button>
);

export default function BahceOnboarding() {
  const [e, setE] = useState(0);
  const [secim, setSecim] = useState({});           // {katId: [altlar]}
  const [acik, setAcik] = useState("duzen");
  const ileri = () => setE(x => x + 1);
  const toplamAlt = Object.values(secim).reduce((a, b) => a + b.length, 0);

  const altSec = (kid, alt) => setSecim(s => {
    const l = s[kid] || [];
    return { ...s, [kid]: l.includes(alt) ? l.filter(x => x !== alt) : [...l, alt] };
  });

  const EKRAN = [
    /* 0 · kapı */
    <div key="e0" className="ap" onClick={ileri} style={{ textAlign: "center", cursor: "pointer" }}>
      <div style={{ fontSize: 11, color: G.dim, fontWeight: 800, letterSpacing: ".1em", marginBottom: 18 }}>· GEMİNİ KAPAK GÖRSELİ: olgun, ışıl ışıl bahçe ·</div>
      <Onizleme genis secim={{ duzen: [1, 2, 3], gelisim: [1, 2], huzur: [1, 2, 3], odak: [1, 2], isler: [1, 2] }} />
      <p style={{ fontFamily: "'Baloo 2',sans-serif", fontSize: 27, color: G.ink, fontWeight: 700, marginTop: 22 }}>Burası senin bahçen.</p>
      <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, color: G.faint, fontWeight: 600, marginTop: 6 }}>Hayatını düzene soktukça, onun güzelleştiğini göreceksin.</p>
      <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11.5, color: G.dim, fontWeight: 800, marginTop: 30, letterSpacing: ".08em" }}>DOKUN</p>
    </div>,

    /* 1 · renk-alan bağı */
    <div key="e1" className="ap" onClick={ileri} style={{ textAlign: "center", cursor: "pointer" }}>
      <p style={{ fontFamily: "'Baloo 2',sans-serif", fontSize: 22, color: G.ink, fontWeight: 700, marginBottom: 18 }}>Her çiçek, hayatının bir alanı.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 260, margin: "0 auto" }}>
        {KATEGORILER.slice(0, 3).map((k, i) => (
          <div key={k.id} className="ap" style={{ display: "flex", alignItems: "center", gap: 12, animationDelay: `${.3 + i * .35}s` }}>
            <svg width="34" height="38" viewBox="-17 -34 34 38"><Cicek renk={k.renk} x={0} y={0} boy={1.1} /></svg>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 13.5, color: k.renk }}>{k.cicek}</div>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 600, fontSize: 12.5, color: G.faint }}>{k.ad}</div>
            </div>
          </div>
        ))}
        <div className="ap" style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: G.dim, fontWeight: 700, animationDelay: "1.5s" }}>…ve daha fazlası</div>
      </div>
      <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13.5, color: G.faint, fontWeight: 600, marginTop: 22 }}>Sen onlara baktıkça, onlar açar.</p>
      <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11.5, color: G.dim, fontWeight: 800, marginTop: 24, letterSpacing: ".08em" }}>DOKUN</p>
    </div>,

    /* 2 · güvence */
    <div key="e2" className="ap" onClick={ileri} style={{ textAlign: "center", cursor: "pointer", maxWidth: 280, margin: "0 auto" }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>💤</div>
      <p style={{ fontFamily: "'Baloo 2',sans-serif", fontSize: 22, color: G.ink, fontWeight: 700, lineHeight: 1.35 }}>
        Bakamadığın gün<br />çiçeğin ölmez — uyur.
      </p>
      <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13.5, color: G.faint, fontWeight: 600, marginTop: 12, lineHeight: 1.6 }}>
        Burada suçluluk yok, ceza yok, seri yok.<br />Döndüğünde bahçen seni bekliyor olacak.
      </p>
      <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11.5, color: G.dim, fontWeight: 800, marginTop: 28, letterSpacing: ".08em" }}>DOKUN</p>
    </div>,

    /* 3 · kategori seçimi + CANLI ÖNİZLEME */
    <div key="e3" className="ap" style={{ width: "100%" }}>
      <p style={{ fontFamily: "'Baloo 2',sans-serif", fontSize: 20, color: G.ink, fontWeight: 700, textAlign: "center" }}>Hangi alanlara bakmak istersin?</p>
      <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: G.faint, fontWeight: 600, textAlign: "center", marginTop: 3, marginBottom: 12 }}>
        İster tek alana yoğunlaş, ister hepsine — bahçe senin.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 7, maxHeight: 260, overflowY: "auto", padding: "0 2px" }}>
        {KATEGORILER.map(k => {
          const ac = acik === k.id, n = (secim[k.id] || []).length;
          return (
            <div key={k.id} style={{ background: "#FFF", borderRadius: 16, border: `2px solid ${n ? k.renk : "#E9EEDD"}`, overflow: "hidden" }}>
              <button onClick={() => setAcik(ac ? null : k.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", padding: "11px 13px" }}>
                <span style={{ width: 13, height: 13, borderRadius: 999, background: k.renk }} />
                <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 13.5, color: G.ink, flex: 1, textAlign: "left" }}>{k.ad}</span>
                {n > 0 && <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 800, color: "#FFF", background: k.renk, borderRadius: 999, padding: "2px 9px" }}>{n}</span>}
                <span style={{ color: G.dim, fontSize: 12 }}>{ac ? "▾" : "›"}</span>
              </button>
              {ac && (
                <div className="ap" style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 13px 12px" }}>
                  {k.alt.map(a => {
                    const on = (secim[k.id] || []).includes(a);
                    return (
                      <button key={a} onClick={() => altSec(k.id, a)} style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: 700,
                        color: on ? "#FFF" : G.faint, background: on ? k.renk : "#F3F6EB", border: "none", borderRadius: 999, padding: "6px 12px" }}>
                        {a}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* canlı önizleme */}
      <div style={{ marginTop: 12, background: "#FFFFFFAA", borderRadius: 18, padding: "10px 8px 4px" }}>
        <Onizleme secim={secim} />
      </div>
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <Buton onClick={ileri}>{toplamAlt > 0 ? `Devam (${toplamAlt} alan)` : "Devam"}</Buton>
      </div>
    </div>,

    /* 4 · hediye tohumlar */
    <div key="e4" className="ap" onClick={ileri} style={{ textAlign: "center", cursor: "pointer" }}>
      <p style={{ fontFamily: "'Baloo 2',sans-serif", fontSize: 22, color: G.ink, fontWeight: 700 }}>Hoş geldin hediyen 🌱</p>
      <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: G.faint, fontWeight: 600, marginTop: 4, marginBottom: 14 }}>
        Seçtiğin her alandan bir tohum ektik bile — ilk filizlerin:
      </p>
      <div style={{ background: "#FFFFFFAA", borderRadius: 18, padding: "10px 8px 4px", maxWidth: 300, margin: "0 auto" }}>
        <Onizleme secim={Object.fromEntries(Object.entries(secim).map(([k, v]) => [k, v.slice(0, 1)]))} filizler />
      </div>
      <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11.5, color: G.dim, fontWeight: 800, marginTop: 22, letterSpacing: ".08em" }}>DOKUN</p>
    </div>,

    /* 5 · nasıl çalışır */
    <div key="e5" className="ap" onClick={ileri} style={{ textAlign: "center", cursor: "pointer", maxWidth: 290, margin: "0 auto" }}>
      <p style={{ fontFamily: "'Baloo 2',sans-serif", fontSize: 21, color: G.ink, fontWeight: 700, marginBottom: 18 }}>Bahçe böyle büyür:</p>
      {[["🌙", "Günlük hedeflerini tamamla", "tohum kazan"],
        ["💧", "Gün içindeki mini işleri yap", "o alanın çiçeği sulanır, büyür"],
        ["🧺", "Olgunlaşınca topla", "kazandıklarınla bahçeni süsle"]].map(([em, a, b], i) => (
        <div key={i} className="ap" style={{ display: "flex", gap: 12, alignItems: "center", textAlign: "left", padding: "9px 0", animationDelay: `${.2 + i * .3}s` }}>
          <span style={{ fontSize: 24 }}>{em}</span>
          <div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 13.5, color: G.ink }}>{a}</div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 600, fontSize: 12, color: G.faint }}>{b}</div>
          </div>
        </div>
      ))}
      <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11.5, color: G.dim, fontWeight: 800, marginTop: 20, letterSpacing: ".08em" }}>DOKUN</p>
    </div>,

    /* 6 · ses tercihi */
    <div key="e6" className="ap" style={{ textAlign: "center", maxWidth: 290, margin: "0 auto" }}>
      <p style={{ fontFamily: "'Baloo 2',sans-serif", fontSize: 21, color: G.ink, fontWeight: 700 }}>Sana ne kadar sesleneyim?</p>
      <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: G.faint, fontWeight: 600, marginTop: 4, marginBottom: 16 }}>
        Günlük tavan hep 5 — fazla ses, sesi görünmez yapar.
      </p>
      {["Günde bir kez, yeter", "Ara sıra dürt — günde 2-3", "Hiç seslenme, ben gelirim"].map(t => (
        <button key={t} onClick={ileri} style={{ display: "block", width: "100%", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14,
          color: G.ink, background: "#FFF", border: "2px solid #E9EEDD", borderRadius: 16, padding: "13px 14px", marginBottom: 9 }}>
          {t}
        </button>
      ))}
    </div>,

    /* 7 · işte bahçen */
    <div key="e7" className="ap" style={{ textAlign: "center" }}>
      <p style={{ fontFamily: "'Baloo 2',sans-serif", fontSize: 25, color: G.ink, fontWeight: 700 }}>İşte bahçen 🌱</p>
      <div style={{ background: "#FFFFFFAA", borderRadius: 18, padding: "10px 8px 4px", maxWidth: 320, margin: "12px auto" }}>
        <Onizleme genis secim={Object.fromEntries(Object.entries(secim).map(([k, v]) => [k, v.slice(0, 1)]))} filizler />
      </div>
      <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: G.faint, fontWeight: 600, marginBottom: 16 }}>
        İlk filizlerin seni bekliyor.<br />Küçük bir işle sulamak ister misin?
      </p>
      <Buton onClick={() => setE(0)}>İlk görevimi göster</Buton>
      <div style={{ marginTop: 10 }}><Buton ghost onClick={() => setE(0)}>şimdilik bahçeme bakayım</Buton></div>
    </div>,
  ];

  return (
    <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 14, fontFamily: "'Nunito',sans-serif" }}>
      <style>{css}</style>
      <div style={{ width: "100%", maxWidth: 380, minHeight: 620, background: G.bg, borderRadius: 30, boxShadow: "0 24px 60px rgba(65,80,47,.18)",
        display: "flex", flexDirection: "column", padding: "20px 18px" }}>
        <div style={{ height: 3, background: "#E2EAD0", borderRadius: 99, marginBottom: 18 }}>
          <div style={{ height: 3, width: `${((e + 1) / EKRAN.length) * 100}%`, background: G.yesil, borderRadius: 99, transition: "width .6s ease" }} />
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>{EKRAN[e]}</div>
        {e > 0 && <button onClick={() => setE(x => x - 1)} style={{ alignSelf: "center", fontFamily: "'Nunito',sans-serif", fontSize: 11.5, color: G.dim, background: "none", border: "none", fontWeight: 700 }}>geri</button>}
      </div>
    </div>
  );
}
