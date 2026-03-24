// src/components/04-templates/HomeScreen/index.tsx
//
// Template — pantalla home completa
// Layout idéntico al diseño HTML original:
//   1. Header MU Online
//   2. MapSelector — fila horizontal de mapas
//   3. CharacterList — grid 3 columnas
//   4. CombatArena — aparece al elegir mapa + personaje

import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, ActivityIndicator,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { MapSelector }         from '../../03-organisms/MapSelector';
import { CharacterList }       from '../../03-organisms/CharacterList';
import { BossShowcase }        from '../../03-organisms/BossShowcase';
import { CharacterSilhouette } from '../../01-atoms/CharacterSilhouette';
import { MonsterSilhouette }   from '../../01-atoms/MonsterSilhouette';
import { StatBar }             from '../../01-atoms/StatBar';
import { ActionBtn }           from '../../01-atoms/ActionBtn';
import { LevelBadge }          from '../../01-atoms/LevelBadge';
import type { MapFromAPI }       from '../../03-organisms/MapSelector';
import type { CharacterFromAPI } from '../../03-organisms/CharacterList';

export interface HomeScreenProps {
  apiUrl?: string;
}

interface CombatState {
  id:      string;
  status:  string;
  turn:    number;
  mapName: string;
  character: {
    name:  string;
    class: string;
    level: number;
    stats: { hp: string; mp: string };
  };
  monster: {
    name:  string;
    level: number;
    hp:    string;
  };
  log: string[];
}

function parseStat(s: string) {
  const [current, max] = (s ?? '0/0').split('/').map(Number);
  return { current, max };
}

