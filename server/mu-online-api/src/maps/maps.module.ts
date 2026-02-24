import { Module } from '@nestjs/common';
import { MapsController } from './maps.controller';
import { MapsService } from './maps.service';

@Module({
  controllers: [MapsController],
  providers:   [MapsService],
  exports:     [MapsService], // CombatModule lo necesitará para saber qué monstruos hay
})
export class MapsModule {}