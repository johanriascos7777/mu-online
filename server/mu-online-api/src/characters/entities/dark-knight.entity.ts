//Segundo concepto: Herencia

// src/characters/entities/dark-knight.entity.ts

import { Character, CharacterClass } from './character.entity';

// 'extends' = DarkKnight HEREDA todo de Character
// DarkKnight ES UN Character — relación "es un"
export class DarkKnight extends Character {

    private commandPoints: number; // stat exclusivo del DK

    constructor(name: string) {
        // 'super()' llama al constructor del padre (Character)
        super(name, CharacterClass.DARK_KNIGHT);
        this.commandPoints = 0;
    }

    // ─── IMPLEMENTACIÓN OBLIGATORIA del método abstracto ──────────────────
    // El DK es el tanque: mucha vida y fuerza, poca magia
    protected initializeStats(): void {
        this.strength = 28;
        this.agility = 20;
        this.vitality = 25;
        this.energy = 10;
        this.maxHealth = this.vitality * 2 + this.level * 5 + 100;
        this.health = this.maxHealth;
        this.maxMana = this.energy * 2 + 20;
        this.mana = this.maxMana;
    }

    // Al subir nivel, el DK prioriza fuerza y vita
    protected onLevelUp(): void {
        this.strength += 7;
        this.agility += 5;
        this.vitality += 7;
        this.energy += 1;
        this.maxHealth += this.vitality * 2;
        this.health = this.maxHealth; // restaurar HP al subir nivel
        this.maxMana += this.energy * 2;
        this.mana = this.maxMana;
    }

    // ─── MÉTODO EXCLUSIVO DEL DARK KNIGHT ────────────────────────────────
    useTwistingSlash(): string {
        const damage = this.strength * 3 + this.level * 10;
        return `⚔️ ${this.name} uses Twisting Slash! Deals ${damage} damage to nearby enemies!`;
    }

    useImpale(): string {
        const damage = this.strength * 5;
        return `🗡️ ${this.name} uses Impale! Critical strike for ${damage} damage!`;
    }
}