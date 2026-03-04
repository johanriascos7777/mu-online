// src/maps/maps.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameMap, MAPS_SEED } from './entities/map.entity';
import { Monster } from '../monsters/entities/monster.entity';

@Injectable()
export class MapsService {

    constructor(
        @InjectRepository(GameMap)
        private readonly mapRepo: Repository<GameMap>,

        // ── Necesitamos MonsterRepo para la relación ──────
        // Inyectamos Monster directamente aquí para asignar
        // monstruos a los mapas sin depender de MonstersService
        @InjectRepository(Monster)
        private readonly monsterRepo: Repository<Monster>,
    ) {}

    async seed(): Promise<object> {
        const existing = await this.mapRepo.count();
        if (existing > 0) return { message: `Maps already seeded (${existing} found)` };
        await this.mapRepo.save(MAPS_SEED);
        return { message: `${MAPS_SEED.length} maps seeded successfully!` };
    }

    // ── seedMonsters — conecta monstruos a sus mapas ──────
    /**
     * Flujo:
     *   1. Busca el mapa 'lorencia' en DB
     *   2. Busca BudgeDragon y Goblin en DB
     *   3. Asigna: lorencia.monsters = [BudgeDragon, Goblin]
     *   4. repo.save(lorencia) → INSERT INTO map_monsters
     *
     * TypeORM maneja la tabla intermedia automáticamente.
     * Nosotros solo asignamos el array y llamamos save().
     */
    async seedMonsters(): Promise<object> {
        const lorencia = await this.mapRepo.findOne({ where: { id: 'lorencia' } as any });
        if (!lorencia) return { message: 'Seed maps first: POST /maps/seed' };

        if (lorencia.monsters && lorencia.monsters.length > 0) {
            return { message: 'Map monsters already seeded' };
        }

        const allMonsters = await this.monsterRepo.find();
        if (allMonsters.length === 0) {
            return { message: 'Seed monsters first: POST /monsters/seed' };
        }

        // Lorencia tiene todos los monstruos actuales (BudgeDragon, Goblin)
        lorencia.monsters = allMonsters;
        await this.mapRepo.save(lorencia);

        return {
            message: `Lorencia now has ${allMonsters.length} monsters!`,
            monsters: allMonsters.map(m => m.getName()),
        };
    }

    async findAll(): Promise<object[]> {
        const maps = await this.mapRepo.find();
        return maps.map(m => m.toJSON());
    }

    async findOne(id: string): Promise<object> {
        const map = await this.mapRepo.findOne({ where: { id } as any });
        if (!map) throw new NotFoundException(`Map '${id}' not found`);
        return map.toJSON();
    }

    async findOneInstance(id: string): Promise<GameMap> {
        const map = await this.mapRepo.findOne({ where: { id } as any });
        if (!map) throw new NotFoundException(`Map '${id}' not found`);
        return map;
    }

    canEnter(mapId: string, characterLevel: number): object {
        const map = MAPS_SEED.find(m => m.id === mapId || m.name === mapId);
        if (!map) throw new NotFoundException(`Map '${mapId}' not found`);
        return map.canEnter(characterLevel);
    }

    async getRandomMonsterFromDB(mapId: string): Promise<Monster | null> {
        const map = await this.findOneInstance(mapId);
        return map.getRandomMonster();
    }

    getRandomMonster(mapId: string): object {
        const monstersPerMap: Record<string, string[]> = {
            lorencia: ['BudgeDragon', 'Goblin'],
            dungeon:  ['Skeleton', 'Ghost'],
            devias:   ['IceMonster', 'Yeti'],
            noria:    ['ForestMonster', 'EliteYeti'],
            atlans:   ['Bahamut', 'Vepar'],
        };
        const monsters = monstersPerMap[mapId.toLowerCase()] ?? ['BudgeDragon'];
        const random   = monsters[Math.floor(Math.random() * monsters.length)];
        return { monster: { name: random } };
    }
}