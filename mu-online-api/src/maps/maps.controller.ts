// src/maps/maps.controller.ts

import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { MapsService } from './maps.service';

@Controller('maps')
export class MapsController {

    constructor(private readonly mapsService: MapsService) {}

    @Post('seed')
    async seed() {
        return this.mapsService.seed();
    }

    // POST /maps/seed-monsters — conecta monstruos a los mapas
    @Post('seed-monsters')
    async seedMonsters() {
        return this.mapsService.seedMonsters();
    }

    @Get()
    async findAll() {
        return this.mapsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.mapsService.findOne(id);
    }

    @Get(':id/enter')
    canEnter(@Param('id') id: string, @Query('level') level: string) {
        return this.mapsService.canEnter(id, parseInt(level));
    }

    @Get(':id/monster')
    getRandomMonster(@Param('id') id: string) {
        return this.mapsService.getRandomMonster(id);
    }
}