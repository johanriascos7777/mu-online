import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

// ============================================================
// 🎯 INTERFAZ — Define el "contrato" del componente
// ============================================================
/**
 * Aquí definimos EXACTAMENTE qué datos acepta ActionBtn.
 *
 * 'variant' controla DOS cosas a la vez:
 *   1. El estilo del título (serif grande vs uppercase delgado)
 *   2. El color del subtítulo (rojo, azul o verde)
 *
 * Esto es el componente DUMB — solo recibe, solo renderiza.
 */
export interface ActionBtnProps {
  /** Emoji o imagen que representa la habilidad */
  icon: string;
  /** Nombre de la acción */
  label: string;
  /** Costo en MP, 'Basic', 'Heal HP', etc. */
  cost: string;
  /**
   * Controla el estilo visual completo:
   * - 'attack'  → label grande serif,  cost en rojo   (Basic)
   * - 'skill'   → label uppercase thin, cost en azul  (30 MP)
   * - 'heal'    → label uppercase thin, cost en verde (Heal HP)
   */
  variant?: 'attack' | 'skill' | 'heal';
  onPress?: () => void;
}

// ============================================================
// 🎨 ESTILOS POR VARIANTE
// ============================================================
const variantStyles = {
  attack: {
    border:     'border-mu-knight/50',
    labelStyle: 'font-cinzel text-base font-bold text-[#e8dfc0]',    // grande serif
    costColor:  'text-[#cc6655]',                                      // rojo
  },
  skill: {
    border:     'border-mu-gold/30',
    labelStyle: 'font-cinzel text-[8px] tracking-[0.2em] text-mu-gold', // uppercase thin
    costColor:  'text-mu-wizard',                                       // azul
  },
  heal: {
    border:     'border-mu-gold/30',
    labelStyle: 'font-cinzel text-[8px] tracking-[0.2em] text-mu-gold', // uppercase thin
    costColor:  'text-mu-elf',                                          // verde
  },
};

// ============================================================
// 🧩 COMPONENTE DUMB — Solo renderiza lo que recibe
// ============================================================
export const ActionBtn = ({
  icon,
  label,
  cost,
  variant = 'skill',
  onPress,
}: ActionBtnProps) => {

  const styles = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`
        bg-mu-bg-card
        border ${styles.border}
        items-center justify-center
        p-3 flex-1
        min-h-[96px]
      `}
    >
      {/* Ícono */}
      <Text className="text-2xl mb-1">{icon}</Text>

      {/* Label — cambia de estilo según variant */}
      <Text
        className={`${styles.labelStyle} text-center uppercase`}
        numberOfLines={1}
      >
        {label}
      </Text>

      {/* Cost — cambia de color según variant */}
      <Text className={`${styles.costColor} font-cinzel text-[10px] mt-0.5`}>
        {cost}
      </Text>
    </TouchableOpacity>
  );
};