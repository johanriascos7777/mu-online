// src/combat/combat.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CombatSession } from './combat.entity';
import { CharactersService } from '../characters/characters.service';
import { MapsService } from '../maps/maps.service';
import { Monster } from '../monsters/entities/monster.entity';
// ── FIX: importamos las clases hijas para poder clonar el monstruo ──
import { BudgeDragon } from '../monsters/entities/budge-dragon.entity';
import { Goblin } from '../monsters/entities/goblin.entity';
import { AncientDragon } from '../monsters/entities/ancient-dragon.entity'; // ← ESTE FALTA

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

        // ── FIX: usamos cloneMonster para que cada combate tenga su
        // propio HP sin afectar el registro original de la DB.
        // Antes pasábamos 'monster' directo → todos los combates
        // compartían el mismo HP y se corrompían entre sí.
        const monsterClone = this.cloneMonster(monster);

        // CombatSession guarda monsterCurrentHp separado del monster template
        const combat = new CombatSession(character, monsterClone, mapName);
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

    // ── FIX: nombre real de la DB = 'Budge Dragon' con espacio ──────
    // El seed guarda el nombre como 'Budge Dragon' (con espacio).
    // Antes el switch usaba 'BudgeDragon' (sin espacio) → nunca matcheaba
    // → siempre retornaba not found porque buscaba el nombre incorrecto.
    private cloneMonster(monster: Monster): Monster {
        switch (monster.name) {
            case 'Budge Dragon': return new BudgeDragon(); // ← con espacio
            case 'Goblin':       return new Goblin();
            case 'Ancient Dragon': return new AncientDragon();
            default:             return new BudgeDragon();
        }
    }
}