export function HomeScreen({ apiUrl = 'http://localhost:3000' }: HomeScreenProps) {

  const [selectedMap,   setSelectedMap]   = useState<MapFromAPI | null>(null);
  const [selectedChar,  setSelectedChar]  = useState<CharacterFromAPI | null>(null);
  const [combat,        setCombat]        = useState<CombatState | null>(null);
  const [combatLoading, setCombatLoading] = useState(false);
  const [acting,        setActing]        = useState(false);
  const [charHp,        setCharHp]        = useState('');
  const [charMp,        setCharMp]        = useState('');
  const [monsterHp,     setMonsterHp]     = useState('');

  // ── Inicia combate al elegir mapa + personaje ─────────────
  useEffect(() => {
    if (!selectedMap || !selectedChar) return;
    setCombatLoading(true);
    setCombat(null);
    setCharHp('');
    setCharMp('');
    setMonsterHp('');

    fetch(`${apiUrl}/combat/start`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        characterName: selectedChar.name,
        mapName:       selectedMap.id,
      }),
    })
      .then(r => r.json())
      .then(data => {
        setCombat(data.combat);
        setCombatLoading(false);
      })
      .catch(() => setCombatLoading(false));
  }, [selectedMap, selectedChar]);

  async function handleAttack() {
    if (!combat || acting || combat.status !== 'Active') return;
    setActing(true);
    try {
      const res  = await fetch(`${apiUrl}/combat/${combat.id}/attack`, { method: 'POST' });
      const data = await res.json();
      const r    = data.result;
      setCharHp(r.characterHp);
      setCharMp(r.characterMp);
      setMonsterHp(r.monsterHp);
      setCombat(prev => prev ? {
        ...prev,
        status: r.status,
        turn:   r.turn,
        log:    [...(prev.log ?? []), ...r.log],
      } : prev);
    } finally {
      setActing(false);
    }
  }

  async function handleFlee() {
    if (!combat || acting) return;
    setActing(true);
    try {
      await fetch(`${apiUrl}/combat/${combat.id}/flee`, { method: 'POST' });
      setCombat(prev => prev ? { ...prev, status: 'Fled' } : prev);
    } finally {
      setActing(false);
    }
  }

  const isOver         = combat && combat.status !== 'Active';
  const displayCharHp  = charHp    || combat?.character.stats.hp || '0/0';
  const displayCharMp  = charMp    || combat?.character.stats.mp || '0/0';
  const displayMonHp   = monsterHp || combat?.monster.hp         || '0/0';
  const charHpParsed   = parseStat(displayCharHp);
  const charMpParsed   = parseStat(displayCharMp);
  const monHpParsed    = parseStat(displayMonHp);
  const isBoss         = combat?.monster.name?.toLowerCase().includes('ancient');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#050508' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ══ HEADER ══ */}
        <View style={{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 16, position: 'relative' }}>
          <Text style={{
            fontFamily: 'Cinzel_400Regular', fontSize: 9,
            letterSpacing: 8, color: '#c9a84c', opacity: 0.8, marginBottom: 8,
          }}>
            CONTINENT OF LEGEND
          </Text>
          <Text style={{
            fontFamily: 'Cinzel_700Bold', fontSize: 42,
            color: '#c9a84c', letterSpacing: 6,
          }}>
            MU ONLINE
          </Text>
          <Text style={{
            fontFamily: 'Cinzel_400Regular', fontSize: 12,
            color: '#718096', marginTop: 6, fontStyle: 'italic', letterSpacing: 2,
          }}>
            Object Oriented Realm — NestJS & TypeScript
          </Text>
          {/* Línea decorativa */}
          <View style={{
            width: '60%', height: 1,
            backgroundColor: 'rgba(201,168,76,0.5)',
            marginTop: 24,
          }} />
        </View>

        {/* ══ MAP SELECTOR ══ */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.2)' }} />
            <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 9, letterSpacing: 5, color: '#c9a84c' }}>
              SELECT YOUR MAP
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.2)' }} />
          </View>
        </View>

        <MapSelector
          apiUrl={apiUrl}
          activeMapId={selectedMap?.id}
          onSelectMap={map => {
            setSelectedMap(map);
            setSelectedChar(null);
            setCombat(null);
          }}
        />

        {/* ══ CHARACTER CARDS — grid 3 columnas ══ */}
        <View style={{ marginTop: 16 }}>
          <CharacterList
            apiUrl={apiUrl}
            activeCharacter={selectedChar?.name}
            onSelectCharacter={char => setSelectedChar(char)}
          />
        </View>

        {/* ══ BOSS SHOWCASE — demo interactiva fija ══ */}
        <BossShowcase apiUrl={apiUrl} />

        {/* ══ COMBAT ARENA ══ */}
        {(combat || combatLoading) && (
          <View style={{ marginTop: 24, paddingHorizontal: 16 }}>

            {/* Título */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.2)' }} />
              <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 9, letterSpacing: 5, color: '#c9a84c' }}>
                ⚔ COMBAT ARENA
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.2)' }} />
            </View>

            {combatLoading && (
              <View style={{ alignItems: 'center', padding: 32 }}>
                <ActivityIndicator color="#c9a84c" />
                <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 8, color: '#c9a84c', letterSpacing: 3, marginTop: 12 }}>
                  ENTERING COMBAT...
                </Text>
              </View>
            )}

            {combat && (
              <>
                {/* Arena — 3 columnas: personaje | VS | monstruo */}
                <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>

                  {/* Panel personaje */}
                  <View style={{ flex: 1, backgroundColor: '#0e0e1a', borderWidth: 1, borderColor: 'rgba(201,168,76,0.12)', position: 'relative' }}>
                    {/* Esquinas decorativas */}
                    <View style={{ position: 'absolute', top: 0, left: 0, width: 15, height: 15, borderTopWidth: 1, borderLeftWidth: 1, borderColor: '#7a5e1a', zIndex: 2 }} />
                    <View style={{ position: 'absolute', bottom: 0, right: 0, width: 15, height: 15, borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#7a5e1a', zIndex: 2 }} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' }}>
                      <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 8, letterSpacing: 4, color: '#7a5e1a' }}>HERO</Text>
                      <Text style={{ fontFamily: 'Cinzel_700Bold', fontSize: 14, color: '#e0d0a0' }}>{combat.character.name}</Text>
                    </View>
                    <View style={{ height: 150, backgroundColor: '#10050a', alignItems: 'center', justifyContent: 'center' }}>
                      <CharacterSilhouette characterClass={combat.character.class as any} size="combat" />
                    </View>
                    <View style={{ padding: 12, gap: 6 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                        <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 12, color: '#e0d0a0' }}>
                          {combat.character.class === 'DarkKnight' ? 'Dark Knight' :
                           combat.character.class === 'DarkWizard' ? 'Dark Wizard' : 'Fairy Elf'}
                        </Text>
                        <LevelBadge level={combat.character.level} variant="combat" />
                      </View>
                      <StatBar label="HP" currentValue={charHpParsed.current} maxValue={charHpParsed.max} type="hp" />
                      <StatBar label="MP" currentValue={charMpParsed.current} maxValue={charMpParsed.max} type="mp" />
                    </View>
                  </View>

                  {/* VS central */}
                  <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 8, width: 50 }}>
                    <View style={{ width: 1, height: 60, backgroundColor: 'rgba(201,168,76,0.2)' }} />
                    <Text style={{ fontFamily: 'Cinzel_700Bold', fontSize: 22, color: '#c9a84c' }}>VS</Text>
                    <View style={{ width: 1, height: 60, backgroundColor: 'rgba(201,168,76,0.2)' }} />
                  </View>

                  {/* Panel monstruo */}
                  <View style={{ flex: 1, backgroundColor: '#0e0e1a', borderWidth: 1, borderColor: isBoss ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.12)', position: 'relative' }}>
                    <View style={{ position: 'absolute', top: 0, left: 0, width: 15, height: 15, borderTopWidth: 1, borderLeftWidth: 1, borderColor: '#7a5e1a', zIndex: 2 }} />
                    <View style={{ position: 'absolute', bottom: 0, right: 0, width: 15, height: 15, borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#7a5e1a', zIndex: 2 }} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' }}>
                      <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 8, letterSpacing: 4, color: '#7a5e1a' }}>
                        MONSTER · {combat.mapName?.toUpperCase()}
                      </Text>
                      <Text style={{ fontFamily: 'Cinzel_700Bold', fontSize: 14, color: isBoss ? '#f0d080' : '#e0d0a0' }}>
                        {isBoss ? '⚠ ' : ''}{combat.monster.name}
                      </Text>
                    </View>
                    <View style={{ height: 150, backgroundColor: '#05080f', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <MonsterSilhouette monsterType="BudgeDragon" size="combat" />
                      {isBoss && (
                        <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(201,168,76,0.2)', borderWidth: 1, borderColor: '#c9a84c', paddingHorizontal: 8, paddingVertical: 3 }}>
                          <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 8, color: '#f0d080', letterSpacing: 2 }}>BOSS</Text>
                        </View>
                      )}
                    </View>
                    <View style={{ padding: 12, gap: 6 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                        <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 12, color: '#e0d0a0' }}>{combat.monster.name}</Text>
                        <LevelBadge level={combat.monster.level} variant="combat" />
                      </View>
                      <StatBar label="HP" currentValue={monHpParsed.current} maxValue={monHpParsed.max} type="hp" />
                    </View>
                  </View>
                </View>

                {/* Battle Log */}
                <View style={{ marginTop: 16, backgroundColor: '#0e0e1a', borderWidth: 1, borderColor: 'rgba(201,168,76,0.1)', padding: 14 }}>
                  <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 8, letterSpacing: 4, color: '#7a5e1a', marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.1)' }}>
                    ⚔ BATTLE LOG — {combat.mapName?.toUpperCase()} — TURN {combat.turn}
                  </Text>

                  {combat.log.length === 0 && (
                    <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 12, color: '#718096', fontStyle: 'italic' }}>
                      › Battle started. Your character enters the arena.
                    </Text>
                  )}

                  {combat.log.map((entry, i) => (
                    <Text key={i} style={{
                      fontFamily:        'Cinzel_400Regular',
                      fontSize:          12,
                      lineHeight:        22,
                      paddingVertical:   3,
                      borderBottomWidth: 1,
                      borderBottomColor: 'rgba(255,255,255,0.03)',
                      color: entry.includes('defeated') || entry.includes('killed') ? '#cc4444'
                           : entry.includes('EXP')     ? '#70c878'
                           : entry.includes('damage')  ? '#e8c870'
                           : '#8a9bb0',
                    }}>
                      › {entry}
                    </Text>
                  ))}
                </View>

                {/* Resultado */}
                {isOver && (
                  <View style={{ marginTop: 16, padding: 16, backgroundColor: combat.status === 'Victory' ? 'rgba(39,174,96,0.1)' : 'rgba(192,57,43,0.1)', borderWidth: 1, borderColor: combat.status === 'Victory' ? '#27ae60' : '#c0392b', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Cinzel_700Bold', fontSize: 18, letterSpacing: 6, color: combat.status === 'Victory' ? '#27ae60' : combat.status === 'Fled' ? '#c9a84c' : '#c0392b' }}>
                      {combat.status === 'Victory' ? '⚔ VICTORY' : combat.status === 'Fled' ? '🏃 FLED' : '💀 DEFEAT'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => { setCombat(null); setSelectedChar(null); }}
                      style={{ marginTop: 12, borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)', paddingHorizontal: 24, paddingVertical: 8 }}
                    >
                      <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 9, letterSpacing: 3, color: '#c9a84c' }}>
                        FIGHT AGAIN
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Botones de acción */}
                {!isOver && (
                  <View style={{ flexDirection: 'row', marginTop: 16, gap: 8 }}>
                    <ActionBtn icon="⚔️" label="Attack"         cost={acting ? '...' : 'Basic'} variant="attack" onPress={handleAttack} />
                    <ActionBtn icon="🌪️" label="Twisting Slash" cost="30 MP"   variant="skill"  onPress={handleAttack} />
                    <ActionBtn icon="🗡️" label="Impale"         cost="50 MP"   variant="skill"  onPress={handleAttack} />
                    <ActionBtn icon="🏃" label="Flee"           cost="Escape"  variant="heal"   onPress={handleFlee} />
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Instrucciones iniciales */}
        {!selectedMap && (
          <View style={{ alignItems: 'center', padding: 32 }}>
            <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 9, color: '#4a5568', letterSpacing: 3, textAlign: 'center' }}>
              SELECT A MAP AND A CHARACTER{'\n'}TO BEGIN YOUR JOURNEY
            </Text>
          </View>
        )}

        {/* Divisor ornamental */}
        <Text style={{ textAlign: 'center', color: '#7a5e1a', fontSize: 16, letterSpacing: 16, marginTop: 32, opacity: 0.5 }}>
          · · · ✦ · · ·
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}