// src/components/atoms/ClassLabel/index.tsx
//
// Átomo DUMB — muestra la clase del personaje con su color
// Aparece encima del nombre en CharacterCard
//
// Ejemplos del diseño:
//   "DARK KNIGHT" → rojo   (#c0392b)
//   "DARK WIZARD" → azul   (#4a90d9)
//   "FAIRY ELF"   → verde  (#27ae60)

import { Text, View } from 'react-native';

export type CharacterClassName = 'DarkKnight' | 'DarkWizard' | 'Elf';

export interface ClassLabelProps {
  characterClass: CharacterClassName;
  /** Tamaño del texto — 'sm' para cards, 'xs' para badges compactos */
  size?: 'xs' | 'sm';
}

// Mapa de clase → etiqueta visual + color
const CLASS_CONFIG: Record<CharacterClassName, { label: string; color: string }> = {
  DarkKnight: { label: 'DARK KNIGHT', color: '#c0392b' },
  DarkWizard: { label: 'DARK WIZARD', color: '#4a90d9' },
  Elf:        { label: 'FAIRY ELF',   color: '#27ae60' },
};

const SIZE_CONFIG = {
  xs: { fontSize: 9,  letterSpacing: 2 },
  sm: { fontSize: 11, letterSpacing: 3 },
};

export function ClassLabel({ characterClass, size = 'sm' }: ClassLabelProps) {
  const { label, color } = CLASS_CONFIG[characterClass];
  const { fontSize, letterSpacing } = SIZE_CONFIG[size];

  return (
    <Text
      style={{
        fontFamily:    'Cinzel_400Regular',
        fontSize,
        letterSpacing,
        color,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Text>
  );
}