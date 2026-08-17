// Bahçe varlıkları — KOD-ÇİZİMİ YER TUTUCULAR.
// Gemini sprite'ları (assets/bahce/) geldikçe buradaki çizimler PNG'lerle değişecek;
// bileşen arayüzü (varlik id + asama) sabit kalır.

import React from "react";
import Svg, { Circle, Ellipse, G, Path, Rect } from "react-native-svg";
import { BAHCE_KATALOG } from "../../data/bahce-katalog";
import { kategoriBul } from "../../data/kategoriler";

const Golge = ({ w = 30 }: { w?: number }) => (
  <Ellipse cx={0} cy={2} rx={w / 2} ry={w / 6.5} fill="#41502F" opacity={0.14} />
);

export const Tumsek = () => (
  <G>
    <Golge w={20} />
    <Ellipse cx={0} cy={-1} rx={10} ry={5} fill="#8A6B4A" />
    <Ellipse cx={0} cy={-3} rx={6} ry={3} fill="#9C7B57" />
  </G>
);

export const Filiz = () => (
  <G>
    <Golge w={18} />
    <Path d="M0 0 L0 -11" stroke="#5F8138" strokeWidth={2.6} strokeLinecap="round" />
    <Ellipse cx={-5} cy={-10} rx={6} ry={3} fill="#7CA24D" transform="rotate(-28 -5 -10)" />
    <Ellipse cx={5} cy={-12} rx={6} ry={3} fill="#8DB35E" transform="rotate(24 5 -12)" />
  </G>
);

// jenerik kategori çiçeği: renk parametreli (gelincik/unutma beni/menekşe/kadife)
function RenkCicek({ s, renk }: { s: number; renk: string }) {
  if (s === 0) return <Tumsek />;
  if (s === 1) return <Filiz />;
  if (s === 2)
    return (
      <G>
        <Golge w={20} />
        <Path d="M0 0 L0 -16" stroke="#5F8138" strokeWidth={2.6} strokeLinecap="round" />
        <Ellipse cx={-5} cy={-8} rx={6} ry={3} fill="#7CA24D" transform="rotate(-28 -5 -8)" />
        <Circle cx={0} cy={-19} r={4.5} fill={renk} />
      </G>
    );
  return (
    <G>
      <Golge w={24} />
      <Path d="M0 0 L0 -14" stroke="#5F8138" strokeWidth={2.8} strokeLinecap="round" />
      <Ellipse cx={-6} cy={-8} rx={7} ry={3.2} fill="#7CA24D" transform="rotate(-26 -6 -8)" />
      <Ellipse cx={6} cy={-11} rx={7} ry={3.2} fill="#8DB35E" transform="rotate(22 6 -11)" />
      {[0, 72, 144, 216, 288].map((a) => (
        <Ellipse
          key={a}
          cx={0}
          cy={-24}
          rx={4}
          ry={6.4}
          fill={renk}
          transform={`rotate(${a} 0 -19)`}
        />
      ))}
      <Circle cx={0} cy={-19} r={3.8} fill="#F6E3A8" />
    </G>
  );
}

function Aycicegi({ s }: { s: number }) {
  if (s === 0) return <Tumsek />;
  if (s === 1) return <Filiz />;
  if (s === 2)
    return (
      <G>
        <Golge w={20} />
        <Path d="M0 0 C 1 -10 -1 -16 0 -22" stroke="#5F8138" strokeWidth={3} fill="none" strokeLinecap="round" />
        <Ellipse cx={-6} cy={-11} rx={7} ry={3.4} fill="#7CA24D" transform="rotate(-26 -6 -11)" />
        <Circle cx={0} cy={-26} r={6} fill="#C9A544" />
      </G>
    );
  return (
    <G>
      <Golge w={24} />
      <Path d="M0 0 C 1 -12 -1 -22 0 -30" stroke="#5F8138" strokeWidth={3.2} fill="none" strokeLinecap="round" />
      <Ellipse cx={-7} cy={-13} rx={8} ry={3.8} fill="#7CA24D" transform="rotate(-26 -7 -13)" />
      <Ellipse cx={7} cy={-18} rx={8} ry={3.8} fill="#8DB35E" transform="rotate(24 7 -18)" />
      {Array.from({ length: 11 }).map((_, i) => (
        <Ellipse
          key={i}
          cx={0}
          cy={-43}
          rx={4}
          ry={7.6}
          fill={i % 2 ? "#F2C14E" : "#F6CF6B"}
          transform={`rotate(${i * 32.7} 0 -33)`}
        />
      ))}
      <Circle cx={0} cy={-33} r={7} fill="#7A5230" />
    </G>
  );
}

