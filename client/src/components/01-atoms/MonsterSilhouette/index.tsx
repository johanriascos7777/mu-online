// src/components/01-atoms/MonsterSilhouette/index.tsx
//
// Átomo DUMB — silueta SVG del monstruo
// Por ahora BudgeDragon y Goblin — igual que el diseño HTML

import Svg, { Ellipse, Circle, Polygon, Rect, Path } from 'react-native-svg';
import { View } from 'react-native';

export type MonsterType = 'BudgeDragon' | 'Goblin';

export interface MonsterSilhouetteProps {
  monsterType: MonsterType;
  size?: 'card' | 'combat';
}

const SIZES = {
  card:   { width: 100, height: 130 },
  combat: { width: 100, height: 130 },
};

// ── Budge Dragon SVG — del diseño HTML original ───────────────
function BudgeDragonSvg({ width, height }: { width: number; height: number }) {
  const fill = '#6a4a8a';
  return (
    <Svg width={width} height={height} viewBox="0 0 90 120" fill="none">
      {/* Body */}
      <Ellipse cx="45" cy="70" rx="22" ry="28" fill={fill} opacity={0.85} />
      {/* Head */}
      <Ellipse cx="45" cy="35" rx="18" ry="16" fill={fill} opacity={0.85} />
      {/* Snout */}
      <Ellipse cx="45" cy="48" rx="10" ry="7" fill={fill} opacity={0.8} />
      {/* Eyes — rojos brillantes */}
      <Circle cx="37" cy="30" r="4" fill="#ff4444" opacity={0.9} />
      <Circle cx="53" cy="30" r="4" fill="#ff4444" opacity={0.9} />
      <Circle cx="37" cy="30" r="2" fill="#ff0000" />
      <Circle cx="53" cy="30" r="2" fill="#ff0000" />
      {/* Horns */}
      <Polygon points="34,22 28,5 40,18"  fill={fill} opacity={0.9} />
      <Polygon points="56,22 62,5 50,18"  fill={fill} opacity={0.9} />
      {/* Wings */}
      <Path d="M 22 60 Q 5 40 10 70 Q 15 80 22 75 Z"  fill={fill} opacity={0.6} />
      <Path d="M 68 60 Q 85 40 80 70 Q 75 80 68 75 Z" fill={fill} opacity={0.6} />
      {/* Legs */}
      <Rect x="30" y="95" width="12" height="20" rx="3" fill={fill} opacity={0.8} />
      <Rect x="48" y="95" width="12" height="20" rx="3" fill={fill} opacity={0.8} />
      {/* Tail */}
      <Path d="M 60 85 Q 80 90 85 108" stroke="#6a4a8a" strokeWidth="6" strokeLinecap="round" opacity={0.7} />
      {/* Claws */}
      <Polygon points="30,115 26,120 34,120" fill="#9a7aaa" opacity={0.8} />
      <Polygon points="48,115 44,120 52,120" fill="#9a7aaa" opacity={0.8} />
    </Svg>
  );
}

// ── Goblin SVG ────────────────────────────────────────────────
function GoblinSvg({ width, height }: { width: number; height: number }) {
  const fill = '#4a7a3a';
  return (
    <Svg width={width} height={height} viewBox="0 0 90 120" fill="none">
      {/* Body */}
      <Ellipse cx="45" cy="75" rx="18" ry="22" fill={fill} opacity={0.85} />
      {/* Head */}
      <Ellipse cx="45" cy="38" rx="16" ry="15" fill={fill} opacity={0.85} />
      {/* Ears puntiagudas */}
      <Polygon points="29,30 18,18 32,35" fill={fill} opacity={0.9} />
      <Polygon points="61,30 72,18 58,35" fill={fill} opacity={0.9} />
      {/* Eyes amarillos */}
      <Circle cx="38" cy="34" r="4" fill="#ffcc00" opacity={0.9} />
      <Circle cx="52" cy="34" r="4" fill="#ffcc00" opacity={0.9} />
      <Circle cx="38" cy="34" r="2" fill="#ff8800" />
      <Circle cx="52" cy="34" r="2" fill="#ff8800" />
      {/* Nose */}
      <Ellipse cx="45" cy="44" rx="5" ry="3" fill={fill} opacity={0.7} />
      {/* Arms */}
      <Rect x="12" y="58" width="12" height="24" rx="4" fill={fill} opacity={0.75} />
      <Rect x="66" y="58" width="12" height="24" rx="4" fill={fill} opacity={0.75} />
      {/* Legs */}
      <Rect x="30" y="94" width="12" height="22" rx="3" fill={fill} opacity={0.8} />
      <Rect x="48" y="94" width="12" height="22" rx="3" fill={fill} opacity={0.8} />
      {/* Weapon — garrote */}
      <Rect x="72" y="40" width="5" height="35" rx="2" fill="#8b6914" opacity={0.9} />
      <Ellipse cx="74" cy="38" rx="7" ry="6" fill="#6b4a10" opacity={0.9} />
    </Svg>
  );
}

const GLOW_COLOR: Record<MonsterType, string> = {
  BudgeDragon: 'rgba(106,74,138,0.5)',
  Goblin:      'rgba(74,122,58,0.5)',
};

export function MonsterSilhouette({ monsterType, size = 'combat' }: MonsterSilhouetteProps) {
  const { width, height } = SIZES[size];

  const SvgComponent = {
    BudgeDragon: BudgeDragonSvg,
    Goblin:      GoblinSvg,
  }[monsterType];

  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        position:        'absolute',
        bottom:          0,
        alignSelf:       'center',
        width:           70,
        height:          15,
        backgroundColor: GLOW_COLOR[monsterType],
        borderRadius:    35,
        opacity:         0.6,
      }} />
      <SvgComponent width={width} height={height} />
    </View>
  );
}