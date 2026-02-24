// ============================================================
// ⚔️ COMBAT SERVICE
// ============================================================
//
// Este es el servicio más importante del proyecto porque
// CONECTA todos los módulos que hemos construido:
//
//   CharactersService → obtiene el personaje
//   MapsService       → obtiene el mapa y monstruo aleatorio
//   Monster classes   → BudgeDragon, Goblin, etc.
//   CombatSession     → maneja el estado de la batalla
//
// Aquí verás Inyección de Dependencias en su forma más
// poderosa — CombatService no crea sus dependencias,
// NestJS se las inyecta automáticamente.
// ============================================================

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CharactersService } from '../characters/characters.service';
import { MapsService } from '../maps/maps.service';
import { CombatSession, CombatStatus } from './combat.entity';
import { BudgeDragon } from '../monsters/entities/budge-dragon.entity';
import { Goblin } from '../monsters/entities/goblin.entity';
import { Monster } from '../monsters/entities/monster.entity';

@Injectable()
export class CombatService {

  // ── Base de datos temporal de combates activos ──────────
  private combats: Map<string, CombatSession> = new Map();

  // ── Inyección de Dependencias ───────────────────────────
  /**
   * NestJS inyecta CharactersService y MapsService automáticamente.
   * Para que esto funcione, CharactersModule y MapsModule deben
   * exportar sus services (exports: [CharactersService]).
   *
   * Esto es el Concepto 4 (DI) en su máxima expresión:
   * CombatService NO sabe cómo se construyen sus dependencias —
   * solo las usa. NestJS se encarga de todo.
   */
  constructor(
    private readonly charactersService: CharactersService,
    private readonly mapsService: MapsService,
  ) {}

  // ── startCombat — inicia una nueva batalla ───────────────
  /**
   * Flujo:
   *   1. Busca el personaje por nombre
   *   2. Busca el mapa
   *   3. Obtiene un monstruo aleatorio del mapa
   *   4. Crea la CombatSession
   *   5. La guarda en el Map
   *   6. Retorna el estado inicial
   */
  startCombat(characterName: string, mapName: string): object {

    // ① Obtiene el personaje — lanza NotFoundException si no existe
    const character = this.charactersService.findOneInstance(characterName);

    // ② Verifica que el personaje pueda entrar al mapa
    const canEnterResult = this.mapsService.canEnter(mapName, character.getLevel()) as any;
    if (!canEnterResult.canEnter) {
      throw new BadRequestException(canEnterResult.message);
    }

    // ③ Obtiene un monstruo aleatorio del mapa
    const monsterData = this.mapsService.getRandomMonster(mapName) as any;
    const monster     = this.createMonsterInstance(monsterData.monster.name);

    // ④ Crea la sesión de combate
    const combat = new CombatSession(character, monster, mapName);

    // ⑤ Guarda en el Map
    this.combats.set(combat.id, combat);

    return {
      message: `⚔️ ${characterName} encounters a ${monsterData.monster.name} in ${mapName}!`,
      combat:  combat.toJSON(),
    };
  }

  // ── attack — ejecuta un turno de ataque básico ──────────
  attack(combatId: string): object {
    const combat = this.getCombat(combatId);

    const turnResult = combat.executeTurn();

    return {
      message: `Turn ${turnResult.turn} complete`,
      result:  turnResult,
    };
  }

  // ── useSkill — ejecuta un turno con habilidad ───────────
  useSkill(combatId: string, skillName: string): object {
    const combat = this.getCombat(combatId);

    const turnResult = combat.executeTurn(skillName);

    return {
      message: `${skillName} executed on Turn ${turnResult.turn}`,
      result:  turnResult,
    };
  }

  // ── flee — huir del combate ─────────────────────────────
  flee(combatId: string): object {
    const combat = this.getCombat(combatId);
    // En Sprint 2: calcular probabilidad de huida basada en AGI
    this.combats.delete(combatId);
    return { message: 'You fled from battle!' };
  }

  // ── getCombatState — estado actual del combate ───────────
  getCombatState(combatId: string): object {
    const combat = this.getCombat(combatId);
    return combat.toJSON();
  }

  // ── Helpers privados ─────────────────────────────────────

  private getCombat(combatId: string): CombatSession {
    const combat = this.combats.get(combatId);
    if (!combat) throw new NotFoundException(`Combat '${combatId}' not found`);
    if (!combat.isActive()) throw new BadRequestException(`Combat is already ${combat.getStatus()}`);
    return combat;
  }

  /**
   * Crea la instancia del monstruo correcto según su nombre.
   * En Sprint 2 esto vendrá de la DB con TypeORM.
   *
   * Polimorfismo: todos son Monster pero cada uno
   * tiene sus propios stats y comportamiento.
   */
  private createMonsterInstance(monsterName: string): Monster {
    switch (monsterName) {
      case 'BudgeDragon': return new BudgeDragon();
      case 'Goblin':      return new Goblin();
      // En Sprint 2 agregaremos más monstruos aquí
      default:            return new BudgeDragon(); // fallback
    }
  }
}