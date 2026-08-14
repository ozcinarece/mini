import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { Belir } from "../components/Belir";
import { Choice } from "../components/Choice";
import { Horizon } from "../components/Horizon";
import { Word } from "../components/Word";
import { useAzaltilmisHareket } from "../hooks/useAzaltilmisHareket";
import { tr } from "../i18n/tr";
import { font, renk, sure } from "../theme";

// İlk Yardım merdiveni: kabul → küçültme reçetesi / nefes → izin.
// Suçluluk sözlüğü yok; "izin" ekranı bile suçsuz. (kasa + ses adımları Liman'la gelecek)
type Adim = "kabul" | "nefes" | "yorgun" | "sikildim" | "istemiyorum" | "izin";

type Props = {
  onKapat: () => void;
  onDenedi: () => void;
};

// nefes alan ay: 11 sn'lik döngüde büyür ve parlar
function NefesAyi() {
  const azaltilmis = useAzaltilmisHareket();
  const olcek = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (azaltilmis) return;
    const dongu = Animated.loop(
      Animated.sequence([
        Animated.timing(olcek, { toValue: 1.3, duration: sure.nefes / 2, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(olcek, { toValue: 1, duration: sure.nefes / 2, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    dongu.start();
    return () => dongu.stop();
  }, [azaltilmis, olcek]);
  return (
    <Animated.View
      style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: renk.moonBright,
        alignSelf: "center",
        marginBottom: 40,
        transform: [{ scale: olcek }],
      }}
    />
  );
}

export function IlkYardim({ onKapat, onDenedi }: Props) {
  const [adim, setAdim] = useState<Adim>("kabul");
  const recete = adim === "yorgun" || adim === "sikildim" || adim === "istemiyorum"
    ? tr.ilkYardim.receteler[adim]
    : null;

  return (
    <LinearGradient
      colors={[...renk.gokyuzu]}
      locations={[...renk.gokyuzuDuraklar]}
      style={[StyleSheet.absoluteFillObject, { zIndex: 10 }]}
    >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 }}>
        {adim === "kabul" && (
          <Belir stil={{ alignItems: "center" }}>
            <Text style={{ fontFamily: font.serif, fontSize: 24, color: renk.ink, textAlign: "center", marginBottom: 8 }}>
              {tr.ilkYardim.iyiKiSoyledin}
            </Text>
            <Text style={{ fontFamily: font.sans, fontSize: 14, color: renk.faint, textAlign: "center", marginBottom: 32 }}>
              {tr.ilkYardim.nasilIstememe}
            </Text>
            <Choice
              bekleme={600}
              secenekler={tr.ilkYardim.secenekler}
              onSec={(s) => {
                const i = tr.ilkYardim.secenekler.indexOf(s as (typeof tr.ilkYardim.secenekler)[number]);
                setAdim(i === 0 ? "yorgun" : i === 1 ? "sikildim" : i === 2 ? "nefes" : "istemiyorum");
              }}
            />
            <View style={{ marginTop: 32 }}>
              <Word ton={renk.dim} boyut={12} onPress={onKapat}>{tr.ilkYardim.vazgectim}</Word>
            </View>
          </Belir>
        )}

        {adim === "nefes" && (
          <Belir stil={{ alignItems: "center" }}>
            <NefesAyi />
            <Text style={{ fontFamily: font.sans, fontSize: 14, lineHeight: 24, color: renk.faint, textAlign: "center", marginBottom: 40 }}>
              {tr.ilkYardim.nefesYonerge}
            </Text>
            <Word onPress={() => setAdim("istemiyorum")}>{tr.ilkYardim.birazDahaIyiyim}</Word>
          </Belir>
        )}

        {recete && (
          <Belir key={adim} stil={{ maxWidth: 280, alignItems: "center" }}>
            <Text style={{ fontFamily: font.serif, fontSize: 20, lineHeight: 30, color: renk.ink, textAlign: "center", marginBottom: 12 }}>
              {recete.baslik}
            </Text>
            <Text style={{ fontFamily: font.sans, fontSize: 14, lineHeight: 22, color: renk.faint, textAlign: "center", marginBottom: 40 }}>
              {recete.metin}
            </Text>
            <Word onPress={onDenedi}>{tr.ilkYardim.deniyorum}</Word>
            <View style={{ marginTop: 16 }}>
              <Word ton={renk.dim} boyut={12} onPress={() => setAdim("izin")}>{tr.ilkYardim.halaOlmuyor}</Word>
            </View>
          </Belir>
        )}

        {adim === "izin" && (
          <Belir stil={{ alignItems: "center" }}>
            <Horizon ay />
            <Text style={{ fontFamily: font.serif, fontSize: 20, color: renk.ink, textAlign: "center", marginBottom: 12 }}>
              {tr.ilkYardim.izinBaslik}
            </Text>
            <Text style={{ fontFamily: font.sans, fontSize: 14, lineHeight: 22, color: renk.faint, textAlign: "center", marginBottom: 40 }}>
              {tr.ilkYardim.izinMetin}
            </Text>
            <Word onPress={onKapat}>{tr.ilkYardim.gorusuruz}</Word>
          </Belir>
        )}
      </View>
    </LinearGradient>
  );
}
