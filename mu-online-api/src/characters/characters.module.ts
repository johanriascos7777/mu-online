// src/characters/characters.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import { Character } from './entities/character.entity';
import { DarkKnight } from './entities/dark-knight.entity';
import { DarkWizard } from './entities/dark-wizard.entity';
import { Elf } from './entities/elf.entity';

@Module({
  // ── TypeOrmModule.forFeature() ────────────────────────────
  // Registra las entidades en este módulo.
  // Esto crea los repositorios que el Service puede inyectar:
  //   @InjectRepository(DarkKnight) private repo: Repository<DarkKnight>
  //
  // Equivalente Django: cada modelo en models.py se registra
  // automáticamente — en NestJS hay que hacerlo explícitamente.
  imports: [
    TypeOrmModule.forFeature([Character, DarkKnight, DarkWizard, Elf]),
  ],
  controllers: [CharactersController],
  providers:   [CharactersService],
  exports:     [CharactersService],
})
export class CharactersModule {}