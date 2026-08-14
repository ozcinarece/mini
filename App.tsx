import { Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold } from "@expo-google-fonts/figtree";
import { Marcellus_400Regular, useFonts } from "@expo-google-fonts/marcellus";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Belir } from "./src/components/Belir";
import { Horizon } from "./src/components/Horizon";
import type { OnboardingSonuc } from "./src/engine/arketip";
import { tr } from "./src/i18n/tr";
import { Intro } from "./src/screens/Intro";
import { Onboarding } from "./src/screens/Onboarding";
import { bosluk, font, renk } from "./src/theme";

// Onboarding sonrası geçici ekran — Bugün ekranı (MVP adım 2) gelene kadar
function IlkGun({ sonuc }: { sonuc: OnboardingSonuc }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 }}>
      <Belir stil={{ maxWidth: bosluk.maxGenislik, alignItems: "center" }}>
        <Horizon dogmus />
        <Text
          style={{
            fontFamily: font.serif,
            fontSize: 24,
            color: renk.ink,
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          {tr.ilkGun.baslik}
        </Text>
        <Text
          style={{
            fontFamily: font.serif,
            fontSize: 18,
            lineHeight: 30,
            color: renk.ink,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          {sonuc.capa},{"\n"}
          <Text style={{ color: renk.sun }}>{sonuc.mikro}</Text>.
        </Text>
        <Text
          style={{
            fontFamily: font.sans,
            fontSize: 12,
            lineHeight: 20,
            color: renk.dim,
            textAlign: "center",
          }}
        >
          {tr.ilkGun.aciklama}
        </Text>
      </Belir>
    </View>
  );
}

export default function App() {
  const [fontlarHazir] = useFonts({
    Marcellus_400Regular,
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
  });
  const [introAdim, setIntroAdim] = useState(0);
  const [sonuc, setSonuc] = useState<OnboardingSonuc | null>(null);

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[...renk.gokyuzu]}
        locations={[...renk.gokyuzuDuraklar]}
        style={{ flex: 1 }}
      >
        <StatusBar style="light" />
        <SafeAreaView style={{ flex: 1 }}>
          {fontlarHazir &&
            (sonuc ? (
              <IlkGun sonuc={sonuc} />
            ) : introAdim < 2 ? (
              <Intro
                adim={introAdim}
                onIleri={() => setIntroAdim((i) => i + 1)}
                onGec={() => setIntroAdim(2)}
              />
            ) : (
              <Onboarding onBitti={setSonuc} />
            ))}
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
