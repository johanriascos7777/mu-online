// src/maps/maps.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapsController } from './maps.controller';
import { MapsService } from './maps.service';
import { GameMap } from './entities/map.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([GameMap]),
    ],
    controllers: [MapsController],
    providers:   [MapsService],
    exports:     [MapsService], // CombatService lo necesita
})
export class MapsModule {}