//Segundo concepto: Herencia
// src/characters/entities/dark-wizard.entity.ts

import { Character, CharacterClass } from './character.entity';

// El Wizard es el mago: mucha energía y maná, poca vida
export class DarkWizard extends Character {

    constructor(name: string) {
        super(name, CharacterClass.DARK_WIZARD);
    }

    protected initializeStats(): void {
        this.strength = 18;
        this.agility = 18;
        this.vitality = 15;
        this.energy = 30;  // ← mucha más energía que el DK
        this.maxHealth = this.vitality * 2 + this.level * 3 + 60;
        this.health = this.maxHealth;
        this.maxMana = this.energy * 3 + 100; // ← mucho más maná
        this.mana = this.maxMana;
    }

    protected onLevelUp(): void {
        this.strength += 2;
        this.agility += 3;
        this.vitality += 3;
        this.energy += 10; // ← el wizard sube mucha energía
        this.maxHealth += this.vitality * 2;
        this.health = this.maxHealth;
        this.maxMana += this.energy * 3;
        this.mana = this.maxMana;
    }

    // ─── HECHIZOS EXCLUSIVOS DEL DARK WIZARD ─────────────────────────────
    castFireball(manaCost: number = 30): string {
        if (this.mana < manaCost) {
            return `❌ ${this.name} doesn't have enough mana!`;
        }
        this.mana -= manaCost;
        const damage = this.energy * 4 + this.level * 15;
        return `🔥 ${this.name} casts Fireball! Deals ${damage} fire damage!`;
    }

    castIceStorm(manaCost: number = 80): string {
        if (this.mana < manaCost) {
            return `❌ ${this.name} doesn't have enough mana!`;
        }
        this.mana -= manaCost;
        const damage = this.energy * 8 + this.level * 25;
        return `❄️ ${this.name} casts Ice Storm! Deals ${damage} ice damage to all enemies!`;
    }
}