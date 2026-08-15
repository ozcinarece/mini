import React, { useState } from "react";

// ═══════════════ BOŞLUK · v0.28 — "paketler" pivotu ═══════════════
// Kontrol tamamen kullanıcıda: paket seç, komutları düzenle, günleri ve adedi sen belirle.
// Günlük toplam tavan: 5 bildirim. "yaptım" → kanıt birikir, güneş doğar.

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
@keyframes riseNote { from { opacity: 0; } to { opacity: 1; } }
.rise-note { animation: riseNote 2s .8s ease both; }
@keyframes sunIdle { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2.5px); } }
.sun-idle { animation: sunIdle 6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .appear,.rise-note,.sun-idle { animation: none; } }
`;

// ═══════ PAKETLER (katalogdan damıtıldı) ═══════
const PAKETLER = {
  ev: { ad: "ev düzeni", komutlar: [
    "gözüne ilişen beş şeyi yerine koy", "bir yüzeyi tamamen boşalt", "ortalıktaki çöpleri topla",
    "bir çekmeceyi düzenle — sadece bir", "su şişesi turu: hepsi mutfağa", "evine dönmemiş bir eşyayı odasına götür",
  ]},
  kitap: { ad: "kitap okuma", komutlar: [
    "bir paragraf yeter — kapıyı arala", "kitabı eline al, gerisi kendi gelir", "iki sayfa: söz bu kadar",
    "scroll yerine üç cümle?", "yatmadan bir sayfa",
  ]},
  su: { ad: "su & hareket", komutlar: [
    "bir bardak su", "ayağa kalk, omuzlarını çevir", "otuz saniye esne", "pencereyi aç, üç derin nefes",
  ]},
  ekran: { ad: "ekran molası", komutlar: [
    "telefonu bırak, gözlerini uzağa dinlendir", "ekransız beş dakika", "bildirimleri bir saat sustur",
  ]},
  minik: { ad: "minik işler", komutlar: [
    "o randevuyu şimdi al", "kargo kodunu al, çantana koy", "ertelediğin işi takvime tarih vererek yaz",
    "o parayı gönder ya da iste", "iade işlemini başlat",
  ]},
  kendi: { ad: "kendi paketim", komutlar: [] },
};
const GUNLER = ["pzt", "sal", "çar", "per", "cum", "cmt", "paz"];
const GUNLUK_TAVAN = 5;
const PENCERELER = ["sabah · 08–12", "gün boyu · 09–21", "akşam · 18–23"];

// ═══════ TEMEL PARÇALAR ═══════
function Horizon({ up = false, idle = false, size = 26 }) {
  return (
    <div className="relative mx-auto my-8" style={{ height: size + 18, overflow: "hidden", maxWidth: 240 }}>
      <div className={"absolute rounded-full" + (idle && !up ? " sun-idle" : "")} style={{
        left: "50%", marginLeft: -size / 2, width: size, height: size,
        top: up ? 4 : size + 4, background: T.sun,
        transition: "top 1.8s cubic-bezier(.25,.8,.3,1), box-shadow 1.8s ease",
        boxShadow: up ? "0 0 30px rgba(238,187,141,.45)" : "none",
      }} />
      <div className="absolute left-0 right-0" style={{ bottom: 0, borderTop: `1px solid ${T.line}` }} />
    </div>
  );
}
function Choice({ items, onPick, delay = 700 }) {
  const [sel, setSel] = useState(null);
  const pick = (i) => { if (sel !== null) return; setSel(i); setTimeout(() => onPick(items[i]), delay); };
  return (
    <div className="flex flex-col items-center gap-5 my-2">
      {items.map((it, i) => (
        <button key={it} onClick={() => pick(i)} className="serif text-lg"
          style={{ background: "none", border: "none", cursor: "pointer", color: sel === i ? T.sun : T.ink,
            opacity: sel === null ? 1 : sel === i ? 1 : 0.12, transition: "opacity .9s ease, color .9s ease" }}>
          {it}
        </button>
      ))}
    </div>
  );
}
const Word = ({ children, onClick, tone = T.sun, size = "text-base", u = false }) => (
  <button onClick={onClick} className={`sans ${size}`}
    style={{ background: "none", border: "none", cursor: "pointer", color: tone, letterSpacing: ".04em", fontWeight: 500,
      borderBottom: u ? `1px solid ${tone}` : "none", paddingBottom: u ? 3 : 0 }}>
    {children}
  </button>
);
const Ring = ({ on }) => (
  <span className="rounded-full flex-shrink-0" style={{ width: 14, height: 14, background: on ? T.sun : "transparent",
    border: `1.5px solid ${on ? T.sun : T.faint}`, transition: "background .4s ease, border-color .4s ease" }} />
);

// ═══════ KURULUM (yeni abonelik sihirbazı) ═══════
function Kurulum({ mevcutToplam, onDone, onCancel }) {
  const [step, setStep] = useState("paket");
  const [ab, setAb] = useState({ paketId: null, ad: "", komutlar: [], gunler: [], adet: null, pencere: null, pencereGun: null });
  const [draft, setDraft] = useState("");
  const kalan = GUNLUK_TAVAN - mevcutToplam;

  const pages = {
    paket: (
      <div className="appear text-center w-full">
        <p className="serif text-2xl mb-10" style={{ color: T.ink }}>ne hatırlatayım?</p>
        <Choice items={Object.values(PAKETLER).map(p => p.ad)} onPick={(ad) => {
          const id = Object.keys(PAKETLER).find(k => PAKETLER[k].ad === ad);
          setAb(a => ({ ...a, paketId: id, ad, komutlar: [...PAKETLER[id].komutlar] }));
          setStep("komutlar");
        }} />
        {onCancel && <div className="mt-10"><Word tone={T.dim} size="text-xs" onClick={onCancel}>vazgeç</Word></div>}
      </div>
    ),

    komutlar: (
      <div className="appear text-center w-full" style={{ maxWidth: 300, margin: "0 auto" }}>
        <p className="serif text-2xl mb-2" style={{ color: T.ink }}>{ab.ad}</p>
        <p className="sans text-xs mb-7" style={{ color: T.dim }}>
          {ab.komutlar.length > 0 ? "bildirimler bu komutlardan gelir — dokunup çıkarabilirsin" : "kendi komutlarını yaz"}
        </p>
        <div className="flex flex-col items-center gap-3 mb-6">
          {ab.komutlar.map((k, i) => (
            <button key={i} onClick={() => setAb(a => ({ ...a, komutlar: a.komutlar.filter((_, j) => j !== i) }))}
              className="serif text-base" title="çıkar"
              style={{ background: "none", border: "none", cursor: "pointer", color: T.ink }}>
              {k} <span className="sans text-xs" style={{ color: T.dim }}>×</span>
            </button>
          ))}
        </div>
        <input value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && draft.trim()) { setAb(a => ({ ...a, komutlar: [...a.komutlar, draft.trim().toLowerCase()] })); setDraft(""); } }}
          placeholder="+ kendi komutunu yaz, enter'la ekle"
          className="sans w-full text-center text-sm py-2 mb-8"
          style={{ background: "transparent", border: "none", borderBottom: `1px solid ${T.line}`, color: T.ink, outline: "none" }} />
        {ab.komutlar.length > 0 && <Word u onClick={() => setStep("gunler")}>devam</Word>}
        <div className="mt-5"><Word tone={T.dim} size="text-xs" onClick={() => setStep("paket")}>geri</Word></div>
      </div>
    ),

    gunler: (
      <div className="appear text-center w-full">
        <p className="serif text-2xl mb-2" style={{ color: T.ink }}>hangi günler?</p>
        <p className="sans text-xs mb-8" style={{ color: T.dim }}>istediğin kadar işaretle</p>
        <div className="flex justify-center gap-2.5 mb-7">
          {GUNLER.map((g) => {
            const on = ab.gunler.includes(g);
            return (
              <button key={g} onClick={() => setAb(a => ({ ...a, gunler: on ? a.gunler.filter(x => x !== g) : [...a.gunler, g] }))}
                className="sans text-xs flex flex-col items-center gap-2"
                style={{ background: "none", border: "none", cursor: "pointer", color: on ? T.sun : T.faint }}>
                <Ring on={on} />{g}
              </button>
            );
          })}
        </div>
        <Word tone={T.faint} size="text-xs" onClick={() => setAb(a => ({ ...a, gunler: [...GUNLER] }))}>her gün</Word>
        <div className="mt-9">{ab.gunler.length > 0 && <Word u onClick={() => setStep("adet")}>devam</Word>}</div>
        <div className="mt-5"><Word tone={T.dim} size="text-xs" onClick={() => setStep("komutlar")}>geri</Word></div>
      </div>
    ),

    adet: (
      <div className="appear text-center w-full">
        <p className="serif text-2xl mb-2" style={{ color: T.ink }}>günde kaç kez?</p>
        <p className="sans text-xs mb-8" style={{ color: T.dim }}>
          günlük toplam tavan {GUNLUK_TAVAN} — fazla ses, sesi görünmez yapar
          {mevcutToplam > 0 && ` · diğer paketlerin ${mevcutToplam} hakkı kullanıyor`}
        </p>
        {kalan <= 0 ? (
          <>
            <p className="sans text-sm mb-8" style={{ color: T.faint }}>bugünlük ses hakkın dolu — önce bir paketi sessize al.</p>
            <Word tone={T.dim} size="text-xs" onClick={onCancel}>tamam</Word>
          </>
        ) : (
          <Choice items={Array.from({ length: kalan }).map((_, i) => `günde ${["bir", "iki", "üç", "dört", "beş"][i]} kez`)}
            onPick={(t) => { setAb(a => ({ ...a, adet: ["bir", "iki", "üç", "dört", "beş"].findIndex(x => t.includes(x)) + 1 })); setStep("pencere"); }} />
        )}
        <div className="mt-8"><Word tone={T.dim} size="text-xs" onClick={() => setStep("gunler")}>geri</Word></div>
      </div>
    ),

    pencere: (
      <div className="appear text-center w-full">
        <p className="serif text-2xl mb-10" style={{ color: T.ink }}>günün hangi aralığına?</p>
        <Choice items={PENCERELER}
          onPick={(t) => { setAb(a => ({ ...a, pencere: t, pencereGun: null })); setStep("ozet"); }} />
        <div className="mt-9">
          <Word tone={T.faint} size="text-xs" onClick={() => {
            setAb(a => ({ ...a, pencere: "gün bazlı", pencereGun: Object.fromEntries(a.gunler.map(g => [g, PENCERELER[1]])) }));
            setStep("pencereGun");
          }}>gün bazlı ayarlamak istiyorum</Word>
        </div>
        <div className="mt-5"><Word tone={T.dim} size="text-xs" onClick={() => setStep("adet")}>geri</Word></div>
      </div>
    ),

    pencereGun: (
      <div className="appear text-center w-full">
        <p className="serif text-2xl mb-2" style={{ color: T.ink }}>gün gün:</p>
        <p className="sans text-xs mb-8" style={{ color: T.dim }}>aralığa dokun, değişsin</p>
        <div className="flex flex-col items-center gap-4 mb-10">
          {ab.gunler.map((g) => (
            <button key={g} onClick={() => setAb(a => {
              const cur = PENCERELER.indexOf(a.pencereGun[g]);
              return { ...a, pencereGun: { ...a.pencereGun, [g]: PENCERELER[(cur + 1) % PENCERELER.length] } };
            })} className="flex items-baseline gap-4" style={{ background: "none", border: "none", cursor: "pointer" }}>
              <span className="serif text-lg" style={{ color: T.ink, width: 42, textAlign: "right" }}>{g}</span>
              <span className="sans text-sm" style={{ color: T.sun, borderBottom: `1px dashed ${T.line}`, paddingBottom: 2 }}>{ab.pencereGun?.[g]}</span>
            </button>
          ))}
        </div>
        <Word u onClick={() => setStep("ozet")}>tamam</Word>
        <div className="mt-5"><Word tone={T.dim} size="text-xs" onClick={() => setStep("pencere")}>geri</Word></div>
      </div>
    ),

    ozet: (
      <div className="appear text-center w-full" style={{ maxWidth: 290, margin: "0 auto" }}>
        <Horizon idle />
        <p className="serif text-xl leading-relaxed mb-2" style={{ color: T.ink }}>
          <span style={{ color: T.sun }}>{ab.ad}</span> · {ab.gunler.length === 7 ? "her gün" : ab.gunler.join(" ")}
        </p>
        <p className="sans text-sm mb-8" style={{ color: T.faint }}>
          günde {ab.adet} kez, {ab.pencereGun ? "saatleri gün gün senin ayarınla" : `${ab.pencere} arasında`} — {ab.komutlar.length} komuttan sırayla.
        </p>
        <p className="sans text-xs mb-10" style={{ color: T.dim }}>her "yaptım" bir kanıt: güneş doğar, sayaç büyür.</p>
        <Word u onClick={() => onDone(ab)}>başlasın</Word>
        <div className="mt-5"><Word tone={T.dim} size="text-xs" onClick={() => setStep("pencere")}>geri</Word></div>
      </div>
    ),
  };
  return pages[step];
}

// ═══════ BUGÜN ═══════
function Today({ abonelikler, votes, doneToday, onDid }) {
  // saat yok, sıra yok, plan yok — istersen sen çağırırsın, ara ara ben seslenirim
  const havuz = abonelikler.filter(a => a.aktif).flatMap(a => a.komutlar.map(k => ({ komut: k, paket: a.ad })));
  const [card, setCard] = useState(null);
  const [son, setSon] = useState([]);
  const [msg, setMsg] = useState(null);
  const cek = () => {
    let pool = havuz.filter(h => !son.slice(-3).includes(h.komut));
    if (!pool.length) pool = havuz;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  return (
    <div className="w-full text-center px-2">
      <p className="sans text-xs mb-1" style={{ color: T.dim }}>
        çarşamba{doneToday > 0 ? ` · bugün ${doneToday} · toplam ${votes} kanıt` : ""}
      </p>
      <p className="serif text-2xl" style={{ color: T.ink }}>
        {card ? "küçük bir şey:" : doneToday > 0 ? "güzel gidiyor." : "hazır olduğunda."}
      </p>
      <Horizon up={doneToday > 0} idle={doneToday === 0 && !card} />

      {!card ? (
        <>
          {msg === "sonra" && <p className="appear sans text-sm mb-6" style={{ color: T.faint }}>sorun yok — birazdan usulca yine sorarım.</p>}
          {msg === "done" && <p className="rise-note serif text-sm mb-6" style={{ color: T.faint, fontStyle: "italic" }}>"her tekrar, o kişiye atılmış bir oydur." <span className="sans text-xs" style={{ fontStyle: "normal", color: T.dim }}>— Clear</span></p>}
          <Word u size="text-lg" onClick={() => { setCard(cek()); setMsg(null); }}>iki dakikam var</Word>
          <p className="sans text-xs mt-10" style={{ color: T.dim }}>ara ara ben de seslenirim —<br />saatlerini dert etme, o benim işim.</p>
        </>
      ) : (
        <div className="appear">
          <p className="sans text-xs mb-2" style={{ color: T.dim }}>{card.paket}</p>
          <p className="serif text-xl leading-relaxed mb-8" style={{ color: T.sun, maxWidth: 260, margin: "0 auto" }}>{card.komut}</p>
          <Word u size="text-lg" onClick={() => { setSon(x => [...x, card.komut]); setCard(null); setMsg("done"); onDid(); }}>yaptım</Word>
          <div className="mt-5">
            <Word tone={T.dim} size="text-xs" onClick={() => { setSon(x => [...x, card.komut]); setCard(null); setMsg("sonra"); }}>şimdi olmadı</Word>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════ PAKETLERİM ═══════
function Paketlerim({ abonelikler, setAbonelikler, onYeni, toplam }) {
  return (
    <div className="w-full text-center px-2">
      <p className="serif text-2xl mb-1" style={{ color: T.ink }}>paketlerim</p>
      <p className="sans text-xs mb-10" style={{ color: T.dim }}>günlük ses: {toplam}/{GUNLUK_TAVAN}</p>
      <div className="flex flex-col items-center gap-7 mb-12">
        {abonelikler.map((a, i) => (
          <div key={i} style={{ opacity: a.aktif ? 1 : 0.45, transition: "opacity .6s ease" }}>
            <p className="serif text-lg mb-1" style={{ color: T.ink }}>{a.ad}</p>
            <p className="sans text-xs mb-2" style={{ color: T.dim }}>
              {a.gunler.length === 7 ? "her gün" : a.gunler.join(" ")} · günde {a.adet} · {a.pencereGun ? "saatler gün bazlı" : a.pencere}
            </p>
            <Word tone={T.faint} size="text-xs" onClick={() => setAbonelikler(abs => abs.map((x, j) => j === i ? { ...x, aktif: !x.aktif } : x))}>
              {a.aktif ? "sessize al" : "sesi aç"}
            </Word>
          </div>
        ))}
      </div>
      <Word u onClick={onYeni}>+ yeni paket</Word>
    </div>
  );
}


// ═══════ GEÇMİŞ ═══════
// veri ekranı kuralı: süs yok, sayı konuşur. suçluluk sözlüğü yok — boş gün kırmızı değil, sadece boş.
function Gecmis({ gunler, bugun }) {
  const hepsi = [...gunler, bugun];
  const toplam = hepsi.reduce((a, b) => a + b, 0);
  const doluGun = hepsi.filter(x => x > 0).length;
  return (
    <div className="w-full text-center px-2">
      <p className="serif text-2xl mb-1" style={{ color: T.ink }}>geçmiş</p>
      <p className="sans text-xs mb-12" style={{ color: T.dim }}>son {hepsi.length} gün · {toplam} kanıt</p>

      {/* gün sütunları: her nokta bir "yaptım" (tavan 5) */}
      <div className="mx-auto mb-2" style={{ maxWidth: 300 }}>
        <div className="flex items-end justify-between" style={{ height: 52 }}>
          {hepsi.map((n, i) => {
            const bugunMu = i === hepsi.length - 1;
            return (
              <div key={i} className="flex flex-col-reverse items-center gap-1">
                {n === 0 && bugunMu && (
                  <span className="rounded-full" style={{ width: 7, height: 7, border: `1px solid ${T.faint}` }} />
                )}
                {Array.from({ length: n }).map((_, j) => (
                  <span key={j} className="rounded-full" style={{
                    width: 7, height: 7, background: T.sun,
                    opacity: bugunMu ? 1 : 0.55,
                    boxShadow: bugunMu ? "0 0 8px rgba(238,187,141,.5)" : "none",
                  }} />
                ))}
              </div>
            );
          })}
        </div>
        <div style={{ borderTop: `1px solid ${T.line}`, marginTop: 8 }} />
        <div className="flex justify-between mt-2">
          <span className="sans text-xs" style={{ color: T.dim }}>iki hafta önce</span>
          <span className="sans text-xs" style={{ color: T.sun }}>bugün</span>
        </div>
      </div>

      <p className="sans text-sm mt-10" style={{ color: T.faint }}>
        {hepsi.length} günün {doluGun}'ünde en az bir kanıt bıraktın.
      </p>
      <p className="sans text-xs mt-2" style={{ color: T.dim }}>boş günler kayıp değil — sadece sessiz.</p>
    </div>
  );
}

// ═══════ KİMLİK ═══════
function Kimlik({ votes, onToday }) {
  return (
    <div className="w-full text-center px-2">
      <p className="serif text-2xl leading-relaxed mb-10" style={{ color: T.ink }}>sen sözünü tutan<br />birisin.</p>
      {votes > 0 ? (
        <>
          <p className="serif" style={{ color: T.sun, fontSize: 76, lineHeight: 1 }}>{votes}</p>
          <p className="sans text-sm mb-3" style={{ color: T.faint }}>kanıt</p>
          <p className="sans text-xs" style={{ color: T.dim }}>her "yaptım" buraya bir güneş bıraktı</p>
        </>
      ) : (
        <>
          <p className="serif text-lg leading-relaxed mb-3" style={{ color: T.faint }}>şimdilik bu bir iddia.<br />birlikte kanıta çevireceğiz.</p>
          <p className="sans text-xs mb-8" style={{ color: T.dim }}>ilk kanıt için tek "yaptım" yeter.</p>
          <Word onClick={onToday}>bugüne git</Word>
        </>
      )}
    </div>
  );
}

// ═══════ KABUK ═══════
export default function Bosluk() {
  const [introStep, setIntroStep] = useState(0);
  const [abonelikler, setAbonelikler] = useState([]);
  const [kurulum, setKurulum] = useState(false);
  const [area, setArea] = useState("bugün");
  const GECMIS_DEMO = [2, 3, 1, 0, 4, 2, 3, 5, 2, 0, 3, 2, 4]; // son 13 gün
  const [votes, setVotes] = useState(GECMIS_DEMO.reduce((a, b) => a + b, 0));
  const [doneToday, setDoneToday] = useState(0);
  const toplam = abonelikler.filter(a => a.aktif).reduce((s, a) => s + a.adet, 0);
  const hazir = abonelikler.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#22383F" }}>
      <style>{css}</style>
      <div className="relative w-full flex flex-col rounded-3xl overflow-hidden"
        style={{ maxWidth: 390, height: "92vh", minHeight: 640, background: SKY, boxShadow: "0 30px 70px rgba(0,0,0,.4)" }}>

        {!hazir || kurulum ? (
          /* karşılama + kurulum */
          <div className="flex-1 overflow-y-auto px-8 flex">
            <div className="w-full flex justify-center py-10" style={{ margin: "auto" }}>
              {!hazir && introStep < 2 ? (
                <div onClick={() => setIntroStep(i => i + 1)} className="appear text-center" style={{ maxWidth: 290, cursor: "pointer" }} key={introStep}>
                  {introStep === 0 ? (
                    <>
                      <Horizon idle size={30} />
                      <p className="serif text-xl leading-loose" style={{ color: T.ink }}>
                        gün ne kadar dolu olursa olsun,<br />içinde küçük bir söz için yer vardır.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="serif text-xl leading-loose mb-5" style={{ color: T.ink }}>burada kontrol sende.</p>
                      <p className="sans text-sm leading-relaxed" style={{ color: T.faint }}>
                        neyi, ne zaman hatırlatacağımı sen seçersin.<br />
                        ben usulca seslenirim — asla yormam.<br />
                        her "yaptım" bir kanıt, her kanıtta güneş doğar.
                      </p>
                    </>
                  )}
                  <p className="sans text-xs mt-14" style={{ color: T.dim, letterSpacing: ".08em" }}>dokun</p>
                </div>
              ) : (
                <Kurulum mevcutToplam={toplam}
                  onCancel={hazir ? () => setKurulum(false) : null}
                  onDone={(ab) => { setAbonelikler(abs => [...abs, { ...ab, aktif: true }]); setKurulum(false); setArea("bugün"); }} />
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto flex items-start justify-center pt-16 pb-6 px-6">
              {area === "bugün" && <Today abonelikler={abonelikler} votes={votes} doneToday={doneToday}
                onDid={() => { setVotes(v => v + 1); setDoneToday(d => d + 1); }} />}
              {area === "geçmiş" && <Gecmis gunler={GECMIS_DEMO} bugun={doneToday} />}
              {area === "paketler" && <Paketlerim abonelikler={abonelikler} setAbonelikler={setAbonelikler} toplam={toplam} onYeni={() => setKurulum(true)} />}
              {area === "kimlik" && <Kimlik votes={votes} onToday={() => setArea("bugün")} />}
            </div>
            <div className="flex justify-center gap-8 pb-6 pt-2">
              {["bugün", "geçmiş", "paketler", "kimlik"].map((a) => (
                <button key={a} onClick={() => setArea(a)} className="sans text-xs"
                  style={{ background: "none", border: "none", cursor: "pointer", letterSpacing: ".08em",
                    color: area === a ? T.sun : T.dim, fontWeight: area === a ? 600 : 400, transition: "color .6s ease" }}>
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
