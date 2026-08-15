import React, { useState, useEffect } from "react";

// ═══════════════════ BOŞLUK · v0.19 ═══════════════════
// Tek fikir: boşluk. Kutu yok, bar yok, buton yok.
// Sorular ortada durur, seçenekler kelimedir; seçilen kalır, gerisi solar, akış kendiliğinden ilerler.

const SKY = "linear-gradient(180deg, #517682 0%, #3A5B66 52%, #2A434C 100%)";
const T = {
  ink: "#F5F0E4", faint: "#AEC3C6", dim: "#849BA1",
  sun: "#EEBB8D", sunSoft: "rgba(238,187,141,0.16)",
  line: "rgba(245,240,228,0.20)",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Figtree:wght@400;500;600&display=swap');
button { -webkit-tap-highlight-color: transparent; } button:focus, button:focus-visible { outline: none; }
.serif { font-family: 'Marcellus', serif; letter-spacing: .015em; }
.sans { font-family: 'Figtree', sans-serif; }
@keyframes appear { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.appear { animation: appear .9s ease both; }
.appear-slow { animation: appear 1.4s .3s ease both; }
@keyframes riseNote { from { opacity: 0; } to { opacity: 1; } }
.rise-note { animation: riseNote 2s .8s ease both; }
@keyframes ovIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes ovOut { from { opacity: 1; } to { opacity: 0; } }
.ov-in { animation: ovIn 1s ease both; }
.ov-out { animation: ovOut .7s ease both; }
@keyframes breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.3); } }
.breathe { animation: breathe 11s ease-in-out infinite; }
@keyframes sunIdle { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2.5px); } }
.sun-idle { animation: sunIdle 6s ease-in-out infinite; }
@keyframes moonBreath { 0%,100% { box-shadow: 0 0 16px 3px rgba(242,239,230,.16); transform: scale(1); } 50% { box-shadow: 0 0 44px 14px rgba(242,239,230,.34); transform: scale(1.05); } }
.moon-breath { animation: moonBreath 11s ease-in-out infinite; }
@keyframes shimmer { 0%,100% { opacity: .12; } 50% { opacity: .34; } }
.shimmer { animation: shimmer 11s ease-in-out infinite; }
@keyframes drift { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.drift-a { animation: drift 26s linear infinite; }
.drift-b { animation: drift 38s linear infinite reverse; }
@media (prefers-reduced-motion: reduce) { .appear,.appear-slow,.rise-note,.ov-in,.ov-out,.breathe,.moon-breath,.shimmer,.drift-a,.drift-b,.sun-idle { animation: none; } }
`;

// ═══════ VERİ (katalogdan) ═══════
const ARKETIP = {
  baslama: { ad: "başlama", kim: "sözünü tutan", micro: ["2 dakikalık versiyonu", "sadece hazırlığı yap", "ilk küçük adımı at"] },
  birakma: { ad: "bırakma", kim: "iradesine güvenen", micro: ["istek gelince bir bardak su iç", "10 dakika ertele", "elini başka şeyle meşgul et"] },
  azaltma: { ad: "azaltma", kim: "dengesini kuran", micro: ["porsiyonu yarıya böl", "önce alternatifi dene", "limiti bir tık düşür"] },
  duzenlilik: { ad: "düzen", kim: "ritmini bulan", micro: ["aynı ana sabitle", "hazırlığı akşamdan yap", "bir bardak suyla başlat"] },
  erteleme: { ad: "erteleme yenme", kim: "başlayabilen", micro: ["sadece 2 dakika başla", "dosyayı aç, o kadar", "ilk cümleyi yaz"] },
  duygu: { ad: "duygu anı", kim: "fırtınada sakin kalan", micro: ["üç derin nefes", "odayı değiştir", "içinden ona kadar say"] },
  daginik: { ad: "dağınık bakım", kim: "evine sahip çıkan", micro: [] },
};
const TETIK = { duygu: "o duygu yükseldiği an", birakma: "istek geldiği an", azaltma: "istek geldiği an" };
const KATALOG = {
  F01: { kim: "evine sahip çıkan", ad: "ev toplama", hafta: 10, kartlar: [
    { id: "F01-01", txt: "gözüne ilişen beş şeyi yerine koy", z: 1, ctx: "her yer" },
    { id: "F01-02", txt: "bir yüzeyi tamamen boşalt", z: 2, ctx: "her yer" },
    { id: "F01-03", txt: "ortalıktaki çöpleri topla, poşeti kapıya bırak", z: 1, ctx: "her yer" },
    { id: "F01-04", txt: "yerdeki her şeyi kaldır — tek oda yeter", z: 2, ctx: "her yer" },
    { id: "F01-05", txt: "evine dönmemiş bir eşyayı odasına götür, beş kez", z: 1, ctx: "her yer" },
    { id: "F01-06", txt: "bir çekmeceyi düzenle, sadece bir tane", z: 2, ctx: "her yer" },
    { id: "F01-07", txt: "su şişesi ve bardak turu: hepsi mutfağa", z: 1, ctx: "her yer" },
    { id: "F01-08", txt: "bir 'sonra bakarım' yığınından beş parça eksilt", z: 3, ctx: "her yer" },
    { id: "F01-09", txt: "bir rafı boşalt, sil, yerleştir", z: 3, ctx: "her yer" },
  ]},
  F02: { kim: "mutfağına sahip çıkan", ad: "mutfak", hafta: 8, kartlar: [
    { id: "F02-01", txt: "tezgahı tamamen boşalt ve sil", z: 2, ctx: "mutfak" },
    { id: "F02-02", txt: "makineyi boşalt veya doldur — ikisi değil", z: 2, ctx: "mutfak" },
    { id: "F02-03", txt: "buzdolabından tarihi geçmiş üç şey çıkar", z: 2, ctx: "mutfak" },
    { id: "F02-04", txt: "ocak üstünü sil", z: 1, ctx: "mutfak" },
    { id: "F02-05", txt: "çöpü çıkar, yeni poşet tak", z: 1, ctx: "mutfak" },
    { id: "F02-06", txt: "bir mutfak çekmecesini düzenle", z: 2, ctx: "mutfak" },
    { id: "F02-07", txt: "saklama kabı dolabına iki dakika", z: 3, ctx: "mutfak" },
  ]},
  F06: { kim: "bebeğine düzenli bir yuva kuran", ad: "bebek odası", hafta: 6, kartlar: [
    { id: "F06-01", txt: "oyuncakları kutusuna süpür — bebek de katılabilir", z: 1, ctx: "çocuk odası" },
    { id: "F06-02", txt: "küçülen kıyafetlerden beş parça ayır", z: 2, ctx: "çocuk odası" },
    { id: "F06-03", txt: "bez istasyonunu tamamla", z: 1, ctx: "çocuk odası" },
    { id: "F06-04", txt: "kitapları rafa diz", z: 1, ctx: "çocuk odası" },
    { id: "F06-05", txt: "kirli zıbınlar sepete, temizler çekmeceye", z: 1, ctx: "çocuk odası" },
    { id: "F06-06", txt: "bir oyuncak kutusunu ayıkla", z: 3, ctx: "çocuk odası" },
  ]},
  F07: { kim: "masasını hazır tutan", ad: "çalışma masası", hafta: 4, kartlar: [
    { id: "F07-01", txt: "masa üstünü tamamen boşalt, laptop hariç", z: 2, ctx: "masa" },
    { id: "F07-02", txt: "kağıt yığınından beş parça: dosyala ya da at", z: 2, ctx: "masa" },
    { id: "F07-03", txt: "kabloları topla, birini düzenle", z: 1, ctx: "masa" },
    { id: "F07-04", txt: "bardak turu: mutfağa", z: 1, ctx: "masa" },
    { id: "F07-05", txt: "yarının ilk işini nota yaz, ekrana yapıştır", z: 1, ctx: "masa" },
  ]},
  E02: { kim: "işini erteletmeyen", ad: "minik işler", hafta: 8, kartlar: [
    { id: "E02-01", txt: "o randevuyu şimdi al", z: 2, ctx: "telefon" },
    { id: "E02-02", txt: "iade işlemini başlat", z: 2, ctx: "telefon" },
    { id: "E02-03", txt: "kargo kodunu al, çantana koy", z: 1, ctx: "telefon" },
    { id: "E02-04", txt: "o formu doldur — ilk sayfası da olur", z: 2, ctx: "telefon" },
    { id: "E02-05", txt: "ertelediğin işi takvime tarih vererek yaz", z: 1, ctx: "telefon" },
    { id: "E02-06", txt: "o parayı gönder ya da iste", z: 1, ctx: "telefon" },
    { id: "E02-07", txt: "fatura talimatını kur", z: 3, ctx: "telefon" },
  ]},
  D01: { kim: "zihnine yer açan", ad: "mail kutusu", hafta: 6, kartlar: [
    { id: "D01-01", txt: "on maili sil ya da arşivle", z: 1, ctx: "telefon" },
    { id: "D01-02", txt: "bir bültenden çık", z: 1, ctx: "telefon" },
    { id: "D01-03", txt: "cevap bekleyen üç maili yıldızla", z: 1, ctx: "telefon" },
    { id: "D01-04", txt: "en eski okunmamışa in: beş karar", z: 2, ctx: "telefon" },
    { id: "D01-05", txt: "tek maile iki cümlelik cevap yaz", z: 2, ctx: "telefon" },
  ]},
};
const MATCHERS = [
  { id: "F02", re: /mutfak|tezgah|bulaşık|buzdolabı/ },
  { id: "F06", re: /oyuncak|bebek odası|çocuk odası|zıbın/ },
  { id: "F07", re: /çalışma masası|masam|home ?office|ofis masası/ },
  { id: "D01", re: /mail|e-?posta|gelen kutusu|inbox|bülten/ },
  { id: "E02", re: /randevu|iade|form|kargo|minik iş|ufak iş|halletmem/ },
  { id: "F01", re: /ev|topla|toparla|dağınık|düzenle|derli|savaş alanı/ },
];
const matchKatalog = (t) => MATCHERS.filter(m => m.re.test(t.toLowerCase())).map(m => m.id);
const detectArketip = (t) => {
  const s = t.toLowerCase();
  if (/topla|temizl|dağınık|evrak|biriken/.test(s)) return "daginik";
  if (/bırak|sigara|tırnak/.test(s)) return "birakma";
  if (/azalt|daha az|şeker|tatlı|ekran|scroll/.test(s)) return "azaltma";
  if (/her gün|düzen|uyku|su iç|erken/.test(s)) return "duzenlilik";
  if (/ertele|başlayam|proje|tez|rapor/.test(s)) return "erteleme";
  if (/öfke|sinir|kaygı|tartış|sakin|panik/.test(s)) return "duygu";
  return "baslama";
};
const ORNEKLER = ["spora başlamak", "kitap okumak", "evi toplamak", "şekeri azaltmak", "öfkelenince sakin kalmak"];
const ANCHORS = ["kahve makinesi çalışırken", "bebek uyuyunca", "diş fırçasından sonra", "telefonu şarja takınca"];
const NOTLAR = {
  deger: { src: "Clear", txt: "her tekrar, o kişiye atılmış bir oydur." },
  zarf: { src: "Clear", txt: "asla iki kez üst üste kaçırma. bir hata kazadır; iki hata yeni bir alışkanlığın başlangıcıdır." },
};
const TOPLULUK = [
  "ben de istemiyordum. sadece kıyafeti giydim, gerisi kendi geldi.",
  "kendime iki dakika dedim, yirmi dakika olmuş.",
  "istemeye istemeye başladım, bitirince günün en iyi anıydı.",
];
const OKUMALAR = [
  { t: "iki dakika kuralı", src: "Clear", txt: "yeni bir alışkanlık iki dakikadan uzun sürmemeli. kitap okumak değil, bir sayfa açmak. kapı aralanınca gerisi kendiliğinden gelir — ama söz hep kapıyı açmak kadar küçük kalır." },
  { t: "motivasyon dalgası", src: "Fogg", txt: "motivasyon okyanus dalgası gibidir: bazen yüksek, bazen çekilmiş. sistem, dalgaya değil cılız günlere göre kurulur." },
  { t: "bıkkınlık vadisi", src: "Clear", txt: "heyecan geçer ve sonuçlar hâlâ görünmezdir. bu araziye vadi denir ve herkes geçer. vadi, sistemin çalıştığının işaretidir." },
];

// ═══════ TEMEL PARÇALAR ═══════
// Ufuk ve güneş: tek süs
function Horizon({ up = false, moon = false, size = 26, idle = false }) {
  return (
    <div className="relative mx-auto my-8" style={{ height: size + 18, overflow: "hidden", maxWidth: 240 }}>
      <div className={"absolute rounded-full" + (idle && !up ? " sun-idle" : "")} style={{
        left: "50%", marginLeft: -size / 2, width: size, height: size,
        top: up ? 4 : size + 4,
        background: moon ? "#EAE7DD" : T.sun,
        transition: "top 1.8s cubic-bezier(.25,.8,.3,1), box-shadow 1.8s ease",
        boxShadow: up ? (moon ? "0 0 26px rgba(234,231,221,.25)" : "0 0 30px rgba(231,177,137,.45)") : "none",
      }} />
      <div className="absolute left-0 right-0" style={{ bottom: 0, borderTop: `1px solid ${T.line}` }} />
    </div>
  );
}

// Kelime-seçim: seçilen kalır, diğerleri solar, akış kendiliğinden ilerler
function Choice({ items, onPick, delay = 850 }) {
  const [sel, setSel] = useState(null);
  const pick = (i) => {
    if (sel !== null) return;
    setSel(i);
    setTimeout(() => onPick(items[i]), delay);
  };
  return (
    <div className="flex flex-col items-center gap-5 my-2">
      {items.map((it, i) => (
        <button key={it} onClick={() => pick(i)} className="serif text-lg"
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: sel === i ? T.sun : T.ink,
            opacity: sel === null ? 1 : sel === i ? 1 : 0.12,
            transition: "opacity .9s ease, color .9s ease",
          }}>
          {it}
        </button>
      ))}
    </div>
  );
}

// Sözcük-eylem: buton yerine kelime
const Word = ({ children, onClick, tone = T.sun, size = "text-base", className = "" }) => (
  <button onClick={onClick} className={`sans ${size} ${className}`}
    style={{ background: "none", border: "none", color: tone, cursor: "pointer", letterSpacing: ".04em", fontWeight: 500 }}>
    {children}
  </button>
);

// Tam ekran ara sayfa (kıvılcım / zarf / okuma)
function Veil({ closing, onClose, children }) {
  return (
    <div onClick={onClose} className={`absolute inset-0 z-50 flex flex-col items-center justify-center px-10 text-center ${closing ? "ov-out" : "ov-in"}`}
      style={{ background: SKY, cursor: "pointer" }}>
      {children}
      <p className="sans text-xs mt-14" style={{ color: T.dim }}>dokun ve dön</p>
    </div>
  );
}


// ═══════ KARŞILAMA · iki nefes, sonra ilk soru ═══════
function Intro({ step, onNext, onSkip }) {
  return (
    <div onClick={onNext} className="flex-1 flex flex-col items-center justify-center px-10 text-center relative" style={{ cursor: "pointer" }}>
      <div key={step} className="appear" style={{ maxWidth: 290 }}>
        {step === 0 ? (
          <>
            <Horizon idle size={30} />
            <p className="serif text-xl leading-loose" style={{ color: T.ink }}>
              gün ne kadar dolu olursa olsun,<br />içinde küçük bir söz için yer vardır.
            </p>
          </>
        ) : (
          <>
            <p className="serif text-xl leading-loose mb-5" style={{ color: T.ink }}>
              burada seri yok,<br />rozet yok, suçluluk yok.
            </p>
            <p className="sans text-sm leading-relaxed" style={{ color: T.faint }}>
              günde tek küçük söz verirsin; tuttuğunda güneş doğar.
              ben günde en fazla bir kez seslenirim — üç dakikan yeter.
            </p>
          </>
        )}
      </div>
      <p className="sans text-xs mt-16" style={{ color: T.dim, letterSpacing: ".08em" }}>dokun</p>
      <button onClick={(e) => { e.stopPropagation(); onSkip(); }} className="sans text-xs absolute"
        style={{ bottom: 24, right: 28, background: "none", border: "none", color: T.dim, opacity: .7, cursor: "pointer" }}>
        geç
      </button>
    </div>
  );
}

// ═══════ ONBOARDING ═══════
function Onboarding({ onDone }) {
  const [idx, setIdx] = useState(0);
  const [cfg, setCfg] = useState({ goals: [], aktif: null, micro: null, anchor: null });
  const [draft, setDraft] = useState("");
  const aktifGoal = cfg.aktif !== null ? cfg.goals[cfg.aktif] : null;
  const ark = aktifGoal ? ARKETIP[aktifGoal.ark] : ARKETIP.baslama;
  const tetik = aktifGoal ? TETIK[aktifGoal.ark] : null;
  const isPull = aktifGoal?.ark === "daginik";

  const flow = ["goals",
    ...(cfg.goals.length > 1 ? ["whyOne", "pick"] : []),
    "whySmall",
    isPull ? "deste" : "micro",
    ...(tetik ? ["tetikNote"] : isPull ? [] : ["whyAnchor", "anchor"]),
    "soz"];
  const cur = flow[idx];
  const next = () => setIdx(i => i + 1);

  const addGoal = (t, hedefId = null) => {
    t = t.trim(); if (!t || cfg.goals.some(g => g.t === t)) return;
    const ark = hedefId ? "daginik" : detectArketip(t);
    setCfg(c => ({ ...c, goals: [...c.goals, { t, ark, hedefId }] }));
    setDraft("");
  };
  const autoKim = (aktifGoal?.hedefId && KATALOG[aktifGoal.hedefId].kim) || ark.kim;

  const pages = {
    goals: (
      <div className="appear w-full">
        <p className="serif text-2xl text-center mb-10" style={{ color: T.ink }}>peki — senin için ne değişsin?</p>
        <div className="mx-auto" style={{ maxWidth: 280 }}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addGoal(draft)}
            placeholder="yazmaya başla" autoFocus
            className="serif w-full text-center text-lg py-2 mb-1"
            style={{ background: "transparent", border: "none", borderBottom: `1px solid ${T.line}`, color: T.ink, outline: "none" }} />
          {draft.trim().length >= 2 ? (() => {
            const q = draft.trim().toLowerCase();
            const sugg = [
              ...matchKatalog(q).map(id => ({ label: KATALOG[id].ad, id })),
              ...ORNEKLER.filter(o => o.includes(q) && !cfg.goals.some(g => g.t === o)).map(o => ({ label: o, id: null })),
            ].slice(0, 3);
            return (
              <div className="flex flex-col items-center gap-2 mt-4">
                {sugg.map(sg => (
                  <Word key={sg.label} tone={T.faint} size="text-sm" onClick={() => addGoal(sg.label, sg.id)}>{sg.label}</Word>
                ))}
                {draft.trim().length > 2 && <Word size="text-sm" onClick={() => addGoal(draft)}>"{draft.trim()}" olarak ekle</Word>}
              </div>
            );
          })() : cfg.goals.length === 0 && (
            <div className="flex flex-col items-center gap-2 mt-4" style={{ opacity: .7 }}>
              {ORNEKLER.slice(0, 3).map(o => <Word key={o} tone={T.dim} size="text-sm" onClick={() => addGoal(o)}>{o}</Word>)}
            </div>
          )}
          {cfg.goals.length > 0 && (
            <div className="mt-8 flex flex-col items-center gap-2">
              {cfg.goals.map((g, i) => (
                <p key={i} className="sans text-sm" style={{ color: T.faint }}>
                  {g.t} <span style={{ color: T.dim }}>· {g.hedefId ? KATALOG[g.hedefId].ad : ARKETIP[g.ark].ad}</span>
                </p>
              ))}
            </div>
          )}
        </div>
        {cfg.goals.length > 0 && (
          <div className="text-center mt-10">
            <Word onClick={() => { if (cfg.goals.length === 1) setCfg(c => ({ ...c, aktif: 0 })); next(); }}>devam</Word>
          </div>
        )}
      </div>
    ),

    whyOne: (
      <div className="appear text-center" style={{ maxWidth: 280 }}>
        <p className="serif text-xl leading-relaxed mb-3" style={{ color: T.ink }}>
          hepsini duydum.<br />ama tek biriyle başlayacağız.
        </p>
        <p className="sans text-sm leading-relaxed mb-2" style={{ color: T.faint }}>
          aynı anda çok şeyi değiştirmeye çalışanların başarısı dramatik düşer. diğerleri sırada güvende — iki hafta tutarlılıkta sıradakinin kilidi açılır.
        </p>
        <p className="sans text-xs mb-8" style={{ color: T.dim }}>— Fogg, McKeown</p>
        <Word onClick={next}>anladım</Word>
      </div>
    ),

    pick: (
      <div className="appear text-center w-full">
        <p className="serif text-2xl mb-10" style={{ color: T.ink }}>hangisiyle başlayalım?</p>
        <Choice items={cfg.goals.map(g => g.t)} onPick={(t) => { setCfg(c => ({ ...c, aktif: c.goals.findIndex(g => g.t === t) })); next(); }} />
      </div>
    ),

    whySmall: (
      <div className="appear text-center" style={{ maxWidth: 280 }}>
        <p className="serif text-xl leading-relaxed mb-3" style={{ color: T.ink }}>şimdi onu<br />şaşırtıcı derecede küçülteceğiz.</p>
        <p className="sans text-sm leading-relaxed mb-2" style={{ color: T.faint }}>
          küçük hedefler başarıyı artırır, çünkü beyin başarıyı tekrar ister. büyütmek hep serbest — söz hep küçük kalacak.
        </p>
        <p className="sans text-xs mb-8" style={{ color: T.dim }}>— Fogg</p>
        <Word onClick={next}>anladım</Word>
      </div>
    ),

    micro: (
      <div className="appear text-center w-full">
        <p className="sans text-xs mb-2" style={{ color: T.dim }}>{aktifGoal?.t}</p>
        <p className="serif text-2xl mb-10" style={{ color: T.ink }}>küçük versiyonu:</p>
        <Choice items={ark.micro} onPick={(m) => { setCfg(c => ({ ...c, micro: m, ...(tetik ? { anchor: tetik } : {}) })); next(); }} />
      </div>
    ),

    deste: (() => {
      const kat = KATALOG[aktifGoal?.hedefId] || KATALOG.F01;
      return (
        <div className="appear text-center" style={{ maxWidth: 290 }}>
          <p className="sans text-xs mb-2" style={{ color: T.dim }}>{aktifGoal?.t}</p>
          <p className="serif text-xl mb-6" style={{ color: T.ink }}>sana bir deste hazırladım.</p>
          <div className="flex flex-col gap-2.5 mb-6">
            {kat.kartlar.slice(0, 4).map(k => (
              <p key={k.id} className="serif text-sm" style={{ color: T.faint }}>{k.txt}</p>
            ))}
            <p className="sans text-xs" style={{ color: T.dim }}>+ {kat.kartlar.length - 4} kart daha</p>
          </div>
          <p className="sans text-sm leading-relaxed mb-8" style={{ color: T.faint }}>
            çapa yok, saat yok. boşluğun olduğunda söylersin, kartı ben çekerim. haftada {kat.hafta} kart yeter.
          </p>
          <Word onClick={() => { setCfg(c => ({ ...c, micro: "desteden bir kart", anchor: "iki dakikan olduğu an" })); next(); }}>tamam</Word>
        </div>
      );
    })(),

    tetikNote: (
      <div className="appear text-center" style={{ maxWidth: 280 }}>
        <p className="serif text-xl leading-relaxed mb-3" style={{ color: T.ink }}>çapaya gerek yok.</p>
        <p className="sans text-sm leading-relaxed mb-8" style={{ color: T.faint }}>
          bu hedefin çapası hayatın kendisi: <span style={{ color: T.ink }}>{tetik}</span> zaten en net hatırlatıcı. o an geldiğinde ben değil, durum hatırlatır.
        </p>
        <Word onClick={next}>tamam</Word>
      </div>
    ),

    whyAnchor: (
      <div className="appear text-center" style={{ maxWidth: 280 }}>
        <p className="serif text-xl leading-relaxed mb-3" style={{ color: T.ink }}>şimdi onu<br />bir ana bağlayacağız.</p>
        <p className="sans text-sm leading-relaxed mb-2" style={{ color: T.faint }}>
          yeni alışkanlık boşlukta unutulur. zaten yaptığın bir şeyin ardına eklersen, önceki alışkanlık zili çalar.
        </p>
        <p className="sans text-xs mb-8" style={{ color: T.dim }}>— Clear</p>
        <Word onClick={next}>anladım</Word>
      </div>
    ),

    anchor: (
      <div className="appear text-center w-full">
        <p className="serif text-2xl mb-10" style={{ color: T.ink }}>hangi anın ardına?</p>
        <Choice items={ANCHORS} onPick={(a) => { setCfg(c => ({ ...c, anchor: a })); next(); }} />
      </div>
    ),

    soz: (
      <div className="appear text-center" style={{ maxWidth: 290 }}>
        <Horizon up={false} />
        <p className="serif text-xl leading-loose mb-2" style={{ color: T.ink }}>
          {cfg.anchor},<br /><span style={{ color: T.sun }}>{cfg.micro}</span>.
        </p>
        <p className="sans text-sm mb-8" style={{ color: T.faint }}>çünkü sen {autoKim} birisin.</p>
        <p className="sans text-xs leading-relaxed mb-10" style={{ color: T.dim }}>
          benim sözüm: günde en fazla bir kez seslenirim.<br />seri yok, suçluluk yok. günde üç dakikan yeter.
        </p>
        <Word onClick={() => onDone({ ...cfg, kimlik: autoKim, kopma: "deger" })}>söz — başlayalım</Word>
      </div>
    ),
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div style={{ height: 2, background: T.line }}>
        <div style={{ height: 2, width: `${((idx + 1) / flow.length) * 100}%`, background: T.sun, transition: "width 1s ease", opacity: .7 }} />
      </div>
      <div className="flex-1 flex items-center justify-center px-8">
        <div key={cur} className="w-full flex justify-center">{pages[cur]}</div>
      </div>
    </div>
  );
}

// ═══════ İLK YARDIM ═══════
function FirstAid({ cfg, onClose, onDid, closing }) {
  const [step, setStep] = useState("kabul");
  const toplum = TOPLULUK[Math.floor(Math.random() * TOPLULUK.length)];
  const R = {
    yorgun: ["o zaman bugün izin günü tarifi.", `tarif değil, sadece hazırlığı. sayılır — söz.`],
    sikildim: ["sıkıcı olan tarif, sen değilsin.", "bugün sevdiğin bir şeyle eşleştir: podcast, müzik, ne iyi geliyorsa."],
    dolu: ["önce bir dakika nefes.", ""],
    istemiyorum: ["iki dakika anlaşması.", "sadece başla. iki dakika sonra bırakabilirsin — gerçekten. gelmese de anlaşma geçerli."],
  };
  return (
    <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center px-10 text-center ${closing ? "ov-out" : "ov-in"}`} style={{ background: SKY }}>
      {step === "kabul" && (
        <div className="appear">
          <p className="serif text-2xl mb-2" style={{ color: T.ink }}>iyi ki söyledin.</p>
          <p className="sans text-sm mb-8" style={{ color: T.faint }}>nasıl bir istememe bu?</p>
          <Choice delay={600} items={["yorgunum", "sıkıldım", "kafam çok dolu", "sebepsiz — işte istemiyorum"]}
            onPick={(t) => {
              const k = t === "yorgunum" ? "yorgun" : t === "sıkıldım" ? "sikildim" : t.includes("dolu") ? "dolu" : "istemiyorum";
              setStep(k === "dolu" ? "nefes" : "recete-" + k);
            }} />
          <div className="mt-8"><Word tone={T.dim} size="text-xs" onClick={onClose}>vazgeçtim, iyiyim</Word></div>
        </div>
      )}
      {step === "nefes" && (
        <div className="appear">
          <div className="moon-breath mx-auto mb-10 rounded-full" style={{ width: 64, height: 64, background: "#F2EFE6" }} />
          <p className="sans text-sm mb-10" style={{ color: T.faint }}>büyürken al, küçülürken ver.<br />bir dakika buradayım.</p>
          <Word onClick={() => setStep("recete-istemiyorum")}>biraz daha iyiyim</Word>
        </div>
      )}
      {step.startsWith("recete-") && (() => {
        const k = step.slice(7); const [b, m] = R[k];
        return (
          <div className="appear" style={{ maxWidth: 280 }}>
            <p className="serif text-xl mb-3" style={{ color: T.ink }}>{b}</p>
            {m && <p className="sans text-sm mb-6" style={{ color: T.faint }}>{m}</p>}
            <p className="sans text-xs mb-1" style={{ color: T.dim }}>senin gibi biri, üç gün önce:</p>
            <p className="serif text-sm mb-10" style={{ color: T.faint, fontStyle: "italic" }}>"{toplum}"</p>
            <Word onClick={onDid}>tamam, deniyorum</Word>
            <div className="mt-4"><Word tone={T.dim} size="text-xs" onClick={() => setStep("kasa")}>hâlâ olmuyor</Word></div>
          </div>
        );
      })()}
      {step === "kasa" && (
        <div className="appear" style={{ maxWidth: 280 }}>
          <p className="sans text-xs mb-3" style={{ color: T.dim }}>kanıt kasandan, 23 gün önce:</p>
          <p className="serif text-2xl mb-2" style={{ color: T.ink }}>"hiç istemiyordum<br />ama yaptım."</p>
          <p className="sans text-xs mb-10" style={{ color: T.faint }}>— sen, aynı yerdeyken</p>
          <Word onClick={onDid}>peki. deniyorum</Word>
          <div className="mt-4"><Word tone={T.dim} size="text-xs" onClick={() => setStep("izin")}>bugün olmayacak</Word></div>
        </div>
      )}
      {step === "izin" && (
        <div className="appear">
          <Horizon up={false} moon />
          <p className="serif text-xl mb-3" style={{ color: T.ink }}>bugünü boş bırakalım.</p>
          <p className="sans text-sm mb-10" style={{ color: T.faint }}>bazı günler böyledir. yarın buradayım —<br />aynı an, aynı küçük tarif.</p>
          <Word onClick={onClose}>görüşürüz</Word>
        </div>
      )}
    </div>
  );
}

