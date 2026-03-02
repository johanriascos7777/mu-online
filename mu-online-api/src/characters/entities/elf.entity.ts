// src/characters/entities/elf.entity.ts

import { ChildEntity } from 'typeorm';
import { Character, CharacterClass } from './character.entity';

@ChildEntity('Elf')
export class Elf extends Character {

    constructor(name?: string) {
        super(name || '', CharacterClass.ELF);
    }

    protected override initializeStats(): void {
        this.strength  = 22;
        this.agility   = 28;
        this.vitality  = 20;
        this.energy    = 20;
        this.maxHealth = this.vitality * 2 + this.level * 4 + 80;
        this.health    = this.maxHealth;
        this.maxMana   = this.energy * 2 + 60;
        this.mana      = this.maxMana;
    }

    protected override onLevelUp(): void {
        this.agility  += 7;
        this.energy   += 5;
        this.vitality += 4;
        this.strength += 2;
        this.maxHealth = this.vitality * 2 + this.level * 4 + 80;
        this.maxMana   = this.energy * 2 + 60;
        this.health    = this.maxHealth;
        this.mana      = this.maxMana;
    }

    useTripleShot(targetName: string): string {
        const damagePerArrow = Math.floor(this.agility * 2 + this.level * 8);
        const totalDamage    = damagePerArrow * 3;
        return `${this.name} uses Triple Shot on ${targetName} for ${totalDamage} total damage (${damagePerArrow} x3 arrows)!`;
    }

    castHeal(): string {
        const manaCost = 40;
        if (this.mana < manaCost) {
            return `${this.name} doesn't have enough mana to cast Heal! (needs ${manaCost} MP)`;
        }
        this.mana -= manaCost;
        const healAmount = Math.floor(this.energy * 3 + this.level * 10);
        this.health = Math.min(this.health + healAmount, this.maxHealth);
        return `${this.name} casts Heal! Restored ${healAmount} HP. HP: ${this.health}/${this.maxHealth}`;
    }

    useDefenseUp(defenseBonus: number = 10): string {
        const manaCost = 25;
        if (this.mana < manaCost) {
            return `${this.name} doesn't have enough mana to use Defense Up! (needs ${manaCost} MP)`;
        }
        this.mana -= manaCost;
        return `${this.name} activates Defense Up! +${defenseBonus} defense. MP: ${this.mana}/${this.maxMana}`;
    }
}