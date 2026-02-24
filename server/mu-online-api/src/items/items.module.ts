// ============================================================
// 📖 BITÁCORA: El Módulo en NestJS
// ============================================================
//
// El Módulo es el CONTENEDOR que agrupa todo lo relacionado
// con "items": su Controller y su Service.
//
// Sin el Módulo, NestJS no sabe que ItemsController e
// ItemsService existen — son invisibles para el framework.
//
// Flujo de registro:
//   items.module.ts → app.module.ts → NestJS los activa
//
// Comparación con Django:
//   @Module() en NestJS = entrada en INSTALLED_APPS en Django
//   La diferencia es que en NestJS cada módulo declara
//   explícitamente qué comparte con el exterior (exports).
//
// ┌─────────────────────────────────────────────────────────┐
// │  @Module({                                              │
// │    controllers: [ItemsController],  ← maneja HTTP       │
// │    providers:   [ItemsService],     ← lógica negocio    │
// │    exports:     [ItemsService],     ← compartir afuera  │
// │  })                                                     │
// │                                                         │
// │  'exports' permite que CharactersModule use             │
// │  ItemsService si lo necesita (equipar items a chars)    │
// └─────────────────────────────────────────────────────────┘
// ============================================================

import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  controllers: [ItemsController], // registra las rutas /items
  providers:   [ItemsService],    // registra el servicio para DI
  exports:     [ItemsService],    // disponible para otros módulos
})
export class ItemsModule {}