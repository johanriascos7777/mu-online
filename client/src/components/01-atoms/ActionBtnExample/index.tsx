import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

export interface ActionBtnProps {
  icon: string;
  label: string;
  cost: string;
  variant?: 'default' | 'attack' | 'heal';
  onPress?: () => void;
}

export const ActionBtn = ({ icon, label, cost, variant = 'default', onPress }: ActionBtnProps) => {
  // Definimos colores según la variante (basado en tu diseño de MU)
  const isAttack = variant === 'attack';
  const isHeal = variant === 'heal';

  const borderColor = isAttack ? 'border-mu-knight' : 'border-mu-gold/30';
  const labelColor = isAttack ? 'text-[#cc6655]' : 'text-mu-gold';
  const costColor = isHeal ? 'text-mu-elf' : 'text-mu-mp-bright';

  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      className={`bg-mu-bg-card p-3 items-center justify-center border ${borderColor} w-24 h-24`}
    >
      <Text className="text-xl mb-1">{icon}</Text>
      <Text className={`font-cinzel text-[8px] tracking-[0.2em] uppercase text-center ${labelColor}`}>
        {label}
      </Text>
      <Text className={`font-crimson text-[10px] mt-1 ${costColor}`}>
        {cost}
      </Text>
    </TouchableOpacity>
  );
};