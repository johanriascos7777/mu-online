// src/components/03-organisms/BossShowcase/index.tsx
//
// Organismo SMART — demo interactiva del juego
//
// Inicia automáticamente un combate contra el Ancient Dragon
// con un personaje aleatorio. El usuario puede presionar
// los skills y ver el battle log en acción.
//
// NO requiere que el usuario elija mapa ni personaje.
// Es una sección de demostración fija en el home.

import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { CharacterSilhouette } from '../../01-atoms/CharacterSilhouette';
import { MonsterSilhouette }   from '../../01-atoms/MonsterSilhouette';
import { StatBar }             from '../../01-atoms/StatBar';
import { ActionBtn }           from '../../01-atoms/ActionBtn';
import { LevelBadge }          from '../../01-atoms/LevelBadge';
import type { CharacterClassName } from '../../01-atoms/ClassLabel';

interface CombatState {
  id:      string;
  status:  string;
  turn:    number;
  mapName: string;
  character: {
    name:  string;
    class: CharacterClassName;
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

// Skills por clase
const SKILLS: Record<string, Array<{ icon: string; label: string; cost: string; variant: 'attack' | 'skill' | 'heal' }>> = {
  DarkKnight: [
    { icon: '⚔️', label: 'Attack',         cost: 'Basic',   variant: 'attack' },
    { icon: '🌪️', label: 'Twisting Slash', cost: '30 MP',   variant: 'skill'  },
    { icon: '🗡️', label: 'Impale',         cost: '50 MP',   variant: 'skill'  },
    { icon: '🛡️', label: 'Death Stab',     cost: '70 MP',   variant: 'skill'  },
  ],
  DarkWizard: [
    { icon: '⚔️', label: 'Attack',   cost: 'Basic',  variant: 'attack' },
    { icon: '🔥', label: 'Fireball', cost: '30 MP',  variant: 'skill'  },
    { icon: '❄️', label: 'Ice Storm', cost: '50 MP', variant: 'skill'  },
    { icon: '⚡', label: 'Lightning', cost: '70 MP', variant: 'skill'  },
  ],
  Elf: [
    { icon: '⚔️', label: 'Attack',       cost: 'Basic',  variant: 'attack' },
    { icon: '🏹', label: 'Triple Shot',  cost: '30 MP',  variant: 'skill'  },
    { icon: '💚', label: 'Heal',         cost: '40 MP',  variant: 'heal'   },
    { icon: '🛡️', label: 'Defense',     cost: '50 MP',  variant: 'skill'  },
  ],
};

export interface BossShowcaseProps {
  apiUrl?: string;
}

export function BossShowcase({ apiUrl = 'http://localhost:3000' }: BossShowcaseProps) {

  const [combat,   setCombat]   = useState<CombatState | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [acting,   setActing]   = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [charHp,   setCharHp]   = useState('');
  const [charMp,   setCharMp]   = useState('');
  const [monHp,    setMonHp]    = useState('');

  // ── Carga personajes y elige uno aleatorio ────────────────
  async function startDemoCombat() {
    setLoading(true);
    setError(null);
    setCombat(null);
    setCharHp('');
    setCharMp('');
    setMonHp('');

    try {
      // 1. Obtiene los personajes disponibles
      const charsRes = await fetch(`${apiUrl}/characters`);
      const chars    = await charsRes.json();

      if (!chars || chars.length === 0) {
        setError('No characters found. Create one with POST /characters');
        setLoading(false);
        return;
      }

      // 2. Elige un personaje aleatorio
      const randomChar = chars[Math.floor(Math.random() * chars.length)];

      // 3. Inicia combate — el monstruo será aleatorio de Lorencia
      // (Ancient Dragon, BudgeDragon o Goblin según lo configurado)
      const combatRes  = await fetch(`${apiUrl}/combat/start`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          characterName: randomChar.name,
          mapName:       'lorencia',
        }),
      });
      const combatData = await combatRes.json();
      setCombat(combatData.combat);
    } catch (err) {
      setError('Backend not available');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { startDemoCombat(); }, [apiUrl]);

