// Canlı bahçe önizlemesi (onboarding): seçilen kategoriler renk kümeleri olarak belirir.
import React from "react";
import Svg, { Ellipse, G, Polygon, Text as SvgText } from "react-native-svg";
import { KATEGORILER, KategoriId } from "../../data/kategoriler";
import { tr } from "../../i18n/tr";
import { MiniCicek } from "./varliklar";

// her kategorinin önizlemedeki küme konumu
const YER: Record<KategoriId, [number, number]> = {
  duzen: [58, 46],
  gelisim: [128, 30],
  huzur: [186, 52],
  odak: [92, 74],
  isler: [160, 84],
};

type Props = {
  secim: Partial<Record<KategoriId, string[]>>;
  filizler?: boolean;
  genis?: boolean;
};

export function Onizleme({ secim, filizler = false, genis = false }: Props) {
  const secili = KATEGORILER.filter((k) => (secim[k.id]?.length ?? 0) > 0);
  return (
    <Svg
      viewBox="0 0 240 130"
      style={{ width: "100%", maxWidth: genis ? 340 : 250, alignSelf: "center" }}
    >
      {/* zemin: izo çim adası */}
      <Ellipse cx={120} cy={122} rx={112} ry={9} fill="#41502F" opacity={0.12} />
      <Polygon points="120,18 232,74 120,118 8,74" fill="#A8CE74" />
      <Polygon points="120,26 218,74 120,110 22,74" fill="#B5D97E" />
      <Polygon points="8,74 120,118 120,127 8,83" fill="#8A6B4A" />
      <Polygon points="232,74 120,118 120,127 232,83" fill="#75573B" />
      {secili.length === 0 && (
        <SvgText
          x={120}
          y={76}
          textAnchor="middle"
          fontSize={11}
          fontWeight="800"
          fill="#7E9558"
        >
          {tr.onboarding.onizlemeBos}
        </SvgText>
      )}
      {secili.map((k) =>
        k.alt.map(
          (_, i) =>
            (secim[k.id]?.length ?? 0) > i && (
              <G
                key={`${k.id}-${i}`}
                transform={`translate(${YER[k.id][0] + (i % 2 ? 14 : -6) + (i > 1 ? 6 : 0)} ${
                  YER[k.id][1] + (i % 3) * 7
                }) scale(${0.9 + (i % 2) * 0.2})`}
              >
                <MiniCicek renk={k.renk} filiz={filizler} />
              </G>
            )
        )
      )}
    </Svg>
  );
}
