import { Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold } from "@expo-google-fonts/figtree";
import { Marcellus_400Regular, useFonts } from "@expo-google-fonts/marcellus";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as depo from "./src/db/depo";
import * as bildirim from "./src/engine/bildirim";
import { tr } from "./src/i18n/tr";
import { Bugun } from "./src/screens/Bugun";
import { Gecmis } from "./src/screens/Gecmis";
import { Intro } from "./src/screens/Intro";
import { Kimlik } from "./src/screens/Kimlik";
import { Kurulum } from "./src/screens/Kurulum";
import { Paketlerim } from "./src/screens/Paketlerim";
import { font, renk } from "./src/theme";

type Alan = (typeof tr.alanlar)[number];

export default function App() {
  const [fontlarYuklendi, fontHatasi] = useFonts({
    Marcellus_400Regular,
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
  });
  // font yüklemesi takılırsa ekran boş kalmasın: kısa bekleme sonrası sistem fontuyla devam
  const [beklemeAsildi, setBeklemeAsildi] = useState(false);
  useEffect(() => {
    const zamanlayici = setTimeout(() => setBeklemeAsildi(true), 3000);
    return () => clearTimeout(zamanlayici);
  }, []);
  const fontHazir = fontlarYuklendi || !!fontHatasi || beklemeAsildi;

  const [introAdim, setIntroAdim] = useState(0);
  const [abonelikler, setAbonelikler] = useState<depo.Abonelik[]>(() => depo.abonelikleriYukle());
  const [kurulumAcik, setKurulumAcik] = useState(false);
  const [alan, setAlan] = useState<Alan>("bugün");
  const [toplamKanit, setToplamKanit] = useState(() => depo.toplamKanit());
  const [bugunKanit, setBugunKanit] = useState(() => depo.bugunKanit());

  const hazir = abonelikler.length > 0;
  const gunlukToplam = abonelikler.filter((a) => a.aktif).reduce((s, a) => s + a.adet, 0);

  // tarife her açılışta ve abonelikler değiştikçe tazelenir (saatler asla gösterilmez)
  useEffect(() => {
    if (abonelikler.length > 0) void bildirim.planla(abonelikler);
  }, [abonelikler]);

  const kanitEkle = (komut: string, paketAd: string) => {
    depo.kanitEkle(komut, paketAd);
    setToplamKanit((n) => n + 1);
    setBugunKanit((n) => n + 1);
  };

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[...renk.gokyuzu]}
        locations={[...renk.gokyuzuDuraklar]}
        style={{ flex: 1 }}
      >
        <StatusBar style="light" />
        <SafeAreaView style={{ flex: 1 }}>
          {fontHazir &&
            (!hazir || kurulumAcik ? (
              !hazir && introAdim < 2 ? (
                <Intro adim={introAdim} onIleri={() => setIntroAdim((i) => i + 1)} />
              ) : (
                <Kurulum
                  mevcutToplam={gunlukToplam}
                  onVazgec={hazir ? () => setKurulumAcik(false) : null}
                  onBitti={(yeni) => {
                    const eklenen = depo.abonelikEkle(yeni);
                    setAbonelikler((abs) => [...abs, eklenen]);
                    setKurulumAcik(false);
                    setAlan("bugün");
                  }}
                />
              )
            ) : (
              <>
                <ScrollView
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                    paddingHorizontal: 24,
                    paddingVertical: 40,
                  }}
                >
                  {alan === "bugün" && (
                    <Bugun
                      abonelikler={abonelikler}
                      toplamKanit={toplamKanit}
                      bugunKanit={bugunKanit}
                      onKanit={kanitEkle}
                    />
                  )}
                  {alan === "geçmiş" && <Gecmis gunler={depo.gunlukKanitlar(14)} />}
                  {alan === "paketler" && (
                    <Paketlerim
                      abonelikler={abonelikler}
                      toplam={gunlukToplam}
                      onAktifDegistir={(id, aktif) => {
                        depo.abonelikAktifDegistir(id, aktif);
                        setAbonelikler((abs) =>
                          abs.map((a) => (a.id === id ? { ...a, aktif } : a))
                        );
                      }}
                      onYeni={() => setKurulumAcik(true)}
                    />
                  )}
                  {alan === "kimlik" && (
                    <Kimlik kanit={toplamKanit} onBugune={() => setAlan("bugün")} />
                  )}
                </ScrollView>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 32,
                    paddingBottom: 24,
                    paddingTop: 8,
                  }}
                >
                  {tr.alanlar.map((a) => (
                    <Pressable key={a} onPress={() => setAlan(a)} hitSlop={10}>
                      <Text
                        style={{
                          fontFamily: alan === a ? font.sansSemi : font.sans,
                          fontSize: 12,
                          letterSpacing: 1,
                          color: alan === a ? renk.sun : renk.dim,
                        }}
                      >
                        {a}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            ))}
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
