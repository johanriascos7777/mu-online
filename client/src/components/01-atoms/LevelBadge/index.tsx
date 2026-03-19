import React from 'react';
import { View, Text } from 'react-native';

// ============================================================
// 🎯 INTERFAZ
// ============================================================
/**
 * LevelBadge — Átomo DUMB
 * Muestra el nivel del personaje o monstruo.
 * Ejemplo: LV. 12
 *
 * 'variant' controla el contexto visual:
 *   'card'   → esquina de la CharacterCard (fondo semitransparente)
 *   'combat' → panel de combate (más pequeño, sin fondo)
 */
export interface LevelBadgeProps {
  level: number;
  variant?: 'card' | 'combat';
}

// ============================================================
// 🎨 ESTILOS POR VARIANTE — sin ifs anidados
// ============================================================
const variantStyles = {
  card: {
    container: 'bg-black/70 border border-mu-gold-dark px-2 py-0.5',
    text:      'font-cinzel text-[9px] text-mu-gold tracking-widest',
  },
  combat: {
    container: 'px-1',
    text:      'font-cinzel text-[9px] text-mu-gold tracking-[0.2em]',
  },
};

// ============================================================
// 🧩 COMPONENTE
// ============================================================
export const LevelBadge = ({ level, variant = 'card' }: LevelBadgeProps) => {
  const styles = variantStyles[variant];

  return (
    <View className={styles.container}>
      <Text className={styles.text}>
        LV. {level}
      </Text>
    </View>
  );
};