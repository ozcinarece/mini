import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Svg, { G, Polygon, Rect, Text as SvgText } from "react-native-svg";
import { MiniIkon, VarlikCiz, Yabani } from "../components/bahce/varliklar";
import {
  BAHCE_KATALOG,
  BOLGE_FIYATI,
  IZGARA,
} from "../data/bahce-katalog";
import { KATEGORILER, KategoriId } from "../data/kategoriler";
import * as depo from "../db/depo";
import {
  dukkanDurumu,
  hasatEdilebilir,
  hasatGetirisi,
  kilitliKareMi,
  sula,
  tohumKazanci,
  yeniAcilanlar,
} from "../engine/bahce";
import { tr } from "../i18n/tr";
import { bahce, bahceFont } from "../theme";

// Bahçe sahnesi — görev → tohum → ek → görevle büyüt (su kategoriye akar) →
// hasat → tohum geri + para → dekor & alan aç. Zamanlayıcı yok; emek büyütür.

const TW = 84, TH = 42, DERINLIK = 14;
const W = 560, H = 470, OX = 262, OY = 130;
const poz = (c: number, r: number) => ({ x: OX + ((c - r) * TW) / 2, y: OY + ((c + r) * TH) / 2 });

type Gorev = { komut: string; kategori: KategoriId };

type Props = {
  secim: depo.Secim;
  ilkGorevle: boolean; // onboarding "ilk görevimi göster" ile mi geldi
};

