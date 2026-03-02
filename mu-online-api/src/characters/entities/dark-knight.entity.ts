// src/characters/entities/dark-knight.entity.ts

import { ChildEntity } from 'typeorm';
import { Character, CharacterClass } from './character.entity';

// ============================================================
// 📖 @ChildEntity() — Herencia en TypeORM
// ============================================================
//
// TypeORM tiene 3 estrategias para mapear herencia a DB:
//
//   1. Single Table Inheritance (STI) ← usamos esta
//      → Una sola tabla 'characters' para todas las clases
//      → Una columna 'type' discrimina DarkKnight/DarkWizard/Elf
//      → @ChildEntity() en cada clase hija
//
//   2. Concrete Table Inheritance
//      → Una tabla por cada clase concreta
//      → Más tablas, más complejo
//
//   3. Mapped Superclass
//      → La clase base NO tiene tabla propia
//
// ¿Por qué STI para nosotros?
//   Todos los personajes tienen los mismos campos (name, level,
//   strength, etc.) — tiene sentido tenerlos en una sola tabla.
//   La columna 'type' dirá si es 'DarkKnight', 'DarkWizard' o 'Elf'.
//
// En la DB quedará así:
//   id | name  | type       | level | strength | agility | ...
//   1  | Johan | DarkKnight | 12    | 112      | 80      | ...
//   2  | Merlin| DarkWizard | 8     | 34       | 42      | ...
//   3  | Arwen | Elf        | 5     | 22       | 75      | ...
// ============================================================

@ChildEntity('DarkKnight') // ← valor que irá en la columna 'type'
export class DarkKnight extends Character {

    constructor(name?: string) {
        // 'name?' opcional — mismo motivo que en Character:
        // TypeORM necesita instancias vacías para hidratar desde DB
        super(name || '', CharacterClass.DARK_KNIGHT);
    }

    protected override initializeStats(): void {
        this.strength  = 28;
        this.agility   = 20;
        this.vitality  = 25;
        this.energy    = 10;
        this.maxHealth = this.vitality * 2 + this.level * 5 + 100;
        this.health    = this.maxHealth;
        this.maxMana   = this.energy * 2 + 20;
        this.mana      = this.maxMana;
    }

    protected override onLevelUp(): void {
        this.strength  += 7;
        this.agility   += 5;
        this.vitality  += 7;
        this.energy    += 1;
        this.maxHealth  = this.vitality * 2 + this.level * 5 + 100;
        this.maxMana    = this.energy * 2 + 20;
        this.health     = this.maxHealth;
        this.mana       = this.maxMana;
    }

    // ── Habilidades exclusivas ────────────────────────────
    // Estos métodos NO se guardan en DB — son lógica de negocio pura
    useTwistingSlash(targetName: string): string {
        const manaCost = 30;
        if (this.mana < manaCost) {
            return `${this.name} doesn't have enough mana! (needs ${manaCost} MP)`;
        }
        this.mana -= manaCost;
        const damage = Math.floor(this.strength * 3 + this.level * 10);
        return `${this.name} uses Twisting Slash on ${targetName} for ${damage} damage!`;
    }

    useImpale(targetName: string): string {
        const manaCost = 50;
        if (this.mana < manaCost) {
            return `${this.name} doesn't have enough mana! (needs ${manaCost} MP)`;
        }
        this.mana -= manaCost;
        const damage = Math.floor(this.strength * 4 + this.level * 15);
        return `${this.name} uses Impale on ${targetName} for ${damage} damage!`;
    }
}