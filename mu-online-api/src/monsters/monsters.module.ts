// src/monsters/monsters.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonstersController } from './monsters.controller';
import { MonstersService } from './monsters.service';
import { Monster } from './entities/monster.entity';
import { BudgeDragon } from './entities/budge-dragon.entity';
import { Goblin } from './entities/goblin.entity';
import { AncientDragon } from './entities/ancient-dragon.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Monster, BudgeDragon, Goblin, AncientDragon]),
    ],
    controllers: [MonstersController],
    providers:   [MonstersService],
    exports:     [MonstersService], // CombatService lo necesitará
})
export class MonstersModule {}