// src/monsters/entities/monster.entity.ts
// Tercer concepto: Interfaces y Polimorfismo
// + TypeORM Sprint 2: mapeo a tabla monsters en PostgreSQL

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    TableInheritance,
} from 'typeorm';
import { Attackable } from '../../characters/interfaces/attackable.interface';

// ============================================================
// 📖 TYPEORM EN MONSTERS — mismo patrón que Character
// ============================================================
//
// Character usó:
//   @Entity('characters')
//   @TableInheritance(...)  ← una tabla, columna 'type'
//   @ChildEntity('DarkKnight') en cada hijo
//
// Monster usa EXACTAMENTE lo mismo:
//   @Entity('monsters')
//   @TableInheritance(...)  ← una tabla, columna 'type'
//   @ChildEntity('BudgeDragon') en BudgeDragon
//   @ChildEntity('Goblin') en Goblin
//
// En la DB quedará:
//   id | type        | name         | level | health | ...
//   1  | BudgeDragon | Budge Dragon | 3     | 50     | ...
//   2  | Goblin      | Goblin       | 5     | 35     | ...
// ============================================================

export enum MonsterType {
    NORMAL = 'Normal',
    ELITE  = 'Elite',
    BOSS   = 'Boss',
}

@Entity('monsters')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Monster implements Attackable {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    level: number;

    @Column({ type: 'enum', enum: MonsterType, default: MonsterType.NORMAL })
    monsterType: MonsterType;

    @Column()
    map: string;

    @Column({ default: 0 })
    health: number;

    @Column({ default: 0 })
    maxHealth: number;

    @Column({ default: 0 })
    attackMin: number;

    @Column({ default: 0 })
    attackMax: number;

    @Column({ default: 0 })
    defense: number;

    @Column({ default: 0 })
    experienceReward: number;

    // ── Constructor con parámetros opcionales ─────────────
    // Mismo GOTCHA que Character: TypeORM necesita instancias
    // vacías para hidratar desde la DB → parámetros con '?'
    constructor(
        name?: string,
        level?: number,
        map?: string,
        monsterType: MonsterType = MonsterType.NORMAL,
    ) {
        if (name && level && map) {
            this.name        = name;
            this.level       = level;
            this.map         = map;
            this.monsterType = monsterType;
            this.initializeStats();
        }
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

    // ── Getters ───────────────────────────────────────────
    getName(): string             { return this.name; }
    getLevel(): number            { return this.level; }
    getHealth(): number           { return this.health; }
    getMaxHealth(): number        { return this.maxHealth; }
    getExperienceReward(): number { return this.experienceReward; }
    isAlive(): boolean            { return this.health > 0; }

    toJSON() {
        return {
            id:        this.id,
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