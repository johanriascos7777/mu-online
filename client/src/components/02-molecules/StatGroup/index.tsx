import React from 'react';
import { View, Text } from 'react-native';
import { StatBar } from '../../01-atoms/StatBar';

export interface StatGroupProps {
  characterClass: string;
  hp: { current: number; max: number };
  mp: { current: number; max: number };
  exp: { current: number; max: number };
}

export const StatGroup = ({ characterClass, hp, mp, exp }: StatGroupProps) => {
  return (
    <View className="w-full bg-mu-bg-card border border-mu-gold/20 p-4 rounded-sm">
      <Text className="font-cinzel text-xs text-mu-knight tracking-[0.4em] uppercase mb-4 text-center">
        {characterClass}
      </Text>
      
      {/* Reutilizamos tu maravilloso Átomo */}
      <StatBar label="HP" currentValue={hp.current} maxValue={hp.max} type="hp" />
      <StatBar label="MP" currentValue={mp.current} maxValue={mp.max} type="mp" />
      <StatBar label="EXP" currentValue={exp.current} maxValue={exp.max} type="exp" />
    </View>
  );
};