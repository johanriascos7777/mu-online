// combat.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CombatService } from './combat.service';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('⚔️ Combat — Composición + Polimorfismo + DI')
@Controller('combat')
export class CombatController {

  constructor(private readonly combatService: CombatService) {}

  // POST /combat/start
  // Body: { "characterName": "Johan", "mapName": "Lorencia" }
@Post('start')
  @ApiOperation({
    summary: 'Inicia un combate',
    description:
      '🧩 POO: Composición + Inyección DI\n\n' +
      'CombatService (inyectado) llama a CharactersService (inyectado) y MapsService.\n' +
      'Crea CombatSession = Character + Monster. Cada combate tiene su propio HP de monstruo.',
  })
  @ApiBody({ schema: { example: { characterName: 'Johan', mapName: 'lorencia' } } })
  start(@Body() body: { characterName: string; mapName: string }) {
    return this.combatService.startCombat(body.characterName, body.mapName);
  }
  
  // POST /combat/:id/attack
 @Post(':id/attack')
  @ApiOperation({
    summary: 'Ejecuta un turno de ataque',
    description:
      '🎭 POO: Polimorfismo\n\n' +
      'executeTurn() llama a character.gainExperience() sin saber el tipo exacto.\n' +
      'Si levelea, onLevelUp() se ejecuta diferente según si es DarkKnight/DarkWizard/Elf.',
  })
  @ApiParam({ name: 'id', example: 'combat-1234567890' })
  attack(@Param('id') id: string) {
    return this.combatService.attack(id);
  }

  // POST /combat/:id/skill
  // Body: { "skillName": "TwistingSlash" }
  @Post(':id/skill')
  useSkill(
    @Param('id') id: string,
    @Body() body: { skillName: string },
  ) {
    return this.combatService.useSkill(id, body.skillName);
  }

  // POST /combat/:id/flee
  @Post(':id/flee')
  flee(@Param('id') id: string) {
    return this.combatService.flee(id);
  }

  // GET /combat/:id
  @Get(':id')
  getState(@Param('id') id: string) {
    return this.combatService.getCombatState(id);
  }
}