// src/monsters/monsters.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Monster } from './entities/monster.entity';
import { BudgeDragon } from './entities/budge-dragon.entity';
import { Goblin } from './entities/goblin.entity';

@Injectable()
export class MonstersService {

    constructor(
        @InjectRepository(Monster)
        private readonly monsterRepo: Repository<Monster>,
    ) {}

    // ── seed — crea los monstruos base en la DB ───────────
    /**
     * En Sprint 1 los monstruos se creaban en RAM cada vez.
     * En Sprint 2 los sembramos una sola vez en la DB.
     * Llamar a POST /monsters/seed para poblar la tabla.
     */
    async seed(): Promise<object> {
        const existing = await this.monsterRepo.count();
        if (existing > 0) {
            return { message: `Monsters already seeded (${existing} found)` };
        }

        const monsters = [
            new BudgeDragon(),
            new Goblin(),
        ];

        await this.monsterRepo.save(monsters);
        return { message: `${monsters.length} monsters seeded successfully!` };
    }

    async findAll(): Promise<object[]> {
        const monsters = await this.monsterRepo.find();
        return monsters.map(m => m.toJSON());
    }

    async findOne(id: number): Promise<object> {
        const monster = await this.monsterRepo.findOne({ where: { id } as any });
        if (!monster) throw new NotFoundException(`Monster id ${id} not found`);
        return monster.toJSON();
    }

    // Retorna instancia POO para CombatService
    async findOneInstance(id: number): Promise<Monster> {
        const monster = await this.monsterRepo.findOne({ where: { id } as any });
        if (!monster) throw new NotFoundException(`Monster id ${id} not found`);
        return monster;
    }

    // Retorna monstruos de un mapa específico
    async findByMap(mapName: string): Promise<Monster[]> {
        return this.monsterRepo.find({ where: { map: mapName } as any });
    }
}