// src/items/entities/item.entity.ts
// + TypeORM Sprint 2: mapeo a tabla items en PostgreSQL

import {
    Entity,
    PrimaryColumn,
    Column,
    TableInheritance,
    CreateDateColumn,
} from 'typeorm';

// ============================================================
// 📖 ITEM — diferencia con Character y Monster
// ============================================================
//
// Character y Monster usan @PrimaryGeneratedColumn() → ID numérico
// Item usa @PrimaryColumn() → ID string personalizado
//
// ¿Por qué?
// En Sprint 1 el ID del item era: 'Weapon-1234567890'
// Queremos mantener ese formato descriptivo.
// @PrimaryColumn() nos deja definir el ID manualmente.
//
// En la DB quedará:
//   id              | type   | name          | rarity  | ...
//   Weapon-17234... | Weapon | Broad Sword+3 | Ancient | ...
//   Armor-17234...  | Armor  | Plate Armor   | Normal  | ...
//   Ring-17234...   | Ring   | Ring of Fire  | Magic   | ...
// ============================================================

export enum ItemType {
    WEAPON = 'WEAPON',
    ARMOR  = 'ARMOR',
    RING   = 'RING',
    HELM   = 'HELM',
    BOOTS  = 'BOOTS',
}

export enum ItemRarity {
    NORMAL    = 'NORMAL',
    MAGIC     = 'MAGIC',
    ANCIENT   = 'ANCIENT',
    EXCELLENT = 'EXCELLENT',
}

export interface Equippable {
    equip(characterName: string): string;
    unequip(): string;
    getStatBonus(): object;
}

@Entity('items')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Item {

    // @PrimaryColumn() → ID manual, no autoincremental
    // Lo asignamos nosotros en el constructor: 'Weapon-timestamp'
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: ItemType })
    itemType: ItemType;

    @Column({ type: 'enum', enum: ItemRarity, default: ItemRarity.NORMAL })
    rarity: ItemRarity;

    @Column({ default: 1 })
    level: number;

    @Column({ default: false })
    isEquipped: boolean;

    @Column({ type: 'varchar', nullable: true })
    equippedBy: string | null;
    // Columnas específicas de Weapon — null en Armor y Ring
    @Column({ nullable: true })
    baseAttackMin: number;

    @Column({ nullable: true })
    baseAttackMax: number;

    @Column({ type: 'float', nullable: true })
    attackSpeed: number;

    // Columnas específicas de Armor — null en Weapon y Ring
    @Column({ nullable: true })
    baseDefense: number;

    @Column({ nullable: true })
    baseHpBonus: number;

    // Columnas específicas de Ring — null en Weapon y Armor
    @Column({ nullable: true })
    effect: string;

    @Column({ nullable: true })
    effectValue: number;

    @CreateDateColumn()
    createdAt: Date;

    // ── Constructor con parámetros opcionales ─────────────
    constructor(
        name?: string,
        itemType?: ItemType,
        level: number = 1,
        rarity: ItemRarity = ItemRarity.NORMAL,
    ) {
        if (name && itemType) {
            this.id       = `${itemType}-${Date.now()}`;
            this.name     = name;
            this.itemType = itemType;
            this.level    = level;
            this.rarity   = rarity;
            this.isEquipped = false;
            this.initializeStats();
        }
    }

    protected abstract initializeStats(): void;

    // Multiplicador de rareza
    protected getRarityMultiplier(): number {
        const multipliers = {
            [ItemRarity.NORMAL]:    1.0,
            [ItemRarity.MAGIC]:     1.1,
            [ItemRarity.ANCIENT]:   1.25,
            [ItemRarity.EXCELLENT]: 1.5,
        };
        return multipliers[this.rarity] ?? 1.0;
    }

    protected calculateFinalBonus(baseValue: number): number {
        return Math.floor(baseValue * this.getRarityMultiplier() * (1 + this.level * 0.1));
    }

    // ── Getters ───────────────────────────────────────────
    getId(): string    { return this.id; }
    getName(): string  { return this.name; }

    toJSON(): object {
        return {
            id:         this.id,
            name:       this.name,
            itemType:   this.itemType,
            rarity:     this.rarity,
            level:      this.level,
            isEquipped: this.isEquipped,
            equippedBy: this.equippedBy,
            createdAt:  this.createdAt,
        };
    }
}