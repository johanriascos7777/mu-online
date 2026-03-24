// src/components/01-atoms/HelpBadge/index.tsx
//
// Átomo DUMB — el botón '!' educativo
//
// Recibe:
//   onPress   → abre el modal POO
//   variant   → 'gold' (default) | 'subtle' | 'combat'
//   size      → 'sm' | 'md'
//
// Regla DUMB: no sabe qué modal abrir — el padre le pasa onPress.

import { TouchableOpacity, Text, View } from 'react-native';

export type HelpBadgeVariant = 'gold' | 'subtle' | 'combat';
export type HelpBadgeSize    = 'sm' | 'md';

export interface HelpBadgeProps {
  onPress:   () => void;
  variant?:  HelpBadgeVariant;
  size?:     HelpBadgeSize;
  /** Accesibilidad — describe qué concepto explica este badge */
  label?:    string;
}

// ── Estilos por variante ──────────────────────────────────────
const VARIANT_STYLES: Record<HelpBadgeVariant, {
  bg: string; border: string; text: string;
}> = {
  gold: {
    bg:     'rgba(201,168,76,0.12)',
    border: 'rgba(201,168,76,0.5)',
    text:   '#c9a84c',
  },
  subtle: {
    bg:     'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.1)',
    text:   '#4a5568',
  },
  combat: {
    bg:     'rgba(192,57,43,0.12)',
    border: 'rgba(192,57,43,0.4)',
    text:   '#c0392b',
  },
};

const SIZE_STYLES: Record<HelpBadgeSize, {
  container: number; fontSize: number;
}> = {
  sm: { container: 18, fontSize: 10 },
  md: { container: 24, fontSize: 13 },
};

// ── Componente ────────────────────────────────────────────────
export function HelpBadge({
  onPress,
  variant = 'gold',
  size    = 'sm',
  label   = 'Explicación POO',
}: HelpBadgeProps) {

  const vs = VARIANT_STYLES[variant];
  const ss = SIZE_STYLES[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={label}
      accessibilityRole="button"
      style={{
        width:           ss.container,
        height:          ss.container,
        borderRadius:    ss.container / 2,
        backgroundColor: vs.bg,
        borderWidth:     1,
        borderColor:     vs.border,
        alignItems:      'center',
        justifyContent:  'center',
      }}
    >
      <Text style={{
        fontFamily: 'Cinzel_700Bold',
        fontSize:   ss.fontSize,
        color:      vs.text,
        lineHeight: ss.container,
        textAlign:  'center',
      }}>
        ?
      </Text>
    </TouchableOpacity>
  );
}