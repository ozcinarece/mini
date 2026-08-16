import React from "react";
import { Text, View } from "react-native";
import { GUNLUK_TAVAN } from "../data/paketler";
import { tr } from "../i18n/tr";
import { font, renk } from "../theme";

// Geçmiş — veri ekranı kuralı: süs yok, sayı konuşur.
// Suçluluk sözlüğü yok: boş gün kırmızı değil, sadece boş.
type Props = {
  gunler: number[]; // son N günün kanıt sayıları, eskiden yeniye (bugün dahil)
};

export function Gecmis({ gunler }: Props) {
  const toplam = gunler.reduce((a, b) => a + b, 0);
  const doluGun = gunler.filter((n) => n > 0).length;

  return (
    <View style={{ width: "100%", maxWidth: 320, alignItems: "center", alignSelf: "center" }}>
      <Text style={{ fontFamily: font.serif, fontSize: 24, color: renk.ink, marginBottom: 4 }}>
        {tr.gecmis.baslik}
      </Text>
      <Text style={{ fontFamily: font.sans, fontSize: 12, color: renk.dim, marginBottom: 48 }}>
        {tr.gecmis.altBaslik(gunler.length, toplam)}
      </Text>

      {/* gün sütunları: her nokta bir "yaptım" (tavan 5); bugün parlak, geçmiş soluk */}
      <View style={{ width: "100%", maxWidth: 300 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            height: 52,
          }}
        >
          {gunler.map((n, i) => {
            const bugunMu = i === gunler.length - 1;
            return (
              <View key={i} style={{ flexDirection: "column-reverse", alignItems: "center", gap: 4 }}>
                {n === 0 && bugunMu && (
                  <View
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: renk.faint,
                    }}
                  />
                )}
                {Array.from({ length: Math.min(n, GUNLUK_TAVAN) }).map((_, j) => (
                  <View
                    key={j}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 4,
                      backgroundColor: renk.sun,
                      opacity: bugunMu ? 1 : 0.55,
                    }}
                  />
                ))}
              </View>
            );
          })}
        </View>
        <View style={{ borderTopWidth: 1, borderTopColor: renk.line, marginTop: 8 }} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
          <Text style={{ fontFamily: font.sans, fontSize: 12, color: renk.dim }}>
            {tr.gecmis.solEtiket}
          </Text>
          <Text style={{ fontFamily: font.sans, fontSize: 12, color: renk.sun }}>
            {tr.gecmis.sagEtiket}
          </Text>
        </View>
      </View>

      <Text style={{ fontFamily: font.sans, fontSize: 14, color: renk.faint, textAlign: "center", marginTop: 40 }}>
        {tr.gecmis.oran(gunler.length, doluGun)}
      </Text>
      <Text style={{ fontFamily: font.sans, fontSize: 12, color: renk.dim, textAlign: "center", marginTop: 8 }}>
        {tr.gecmis.kapanis}
      </Text>
    </View>
  );
}
