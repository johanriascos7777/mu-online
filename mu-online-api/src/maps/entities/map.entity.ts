// src/maps/entities/map.entity.ts
// + TypeORM Sprint 2: mapeo a tabla maps en PostgreSQL

import {
    Entity,
    PrimaryColumn,
    Column,
} from 'typeorm';

// ============================================================
// 📖 MAP — el más simple de todos
// ============================================================
//
// Character → @Entity + @TableInheritance (tiene hijos)
// Monster   → @Entity + @TableInheritance (tiene hijos)
// Item      → @Entity + @TableInheritance (tiene hijos)
// Map       → @Entity solo ← NO tiene hijos, una sola tabla
//
// ¿Por qué no necesita @TableInheritance?
// Todos los mapas son iguales en estructura — Lorencia,
// Dungeon, Devias, Noria y Atlans tienen los mismos campos.
// Solo cambian los VALORES, no la estructura.
//
// En la DB quedará:
//   id       | name     | minLevel | maxLevel | description
//   lorencia | Lorencia | 1        | 40       | The starting town...
//   dungeon  | Dungeon  | 40       | 80       | Dark underground...
// ============================================================

export enum MapName {
    LORENCIA = 'Lorencia',
    DUNGEON  = 'Dungeon',
    DEVIAS   = 'Devias',
    NORIA    = 'Noria',
    ATLANS   = 'Atlans',
}

@Entity('maps')
export class GameMap {

    // @PrimaryColumn() → ID string descriptivo, igual que Item
    // 'lorencia', 'dungeon', 'devias', etc.
    @PrimaryColumn()
    id: string;

    @Column({ unique: true })
    name: string;

    @Column()
    minLevel: number;

    @Column()
    maxLevel: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    backgroundTheme: string;

    constructor(
        id?: string,
        name?: string,
        minLevel?: number,
        maxLevel?: number,
        description?: string,
        backgroundTheme?: string,
    ) {
        if (id && name) {
            this.id              = id;
            this.name            = name;
            this.minLevel        = minLevel!;        // ← agrega !
            this.maxLevel        = maxLevel!;        // ← agrega !
            this.description     = description!;    // ← agrega !
            this.backgroundTheme = backgroundTheme!; // ← agrega !
        }
    }

    canEnter(characterLevel: number): { canEnter: boolean; message: string } {
        if (characterLevel < this.minLevel) {
            return {
                canEnter: false,
                message: `You need level ${this.minLevel} to enter ${this.name}. Your level: ${characterLevel}`,
            };
        }
        if (characterLevel > this.maxLevel) {
            return {
                canEnter: false,
                message: `${this.name} is too easy for level ${characterLevel}. Max level: ${this.maxLevel}`,
            };
        }
        return { canEnter: true, message: `Welcome to ${this.name}!` };
    }

    toJSON() {
        return {
            id:              this.id,
            name:            this.name,
            levelRange:      `${this.minLevel} - ${this.maxLevel}`,
            description:     this.description,
            backgroundTheme: this.backgroundTheme,
        };
    }
}

// ── Datos semilla — los 5 mapas de MU Online ─────────────
// En Sprint 1 estos vivían en RAM como constante MAPS.
// En Sprint 2 los sembramos en DB con POST /maps/seed
export const MAPS_SEED = [
    new GameMap('lorencia', MapName.LORENCIA, 1,   40,  'The starting town of MU Online',        'town'),
    new GameMap('dungeon',  MapName.DUNGEON,  40,  80,  'Dark underground full of undead',        'dark'),
    new GameMap('devias',   MapName.DEVIAS,   80,  130, 'Frozen lands with powerful monsters',   'snow'),
    new GameMap('noria',    MapName.NORIA,    50,  100, 'Magical forest with elven creatures',   'forest'),
    new GameMap('atlans',   MapName.ATLANS,   130, 999, 'Underwater city for the strongest',     'water'),
];