// ═══════ BUGÜN ═══════
function Today({ cfg, stamped, onStamp, votes, onFirstAid, envelope, onEnvelope, viaFirstAid }) {
  const goal = cfg.goals[cfg.aktif];
  const arkId = goal?.ark || "baslama";
  const [card, setCard] = useState(null);
  const [weekCards, setWeekCards] = useState(6);
  const [history, setHistory] = useState([]);
  const [redraws, setRedraws] = useState(0);
  const [urge, setUrge] = useState(false);
  const [checkin, setCheckin] = useState(null);
  const [sentence, setSentence] = useState("");
  const [sentSent, setSentSent] = useState(false);
  const not = NOTLAR.deger;

  const Celebrate = () => (
    <div className="text-center">
      <p className="serif text-lg mb-6" style={{ color: T.sun }}>+1 <span className="sans text-sm" style={{ color: T.faint }}>· {votes}. oy</span></p>
      <p className="rise-note serif text-sm leading-relaxed" style={{ color: T.faint, fontStyle: "italic", maxWidth: 260, margin: "0 auto" }}>
        "{not.txt}" <span className="sans text-xs" style={{ fontStyle: "normal", color: T.dim }}>— {not.src}</span>
      </p>
      {viaFirstAid && !sentSent && (
        <div className="rise-note mt-8">
          <p className="sans text-xs mb-3" style={{ color: T.dim }}>az önce istemiyordun ama yaptın.<br />aynı yerde durana tek cümle bırakır mısın?</p>
          <input value={sentence} onChange={e => setSentence(e.target.value)} placeholder="tek cümle yeter"
            className="serif text-center text-sm py-2 w-full" style={{ maxWidth: 240, background: "transparent", border: "none", borderBottom: `1px solid ${T.line}`, color: T.ink, outline: "none" }} />
          {sentence.trim() && <div className="mt-3"><Word size="text-xs" onClick={() => setSentSent(true)}>bırak</Word></div>}
        </div>
      )}
      {sentSent && <p className="rise-note sans text-xs mt-6" style={{ color: T.faint }}>cümlen havuzda. bir gün tam ihtiyacı olana gösterilecek.</p>}
    </div>
  );

  return (
    <div className="w-full text-center px-2">
      <p className="sans text-xs mb-1" style={{ color: T.dim }}>hafta 3 · çarşamba{goal ? ` · ${goal.t}` : ""}</p>

      {/* 🌱🕰️🐌 çapa ailesi */}
      {!["daginik", "birakma", "azaltma", "duygu"].includes(arkId) && (
        <>
          <p className="serif text-2xl" style={{ color: T.ink }}>{stamped ? "bugünlük bu kadar." : "tek işin var."}</p>
          <Horizon up={stamped} />
          {!stamped ? (
            <>
              <p className="sans text-xs mb-6" style={{ color: T.dim }}>sözünü tuttuğunda güneş doğar</p>
              <p className="serif text-xl leading-relaxed mb-8" style={{ color: T.ink }}>
                {cfg.anchor},<br /><span style={{ color: T.sun }}>{cfg.micro}?</span>
              </p>
              <Word onClick={onStamp} size="text-lg">yaptım</Word>
              <div className="mt-5"><Word tone={T.dim} size="text-xs" onClick={onFirstAid}>bugün canım hiç istemiyor</Word></div>
            </>
          ) : <Celebrate />}
        </>
      )}

      {/* 🧺 dağınık bakım */}
      {arkId === "daginik" && (() => {
        const kat = KATALOG[goal?.hedefId] || KATALOG.F01;
        const ctxList = ["neredeysem", ...new Set(kat.kartlar.map(k => k.ctx))];
        const [ctx, setCtx] = [card?._ctx ?? "neredeysem", null];
        const draw = (ctxSel) => {
          let pool = kat.kartlar.filter(k => !history.slice(-3).includes(k.id));
          if (ctxSel && ctxSel !== "neredeysem") pool = pool.filter(k => k.ctx === ctxSel);
          const lastZ = history.length ? kat.kartlar.find(k => k.id === history[history.length - 1])?.z : null;
          if (lastZ === 3) pool = pool.filter(k => k.z !== 3);
          if (!pool.length) pool = kat.kartlar;
          return pool[Math.floor(Math.random() * pool.length)];
        };
        return (
          <>
            <p className="serif text-2xl" style={{ color: T.ink }}>{stamped ? "bir kart daha gitti." : "deste hazır."}</p>
            <Horizon up={stamped} />
            {!stamped && <p className="sans text-xs mb-6" style={{ color: T.dim }}>bu hafta {weekCards}/{kat.hafta}</p>}
            {!card && !stamped && (
              <>
                <Word onClick={() => { setCard(draw()); setRedraws(0); }} size="text-lg">iki dakikam var</Word>
                <div className="mt-5"><Word tone={T.dim} size="text-xs" onClick={onFirstAid}>bugün ev beni yendi</Word></div>
              </>
            )}
            {card && !stamped && (
              <div className="appear">
                <p className="serif text-xl leading-relaxed mb-2" style={{ color: T.sun, maxWidth: 260, margin: "0 auto" }}>{card.txt}</p>
                <p className="sans text-xs mb-8" style={{ color: T.dim }}>{card.z === 3 ? "cesaret kartı · " : ""}iki dakika. fazlası serbest.</p>
                <Word onClick={() => { setHistory(h => [...h, card.id]); setWeekCards(w => w + 1); setCard(null); onStamp(); }} size="text-lg">yaptım</Word>
                <div className="mt-4"><Word tone={T.dim} size="text-xs" onClick={() => { setHistory(h => [...h, card.id]); setCard(draw()); setRedraws(r => r + 1); }}>başka kart</Word></div>
                {redraws >= 2 && <p className="appear sans text-xs mt-4" style={{ color: T.faint }}>üst üste geri koyuyorsun — istersen desteyi birlikte düzenleyelim.</p>}
              </div>
            )}
            {stamped && (
              <>
                <Celebrate />
                <div className="mt-6"><Word tone={T.faint} size="text-sm" onClick={() => { onStamp(false); setCard(null); }}>iki dakikam daha var</Word></div>
              </>
            )}
          </>
        );
      })()}

      {/* ✂️🤏 istek ailesi */}
      {["birakma", "azaltma"].includes(arkId) && (
        <>
          <p className="serif text-2xl" style={{ color: T.ink }}>{stamped ? "direndin." : "bugün de senin günün."}</p>
          <Horizon up={stamped} />
          <p className="sans text-xs mb-8" style={{ color: T.dim }}>son 30 günde 26 temiz gün</p>
          {!urge && !stamped && <Word onClick={() => setUrge(true)} size="text-lg">istek geldi</Word>}
          {urge && !stamped && (
            <div className="appear">
              <p className="serif text-xl mb-2" style={{ color: T.sun }}>{cfg.micro}</p>
              <p className="sans text-xs mb-8" style={{ color: T.faint }}>on dakika geçir — dalga tepe yapar ve iner.<br />sörf yap, boğuşma.</p>
              <Word onClick={onStamp} size="text-lg">uyguladım</Word>
              <div className="mt-4"><Word tone={T.dim} size="text-xs" onClick={() => setUrge(false)}>dalga geçti, iyiyim</Word></div>
            </div>
          )}
          {stamped && <Celebrate />}
        </>
      )}

      {/* 🌊 duygu anı */}
      {arkId === "duygu" && (
        <>
          <p className="serif text-2xl" style={{ color: T.ink }}>{checkin ? "kaydettim." : "akşam yoklaması"}</p>
          <Horizon up={checkin === "uyguladim"} moon />
          {!checkin ? (
            <>
              <p className="sans text-sm mb-8" style={{ color: T.faint }}>bugün o an geldi mi?<br /><span className="text-xs" style={{ color: T.dim }}>protokolün hazırdı: {cfg.micro}</span></p>
              <Choice delay={600} items={["geldi — protokolü uyguladım", "geldi — uygulayamadım", "bugün gelmedi"]}
                onPick={(t) => { const k = t.includes("uyguladım") ? "uyguladim" : t.includes("uygulayamadım") ? "olmadi" : "gelmedi"; setCheckin(k); if (k === "uyguladim") onStamp(); }} />
            </>
          ) : checkin === "uyguladim" ? (
            <Celebrate />
          ) : (
            <p className="appear sans text-sm leading-relaxed" style={{ color: T.faint, maxWidth: 260, margin: "0 auto" }}>
              {checkin === "olmadi" ? "suç yok, veri var. pazar günü protokolü birlikte küçültürüz." : "sakin bir gün de kayıttır. protokol hazır bekliyor."}
            </p>
          )}
        </>
      )}

      {/* zarf + kohort: sessiz satırlar */}
      <div className="mt-12 flex flex-col items-center gap-3">
        {envelope && !stamped && <Word tone={T.faint} size="text-xs" onClick={onEnvelope}>✉ sana bir zarf var</Word>}
        <p className="sans text-xs" style={{ color: T.dim }}>27 kişiden %71'i vadiyi geçti{stamped ? " — sen de içindesin" : ""}</p>
      </div>
    </div>
  );
}

