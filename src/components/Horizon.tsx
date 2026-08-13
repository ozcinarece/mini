import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import { useAzaltilmisHareket } from "../hooks/useAzaltilmisHareket";
import { renk, sure } from "../theme";

// İmza metafor: ufuk + güneş. Görev yapılınca güneş 1.6-1.8sn'de doğar.
// KURAL: metafor sadece büyük anda; veri ekranlarında süs yok.
type Props = {
  dogmus?: boolean;
  ay?: boolean;
  boyut?: number;
  salinim?: boolean; // beklerken hafif yukarı-aşağı süzülme
};

export function Horizon({ dogmus = false, ay = false, boyut = 26, salinim = false }: Props) {
  const azaltilmis = useAzaltilmisHareket();
  const konum = useRef(new Animated.Value(dogmus ? 4 : boyut + 4)).current;
  const salinimDeger = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (azaltilmis) {
      konum.setValue(dogmus ? 4 : boyut + 4);
      return;
    }
    Animated.timing(konum, {
      toValue: dogmus ? 4 : boyut + 4,
      duration: sure.gunDogumu,
      easing: Easing.bezier(0.25, 0.8, 0.3, 1),
      useNativeDriver: false,
    }).start();
  }, [dogmus, azaltilmis, boyut, konum]);

  useEffect(() => {
    if (!salinim || dogmus || azaltilmis) return;
    const dongu = Animated.loop(
      Animated.sequence([
        Animated.timing(salinimDeger, { toValue: -2.5, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(salinimDeger, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    );
    dongu.start();
    return () => dongu.stop();
  }, [salinim, dogmus, azaltilmis, salinimDeger]);

  return (
    <View
      style={{
        height: boyut + 18,
        overflow: "hidden",
        maxWidth: 240,
        width: "100%",
        alignSelf: "center",
        marginVertical: 32,
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          left: "50%",
          marginLeft: -boyut / 2,
          width: boyut,
          height: boyut,
          borderRadius: boyut / 2,
          top: Animated.add(konum, salinimDeger),
          backgroundColor: ay ? renk.moon : renk.sun,
          shadowColor: ay ? renk.moon : "#E7B189",
          shadowOpacity: dogmus ? (ay ? 0.25 : 0.45) : 0,
          shadowRadius: dogmus ? 15 : 0,
          shadowOffset: { width: 0, height: 0 },
          elevation: dogmus ? 6 : 0,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          borderTopWidth: 1,
          borderTopColor: renk.line,
        }}
      />
    </View>
  );
}
