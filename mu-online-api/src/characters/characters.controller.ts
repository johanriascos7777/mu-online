// src/characters/characters.controller.ts

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharacterClass } from './entities/character.entity';

@Controller('characters')
export class CharactersController {

    constructor(private readonly charactersService: CharactersService) {}

    @Post()
    async create(@Body() body: { name: string; characterClass: CharacterClass }) {
        return this.charactersService.createCharacter(body.name, body.characterClass);
    }

    @Get()
    async findAll() {
        return this.charactersService.findAll();
    }

    @Get(':name')
    async findOne(@Param('name') name: string) {
        return this.charactersService.findOne(name);
    }

    @Post(':name/exp')
    async gainExp(@Param('name') name: string, @Body() body: { amount: number }) {
        return this.charactersService.gainExp(name, body.amount);
    }

    // POST /characters/:name/items
    // Body: { "itemId": "WEAPON-1234567890" }
    @Post(':name/items')
    async addItem(
        @Param('name') name: string,
        @Body() body: { itemId: string },
    ) {
        return this.charactersService.addItem(name, body.itemId);
    }
}