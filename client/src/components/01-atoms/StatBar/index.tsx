import React from 'react';
import { View, Text } from 'react-native';

export interface StatBarProps {
  label: string;
  currentValue: number;
  maxValue: number;
  type: 'hp' | 'mp' | 'exp';
}

export const StatBar = ({ label, currentValue, maxValue, type }: StatBarProps) => {
  // Calculamos el porcentaje para el ancho de la barra
  const percentage = Math.min(100, Math.max(0, (currentValue / maxValue) * 100));

  // Definimos el color de la barra basado en el tipo
  const barColor = 
    type === 'hp' ? 'bg-mu-hp-bright' : 
    type === 'mp' ? 'bg-mu-mp-bright' : 
    'bg-mu-gold';

  return (
    <View className="flex-row items-center gap-2 mb-1">
      {/* Etiqueta (HP, MP, EXP) */}
      <Text className="font-cinzel text-[10px] tracking-widest text-mu-steel-light w-6 text-right uppercase">
        {label}
      </Text>

      {/* Track de la barra (fondo oscuro) */}
      <View className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        {/* Relleno de la barra */}
        <View 
          className={`h-full rounded-full ${barColor}`} 
          style={{ width: `${percentage}%` }} 
        />
      </View>

      {/* Valor numérico (390/500) */}
      <Text className="font-crimson text-xs text-mu-steel-light w-14 text-right">
        {type === 'exp' ? `${percentage.toFixed(0)}%` : `${currentValue}/${maxValue}`}
      </Text>
    </View>
  );
};