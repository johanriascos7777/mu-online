// src/components/03-organisms/CharacterList/index.tsx
//
// Organismo SMART — llama a GET /characters y renderiza las cards
//
// Es el primer componente que toca la API real.
// Los átomos y moléculas son DUMB (solo props).
// Este organismo es SMART (conoce el estado, llama al backend).

import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { CharacterCard } from '../../02-molecules/CharacterCard';
import type { CharacterClassName } from '../../01-atoms/ClassLabel';

// ── Tipo que viene del backend GET /characters ────────────────
// Refleja exactamente el toJSON() de character.entity.ts
export interface CharacterFromAPI {
  id:             number;
  name:           string;
  class:          CharacterClassName;  // 'DarkKnight' | 'DarkWizard' | 'Elf'
  level:          number;
  experience:     number;
  stats: {
    hp:       string;  // '155/155'
    mp:       string;  // '40/40'
    strength: number;
    agility:  number;
    vitality: number;
    energy:   number;
  };
  items:     object[];
  createdAt: string;
}

// ── Habilidades por clase (backend no las retorna aún) ────────
const SKILLS_BY_CLASS: Record<CharacterClassName, string[]> = {
  DarkKnight: ['Twisting Slash', 'Impale', 'Death Stab'],
  DarkWizard: ['Fireball', 'Ice Storm', 'Lightning'],
  Elf:        ['Triple Shot', 'Heal', 'Defense'],
};

// ── Parser: convierte '155/155' → { current: 155, max: 155 } ─
function parseStat(statString: string): { current: number; max: number } {
  const [current, max] = statString.split('/').map(Number);
  return { current, max };
}

// ── Props del organismo ───────────────────────────────────────
export interface CharacterListProps {
  /** URL base de la API — default al backend local */
  apiUrl?:          string;
  /** Nombre del personaje activo (para marcar isActive) */
  activeCharacter?: string;
  /** Callback cuando el usuario presiona "Enter Battle" */
  onSelectCharacter?: (character: CharacterFromAPI) => void;
}

export function CharacterList({
  apiUrl          = 'http://localhost:3000',
  activeCharacter,
  onSelectCharacter,
}: CharacterListProps) {

  const [characters, setCharacters] = useState<CharacterFromAPI[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  // ── Fetch al montar el componente ────────────────────────────
  useEffect(() => {
    fetch(`${apiUrl}/characters`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: CharacterFromAPI[]) => {
        setCharacters(data);
        setLoading(false);
      })
      .catch(err => {
        setError(`No se pudo conectar al backend: ${err.message}`);
        setLoading(false);
      });
  }, [apiUrl]);

  // ── Estado: cargando ─────────────────────────────────────────
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#050508', padding: 40 }}>
        <ActivityIndicator size="large" color="#c9a84c" />
        <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 10, letterSpacing: 3, color: '#c9a84c', marginTop: 16 }}>
          LOADING CHARACTERS...
        </Text>
      </View>
    );
  }

  // ── Estado: error ────────────────────────────────────────────
  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#050508', padding: 40 }}>
        <Text style={{ fontSize: 32, marginBottom: 12 }}>⚠️</Text>
        <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 10, letterSpacing: 2, color: '#c0392b', textAlign: 'center' }}>
          {error}
        </Text>
        <Text style={{ fontFamily: 'Crimson Pro', fontSize: 12, color: '#4a5568', marginTop: 8, textAlign: 'center' }}>
          Asegúrate que el backend está corriendo:{'\n'}npm run start:dev
        </Text>
      </View>
    );
  }

  // ── Estado: sin personajes ───────────────────────────────────
  if (characters.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#050508', padding: 40 }}>
        <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 10, letterSpacing: 3, color: '#4a5568' }}>
          NO CHARACTERS FOUND
        </Text>
        <Text style={{ fontFamily: 'Crimson Pro', fontSize: 12, color: '#4a5568', marginTop: 8 }}>
          POST /characters para crear uno
        </Text>
      </View>
    );
  }

  // ── Estado: lista de personajes ──────────────────────────────
  return (
    <ScrollView
      style={{ backgroundColor: '#050508' }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      {/* Título de sección */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.2)' }} />
        <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 9, letterSpacing: 5, color: '#c9a84c' }}>
          CHOOSE YOUR CHARACTER
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.2)' }} />
      </View>

      {/* Cards — una por personaje del backend */}
      {characters.map(character => (
        <CharacterCard
          key={character.id}
          name={character.name}
          characterClass={character.class}
          level={character.level}
          isActive={character.name === activeCharacter}

          // Parser: '155/155' → { current: 155, max: 155 }
          hp={parseStat(character.stats.hp)}
          mp={parseStat(character.stats.mp)}

          // EXP: calculamos % basado en level
          exp={{
            current:  character.experience,
            max:      Math.floor(Math.pow(character.level, 2) * 1000),
          }}

          stats={{
            strength: character.stats.strength,
            agility:  character.stats.agility,
            vitality: character.stats.vitality,
            energy:   character.stats.energy,
          }}

          // Skills estáticas por clase hasta que el backend las retorne
          skills={SKILLS_BY_CLASS[character.class] ?? []}

          onPress={() => onSelectCharacter?.(character)}
        />
      ))}
    </ScrollView>
  );
}