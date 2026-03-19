// src/components/atoms/StatBox/index.tsx
//
// Átomo DUMB — muestra un stat individual del personaje
// Aparece en la grilla 4x1 de CharacterCard:
//   STR 112 | AGI 80 | VIT 109 | ENE 22
//
// En el diseño:
//   - Fondo oscuro con borde sutil
//   - Número en dorado, letra serif
//   - Label en gris, letra muy pequeña

import { Text, View } from 'react-native';

export type StatType = 'STR' | 'AGI' | 'VIT' | 'ENE';

export interface StatBoxProps {
  stat:  StatType;
  value: number;
}

// Nombre completo para accesibilidad y tooltip futuro
const STAT_LABELS: Record<StatType, string> = {
  STR: 'Strength',
  AGI: 'Agility',
  VIT: 'Vitality',
  ENE: 'Energy',
};

export function StatBox({ stat, value }: StatBoxProps) {
  return (
    <View
      style={{
        flex:            1,
        alignItems:      'center',
        paddingVertical: 6,
        paddingHorizontal: 4,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.04)',
      }}
      accessibilityLabel={`${STAT_LABELS[stat]}: ${value}`}
    >
      {/* Valor numérico — dorado, serif */}
      <Text
        style={{
          fontFamily: 'Cinzel_600SemiBold',
          fontSize:   16,
          color:      '#c8b88a',
          lineHeight: 20,
        }}
      >
        {value}
      </Text>

      {/* Label — gris, diminuto */}
      <Text
        style={{
          fontFamily:    'Cinzel_400Regular',
          fontSize:      8,
          letterSpacing: 2,
          color:         '#4a5568',
          textTransform: 'uppercase',
          marginTop:     2,
        }}
      >
        {stat}
      </Text>
    </View>
  );
}