// ============================================================
// ⚔️ ITEM — Clase Base Abstracta
// Concepto: Herencia + Encapsulamiento + Interfaces
// ============================================================
//
// ¿Por qué 'abstract'?
// Porque un "Item" genérico no tiene sentido en MU Online.
// Nadie equipa un "Item" — equipa una "Sword" o una "Armor".
// 'abstract' nos impide hacer: new Item() ← error de TypeScript
//
// Es como en Django:
//   class Animal(models.Model):      ← abstracto conceptualmente
//       class Meta: abstract = True
//   class Dog(Animal): pass          ← concreto, se puede instanciar
// ============================================================

// ── Tipos de item disponibles en MU Online ─────────────────
// 'enum' en TypeScript = conjunto de valores con nombre
// Evita strings mágicos como 'weapon' o 'WEAPON' o 'Weapon'
// Con enum siempre usas ItemType.WEAPON — consistente y seguro
export enum ItemType {
  WEAPON = 'Weapon',
  ARMOR  = 'Armor',
  RING   = 'Ring',
  HELM   = 'Helm',
  BOOTS  = 'Boots',
}

// ── Rareza del item ─────────────────────────────────────────
// En MU Online los items tienen nivel de rareza que afecta sus stats
export enum ItemRarity {
  NORMAL    = 'Normal',    // sin bonus
  MAGIC     = 'Magic',     // +10% stats
  ANCIENT   = 'Ancient',   // +25% stats
  EXCELLENT = 'Excellent', // +50% stats
}

// ── Interfaz Equippable ─────────────────────────────────────
/**
 * ¿Por qué una interfaz aquí y no solo métodos en la clase?
 *
 * La interfaz define el CONTRATO — cualquier clase que implemente
 * Equippable GARANTIZA que tiene equip(), unequip() y getStatBonus().
 *
 * Más adelante, cuando hagamos el sistema de combate:
 *   character.equip(item)  ← TypeScript verifica que item sea Equippable
 *
 * Sin la interfaz tendríamos que verificar manualmente si el item
 * tiene esos métodos. Con la interfaz, TypeScript lo garantiza.
 */
export interface Equippable {
  equip(characterName: string): string;
  unequip(characterName: string): string;
  getStatBonus(): object;
}

// ============================================================
// CLASE BASE ABSTRACTA — Item
// ============================================================
export abstract class Item {

  // ── Propiedades ──────────────────────────────────────────
  /**
   * 'protected' → accesible en Item y en sus clases hijas
   * 'private'   → solo en Item (las hijas no podrían leerlas)
   *
   * Usamos 'protected' porque Weapon necesita leer 'name',
   * 'level', 'rarity' para construir sus propios métodos.
   */
  protected id: string;
  protected name: string;
  protected itemType: ItemType;
  protected level: number;        // nivel del item (1-15 en MU)
  protected rarity: ItemRarity;
  protected isEquipped: boolean;
  protected equippedBy: string | null; // nombre del personaje que lo lleva

  // ── Constructor ───────────────────────────────────────────
  /**
   * Las clases hijas DEBEN llamar super() con estos parámetros.
   * El constructor de Item inicializa todo lo que es COMÚN
   * entre Weapon, Armor y Ring.
   *
   * Lo específico de cada tipo (attackBonus, defenseBonus)
   * lo inicializa cada clase hija.
   */
  constructor(
    name: string,
    itemType: ItemType,
    level: number = 1,
    rarity: ItemRarity = ItemRarity.NORMAL,
  ) {
    // Genera un ID único basado en timestamp
    // En Sprint 2 con TypeORM esto será autoincremental en DB
    this.id          = `${itemType}-${Date.now()}`;
    this.name        = name;
    this.itemType    = itemType;
    this.level       = level;
    this.rarity      = rarity;
    this.isEquipped  = false;  // empieza sin equipar
    this.equippedBy  = null;   // nadie lo lleva aún

    // Llama al método abstracto — cada hijo lo implementa diferente
    // Igual que Character llama a initializeStats() en su constructor
    this.initializeStats();
  }

  // ── Método abstracto ─────────────────────────────────────
  /**
   * 'abstract' aquí obliga a Weapon, Armor y Ring a definir
   * sus propios stats (attackBonus, defenseBonus, etc.)
   *
   * TypeScript no te deja crear una clase hija sin implementarlo.
   * Es el mismo patrón que usamos en character.entity.ts
   */
  protected abstract initializeStats(): void;

  // ── Métodos comunes a todos los items ────────────────────

  /**
   * Calcula el multiplicador de rareza para los stats.
   * 'private' porque es un detalle interno de Item —
   * ni las hijas ni el exterior necesitan llamarlo directamente.
   *
   * ': number' → retorna un número (el multiplicador)
   */
  private getRarityMultiplier(): number {
    // Switch expression — más limpio que if/else
    switch (this.rarity) {
      case ItemRarity.MAGIC:     return 1.10; // +10%
      case ItemRarity.ANCIENT:   return 1.25; // +25%
      case ItemRarity.EXCELLENT: return 1.50; // +50%
      default:                   return 1.00; // sin bonus
    }
  }

  /**
   * Calcula el bonus final aplicando rareza y nivel.
   * 'protected' → las hijas lo usan para calcular sus stats finales.
   *
   * Fórmula: baseValue * rarityMultiplier * (1 + level * 0.1)
   * Ejemplo: 50 base, Ancient, level 5
   *   50 * 1.25 * (1 + 5*0.1) = 50 * 1.25 * 1.5 = 93.75 → 93
   */
  protected calculateFinalBonus(baseValue: number): number {
    const rarityMult = this.getRarityMultiplier();
    const levelMult  = 1 + this.level * 0.1;
    return Math.floor(baseValue * rarityMult * levelMult);
  }

  // ── Getters — acceso controlado a propiedades privadas ───
  /**
   * ¿Por qué getters y no propiedades public?
   * Con getters podemos agregar lógica antes de retornar.
   * Ejemplo: getId() podría formatear el ID antes de retornarlo.
   * Con public la propiedad se expone tal cual — sin control.
   */
  getId(): string    { return this.id; }
  getName(): string  { return this.name; }
  getLevel(): number { return this.level; }
  getRarity(): string { return this.rarity; }
  getIsEquipped(): boolean { return this.isEquipped; }

  // ── toJSON — serialización para respuestas HTTP ──────────
  /**
   * 'object' como tipo de retorno → retorna cualquier objeto JS.
   * En Sprint 2 con TypeORM esto se manejará automáticamente.
   *
   * Las clases hijas pueden hacer override de este método
   * para agregar sus propios campos específicos.
   */
  toJSON(): object {
    return {
      id:         this.id,
      name:       this.name,
      type:       this.itemType,
      level:      this.level,
      rarity:     this.rarity,
      isEquipped: this.isEquipped,
      equippedBy: this.equippedBy,
    };
  }
}