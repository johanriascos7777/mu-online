// src/characters/entities/dark-wizard.entity.ts

import { ChildEntity } from 'typeorm';
import { Character, CharacterClass } from './character.entity';

@ChildEntity('DarkWizard')
export class DarkWizard extends Character {

    constructor(name?: string) {
        super(name || '', CharacterClass.DARK_WIZARD);
    }

    protected override initializeStats(): void {
        this.strength  = 18;
        this.agility   = 18;
        this.vitality  = 15;
        this.energy    = 30;
        this.maxHealth = this.vitality * 2 + this.level * 3 + 60;
        this.health    = this.maxHealth;
        this.maxMana   = this.energy * 3 + 100;
        this.mana      = this.maxMana;
    }

    protected override onLevelUp(): void {
        this.strength  += 2;
        this.agility   += 3;
        this.vitality  += 4;
        this.energy    += 10;
        this.maxHealth  = this.vitality * 2 + this.level * 3 + 60;
        this.maxMana    = this.energy * 3 + 100;
        this.health     = this.maxHealth;
        this.mana       = this.maxMana;
    }

    castFireball(targetName: string): string {
        const manaCost = 40;
        if (this.mana < manaCost) {
            return `${this.name} doesn't have enough mana! (needs ${manaCost} MP)`;
        }
        this.mana -= manaCost;
        const damage = Math.floor(this.energy * 3 + this.level * 12);
        return `${this.name} casts Fireball on ${targetName} for ${damage} fire damage!`;
    }

    castIceStorm(targetName: string): string {
        const manaCost = 60;
        if (this.mana < manaCost) {
            return `${this.name} doesn't have enough mana! (needs ${manaCost} MP)`;
        }
        this.mana -= manaCost;
        const damage = Math.floor(this.energy * 4 + this.level * 15);
        return `${this.name} casts Ice Storm on ${targetName} for ${damage} ice damage!`;
    }
}