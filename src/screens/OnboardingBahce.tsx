import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Svg, { G } from "react-native-svg";
import { BahceButon } from "../components/bahce/BahceButon";
import { Onizleme } from "../components/bahce/Onizleme";
import { MiniCicek } from "../components/bahce/varliklar";
import { Belir } from "../components/Belir";
import { KATEGORILER, KategoriId } from "../data/kategoriler";
import type { Secim, SesTercihi } from "../db/depo";
import { tr } from "../i18n/tr";
import { bahce, bahceFont } from "../theme";

// Bahçe onboarding'i (referans: docs/bahce-onboarding-prototip.jsx):
// kapı → renk-alan bağı → güvence → kategori seçimi (CANLI önizleme) →
// hediye tohumlar → nasıl çalışır → ses tercihi → işte bahçen.
// Kural: ekran başına tek fikir, dokun-geç ritmi, ilerleme üstte, "geri" hep var.

const TOPLAM_EKRAN = 8;

type Props = {
  onBitti: (secim: Secim, ses: SesTercihi, ilkGorev: boolean) => void;
};

const baslik = {
  fontFamily: bahceFont.baslik,
  color: bahce.ink,
  textAlign: "center" as const,
};
const govde = {
  fontFamily: bahceFont.govde,
  color: bahce.faint,
  textAlign: "center" as const,
};
const dokun = {
  fontFamily: bahceFont.govdeEnKalin,
  fontSize: 11.5,
  color: bahce.dim,
  letterSpacing: 1,
  textAlign: "center" as const,
  marginTop: 28,
};

// kapı ekranındaki olgun örnek bahçe
const ORNEK_SECIM: Secim = {
  duzen: ["1", "2", "3"],
  gelisim: ["1", "2"],
  huzur: ["1", "2", "3"],
  odak: ["1", "2"],
  isler: ["1", "2"],
};