function Lavanta({ s }: { s: number }) {
  if (s === 0) return <Tumsek />;
  if (s === 1) return <Filiz />;
  const sap = (dx: number, h: number) => (
    <G key={dx} transform={`translate(${dx} 0)`}>
      <Path d={`M0 0 L0 ${-h}`} stroke="#6E8F4B" strokeWidth={2.4} strokeLinecap="round" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Ellipse key={i} cx={0} cy={-h - 2 - i * 5} rx={3.6 - i * 0.4} ry={3} fill="#9D8DF2" />
      ))}
    </G>
  );
  return (
    <G>
      <Golge w={24} />
      {sap(-8, 12)}
      {sap(0, 17)}
      {sap(8, 13)}
    </G>
  );
}

function Gul({ s }: { s: number }) {
  if (s === 0) return <Tumsek />;
  if (s === 1) return <Filiz />;
  return (
    <G>
      <Golge w={24} />
      <Path d="M0 0 L 0 -18" stroke="#5F8138" strokeWidth={3} strokeLinecap="round" />
      <Ellipse cx={-6} cy={-9} rx={7} ry={3.4} fill="#7CA24D" transform="rotate(-28 -6 -9)" />
      <Circle cx={0} cy={-25} r={8} fill="#E05A7E" />
      <Circle cx={0} cy={-25} r={5} fill="#EB7D9A" />
      <Circle cx={0} cy={-25} r={2.4} fill="#F2A5B8" />
    </G>
  );
}

function Domates({ s }: { s: number }) {
  if (s === 0) return <Tumsek />;
  if (s === 1) return <Filiz />;
  const kazik = <Path d="M0 2 L0 -30" stroke="#A97B4F" strokeWidth={3} strokeLinecap="round" />;
  if (s === 2)
    return (
      <G>
        <Golge w={24} />
        {kazik}
        <Path d="M0 -4 C -8 -10 -7 -20 0 -26 C 7 -20 8 -10 0 -4" fill="#6FA84F" />
        <Circle cx={-4} cy={-14} r={3} fill="#8FCB69" />
        <Circle cx={5} cy={-19} r={3} fill="#8FCB69" />
      </G>
    );
  return (
    <G>
      <Golge w={26} />
      {kazik}
      <Path d="M0 -4 C -9 -10 -8 -22 0 -28 C 8 -22 9 -10 0 -4" fill="#6FA84F" />
      <Circle cx={-5} cy={-12} r={4.2} fill="#E05A4E" />
      <Circle cx={6} cy={-17} r={4.2} fill="#E86A5E" />
      <Circle cx={0} cy={-23} r={4.2} fill="#E05A4E" />
      <Circle cx={-6.5} cy={-13.5} r={1.4} fill="#F28C80" />
    </G>
  );
}

function Kabak({ s }: { s: number }) {
  if (s === 0) return <Tumsek />;
  if (s === 1) return <Filiz />;
  if (s === 2)
    return (
      <G>
        <Golge w={26} />
        <Path d="M-12 0 Q 0 -14 12 -2" stroke="#6E8F4B" strokeWidth={3} fill="none" strokeLinecap="round" />
        <Ellipse cx={-10} cy={-2} rx={7} ry={3.4} fill="#7CA24D" transform="rotate(-16 -10 -2)" />
        <Circle cx={10} cy={-4} r={5} fill="#8FCB69" />
      </G>
    );
  return (
    <G>
      <Golge w={32} />
      <Path d="M-14 -2 Q -2 -16 10 -8" stroke="#6E8F4B" strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <Ellipse cx={0} cy={-8} rx={13} ry={10} fill="#E8913C" />
      <Ellipse cx={-5} cy={-8} rx={4} ry={9.4} fill="#F2A552" />
      <Ellipse cx={6} cy={-8} rx={3.4} ry={9} fill="#D97F2E" />
      <Path d="M0 -17 L 0 -21" stroke="#6E8F4B" strokeWidth={3.4} strokeLinecap="round" />
    </G>
  );
}

const Bank = () => (
  <G>
    <Golge w={44} />
    <Rect x={-19} y={-16} width={38} height={5} rx={2} fill="#BC8E60" />
    <Rect x={-19} y={-24} width={38} height={4} rx={2} fill="#A97B4F" />
    <Rect x={-16} y={-11} width={4} height={11} rx={1.6} fill="#8F6642" />
    <Rect x={12} y={-11} width={4} height={11} rx={1.6} fill="#8F6642" />
  </G>
);

