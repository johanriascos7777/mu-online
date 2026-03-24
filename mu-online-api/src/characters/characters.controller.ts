// src/characters/characters.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse
} from '@nestjs/swagger';
import { CharactersService } from './characters.service';
import { CharacterClass } from './entities/character.entity';

// @ApiTags agrupa los endpoints en la UI de Swagger
@ApiTags('⚔️ Characters — Herencia + Encapsulamiento')
@Controller('characters')
export class CharactersController {

  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  @ApiOperation({
    summary: 'Crea un personaje',
    description:
      '🧬 POO: Herencia + Abstracción\n\n' +
      'Internamente: new DarkKnight(name) → super() → initializeStats()\n' +
      'TypeORM guarda en tabla "characters" con columna type="DarkKnight"',
  })
  @ApiBody({
    schema: {
      example: { name: 'Johan', characterClass: 'DarkKnight' },
      properties: {
        name: { type: 'string', example: 'Johan' },
        characterClass: {
          type: 'string',
          enum: ['DarkKnight', 'DarkWizard', 'Elf'],
          example: 'DarkKnight',
        },
      },
    },
  })
  async create(@Body() body: { name: string; characterClass: CharacterClass }) {
    return this.charactersService.createCharacter(body.name, body.characterClass);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista todos los personajes',
    description:
      '🔒 POO: Encapsulamiento\n\n' +
      'Devuelve toJSON() de cada personaje — nunca expone campos internos de TypeORM. ' +
      'HP y MP vienen como "155/155" (formato controlado).',
  })
  async findAll() {
    return this.charactersService.findAll();
  }

  @Get(':name')
  @ApiOperation({ summary: 'Busca un personaje por nombre' })
  @ApiParam({ name: 'name', example: 'Johan' })
  async findOne(@Param('name') name: string) {
    return this.charactersService.findOne(name);
  }

  @Post(':name/exp')
  @ApiOperation({
    summary: 'Gana experiencia',
    description:
      '🎭 POO: Polimorfismo\n\n' +
      'gainExperience() → si levelea → onLevelUp() → diferente en cada clase.\n' +
      'DarkKnight sube +7 STR, DarkWizard sube +10 ENE, Elf sube +7 AGI.',
  })
  @ApiParam({ name: 'name', example: 'Johan' })
  @ApiBody({ schema: { example: { amount: 5000 } } })
  async gainExp(@Param('name') name: string, @Body() body: { amount: number }) {
    return this.charactersService.gainExp(name, body.amount);
  }

  @Post(':name/items')
  @ApiOperation({
    summary: 'Agrega un item al inventario',
    description:
      '🔗 POO: Asociación (Many-to-Many)\n\n' +
      'character.items.push(item) → TypeORM inserta en character_items.\n' +
      'Primero crea un item con POST /items, luego úsalo aquí.',
  })
  @ApiParam({ name: 'name', example: 'Johan' })
  @ApiBody({ schema: { example: { itemId: 'WEAPON-1234567890' } } })
  async addItem(
    @Param('name') name: string,
    @Body() body: { itemId: string },
  ) {
    return this.charactersService.addItem(name, body.itemId);
  }
}