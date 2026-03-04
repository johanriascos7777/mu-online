// src/maps/maps.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameMap, MAPS_SEED } from './entities/map.entity';

@Injectable()
export class MapsService {

    constructor(
        @InjectRepository(GameMap)
        private readonly mapRepo: Repository<GameMap>,
    ) {}

    // ── seed — puebla los 5 mapas en DB ──────────────────
    async seed(): Promise<object> {
        const existing = await this.mapRepo.count();
        if (existing > 0) {
            return { message: `Maps already seeded (${existing} found)` };
        }
        await this.mapRepo.save(MAPS_SEED);
        return { message: `${MAPS_SEED.length} maps seeded successfully!` };
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

    canEnter(mapId: string, characterLevel: number): object {
        // canEnter es lógica pura — no necesita DB
        // Solo necesitamos el mapa, que viene del findOne
        // pero para CombatService lo dejamos síncrono por ahora
        const map = MAPS_SEED.find(m => m.id === mapId || m.name === mapId);
        if (!map) throw new NotFoundException(`Map '${mapId}' not found`);
        return map.canEnter(characterLevel);
    }

    getRandomMonster(mapId: string): object {
        // En Sprint 2 esto vendrá de la relación map_monsters
        // Por ahora retorna datos del MAPS_SEED
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