import { Controller, Get, Param, Query } from '@nestjs/common';
import { MapsService } from './maps.service';

@Controller('maps')
export class MapsController {

  constructor(private readonly mapsService: MapsService) {}

  // GET /maps
  @Get()
  findAll() {
    return this.mapsService.findAll();
  }

  // GET /maps/lorencia
  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.mapsService.findOne(name);
  }

  // GET /maps/lorencia/enter?level=12
  // @Query() extrae parámetros de la URL después del '?'
  @Get(':name/enter')
  canEnter(
    @Param('name') name: string,
    @Query('level') level: string,
  ) {
    return this.mapsService.canEnter(name, parseInt(level));
  }

  // GET /maps/lorencia/monster
  @Get(':name/monster')
  getRandomMonster(@Param('name') name: string) {
    return this.mapsService.getRandomMonster(name);
  }
}