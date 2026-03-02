import { Item, ItemType, ItemRarity, Equippable } from './item.entity';

// ============================================================
// ⚔️ WEAPON — Extiende Item, implementa Equippable
// ============================================================
//
// Aquí ocurren DOS cosas a la vez:
//   'extends Item'        → hereda todo lo de Item
//   'implements Equippable' → se compromete a tener
//                             equip(), unequip(), getStatBonus()
//
// TypeScript verificará que implementemos TODOS los métodos
// de la interfaz Equippable. Si nos falta uno → error rojo.
// ============================================================

// ── Tipos de arma ───────────────────────────────────────────
export enum WeaponType {
  SWORD       = 'Sword',       // Dark Knight
  STAFF       = 'Staff',       // Dark Wizard
  BOW         = 'Bow',         // Elf
  AXE         = 'Axe',         // Dark Knight
  SCEPTER     = 'Scepter',     // Dark Lord
}

// ── Clase concreta Weapon ────────────────────────────────────
export class Weapon extends Item implements Equippable {

  // Propiedades ESPECÍFICAS de Weapon — no existen en Item
  private weaponType: WeaponType;
  private baseAttackMin: number; // daño mínimo base
  private baseAttackMax: number; // daño máximo base
  private attackSpeed: number;   // velocidad de ataque

  // ── Constructor ─────────────────────────────────────────
  /**
   * Weapon necesita más datos que Item para construirse:
   * además de name/level/rarity, necesita weaponType y daño base.
   *
   * 'super(name, ItemType.WEAPON, level, rarity)' llama al
   * constructor de Item — igual que Character llamaba a super().
   *
   * El orden importa: super() va PRIMERO siempre.
   */
  constructor(
    name: string,
    weaponType: WeaponType,
    baseAttackMin: number,
    baseAttackMax: number,
    level: number = 1,
    rarity: ItemRarity = ItemRarity.NORMAL,
  ) {
    // ① Primero inicializa Item (propiedades comunes)
    super(name, ItemType.WEAPON, level, rarity);

    // ② Luego inicializa lo específico de Weapon
    // Nota: esto va DESPUÉS de super() porque super() llama
    // a initializeStats() que necesita these values
    this.weaponType    = weaponType;
    this.baseAttackMin = baseAttackMin;
    this.baseAttackMax = baseAttackMax;
    this.attackSpeed   = this.calculateAttackSpeed();
  }

  // ── initializeStats — implementación del método abstracto ─
  /**
   * Item.constructor() llama a initializeStats() automáticamente.
   * Para Weapon, los stats ya vienen por parámetros del constructor,
   * así que aquí no necesitamos hacer nada adicional.
   *
   * Sin embargo DEBEMOS implementarlo porque Item lo exige como abstract.
   * Si no lo ponemos → TypeScript: "Non-abstract class 'Weapon' does
   * not implement all abstract members of 'Item'."
   */
  protected override initializeStats(): void {
    // Los stats de Weapon vienen por constructor (baseAttackMin/Max)
    // A diferencia de Character donde los stats se calculaban aquí
  }

  // ── Método privado de utilidad ───────────────────────────
  /**
   * La velocidad de ataque depende del tipo de arma.
   * 'private' porque es un detalle interno de Weapon.
   */
  private calculateAttackSpeed(): number {
    switch (this.weaponType) {
      case WeaponType.BOW:    return 1.5; // Elf ataca más rápido
      case WeaponType.STAFF:  return 1.0; // velocidad normal
      case WeaponType.SWORD:  return 1.2;
      case WeaponType.AXE:    return 0.8; // más lento pero más daño
      default:                return 1.0;
    }
  }

  // ── Implementación de Equippable ─────────────────────────
  /**
   * CONTRATO: Equippable exige equip(), unequip(), getStatBonus().
   * Aquí los implementamos — si alguno faltara, TypeScript nos aviساría.
   *
   * 'public' (implícito) → estos métodos deben ser accesibles
   * desde fuera porque la interfaz así lo exige.
   */

  equip(characterName: string): string {
    // Verifica si ya está equipado por alguien más
    if (this.isEquipped) {
      return `${this.name} is already equipped by ${this.equippedBy}!`;
    }

    this.isEquipped = true;
    this.equippedBy = characterName;

    return `${characterName} equipped ${this.name}! ATK: +${this.getFinalAttackMin()}-${this.getFinalAttackMax()}`;
  }

  unequip(characterName: string): string {
    if (!this.isEquipped || this.equippedBy !== characterName) {
      return `${this.name} is not equipped by ${characterName}!`;
    }

    this.isEquipped = false;
    this.equippedBy = null;

    return `${characterName} unequipped ${this.name}.`;
  }

  /**
   * getStatBonus() retorna 'object' como define la interfaz Equippable.
   * El sistema de combate usará esto para aplicar los bonuses al personaje.
   */
  getStatBonus(): object {
    return {
      attackMin:   this.getFinalAttackMin(),
      attackMax:   this.getFinalAttackMax(),
      attackSpeed: this.attackSpeed,
    };
  }

  // ── Getters con cálculo de bonus ─────────────────────────
  /**
   * calculateFinalBonus() viene de Item (protected).
   * Aplica rareza y nivel al valor base.
   * Las hijas pueden usarlo gracias a 'protected'.
   */
  getFinalAttackMin(): number {
    return this.calculateFinalBonus(this.baseAttackMin);
  }

  getFinalAttackMax(): number {
    return this.calculateFinalBonus(this.baseAttackMax);
  }

  // ── Override toJSON — agrega campos específicos de Weapon ─
  /**
   * 'override' del método toJSON() de Item.
   * Usamos spread (...super.toJSON()) para incluir los campos
   * de Item Y agregar los específicos de Weapon.
   *
   * Sin override, toJSON() solo mostraría los campos de Item.
   */
  override toJSON(): object {
    return {
      ...super.toJSON() as object, // campos de Item
      weaponType:  this.weaponType,
      attackMin:   this.getFinalAttackMin(),
      attackMax:   this.getFinalAttackMax(),
      attackSpeed: this.attackSpeed,
    };
  }
}

// ============================================================
// ITEMS CONCRETOS — Armas específicas del juego
// ============================================================
/**
 * Estas son instancias reusables de Weapon con datos del juego real.
 * En Sprint 2 vendrán de la DB, pero por ahora son datos quemados.
 *
 * Patrón Factory — createXxx() crea una Weapon preconfigurada.
 * Así en el service hacemos: createBroadSword() en vez de
 * new Weapon('Broad Sword', WeaponType.SWORD, 10, 15, 1, ...)
 */

export const createBroadSword = (
  level: number = 1,
  rarity: ItemRarity = ItemRarity.NORMAL
): Weapon => new Weapon('Broad Sword', WeaponType.SWORD, 10, 15, level, rarity);

export const createElvenBow = (
  level: number = 1,
  rarity: ItemRarity = ItemRarity.NORMAL
): Weapon => new Weapon('Elven Bow', WeaponType.BOW, 8, 12, level, rarity);

export const createWizardStaff = (
  level: number = 1,
  rarity: ItemRarity = ItemRarity.NORMAL
): Weapon => new Weapon('Wizard Staff', WeaponType.STAFF, 5, 20, level, rarity);