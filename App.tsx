import { Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold } from "@expo-google-fonts/figtree";
import { Marcellus_400Regular, useFonts } from "@expo-google-fonts/marcellus";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as depo from "./src/db/depo";
import { Bugun } from "./src/screens/Bugun";
import { Intro } from "./src/screens/Intro";
import { Onboarding } from "./src/screens/Onboarding";
import { renk } from "./src/theme";

export default function App() {
  const [fontlarYuklendi, fontHatasi] = useFonts({
    Marcellus_400Regular,
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
  });
  // font yüklemesi takılırsa ekran boş kalmasın: kısa bir bekleme sonrası
  // sistem fontuyla devam edilir (Android bilinmeyen fontFamily'de sessizce geri düşer)
  const [beklemeAsildi, setBeklemeAsildi] = useState(false);
  useEffect(() => {
    const zamanlayici = setTimeout(() => setBeklemeAsildi(true), 3000);
    return () => clearTimeout(zamanlayici);
  }, []);
  const hazir = fontlarYuklendi || !!fontHatasi || beklemeAsildi;

  const [introAdim, setIntroAdim] = useState(0);
  const [kayit, setKayit] = useState<depo.Kayit | null>(() => depo.kayitYukle());

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[...renk.gokyuzu]}
        locations={[...renk.gokyuzuDuraklar]}
        style={{ flex: 1 }}
      >
        <StatusBar style="light" />
        <SafeAreaView style={{ flex: 1 }}>
          {hazir &&
            (kayit ? (
              <Bugun kayit={kayit} />
            ) : introAdim < 2 ? (
              <Intro
                adim={introAdim}
                onIleri={() => setIntroAdim((i) => i + 1)}
                onGec={() => setIntroAdim(2)}
              />
            ) : (
              <Onboarding onBitti={(sonuc) => setKayit(depo.kayitSakla(sonuc))} />
            ))}
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
