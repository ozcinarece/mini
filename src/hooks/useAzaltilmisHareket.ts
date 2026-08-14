import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

// prefers-reduced-motion karşılığı: açıksa animasyonlar atlanır (CLAUDE.md tasarım kuralı)
export function useAzaltilmisHareket(): boolean {
  const [azaltilmis, setAzaltilmis] = useState(false);

  useEffect(() => {
    let aktif = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (aktif) setAzaltilmis(v);
    });
    const abonelik = AccessibilityInfo.addEventListener("reduceMotionChanged", setAzaltilmis);
    return () => {
      aktif = false;
      abonelik.remove();
    };
  }, []);

  return azaltilmis;
}
