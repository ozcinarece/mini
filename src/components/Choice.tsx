import React, { useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { useAzaltilmisHareket } from "../hooks/useAzaltilmisHareket";
import { font, renk, sure } from "../theme";

// Kelime-seçim: seçilen kalır (güneş rengine döner), diğerleri ~1sn'de solar,
// akış kendiliğinden ilerler (BOŞLUK dili — seçenekler kelimedir)
type Props = {
  secenekler: readonly string[];
  onSec: (secim: string) => void;
  bekleme?: number;
};

export function Choice({ secenekler, onSec, bekleme = sure.secimBekleme }: Props) {
  const azaltilmis = useAzaltilmisHareket();
  const [secili, setSecili] = useState<number | null>(null);
  const opaklıklar = useRef(secenekler.map(() => new Animated.Value(1))).current;

  const sec = (i: number) => {
    if (secili !== null) return;
    setSecili(i);
    if (!azaltilmis) {
      secenekler.forEach((_, j) => {
        if (j !== i) {
          Animated.timing(opaklıklar[j], {
            toValue: 0.12,
            duration: sure.secimSolma,
            useNativeDriver: true,
          }).start();
        }
      });
    }
    setTimeout(() => onSec(secenekler[i]), azaltilmis ? 200 : bekleme);
  };

  return (
    <View style={{ alignItems: "center", gap: 20, marginVertical: 8 }}>
      {secenekler.map((metin, i) => (
        <Pressable key={metin} onPress={() => sec(i)} hitSlop={8}>
          <Animated.View style={{ opacity: opaklıklar[i] }}>
            <Text
              style={{
                fontFamily: font.serif,
                fontSize: 18,
                color: secili === i ? renk.sun : renk.ink,
                textAlign: "center",
              }}
            >
              {metin}
            </Text>
          </Animated.View>
        </Pressable>
      ))}
    </View>
  );
}
