import React from "react";
import { Text, View } from "react-native";
import { Word } from "../components/Word";
import { tr } from "../i18n/tr";
import { font, renk } from "../theme";

// Kimlik — büyük sayı konuşur; süs yok. Boş hal: iddia → kanıt daveti.
type Props = {
  kanit: number;
  onBugune: () => void;
};

export function Kimlik({ kanit, onBugune }: Props) {
  return (
    <View style={{ width: "100%", maxWidth: 320, alignItems: "center", alignSelf: "center" }}>
      <Text
        style={{
          fontFamily: font.serif,
          fontSize: 24,
          lineHeight: 36,
          color: renk.ink,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        {tr.kimlik.baslik}
      </Text>
      {kanit > 0 ? (
        <>
          <Text style={{ fontFamily: font.serif, fontSize: 76, lineHeight: 80, color: renk.sun }}>
            {kanit}
          </Text>
          <Text style={{ fontFamily: font.sans, fontSize: 14, color: renk.faint, marginBottom: 12 }}>
            {tr.kimlik.kanit}
          </Text>
          <Text style={{ fontFamily: font.sans, fontSize: 12, color: renk.dim }}>
            {tr.kimlik.altYazi}
          </Text>
        </>
      ) : (
        <>
          <Text
            style={{
              fontFamily: font.serif,
              fontSize: 18,
              lineHeight: 28,
              color: renk.faint,
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            {tr.kimlik.bosIddia}
          </Text>
          <Text style={{ fontFamily: font.sans, fontSize: 12, color: renk.dim, marginBottom: 32 }}>
            {tr.kimlik.bosNot}
          </Text>
          <Word onPress={onBugune}>{tr.kimlik.bugunGit}</Word>
        </>
      )}
    </View>
  );
}
