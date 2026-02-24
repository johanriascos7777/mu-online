import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { GameMap, MapName, MAPS } from './entities/map.entity';

@Injectable()
export class MapsService {

  // ── Los mapas viven en el objeto MAPS (datos quemados Sprint 1)
  // En Sprint 2 esto será: constructor(private mapRepo: Repository<GameMap>)
  private maps: Record<MapName, GameMap> = MAPS;

  // ── findAll — retorna todos los mapas ───────────────────
  findAll(): object[] {
    return Object.values(this.maps).map(m => m.toJSON());
  }

  // ── findOne — busca un mapa por nombre ──────────────────
  findOne(name: string): object {
    // Busca el MapName enum que coincida (case insensitive)
    const mapName = Object.values(MapName).find(
      mn => mn.toLowerCase() === name.toLowerCase()
    );

    if (!mapName) {
      throw new NotFoundException(`Map '${name}' not found. Available: ${Object.values(MapName).join(', ')}`);
    }

    return this.maps[mapName].toJSON();
  }

  // ── canEnter — verifica si el personaje puede entrar ────
  /**
   * Retorna si un personaje de cierto nivel puede entrar al mapa.
   * En Sprint 2 esto recibirá el personaje real de la DB.
   */
  canEnter(mapName: string, characterLevel: number): object {
    const map = this.getMapByName(mapName);
    const allowed = map.canEnter(characterLevel);

    return {
      map:            map.toJSON(),
      characterLevel,
      canEnter:       allowed,
      message:        allowed
        ? `Level ${characterLevel} can enter ${mapName}!`
        : `Level ${characterLevel} cannot enter ${mapName}. Required: ${map.minLevel}-${map.maxLevel}`,
    };
  }

  // ── getRandomMonster — monstruo aleatorio del mapa ──────
  getRandomMonster(mapName: string): object {
    const map = this.getMapByName(mapName);
    const monster = map.getRandomMonster();

    return {
      map:     mapName,
      monster,
      message: `A wild ${monster.name} (Lv.${monster.level}) appears in ${mapName}!`,
    };
  }

  // ── Helper privado ────────────────────────────────────
  private getMapByName(name: string): GameMap {
    const mapName = Object.values(MapName).find(
      mn => mn.toLowerCase() === name.toLowerCase()
    );
    if (!mapName) throw new NotFoundException(`Map '${name}' not found`);
    return this.maps[mapName];
  }
}