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
    @ManyToOne(() => Monster, { eager: true })
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
        const damage     = this.characterAttacks();
        const defense    = this.monster.defense ?? 0;
        const actualDmg  = Math.max(1, damage - defense);

        // Usamos monsterCurrentHp — no monster.health (que es el template)
        this.monsterCurrentHp = Math.max(0, this.monsterCurrentHp - actualDmg);

        const hitMsg = `${this.monster.getName()} took ${actualDmg} damage. HP: ${this.monsterCurrentHp}/${this.monster.getMaxHealth()}`;
        turnLog.push(hitMsg);
        this.addLog(hitMsg);

        // ② Verifica si monstruo murió
        if (this.monsterCurrentHp === 0) {
            return this.handleVictory(turnLog, this.monster.getExperienceReward());
        }

        // ③ Monstruo contraataca
        const monsterDamage = this.monster.getAttackPower();
        const damageMsg     = this.character.takeDamage(monsterDamage);
        const attackMsg     = `${this.monster.getName()} attacks ${this.character.getName()}!`;
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
        this.status   = CombatStatus.VICTORY;
        const expMsg  = this.character.gainExperience(expReward);
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
            monsterHp:   `${this.monsterCurrentHp}/${this.monster.getMaxHealth()}`,
            expGained,
        };
    }

    toJSON() {
        return {
            id:               this.id,
            status:           this.status,
            turn:             this.turn,
            mapName:          this.mapName,
            character:        this.character?.toJSON(),
            monster: {
                ...this.monster?.toJSON(),
                hp: `${this.monsterCurrentHp}/${this.monster?.getMaxHealth()}`,
            },
            log:              this.getLog(),
            createdAt:        this.createdAt,
        };
    }
}