// src/components/molecules/CharacterCard/index.tsx
//
// Molécula — combina todos los átomos en la card del personaje
//
// Átomos que usa:
//   ClassLabel  → "DARK KNIGHT" en rojo
//   LevelBadge  → "LV. 12" en esquina
//   StatBar     → barras HP / MP / EXP
//   StatBox     → grilla STR / AGI / VIT / ENE
//   SkillTag    → etiquetas de habilidades
//
// Dos modos:
//   isActive: true  → borde dorado + badge "◆ ACTIVE"
//   isActive: false → borde sutil

import { View, Text, TouchableOpacity } from 'react-native';
import { ClassLabel }          from '../../01-atoms/ClassLabel';
import { LevelBadge }          from '../../01-atoms/LevelBadge';
import { StatBar }             from '../../01-atoms/StatBar';
import { StatBox }             from '../../01-atoms/StatBox';
import { SkillTag }            from '../../01-atoms/SkillTag';
import { CharacterSilhouette } from '../../01-atoms/CharacterSilhouette';
import type { CharacterClassName } from '../../01-atoms/ClassLabel';

export interface CharacterCardProps {
  name:           string;
  characterClass: CharacterClassName;
  level:          number;
  isActive?:      boolean;

  // Stats de vida y recursos
  hp:  { current: number; max: number };
  mp:  { current: number; max: number };
  exp: { current: number; max: number };

  // Stats de atributos
  stats: {
    strength: number;
    agility:  number;
    vitality: number;
    energy:   number;
  };

  // Habilidades del personaje
  skills: string[];

  // Callback al presionar "Enter Battle"
  onPress?: () => void;
}

// Color de acento por clase — para el borde de la card
const ACCENT_COLOR: Record<CharacterClassName, string> = {
  DarkKnight: 'rgba(192,57,43,0.6)',
  DarkWizard: 'rgba(74,144,217,0.6)',
  Elf:        'rgba(39,174,96,0.6)',
};

// Color de fondo del artwork por clase
const ARTWORK_BG: Record<CharacterClassName, string> = {
  DarkKnight: '#150508',
  DarkWizard: '#05080f',
  Elf:        '#050f08',
};

// Color de la línea top de la card
const ACCENT_LINE: Record<CharacterClassName, string[]> = {
  DarkKnight: ['transparent', '#c0392b', 'transparent'],
  DarkWizard: ['transparent', '#4a90d9', 'transparent'],
  Elf:        ['transparent', '#27ae60', 'transparent'],
};

// Emoji del personaje por clase
const CHARACTER_EMOJI: Record<CharacterClassName, string> = {
  DarkKnight: '⚔️',
  DarkWizard: '🔮',
  Elf:        '🏹',
};

export function CharacterCard({
  name,
  characterClass,
  level,
  isActive = false,
  hp,
  mp,
  exp,
  stats,
  skills,
  onPress,
}: CharacterCardProps) {

  const borderColor = isActive
    ? 'rgba(201,168,76,0.5)'
    : ACCENT_COLOR[characterClass];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: '#0e0e1a',
        borderWidth:     1,
        borderColor,
        position:        'relative',
        overflow:        'hidden',
      }}
    >
      {/* ── Línea decorativa top ── */}
      <View
        style={{
          height: 3,
          backgroundColor: ACCENT_COLOR[characterClass].replace('0.6', '1'),
        }}
      />

      {/* ── Artwork del personaje ── */}
      <View
        style={{
          height:          160,
          backgroundColor: ARTWORK_BG[characterClass],
          alignItems:      'center',
          justifyContent:  'center',
          position:        'relative',
        }}
      >
        {/* Badge nivel — esquina superior derecha */}
        <View style={{ position: 'absolute', top: 10, right: 10 }}>
          <LevelBadge level={level} variant="card" />
        </View>

        {/* Badge ACTIVE — esquina superior izquierda */}
        {isActive && (
          <View
            style={{
              position:        'absolute',
              top:             10,
              left:            10,
              backgroundColor: 'rgba(201,168,76,0.2)',
              borderWidth:     1,
              borderColor:     '#c9a84c',
              paddingVertical:   3,
              paddingHorizontal: 8,
            }}
          >
            <Text
              style={{
                fontFamily:    'Cinzel_400Regular',
                fontSize:      9,
                letterSpacing: 1,
                color:         '#f0d080',
              }}
            >
              ◆ ACTIVE
            </Text>
          </View>
        )}

        {/* Silueta SVG — idéntica al diseño HTML original */}
        <CharacterSilhouette characterClass={characterClass} size="card" />
      </View>

      {/* ── Cuerpo de la card ── */}
      <View
        style={{
          padding:         16,
          backgroundColor: '#12121f',
        }}
      >
        {/* Clase + Nombre */}
        <ClassLabel characterClass={characterClass} size="sm" />
        <Text
          style={{
            fontFamily:  'Cinzel_700Bold',
            fontSize:    22,
            color:       '#e8dfc0',
            marginTop:   4,
            marginBottom: 12,
            lineHeight:  24,
          }}
        >
          {name}
        </Text>

        {/* Barras HP / MP / EXP */}
        <View style={{ gap: 8, marginBottom: 12 }}>
          <StatBar
            label="HP"
            currentValue={hp.current}
            maxValue={hp.max}
            type="hp"
          />
          <StatBar
            label="MP"
            currentValue={mp.current}
            maxValue={mp.max}
            type="mp"
          />
          <StatBar
            label="EXP"
            currentValue={exp.current}
            maxValue={exp.max}
            type="exp"
          />
        </View>

        {/* Grilla STR / AGI / VIT / ENE */}
        <View
          style={{
            flexDirection:  'row',
            gap:            6,
            marginBottom:   12,
            paddingTop:     10,
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.05)',
          }}
        >
          <StatBox stat="STR" value={stats.strength} />
          <StatBox stat="AGI" value={stats.agility}  />
          <StatBox stat="VIT" value={stats.vitality} />
          <StatBox stat="ENE" value={stats.energy}   />
        </View>

        {/* Skills */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap:      'wrap',
            gap:           6,
            marginBottom:  12,
          }}
        >
          {skills.map(skill => (
            <SkillTag
              key={skill}
              skill={skill}
              characterClass={characterClass}
            />
          ))}
        </View>

        {/* Botón Enter Battle */}
        <TouchableOpacity
          onPress={onPress}
          style={{
            borderWidth:   1,
            borderColor:   'rgba(201,168,76,0.3)',
            paddingVertical: 10,
            alignItems:    'center',
          }}
        >
          <Text
            style={{
              fontFamily:    'Cinzel_400Regular',
              fontSize:      10,
              letterSpacing: 4,
              color:         '#c9a84c',
              textTransform: 'uppercase',
            }}
          >
            Enter Battle
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Esquinas decorativas ── */}
      <View style={{
        position: 'absolute', top: 0, left: 0,
        width: 16, height: 16,
        borderTopWidth: 1, borderLeftWidth: 1,
        borderColor: '#c9a84c',
      }} />
      <View style={{
        position: 'absolute', bottom: 0, right: 0,
        width: 16, height: 16,
        borderBottomWidth: 1, borderRightWidth: 1,
        borderColor: '#c9a84c',
      }} />
    </TouchableOpacity>
  );
}