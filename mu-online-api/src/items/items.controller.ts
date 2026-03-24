// ============================================================
// 📖 BITÁCORA: El Controlador en NestJS
// ============================================================
//
// El Controlador es el PUNTO DE ENTRADA de las peticiones HTTP.
// Su única responsabilidad es:
//   1. Recibir el request
//   2. Extraer los datos (body, params, query)
//   3. Llamar al Service
//   4. Retornar la respuesta
//
// NUNCA debe contener lógica de negocio — eso es del Service.
// Si el Controller se vuelve largo, algo está mal.
//
// Comparación con Django:
//   NestJS Controller = urls.py + la función de views.py
//   NestJS Service    = la lógica dentro de views.py
// ============================================================

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';

// @Controller('items') define la ruta base: /items
// Todos los métodos dentro tendrán rutas relativas a /items
@ApiTags('🗡️ Items — Herencia + Interfaces (Equippable)')
@Controller('items')
export class ItemsController {

  // ── Inyección de Dependencias ───────────────────────────
  /**
   * NestJS inyecta ItemsService automáticamente aquí.
   * No hacemos: this.itemsService = new ItemsService()
   * NestJS lo crea y lo pasa al constructor por nosotros.
   *
   * 'private readonly' → solo accesible en este Controller
   * y no puede ser reasignado después de la construcción.
   */
  constructor(private readonly itemsService: ItemsService) {}

  // ── POST /items ─────────────────────────────────────────
  /**
   * @Body() extrae el JSON del request y lo convierte a objeto JS.
   * Ejemplo body: { "type": "BroadSword", "level": 3, "rarity": "Ancient" }
   */
@Post()
  @ApiOperation({
    summary: 'Crea un item',
    description:
      '🧬 POO: Herencia\n\n' +
      'Item (abstract) → Weapon / Armor / Ring\n' +
      'Cada uno implementa Equippable (interfaz) e initializeStats() de forma diferente.',
  })
  @ApiBody({
    schema: {
      example: { type: 'BroadSword', level: 3, rarity: 'ANCIENT' },
      properties: {
        type: {
          type: 'string',
          enum: ['BroadSword','ElvenBow','WizardStaff','PlateArmor','LeatherArmor','WizardRobe','RingOfFire','RingOfHpRegen'],
        },
        level:  { type: 'number', example: 3 },
        rarity: { type: 'string', enum: ['NORMAL','MAGIC','ANCIENT','EXCELLENT'], example: 'ANCIENT' },
      },
    },
  })
  create(@Body() body: { type: string; level?: number; rarity?: string }) {
    return this.itemsService.createItem(body.type, body.level, body.rarity);
  }


  // ── GET /items ──────────────────────────────────────────
  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  // ── GET /items/:id ──────────────────────────────────────
  /**
   * @Param('id') extrae el parámetro :id de la URL.
   * Ejemplo: GET /items/Weapon-1234567890 → id = 'Weapon-1234567890'
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  // ── POST /items/:id/equip ────────────────────────────────
  @Post(':id/equip')
  equip(
    @Param('id') id: string,
    @Body() body: { characterName: string },
  ) {
    return this.itemsService.equipItem(id, body.characterName);
  }
}