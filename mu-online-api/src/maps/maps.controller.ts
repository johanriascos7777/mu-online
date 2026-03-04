// src/maps/maps.controller.ts

import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { MapsService } from './maps.service';

@Controller('maps')
export class MapsController {

    constructor(private readonly mapsService: MapsService) {}

    // POST /maps/seed
    @Post('seed')
    async seed() {
        return this.mapsService.seed();
    }

    // GET /maps
    @Get()
    async findAll() {
        return this.mapsService.findAll();
    }

    // GET /maps/:id
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.mapsService.findOne(id);
    }

    // GET /maps/:id/enter?level=5
    @Get(':id/enter')
    canEnter(@Param('id') id: string, @Query('level') level: string) {
        return this.mapsService.canEnter(id, parseInt(level));
    }

    // GET /maps/:id/monster
    @Get(':id/monster')
    getRandomMonster(@Param('id') id: string) {
        return this.mapsService.getRandomMonster(id);
    }
}