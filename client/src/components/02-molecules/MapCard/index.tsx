// src/components/02-molecules/MapCard/index.tsx
//
// Molécula DUMB — card de un mapa individual
// Aparece en la fila horizontal del selector de mapas

import { View, Text, TouchableOpacity } from 'react-native';

export interface MapCardProps {
  id:          string;
  name:        string;
  levelRange:  string;
  isActive?:   boolean;
  onPress?:    () => void;
}

// Config visual por mapa — igual que el diseño HTML
const MAP_CONFIG: Record<string, { icon: string; accentColor: string }> = {
  lorencia: { icon: '🏰', accentColor: '#8b4513' },
  dungeon:  { icon: '🕳️', accentColor: '#4a0a4a' },
  devias:   { icon: '❄️', accentColor: '#4a7ab5' },
  noria:    { icon: '🌿', accentColor: '#2d6a4f' },
  atlans:   { icon: '🌊', accentColor: '#1a4a7a' },
};

export function MapCard({ id, name, levelRange, isActive = false, onPress }: MapCardProps) {
  const config = MAP_CONFIG[id.toLowerCase()] ?? { icon: '🗺️', accentColor: '#c9a84c' };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flex:            1,
        backgroundColor: isActive ? 'rgba(201,168,76,0.05)' : '#0e0e1a',
        borderWidth:     1,
        borderColor:     isActive ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.1)',
        padding:         12,
        alignItems:      'center',
        position:        'relative',
        overflow:        'hidden',
      }}
    >
      {/* Línea inferior de color por mapa */}
      <View style={{
        position:        'absolute',
        bottom:          0, left: 0, right: 0,
        height:          2,
        backgroundColor: config.accentColor,
        opacity:         isActive ? 1 : 0.5,
      }} />

      <Text style={{ fontSize: 24, marginBottom: 6 }}>{config.icon}</Text>

      <Text style={{
        fontFamily:    'Cinzel_400Regular',
        fontSize:      9,
        letterSpacing: 2,
        color:         isActive ? '#c8b880' : '#a09060',
        textTransform: 'uppercase',
        marginBottom:  4,
      }}>
        {name}
      </Text>

      <Text style={{
        fontFamily: 'Cinzel_400Regular',
        fontSize:   8,
        color:      '#4a5568',
      }}>
        {levelRange}
      </Text>
    </TouchableOpacity>
  );
}