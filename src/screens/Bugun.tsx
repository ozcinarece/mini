import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { Belir } from "../components/Belir";
import { Horizon } from "../components/Horizon";
import { Word } from "../components/Word";
import { altHedef, altHedefler, Kart } from "../data/katalog";
import * as depo from "../db/depo";
import { DUZENLEME_ONERI_ESIGI, kartCek } from "../engine/deste";
import { tr } from "../i18n/tr";
import { bosluk, font, renk } from "../theme";
import { IlkYardim } from "./IlkYardim";

// Bugün ekranı — günün tek işi. Metafor sadece büyük anda: damga → güneş doğar.
// Sayılar gerçektir (DB'den); sahte kohort/mock veri yok.
type Props = {
  kayit: depo.Kayit;
};

function Kutlama({ oySayisi }: { oySayisi: number }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontFamily: font.serif, fontSize: 18, color: renk.sun, marginBottom: 24 }}>
        +1{" "}
        <Text style={{ fontFamily: font.sans, fontSize: 14, color: renk.faint }}>
          · {tr.kutlama.oy(oySayisi)}
        </Text>
      </Text>
      <Belir gecikme={800} suresi={2000}>
        <Text
          style={{
            fontFamily: font.serif,
            fontSize: 14,
            lineHeight: 22,
            color: renk.faint,
            fontStyle: "italic",
            textAlign: "center",
            maxWidth: 260,
          }}
        >
          "{tr.kutlama.not.metin}"{" "}
          <Text style={{ fontFamily: font.sans, fontSize: 12, fontStyle: "normal", color: renk.dim }}>
            — {tr.kutlama.not.kaynak}
          </Text>
        </Text>
      </Belir>
    </View>
  );
}

