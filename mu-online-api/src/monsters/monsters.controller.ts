// src/monsters/monsters.controller.ts

import { Controller, Get, Post, Param } from '@nestjs/common';
import { MonstersService } from './monsters.service';

@Controller('monsters')
export class MonstersController {

    constructor(private readonly monstersService: MonstersService) {}

    // POST /monsters/seed — pobla la tabla con los monstruos base
    @Post('seed')
    async seed() {
        return this.monstersService.seed();
    }

    // GET /monsters
    @Get()
    async findAll() {
        return this.monstersService.findAll();
    }

    // GET /monsters/:id
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.monstersService.findOne(parseInt(id));
    }

    // GET /monsters/map/:mapName
    @Get('map/:mapName')
    async findByMap(@Param('mapName') mapName: string) {
        return this.monstersService.findByMap(mapName);
    }
}