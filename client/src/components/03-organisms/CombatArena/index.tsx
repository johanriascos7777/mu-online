// src/components/03-organisms/CombatArena/index.tsx
//
// Organismo SMART — pantalla completa de combate
//
// Conecta con:
//   POST /combat/start           → inicia el combate
//   POST /combat/:id/attack      → ejecuta un turno
//   POST /combat/:id/flee        → huir del combate
//   GET  /combat/:id             → estado actual
//
// Componentes que usa:
//   CharacterSilhouette (átomo)
//   MonsterSilhouette   (átomo)
//   StatBar             (átomo)
//   ActionBtn           (átomo)
//   LevelBadge          (átomo)

import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CharacterSilhouette } from '../../01-atoms/CharacterSilhouette';
import { MonsterSilhouette }   from '../../01-atoms/MonsterSilhouette';
import { StatBar }             from '../../01-atoms/StatBar';
import { LevelBadge }          from '../../01-atoms/LevelBadge';
import { ActionBtn }           from '../../01-atoms/ActionBtn';
import type { CharacterClassName } from '../../01-atoms/ClassLabel';
import type { MonsterType }        from '../../01-atoms/MonsterSilhouette';

// ── Tipos del backend ─────────────────────────────────────────
interface CombatCharacter {
  name:  string;
  class: CharacterClassName;
  level: number;
  stats: { hp: string; mp: string };
}

interface CombatMonster {
  name:  string;
  level: number;
  hp:    string;  // '20/50'
}

interface CombatState {
  id:        string;
  status:    'Active' | 'Victory' | 'Defeat' | 'Fled';
  turn:      number;
  mapName:   string;
  character: CombatCharacter;
  monster:   CombatMonster;
  log:       string[];
}

interface TurnResult {
  turn:        number;
  log:         string[];
  status:      string;
  characterHp: string;
  characterMp: string;
  monsterHp:   string;
  expGained?:  number;
}

// ── Helper: '155/155' → { current, max, pct } ────────────────
function parseStat(statString: string) {
  const [current, max] = (statString ?? '0/0').split('/').map(Number);
  const pct = max > 0 ? (current / max) * 100 : 0;
  return { current, max, pct };
}

// ── Detecta el tipo de monstruo por nombre ────────────────────
function getMonsterType(name: string): MonsterType {
  if (name?.toLowerCase().includes('goblin')) return 'Goblin';
  return 'BudgeDragon';
}

// ── Props ─────────────────────────────────────────────────────
export interface CombatArenaProps {
  apiUrl?:        string;
  characterName:  string;
  mapName:        string;
  onCombatEnd?:   (status: string) => void;
}

