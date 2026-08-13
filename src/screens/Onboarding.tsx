import React, { useMemo, useRef, useState } from "react";
import { Animated, Text, TextInput, View } from "react-native";
import { Belir } from "../components/Belir";
import { Choice } from "../components/Choice";
import { Horizon } from "../components/Horizon";
import { Word } from "../components/Word";
import { altHedef, altHedefler, katalogEslestir } from "../data/katalog";
import {
  akisKur,
  arketipTespit,
  Hedef,
  OnboardingSonuc,
  TETIKLI,
} from "../engine/arketip";
import { tr } from "../i18n/tr";
import { bosluk, font, renk } from "../theme";

// Onboarding v19: hedef yazma → [neden-tek + seçim] → neden-küçük → mikro/deste
// → [neden-çapa + çapa | tetik notu] → sözleşme. Kimlik cümlesi katalogdan otomatik.
type Props = {
  onBitti: (sonuc: OnboardingSonuc) => void;
};

const serifBaslik = {
  fontFamily: font.serif,
  color: renk.ink,
  textAlign: "center" as const,
};
const sansGovde = {
  fontFamily: font.sans,
  color: renk.faint,
  textAlign: "center" as const,
  fontSize: 14,
  lineHeight: 22,
};
const kaynakSatiri = {
  fontFamily: font.sans,
  color: renk.dim,
  textAlign: "center" as const,
  fontSize: 12,
};

// "neden" ara sayfaları ortak kalıp: başlık + açıklama + kaynak + anladım
function NedenSayfasi({
  baslik,
  aciklama,
  kaynak,
  onIleri,
}: {
  baslik: string;
  aciklama: string;
  kaynak: string;
  onIleri: () => void;
}) {
  return (
    <Belir stil={{ maxWidth: 280, alignItems: "center" }}>
      <Text style={[serifBaslik, { fontSize: 20, lineHeight: 30, marginBottom: 12 }]}>{baslik}</Text>
      <Text style={[sansGovde, { marginBottom: 8 }]}>{aciklama}</Text>
      <Text style={[kaynakSatiri, { marginBottom: 32 }]}>{kaynak}</Text>
      <Word onPress={onIleri}>{tr.ortak.anladim}</Word>
    </Belir>
  );
}