  // ── Atacar ────────────────────────────────────────────────
  async function handleAction() {
    if (!combat || acting || combat.status !== 'Active') return;
    setActing(true);
    try {
      const res  = await fetch(`${apiUrl}/combat/${combat.id}/attack`, { method: 'POST' });
      const data = await res.json();
      const r    = data.result;
      setCharHp(r.characterHp);
      setCharMp(r.characterMp);
      setMonHp(r.monsterHp);
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

  // ── Stats a mostrar ───────────────────────────────────────
  const displayCharHp = charHp || combat?.character.stats.hp || '0/0';
  const displayCharMp = charMp || combat?.character.stats.mp || '0/0';
  const displayMonHp  = monHp  || combat?.monster.hp         || '0/0';
  const charHpParsed  = parseStat(displayCharHp);
  const charMpParsed  = parseStat(displayCharMp);
  const monHpParsed   = parseStat(displayMonHp);
  const isOver        = combat?.status !== 'Active';
  const skills        = SKILLS[combat?.character?.class ?? 'DarkKnight'];

  return (
    <View style={{ backgroundColor: '#0a0a12', borderWidth: 1, borderColor: 'rgba(201,168,76,0.15)', marginHorizontal: 16, marginTop: 8 }}>

      {/* Título */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.1)' }}>
        <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.2)' }} />
        <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 9, letterSpacing: 5, color: '#c9a84c' }}>
          ⚔ COMBAT ARENA
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.2)' }} />
      </View>

      {/* Loading */}
      {loading && (
        <View style={{ alignItems: 'center', padding: 40 }}>
          <ActivityIndicator color="#c9a84c" size="large" />
          <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 8, color: '#c9a84c', letterSpacing: 3, marginTop: 12 }}>
            LOADING COMBAT...
          </Text>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={{ alignItems: 'center', padding: 32 }}>
          <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 9, color: '#c0392b', letterSpacing: 2 }}>
            {error}
          </Text>
        </View>
      )}

      {/* Combate */}
      {combat && !loading && (
        <>
          {/* Arena */}
          <View style={{ flexDirection: 'row', padding: 16, gap: 12, alignItems: 'flex-start' }}>

            {/* Panel personaje */}
            <View style={{ flex: 1, backgroundColor: '#0e0e1a', borderWidth: 1, borderColor: 'rgba(201,168,76,0.12)' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' }}>
                <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 7, letterSpacing: 3, color: '#7a5e1a' }}>HERO</Text>
                <Text style={{ fontFamily: 'Cinzel_700Bold', fontSize: 13, color: '#e0d0a0' }}>{combat.character.name}</Text>
              </View>
              <View style={{ height: 150, backgroundColor: '#10050a', alignItems: 'center', justifyContent: 'center' }}>
                <CharacterSilhouette characterClass={combat.character.class} size="combat" />
              </View>
              <View style={{ padding: 10, gap: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 11, color: '#e0d0a0' }}>
                    {combat.character.class === 'DarkKnight' ? 'Dark Knight' :
                     combat.character.class === 'DarkWizard' ? 'Dark Wizard' : 'Fairy Elf'}
                  </Text>
                  <LevelBadge level={combat.character.level} variant="combat" />
                </View>
                <StatBar label="HP" currentValue={charHpParsed.current} maxValue={charHpParsed.max} type="hp" />
                <StatBar label="MP" currentValue={charMpParsed.current} maxValue={charMpParsed.max} type="mp" />
              </View>
            </View>

            {/* VS */}
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 55, gap: 8, width: 48 }}>
              <View style={{ width: 1, height: 50, backgroundColor: 'rgba(201,168,76,0.2)' }} />
              <Text style={{ fontFamily: 'Cinzel_700Bold', fontSize: 20, color: '#c9a84c' }}>VS</Text>
              <View style={{ width: 1, height: 50, backgroundColor: 'rgba(201,168,76,0.2)' }} />
            </View>

            {/* Panel monstruo */}
            <View style={{ flex: 1, backgroundColor: '#0e0e1a', borderWidth: 1, borderColor: 'rgba(201,168,76,0.25)' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' }}>
                <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 7, letterSpacing: 3, color: '#7a5e1a' }}>
                  MONSTER · LORENCIA
                </Text>
                <Text style={{ fontFamily: 'Cinzel_700Bold', fontSize: 13, color: '#f0d080' }}>
                  {combat.monster.name}
                </Text>
              </View>
              <View style={{ height: 150, backgroundColor: '#05080f', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <MonsterSilhouette monsterType="BudgeDragon" size="combat" />
                {/* Badge BOSS */}
                <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(201,168,76,0.15)', borderWidth: 1, borderColor: '#c9a84c', paddingHorizontal: 8, paddingVertical: 3 }}>
                  <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 7, color: '#f0d080', letterSpacing: 2 }}>
                    ⚠ BOSS
                  </Text>
                </View>
              </View>
              <View style={{ padding: 10, gap: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 11, color: '#f0d080' }}>{combat.monster.name}</Text>
                  <LevelBadge level={combat.monster.level} variant="combat" />
                </View>
                <StatBar label="HP" currentValue={monHpParsed.current} maxValue={monHpParsed.max} type="hp" />
              </View>
            </View>
          </View>

          {/* Battle Log */}
          <View style={{ marginHorizontal: 16, marginBottom: 12, backgroundColor: '#0e0e1a', borderWidth: 1, borderColor: 'rgba(201,168,76,0.1)', padding: 12 }}>
            <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 7, letterSpacing: 4, color: '#7a5e1a', marginBottom: 8, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.1)' }}>
              ⚔ BATTLE LOG — LORENCIA — TURN {combat.turn}
            </Text>

            <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 11, color: '#718096', fontStyle: 'italic', marginBottom: 4 }}>
              › Battle started. Your character enters the arena.
            </Text>

            {combat.log.map((entry, i) => (
              <Text key={i} style={{
                fontFamily:        'Cinzel_400Regular',
                fontSize:          11,
                lineHeight:        22,
                paddingVertical:   2,
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
            <View style={{ marginHorizontal: 16, marginBottom: 12, padding: 14, backgroundColor: combat.status === 'Victory' ? 'rgba(39,174,96,0.1)' : 'rgba(192,57,43,0.1)', borderWidth: 1, borderColor: combat.status === 'Victory' ? '#27ae60' : '#c0392b', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Cinzel_700Bold', fontSize: 18, letterSpacing: 6, color: combat.status === 'Victory' ? '#27ae60' : '#c0392b' }}>
                {combat.status === 'Victory' ? '⚔ VICTORY' : '💀 DEFEAT'}
              </Text>
              <TouchableOpacity
                onPress={startDemoCombat}
                style={{ marginTop: 10, borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)', paddingHorizontal: 24, paddingVertical: 8 }}
              >
                <Text style={{ fontFamily: 'Cinzel_400Regular', fontSize: 9, letterSpacing: 3, color: '#c9a84c' }}>
                  ⚔ FIGHT AGAIN
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Botones de acción */}
          {!isOver && (
            <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16, gap: 8 }}>
              {skills.map(skill => (
                <ActionBtn
                  key={skill.label}
                  icon={skill.icon}
                  label={skill.label}
                  cost={acting ? '...' : skill.cost}
                  variant={skill.variant}
                  onPress={handleAction}
                />
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
}