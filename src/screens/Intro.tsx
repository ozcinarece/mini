import React from "react";
import { Pressable, Text, View } from "react-native";
import { Belir } from "../components/Belir";
import { Horizon } from "../components/Horizon";
import { tr } from "../i18n/tr";
import { bosluk, font, renk } from "../theme";

// Karşılama: iki nefes, sonra kurulum sihirbazı (v28)
type Props = {
  adim: number;
  onIleri: () => void;
};

export function Intro({ adim, onIleri }: Props) {
  return (
    <Pressable
      onPress={onIleri}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
      }}
    >
      <Belir key={adim} stil={{ maxWidth: bosluk.maxGenislik, alignItems: "center" }}>
        {adim === 0 ? (
          <>
            <Horizon salinim boyut={30} />
            <Text
              style={{
                fontFamily: font.serif,
                fontSize: 20,
                lineHeight: 36,
                color: renk.ink,
                textAlign: "center",
              }}
            >
              {tr.intro.birinciSatir}
            </Text>
          </>
        ) : (
          <>
            <Text
              style={{
                fontFamily: font.serif,
                fontSize: 20,
                lineHeight: 36,
                color: renk.ink,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              {tr.intro.ikinciBaslik}
            </Text>
            <Text
              style={{
                fontFamily: font.sans,
                fontSize: 14,
                lineHeight: 22,
                color: renk.faint,
                textAlign: "center",
              }}
            >
              {tr.intro.ikinciAciklama}
            </Text>
          </>
        )}
      </Belir>

      <Text
        style={{
          fontFamily: font.sans,
          fontSize: 12,
          color: renk.dim,
          letterSpacing: 1,
          marginTop: 64,
        }}
      >
        {tr.ortak.dokun}
      </Text>
    </Pressable>
  );
}
