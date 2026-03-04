// src/maps/entities/map.entity.ts
// + Relación Many-to-Many con Monsters

import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Monster } from '../../monsters/entities/monster.entity';

// ============================================================
// 📖 RELACIÓN Map ↔ Monster
// ============================================================
//
// Un mapa tiene MUCHOS monstruos (Lorencia tiene BudgeDragon y Goblin)
// Un monstruo puede estar en MUCHOS mapas (BudgeDragon en Lorencia y Dungeon)
// → Many-to-Many
//
// TypeORM creará la tabla:
//   map_monsters:
//     mapId     | monsterId
//     lorencia  | 1          ← BudgeDragon en Lorencia
//     lorencia  | 2          ← Goblin en Lorencia
//     dungeon   | 1          ← BudgeDragon también en Dungeon
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

    // ── RELACIÓN Many-to-Many con Monsters ────────────────
    @ManyToMany(() => Monster, { eager: true })
    @JoinTable({
        name: 'map_monsters',
        joinColumn:        { name: 'mapId' },
        inverseJoinColumn: { name: 'monsterId' },
    })
    monsters: Monster[];

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
            this.minLevel        = minLevel!;
            this.maxLevel        = maxLevel!;
            this.description     = description!;
            this.backgroundTheme = backgroundTheme!;
            this.monsters        = [];
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

    // Retorna un monstruo aleatorio del mapa desde DB
    getRandomMonster(): Monster | null {
        if (!this.monsters || this.monsters.length === 0) return null;
        return this.monsters[Math.floor(Math.random() * this.monsters.length)];
    }

    toJSON() {
        return {
            id:              this.id,
            name:            this.name,
            levelRange:      `${this.minLevel} - ${this.maxLevel}`,
            description:     this.description,
            backgroundTheme: this.backgroundTheme,
            monsters:        this.monsters?.map(m => m.toJSON()) ?? [],
        };
    }
}

export const MAPS_SEED = [
    new GameMap('lorencia', MapName.LORENCIA, 1,   40,  'The starting town of MU Online',      'town'),
    new GameMap('dungeon',  MapName.DUNGEON,  40,  80,  'Dark underground full of undead',      'dark'),
    new GameMap('devias',   MapName.DEVIAS,   80,  130, 'Frozen lands with powerful monsters',  'snow'),
    new GameMap('noria',    MapName.NORIA,    50,  100, 'Magical forest with elven creatures',  'forest'),
    new GameMap('atlans',   MapName.ATLANS,   130, 999, 'Underwater city for the strongest',    'water'),
];