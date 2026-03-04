// src/maps/maps.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapsController } from './maps.controller';
import { MapsService } from './maps.service';
import { GameMap } from './entities/map.entity';
import { Monster } from '../monsters/entities/monster.entity';

// ── Monster se agrega al forFeature ──────────────────────
// MapsService necesita @InjectRepository(Monster) para
// asignar monstruos a mapas en seedMonsters().
// Sin registrarlo aquí → error de DI en runtime.

@Module({
    imports: [
        TypeOrmModule.forFeature([GameMap, Monster]),
    ],
    controllers: [MapsController],
    providers:   [MapsService],
    exports:     [MapsService],
})
export class MapsModule {}