export function Bahce({ secim, ilkGorevle }: Props) {
  const [cuzdan, setCuzdan] = useState<depo.Cuzdan>(() => depo.cuzdanOku());
  const [kareler, setKareler] = useState<depo.Kare[]>(() => depo.kareleriYukle());
  const [bolgeAcik, setBolgeAcik] = useState(() => depo.bolgeAcikMi());
  const [toplam, setToplam] = useState(() => depo.toplamKanit());
  const [bugun, setBugun] = useState(() => depo.bugunKanit());
  const [panel, setPanel] = useState<"bugun" | "dukkan">(ilkGorevle ? "bugun" : "dukkan");
  const [dukkanTab, setDukkanTab] = useState<"tohum" | "dekor">("tohum");
  const [ekimModu, setEkimModu] = useState<string | null>(null);
  const [rozet, setRozet] = useState<string | null>(null);
  const [sonraMesaji, setSonraMesaji] = useState(false);
  const rozetZamanlayici = useRef<ReturnType<typeof setTimeout> | null>(null);

  // görev havuzu: seçili alt kategorilerin komutları
  const havuz: Gorev[] = KATEGORILER.flatMap((k) =>
    k.alt
      .filter((a) => (secim[k.id] ?? []).includes(a.id))
      .flatMap((a) => a.komutlar.map((komut) => ({ komut, kategori: k.id })))
  );

  const gorevCek = (): Gorev | null => {
    if (havuz.length === 0) return null;
    const son = depo.sonKomutlar(3);
    let uygun = havuz.filter((g) => !son.includes(g.komut));
    if (uygun.length === 0) uygun = havuz;
    return uygun[Math.floor(Math.random() * uygun.length)];
  };

  const [gorev, setGorev] = useState<Gorev | null>(() => gorevCek());

  useEffect(() => () => {
    if (rozetZamanlayici.current) clearTimeout(rozetZamanlayici.current);
  }, []);

  const rozetGoster = (metin: string) => {
    setRozet(metin);
    if (rozetZamanlayici.current) clearTimeout(rozetZamanlayici.current);
    rozetZamanlayici.current = setTimeout(() => setRozet(null), 1400);
  };

  const cuzdanGuncelle = (c: depo.Cuzdan) => {
    setCuzdan(c);
    depo.cuzdanYaz(c);
  };

  const yaptim = () => {
    if (!gorev) return;
    const kazanc = tohumKazanci(bugun);
    cuzdanGuncelle({ ...cuzdan, tohum: cuzdan.tohum + kazanc });
    rozetGoster(`+${kazanc} 🌰`);
    depo.kanitEkle(gorev.komut, gorev.kategori);
    depo.sonKomutEkle(gorev.komut);
    setBugun((n) => n + 1);
    const yeniToplam = toplam + 1;
    setToplam(yeniToplam);
    const acilan = yeniAcilanlar(yeniToplam);
    if (acilan.length > 0) {
      setTimeout(() => rozetGoster(tr.bahce.yeniTur(BAHCE_KATALOG[acilan[0]].ad)), 1500);
    }
    // SU KATEGORİYE AKAR: görevin ailesindeki çiçekler + sebzeler büyür
    const sulanmis = sula(kareler, gorev.kategori);
    sulanmis.forEach((k, i) => {
      if (k.asama !== kareler[i].asama) depo.kareYaz(k);
    });
    setKareler(sulanmis);
    setSonraMesaji(false);
    setGorev(gorevCek());
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  const simdiOlmadi = () => {
    if (gorev) depo.sonKomutEkle(gorev.komut);
    setSonraMesaji(true);
    setGorev(gorevCek());
  };

  const satinAl = (varlik: string) => {
    const durum = dukkanDurumu(varlik, cuzdan.tohum, cuzdan.para, toplam);
    if (durum.tur !== "alinabilir") return;
    const k = BAHCE_KATALOG[varlik];
    if (k.tip === "dekor") cuzdanGuncelle({ ...cuzdan, para: cuzdan.para - (k.fiyatPara ?? 0) });
    else cuzdanGuncelle({ ...cuzdan, tohum: cuzdan.tohum - (k.fiyatTohum ?? 0) });
    setEkimModu(varlik);
  };

  const kareTikla = (c: number, r: number) => {
    if (kilitliKareMi(c, bolgeAcik)) {
      if (cuzdan.para >= BOLGE_FIYATI) {
        cuzdanGuncelle({ ...cuzdan, para: cuzdan.para - BOLGE_FIYATI });
        depo.bolgeAc();
        setBolgeAcik(true);
        rozetGoster(tr.bahce.bolgeAcildi);
      }
      return;
    }
    const mevcut = kareler.find((k) => k.c === c && k.r === r);
    if (ekimModu && !mevcut) {
      const kalem = BAHCE_KATALOG[ekimModu];
      const yeni: depo.Kare = { c, r, varlik: ekimModu, asama: kalem.maxAsama != null ? 0 : null };
      depo.kareYaz(yeni);
      setKareler((ks) => [...ks, yeni]);
      setEkimModu(null);
      return;
    }
    if (mevcut && hasatEdilebilir(mevcut)) {
      const getiri = hasatGetirisi(mevcut.varlik);
      cuzdanGuncelle({ tohum: cuzdan.tohum + getiri.tohum, para: cuzdan.para + getiri.para });
      rozetGoster(`+${getiri.tohum} 🌰  +${getiri.para} 🪙`);
      depo.kareSil(c, r);
      setKareler((ks) => ks.filter((k) => !(k.c === c && k.r === r)));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  };

  const kilitEtiketi = poz(5.5, 2);

  return (
    <View style={{ flex: 1, paddingHorizontal: 8, paddingTop: 8 }}>
      {/* üst: cüzdan + kanıt */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 6 }}>
        <View style={{ flexDirection: "row", gap: 6 }}>
          <View style={{ backgroundColor: bahce.beyaz, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 12 }}>
            <Text style={{ fontFamily: bahceFont.govdeEnKalin, fontSize: 13.5, color: bahce.ink }}>
              🌰 {cuzdan.tohum}
            </Text>
          </View>
          <View style={{ backgroundColor: bahce.beyaz, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 12 }}>
            <Text style={{ fontFamily: bahceFont.govdeEnKalin, fontSize: 13.5, color: bahce.altin }}>
              🪙 {cuzdan.para}
            </Text>
          </View>
          {rozet && (
            <Text style={{ fontFamily: bahceFont.govdeEnKalin, fontSize: 13, color: bahce.yesil, alignSelf: "center" }}>
              {rozet}
            </Text>
          )}
        </View>
        <Text style={{ fontFamily: bahceFont.govdeEnKalin, fontSize: 11, color: bahce.faint }}>
          {tr.bahce.kanit(toplam)}
        </Text>
      </View>

      {/* sahne */}
      <Svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", flex: 1 }}>
        {Array.from({ length: IZGARA.satir }).flatMap((_, r) =>
          Array.from({ length: IZGARA.sutun }).map((_, c) => {
            const { x, y } = poz(c, r);
            const kilit = kilitliKareMi(c, bolgeAcik);
            const acikTon = (c + r) % 2 === 0;
            const v = kareler.find((k) => k.c === c && k.r === r);
            const hasatVar = v ? hasatEdilebilir(v) : false;
            return (
              <G key={`${c},${r}`} x={x} y={y} onPress={() => kareTikla(c, r)}>
                <Polygon
                  points={`${-TW / 2},0 0,${TH / 2} 0,${TH / 2 + DERINLIK} ${-TW / 2},${DERINLIK}`}
                  fill={kilit ? "#7E6C55" : "#8A6B4A"}
                />
                <Polygon
                  points={`${TW / 2},0 0,${TH / 2} 0,${TH / 2 + DERINLIK} ${TW / 2},${DERINLIK}`}
                  fill={kilit ? "#6A5A46" : "#75573B"}
                />
                <Polygon
                  points={`0,${-TH / 2} ${TW / 2},0 0,${TH / 2} ${-TW / 2},0`}
                  fill={kilit ? (acikTon ? "#9AA57E" : "#8E9A72") : acikTon ? "#AFD37B" : "#A0C86C"}
                  stroke={kilit ? "#828E68" : "#8FBB5B"}
                  strokeWidth={1}
                />
                {kilit && <Yabani i={c * 7 + r} />}
                {hasatVar && (
                  <Polygon
                    points={`0,${-TH / 2} ${TW / 2},0 0,${TH / 2} ${-TW / 2},0`}
                    fill="#FFE9A8"
                    opacity={0.55}
                  />
                )}
                {ekimModu && !v && !kilit && (
                  <Polygon
                    points={`0,${-TH / 2} ${TW / 2},0 0,${TH / 2} ${-TW / 2},0`}
                    fill="#FFFFFF"
                    opacity={0.4}
                  />
                )}
              </G>
            );
          })
        )}

        {/* kilitli bölge etiketi */}
        {!bolgeAcik && (
          <G x={kilitEtiketi.x} y={kilitEtiketi.y - 26} onPress={() => kareTikla(IZGARA.kilitliSutunBasi, 2)}>
            <Rect x={-46} y={-14} width={92} height={26} rx={13} fill="#FFFFFF" opacity={0.92} />
            <SvgText
              x={0}
              y={4}
              textAnchor="middle"
              fontSize={12.5}
              fontWeight="800"
              fill={cuzdan.para >= BOLGE_FIYATI ? bahce.yesil : bahce.kilitliMetin}
            >
              {tr.bahce.bolgeKilidi(BOLGE_FIYATI)}
            </SvgText>
          </G>
        )}

        {/* varlıklar: derinlik sırasına göre */}
        {[...kareler]
          .sort((a, b) => a.c + a.r - (b.c + b.r))
          .map((k) => {
            const { x, y } = poz(k.c, k.r);
            return (
              <G key={`${k.c},${k.r}-${k.asama ?? "d"}`} x={x} y={y} onPress={() => kareTikla(k.c, k.r)}>
                <VarlikCiz varlik={k.varlik} asama={k.asama} />
              </G>
            );
          })}
      </Svg>
      <Text
        style={{
          textAlign: "center",
          fontSize: 11,
          fontFamily: bahceFont.govdeEnKalin,
          color: ekimModu ? bahce.yesil : bahce.dim,
          minHeight: 15,
          marginTop: -4,
        }}
      >
        {ekimModu ? tr.bahce.ekimIpucu(BAHCE_KATALOG[ekimModu].ad) : tr.bahce.hasatIpucu}
      </Text>

      {/* alt panel */}
      <View
        style={{
          backgroundColor: bahce.beyaz,
          borderRadius: 22,
          paddingVertical: 10,
          paddingHorizontal: 14,
          marginTop: 4,
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 9 }}>
          {(
            [
              ["bugun", tr.bahce.panelBugun],
              ["dukkan", tr.bahce.panelDukkan],
            ] as const
          ).map(([id, ad]) => (
            <Pressable
              key={id}
              onPress={() => setPanel(id)}
              style={{
                backgroundColor: panel === id ? bahce.yesil : bahce.cipZemin,
                borderRadius: 999,
                paddingVertical: 6,
                paddingHorizontal: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: bahceFont.baslik,
                  fontSize: 13,
                  color: panel === id ? bahce.beyaz : bahce.faint,
                }}
              >
                {ad}
              </Text>
            </Pressable>
          ))}
        </View>

        {panel === "bugun" ? (
          <View style={{ alignItems: "center" }}>
            {gorev ? (
              <>
                {sonraMesaji && (
                  <Text style={{ fontFamily: bahceFont.govde, fontSize: 12, color: bahce.faint, marginBottom: 6 }}>
                    {tr.bahce.sonraMesaji}
                  </Text>
                )}
                <Text
                  style={{
                    fontFamily: bahceFont.baslik,
                    fontSize: 15.5,
                    color: bahce.ink,
                    textAlign: "center",
                    marginBottom: 9,
                  }}
                >
                  {gorev.komut}
                </Text>
                <Pressable onPress={yaptim}>
                  <View
                    style={{
                      backgroundColor: bahce.yesil,
                      borderRadius: 999,
                      paddingVertical: 11,
                      paddingHorizontal: 34,
                      borderBottomWidth: 5,
                      borderBottomColor: bahce.koyu,
                    }}
                  >
                    <Text style={{ fontFamily: bahceFont.baslik, fontSize: 14.5, color: bahce.beyaz }}>
                      {tr.bahce.yaptim} · +{tohumKazanci(bugun)} 🌰
                      {bugun === 0 ? tr.bahce.ilkKanitEki : ""}
                    </Text>
                  </View>
                </Pressable>
                <Pressable onPress={simdiOlmadi} hitSlop={8} style={{ marginTop: 6 }}>
                  <Text style={{ fontFamily: bahceFont.govdeKalin, fontSize: 11.5, color: bahce.faint }}>
                    {tr.bahce.simdiOlmadi}
                  </Text>
                </Pressable>
              </>
            ) : (
              <Text style={{ fontFamily: bahceFont.govde, fontSize: 13, color: bahce.faint, textAlign: "center" }}>
                {tr.bahce.gorevYok}
              </Text>
            )}
          </View>
        ) : (
          <View>
            <View style={{ flexDirection: "row", justifyContent: "center", gap: 6, marginBottom: 8 }}>
              {(
                [
                  ["tohum", tr.bahce.dukkanTohum],
                  ["dekor", tr.bahce.dukkanDekor],
                ] as const
              ).map(([id, ad]) => (
                <Pressable
                  key={id}
                  onPress={() => setDukkanTab(id)}
                  style={{
                    backgroundColor: dukkanTab === id ? bahce.cipZemin : "transparent",
                    borderRadius: 999,
                    paddingVertical: 4,
                    paddingHorizontal: 12,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: bahceFont.govdeEnKalin,
                      fontSize: 11.5,
                      color: dukkanTab === id ? bahce.ink : bahce.dim,
                    }}
                  >
                    {ad}
                  </Text>
                </Pressable>
              ))}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7 }}>
              {Object.entries(BAHCE_KATALOG)
                .filter(([, k]) => (dukkanTab === "tohum" ? k.tip !== "dekor" : k.tip === "dekor"))
                .map(([id, k]) => {
                  const durum = dukkanDurumu(id, cuzdan.tohum, cuzdan.para, toplam);
                  const soluk = durum.tur !== "alinabilir";
                  const fiyat = k.tip === "dekor" ? `${k.fiyatPara} 🪙` : `${k.fiyatTohum} 🌰`;
                  return (
                    <Pressable
                      key={id}
                      onPress={() => satinAl(id)}
                      style={{
                        minWidth: 74,
                        backgroundColor: "#F7FAF0",
                        borderWidth: 1.5,
                        borderColor: soluk ? "#E6ECD8" : "#D5E2BC",
                        borderRadius: 14,
                        paddingVertical: 7,
                        paddingHorizontal: 4,
                        opacity: soluk ? 0.45 : 1,
                        alignItems: "center",
                      }}
                    >
                      <MiniIkon varlik={id} />
                      <Text style={{ fontSize: 10.5, fontFamily: bahceFont.govdeEnKalin, color: bahce.ink }}>
                        {k.ad}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: bahceFont.govdeEnKalin,
                          color: durum.tur === "esikte" ? bahce.kilitliMetin : bahce.yesil,
                        }}
                      >
                        {durum.tur === "sandiktan"
                          ? tr.bahce.sandiktan
                          : durum.tur === "esikte"
                            ? tr.bahce.kilitliEsik(durum.mevcut, durum.esik)
                            : `${fiyat}${k.tip === "sebze" ? tr.bahce.sebzeKari(k.para ?? 0) : ""}`}
                      </Text>
                    </Pressable>
                  );
                })}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}
