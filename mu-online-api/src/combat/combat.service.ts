// src/combat/combat.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CombatSession } from './combat.entity';
import { CharactersService } from '../characters/characters.service';
import { MapsService } from '../maps/maps.service';
import { Monster } from '../monsters/entities/monster.entity';

@Injectable()
export class CombatService {

    constructor(
        @InjectRepository(CombatSession)
        private readonly combatRepo: Repository<CombatSession>,

        @InjectRepository(Monster)
        private readonly monsterRepo: Repository<Monster>,

        private readonly charactersService: CharactersService,
        private readonly mapsService: MapsService,
    ) {}

    async startCombat(characterName: string, mapName: string): Promise<object> {
        const character = await this.charactersService.findOneInstance(characterName);

        const canEnterResult = this.mapsService.canEnter(mapName, character.getLevel()) as any;
        if (!canEnterResult.canEnter) {
            throw new BadRequestException(canEnterResult.message);
        }

        const monsterData = this.mapsService.getRandomMonster(mapName) as any;

        // Busca el monstruo REAL en DB — tiene ID válido para la FK
        const monster = await this.monsterRepo.findOne({
            where: { name: monsterData.monster.name } as any,
        });
        if (!monster) {
            throw new NotFoundException(
                `Monster '${monsterData.monster.name}' not found. Run POST /monsters/seed first.`
            );
        }

        // CombatSession guarda monsterCurrentHp separado del monster template
        const combat = new CombatSession(character, monster, mapName);
        const saved  = await this.combatRepo.save(combat);

        return {
            message: `⚔️ ${characterName} encounters a ${monster.getName()} in ${mapName}!`,
            combat:  saved.toJSON(),
        };
    }

    async attack(combatId: string): Promise<object> {
        const combat     = await this.getCombat(combatId);
        const turnResult = combat.executeTurn();
        await this.combatRepo.save(combat);
        return { message: `Turn ${turnResult.turn} complete`, result: turnResult };
    }

    async useSkill(combatId: string, skillName: string): Promise<object> {
        const combat     = await this.getCombat(combatId);
        const turnResult = combat.executeTurn(skillName);
        await this.combatRepo.save(combat);
        return { message: `${skillName} on Turn ${turnResult.turn}`, result: turnResult };
    }

    async flee(combatId: string): Promise<object> {
        const combat   = await this.getCombat(combatId);
        combat.status  = 'Fled' as any;
        await this.combatRepo.save(combat);
        return { message: 'You fled from battle!' };
    }

    async getCombatState(combatId: string): Promise<object> {
        const combat = await this.getCombat(combatId);
        return combat.toJSON();
    }

    private async getCombat(combatId: string): Promise<CombatSession> {
        const combat = await this.combatRepo.findOne({ where: { id: combatId } as any });
        if (!combat) throw new NotFoundException(`Combat '${combatId}' not found`);
        if (!combat.isActive()) throw new BadRequestException(`Combat is already ${combat.getStatus()}`);
        return combat;
    }
}