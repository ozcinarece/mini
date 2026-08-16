import React from "react";
import { View } from "react-native";
import { renk } from "../theme";

// Halkalı çoklu seçim işareti (CLAUDE.md: çoklu seçim asla gömülmez — kendi desenini alır)
export function Ring({ acik }: { acik: boolean }) {
  return (
    <View
      style={{
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: acik ? renk.sun : "transparent",
        borderWidth: 1.5,
        borderColor: acik ? renk.sun : renk.faint,
      }}
    />
  );
}
