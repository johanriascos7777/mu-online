// src/components/atoms/CharacterSilhouette/index.tsx
//
// Átomo — siluetas SVG de los personajes, idénticas al diseño HTML original
// Usa react-native-svg para renderizar SVG en React Native
//
// Instalación si no está: npx expo install react-native-svg

import Svg, {
  Rect, Polygon, Ellipse, Circle, Path, Line,
} from 'react-native-svg';
import { View } from 'react-native';
import type { CharacterClassName } from '../ClassLabel';

export interface CharacterSilhouetteProps {
  characterClass: CharacterClassName;
  size?: 'card' | 'combat'; // card=120x160, combat=90x130
}

const SIZES = {
  card:   { width: 120, height: 160 },
  combat: { width: 90,  height: 130 },
};

// ── Dark Knight SVG ───────────────────────────────────────────
function KnightSvg({ width, height }: { width: number; height: number }) {
  const fill = '#c0392b';
  return (
    <Svg width={width} height={height} viewBox="0 0 80 120" fill="none">
      {/* Body */}
      <Rect x="28" y="45" width="24" height="35" rx="2" fill={fill} opacity={0.9} />
      {/* Head with helmet */}
      <Rect x="27" y="20" width="26" height="22" rx="3" fill={fill} opacity={0.9} />
      {/* Helmet crest */}
      <Polygon points="32,20 40,10 48,20" fill={fill} opacity={0.7} />
      {/* Shoulders (pauldrons) */}
      <Rect x="14" y="44" width="14" height="10" rx="3" fill={fill} opacity={0.8} />
      <Rect x="52" y="44" width="14" height="10" rx="3" fill={fill} opacity={0.8} />
      {/* Arms */}
      <Rect x="15" y="54" width="10" height="22" rx="2" fill={fill} opacity={0.75} />
      <Rect x="55" y="54" width="10" height="22" rx="2" fill={fill} opacity={0.75} />
      {/* Legs */}
      <Rect x="28" y="80" width="10" height="28" rx="2" fill={fill} opacity={0.8} />
      <Rect x="42" y="80" width="10" height="28" rx="2" fill={fill} opacity={0.8} />
      {/* Sword — dorado */}
      <Rect x="66" y="30" width="4" height="50" rx="1" fill="#c8a84c" opacity={0.8} />
      <Rect x="60" y="52" width="16" height="4" rx="1" fill="#c8a84c" opacity={0.7} />
      {/* Shield */}
      <Ellipse cx="12" cy="65" rx="7" ry="10" fill={fill} opacity={0.6} />
    </Svg>
  );
}

// ── Dark Wizard SVG ───────────────────────────────────────────
function WizardSvg({ width, height }: { width: number; height: number }) {
  const fill = '#4a90d9';
  return (
    <Svg width={width} height={height} viewBox="0 0 80 120" fill="none">
      {/* Robe */}
      <Polygon points="22,50 58,50 65,108 15,108" fill={fill} opacity={0.75} />
      {/* Body top */}
      <Rect x="26" y="42" width="28" height="18" rx="3" fill={fill} opacity={0.9} />
      {/* Head */}
      <Ellipse cx="40" cy="28" rx="13" ry="14" fill={fill} opacity={0.9} />
      {/* Hat */}
      <Polygon points="28,22 40,0 52,22" fill={fill} opacity={0.9} />
      <Rect x="23" y="21" width="34" height="5" rx="2" fill={fill} opacity={0.8} />
      {/* Staff */}
      <Rect x="62" y="20" width="3" height="75" rx="1" fill="#8ab4d9" opacity={0.9} />
      {/* Orb on staff */}
      <Circle cx="63" cy="18" r="6" fill="#4a90d9" opacity={0.8} />
      <Circle cx="63" cy="18" r="3" fill="#a0d0ff" opacity={0.6} />
      {/* Arms */}
      <Rect x="14" y="50" width="12" height="18" rx="5" fill={fill} opacity={0.7} />
      <Rect x="54" y="50" width="12" height="18" rx="5" fill={fill} opacity={0.7} />
      {/* Magic sparkles */}
      <Circle cx="20" cy="45" r="2" fill="#a0d0ff" opacity={0.6} />
      <Circle cx="55" cy="38" r="2" fill="#a0d0ff" opacity={0.5} />
    </Svg>
  );
}

// ── Elf SVG ───────────────────────────────────────────────────
function ElfSvg({ width, height }: { width: number; height: number }) {
  const fill = '#27ae60';
  return (
    <Svg width={width} height={height} viewBox="0 0 80 120" fill="none">
      {/* Body */}
      <Rect x="28" y="42" width="24" height="40" rx="4" fill={fill} opacity={0.8} />
      {/* Head */}
      <Ellipse cx="40" cy="26" rx="12" ry="13" fill={fill} opacity={0.9} />
      {/* Pointed ears */}
      <Polygon points="28,22 20,16 26,28" fill={fill} opacity={0.9} />
      <Polygon points="52,22 60,16 54,28" fill={fill} opacity={0.9} />
      {/* Hair */}
      <Rect x="28" y="14" width="24" height="8" rx="4" fill={fill} opacity={0.7} />
      {/* Legs */}
      <Rect x="28" y="82" width="10" height="26" rx="3" fill={fill} opacity={0.75} />
      <Rect x="42" y="82" width="10" height="26" rx="3" fill={fill} opacity={0.75} />
      {/* Arms */}
      <Rect x="14" y="44" width="14" height="20" rx="5" fill={fill} opacity={0.7} />
      <Rect x="52" y="44" width="14" height="20" rx="5" fill={fill} opacity={0.7} />
      {/* Bow */}
      <Path d="M 68 25 Q 78 50 68 75" stroke="#27ae60" strokeWidth="2.5" fill="none" opacity={0.9} />
      <Path d="M 68 25 Q 58 50 68 75" stroke="#27ae60" strokeWidth="1" fill="none" opacity={0.5} />
      {/* Arrow */}
      <Line x1="68" y1="50" x2="78" y2="50" stroke="#a0e0a0" strokeWidth="1.5" opacity={0.8} />
      <Polygon points="78,47 84,50 78,53" fill="#a0e0a0" opacity={0.8} />
    </Svg>
  );
}

// ── Color del glow por clase ──────────────────────────────────
const GLOW_COLOR: Record<CharacterClassName, string> = {
  DarkKnight: 'rgba(192,57,43,0.6)',
  DarkWizard: 'rgba(74,144,217,0.6)',
  Elf:        'rgba(39,174,96,0.6)',
};

// ── Componente principal ──────────────────────────────────────
export function CharacterSilhouette({
  characterClass,
  size = 'card',
}: CharacterSilhouetteProps) {
  const { width, height } = SIZES[size];

  const SvgComponent = {
    DarkKnight: KnightSvg,
    DarkWizard: WizardSvg,
    Elf:        ElfSvg,
  }[characterClass];

  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      {/* Glow en el suelo */}
      <View
        style={{
          position:        'absolute',
          bottom:          0,
          alignSelf:       'center',
          width:           80,
          height:          20,
          backgroundColor: GLOW_COLOR[characterClass],
          borderRadius:    40,
          // blur solo disponible en expo con @shopify/react-native-skia
          // por ahora usamos opacity como aproximación
          opacity:         0.5,
        }}
      />
      <SvgComponent width={width} height={height} />
    </View>
  );
}