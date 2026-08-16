import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Belir } from "../components/Belir";
import { Choice } from "../components/Choice";
import { Horizon } from "../components/Horizon";
import { Ring } from "../components/Ring";
import { Word } from "../components/Word";
import { GUNLUK_TAVAN, PAKETLER, PaketId } from "../data/paketler";
import type { YeniAbonelik } from "../db/depo";
import { tr } from "../i18n/tr";
import { font, renk } from "../theme";

// Kurulum sihirbazı (v28 birebir): paket → komutlar → günler → adet → pencere → özet.
// Kontrol tamamen kullanıcıda; tek dayatma günlük tavan (5).
type Adim = "paket" | "komutlar" | "gunler" | "adet" | "pencere" | "pencereGun" | "ozet";

type Taslak = {
  paketId: PaketId | null;
  ad: string;
  komutlar: string[];
  gunler: number[];
  adet: number | null;
  pencere: number | null;
  pencereGun: Record<number, number> | null;
};

type Props = {
  mevcutToplam: number; // aktif aboneliklerin günlük adet toplamı
  onBitti: (a: YeniAbonelik) => void;
  onVazgec: (() => void) | null; // ilk kurulumda null: vazgeç yok
};

const serifBaslik = {
  fontFamily: font.serif,
  color: renk.ink,
  textAlign: "center" as const,
};
const dimNot = {
  fontFamily: font.sans,
  fontSize: 12,
  color: renk.dim,
  textAlign: "center" as const,
};