export function Onboarding({ onBitti }: Props) {
  const [idx, setIdx] = useState(0);
  const [hedefler, setHedefler] = useState<Hedef[]>([]);
  const [aktif, setAktif] = useState<number | null>(null);
  const [mikro, setMikro] = useState<string | null>(null);
  const [capa, setCapa] = useState<string | null>(null);
  const [taslak, setTaslak] = useState("");

  const aktifHedef = aktif !== null ? hedefler[aktif] : null;
  const arketip = aktifHedef ? tr.arketip[aktifHedef.arketip] : tr.arketip.baslama;
  const tetik = aktifHedef && TETIKLI.has(aktifHedef.arketip)
    ? tr.tetik[aktifHedef.arketip as keyof typeof tr.tetik]
    : null;

  const akis = akisKur(hedefler.length, aktifHedef);
  const sayfa = akis[idx];
  const ileri = () => setIdx((i) => i + 1);

  // kimlik cümlesi katalogdan OTOMATİK — kullanıcıya sorulmaz
  const kimlik =
    (aktifHedef?.altHedefId && altHedef(aktifHedef.altHedefId)?.kimlik) || arketip.kim;

  const hedefEkle = (metin: string, altHedefId: string | null = null) => {
    const t = metin.trim();
    if (!t || hedefler.some((h) => h.metin === t)) return;
    setHedefler((h) => [
      ...h,
      { metin: t, arketip: altHedefId ? "daginik" : arketipTespit(t), altHedefId },
    ]);
    setTaslak("");
  };

  // canlı öneriler: katalog eşleşmesi + örnek hedefler
  const oneriler = useMemo(() => {
    const q = taslak.trim().toLocaleLowerCase("tr");
    if (q.length < 2) return [];
    return [
      ...katalogEslestir(q).map((id) => ({ etiket: altHedefler[id].ad.toLocaleLowerCase("tr"), id })),
      ...tr.ornekHedefler
        .filter((o) => o.includes(q) && !hedefler.some((h) => h.metin === o))
        .map((o) => ({ etiket: o, id: null as string | null })),
    ].slice(0, 3);
  }, [taslak, hedefler]);

  // üst ilerleme çizgisi
  const oran = useRef(new Animated.Value(0)).current;
  Animated.timing(oran, {
    toValue: (idx + 1) / akis.length,
    duration: 1000,
    useNativeDriver: false,
  }).start();

  const sayfalar: Record<string, React.ReactNode> = {
    hedefler: (
      <Belir stil={{ width: "100%" }}>
        <Text style={[serifBaslik, { fontSize: 24, marginBottom: 40 }]}>
          {tr.onboarding.hedefSoru}
        </Text>
        <View style={{ maxWidth: 280, width: "100%", alignSelf: "center" }}>
          <TextInput
            value={taslak}
            onChangeText={setTaslak}
            onSubmitEditing={() => hedefEkle(taslak)}
            placeholder={tr.onboarding.hedefPlaceholder}
            placeholderTextColor={renk.dim}
            autoFocus
            style={{
              fontFamily: font.serif,
              fontSize: 18,
              color: renk.ink,
              textAlign: "center",
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: renk.line,
            }}
          />
          {oneriler.length > 0 && (
            <View style={{ alignItems: "center", gap: 8, marginTop: 16 }}>
              {oneriler.map((o) => (
                <Word key={o.etiket} ton={renk.faint} boyut={14} onPress={() => hedefEkle(o.etiket, o.id)}>
                  {o.etiket}
                </Word>
              ))}
              {taslak.trim().length > 2 && (
                <Word boyut={14} onPress={() => hedefEkle(taslak)}>
                  {tr.onboarding.olarakEkle(taslak.trim())}
                </Word>
              )}
            </View>
          )}
          {taslak.trim().length < 2 && hedefler.length === 0 && (
            <View style={{ alignItems: "center", gap: 8, marginTop: 16, opacity: 0.7 }}>
              {tr.ornekHedefler.slice(0, 3).map((o) => (
                <Word key={o} ton={renk.dim} boyut={14} onPress={() => hedefEkle(o)}>
                  {o}
                </Word>
              ))}
            </View>
          )}
          {hedefler.length > 0 && (
            <View style={{ alignItems: "center", gap: 8, marginTop: 32 }}>
              {hedefler.map((h) => (
                <Text key={h.metin} style={[sansGovde, { fontSize: 14 }]}>
                  {h.metin}
                  <Text style={{ color: renk.dim }}>
                    {" "}· {h.altHedefId ? altHedefler[h.altHedefId].ad.toLocaleLowerCase("tr") : tr.arketip[h.arketip].ad}
                  </Text>
                </Text>
              ))}
            </View>
          )}
        </View>
        {hedefler.length > 0 && (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Word
              onPress={() => {
                if (hedefler.length === 1) setAktif(0);
                ileri();
              }}
            >
              {tr.ortak.devam}
            </Word>
          </View>
        )}
      </Belir>
    ),

    nedenTek: (
      <NedenSayfasi
        baslik={tr.onboarding.nedenTekBaslik}
        aciklama={tr.onboarding.nedenTekAciklama}
        kaynak={tr.onboarding.nedenTekKaynak}
        onIleri={ileri}
      />
    ),

    secim: (
      <Belir stil={{ width: "100%" }}>
        <Text style={[serifBaslik, { fontSize: 24, marginBottom: 40 }]}>
          {tr.onboarding.secimSoru}
        </Text>
        <Choice
          secenekler={hedefler.map((h) => h.metin)}
          onSec={(metin) => {
            setAktif(hedefler.findIndex((h) => h.metin === metin));
            ileri();
          }}
        />
      </Belir>
    ),

    nedenKucuk: (
      <NedenSayfasi
        baslik={tr.onboarding.nedenKucukBaslik}
        aciklama={tr.onboarding.nedenKucukAciklama}
        kaynak={tr.onboarding.nedenKucukKaynak}
        onIleri={ileri}
      />
    ),

    mikro: (
      <Belir stil={{ width: "100%" }}>
        <Text style={[kaynakSatiri, { marginBottom: 8 }]}>{aktifHedef?.metin}</Text>
        <Text style={[serifBaslik, { fontSize: 24, marginBottom: 40 }]}>
          {tr.onboarding.mikroBaslik}
        </Text>
        <Choice
          secenekler={arketip.mikro}
          onSec={(m) => {
            setMikro(m);
            if (tetik) setCapa(tetik);
            ileri();
          }}
        />
      </Belir>
    ),

    deste: (() => {
      const kat = altHedef(aktifHedef?.altHedefId ?? "") ?? altHedefler.F01;
      return (
        <Belir stil={{ maxWidth: bosluk.maxGenislik, alignItems: "center" }}>
          <Text style={[kaynakSatiri, { marginBottom: 8 }]}>{aktifHedef?.metin}</Text>
          <Text style={[serifBaslik, { fontSize: 20, marginBottom: 24 }]}>
            {tr.onboarding.desteBaslik}
          </Text>
          <View style={{ gap: 10, marginBottom: 24, alignItems: "center" }}>
            {kat.kartlar.slice(0, 4).map((k) => (
              <Text key={k.id} style={[serifBaslik, { fontSize: 14, color: renk.faint }]}>
                {k.metin.toLocaleLowerCase("tr")}
              </Text>
            ))}
            <Text style={kaynakSatiri}>{tr.onboarding.desteDahaKart(kat.kartlar.length - 4)}</Text>
          </View>
          <Text style={[sansGovde, { marginBottom: 32 }]}>
            {tr.onboarding.desteAciklama(kat.hafta_hedefi)}
          </Text>
          <Word
            onPress={() => {
              setMikro(tr.onboarding.desteMikro);
              setCapa(tr.onboarding.desteCapa);
              ileri();
            }}
          >
            {tr.ortak.tamam}
          </Word>
        </Belir>
      );
    })(),

    tetikNotu: (
      <Belir stil={{ maxWidth: 280, alignItems: "center" }}>
        <Text style={[serifBaslik, { fontSize: 20, lineHeight: 30, marginBottom: 12 }]}>
          {tr.onboarding.tetikBaslik}
        </Text>
        <Text style={[sansGovde, { marginBottom: 32 }]}>
          {tr.onboarding.tetikAciklamaBas}
          <Text style={{ color: renk.ink }}>{tetik}</Text>
          {tr.onboarding.tetikAciklamaSon}
        </Text>
        <Word onPress={ileri}>{tr.ortak.tamam}</Word>
      </Belir>
    ),

    nedenCapa: (
      <NedenSayfasi
        baslik={tr.onboarding.nedenCapaBaslik}
        aciklama={tr.onboarding.nedenCapaAciklama}
        kaynak={tr.onboarding.nedenCapaKaynak}
        onIleri={ileri}
      />
    ),

    capa: (
      <Belir stil={{ width: "100%" }}>
        <Text style={[serifBaslik, { fontSize: 24, marginBottom: 40 }]}>
          {tr.onboarding.capaSoru}
        </Text>
        <Choice
          secenekler={tr.capalar}
          onSec={(a) => {
            setCapa(a);
            ileri();
          }}
        />
      </Belir>
    ),

    soz: (
      <Belir stil={{ maxWidth: bosluk.maxGenislik, alignItems: "center" }}>
        <Horizon />
        <Text style={[serifBaslik, { fontSize: 20, lineHeight: 36, marginBottom: 8 }]}>
          {capa},{"\n"}
          <Text style={{ color: renk.sun }}>{mikro}</Text>.
        </Text>
        <Text style={[sansGovde, { marginBottom: 32 }]}>{tr.onboarding.sozKimlik(kimlik)}</Text>
        <Text style={[kaynakSatiri, { lineHeight: 20, marginBottom: 40 }]}>
          {tr.onboarding.sozUygulama}
        </Text>
        <Word
          onPress={() =>
            onBitti({
              hedefler,
              aktif: aktif ?? 0,
              mikro: mikro ?? "",
              capa: capa ?? "",
              kimlik,
            })
          }
        >
          {tr.onboarding.sozBaslayalim}
        </Word>
      </Belir>
    ),
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 2, backgroundColor: renk.line }}>
        <Animated.View
          style={{
            height: 2,
            backgroundColor: renk.sun,
            opacity: 0.7,
            width: oran.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: bosluk.sayfaYatay,
        }}
      >
        <View key={sayfa} style={{ width: "100%", alignItems: "center" }}>
          {sayfalar[sayfa]}
        </View>
      </View>
    </View>
  );
}
