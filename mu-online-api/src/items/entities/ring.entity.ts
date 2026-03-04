// src/items/entities/ring.entity.ts

import { ChildEntity } from 'typeorm';
import { Item, ItemType, ItemRarity, Equippable } from './item.entity';

export enum RingEffect {
    HP_REGEN  = 'HP_REGEN',
    MP_REGEN  = 'MP_REGEN',
    STR_BONUS = 'STR_BONUS',
    AGI_BONUS = 'AGI_BONUS',
    ENE_BONUS = 'ENE_BONUS',
    FIRE_RES  = 'FIRE_RES',
    ICE_RES   = 'ICE_RES',
}

@ChildEntity('Ring')
export class Ring extends Item implements Equippable {

    private ringEffect: RingEffect;
    private ringEffectValue: number;

    constructor(
        name?: string,
        ringEffect?: RingEffect,
        effectValue: number = 10,
        level: number = 1,
        rarity: ItemRarity = ItemRarity.NORMAL,
    ) {
        super(name, ItemType.RING, level, rarity);
        if (ringEffect) {
            this.ringEffect      = ringEffect;
            this.ringEffectValue = effectValue;
        }
    }

    protected initializeStats(): void {
        this.effect      = this.ringEffect;
        this.effectValue = this.ringEffectValue;
    }

    equip(characterName: string): string {
        if (this.isEquipped) return `${this.name} is already equipped by ${this.equippedBy}`;
        this.isEquipped = true;
        this.equippedBy = characterName;
        return `${characterName} equipped ${this.name}! Effect: ${this.effect} +${this.effectValue}`;
    }

    unequip(): string {
        const prev      = this.equippedBy;
        this.isEquipped = false;
        this.equippedBy = null;
        return `${prev} unequipped ${this.name}`;
    }

    getStatBonus(): object {
        return {
            effect:      this.effect,
            effectValue: this.calculateFinalBonus(this.effectValue),
        };
    }
}

export const createRingOfFire    = (level = 1, rarity = ItemRarity.NORMAL) =>
    new Ring('Ring of Fire', RingEffect.FIRE_RES, 15, level, rarity);

export const createRingOfHpRegen = (level = 1, rarity = ItemRarity.NORMAL) =>
    new Ring('Ring of HP Regen', RingEffect.HP_REGEN, 20, level, rarity);