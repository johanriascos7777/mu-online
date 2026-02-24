// ============================================================
// ⚔️ COMBAT MODULE
// ============================================================
//
// CombatModule importa CharactersModule y MapsModule porque
// CombatService necesita CharactersService y MapsService.
//
// Para que funcione la inyección, los módulos de origen
// deben tener 'exports: [SuServicio]' — ya los configuramos así.
//
// Sin 'imports' aquí → NestJS no encuentra las dependencias
// → Error: "Nest can't resolve dependencies of CombatService"
// ============================================================

import { Module } from '@nestjs/common';
import { CombatController } from './combat.controller';
import { CombatService } from './combat.service';
import { CharactersModule } from '../characters/characters.module';
import { MapsModule } from '../maps/maps.module';

@Module({
  imports:     [CharactersModule, MapsModule], // necesarios para DI
  controllers: [CombatController],
  providers:   [CombatService],
})
export class CombatModule {}