import { Item, ItemType, ItemRarity, Equippable } from './item.entity';

// ============================================================
// 🛡️ ARMOR — Extiende Item, implementa Equippable
// ============================================================
//
// Mismo patrón que Weapon pero orientado a DEFENSA.
// La diferencia está en los stats que maneja:
//   Weapon → attackMin, attackMax, attackSpeed
//   Armor  → defenseBonus, hpBonus, armorType
// ============================================================

export enum ArmorType {
  PLATE    = 'Plate',    // Dark Knight — alta defensa, pesada
  LEATHER  = 'Leather',  // Elf — media defensa, liviana
  ROBE     = 'Robe',     // Dark Wizard — baja defensa, bonus de energía
  HELM     = 'Helm',
  BOOTS    = 'Boots',
  GLOVES   = 'Gloves',
}

export class Armor extends Item implements Equippable {

  private armorType: ArmorType;
  private baseDefense: number;
  private baseHpBonus: number;  // algunas armaduras dan HP extra

  constructor(
    name: string,
    armorType: ArmorType,
    baseDefense: number,
    baseHpBonus: number = 0,
    level: number = 1,
    rarity: ItemRarity = ItemRarity.NORMAL,
  ) {
    super(name, ItemType.ARMOR, level, rarity);
    this.armorType   = armorType;
    this.baseDefense = baseDefense;
    this.baseHpBonus = baseHpBonus;
  }

  protected override initializeStats(): void {
    // Stats vienen por constructor — mismo patrón que Weapon
  }

  // ── Equippable ──────────────────────────────────────────
  equip(characterName: string): string {
    if (this.isEquipped) {
      return `${this.name} is already equipped by ${this.equippedBy}!`;
    }
    this.isEquipped = true;
    this.equippedBy = characterName;
    return `${characterName} equipped ${this.name}! DEF: +${this.getFinalDefense()} HP: +${this.getFinalHpBonus()}`;
  }

  unequip(characterName: string): string {
    if (!this.isEquipped || this.equippedBy !== characterName) {
      return `${this.name} is not equipped by ${characterName}!`;
    }
    this.isEquipped = false;
    this.equippedBy = null;
    return `${characterName} unequipped ${this.name}.`;
  }

  getStatBonus(): object {
    return {
      defense: this.getFinalDefense(),
      hp:      this.getFinalHpBonus(),
    };
  }

  // ── Getters con bonus ────────────────────────────────────
  getFinalDefense(): number {
    return this.calculateFinalBonus(this.baseDefense);
  }

  getFinalHpBonus(): number {
    return this.calculateFinalBonus(this.baseHpBonus);
  }

  override toJSON(): object {
    return {
      ...super.toJSON() as object,
      armorType: this.armorType,
      defense:   this.getFinalDefense(),
      hpBonus:   this.getFinalHpBonus(),
    };
  }
}

// ── Items concretos ─────────────────────────────────────────
export const createPlateArmor = (
  level: number = 1,
  rarity: ItemRarity = ItemRarity.NORMAL
): Armor => new Armor('Plate Armor', ArmorType.PLATE, 20, 50, level, rarity);

export const createLeatherArmor = (
  level: number = 1,
  rarity: ItemRarity = ItemRarity.NORMAL
): Armor => new Armor('Leather Armor', ArmorType.LEATHER, 12, 20, level, rarity);

export const createWizardRobe = (
  level: number = 1,
  rarity: ItemRarity = ItemRarity.NORMAL
): Armor => new Armor('Wizard Robe', ArmorType.ROBE, 8, 10, level, rarity);