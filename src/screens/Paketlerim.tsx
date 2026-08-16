import React from "react";
import { Text, View } from "react-native";
import { Word } from "../components/Word";
import { GUNLUK_TAVAN } from "../data/paketler";
import type { Abonelik } from "../db/depo";
import { tr } from "../i18n/tr";
import { font, renk } from "../theme";

// Paketlerim — abonelik listesi + günlük ses sayacı. Veri ekranı: süs yok.
type Props = {
  abonelikler: Abonelik[];
  toplam: number; // aktif aboneliklerin günlük adet toplamı
  onAktifDegistir: (id: number, aktif: boolean) => void;
  onYeni: () => void;
};

export function Paketlerim({ abonelikler, toplam, onAktifDegistir, onYeni }: Props) {
  return (
    <View style={{ width: "100%", maxWidth: 320, alignItems: "center", alignSelf: "center" }}>
      <Text style={{ fontFamily: font.serif, fontSize: 24, color: renk.ink, marginBottom: 4 }}>
        {tr.paketler.baslik}
      </Text>
      <Text style={{ fontFamily: font.sans, fontSize: 12, color: renk.dim, marginBottom: 40 }}>
        {tr.paketler.sesSayaci(toplam, GUNLUK_TAVAN)}
      </Text>
      <View style={{ alignItems: "center", gap: 28, marginBottom: 48 }}>
        {abonelikler.map((a) => (
          <View key={a.id} style={{ alignItems: "center", opacity: a.aktif ? 1 : 0.45 }}>
            <Text style={{ fontFamily: font.serif, fontSize: 18, color: renk.ink, marginBottom: 4 }}>
              {a.ad}
            </Text>
            <Text style={{ fontFamily: font.sans, fontSize: 12, color: renk.dim, marginBottom: 8 }}>
              {a.gunler.length === 7
                ? tr.kurulum.ozetHerGun
                : a.gunler.map((g) => tr.gunKisa[g]).join(" ")}
              {" · "}
              {tr.paketler.gundeAdet(a.adet)}
              {" · "}
              {a.pencereGun ? tr.kurulum.gunBazliEtiket : tr.kurulum.pencereEtiketleri[a.pencere ?? 1]}
            </Text>
            <Word ton={renk.faint} boyut={12} onPress={() => onAktifDegistir(a.id, !a.aktif)}>
              {a.aktif ? tr.paketler.sessizeAl : tr.paketler.sesiAc}
            </Word>
          </View>
        ))}
      </View>
      <Word altCizgi onPress={onYeni}>{tr.paketler.yeniPaket}</Word>
    </View>
  );
}
