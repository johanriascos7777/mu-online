/*
Primer concepto POO: Clases y Encapsulamiento
+ TypeORM Sprint 2: relaciones entre tablas
*/

// src/characters/entities/character.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    TableInheritance,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Item } from '../../items/entities/item.entity';

// ============================================================
// 📖 RELACIONES EN TYPEORM — Many-to-Many
// ============================================================
//
// Un personaje puede tener MUCHOS items.
// Un item puede estar en el inventario de MUCHOS personajes.
// → Relación Many-to-Many
//
// TypeORM crea automáticamente la tabla intermedia:
//   character_items:
//     characterId | itemId
//     1           | Weapon-17234...
//     1           | Armor-17234...
//     2           | Weapon-17234...
//
// @ManyToMany(() => Item)
//   → "Character tiene muchos Items"
//   → El () => Item es una función para evitar referencias circulares
//
// @JoinTable()
//   → Solo en el lado "dueño" de la relación (Character)
//   → Le dice a TypeORM que Character es responsable de la tabla intermedia
//   → Sin @JoinTable() → TypeORM no crea character_items
//
// En POO esto se llama ASOCIACIÓN:
//   Character TIENE Items (composición de objetos)
//   No hereda de Item, no implementa Item
//   Solo los CONTIENE en su inventario
// ============================================================

export enum CharacterClass {
    DARK_KNIGHT     = 'DarkKnight',
    DARK_WIZARD     = 'DarkWizard',
    ELF             = 'Elf',
    MAGIC_GLADIATOR = 'MagicGladiator',
    DARK_LORD       = 'DarkLord',
}

@Entity('characters')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Character {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'enum', enum: CharacterClass })
    characterClass: CharacterClass;

    @Column({ default: 1 })
    level: number;

    @Column({ default: 0 })
    experience: number;

    @Column({ default: 0 })
    health: number;

    @Column({ default: 0 })
    maxHealth: number;

    @Column({ default: 0 })
    mana: number;

    @Column({ default: 0 })
    maxMana: number;

    @Column({ default: 0 })
    strength: number;

    @Column({ default: 0 })
    agility: number;

    @Column({ default: 0 })
    vitality: number;

    @Column({ default: 0 })
    energy: number;

    // ── RELACIÓN Many-to-Many con Items ───────────────────
    // { eager: true } → carga los items automáticamente en cada findOne
    // Sin eager: false → deberías pedir los items explícitamente
    @ManyToMany(() => Item, { eager: true, cascade: true })
    @JoinTable({
        name: 'character_items',           // nombre de la tabla intermedia
        joinColumn:        { name: 'characterId' },
        inverseJoinColumn: { name: 'itemId' },
    })
    items: Item[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(name?: string, characterClass?: CharacterClass) {
        if (name && characterClass) {
            this.name           = name;
            this.characterClass = characterClass;
            this.level          = 1;
            this.experience     = 0;
            this.items          = []; // inventario vacío al crear
            this.initializeStats();
        }
    }

    protected abstract initializeStats(): void;
    protected abstract onLevelUp(): void;

    getId(): number              { return this.id; }
    getName(): string            { return this.name; }
    getLevel(): number           { return this.level; }
    getHealth(): number          { return this.health; }
    getMana(): number            { return this.mana; }
    getMaxHealth(): number       { return this.maxHealth; }
    getMaxMana(): number         { return this.maxMana; }
    getStrength(): number        { return this.strength; }
    getAgility(): number         { return this.agility; }
    getVitality(): number        { return this.vitality; }
    getEnergy(): number          { return this.energy; }
    getCharacterClass(): CharacterClass { return this.characterClass; }

    gainExperience(amount: number): string {
        this.experience += amount;
        const expToNextLevel = this.calculateExpToNextLevel();
        if (this.experience >= expToNextLevel) return this.levelUp();
        return `${this.name} gained ${amount} EXP. (${this.experience}/${expToNextLevel})`;
    }

    private calculateExpToNextLevel(): number {
        return Math.floor(Math.pow(this.level, 2) * 1000);
    }

    private levelUp(): string {
        this.level++;
        this.experience = 0;
        this.onLevelUp();
        return `🎉 ${this.name} reached Level ${this.level}!`;
    }

    takeDamage(damage: number): string {
        this.health = Math.max(0, this.health - damage);
        if (this.health === 0) return `💀 ${this.name} has been defeated!`;
        return `${this.name} took ${damage} damage. HP: ${this.health}/${this.maxHealth}`;
    }

    heal(amount: number): string {
        const previousHealth = this.health;
        this.health = Math.min(this.maxHealth, this.health + amount);
        const healed = this.health - previousHealth;
        return `💚 ${this.name} recovered ${healed} HP. HP: ${this.health}/${this.maxHealth}`;
    }

    isAlive(): boolean { return this.health > 0; }

    toJSON() {
        return {
            id:         this.id,
            name:       this.name,
            class:      this.characterClass,
            level:      this.level,
            experience: this.experience,
            stats: {
                hp:       `${this.health}/${this.maxHealth}`,
                mp:       `${this.mana}/${this.maxMana}`,
                strength: this.strength,
                agility:  this.agility,
                vitality: this.vitality,
                energy:   this.energy,
            },
            // ← inventario incluido en el JSON
            items:     this.items?.map(i => i.toJSON()) ?? [],
            createdAt: this.createdAt,
        };
    }
}