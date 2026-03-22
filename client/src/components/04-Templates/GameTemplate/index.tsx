// src/components/04-templates/GameTemplate/index.tsx
//
// Template — une todos los organismos en el flujo completo del juego
//
// Flujo:
//   1. 'map'       → usuario elige mapa (MapSelector)
//   2. 'character' → usuario elige personaje (CharacterList)
//   3. 'combat'    → combate activo (CombatArena)
//   4. 'result'    → resultado del combate (Victory/Defeat)

import { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { MapSelector }    from '../../03-organisms/MapSelector';
import { CharacterList }  from '../../03-organisms/CharacterList';
import { CombatArena }    from '../../03-organisms/CombatArena';
import type { MapFromAPI }       from '../../03-organisms/MapSelector';
import type { CharacterFromAPI } from '../../03-organisms/CharacterList';

// ── Fases del juego ───────────────────────────────────────────
type GamePhase = 'map' | 'character' | 'combat' | 'result';

export interface GameTemplateProps {
  apiUrl?: string;
}

export function GameTemplate({ apiUrl = 'http://localhost:3000' }: GameTemplateProps) {

  const [phase,         setPhase]         = useState<GamePhase>('map');
  const [selectedMap,   setSelectedMap]   = useState<MapFromAPI | null>(null);
  const [selectedChar,  setSelectedChar]  = useState<CharacterFromAPI | null>(null);
  const [combatResult,  setCombatResult]  = useState<string | null>(null);

  // ── Handlers ──────────────────────────────────────────────
  function handleSelectMap(map: MapFromAPI) {
    setSelectedMap(map);
    setPhase('character');
  }

  function handleSelectCharacter(character: CharacterFromAPI) {
    setSelectedChar(character);
    setPhase('combat');
  }

  function handleCombatEnd(status: string) {
    setCombatResult(status);
    setPhase('result');
  }

  function handleRestart() {
    setPhase('map');
    setSelectedMap(null);
    setSelectedChar(null);
    setCombatResult(null);
  }

  // ── Header con breadcrumb de fase ─────────────────────────
  function Header() {
    return (
      <View style={{
        backgroundColor: '#0a0a12',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(201,168,76,0.15)',
        paddingTop: 48,
        paddingBottom: 12,
        paddingHorizontal: 16,
      }}>
        {/* Título */}
        <Text style={{
          fontFamily:    'Cinzel_700Bold',
          fontSize:      20,
          color:         '#c9a84c',
          textAlign:     'center',
          letterSpacing: 4,
        }}>
          MU ONLINE
        </Text>
        <Text style={{
          fontFamily:    'Cinzel_400Regular',
          fontSize:      8,
          color:         '#4a5568',
          textAlign:     'center',
          letterSpacing: 3,
          marginTop:     2,
        }}>
          CONTINENT OF LEGEND
        </Text>

        {/* Breadcrumb de pasos */}
        <View style={{
          flexDirection:  'row',
          justifyContent: 'center',
          alignItems:     'center',
          marginTop:      12,
          gap:            8,
        }}>
          {[
            { key: 'map',       label: '1. MAP'       },
            { key: 'character', label: '2. CHARACTER'  },
            { key: 'combat',    label: '3. COMBAT'     },
          ].map((step, i) => {
            const phases = ['map', 'character', 'combat', 'result'];
            const isActive  = step.key === phase;
            const isDone    = phases.indexOf(step.key) < phases.indexOf(phase);

            return (
              <View key={step.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {i > 0 && (
                  <View style={{ width: 20, height: 1, backgroundColor: isDone ? '#c9a84c' : 'rgba(201,168,76,0.2)' }} />
                )}
                <Text style={{
                  fontFamily:    'Cinzel_400Regular',
                  fontSize:      8,
                  letterSpacing: 1,
                  color:         isActive ? '#c9a84c' : isDone ? '#7a5e1a' : '#4a5568',
                }}>
                  {isDone ? '✓ ' : ''}{step.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Info de selección actual */}
        {(selectedMap || selectedChar) && (
          <View style={{
            flexDirection:  'row',
            justifyContent: 'center',
            gap:            16,
            marginTop:      8,
          }}>
            {selectedMap && (
              <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 8, color: '#c9a84c' }}>
                🗺 {selectedMap.name}
              </Text>
            )}
            {selectedChar && (
              <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 8, color: '#c9a84c' }}>
                ⚔ {selectedChar.name}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }

  // ── Pantalla de resultado ──────────────────────────────────
  function ResultScreen() {
    const isVictory = combatResult === 'Victory';
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontSize: 64, marginBottom: 16 }}>
          {isVictory ? '🏆' : combatResult === 'Fled' ? '🏃' : '💀'}
        </Text>
        <Text style={{
          fontFamily:    'Cinzel_700Bold',
          fontSize:      28,
          letterSpacing: 6,
          color:         isVictory ? '#27ae60' : combatResult === 'Fled' ? '#c9a84c' : '#c0392b',
          marginBottom:  8,
        }}>
          {isVictory ? 'VICTORY' : combatResult === 'Fled' ? 'FLED' : 'DEFEAT'}
        </Text>
        <Text style={{
          fontFamily:    'Cinzel_400Regular',
          fontSize:      10,
          color:         '#4a5568',
          letterSpacing: 2,
          marginBottom:  40,
        }}>
          {isVictory
            ? `${selectedChar?.name} defeated the ${selectedMap?.name} monster!`
            : combatResult === 'Fled'
            ? 'You escaped from battle.'
            : `${selectedChar?.name} was defeated...`}
        </Text>

        {/* Botones */}
        <View style={{ gap: 12, width: '100%' }}>
          {/* Volver a intentar — mismo mapa y personaje */}
          {selectedMap && selectedChar && (
            <TouchableOpacity
              onPress={() => {
                setCombatResult(null);
                setPhase('combat');
              }}
              style={{
                borderWidth:     1,
                borderColor:     'rgba(201,168,76,0.4)',
                paddingVertical: 14,
                alignItems:      'center',
              }}
            >
              <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 10, letterSpacing: 4, color: '#c9a84c' }}>
                ⚔ FIGHT AGAIN
              </Text>
            </TouchableOpacity>
          )}

          {/* Elegir otro personaje */}
          <TouchableOpacity
            onPress={() => {
              setCombatResult(null);
              setSelectedChar(null);
              setPhase('character');
            }}
            style={{
              borderWidth:     1,
              borderColor:     'rgba(201,168,76,0.2)',
              paddingVertical: 14,
              alignItems:      'center',
            }}
          >
            <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 10, letterSpacing: 4, color: '#7a5e1a' }}>
              CHANGE CHARACTER
            </Text>
          </TouchableOpacity>

          {/* Volver al inicio */}
          <TouchableOpacity
            onPress={handleRestart}
            style={{
              borderWidth:     1,
              borderColor:     'rgba(255,255,255,0.05)',
              paddingVertical: 14,
              alignItems:      'center',
            }}
          >
            <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 10, letterSpacing: 4, color: '#4a5568' }}>
              MAIN MENU
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Render por fase ────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#050508' }}>
      <Header />

      {phase === 'map' && (
        <View style={{ flex: 1 }}>
          <MapSelector
            apiUrl={apiUrl}
            activeMapId={selectedMap?.id}
            onSelectMap={handleSelectMap}
          />
          <View style={{ padding: 16 }}>
            <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 9, color: '#4a5568', textAlign: 'center', letterSpacing: 2 }}>
              SELECT A MAP TO BEGIN YOUR JOURNEY
            </Text>
          </View>
        </View>
      )}

      {phase === 'character' && (
        <CharacterList
          apiUrl={apiUrl}
          activeCharacter={selectedChar?.name}
          onSelectCharacter={handleSelectCharacter}
        />
      )}

      {phase === 'combat' && selectedChar && selectedMap && (
        <CombatArena
          apiUrl={apiUrl}
          characterName={selectedChar.name}
          mapName={selectedMap.id}
          onCombatEnd={handleCombatEnd}
        />
      )}

      {phase === 'result' && <ResultScreen />}
    </SafeAreaView>
  );
}