export function CombatArena({
  apiUrl        = 'http://localhost:3000',
  characterName,
  mapName,
  onCombatEnd,
}: CombatArenaProps) {

  const [combat,     setCombat]     = useState<CombatState | null>(null);
  const [hpDisplay,  setHpDisplay]  = useState<{ char: string; monster: string } | null>(null);
  const [mpDisplay,  setMpDisplay]  = useState<string | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [acting,     setActing]     = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  // ── 1. Inicia el combate al montar ───────────────────────────
  useEffect(() => {
    fetch(`${apiUrl}/combat/start`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ characterName, mapName }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setCombat(data.combat);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl, characterName, mapName]);

  // ── 2. Atacar ────────────────────────────────────────────────
  async function handleAttack() {
    if (!combat || acting) return;
    setActing(true);

    try {
      const res = await fetch(`${apiUrl}/combat/${combat.id}/attack`, {
        method: 'POST',
      });
      const data = await res.json();
      const result: TurnResult = data.result;

      // Actualiza HP en pantalla inmediatamente
      setHpDisplay({ char: result.characterHp, monster: result.monsterHp });
      setMpDisplay(result.characterMp);

      // Actualiza el estado del combate
      setCombat(prev => prev ? {
        ...prev,
        status: result.status as any,
        turn:   result.turn,
        log:    [...(prev.log ?? []), ...result.log],
      } : prev);

      // Notifica si el combate terminó
      if (result.status !== 'Active') {
        onCombatEnd?.(result.status);
      }
    } catch (err) {
      setError('Error al atacar');
    } finally {
      setActing(false);
    }
  }

  // ── 3. Huir ──────────────────────────────────────────────────
  async function handleFlee() {
    if (!combat || acting) return;
    setActing(true);
    try {
      await fetch(`${apiUrl}/combat/${combat.id}/flee`, { method: 'POST' });
      setCombat(prev => prev ? { ...prev, status: 'Fled' } : prev);
      onCombatEnd?.('Fled');
    } catch {
      setError('Error al huir');
    } finally {
      setActing(false);
    }
  }

  // ── Estados de carga / error ─────────────────────────────────
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#050508', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#c9a84c" />
        <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 9, letterSpacing: 3, color: '#c9a84c', marginTop: 16 }}>
          ENTERING COMBAT...
        </Text>
      </View>
    );
  }

  if (error || !combat) {
    return (
      <View style={{ flex: 1, backgroundColor: '#050508', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 32, marginBottom: 12 }}>⚠️</Text>
        <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 9, letterSpacing: 2, color: '#c0392b', textAlign: 'center' }}>
          {error ?? 'COMBAT ERROR'}
        </Text>
      </View>
    );
  }

  // ── HP y MP actuales ─────────────────────────────────────────
  const charHp      = parseStat(hpDisplay?.char    ?? combat.character.stats.hp);
  const charMp      = parseStat(mpDisplay           ?? combat.character.stats.mp);
  const monsterHp   = parseStat(hpDisplay?.monster  ?? combat.monster.hp);
  const isOver      = combat.status !== 'Active';
  const monsterType = getMonsterType(combat.monster.name);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#050508' }} contentContainerStyle={{ paddingBottom: 16 }}>

      {/* ── Título ── */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.2)' }} />
        <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 9, letterSpacing: 5, color: '#c9a84c' }}>
          ⚔ COMBAT ARENA
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.2)' }} />
      </View>

      {/* ── Arena: Personaje vs Monstruo ── */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 12, gap: 10 }}>

        {/* Panel personaje */}
        <View style={{ flex: 1, backgroundColor: '#0e0e1a', borderWidth: 1, borderColor: 'rgba(201,168,76,0.12)' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' }}>
            <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 8, letterSpacing: 3, color: '#7a5e1a' }}>HERO</Text>
            <Text style={{ fontFamily: 'Cinzel_600SemiBold', fontSize: 14, color: '#e0d0a0' }}>{combat.character.name}</Text>
          </View>

          {/* Artwork personaje */}
          <View style={{ height: 140, backgroundColor: '#10050a', alignItems: 'center', justifyContent: 'center' }}>
            <CharacterSilhouette characterClass={combat.character.class} size="combat" />
          </View>

          {/* Stats */}
          <View style={{ padding: 10, gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 11, color: '#e0d0a0' }}>
                {combat.character.class === 'DarkKnight' ? 'Dark Knight' :
                 combat.character.class === 'DarkWizard' ? 'Dark Wizard' : 'Fairy Elf'}
              </Text>
              <LevelBadge level={combat.character.level} variant="combat" />
            </View>
            <StatBar label="HP" currentValue={charHp.current} maxValue={charHp.max} type="hp" />
            <StatBar label="MP" currentValue={charMp.current} maxValue={charMp.max} type="mp" />
          </View>
        </View>

        {/* VS */}
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 40, gap: 8 }}>
          <View style={{ width: 1, height: 50, backgroundColor: 'rgba(201,168,76,0.2)' }} />
          <Text style={{ fontFamily: 'Cinzel_700Bold', fontSize: 20, color: '#c9a84c' }}>VS</Text>
          <View style={{ width: 1, height: 50, backgroundColor: 'rgba(201,168,76,0.2)' }} />
        </View>

        {/* Panel monstruo */}
        <View style={{ flex: 1, backgroundColor: '#0e0e1a', borderWidth: 1, borderColor: 'rgba(201,168,76,0.12)' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' }}>
            <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 8, letterSpacing: 3, color: '#7a5e1a' }}>
              MONSTER · {combat.mapName?.toUpperCase()}
            </Text>
            <Text style={{ fontFamily: 'Cinzel_600SemiBold', fontSize: 14, color: '#e0d0a0' }}>{combat.monster.name}</Text>
          </View>

          {/* Artwork monstruo */}
          <View style={{ height: 140, backgroundColor: '#05080f', alignItems: 'center', justifyContent: 'center' }}>
            <MonsterSilhouette monsterType={monsterType} size="combat" />
          </View>

          {/* Stats monstruo */}
          <View style={{ padding: 10, gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 11, color: '#e0d0a0' }}>{combat.monster.name}</Text>
              <LevelBadge level={combat.monster.level} variant="combat" />
            </View>
            <StatBar label="HP" currentValue={monsterHp.current} maxValue={monsterHp.max} type="hp" />
          </View>
        </View>
      </View>

      {/* ── Battle Log ── */}
      <View style={{ margin: 12, backgroundColor: '#0e0e1a', borderWidth: 1, borderColor: 'rgba(201,168,76,0.1)', padding: 12 }}>
        <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 8, letterSpacing: 4, color: '#7a5e1a', marginBottom: 8, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.1)' }}>
          ⚔ BATTLE LOG — {combat.mapName?.toUpperCase()} — TURN {combat.turn}
        </Text>

        {combat.log.length === 0 && (
          <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 11, color: '#4a5568', fontStyle: 'italic' }}>
            › Battle started. Your character enters the arena.
          </Text>
        )}

        {combat.log.map((entry, i) => (
          <Text
            key={i}
            style={{
              fontFamily: 'Cinzel_400Regular',
              fontSize:   11,
              lineHeight: 20,
              paddingVertical: 2,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(255,255,255,0.03)',
              color: entry.includes('defeated') || entry.includes('killed') ? '#cc4444'
                   : entry.includes('EXP')     ? '#70c878'
                   : entry.includes('damage')  ? '#e8c870'
                   : '#8a9bb0',
            }}
          >
            › {entry}
          </Text>
        ))}
      </View>

      {/* ── Estado del combate: Victoria / Derrota ── */}
      {isOver && (
        <View style={{ margin: 12, padding: 16, backgroundColor: combat.status === 'Victory' ? 'rgba(39,174,96,0.1)' : 'rgba(192,57,43,0.1)', borderWidth: 1, borderColor: combat.status === 'Victory' ? '#27ae60' : '#c0392b', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Cinzel_700Bold', fontSize: 18, color: combat.status === 'Victory' ? '#27ae60' : '#c0392b', letterSpacing: 4 }}>
            {combat.status === 'Victory' ? '⚔ VICTORY' : combat.status === 'Defeat' ? '💀 DEFEAT' : '🏃 FLED'}
          </Text>
        </View>
      )}

      {/* ── Botones de acción ── */}
      {!isOver && (
        <View style={{ flexDirection: 'row', paddingHorizontal: 12, gap: 8 }}>
          <ActionBtn
            icon="⚔️"
            label="Attack"
            cost={acting ? '...' : 'Basic'}
            variant="attack"
            onPress={handleAttack}
          />
          <ActionBtn icon="🌪️" label="Twisting Slash" cost="30 MP" variant="skill"  onPress={handleAttack} />
          <ActionBtn icon="🗡️" label="Impale"         cost="50 MP" variant="skill"  onPress={handleAttack} />
          <ActionBtn icon="🏃" label="Flee"           cost="Escape" variant="heal"  onPress={handleFlee}   />
        </View>
      )}

    </ScrollView>
  );
}