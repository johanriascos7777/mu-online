//Cuarto concepto: Inyección de Dependencias con NestJS
// src/characters/characters.controller.ts

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharacterClass } from './entities/character.entity';

// @Controller define la ruta base: /characters
@Controller('characters')
export class CharactersController {

    // INYECCIÓN DE DEPENDENCIAS: NestJS crea y provee CharactersService automáticamente
    // No hacemos: private service = new CharactersService() ❌
    // NestJS lo inyecta por nosotros ✅
    constructor(private readonly charactersService: CharactersService) {}

    // POST /characters
    @Post()
    async create(@Body() body: { name: string; characterClass: CharacterClass }) {
        return this.charactersService.createCharacter(body.name, body.characterClass);
    }

    // GET /characters
    @Get()
    async findAll() {
        return this.charactersService.findAll();
    }

    // GET /characters/:name
    @Get(':name')
    async findOne(@Param('name') name: string) {
        // ✅ async/await — findOne ya retorna object, no necesita .toJSON()
        // El Service es async → el Controller también debe ser async
        return this.charactersService.findOne(name);
    }

    // POST /characters/:name/exp
    @Post(':name/exp')
    async gainExp(@Param('name') name: string, @Body() body: { amount: number }) {
        return this.charactersService.gainExp(name, body.amount);
    }
}