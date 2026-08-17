import { Baloo2_700Bold } from "@expo-google-fonts/baloo-2";
import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/nunito";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { KATEGORI_CICEGI } from "./src/data/bahce-katalog";
import type { KategoriId } from "./src/data/kategoriler";
import * as depo from "./src/db/depo";
import { hediyeFilizleri } from "./src/engine/bahce";
import * as bildirim from "./src/engine/bildirim";
import { Bahce } from "./src/screens/Bahce";
import { OnboardingBahce } from "./src/screens/OnboardingBahce";
import { bahce } from "./src/theme";

export default function App() {
  const [fontlarYuklendi, fontHatasi] = useFonts({
    Baloo2_700Bold,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  // font yüklemesi takılırsa ekran boş kalmasın: kısa bekleme sonrası sistem fontuyla devam
  const [beklemeAsildi, setBeklemeAsildi] = useState(false);
  useEffect(() => {
    const zamanlayici = setTimeout(() => setBeklemeAsildi(true), 3000);
    return () => clearTimeout(zamanlayici);
  }, []);
  const fontHazir = fontlarYuklendi || !!fontHatasi || beklemeAsildi;

  const [secim, setSecim] = useState<depo.Secim | null>(() => depo.secimOku());
  const [ilkGorevle, setIlkGorevle] = useState(false);

  // tarife her açılışta tazelenir (görev-bazlı havuzdan; saatler asla gösterilmez)
  useEffect(() => {
    if (secim) void bildirim.planla(secim, depo.sesTercihiOku());
  }, [secim]);

  const onboardingBitti = (yeniSecim: depo.Secim, ses: depo.SesTercihi, ilkGorev: boolean) => {
    depo.secimYaz(yeniSecim);
    depo.sesTercihiYaz(ses);
    // hoş geldin hediyesi: seçilen her alandan bir filiz ekili gelir
    const kategoriler = Object.entries(yeniSecim)
      .filter(([, v]) => (v?.length ?? 0) > 0)
      .map(([k]) => k as KategoriId);
    hediyeFilizleri(kategoriler, KATEGORI_CICEGI).forEach((kare) => depo.kareYaz(kare));
    setIlkGorevle(ilkGorev);
    setSecim(yeniSecim);
  };

  return (
    <SafeAreaProvider>
      <LinearGradient colors={[...bahce.zemin]} style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <SafeAreaView style={{ flex: 1 }}>
          {fontHazir &&
            (secim ? (
              <Bahce secim={secim} ilkGorevle={ilkGorevle} />
            ) : (
              <OnboardingBahce onBitti={onboardingBitti} />
            ))}
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
