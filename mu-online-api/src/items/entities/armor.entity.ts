// src/items/entities/armor.entity.ts

import { ChildEntity } from 'typeorm';
import { Item, ItemType, ItemRarity, Equippable } from './item.entity';

export enum ArmorType {
    PLATE   = 'PLATE',
    LEATHER = 'LEATHER',
    ROBE    = 'ROBE',
}

@ChildEntity('Armor')
export class Armor extends Item implements Equippable {

    private armorType: ArmorType;

    constructor(
        name?: string,
        armorType?: ArmorType,
        level: number = 1,
        rarity: ItemRarity = ItemRarity.NORMAL,
    ) {
        super(name, ItemType.ARMOR, level, rarity);
        if (armorType) this.armorType = armorType;
    }

    protected initializeStats(): void {
        const baseStats = {
            [ArmorType.PLATE]:   { defense: 30, hp: 100 },
            [ArmorType.LEATHER]: { defense: 18, hp: 60  },
            [ArmorType.ROBE]:    { defense: 8,  hp: 30  },
        };

        const stats = baseStats[this.armorType] ?? baseStats[ArmorType.PLATE];
        this.baseDefense = stats.defense;
        this.baseHpBonus = stats.hp;
    }

    equip(characterName: string): string {
        if (this.isEquipped) return `${this.name} is already equipped by ${this.equippedBy}`;
        this.isEquipped = true;
        this.equippedBy = characterName;
        return `${characterName} equipped ${this.name}!`;
    }

    unequip(): string {
        const prev      = this.equippedBy;
        this.isEquipped = false;
        this.equippedBy = null;
        return `${prev} unequipped ${this.name}`;
    }

    getStatBonus(): object {
        return {
            defense: this.calculateFinalBonus(this.baseDefense),
            hpBonus: this.calculateFinalBonus(this.baseHpBonus),
        };
    }
}

export const createPlateArmor   = (level = 1, rarity = ItemRarity.NORMAL) =>
    new Armor('Plate Armor', ArmorType.PLATE, level, rarity);

export const createLeatherArmor = (level = 1, rarity = ItemRarity.NORMAL) =>
    new Armor('Leather Armor', ArmorType.LEATHER, level, rarity);

export const createWizardRobe   = (level = 1, rarity = ItemRarity.NORMAL) =>
    new Armor('Wizard Robe', ArmorType.ROBE, level, rarity);
