// Tercer concepto: Interfaces y Polimorfismo
// src/monsters/entities/monster.entity.ts

import { Attackable } from '../../characters/interfaces/attackable.interface';

export enum MonsterType {
    NORMAL = 'Normal',
    ELITE  = 'Elite',
    BOSS   = 'Boss',
}

export abstract class Monster implements Attackable {
    protected name: string;
    protected level: number;
    protected health: number;
    protected maxHealth: number;
    protected attackMin: number;
    protected attackMax: number;
    protected defense: number;
    protected experienceReward: number;
    protected monsterType: MonsterType;
    protected map: string;

    constructor(
        name: string,
        level: number,
        map: string,
        monsterType: MonsterType = MonsterType.NORMAL,
    ) {
        this.name        = name;
        this.level       = level;
        this.map         = map;
        this.monsterType = monsterType;
        this.initializeStats();
    }

    protected abstract initializeStats(): void;

    // ── Implementación del contrato Attackable ─────────────
    attack(targetName: string): string {
        const damage = this.getAttackPower();
        return `👹 ${this.name} attacks ${targetName} for ${damage} damage!`;
    }

    getAttackPower(): number {
        return Math.floor(
            Math.random() * (this.attackMax - this.attackMin + 1) + this.attackMin
        );
    }

    takeDamage(damage: number): { message: string; isDead: boolean; expReward?: number } {
        const actualDamage = Math.max(1, damage - this.defense);
        this.health        = Math.max(0, this.health - actualDamage);

        if (this.health === 0) {
            return {
                message:   `💀 ${this.name} has been killed! +${this.experienceReward} EXP`,
                isDead:    true,
                expReward: this.experienceReward,
            };
        }

        return {
            message: `${this.name} took ${actualDamage} damage. HP: ${this.health}/${this.maxHealth}`,
            isDead:  false,
        };
    }

    // ── Getters — necesarios para CombatSession ────────────
    // CombatSession necesita leer estas propiedades para
    // construir el TurnResult y el toJSON() del combate.
    // 'protected' no es suficiente porque CombatSession
    // no es hija de Monster — necesita acceso 'public'.
    getName(): string          { return this.name; }
    getLevel(): number         { return this.level; }
    getHealth(): number        { return this.health; }
    getMaxHealth(): number     { return this.maxHealth; }
    getExperienceReward(): number { return this.experienceReward; }

    // ── isAlive — usado en CombatSession para verificar ───
    isAlive(): boolean { return this.health > 0; }

    toJSON() {
        return {
            name:      this.name,
            level:     this.level,
            type:      this.monsterType,
            map:       this.map,
            hp:        `${this.health}/${this.maxHealth}`,
            attack:    `${this.attackMin}-${this.attackMax}`,
            defense:   this.defense,
            expReward: this.experienceReward,
        };
    }
}