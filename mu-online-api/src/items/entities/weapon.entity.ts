// src/items/entities/weapon.entity.ts

import { ChildEntity } from 'typeorm';
import { Item, ItemType, ItemRarity, Equippable } from './item.entity';

export enum WeaponType {
    SWORD   = 'SWORD',
    STAFF   = 'STAFF',
    BOW     = 'BOW',
    AXE     = 'AXE',
    SCEPTER = 'SCEPTER',
}

@ChildEntity('Weapon')
export class Weapon extends Item implements Equippable {

    // weaponType no es columna DB — se infiere del nombre
    // En Sprint 3 podría agregarse como @Column
    private weaponType: WeaponType;

    constructor(
        name?: string,
        weaponType?: WeaponType,
        level: number = 1,
        rarity: ItemRarity = ItemRarity.NORMAL,
    ) {
        super(name, ItemType.WEAPON, level, rarity);
        if (weaponType) this.weaponType = weaponType;
    }

    protected initializeStats(): void {
        // Los valores se guardan en las columnas nullable de Item
        // base values según tipo de arma
        const baseStats = {
            [WeaponType.SWORD]:   { min: 20, max: 35, speed: 1.2 },
            [WeaponType.STAFF]:   { min: 15, max: 45, speed: 1.0 },
            [WeaponType.BOW]:     { min: 18, max: 30, speed: 1.5 },
            [WeaponType.AXE]:     { min: 25, max: 40, speed: 0.8 },
            [WeaponType.SCEPTER]: { min: 22, max: 38, speed: 1.1 },
        };

        const stats = baseStats[this.weaponType] ?? baseStats[WeaponType.SWORD];
        this.baseAttackMin = stats.min;
        this.baseAttackMax = stats.max;
        this.attackSpeed   = stats.speed;
    }

    equip(characterName: string): string {
        if (this.isEquipped) return `${this.name} is already equipped by ${this.equippedBy}`;
        this.isEquipped  = true;
        this.equippedBy  = characterName;
        return `${characterName} equipped ${this.name}!`;
    }

    unequip(): string {
        const prev       = this.equippedBy;
        this.isEquipped  = false;
        this.equippedBy  = null;
        return `${prev} unequipped ${this.name}`;
    }

    getStatBonus(): object {
        return {
            attackMin:   this.calculateFinalBonus(this.baseAttackMin),
            attackMax:   this.calculateFinalBonus(this.baseAttackMax),
            attackSpeed: this.attackSpeed,
        };
    }
}

// ── Factory functions ─────────────────────────────────────
export const createBroadSword  = (level = 1, rarity = ItemRarity.NORMAL) =>
    new Weapon('Broad Sword', WeaponType.SWORD, level, rarity);

export const createElvenBow    = (level = 1, rarity = ItemRarity.NORMAL) =>
    new Weapon('Elven Bow', WeaponType.BOW, level, rarity);

export const createWizardStaff = (level = 1, rarity = ItemRarity.NORMAL) =>
    new Weapon('Wizard Staff', WeaponType.STAFF, level, rarity);