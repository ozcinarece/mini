import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";
import { useAzaltilmisHareket } from "../hooks/useAzaltilmisHareket";
import { sure } from "../theme";

// "appear" animasyonu: aşağıdan 10px yükselerek belirir (yavaş, 0.9sn)
type Props = {
  children: React.ReactNode;
  gecikme?: number;
  suresi?: number;
  stil?: ViewStyle;
};

export function Belir({ children, gecikme = 0, suresi = sure.belirme, stil }: Props) {
  const azaltilmis = useAzaltilmisHareket();
  const opaklik = useRef(new Animated.Value(azaltilmis ? 1 : 0)).current;
  const kayma = useRef(new Animated.Value(azaltilmis ? 0 : 10)).current;

  useEffect(() => {
    if (azaltilmis) {
      opaklik.setValue(1);
      kayma.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.timing(opaklik, { toValue: 1, duration: suresi, delay: gecikme, useNativeDriver: true }),
      Animated.timing(kayma, { toValue: 0, duration: suresi, delay: gecikme, useNativeDriver: true }),
    ]).start();
  }, [azaltilmis, gecikme, suresi, opaklik, kayma]);

  return (
    <Animated.View style={[{ opacity: opaklik, transform: [{ translateY: kayma }] }, stil]}>
      {children}
    </Animated.View>
  );
}
