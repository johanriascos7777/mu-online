// ============================================================
// 🗺️ MAP ENTITY — Clase concreta (no abstracta)
// ============================================================
//
// ¿Por qué Map NO es abstracta como Character o Item?
//
// Character era abstracta porque "un personaje genérico"
// no tiene sentido — siempre es DarkKnight, DarkWizard o Elf.
//
// Map SÍ puede instanciarse directamente porque todos los mapas
// comparten la misma estructura — solo cambian los DATOS:
//   new GameMap('Lorencia', 1, 40, ['BudgeDragon', 'Goblin'])
//   new GameMap('Dungeon',  40, 80, ['Skeleton', 'DarkKnight'])
//
// Es como un registro en Django:
//   Map.objects.create(name='Lorencia', minLevel=1, maxLevel=40)
// ============================================================

// ── Enum de mapas disponibles ────────────────────────────────
/**
 * Usamos enum en vez de strings para evitar errores de tipeo.
 * Sin enum: map.name = 'lorencia' o 'Lorencia' o 'LORENCIA' → inconsistente
 * Con enum:  map.name = MapName.LORENCIA                    → siempre igual
 */
export enum MapName {
  LORENCIA  = 'Lorencia',
  DUNGEON   = 'Dungeon',
  DEVIAS    = 'Devias',
  NORIA     = 'Noria',
  ATLANS    = 'Atlans',
}

// ── Interfaz para la estructura de un monstruo en el mapa ───
/**
 * Define qué información guardamos de cada monstruo
 * que habita el mapa. En Sprint 2 esto vendrá de la DB
 * con una relación Many-to-Many entre Map y Monster.
 */
export interface MapMonster {
  name: string;
  level: number;
  spawnRate: 'common' | 'uncommon' | 'rare'; // qué tan frecuente aparece
}

// ============================================================
// CLASE GameMap
// ============================================================
// Nota: usamos 'GameMap' y no 'Map' para evitar conflicto
// con el Map nativo de JavaScript que ya usamos en los services.
// ============================================================
export class GameMap {

  // 'readonly' → estas propiedades no cambian después de crearse
  // Un mapa no puede cambiar su nombre ni su rango de nivel
  // Es como 'const' pero para propiedades de clase
  readonly id: string;
  readonly name: MapName;
  readonly minLevel: number;   // nivel mínimo recomendado
  readonly maxLevel: number;   // nivel máximo recomendado
  readonly description: string;
  readonly monsters: MapMonster[];
  readonly backgroundTheme: string; // para el frontend en Sprint 2

  constructor(
    name: MapName,
    minLevel: number,
    maxLevel: number,
    description: string,
    monsters: MapMonster[],
    backgroundTheme: string,
  ) {
    // ID generado del nombre del mapa — siempre predecible
    // Lorencia → 'map-lorencia', Dungeon → 'map-dungeon'
    this.id              = `map-${name.toLowerCase()}`;
    this.name            = name;
    this.minLevel        = minLevel;
    this.maxLevel        = maxLevel;
    this.description     = description;
    this.monsters        = monsters;
    this.backgroundTheme = backgroundTheme;
  }

  // ── Método utilitario ─────────────────────────────────
  /**
   * Verifica si un personaje de cierto nivel puede entrar al mapa.
   * ': boolean' → retorna true o false
   *
   * Ejemplo:
   *   lorencia.canEnter(12) → true  (nivel 1-40)
   *   lorencia.canEnter(150) → false (muy alto para Lorencia)
   */
  canEnter(characterLevel: number): boolean {
    return characterLevel >= this.minLevel && characterLevel <= this.maxLevel;
  }

  /**
   * Retorna un monstruo aleatorio del mapa para iniciar combate.
   * En Sprint 2, esto buscará el monstruo en la DB.
   *
   * 'Math.random()' genera número entre 0 y 1
   * 'Math.floor()' redondea hacia abajo
   * Juntos seleccionan un índice aleatorio del array
   */
  getRandomMonster(): MapMonster {
    const randomIndex = Math.floor(Math.random() * this.monsters.length);
    return this.monsters[randomIndex];
  }