export function Kurulum({ mevcutToplam, onBitti, onVazgec }: Props) {
  const [adim, setAdim] = useState<Adim>("paket");
  const [taslak, setTaslak] = useState<Taslak>({
    paketId: null,
    ad: "",
    komutlar: [],
    gunler: [],
    adet: null,
    pencere: null,
    pencereGun: null,
  });
  const [komutTaslagi, setKomutTaslagi] = useState("");
  const kalan = GUNLUK_TAVAN - mevcutToplam;

  const geriSatiri = (hedef: Adim) => (
    <View style={{ marginTop: 20, alignItems: "center" }}>
      <Word ton={renk.dim} boyut={12} onPress={() => setAdim(hedef)}>{tr.ortak.geri}</Word>
    </View>
  );

  const sayfalar: Record<Adim, React.ReactNode> = {
    paket: (
      <Belir stil={{ width: "100%", alignItems: "center" }}>
        <Text style={[serifBaslik, { fontSize: 24, marginBottom: 40 }]}>{tr.kurulum.paketSoru}</Text>
        <Choice
          secenekler={Object.values(PAKETLER).map((p) => p.ad)}
          bekleme={700}
          onSec={(ad) => {
            const id = (Object.keys(PAKETLER) as PaketId[]).find((k) => PAKETLER[k].ad === ad)!;
            setTaslak((t) => ({ ...t, paketId: id, ad, komutlar: [...PAKETLER[id].komutlar] }));
            setAdim("komutlar");
          }}
        />
        {onVazgec && (
          <View style={{ marginTop: 40 }}>
            <Word ton={renk.dim} boyut={12} onPress={onVazgec}>{tr.ortak.vazgec}</Word>
          </View>
        )}
      </Belir>
    ),

    komutlar: (
      <Belir stil={{ width: "100%", maxWidth: 300, alignItems: "center" }}>
        <Text style={[serifBaslik, { fontSize: 24, marginBottom: 8 }]}>{taslak.ad}</Text>
        <Text style={[dimNot, { marginBottom: 28 }]}>
          {taslak.komutlar.length > 0 ? tr.kurulum.komutlarNot : tr.kurulum.komutlarNotBos}
        </Text>
        <View style={{ alignItems: "center", gap: 12, marginBottom: 24 }}>
          {taslak.komutlar.map((k, i) => (
            <Pressable
              key={`${k}-${i}`}
              hitSlop={6}
              onPress={() =>
                setTaslak((t) => ({ ...t, komutlar: t.komutlar.filter((_, j) => j !== i) }))
              }
            >
              <Text style={{ fontFamily: font.serif, fontSize: 16, color: renk.ink, textAlign: "center" }}>
                {k} <Text style={{ fontFamily: font.sans, fontSize: 12, color: renk.dim }}>×</Text>
              </Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          value={komutTaslagi}
          onChangeText={setKomutTaslagi}
          onSubmitEditing={() => {
            const k = komutTaslagi.trim().toLocaleLowerCase("tr");
            if (!k) return;
            setTaslak((t) => ({ ...t, komutlar: [...t.komutlar, k] }));
            setKomutTaslagi("");
          }}
          blurOnSubmit={false}
          placeholder={tr.kurulum.komutEklePlaceholder}
          placeholderTextColor={renk.dim}
          style={{
            fontFamily: font.sans,
            fontSize: 14,
            color: renk.ink,
            textAlign: "center",
            paddingVertical: 8,
            marginBottom: 32,
            width: "100%",
            borderBottomWidth: 1,
            borderBottomColor: renk.line,
          }}
        />
        {taslak.komutlar.length > 0 && (
          <Word altCizgi onPress={() => setAdim("gunler")}>{tr.ortak.devam}</Word>
        )}
        {geriSatiri("paket")}
      </Belir>
    ),

    gunler: (
      <Belir stil={{ width: "100%", alignItems: "center" }}>
        <Text style={[serifBaslik, { fontSize: 24, marginBottom: 8 }]}>{tr.kurulum.gunlerSoru}</Text>
        <Text style={[dimNot, { marginBottom: 32 }]}>{tr.kurulum.gunlerNot}</Text>
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 10, marginBottom: 28 }}>
          {tr.gunKisa.map((g, i) => {
            const acik = taslak.gunler.includes(i);
            return (
              <Pressable
                key={g}
                hitSlop={8}
                onPress={() =>
                  setTaslak((t) => ({
                    ...t,
                    gunler: acik ? t.gunler.filter((x) => x !== i) : [...t.gunler, i].sort(),
                  }))
                }
                style={{ alignItems: "center", gap: 8 }}
              >
                <Ring acik={acik} />
                <Text style={{ fontFamily: font.sans, fontSize: 12, color: acik ? renk.sun : renk.faint }}>
                  {g}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Word
          ton={renk.faint}
          boyut={12}
          onPress={() => setTaslak((t) => ({ ...t, gunler: [0, 1, 2, 3, 4, 5, 6] }))}
        >
          {tr.kurulum.herGun}
        </Word>
        <View style={{ marginTop: 36, minHeight: 24, alignItems: "center" }}>
          {taslak.gunler.length > 0 && (
            <Word altCizgi onPress={() => setAdim("adet")}>{tr.ortak.devam}</Word>
          )}
        </View>
        {geriSatiri("komutlar")}
      </Belir>
    ),

    adet: (
      <Belir stil={{ width: "100%", alignItems: "center" }}>
        <Text style={[serifBaslik, { fontSize: 24, marginBottom: 8 }]}>{tr.kurulum.adetSoru}</Text>
        <Text style={[dimNot, { marginBottom: 32, maxWidth: 280 }]}>
          {tr.kurulum.adetNot(GUNLUK_TAVAN)}
          {mevcutToplam > 0 ? tr.kurulum.adetDigerPaketler(mevcutToplam) : ""}
        </Text>
        {kalan <= 0 ? (
          <>
            <Text style={{ fontFamily: font.sans, fontSize: 14, color: renk.faint, textAlign: "center", marginBottom: 32 }}>
              {tr.kurulum.tavanDolu}
            </Text>
            {onVazgec && (
              <Word ton={renk.dim} boyut={12} onPress={onVazgec}>{tr.ortak.tamam}</Word>
            )}
          </>
        ) : (
          <Choice
            secenekler={Array.from({ length: kalan }, (_, i) => tr.kurulum.adetSecenek(i))}
            bekleme={700}
            onSec={(secim) => {
              const adet =
                Array.from({ length: kalan }, (_, i) => tr.kurulum.adetSecenek(i)).indexOf(secim) + 1;
              setTaslak((t) => ({ ...t, adet }));
              setAdim("pencere");
            }}
          />
        )}
        {geriSatiri("gunler")}
      </Belir>
    ),

    pencere: (
      <Belir stil={{ width: "100%", alignItems: "center" }}>
        <Text style={[serifBaslik, { fontSize: 24, marginBottom: 40 }]}>{tr.kurulum.pencereSoru}</Text>
        <Choice
          secenekler={tr.kurulum.pencereEtiketleri}
          bekleme={700}
          onSec={(secim) => {
            const i = tr.kurulum.pencereEtiketleri.indexOf(
              secim as (typeof tr.kurulum.pencereEtiketleri)[number]
            );
            setTaslak((t) => ({ ...t, pencere: i, pencereGun: null }));
            setAdim("ozet");
          }}
        />
        <View style={{ marginTop: 36 }}>
          <Word
            ton={renk.faint}
            boyut={12}
            onPress={() => {
              setTaslak((t) => ({
                ...t,
                pencere: null,
                pencereGun: Object.fromEntries(t.gunler.map((g) => [g, 1])),
              }));
              setAdim("pencereGun");
            }}
          >
            {tr.kurulum.gunBazliIstiyorum}
          </Word>
        </View>
        {geriSatiri("adet")}
      </Belir>
    ),

    pencereGun: (
      <Belir stil={{ width: "100%", alignItems: "center" }}>
        <Text style={[serifBaslik, { fontSize: 24, marginBottom: 8 }]}>{tr.kurulum.pencereGunBaslik}</Text>
        <Text style={[dimNot, { marginBottom: 32 }]}>{tr.kurulum.pencereGunNot}</Text>
        <View style={{ alignItems: "center", gap: 16, marginBottom: 40 }}>
          {taslak.gunler.map((g) => (
            <Pressable
              key={g}
              hitSlop={6}
              onPress={() =>
                setTaslak((t) => ({
                  ...t,
                  pencereGun: {
                    ...t.pencereGun,
                    [g]: ((t.pencereGun?.[g] ?? 1) + 1) % tr.kurulum.pencereEtiketleri.length,
                  },
                }))
              }
              style={{ flexDirection: "row", alignItems: "baseline", gap: 16 }}
            >
              <Text style={{ fontFamily: font.serif, fontSize: 18, color: renk.ink, width: 42, textAlign: "right" }}>
                {tr.gunKisa[g]}
              </Text>
              <Text
                style={{
                  fontFamily: font.sans,
                  fontSize: 14,
                  color: renk.sun,
                  borderBottomWidth: 1,
                  borderStyle: "dashed",
                  borderBottomColor: renk.line,
                  paddingBottom: 2,
                }}
              >
                {tr.kurulum.pencereEtiketleri[taslak.pencereGun?.[g] ?? 1]}
              </Text>
            </Pressable>
          ))}
        </View>
        <Word altCizgi onPress={() => setAdim("ozet")}>{tr.ortak.tamam}</Word>
        {geriSatiri("pencere")}
      </Belir>
    ),

    ozet: (
      <Belir stil={{ width: "100%", maxWidth: 290, alignItems: "center" }}>
        <Horizon salinim />
        <Text style={[serifBaslik, { fontSize: 20, lineHeight: 30, marginBottom: 8 }]}>
          <Text style={{ color: renk.sun }}>{taslak.ad}</Text> ·{" "}
          {taslak.gunler.length === 7
            ? tr.kurulum.ozetHerGun
            : taslak.gunler.map((g) => tr.gunKisa[g]).join(" ")}
        </Text>
        <Text style={{ fontFamily: font.sans, fontSize: 14, lineHeight: 22, color: renk.faint, textAlign: "center", marginBottom: 32 }}>
          {tr.kurulum.ozetSatir(
            taslak.adet ?? 1,
            taslak.pencereGun
              ? tr.kurulum.gunBazliEtiket
              : tr.kurulum.ozetPencereArasinda(tr.kurulum.pencereEtiketleri[taslak.pencere ?? 1]),
            taslak.komutlar.length
          )}
        </Text>
        <Text style={[dimNot, { marginBottom: 40 }]}>{tr.kurulum.ozetKanit}</Text>
        <Word
          altCizgi
          onPress={() =>
            onBitti({
              paketId: taslak.paketId!,
              ad: taslak.ad,
              komutlar: taslak.komutlar,
              gunler: taslak.gunler,
              adet: taslak.adet ?? 1,
              pencere: taslak.pencere,
              pencereGun: taslak.pencereGun,
            })
          }
        >
          {tr.kurulum.baslasin}
        </Word>
        {geriSatiri("pencere")}
      </Belir>
    ),
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
      <View key={adim} style={{ width: "100%", alignItems: "center" }}>
        {sayfalar[adim]}
      </View>
    </View>
  );
}
