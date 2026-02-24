// ============================================================
// 📖 BITÁCORA: ¿Cómo se relacionan POO y NestJS?
// ============================================================
//
// En MU Online tenemos esta separación de responsabilidades:
//
//  ┌─────────────────────────────────────────────────────────┐
//  │  ENTIDAD (entity.ts)                                    │
//  │  → Es la clase POO pura                                 │
//  │  → Define propiedades, métodos, herencia, interfaces    │
//  │  → No sabe nada de HTTP, NestJS, ni base de datos       │
//  │  → Ejemplo: class Weapon extends Item implements        │
//  │             Equippable { ... }                          │
//  │                                                         │
//  │  SERVICIO (service.ts) @Injectable()                    │
//  │  → Orquesta las entidades POO                           │
//  │  → Contiene la LÓGICA DE NEGOCIO                        │
//  │  → Crea instancias, las guarda, las busca               │
//  │  → Por ahora usa Map en RAM, en Sprint 2 usará          │
//  │    repositorios de TypeORM (base de datos real)         │
//  │  → Equivalente Django: la lógica en views.py            │
//  │                                                         │
//  │  CONTROLADOR (controller.ts) @Controller()              │
//  │  → Recibe las peticiones HTTP (GET, POST, etc.)         │
//  │  → Extrae los datos del request (body, params)          │
//  │  → Llama al Servicio y retorna la respuesta             │
//  │  → NO contiene lógica de negocio — solo coordina        │
//  │  → Equivalente Django: urls.py + views.py juntos        │
//  │                                                         │
//  │  MÓDULO (module.ts) @Module()                           │
//  │  → Agrupa Controlador + Servicio                        │
//  │  → Le dice a NestJS: "estos van juntos"                 │
//  │  → Equivalente Django: INSTALLED_APPS                   │
//  └─────────────────────────────────────────────────────────┘
//
//  El flujo de una petición HTTP:
//
//  Postman ──→ Controller ──→ Service ──→ Entity (POO)
//                                            ↓
//  Postman ←── Controller ←── Service ←── toJSON()
//
// ============================================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { Item, ItemRarity } from './entities/item.entity';
import { Weapon, createBroadSword, createElvenBow, createWizardStaff } from './entities/weapon.entity';
import { Armor, createPlateArmor, createLeatherArmor, createWizardRobe } from './entities/armor.entity';
import { Ring, createRingOfFire, createRingOfHpRegen } from './entities/ring.entity';

// ============================================================
// @Injectable() — Concepto 4: Inyección de Dependencias
// ============================================================
// Le dice a NestJS: "esta clase puede ser inyectada en otras".
// ItemsController recibirá una instancia de ItemsService
// automáticamente — sin hacer new ItemsService() manualmente.
@Injectable()
export class ItemsService {

  // ── Base de datos temporal en RAM ──────────────────────
  // Map<string, Item> — la key es el ID del item
  // 'Item' es el tipo base — acepta Weapon, Armor y Ring
  // porque ambos EXTIENDEN Item (herencia)
  private items: Map<string, Item> = new Map();

  // ── createItem — Fábrica de items ──────────────────────
  /**
   * Recibe el tipo como string desde el body del request
   * y retorna la instancia POO correcta.
   *
   * 'level' y 'rarity' son opcionales — tienen valores default.
   *
   * ': object' — retorna el JSON del item creado
   */
  createItem(
    type: string,
    level: number = 1,
    rarity: string = 'Normal',
  ): object {

    // Convierte el string de rareza al enum ItemRarity
    // Si viene 'Ancient' del body → ItemRarity.ANCIENT
    const rarityEnum = (ItemRarity as any)[rarity.toUpperCase()] ?? ItemRarity.NORMAL;

    // ── Polimorfismo en acción ──────────────────────────
    // Dependiendo del tipo, creamos una clase diferente.
    // Todas extienden Item, así que el Map las acepta.
    let item: Item;

    switch (type) {
      // Armas
      case 'BroadSword':
        item = createBroadSword(level, rarityEnum);
        break;
      case 'ElvenBow':
        item = createElvenBow(level, rarityEnum);
        break;
      case 'WizardStaff':
        item = createWizardStaff(level, rarityEnum);
        break;

      // Armaduras
      case 'PlateArmor':
        item = createPlateArmor(level, rarityEnum);
        break;
      case 'LeatherArmor':
        item = createLeatherArmor(level, rarityEnum);
        break;
      case 'WizardRobe':
        item = createWizardRobe(level, rarityEnum);
        break;

      // Anillos
      case 'RingOfFire':
        item = createRingOfFire(level, rarityEnum);
        break;
      case 'RingOfHpRegen':
        item = createRingOfHpRegen(level, rarityEnum);
        break;

      default:
        throw new NotFoundException(`Item type '${type}' not found`);
    }

    // Guarda en el Map usando el ID del item como key
    this.items.set(item.getId(), item);

    return {
      message: 'Item created!',
      item: item.toJSON(),
    };
  }

  // ── findAll ─────────────────────────────────────────────
  findAll(): object[] {
    return Array.from(this.items.values()).map(i => i.toJSON());
  }

  // ── findOne ─────────────────────────────────────────────
  findOne(id: string): object {
    const item = this.items.get(id);
    if (!item) throw new NotFoundException(`Item '${id}' not found`);
    return item.toJSON();
  }

  // ── equipItem ───────────────────────────────────────────
  /**
   * Equipa un item a un personaje.
   * Usa 'instanceof' para verificar que el item sea Equippable.
   * Solo Weapon, Armor y Ring implementan Equippable.
   */
  equipItem(id: string, characterName: string): string {
    const item = this.items.get(id);
    if (!item) throw new NotFoundException(`Item '${id}' not found`);

    // 'instanceof' verifica si el objeto es una instancia de la clase
    if (item instanceof Weapon) return item.equip(characterName);
    if (item instanceof Armor)  return item.equip(characterName);
    if (item instanceof Ring)   return item.equip(characterName);

    return `${item.getName()} cannot be equipped`;
  }
}