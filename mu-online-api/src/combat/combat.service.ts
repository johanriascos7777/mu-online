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
import { CombatSession } from './combat.entity';
import { BudgeDragon } from '../monsters/entities/budge-dragon.entity';
import { Goblin } from '../monsters/entities/goblin.entity';
import { Monster } from '../monsters/entities/monster.entity';
import { DarkKnight } from '../characters/entities/dark-knight.entity';
import { DarkWizard } from '../characters/entities/dark-wizard.entity';
import { Elf } from '../characters/entities/elf.entity';

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
   *
   * ─────────────────────────────────────────────────────────
   * 🐛 ERROR QUE TUVIMOS Y CÓMO SE RESOLVIÓ:
   * ─────────────────────────────────────────────────────────
   * Error 1: Property 'getLevel' does not exist on type
   *          'Promise<DarkKnight | DarkWizard | Elf>'
   *
   * Error 2: Argument of type 'Promise<DarkKnight | ...>'
   *          is not assignable to parameter of type 'Character'
   *
   * CAUSA:
   * En Sprint 1, findOneInstance() era síncrono — retornaba
   * el objeto directamente desde el Map en RAM.
   * En Sprint 2 con TypeORM, findOneInstance() es ASYNC —
   * retorna una Promise<Character>, no el Character directo.
   *
   * Sin 'await', 'character' era una Promise, no un objeto.
   * Una Promise no tiene .getLevel() ni puede pasarse como Character.
   *
   * SOLUCIÓN:
   * 1. Agregar 'async' al método startCombat
   * 2. Agregar 'await' antes de findOneInstance()
   *
   * Regla para recordar:
   *   Si el Service que llamas es async → usa await
   *   Si usas await → tu método también debe ser async
   * ─────────────────────────────────────────────────────────
   */
  async startCombat(characterName: string, mapName: string): Promise<object> {

    // ① Obtiene el personaje — 'await' porque findOneInstance es async
    // Sin 'await' → character sería Promise<Character>, no Character
    const character = await this.charactersService.findOneInstance(characterName);

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
      default:            return new BudgeDragon(); // fallback
    }
  }
}