export function OnboardingBahce({ onBitti }: Props) {
  const [ekran, setEkran] = useState(0);
  const [secim, setSecim] = useState<Secim>({});
  const [ses, setSes] = useState<SesTercihi>("gunde3");
  const [acik, setAcik] = useState<KategoriId | null>("duzen");
  const ileri = () => setEkran((e) => Math.min(TOPLAM_EKRAN - 1, e + 1));
  const toplamAlt = Object.values(secim).reduce((a, b) => a + (b?.length ?? 0), 0);

  // hediye önizlemesi: seçilen her alandan 1 filiz
  const hediyeSecimi: Secim = Object.fromEntries(
    Object.entries(secim).map(([k, v]) => [k, (v ?? []).slice(0, 1)])
  );

  const altSec = (kid: KategoriId, altId: string) =>
    setSecim((s) => {
      const liste = s[kid] ?? [];
      return {
        ...s,
        [kid]: liste.includes(altId) ? liste.filter((x) => x !== altId) : [...liste, altId],
      };
    });

  const ekranlar: React.ReactNode[] = [
    // 0 · kapı
    <Pressable key="kapi" onPress={ileri}>
      <Belir stil={{ alignItems: "center" }}>
        <Onizleme genis secim={ORNEK_SECIM} />
        <Text style={[baslik, { fontSize: 27, marginTop: 22 }]}>{tr.onboarding.kapiBaslik}</Text>
        <Text style={[govde, { fontSize: 14, marginTop: 6 }]}>{tr.onboarding.kapiAlt}</Text>
        <Text style={dokun}>{tr.ortak.dokun}</Text>
      </Belir>
    </Pressable>,

    // 1 · renk-alan bağı
    <Pressable key="renk" onPress={ileri}>
      <Belir stil={{ alignItems: "center" }}>
        <Text style={[baslik, { fontSize: 22, marginBottom: 18 }]}>{tr.onboarding.renkAlanBaslik}</Text>
        <View style={{ gap: 12, maxWidth: 260 }}>
          {KATEGORILER.slice(0, 3).map((k, i) => (
            <Belir key={k.id} gecikme={300 + i * 350} stil={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Svg width={34} height={38} viewBox="-17 -34 34 38">
                <G scale={1.1}>
                  <MiniCicek renk={k.renk} />
                </G>
              </Svg>
              <View>
                <Text style={{ fontFamily: bahceFont.govdeEnKalin, fontSize: 13.5, color: k.renk }}>
                  {k.cicekAd}
                </Text>
                <Text style={{ fontFamily: bahceFont.govde, fontSize: 12.5, color: bahce.faint }}>
                  {k.ad}
                </Text>
              </View>
            </Belir>
          ))}
          <Belir gecikme={1500}>
            <Text style={{ fontFamily: bahceFont.govdeKalin, fontSize: 12, color: bahce.dim, textAlign: "center" }}>
              {tr.onboarding.renkAlanDevami}
            </Text>
          </Belir>
        </View>
        <Text style={[govde, { fontSize: 13.5, marginTop: 22 }]}>{tr.onboarding.renkAlanKapanis}</Text>
        <Text style={dokun}>{tr.ortak.dokun}</Text>
      </Belir>
    </Pressable>,

    // 2 · güvence — kategori seçiminden ÖNCE verilir
    <Pressable key="guvence" onPress={ileri}>
      <Belir stil={{ alignItems: "center", maxWidth: 280 }}>
        <Text style={{ fontSize: 40, marginBottom: 10 }}>💤</Text>
        <Text style={[baslik, { fontSize: 22, lineHeight: 30 }]}>{tr.onboarding.guvenceBaslik}</Text>
        <Text style={[govde, { fontSize: 13.5, lineHeight: 22, marginTop: 12 }]}>
          {tr.onboarding.guvenceAlt}
        </Text>
        <Text style={dokun}>{tr.ortak.dokun}</Text>
      </Belir>
    </Pressable>,

    // 3 · kategori seçimi + CANLI önizleme
    <Belir key="kategori" stil={{ width: "100%" }}>
      <Text style={[baslik, { fontSize: 20 }]}>{tr.onboarding.kategoriBaslik}</Text>
      <Text style={[govde, { fontSize: 12, marginTop: 3, marginBottom: 12 }]}>
        {tr.onboarding.kategoriAlt}
      </Text>
      <ScrollView style={{ maxHeight: 260 }} contentContainerStyle={{ gap: 7, paddingHorizontal: 2 }}>
        {KATEGORILER.map((k) => {
          const ac = acik === k.id;
          const n = secim[k.id]?.length ?? 0;
          return (
            <View
              key={k.id}
              style={{
                backgroundColor: bahce.beyaz,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: n ? k.renk : bahce.kartCizgi,
                overflow: "hidden",
              }}
            >
              <Pressable
                onPress={() => setAcik(ac ? null : k.id)}
                style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 11, paddingHorizontal: 13 }}
              >
                <View style={{ width: 13, height: 13, borderRadius: 999, backgroundColor: k.renk }} />
                <Text style={{ fontFamily: bahceFont.govdeEnKalin, fontSize: 13.5, color: bahce.ink, flex: 1 }}>
                  {k.ad}
                </Text>
                {n > 0 && (
                  <View style={{ backgroundColor: k.renk, borderRadius: 999, paddingVertical: 2, paddingHorizontal: 9 }}>
                    <Text style={{ fontFamily: bahceFont.govdeEnKalin, fontSize: 11, color: bahce.beyaz }}>{n}</Text>
                  </View>
                )}
                <Text style={{ color: bahce.dim, fontSize: 12 }}>{ac ? "▾" : "›"}</Text>
              </Pressable>
              {ac && (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, paddingHorizontal: 13, paddingBottom: 12 }}>
                  {k.alt.map((a) => {
                    const seciliMi = (secim[k.id] ?? []).includes(a.id);
                    return (
                      <Pressable
                        key={a.id}
                        onPress={() => altSec(k.id, a.id)}
                        style={{
                          backgroundColor: seciliMi ? k.renk : bahce.cipZemin,
                          borderRadius: 999,
                          paddingVertical: 6,
                          paddingHorizontal: 12,
                        }}
                      >
                        <Text style={{ fontFamily: bahceFont.govdeKalin, fontSize: 12, color: seciliMi ? bahce.beyaz : bahce.faint }}>
                          {a.ad}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
      <View style={{ marginTop: 12, backgroundColor: "#FFFFFFAA", borderRadius: 18, paddingTop: 10, paddingBottom: 4, paddingHorizontal: 8 }}>
        <Onizleme secim={secim} />
      </View>
      <View style={{ alignItems: "center", marginTop: 12 }}>
        {toplamAlt > 0 && (
          <BahceButon onPress={ileri}>{tr.onboarding.devamSayili(toplamAlt)}</BahceButon>
        )}
      </View>
    </Belir>,

    // 4 · hediye tohumlar
    <Pressable key="hediye" onPress={ileri}>
      <Belir stil={{ alignItems: "center" }}>
        <Text style={[baslik, { fontSize: 22 }]}>{tr.onboarding.hediyeBaslik}</Text>
        <Text style={[govde, { fontSize: 13, marginTop: 4, marginBottom: 14 }]}>
          {tr.onboarding.hediyeAlt}
        </Text>
        <View style={{ backgroundColor: "#FFFFFFAA", borderRadius: 18, paddingTop: 10, paddingBottom: 4, paddingHorizontal: 8, width: "100%", maxWidth: 300 }}>
          <Onizleme secim={hediyeSecimi} filizler />
        </View>
        <Text style={dokun}>{tr.ortak.dokun}</Text>
      </Belir>
    </Pressable>,

    // 5 · nasıl çalışır
    <Pressable key="nasil" onPress={ileri}>
      <Belir stil={{ maxWidth: 290, alignSelf: "center" }}>
        <Text style={[baslik, { fontSize: 21, marginBottom: 18 }]}>{tr.onboarding.nasilBaslik}</Text>
        {tr.onboarding.nasilSatirlar.map(([emoji, ana, alt], i) => (
          <Belir key={i} gecikme={200 + i * 300} stil={{ flexDirection: "row", gap: 12, alignItems: "center", paddingVertical: 9 }}>
            <Text style={{ fontSize: 24 }}>{emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: bahceFont.govdeEnKalin, fontSize: 13.5, color: bahce.ink }}>{ana}</Text>
              <Text style={{ fontFamily: bahceFont.govde, fontSize: 12, color: bahce.faint }}>{alt}</Text>
            </View>
          </Belir>
        ))}
        <Text style={dokun}>{tr.ortak.dokun}</Text>
      </Belir>
    </Pressable>,

    // 6 · ses tercihi (tavan 5 notu)
    <Belir key="ses" stil={{ maxWidth: 290, alignSelf: "center", width: "100%" }}>
      <Text style={[baslik, { fontSize: 21 }]}>{tr.onboarding.sesBaslik}</Text>
      <Text style={[govde, { fontSize: 12, marginTop: 4, marginBottom: 16 }]}>{tr.onboarding.sesAlt}</Text>
      {tr.onboarding.sesSecenekleri.map((s) => (
        <Pressable
          key={s.id}
          onPress={() => {
            setSes(s.id as SesTercihi);
            ileri();
          }}
          style={{
            backgroundColor: bahce.beyaz,
            borderWidth: 2,
            borderColor: bahce.kartCizgi,
            borderRadius: 16,
            paddingVertical: 13,
            paddingHorizontal: 14,
            marginBottom: 9,
          }}
        >
          <Text style={{ fontFamily: bahceFont.govdeEnKalin, fontSize: 14, color: bahce.ink, textAlign: "center" }}>
            {s.metin}
          </Text>
        </Pressable>
      ))}
    </Belir>,

    // 7 · işte bahçen
    <Belir key="bahcen" stil={{ alignItems: "center" }}>
      <Text style={[baslik, { fontSize: 25 }]}>{tr.onboarding.bahcenBaslik}</Text>
      <View style={{ backgroundColor: "#FFFFFFAA", borderRadius: 18, paddingTop: 10, paddingBottom: 4, paddingHorizontal: 8, width: "100%", maxWidth: 320, marginVertical: 12 }}>
        <Onizleme genis secim={hediyeSecimi} filizler />
      </View>
      <Text style={[govde, { fontSize: 13, marginBottom: 16 }]}>{tr.onboarding.bahcenAlt}</Text>
      <BahceButon onPress={() => onBitti(secim, ses, true)}>{tr.onboarding.ilkGorev}</BahceButon>
      <View style={{ marginTop: 10 }}>
        <BahceButon soluk onPress={() => onBitti(secim, ses, false)}>
          {tr.onboarding.sonraBakayim}
        </BahceButon>
      </View>
    </Belir>,
  ];

  return (
    <View style={{ flex: 1, paddingHorizontal: 18, paddingTop: 20, paddingBottom: 12 }}>
      {/* ilerleme çizgisi */}
      <View style={{ height: 3, backgroundColor: "#E2EAD0", borderRadius: 99, marginBottom: 18 }}>
        <View
          style={{
            height: 3,
            width: `${((ekran + 1) / TOPLAM_EKRAN) * 100}%`,
            backgroundColor: bahce.yesil,
            borderRadius: 99,
          }}
        />
      </View>
      <View style={{ flex: 1, justifyContent: "center" }}>{ekranlar[ekran]}</View>
      {ekran > 0 && (
        <Pressable onPress={() => setEkran((e) => e - 1)} hitSlop={10} style={{ alignSelf: "center" }}>
          <Text style={{ fontFamily: bahceFont.govdeKalin, fontSize: 11.5, color: bahce.dim }}>
            {tr.ortak.geri}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
