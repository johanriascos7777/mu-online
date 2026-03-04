// src/combat/combat.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombatController } from './combat.controller';
import { CombatService } from './combat.service';
import { CombatSession } from './combat.entity';
import { Monster } from '../monsters/entities/monster.entity';
import { CharactersModule } from '../characters/characters.module';
import { MapsModule } from '../maps/maps.module';

@Module({
    imports: [
        // ← Monster agregado para @InjectRepository(Monster)
        TypeOrmModule.forFeature([CombatSession, Monster]),
        CharactersModule,
        MapsModule,
    ],
    controllers: [CombatController],
    providers:   [CombatService],
})
export class CombatModule {}