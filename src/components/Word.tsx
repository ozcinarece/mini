import React from "react";
import { Pressable, Text, TextStyle } from "react-native";
import { font, renk } from "../theme";

// Sözcük-eylem: buton yerine kelime (BOŞLUK dili — buton yok)
type Props = {
  children: React.ReactNode;
  onPress: () => void;
  ton?: string;
  boyut?: number;
  serif?: boolean;
  stil?: TextStyle;
};

export function Word({ children, onPress, ton = renk.sun, boyut = 16, serif = false, stil }: Props) {
  return (
    <Pressable onPress={onPress} hitSlop={10}>
      <Text
        style={[
          {
            fontFamily: serif ? font.serif : font.sansMedium,
            fontSize: boyut,
            color: ton,
            letterSpacing: 0.6,
            textAlign: "center",
          },
          stil,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}
