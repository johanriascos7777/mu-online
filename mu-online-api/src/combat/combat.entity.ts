// src/combat/combat.entity.ts

import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { Character } from '../characters/entities/character.entity';
import { Monster } from '../monsters/entities/monster.entity';

export enum CombatStatus {
    ACTIVE  = 'Active',
    VICTORY = 'Victory',
    DEFEAT  = 'Defeat',
    FLED    = 'Fled',
}

export interface TurnResult {
    turn:        number;
    log:         string[];
    status:      CombatStatus;
    characterHp: string;
    characterMp: string;
    monsterHp:   string;
    expGained?:  number;
}

@Entity('combats')
export class CombatSession {

    @PrimaryColumn()
    id: string;

    @Column({ type: 'enum', enum: CombatStatus, default: CombatStatus.ACTIVE })
    status: CombatStatus;

    @Column({ default: 0 })
    turn: number;

    @Column()
    mapName: string;

    // ── FK al personaje real en DB ────────────────────────
    @ManyToOne(() => Character, { eager: true })
    @JoinColumn({ name: 'characterId' })
    character: Character;

    // ── FK al monstruo real en DB ─────────────────────────
    // ── FIX: nullable: true porque el clon no tiene ID ───
    // El monstruo en combate es un CLON sin ID de DB.
    // Guardamos sus stats como columnas separadas debajo.
    @ManyToOne(() => Monster, { eager: true, nullable: true })
    @JoinColumn({ name: 'monsterId' })
    monster: Monster;

    // ── HP del monstruo en este combate ───────────────────
    // ¿Por qué esta columna extra?
    //
    // El monstruo en DB tiene HP=50 siempre (es el template).
    // Cada combate necesita su PROPIO HP que va bajando turno a turno.
    // Si modificáramos monster.health directamente, afectaríamos
    // el registro original — todos los combates futuros empezarían
    // con el HP dañado.
    //
    // Solución: guardamos el HP del combate aquí en 'combats'
    // y usamos monster solo para leer sus stats base (attack, defense).
    @Column({ default: 0 })
    monsterCurrentHp: number;

    // ── FIX: stats del monstruo guardados como columnas ──────────────
    // Al recargar el combate desde DB, this.monster viene null porque
    // el clon no tiene ID → monsterId es null en la tabla.
    // Solución: guardamos todo lo que necesitamos del monstruo
    // directamente en la fila del combate al crearlo.
    // Así executeTurn() puede leer monsterDefense, monsterAttackMin, etc.
    // sin depender de this.monster que puede ser null.
    @Column({ default: 0 })
    monsterMaxHp: number;

    @Column({ default: 0 })
    monsterDefense: number;

    @Column({ default: 0 })
    monsterAttackMin: number;

    @Column({ default: 0 })
    monsterAttackMax: number;

    @Column({ default: 0 })
    monsterExpReward: number;

    @Column({ default: '' })
    monsterName: string;

    @Column({ default: 0 })
    monsterLevel: number;

    @Column({ type: 'text', default: '[]' })
    log: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(character?: Character, monster?: Monster, mapName?: string) {
        if (character && monster && mapName) {
            this.id               = `combat-${Date.now()}`;
            this.character        = character;
            this.monster          = monster;
            this.mapName          = mapName;
            this.status           = CombatStatus.ACTIVE;
            this.turn             = 0;
            this.log              = '[]';
            // HP inicial del monstruo tomado de su maxHealth
            this.monsterCurrentHp = monster.getMaxHealth();
            // ── FIX: guardamos todos los stats del monstruo ──────────
            // Así los tenemos disponibles aunque monster venga null
            // al recargar el combate desde DB en turnos posteriores.
            this.monsterMaxHp     = monster.getMaxHealth();
            this.monsterDefense   = monster.defense ?? 0;
            this.monsterAttackMin = monster.attackMin ?? 0;
            this.monsterAttackMax = monster.attackMax ?? 0;
            this.monsterExpReward = monster.getExperienceReward();
            this.monsterName      = monster.getName();
            this.monsterLevel     = monster.getLevel();
        }
    }

