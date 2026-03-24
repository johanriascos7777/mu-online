// src/data/poo-concepts.ts
//
// Mapa completo de conceptos POO → código real del proyecto
// Cada concepto tiene: qué es, dónde vive, qué pasa en el back
// y un diagrama de texto.

export type ConceptId =
  | 'herencia'
  | 'abstraccion'
  | 'encapsulamiento'
  | 'polimorfismo'
  | 'interfaces'
  | 'inyeccion-di'
  | 'asociacion'
  | 'composicion';

export interface POOConcept {
  id: ConceptId;
  emoji: string;
  title: string;
  subtitle: string;
  accentColor: string;
  tagline: string;         // 1 línea, qué es
  explanation: string;     // 2-3 líneas, explicado simple
  diagram: string;         // diagrama ASCII
  codeTitle: string;       // título del snippet
  code: string;            // código real del proyecto
  backendAction: string;   // qué pasa en el back cuando el user hace algo
  nestjsTip?: string;      // cómo NestJS lo usa
  trigger: string;         // cuándo mostrar este concepto
}

export const POO_CONCEPTS: Record<ConceptId, POOConcept> = {

  // ─────────────────────────────────────────────────────────
  // 1. HERENCIA
  // ─────────────────────────────────────────────────────────
  herencia: {
    id:          'herencia',
    emoji:       '🧬',
    title:       'Herencia',
    subtitle:    'extends',
    accentColor: '#c9a84c',
    tagline:     'Una clase HIJA hereda todo de su clase PADRE.',
    explanation:
      'DarkKnight, DarkWizard y Elf son clases hijas de Character. ' +
      'Todas tienen name, level, health, toJSON()... porque los heredan. ' +
      'Solo difieren en initializeStats() — cada uno tiene sus propios stats de base.',
    diagram:
      '        Character (abstract)\n' +
      '       ┌─────┴──────┐─────────┐\n' +
      '  DarkKnight  DarkWizard    Elf\n' +
      '  STR: 28     ENE: 30     AGI: 28\n' +
      '  VIT: 25     VIT: 15     VIT: 20\n\n' +
      '  Lo mismo en Items y Monsters:\n' +
      '  Item → Weapon / Armor / Ring\n' +
      '  Monster → BudgeDragon / Goblin / AncientDragon',
    codeTitle:   'dark-knight.entity.ts',
    code:
      '// DarkKnight HEREDA de Character\n' +
      '@ChildEntity("DarkKnight")\n' +
      'export class DarkKnight extends Character {\n\n' +
      '  constructor(name?: string) {\n' +
      '    // super() llama al constructor del PADRE\n' +
      '    super(name, CharacterClass.DARK_KNIGHT);\n' +
      '  }\n\n' +
      '  // Override — implementa el método abstracto del padre\n' +
      '  protected override initializeStats(): void {\n' +
      '    this.strength  = 28;  // más fuerte\n' +
      '    this.vitality  = 25;  // más vida\n' +
      '    this.energy    = 10;  // menos maná\n' +
      '    // ...\n' +
      '  }\n' +
      '}',
    backendAction:
      'Cuando haces POST /characters con { "characterClass": "DarkKnight" }, ' +
      'CharactersService ejecuta new DarkKnight(name). Esto llama a super() que ' +
      'ejecuta initializeStats() — que está definida en DarkKnight, no en Character.',
    nestjsTip:
      '@ChildEntity("DarkKnight") le dice a TypeORM que en la tabla "characters" ' +
      'la columna "type" = "DarkKnight" para este tipo. Una sola tabla, múltiples clases.',
    trigger: 'create-character',
  },

  // ─────────────────────────────────────────────────────────
  // 2. ABSTRACCIÓN
  // ─────────────────────────────────────────────────────────
  abstraccion: {
    id:          'abstraccion',
    emoji:       '🎭',
    title:       'Abstracción',
    subtitle:    'abstract class',
    accentColor: '#4a90d9',
    tagline:     'Define QUÉ debe hacer sin decir CÓMO.',
    explanation:
      'Character es una clase abstracta — no puedes crear un "Character" sin clase. ' +
      'Obliga a que cada clase hija implemente initializeStats() y onLevelUp(). ' +
      'Es un contrato: si creas una nueva clase, DEBES definir esos métodos.',
    diagram:
      '  abstract class Character {\n' +
      '    abstract initializeStats()  ← OBLIGATORIO\n' +
      '    abstract onLevelUp()        ← OBLIGATORIO\n' +
      '    gainExperience()  ← ya implementado\n' +
      '    takeDamage()      ← ya implementado\n' +
      '    toJSON()          ← ya implementado\n' +
      '  }\n\n' +
      '  ❌ new Character()     — ERROR, es abstracta\n' +
      '  ✅ new DarkKnight()    — OK, implementa todo',
    codeTitle:   'character.entity.ts',
    code:
      '// abstract = no instanciable directamente\n' +
      'export abstract class Character {\n\n' +
      '  // CONTRATO — cada clase HIJA debe implementarlos\n' +
      '  protected abstract initializeStats(): void;\n' +
      '  protected abstract onLevelUp(): void;\n\n' +
      '  // Métodos concretos — heredados por todos\n' +
      '  takeDamage(damage: number): string {\n' +
      '    this.health = Math.max(0, this.health - damage);\n' +
      '    if (this.health === 0)\n' +
      '      return `${this.name} has been defeated!`;\n' +
      '    return `${this.name} took ${damage} damage.`;\n' +
      '  }\n' +
      '}',
    backendAction:
      'TypeScript garantiza en compilación que DarkKnight, DarkWizard y Elf ' +
      'implementen initializeStats() y onLevelUp(). Si añades una clase nueva ' +
      'sin implementarlos, el proyecto ni siquiera compila.',
    trigger: 'create-character',
  },

  // ─────────────────────────────────────────────────────────
  // 3. ENCAPSULAMIENTO
  // ─────────────────────────────────────────────────────────
  encapsulamiento: {
    id:          'encapsulamiento',
    emoji:       '🔒',
    title:       'Encapsulamiento',
    subtitle:    'private / toJSON()',
    accentColor: '#27ae60',
    tagline:     'Los datos internos se protegen y se exponen de forma controlada.',
    explanation:
      'weaponType en Weapon es private — nadie fuera de la clase puede modificarlo. ' +
      'toJSON() decide exactamente qué campos se envían al frontend. ' +
      'Los getters (getStrength, getLevel) son la única forma de leer los datos internos.',
    diagram:
      '  ┌──────── Character ────────┐\n' +
      '  │  private → solo yo        │\n' +
      '  │  protected → yo y hijos   │\n' +
      '  │  public → todos           │\n' +
      '  │                           │\n' +
      '  │  health    ← private (DB) │\n' +
      '  │  getHealth()← public API  │\n' +
      '  │  toJSON()  ← lo que ves   │\n' +
      '  └───────────────────────────┘',
    codeTitle:   'character.entity.ts + weapon.entity.ts',
    code:
      '// Weapon — weaponType es PRIVADO\n' +
      'export class Weapon extends Item {\n' +
      '  private weaponType: WeaponType;  // ← nadie lo modifica\n' +
      '}\n\n' +
      '// Character — toJSON() controla la exposición\n' +
      'toJSON() {\n' +
      '  return {\n' +
      '    id:    this.id,\n' +
      '    name:  this.name,\n' +
      '    // ← health/mana van como "155/155"\n' +
      '    stats: { hp: `${this.health}/${this.maxHealth}` },\n' +
      '    // ← NO exponemos updatedAt, password, etc.\n' +
      '  };\n' +
      '}',
    backendAction:
      'Cuando haces GET /characters, el Controller llama a findAll() → toJSON(). ' +
      'Nunca envía health y maxHealth por separado — solo el formato "155/155". ' +
      'El frontend nunca ve updatedAt ni datos internos de TypeORM.',
    nestjsTip:
      'En NestJS, los Services encapsulan la lógica de negocio. ' +
      'El Controller solo llama al Service — nunca habla con la DB directamente.',
    trigger: 'view-characters',
  },

  // ─────────────────────────────────────────────────────────
  // 4. POLIMORFISMO
  // ─────────────────────────────────────────────────────────
  polimorfismo: {
    id:          'polimorfismo',
    emoji:       '🎭',
    title:       'Polimorfismo',
    subtitle:    'mismo método, distinto comportamiento',
    accentColor: '#c0392b',
    tagline:     'El mismo método se comporta diferente según la clase.',
    explanation:
      'CombatSession llama a character.gainExperience() sin saber si el personaje ' +
      'es DarkKnight, DarkWizard o Elf. Pero onLevelUp() (que se llama internamente) ' +
      'se ejecuta diferente en cada uno — DarkKnight sube más STR, DarkWizard más ENE.',
    diagram:
      '  executeTurn() llama:           Lo que ocurre:\n' +
      '  character.getStrength()   →    DarkKnight: 28 + 7×level\n' +
      '  character.gainExperience() →   DarkWizard: 18 + 2×level\n' +
      '  character.onLevelUp()      →   Elf:        22 + 2×level\n\n' +
      '  El código de executeTurn() es IGUAL para todos.\n' +
      '  Lo que cambia es la implementación en cada clase hija.',
    codeTitle:   'dark-knight.entity.ts vs elf.entity.ts',
    code:
      '// DarkKnight sube mucho STR y VIT al levelear\n' +
      'protected override onLevelUp(): void {\n' +
      '  this.strength  += 7;   // guerrero\n' +
      '  this.vitality  += 7;\n' +
      '  this.energy    += 1;\n' +
      '}\n\n' +
      '// Elf sube mucho AGI y ENE al levelear\n' +
      'protected override onLevelUp(): void {\n' +
      '  this.agility   += 7;   // arquera\n' +
      '  this.energy    += 5;\n' +
      '  this.strength  += 2;\n' +
      '}\n\n' +
      '// CombatSession no sabe cuál es — solo llama:\n' +
      'this.character.gainExperience(expReward); // ← polimorfismo',
    backendAction:
      'En POST /combat/:id/attack, executeTurn() llama a character.gainExperience(). ' +
      'Si el personaje levelea, se llama onLevelUp() — que ejecuta el código ' +
      'específico de DarkKnight, DarkWizard o Elf según quién sea el personaje.',
    trigger: 'attack',
  },

  // ─────────────────────────────────────────────────────────
  // 5. INTERFACES
  // ─────────────────────────────────────────────────────────
  interfaces: {
    id:          'interfaces',
    emoji:       '📋',
    title:       'Interfaces',
    subtitle:    'implements',
    accentColor: '#8e44ad',
    tagline:     'Un contrato que garantiza que una clase tenga ciertos métodos.',
    explanation:
      'Attackable dice: "quien me implemente DEBE tener attack() y getAttackPower()". ' +
      'Monster implementa Attackable. Equippable dice: equip(), unequip(), getStatBonus(). ' +
      'Weapon, Armor y Ring implementan Equippable — cada uno a su manera.',
    diagram:
      '  interface Attackable {         interface Equippable {\n' +
      '    attack(): string              equip(): string\n' +
      '    getAttackPower(): number      unequip(): string\n' +
      '  }                              getStatBonus(): object\n' +
      '      ↑                         }\n' +
      '  Monster implements               ↑ ↑ ↑\n' +
      '  BudgeDragon ✓              Weapon Armor Ring\n' +
      '  Goblin ✓                   cada uno a su manera\n' +
      '  AncientDragon ✓',
    codeTitle:   'attackable.interface.ts + monster.entity.ts',
    code:
      '// El CONTRATO\n' +
      'export interface Attackable {\n' +
      '  attack(target: string): string;\n' +
      '  getAttackPower(): number;\n' +
      '}\n\n' +
      '// Monster CUMPLE el contrato\n' +
      'export abstract class Monster implements Attackable {\n' +
      '  attack(targetName: string): string {\n' +
      '    const damage = this.getAttackPower();\n' +
      '    return `${this.name} attacks for ${damage}!`;\n' +
      '  }\n' +
      '  getAttackPower(): number {\n' +
      '    return Math.floor(Math.random() *\n' +
      '      (this.attackMax - this.attackMin) + this.attackMin);\n' +
      '  }\n' +
      '}',
    backendAction:
      'Cuando el monstruo contraataca en executeTurn(), se usa getAttackPower() ' +
      'de la interfaz Attackable. Cualquier monstruo nuevo que agregues solo necesita ' +
      'implementar Attackable y el sistema de combate funciona sin cambios.',
    trigger: 'attack',
  },

  // ─────────────────────────────────────────────────────────
  // 6. INYECCIÓN DE DEPENDENCIAS
  // ─────────────────────────────────────────────────────────
  'inyeccion-di': {
    id:          'inyeccion-di',
    emoji:       '💉',
    title:       'Inyección de Dependencias',
    subtitle:    '@Injectable() — NestJS DI',
    accentColor: '#e67e22',
    tagline:     'NestJS crea y entrega los objetos que necesitas — tú no los instancias.',
    explanation:
      'CombatService necesita CharactersService y MapsService. No hace ' +
      '"new CharactersService()" — se los pide a NestJS en el constructor. ' +
      'NestJS los crea una sola vez y los reutiliza (Singleton por defecto).',
    diagram:
      '  @Module({ providers: [CombatService] })\n' +
      '        ↓ NestJS construye\n' +
      '  new CombatService(\n' +
      '    combatRepo,          ← @InjectRepository\n' +
      '    monsterRepo,         ← @InjectRepository\n' +
      '    charactersService,   ← viene de CharactersModule\n' +
      '    mapsService          ← viene de MapsModule\n' +
      '  )\n' +
      '  Solo existe UNA instancia de cada Service (Singleton)',
    codeTitle:   'combat.service.ts + combat.module.ts',
    code:
      '// @Injectable() = "puedo ser inyectado"\n' +
      '@Injectable()\n' +
      'export class CombatService {\n' +
      '  constructor(\n' +
      '    @InjectRepository(CombatSession)\n' +
      '    private combatRepo: Repository<CombatSession>,\n\n' +
      '    // NestJS inyecta estos services automáticamente\n' +
      '    private readonly charactersService: CharactersService,\n' +
      '    private readonly mapsService: MapsService,\n' +
      '  ) {}\n' +
      '}\n\n' +
      '// combat.module.ts — declara las dependencias\n' +
      '@Module({\n' +
      '  imports: [CharactersModule, MapsModule],  // ← aquí\n' +
      '  providers: [CombatService],\n' +
      '})',
    backendAction:
      'Cuando arranca NestJS (npm run start:dev), construye el "contenedor DI": ' +
      'crea UNA instancia de cada Service y la reutiliza. ' +
      'POST /combat/start llega al Controller → llama al CombatService (ya creado) → ' +
      'que a su vez usa CharactersService (también ya creado).',
    nestjsTip:
      'Si CharactersModule no hace "exports: [CharactersService]", ' +
      'CombatModule no puede inyectarlo. Eso fue un bug clásico en el Sprint 2.',
    trigger: 'start-combat',
  },

  // ─────────────────────────────────────────────────────────
  // 7. ASOCIACIÓN
  // ─────────────────────────────────────────────────────────
  asociacion: {
    id:          'asociacion',
    emoji:       '🔗',
    title:       'Asociación',
    subtitle:    'Character HAS Items',
    accentColor: '#1abc9c',
    tagline:     'Un objeto TIENE otro objeto — sin heredar de él.',
    explanation:
      'Character no hereda de Item — lo CONTIENE en su inventario. ' +
      'Un personaje puede tener muchos items, y un item puede estar ' +
      'en el inventario de muchos personajes (Many-to-Many en la DB).',
    diagram:
      '  Character                Item\n' +
      '  ─────────   items[]      ──────\n' +
      '  Johan    ───────────►  BroadSword\n' +
      '  Merlin   ───────────►  WizardStaff\n' +
      '               ↕         PlateArmor\n' +
      '  DB: tabla character_items\n' +
      '  characterId | itemId\n' +
      '  1 (Johan)   | Weapon-1234...\n' +
      '  1 (Johan)   | Armor-5678...',
    codeTitle:   'character.entity.ts + characters.service.ts',
    code:
      '// character.entity.ts — ASOCIACIÓN declarada\n' +
      '@ManyToMany(() => Item, { eager: true })\n' +
      '@JoinTable({ name: "character_items" })\n' +
      'items: Item[];\n\n' +
      '// characters.service.ts — ASOCIACIÓN en acción\n' +
      'async addItem(characterName: string, itemId: string) {\n' +
      '  const character = await this.characterRepo.findOne(...);\n' +
      '  const item = await this.itemRepo.findOne(...);\n\n' +
      '  // ← ASOCIACIÓN: el personaje CONTIENE el item\n' +
      '  character.items.push(item);\n\n' +
      '  // TypeORM inserta en character_items automáticamente\n' +
      '  await this.characterRepo.save(character);\n' +
      '}',
    backendAction:
      'POST /characters/:name/items con { "itemId": "Weapon-123..." } ' +
      'ejecuta addItem(): busca el personaje, busca el item, hace push() ' +
      'y el save() genera INSERT INTO character_items (characterId, itemId).',
    trigger: 'view-characters',
  },

  // ─────────────────────────────────────────────────────────
  // 8. COMPOSICIÓN
  // ─────────────────────────────────────────────────────────
  composicion: {
    id:          'composicion',
    emoji:       '🧩',
    title:       'Composición',
    subtitle:    'CombatSession = Character + Monster',
    accentColor: '#e74c3c',
    tagline:     'Un objeto se construye COMPONIENDO otros objetos.',
    explanation:
      'CombatSession no hereda de Character ni de Monster — los COMPONE. ' +
      'Un combate ES una sesión que TIENE un personaje y un monstruo. ' +
      'Diferencia con Asociación: CombatSession no existe sin Character y Monster.',
    diagram:
      '  CombatSession\n' +
      '  ├── character: DarkKnight  ← viene de CharactersService\n' +
      '  ├── monster: BudgeDragon   ← clon del monstruo en DB\n' +
      '  ├── monsterCurrentHp: 50   ← HP propio del combate\n' +
      '  ├── turn: 0\n' +
      '  └── status: Active\n\n' +
      '  Si el personaje o monstruo no existen,\n' +
      '  el CombatSession tampoco puede existir.',
    codeTitle:   'combat.entity.ts',
    code:
      '// CombatSession COMPONE Character + Monster\n' +
      'export class CombatSession {\n' +
      '  @ManyToOne(() => Character)\n' +
      '  character: Character;          // ← tiene un personaje\n\n' +
      '  @ManyToOne(() => Monster)\n' +
      '  monster: Monster;              // ← tiene un monstruo\n\n' +
      '  // HP PROPIO del combate — no modifica el monstruo en DB\n' +
      '  monsterCurrentHp: number;\n\n' +
      '  constructor(character, monster, mapName) {\n' +
      '    this.character = character;\n' +
      '    this.monster   = monster;    // ← clon, no el original\n' +
      '    this.monsterCurrentHp = monster.getMaxHealth();\n' +
      '  }\n' +
      '}',
    backendAction:
      'POST /combat/start: CombatService llama a cloneMonster() para crear ' +
      'una copia del monstruo — así cada combate tiene su propio HP. ' +
      'Luego new CombatSession(character, monsterClone, mapName) compone todo.',
    trigger: 'start-combat',
  },
};

// ── Utilidades ────────────────────────────────────────────────

// Conceptos que aplican cuando el usuario crea un personaje
export const CREATE_CHARACTER_CONCEPTS: ConceptId[] = [
  'herencia', 'abstraccion', 'encapsulamiento',
];

// Conceptos que aplican cuando se inicia un combate
export const START_COMBAT_CONCEPTS: ConceptId[] = [
  'composicion', 'inyeccion-di', 'polimorfismo',
];

// Conceptos que aplican cuando se ataca
export const ATTACK_CONCEPTS: ConceptId[] = [
  'polimorfismo', 'interfaces',
];

// Conceptos del HomeScreen (visión general)
export const HOME_CONCEPTS: ConceptId[] = [
  'herencia', 'encapsulamiento', 'inyeccion-di',
  'polimorfismo', 'interfaces', 'asociacion',
  'abstraccion', 'composicion',
];