  // ── toJSON ────────────────────────────────────────────
  toJSON(): object {
    return {
      id:              this.id,
      name:            this.name,
      levelRange:      `${this.minLevel} - ${this.maxLevel}`,
      description:     this.description,
      monsters:        this.monsters,
      backgroundTheme: this.backgroundTheme,
    };
  }
}

// ============================================================
// DATOS DE LOS MAPAS — Los 5 mapas del diseño
// ============================================================
/**
 * Estos son los datos quemados del Sprint 1.
 * En Sprint 2 vendrán de la base de datos con TypeORM.
 *
 * Usamos funciones factory igual que en items —
 * así podemos crear instancias frescas cuando sea necesario.
 */

export const MAPS: Record<MapName, GameMap> = {

  // ── Lorencia — El mapa inicial ──────────────────────────
  [MapName.LORENCIA]: new GameMap(
    MapName.LORENCIA,
    1,    // nivel mínimo
    40,   // nivel máximo
    'The starting city of MU. Rolling hills and ancient ruins surround this once-peaceful town.',
    [
      { name: 'BudgeDragon', level: 3,  spawnRate: 'common'   },
      { name: 'Goblin',      level: 5,  spawnRate: 'common'   },
      { name: 'HellSpider',  level: 8,  spawnRate: 'uncommon' },
      { name: 'Lich',        level: 15, spawnRate: 'rare'     },
    ],
    'lorencia-plains', // tema visual para el frontend
  ),

  // ── Dungeon — Zona de nivel medio ───────────────────────
  [MapName.DUNGEON]: new GameMap(
    MapName.DUNGEON,
    40,
    80,
    'Deep underground caverns filled with undead creatures and dark magic.',
    [
      { name: 'Skeleton',        level: 42, spawnRate: 'common'   },
      { name: 'DarkKnight NPC',  level: 50, spawnRate: 'uncommon' },
      { name: 'Ghost',           level: 55, spawnRate: 'common'   },
      { name: 'GreatDragon',     level: 70, spawnRate: 'rare'     },
    ],
    'dungeon-caverns',
  ),

  // ── Devias — Tierras nevadas ─────────────────────────────
  [MapName.DEVIAS]: new GameMap(
    MapName.DEVIAS,
    80,
    130,
    'Frozen wastelands at the northern edge of the continent.',
    [
      { name: 'IceMonster',  level: 82,  spawnRate: 'common'   },
      { name: 'Yeti',        level: 90,  spawnRate: 'common'   },
      { name: 'IceQueen',    level: 120, spawnRate: 'rare'     },
    ],
    'devias-snow',
  ),

  // ── Noria — Tierra de los Elfos ─────────────────────────
  [MapName.NORIA]: new GameMap(
    MapName.NORIA,
    50,
    100,
    'Ancient elven forests with powerful magical creatures.',
    [
      { name: 'ForestMonster', level: 55, spawnRate: 'common'   },
      { name: 'EliteYeti',     level: 75, spawnRate: 'uncommon' },
      { name: 'Cursedking',    level: 95, spawnRate: 'rare'     },
    ],
    'noria-forest',
  ),

  // ── Atlans — Las profundidades ──────────────────────────
  [MapName.ATLANS]: new GameMap(
    MapName.ATLANS,
    130,
    999,
    'Ancient underwater ruins. Only the most powerful warriors dare enter.',
    [
      { name: 'Bahamut',       level: 140, spawnRate: 'common'   },
      { name: 'Vepar',         level: 160, spawnRate: 'uncommon' },
      { name: 'GoldenLizard',  level: 200, spawnRate: 'rare'     },
    ],
    'atlans-deep',
  ),
};