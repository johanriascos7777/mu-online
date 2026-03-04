// src/characters/characters.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import { Character } from './entities/character.entity';
import { DarkKnight } from './entities/dark-knight.entity';
import { DarkWizard } from './entities/dark-wizard.entity';
import { Elf } from './entities/elf.entity';
import { Item } from '../items/entities/item.entity';

@Module({
    imports: [
        // ← Item agregado para @InjectRepository(Item) en CharactersService
        TypeOrmModule.forFeature([Character, DarkKnight, DarkWizard, Elf, Item]),
    ],
    controllers: [CharactersController],
    providers:   [CharactersService],
    exports:     [CharactersService],
})
export class CharactersModule {}