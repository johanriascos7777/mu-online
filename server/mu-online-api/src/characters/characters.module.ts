//Cuarto concepto: Inyección de Dependencias con NestJS
// src/characters/characters.module.ts

import { Module } from '@nestjs/common';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';

// El Módulo es como la 'app' de Django — agrupa Controller + Service
@Module({
    controllers: [CharactersController],
    providers: [CharactersService],   // providers = servicios inyectables
    exports: [CharactersService],     // exports = disponible para otros módulos
})
export class CharactersModule {}