// ═══════ DİĞER ALANLAR ═══════
function Liman({ onRead }) {
  const Wave = ({ cls, bottom, o }) => (
    <div className={cls + " absolute"} style={{ bottom, left: 0, width: "200%", height: 14, opacity: o }}>
      <svg width="100%" height="14" preserveAspectRatio="none" viewBox="0 0 400 14">
        <path d="M0 7 Q 25 0 50 7 T 100 7 T 150 7 T 200 7 T 250 7 T 300 7 T 350 7 T 400 7" fill="none" stroke="#F5F0E4" strokeWidth="1" />
      </svg>
    </div>
  );
  return (
    <div className="w-full text-center px-2">
      <p className="serif text-2xl mb-1" style={{ color: T.ink }}>liman</p>
      <p className="sans text-xs" style={{ color: T.dim }}>sayaç yok, bildirim yok</p>

      {/* gece denizi: nefes alan ay, suya vuran yansıması, süzülen dalgalar */}
      <div className="relative mx-auto my-6" style={{ height: 200, maxWidth: 320, overflow: "hidden" }}>
        <div className="moon-breath absolute rounded-full" style={{ left: "50%", marginLeft: -26, top: 36, width: 52, height: 52, background: "#F2EFE6" }} />
        <div className="absolute left-0 right-0" style={{ top: 122, borderTop: `1px solid ${T.line}` }} />
        <div className="shimmer absolute" style={{ left: "50%", marginLeft: -16, top: 126, width: 32, height: 58, background: "linear-gradient(180deg, rgba(242,239,230,.5) 0%, transparent 100%)", filter: "blur(3px)" }} />
        <Wave cls="drift-a" bottom={38} o={0.10} />
        <Wave cls="drift-b" bottom={16} o={0.07} />
      </div>
      <p className="sans text-xs mb-12" style={{ color: T.faint }}>nefesini aya uydur — parlarken al, sönerken ver</p>

      <p className="sans text-xs mb-5" style={{ color: T.dim, letterSpacing: ".12em" }}>KIYIDA</p>
      <div className="flex flex-col items-center gap-4 mb-10">
        {OKUMALAR.map((o, i) => (
          <Word key={i} tone={T.ink} size="text-base" className="serif" onClick={() => onRead(o)}>
            {o.t} <span className="sans text-xs" style={{ color: T.dim }}>· {o.src}</span>
          </Word>
        ))}
      </div>
      <div className="mx-auto mb-8" style={{ width: 40, borderTop: `1px solid ${T.line}` }} />
      <p className="serif text-sm mb-2" style={{ color: T.faint, fontStyle: "italic" }}>"hiç istemiyordum ama yaptım." <span className="sans text-xs" style={{ fontStyle: "normal", color: T.dim }}>· 23 gün önce</span></p>
      <p className="serif text-sm" style={{ color: T.faint }}>kar ülkesi bitti <span className="sans text-xs" style={{ color: T.dim }}>· 9 gün önce</span></p>
    </div>
  );
}