    isActive(): boolean { return this.status === CombatStatus.ACTIVE; }
    getStatus(): string { return this.status; }

    private getLog(): string[] {
        try { return JSON.parse(this.log); } catch { return []; }
    }

    private addLog(message: string): void {
        const logs = this.getLog();
        logs.push(message);
        this.log = JSON.stringify(logs);
    }

    executeTurn(skillName?: string): TurnResult {
        this.turn++;
        const turnLog: string[] = [];

        // ① Personaje ataca al monstruo
        const damage    = this.characterAttacks();
        // ── FIX: usamos monsterDefense (columna) en lugar de
        // this.monster.defense que viene null al recargar desde DB
        const actualDmg = Math.max(1, damage - this.monsterDefense);

        // Usamos monsterCurrentHp — no monster.health (que es el template)
        this.monsterCurrentHp = Math.max(0, this.monsterCurrentHp - actualDmg);

        const hitMsg = `${this.monsterName} took ${actualDmg} damage. HP: ${this.monsterCurrentHp}/${this.monsterMaxHp}`;
        turnLog.push(hitMsg);
        this.addLog(hitMsg);

        // ② Verifica si monstruo murió
        if (this.monsterCurrentHp === 0) {
            return this.handleVictory(turnLog, this.monsterExpReward);
        }

        // ③ Monstruo contraataca
        // ── FIX: calculamos el daño con monsterAttackMin/Max (columnas)
        // en lugar de this.monster.getAttackPower() que es null
        const monsterDamage = Math.floor(
            Math.random() * (this.monsterAttackMax - this.monsterAttackMin + 1) + this.monsterAttackMin
        );
        const attackMsg = `${this.monsterName} attacks ${this.character.getName()}!`;
        const damageMsg = this.character.takeDamage(monsterDamage);
        turnLog.push(attackMsg);
        turnLog.push(damageMsg);
        this.addLog(attackMsg);
        this.addLog(damageMsg);

        // ④ Verifica si personaje murió
        if (!this.character.isAlive()) {
            return this.handleDefeat(turnLog);
        }

        return this.buildTurnResult(turnLog);
    }

    private characterAttacks(): number {
        return Math.floor(
            this.character.getStrength() * 2 +
            this.character.getLevel() * 5 +
            Math.random() * 10
        );
    }

    private handleVictory(turnLog: string[], expReward: number): TurnResult {
        this.status  = CombatStatus.VICTORY;
        const expMsg = this.character.gainExperience(expReward);
        turnLog.push(expMsg);
        this.addLog(expMsg);
        return this.buildTurnResult(turnLog, expReward);
    }

    private handleDefeat(turnLog: string[]): TurnResult {
        this.status = CombatStatus.DEFEAT;
        return this.buildTurnResult(turnLog);
    }

    private buildTurnResult(turnLog: string[], expGained?: number): TurnResult {
        return {
            turn:        this.turn,
            log:         turnLog,
            status:      this.status,
            characterHp: `${this.character.getHealth()}/${this.character.getMaxHealth()}`,
            characterMp: `${this.character.getMana()}/${this.character.getMaxMana()}`,
            // ── FIX: usamos monsterMaxHp (columna) en lugar de
            // this.monster.getMaxHealth() que es null
            monsterHp:   `${this.monsterCurrentHp}/${this.monsterMaxHp}`,
            expGained,
        };
    }

    toJSON() {
        return {
            id:        this.id,
            status:    this.status,
            turn:      this.turn,
            mapName:   this.mapName,
            character: this.character?.toJSON(),
            // ── FIX: construimos el objeto monster con las columnas
            // guardadas, sin depender de this.monster que puede ser null
            monster: {
                name:  this.monsterName,
                level: this.monsterLevel,
                hp:    `${this.monsterCurrentHp}/${this.monsterMaxHp}`,
            },
            log:       this.getLog(),
            createdAt: this.createdAt,
        };
    }
}