import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { Belir } from "../components/Belir";
import { Horizon } from "../components/Horizon";
import { Word } from "../components/Word";
import * as depo from "../db/depo";
import { tr } from "../i18n/tr";
import { font, renk } from "../theme";

// Bugün — çek-esaslı: saat yok, sıra yok, plan yok (tarife asla gösterilmez).
// "yaptım" = +1 kanıt, güneş doğar. "şimdi olmadı" = sıfır suçluluk.
type Cekilen = { komut: string; paket: string };

type Props = {
  abonelikler: depo.Abonelik[];
  toplamKanit: number;
  bugunKanit: number;
  onKanit: (komut: string, paketAd: string) => void;
};

export function Bugun({ abonelikler, toplamKanit, bugunKanit, onKanit }: Props) {
  const [cekilen, setCekilen] = useState<Cekilen | null>(null);
  const [mesaj, setMesaj] = useState<"sonra" | "kanit" | null>(null);

  const havuz: Cekilen[] = abonelikler
    .filter((a) => a.aktif)
    .flatMap((a) => a.komutlar.map((k) => ({ komut: k, paket: a.ad })));

  const cek = (): Cekilen | null => {
    if (havuz.length === 0) return null;
    const son = depo.sonKomutlar(3);
    let uygun = havuz.filter((h) => !son.includes(h.komut));
    if (uygun.length === 0) uygun = havuz;
    return uygun[Math.floor(Math.random() * uygun.length)];
  };

  const birak = () => {
    if (cekilen) depo.sonKomutEkle(cekilen.komut);
    setCekilen(null);
  };

  return (
    <View style={{ width: "100%", maxWidth: 320, alignItems: "center", alignSelf: "center" }}>
      <Text style={{ fontFamily: font.sans, fontSize: 12, color: renk.dim, marginBottom: 4 }}>
        {tr.gunAdlari[depo.bugunGunIdx()]}
        {bugunKanit > 0 ? tr.bugun.bugunSayaci(bugunKanit, toplamKanit) : ""}
      </Text>
      <Text style={{ fontFamily: font.serif, fontSize: 24, color: renk.ink, textAlign: "center" }}>
        {cekilen ? tr.bugun.kucukBirSey : bugunKanit > 0 ? tr.bugun.guzelGidiyor : tr.bugun.hazirOldugunda}
      </Text>
      <Horizon dogmus={bugunKanit > 0} salinim={bugunKanit === 0 && !cekilen} />

      {!cekilen ? (
        <>
          {mesaj === "sonra" && (
            <Belir stil={{ marginBottom: 24 }}>
              <Text style={{ fontFamily: font.sans, fontSize: 14, color: renk.faint, textAlign: "center" }}>
                {tr.bugun.sonraMesaji}
              </Text>
            </Belir>
          )}
          {mesaj === "kanit" && (
            <Belir gecikme={800} suresi={2000} stil={{ marginBottom: 24 }}>
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
                "{tr.bugun.not.metin}"{" "}
                <Text style={{ fontFamily: font.sans, fontSize: 12, fontStyle: "normal", color: renk.dim }}>
                  — {tr.bugun.not.kaynak}
                </Text>
              </Text>
            </Belir>
          )}
          <Word
            altCizgi
            boyut={18}
            onPress={() => {
              const yeni = cek();
              if (yeni) {
                setCekilen(yeni);
                setMesaj(null);
              }
            }}
          >
            {tr.bugun.ikiDakikamVar}
          </Word>
          <Text
            style={{
              fontFamily: font.sans,
              fontSize: 12,
              lineHeight: 18,
              color: renk.dim,
              textAlign: "center",
              marginTop: 40,
            }}
          >
            {tr.bugun.sesSatiri}
          </Text>
        </>
      ) : (
        <Belir key={cekilen.komut} stil={{ alignItems: "center" }}>
          <Text style={{ fontFamily: font.sans, fontSize: 12, color: renk.dim, marginBottom: 8 }}>
            {cekilen.paket}
          </Text>
          <Text
            style={{
              fontFamily: font.serif,
              fontSize: 20,
              lineHeight: 30,
              color: renk.sun,
              textAlign: "center",
              maxWidth: 260,
              marginBottom: 32,
            }}
          >
            {cekilen.komut}
          </Text>
          <Word
            altCizgi
            boyut={18}
            onPress={() => {
              onKanit(cekilen.komut, cekilen.paket);
              birak();
              setMesaj("kanit");
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
            }}
          >
            {tr.bugun.yaptim}
          </Word>
          <View style={{ marginTop: 20 }}>
            <Word
              ton={renk.dim}
              boyut={12}
              onPress={() => {
                birak();
                setMesaj("sonra");
              }}
            >
              {tr.bugun.simdiOlmadi}
            </Word>
          </View>
        </Belir>
      )}
    </View>
  );
}
