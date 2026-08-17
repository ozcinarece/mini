import React from "react";
import { Pressable, Text, View } from "react-native";
import { bahce, bahceFont } from "../../theme";

// Bahçe dili ana butonu: yumuşak hap, alt gölge çizgisi (prototipteki 3D basma hissi)
type Props = {
  children: React.ReactNode;
  onPress: () => void;
  soluk?: boolean; // ghost varyant
  renk?: string;
  golgeRenk?: string;
};

export function BahceButon({ children, onPress, soluk = false, renk = bahce.yesil, golgeRenk = bahce.koyu }: Props) {
  if (soluk) {
    return (
      <Pressable onPress={onPress} hitSlop={8}>
        <Text style={{ fontFamily: bahceFont.govdeKalin, fontSize: 12.5, color: bahce.faint, textAlign: "center" }}>
          {children}
        </Text>
      </Pressable>
    );
  }
  return (
    <Pressable onPress={onPress} style={{ alignSelf: "center" }}>
      <View
        style={{
          backgroundColor: renk,
          borderRadius: 999,
          paddingVertical: 13,
          paddingHorizontal: 44,
          borderBottomWidth: 5,
          borderBottomColor: golgeRenk,
        }}
      >
        <Text style={{ fontFamily: bahceFont.baslik, fontSize: 15.5, color: "#FFFFFF", textAlign: "center" }}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}
