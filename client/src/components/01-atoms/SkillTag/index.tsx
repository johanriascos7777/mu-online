// src/components/atoms/SkillTag/index.tsx
//
// Átomo DUMB — muestra el nombre de una habilidad del personaje
// Aparece en la fila de skills de CharacterCard:
//   [Twisting Slash] [Impale] [Death Stab]
//
// El color del borde y fondo cambia según la clase:
//   DarkKnight → rojo
//   DarkWizard → azul
//   Elf        → verde

import { Text, View } from 'react-native';
import type { CharacterClassName } from '../ClassLabel';

export interface SkillTagProps {
  skill:          string;
  characterClass: CharacterClassName;
}

// Mismo patrón CLASS_CONFIG que ClassLabel
const TAG_COLORS: Record<CharacterClassName, { border: string; bg: string; text: string }> = {
  DarkKnight: {
    border: 'rgba(192,57,43,0.3)',
    bg:     'rgba(192,57,43,0.08)',
    text:   '#c0392b',
  },
  DarkWizard: {
    border: 'rgba(74,144,217,0.3)',
    bg:     'rgba(74,144,217,0.08)',
    text:   '#4a90d9',
  },
  Elf: {
    border: 'rgba(39,174,96,0.3)',
    bg:     'rgba(39,174,96,0.08)',
    text:   '#27ae60',
  },
};

export function SkillTag({ skill, characterClass }: SkillTagProps) {
  const colors = TAG_COLORS[characterClass];

  return (
    <View
      style={{
        paddingVertical:   3,
        paddingHorizontal: 8,
        borderWidth:       1,
        borderColor:       colors.border,
        backgroundColor:   colors.bg,
      }}
    >
      <Text
        style={{
          fontFamily:    'Cinzel_400Regular',
          fontSize:      8,
          letterSpacing: 1,
          color:         colors.text,
          textTransform: 'uppercase',
        }}
      >
        {skill}
      </Text>
    </View>
  );
}