const KusBanyosu = () => (
  <G>
    <Golge w={30} />
    <Path d="M-4 0 L -3 -12 L 3 -12 L 4 0 Z" fill="#B9B3A6" />
    <Ellipse cx={0} cy={-14} rx={13} ry={5} fill="#CFC9BC" />
    <Ellipse cx={0} cy={-15} rx={9} ry={3.2} fill="#8FD0E0" />
    <Ellipse cx={-2} cy={-15.6} rx={3} ry={1} fill="#C6EAF2" />
  </G>
);

const Fener = () => (
  <G>
    <Golge w={20} />
    <Circle cx={0} cy={-26} r={13} fill="#FFD98A" opacity={0.45} />
    <Rect x={-2} y={-19} width={4} height={19} rx={2} fill="#6B5A4A" />
    <Rect x={-6} y={-30} width={12} height={12} rx={3.4} fill="#4E4238" />
    <Rect x={-3.8} y={-27.8} width={7.6} height={7.6} rx={2} fill="#FFD98A" />
  </G>
);

const Cit = () => {
  const direk = (x: number, y: number) => (
    <G key={x} transform={`translate(${x} ${y})`}>
      <Rect x={-2.2} y={-15} width={4.4} height={15} rx={1.8} fill="#A97B4F" />
      <Rect x={-2.2} y={-15} width={1.8} height={15} fill="#BC8E60" />
    </G>
  );
  return (
    <G>
      {direk(-30, 15)}
      {direk(0, 0)}
      {direk(30, -15)}
      <Path d="M-30 7 L 30 -23" stroke="#A97B4F" strokeWidth={3.8} strokeLinecap="round" />
      <Path d="M-30 11 L 30 -19" stroke="#8F6642" strokeWidth={3.8} strokeLinecap="round" />
    </G>
  );
};

export const Yabani = ({ i }: { i: number }) => (
  <G opacity={0.85}>
    {[
      [-14, 2],
      [8, -4],
      [-2, 8],
    ].map(([x, y], j) => (
      <G key={j} transform={`translate(${x} ${y})`}>
        <Path
          d="M0 0 C -3 -6 -1 -9 0 -12 M0 0 C 3 -5 4 -8 3 -11 M0 0 C -1 -7 1 -10 -2 -13"
          stroke={j % 2 ? "#7E8F5B" : "#8FA06B"}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
      </G>
    ))}
    {i % 3 === 0 && <Circle cx={10} cy={4} r={4} fill="#9C8A70" />}
  </G>
);

// merkezi çizici: varlık id + aşama → yer tutucu çizim
export function VarlikCiz({ varlik, asama }: { varlik: string; asama: number | null }) {
  const s = asama ?? 0;
  switch (varlik) {
    case "aycicegi":
      return <Aycicegi s={s} />;
    case "lavanta":
      return <Lavanta s={s} />;
    case "gul":
      return <Gul s={s} />;
    case "domates":
      return <Domates s={s} />;
    case "kabak":
      return <Kabak s={s} />;
    case "bank":
      return <Bank />;
    case "kusbanyosu":
      return <KusBanyosu />;
    case "fener":
      return <Fener />;
    case "cit":
      return <Cit />;
    default: {
      const kalem = BAHCE_KATALOG[varlik];
      const renk = kalem?.aile ? kategoriBul(kalem.aile).renk : "#E9B93C";
      return <RenkCicek s={s} renk={renk} />;
    }
  }
}

// dükkân kartı ikonu: olgun hali küçük kutuda
export function MiniIkon({ varlik }: { varlik: string }) {
  const kalem = BAHCE_KATALOG[varlik];
  return (
    <Svg width={40} height={42} viewBox="-22 -40 44 46">
      <VarlikCiz varlik={varlik} asama={kalem?.maxAsama ?? null} />
    </Svg>
  );
}

// onboarding mini çiçeği (önizleme + renk-alan ekranı)
export function MiniCicek({ renk, filiz = false }: { renk: string; filiz?: boolean }) {
  return (
    <G>
      <Path d="M0 0 L0 -11" stroke="#5F8138" strokeWidth={2.4} strokeLinecap="round" />
      {filiz ? (
        <>
          <Ellipse cx={-4} cy={-10} rx={5} ry={2.6} fill="#7CA24D" transform="rotate(-28 -4 -10)" />
          <Ellipse cx={4} cy={-12} rx={5} ry={2.6} fill="#8DB35E" transform="rotate(24 4 -12)" />
        </>
      ) : (
        <>
          {[0, 72, 144, 216, 288].map((a) => (
            <Ellipse key={a} cx={0} cy={-17} rx={3.4} ry={5.4} fill={renk} transform={`rotate(${a} 0 -12)`} />
          ))}
          <Circle cx={0} cy={-12} r={3.2} fill="#F6E3A8" />
        </>
      )}
    </G>
  );
}
