import { Item, ItemType, ItemRarity, Equippable } from './item.entity';

// ============================================================
// 💍 RING — Extiende Item, implementa Equippable
// ============================================================
//
// Los anillos son especiales en MU Online porque no dan defensa
// ni ataque directo — dan EFECTOS ESPECIALES (buffs):
//   - regeneración de HP/MP
//   - resistencia a elementos
//   - bonus a stats específicos
//
// Esto introduce el concepto de 'specialEffect': string
// que en Sprint 2 se convertirá en un sistema de buffs real.
// ============================================================

export enum RingEffect {
  HP_REGEN    = 'HpRegeneration',   // regenera HP cada turno
  MP_REGEN    = 'MpRegeneration',   // regenera MP cada turno
  STR_BONUS   = 'StrengthBonus',    // bonus a fuerza
  AGI_BONUS   = 'AgilityBonus',     // bonus a agilidad
  ENE_BONUS   = 'EnergyBonus',      // bonus a energía
  FIRE_RES    = 'FireResistance',   // resistencia a fuego
  ICE_RES     = 'IceResistance',    // resistencia a hielo
}

export class Ring extends Item implements Equippable {

  private effect: RingEffect;
  private effectValue: number; // magnitud del efecto

  constructor(
    name: string,
    effect: RingEffect,
    effectValue: number,
    level: number = 1,
    rarity: ItemRarity = ItemRarity.NORMAL,
  ) {
    super(name, ItemType.RING, level, rarity);
    this.effect      = effect;
    this.effectValue = effectValue;
  }

  protected override initializeStats(): void {
    // Stats vienen por constructor
  }

  // ── Equippable ──────────────────────────────────────────
  equip(characterName: string): string {
    if (this.isEquipped) {
      return `${this.name} is already equipped by ${this.equippedBy}!`;
    }
    this.isEquipped = true;
    this.equippedBy = characterName;

    const finalValue = this.calculateFinalBonus(this.effectValue);
    return `${characterName} equipped ${this.name}! Effect: ${this.effect} +${finalValue}`;
  }

  unequip(characterName: string): string {
    if (!this.isEquipped || this.equippedBy !== characterName) {
      return `${this.name} is not equipped by ${characterName}!`;
    }
    this.isEquipped = false;
    this.equippedBy = null;
    return `${characterName} unequipped ${this.name}. Effect ${this.effect} removed.`;
  }

  getStatBonus(): object {
    return {
      effect:      this.effect,
      effectValue: this.calculateFinalBonus(this.effectValue),
    };
  }

  override toJSON(): object {
    return {
      ...super.toJSON() as object,
      effect:      this.effect,
      effectValue: this.calculateFinalBonus(this.effectValue),
    };
  }
}

// ── Items concretos ─────────────────────────────────────────
export const createRingOfFire = (
  level: number = 1,
  rarity: ItemRarity = ItemRarity.NORMAL
): Ring => new Ring('Ring of Fire', RingEffect.FIRE_RES, 15, level, rarity);

export const createRingOfHpRegen = (
  level: number = 1,
  rarity: ItemRarity = ItemRarity.NORMAL
): Ring => new Ring('Ring of HP Regen', RingEffect.HP_REGEN, 10, level, rarity);