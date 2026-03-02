// combat.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CombatService } from './combat.service';

@Controller('combat')
export class CombatController {

  constructor(private readonly combatService: CombatService) {}

  // POST /combat/start
  // Body: { "characterName": "Johan", "mapName": "Lorencia" }
  @Post('start')
  start(@Body() body: { characterName: string; mapName: string }) {
    return this.combatService.startCombat(body.characterName, body.mapName);
  }

  // POST /combat/:id/attack
  @Post(':id/attack')
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