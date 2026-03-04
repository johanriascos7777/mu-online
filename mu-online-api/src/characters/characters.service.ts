// src/characters/characters.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character, CharacterClass } from './entities/character.entity';
import { DarkKnight } from './entities/dark-knight.entity';
import { DarkWizard } from './entities/dark-wizard.entity';
import { Elf } from './entities/elf.entity';
import { Item } from '../items/entities/item.entity';

@Injectable()
export class CharactersService {

    constructor(
        @InjectRepository(Character)
        private readonly characterRepo: Repository<Character>,

        // ── Necesitamos ItemRepo para la relación ─────────
        // Para agregar un item al inventario de un personaje
        // necesitamos buscar el item en DB primero.
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
    ) {}

    async createCharacter(name: string, characterClass: CharacterClass): Promise<object> {
        let character: DarkKnight | DarkWizard | Elf;

        switch (characterClass) {
            case CharacterClass.DARK_KNIGHT: character = new DarkKnight(name); break;
            case CharacterClass.DARK_WIZARD: character = new DarkWizard(name); break;
            case CharacterClass.ELF:         character = new Elf(name);        break;
            default: throw new Error(`Class ${characterClass} not implemented yet`);
        }

        const saved = await this.characterRepo.save(character);
        return { message: 'Character created!', character: saved.toJSON() };
    }

    async findAll(): Promise<object[]> {
        const characters = await this.characterRepo.find();
        return characters.map(c => c.toJSON());
    }

    async findOne(name: string): Promise<object> {
        const character = await this.characterRepo.findOne({ where: { name } as any });
        if (!character) throw new NotFoundException(`Character '${name}' not found`);
        return character.toJSON();
    }

    async findOneInstance(name: string): Promise<DarkKnight | DarkWizard | Elf> {
        const character = await this.characterRepo.findOne({ where: { name } as any }) as DarkKnight | DarkWizard | Elf;
        if (!character) throw new NotFoundException(`Character '${name}' not found`);
        return character;
    }

    async gainExp(name: string, amount: number): Promise<string> {
        const character = await this.findOneInstance(name);
        const result    = character.gainExperience(amount);
        await this.characterRepo.save(character);
        return result;
    }

    // ── addItem — agrega un item al inventario del personaje
    /**
     * Flujo:
     *   1. Busca el personaje en DB (con sus items cargados — eager: true)
     *   2. Busca el item en DB
     *   3. Agrega el item al array character.items
     *   4. repo.save(character) → INSERT INTO character_items
     *
     * TypeORM maneja la tabla intermedia automáticamente.
     * Nosotros solo hacemos: character.items.push(item)
     *
     * Esto es el Concepto 5 de POO — ASOCIACIÓN:
     *   Character TIENE Items en su inventario
     *   No hereda de Item, solo los contiene
     */
    async addItem(characterName: string, itemId: string): Promise<object> {
        const character = await this.characterRepo.findOne({
            where: { name: characterName } as any,
        });
        if (!character) throw new NotFoundException(`Character '${characterName}' not found`);

        const item = await this.itemRepo.findOne({ where: { id: itemId } as any });
        if (!item) throw new NotFoundException(`Item '${itemId}' not found`);

        // Inicializa el array si viene null de DB
        if (!character.items) character.items = [];

        // Verifica que no esté ya en el inventario
        const alreadyHas = character.items.some(i => i.id === itemId);
        if (alreadyHas) {
            return { message: `${characterName} already has this item in inventory` };
        }

        // ← ASOCIACIÓN en acción
        character.items.push(item);

        // repo.save() → INSERT INTO character_items (characterId, itemId)
        await this.characterRepo.save(character);

        return {
            message:   `${item.getName()} added to ${characterName}'s inventory!`,
            inventory: character.items.map(i => i.toJSON()),
        };
    }
}