function Kimlik({ cfg, votes, stamped, onToday }) {
  const bekleyen = cfg.goals.filter((_, i) => i !== cfg.aktif);
  const başlangıç = "8 ocak"; // parametre: sözleşme tarihi
  return (
    <div className="w-full text-center px-2">
      <p className="serif text-2xl leading-relaxed mb-10" style={{ color: T.ink }}>sen {cfg.kimlik}<br />birisin.</p>

      {votes > 0 ? (
        <>
          {/* kanıt sayacı: süs yok, sayı konuşur */}
          <p className="serif" style={{ color: T.sun, fontSize: 76, lineHeight: 1 }}>{votes}</p>
          <p className="sans text-sm mb-3" style={{ color: T.faint }}>kanıt</p>
          <p className="sans text-xs mb-2" style={{ color: T.dim }}>{başlangıç}'tan beri, kendine {votes} kez kanıtladın</p>
          {stamped && <p className="appear sans text-xs" style={{ color: T.sun }}>son kanıt: bugün</p>}
        </>
      ) : (
        <>
          {/* boş hal: henüz kanıt yok — iddia var */}
          <p className="serif text-lg leading-relaxed mb-3" style={{ color: T.faint }}>şimdilik bu bir iddia.<br />birlikte kanıta çevireceğiz.</p>
          <p className="sans text-xs mb-8" style={{ color: T.dim }}>ilk kanıt için tek küçük söz yeter — bugün.</p>
          <Word onClick={onToday}>bugüne git</Word>
        </>
      )}

      {bekleyen.length > 0 && (
        <>
          <div className="mx-auto mt-12 mb-6" style={{ width: 40, borderTop: `1px solid ${T.line}` }} />
          <p className="sans text-xs mb-3" style={{ color: T.dim, letterSpacing: ".12em" }}>SIRADA</p>
          {bekleyen.map((g, i) => (
            <p key={i} className="serif text-sm mb-1.5" style={{ color: T.faint }}>
              {g.t}{i === 0 && <span className="sans text-xs" style={{ color: T.dim }}> · 4 gün kaldı</span>}
            </p>
          ))}
        </>
      )}
      <p className="sans text-xs mt-12" style={{ color: T.dim }}>sezon sonunda bu kanıtlardan hikayen yazılacak</p>
    </div>
  );
}

