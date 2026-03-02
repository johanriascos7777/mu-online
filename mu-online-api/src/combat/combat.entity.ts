// ============================================================
// ⚔️ COMBAT ENTITY — Estado de un combate
// ============================================================
//
// CombatSession representa UNA batalla en curso.
// Guarda el estado completo: quién pelea, cuántos turnos,
// el log de mensajes y si el combate terminó.
//
// En Sprint 2 con TypeORM esto se persistirá en DB.
// Por ahora vive en el Map del CombatService.
//
// ¿Por qué no es abstracta?
// Porque todos los combates tienen la misma estructura —
// solo cambian los participantes y el log.
// ============================================================

import { Character } from '../characters/entities/character.entity';
import { Monster } from '../monsters/entities/monster.entity';

// ── Estado del combate ───────────────────────────────────────
export enum CombatStatus {
  ACTIVE     = 'Active',
  VICTORY    = 'Victory',    // el personaje ganó
  DEFEAT     = 'Defeat',     // el personaje perdió
  FLED       = 'Fled',       // el personaje huyó
}

// ── Resultado de un turno ────────────────────────────────────
/**
 * Cada turno retorna este objeto con:
 *   - Los mensajes de lo que pasó (log)
 *   - El estado actual del combate
 *   - Si el combate terminó y por qué
 */
export interface TurnResult {
  turn:           number;
  log:            string[];   // mensajes del turno
  status:         CombatStatus;
  characterHp:    string;     // "390/500"
  characterMp:    string;     // "90/200"
  monsterHp:      string;     // "20/50"
  expGained?:     number;     // solo si hay victoria
}

// ============================================================
// CLASE CombatSession
// ============================================================
export class CombatSession {

  readonly id: string;
  readonly characterName: string;
  readonly mapName: string;

  // Referencias a los objetos POO reales
  // Gracias a esto podemos llamar character.takeDamage(),
  // monster.attack(), etc. directamente
  private character: Character;
  private monster: Monster;

  private turn: number;
  private status: CombatStatus;
  private fullLog: string[]; // log completo de toda la batalla

  constructor(
    character: Character,
    monster: Monster,
    mapName: string,
  ) {
    this.id            = `combat-${Date.now()}`;
    this.character     = character;
    this.monster       = monster;
    this.characterName = character.getName();
    this.mapName       = mapName;
    this.turn          = 0;
    this.status        = CombatStatus.ACTIVE;
    this.fullLog       = [];
  }

  // ── Getters ───────────────────────────────────────────────
  getStatus(): CombatStatus   { return this.status; }
  getTurn(): number           { return this.turn; }
  isActive(): boolean         { return this.status === CombatStatus.ACTIVE; }

  // ── executeTurn — el corazón del sistema de combate ──────
  /**
   * Ejecuta UN turno completo:
   *   1. El personaje ataca al monstruo
   *   2. Si el monstruo sigue vivo → contraataca
   *   3. Verifica si alguien murió
   *   4. Retorna el TurnResult
   *
   * 'skillName' es opcional — si no se pasa, ataque básico
   */
  executeTurn(skillName?: string): TurnResult {
    // Verifica que el combate siga activo
    if (!this.isActive()) {
      return this.buildTurnResult([`Combat is already ${this.status}`]);
    }

    this.turn++;
    const turnLog: string[] = [];

    // ── FASE 1: El personaje ataca ──────────────────────────
    const characterAttackResult = this.characterAttacks(skillName, turnLog);

    // Si el monstruo murió → victoria
    if (!this.monster.isAlive()) {
      return this.handleVictory(turnLog);
    }

    // ── FASE 2: El monstruo contraataca ────────────────────
    this.monsterAttacks(turnLog);

    // Si el personaje murió → derrota
    if (!this.character.isAlive()) {
      return this.handleDefeat(turnLog);
    }

    // ── FASE 3: El turno terminó sin muerte ─────────────────
    this.fullLog.push(...turnLog);
    return this.buildTurnResult(turnLog);
  }

  // ── characterAttacks — lógica de ataque del personaje ────
  private characterAttacks(skillName: string | undefined, log: string[]): void {
    // Por ahora calculamos daño base desde strength
    // En Sprint 2 esto usará los métodos de habilidad específicos
    const baseDamage = this.character.getStrength() * 2 + this.character.getLevel() * 5;

    // Aplica el daño al monstruo
    const result = this.monster.takeDamage(baseDamage);
    log.push(result.message);

    if (skillName) {
      log.push(`${this.characterName} channels energy into the attack!`);
    }
  }

  // ── monsterAttacks — lógica de ataque del monstruo ───────
  private monsterAttacks(log: string[]): void {
    // monster.attack() viene de la interfaz Attackable
    // Polimorfismo: cada monstruo tiene su propio attack()
    const attackMessage = this.monster.attack(this.characterName);
    log.push(attackMessage);

    // Aplica el daño al personaje
    const monsterDamage = this.monster.getAttackPower();
    const damageResult  = this.character.takeDamage(monsterDamage);
    log.push(damageResult);
  }

  // ── handleVictory ─────────────────────────────────────────
  private handleVictory(log: string[]): TurnResult {
    this.status = CombatStatus.VICTORY;

    // Obtiene la experiencia del monstruo derrotado
    const expReward = this.monster.getExperienceReward();
    const expResult = this.character.gainExperience(expReward);

    log.push(`💀 ${this.monster.getName()} has been defeated!`);
    log.push(expResult);

    this.fullLog.push(...log);
    return this.buildTurnResult(log, expReward);
  }

  // ── handleDefeat ──────────────────────────────────────────
  private handleDefeat(log: string[]): TurnResult {
    this.status = CombatStatus.DEFEAT;
    log.push(`💀 ${this.characterName} has been defeated...`);
    this.fullLog.push(...log);
    return this.buildTurnResult(log);
  }

  // ── buildTurnResult — construye la respuesta del turno ───
  private buildTurnResult(log: string[], expGained?: number): TurnResult {
    return {
      turn:         this.turn,
      log,
      status:       this.status,
      characterHp:  `${this.character.getHealth()}/${this.character.getMaxHealth()}`,
      characterMp:  `${this.character.getMana()}/${this.character.getMaxMana()}`,
      monsterHp:    `${this.monster.getHealth()}/${this.monster.getMaxHealth()}`,
      expGained,
    };
  }

  // ── toJSON — estado completo del combate ──────────────────
  toJSON(): object {
    return {
      id:            this.id,
      status:        this.status,
      turn:          this.turn,
      map:           this.mapName,
      character: {
        name:  this.characterName,
        hp:    `${this.character.getHealth()}/${this.character.getMaxHealth()}`,
        mp:    `${this.character.getMana()}/${this.character.getMaxMana()}`,
      },
      monster: {
        name:  this.monster.getName(),
        level: this.monster.getLevel(),
        hp:    `${this.monster.getHealth()}/${this.monster.getMaxHealth()}`,
      },
      log: this.fullLog,
    };
  }
} 