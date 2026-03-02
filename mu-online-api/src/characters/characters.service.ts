// src/characters/characters.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character, CharacterClass } from './entities/character.entity';
import { DarkKnight } from './entities/dark-knight.entity';
import { DarkWizard } from './entities/dark-wizard.entity';
import { Elf } from './entities/elf.entity';

// ============================================================
// 📖 ¿QUÉ CAMBIA DEL SPRINT 1 AL SPRINT 2?
// ============================================================
//
// SPRINT 1 — Map en RAM:
//   private characters: Map<string, Character> = new Map();
//   this.characters.set(name, character)   ← guardar
//   this.characters.get(name)              ← buscar
//   Array.from(this.characters.values())   ← listar
//
// SPRINT 2 — PostgreSQL con TypeORM:
//   @InjectRepository(Character) private repo: Repository<Character>
//   await this.repo.save(character)        ← INSERT/UPDATE en DB
//   await this.repo.findOne({where:{name}})← SELECT en DB
//   await this.repo.find()                 ← SELECT * en DB
//
// La lógica de negocio (gainExperience, takeDamage) NO cambia.
// Solo cambia CÓMO se persisten los datos.
// ============================================================

@Injectable()
export class CharactersService {

    // ── @InjectRepository — Inyección del repositorio ────────
    // TypeORM crea este repositorio automáticamente.
    // Repository<Character> tiene todos los métodos de DB:
    //   save(), find(), findOne(), delete(), update(), etc.
    //
    // 'Character' como tipo base acepta DarkKnight, DarkWizard y Elf
    // porque todos extienden Character (herencia + polimorfismo)
    constructor(
        @InjectRepository(Character)
        private readonly characterRepo: Repository<Character>,
    ) {}

    // ── createCharacter ───────────────────────────────────────
    /**
     * Crea la instancia POO correcta según la clase
     * y la persiste en PostgreSQL con repo.save()
     *
     * 'async/await' — los métodos de DB son asíncronos.
     * TypeORM hace una query SQL real que toma tiempo.
     * 'Promise<object>' → retorna una promesa que resuelve a object
     */
    async createCharacter(name: string, characterClass: CharacterClass): Promise<object> {

        // ── Polimorfismo: crea la clase correcta ─────────────
        let character: DarkKnight | DarkWizard | Elf;

        switch (characterClass) {
            case CharacterClass.DARK_KNIGHT:
                character = new DarkKnight(name);
                break;
            case CharacterClass.DARK_WIZARD:
                character = new DarkWizard(name);
                break;
            case CharacterClass.ELF:
                character = new Elf(name);
                break;
            default:
                throw new Error(`Class ${characterClass} not implemented yet`);
        }

        // ── repo.save() → INSERT INTO characters ─────────────
        // TypeORM genera el SQL automáticamente:
        //   INSERT INTO characters (name, type, level, strength, ...)
        //   VALUES ('Johan', 'DarkKnight', 1, 28, ...)
        const saved = await this.characterRepo.save(character);

        return { message: 'Character created!', character: saved.toJSON() };
    }

    // ── findAll ───────────────────────────────────────────────
    // SELECT * FROM characters
    async findAll(): Promise<object[]> {
        const characters = await this.characterRepo.find();
        return characters.map(c => c.toJSON());
    }

    // ── findOne — retorna JSON para el Controller ─────────────
    // SELECT * FROM characters WHERE name = $1 LIMIT 1
    async findOne(name: string): Promise<object> {
        const character = await this.characterRepo.findOne({ where: { name } as any });
        if (!character) throw new NotFoundException(`Character '${name}' not found`);
        return character.toJSON();
    }

    // ── findOneInstance — retorna la instancia POO para CombatService
    // ─────────────────────────────────────────────────────────
    /**
     * ¿Por qué dos métodos findOne?
     *
     * findOne()         → retorna JSON (para respuestas HTTP)
     * findOneInstance() → retorna la instancia POO con sus métodos
     *                     (para CombatService que necesita .takeDamage(), etc.)
     *
     * TypeORM retorna objetos que son instancias de las clases
     * gracias a @ChildEntity() — así que podemos llamar sus métodos.
     */
    async findOneInstance(name: string): Promise<DarkKnight | DarkWizard | Elf> {
        const character = await this.characterRepo.findOne({ 
    where: { name } as any 
}) as DarkKnight | DarkWizard | Elf;
        if (!character) throw new NotFoundException(`Character '${name}' not found`);
        return character;
    }

    // ── gainExp ───────────────────────────────────────────────
    async gainExp(name: string, amount: number): Promise<string> {
        const character = await this.findOneInstance(name);

        // gainExperience() es lógica POO — no cambia
        const result = character.gainExperience(amount);

        // repo.save() actualiza el personaje en DB con los nuevos valores
        // UPDATE characters SET level=$1, experience=$2 WHERE name=$3
        await this.characterRepo.save(character);

        return result;
    }
}