export function Bugun({ kayit }: Props) {
  const { sozlesme, baslangicTarihi } = kayit;
  const hedef = sozlesme.hedefler[sozlesme.aktif];
  const pull = hedef?.arketip === "daginik";
  const kat = pull ? altHedef(hedef?.altHedefId ?? "") ?? altHedefler.F01 : null;

  const [damgali, setDamgali] = useState(() => (pull ? false : depo.bugunOyVar()));
  const [oylar, setOylar] = useState(() => depo.toplamOy());
  const [haftaKart, setHaftaKart] = useState(() => depo.buHaftaKartSayisi(baslangicTarihi));
  const [kart, setKart] = useState<Kart | null>(null);
  const [yenidenCekme, setYenidenCekme] = useState(0);
  const [ilkYardimAcik, setIlkYardimAcik] = useState(false);

  const damgala = (tur: depo.OyTuru, kartId: string | null = null) => {
    depo.oyEkle(tur, kartId);
    setOylar((n) => n + 1);
    setDamgali(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  const cek = () => {
    const yeni = kartCek(kat!.kartlar, depo.sonKartlar(3));
    setKart(yeni);
  };

  const gunAdi = tr.gunAdlari[new Date().getDay()];
  const baslikSatiri = `${tr.bugun.hafta(depo.haftaNo(baslangicTarihi))} · ${gunAdi}${hedef ? ` · ${hedef.metin}` : ""}`;

  return (
    <View style={{ flex: 1 }}>
      {ilkYardimAcik && (
        <IlkYardim onKapat={() => setIlkYardimAcik(false)} onDenedi={() => setIlkYardimAcik(false)} />
      )}

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: bosluk.sayfaYatay,
        }}
      >
        <View style={{ width: "100%", maxWidth: 320, alignItems: "center" }}>
          <Text style={{ fontFamily: font.sans, fontSize: 12, color: renk.dim, marginBottom: 4 }}>
            {baslikSatiri}
          </Text>

          {/* 🌱🕰️🐌 çapa ailesi (✂️🤏🌊 özel ekranları sonraki fazda; şimdilik aynı damga akışı) */}
          {!pull && (
            <>
              <Text style={{ fontFamily: font.serif, fontSize: 24, color: renk.ink, textAlign: "center" }}>
                {damgali ? tr.bugun.bugunlukBuKadar : tr.bugun.tekIsinVar}
              </Text>
              <Horizon dogmus={damgali} />
              {!damgali ? (
                <>
                  <Text style={{ fontFamily: font.sans, fontSize: 12, color: renk.dim, marginBottom: 24 }}>
                    {tr.bugun.gunesDogar}
                  </Text>
                  <Text
                    style={{
                      fontFamily: font.serif,
                      fontSize: 20,
                      lineHeight: 32,
                      color: renk.ink,
                      textAlign: "center",
                      marginBottom: 32,
                    }}
                  >
                    {sozlesme.capa},{"\n"}
                    <Text style={{ color: renk.sun }}>{sozlesme.mikro}?</Text>
                  </Text>
                  <Word boyut={18} onPress={() => damgala("damga")}>{tr.bugun.yaptim}</Word>
                  <View style={{ marginTop: 20 }}>
                    <Word ton={renk.dim} boyut={12} onPress={() => setIlkYardimAcik(true)}>
                      {tr.bugun.canimIstemiyor}
                    </Word>
                  </View>
                </>
              ) : (
                <Kutlama oySayisi={oylar} />
              )}
            </>
          )}

          {/* 🧺 dağınık bakım: kartı sistem seçer, hedef hafta bazlı */}
          {pull && kat && (
            <>
              <Text style={{ fontFamily: font.serif, fontSize: 24, color: renk.ink, textAlign: "center" }}>
                {damgali ? tr.bugun.birKartDahaGitti : tr.bugun.desteHazir}
              </Text>
              <Horizon dogmus={damgali} />
              {!damgali && (
                <Text style={{ fontFamily: font.sans, fontSize: 12, color: renk.dim, marginBottom: 24 }}>
                  {tr.bugun.haftaSayaci(haftaKart, kat.hafta_hedefi)}
                </Text>
              )}

              {!kart && !damgali && (
                <>
                  <Word boyut={18} onPress={() => { cek(); setYenidenCekme(0); }}>
                    {tr.bugun.ikiDakikamVar}
                  </Word>
                  <View style={{ marginTop: 20 }}>
                    <Word ton={renk.dim} boyut={12} onPress={() => setIlkYardimAcik(true)}>
                      {tr.bugun.evBeniYendi}
                    </Word>
                  </View>
                </>
              )}

              {kart && !damgali && (
                <Belir key={kart.id} stil={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontFamily: font.serif,
                      fontSize: 20,
                      lineHeight: 30,
                      color: renk.sun,
                      textAlign: "center",
                      maxWidth: 260,
                      marginBottom: 8,
                    }}
                  >
                    {kart.metin.toLocaleLowerCase("tr")}
                  </Text>
                  <Text style={{ fontFamily: font.sans, fontSize: 12, color: renk.dim, marginBottom: 32 }}>
                    {kart.zorluk === 3 ? tr.bugun.cesaretKarti : ""}
                    {tr.bugun.ikiDakika}
                  </Text>
                  <Word
                    boyut={18}
                    onPress={() => {
                      depo.kartGecmisineEkle(kart.id);
                      setHaftaKart((n) => n + 1);
                      damgala("kart", kart.id);
                      setKart(null);
                    }}
                  >
                    {tr.bugun.yaptim}
                  </Word>
                  <View style={{ marginTop: 16 }}>
                    <Word
                      ton={renk.dim}
                      boyut={12}
                      onPress={() => {
                        depo.kartGecmisineEkle(kart.id);
                        cek();
                        setYenidenCekme((n) => n + 1);
                      }}
                    >
                      {tr.bugun.baskaKart}
                    </Word>
                  </View>
                  {yenidenCekme >= DUZENLEME_ONERI_ESIGI && (
                    <Belir stil={{ marginTop: 16 }}>
                      <Text
                        style={{
                          fontFamily: font.sans,
                          fontSize: 12,
                          lineHeight: 18,
                          color: renk.faint,
                          textAlign: "center",
                          maxWidth: 240,
                        }}
                      >
                        {tr.bugun.desteDuzenlemeOnerisi}
                      </Text>
                    </Belir>
                  )}
                </Belir>
              )}

              {damgali && (
                <>
                  <Kutlama oySayisi={oylar} />
                  <View style={{ marginTop: 24 }}>
                    <Word
                      ton={renk.faint}
                      boyut={14}
                      onPress={() => {
                        setDamgali(false);
                        setKart(null);
                      }}
                    >
                      {tr.bugun.ikiDakikamDahaVar}
                    </Word>
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
}