// ═══════ KABUK ═══════
export default function Bosluk() {
  const [cfg, setCfg] = useState(null);
  const [intro, setIntro] = useState(0);
  const [area, setArea] = useState("bugün");
  const [stamped, setStamped] = useState(false);
  const [viaFA, setViaFA] = useState(false);
  const [fa, setFa] = useState(false);
  const [faClosing, setFaClosing] = useState(false);
  const [veil, setVeil] = useState(null); // {tip:"zarf"|"okuma", data}
  const [veilClosing, setVeilClosing] = useState(false);
  const [envelope, setEnvelope] = useState(true);
  const votes = stamped ? 23 : 22;

  const closeFA = (did) => { setFaClosing(true); setTimeout(() => { setFa(false); setFaClosing(false); if (did) { setStamped(true); setViaFA(true); } }, 650); };
  const closeVeil = () => { setVeilClosing(true); setTimeout(() => { setVeil(null); setVeilClosing(false); }, 650); };

  const areas = ["bugün", "liman", "kimlik"];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#22383F" }}>
      <style>{css}</style>
      <div className="relative w-full flex flex-col rounded-3xl overflow-hidden"
        style={{ maxWidth: 390, height: "92vh", minHeight: 640, background: SKY, boxShadow: "0 30px 70px rgba(0,0,0,.4)" }}>

        {fa && <FirstAid cfg={cfg} closing={faClosing} onClose={() => closeFA(false)} onDid={() => closeFA(true)} />}
        {veil && (
          <Veil closing={veilClosing} onClose={closeVeil}>
            {veil.tip === "zarf" ? (
              <>
                <p className="appear serif text-2xl leading-relaxed" style={{ color: T.ink, maxWidth: 280 }}>{NOTLAR.zarf.txt}</p>
                <p className="appear-slow sans text-xs mt-6" style={{ color: T.sun }}>— {NOTLAR.zarf.src}</p>
              </>
            ) : (
              <>
                <p className="appear serif text-xl mb-4" style={{ color: T.sun }}>{veil.data.t}</p>
                <p className="appear serif text-base leading-loose" style={{ color: T.ink, maxWidth: 290 }}>{veil.data.txt}</p>
                <p className="appear-slow sans text-xs mt-6" style={{ color: T.dim }}>— {veil.data.src}</p>
              </>
            )}
          </Veil>
        )}

        {!cfg ? (
          intro < 2 ? <Intro step={intro} onNext={() => setIntro(i => i + 1)} onSkip={() => setIntro(2)} /> : <Onboarding onDone={(c) => setCfg(c)} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto flex items-start justify-center pt-16 pb-6 px-6">
              {area === "bugün" && <Today cfg={cfg} stamped={stamped} votes={votes}
                onStamp={(v = true) => { setStamped(v !== false); if (v !== false) setViaFA(false); }}
                onFirstAid={() => setFa(true)}
                envelope={envelope} onEnvelope={() => { setEnvelope(false); setVeil({ tip: "zarf" }); }}
                viaFirstAid={viaFA} />}
              {area === "liman" && <Liman onRead={(o) => setVeil({ tip: "okuma", data: o })} />}
              {area === "kimlik" && <Kimlik cfg={cfg} votes={votes} stamped={stamped} onToday={() => setArea("bugün")} />}
            </div>
            <div className="flex justify-center gap-8 pb-6 pt-2">
              {areas.map((a) => (
                <button key={a} onClick={() => setArea(a)} className="sans text-xs"
                  style={{ background: "none", border: "none", cursor: "pointer", letterSpacing: ".08em", color: area === a ? T.sun : T.dim, fontWeight: area === a ? 600 : 400, transition: "color .6s ease" }}>
                  {a}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
