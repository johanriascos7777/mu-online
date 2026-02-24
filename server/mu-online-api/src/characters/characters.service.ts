//Cuarto concepto: Inyección de Dependencias con NestJS
// src/characters/characters.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { DarkKnight } from './entities/dark-knight.entity';
import { DarkWizard } from './entities/dark-wizard.entity';
import { Elf } from './entities/elf.entity'; // ← agregar import

import { CharacterClass } from './entities/character.entity';

// @Injectable() le dice a NestJS: "esta clase puede ser inyectada en otras"
@Injectable()
export class CharactersService {

    // Simulamos una DB en memoria por ahora
    private characters: Map<string, DarkKnight | DarkWizard | Elf>  = new Map();

    createCharacter(name: string, characterClass: CharacterClass): object {
        let character: DarkKnight | DarkWizard | Elf;

        // POLIMORFISMO EN ACCIÓN: dependiendo del tipo, creamos diferente clase
        // pero todas tienen el mismo método toJSON()
        switch (characterClass) {
            case CharacterClass.DARK_KNIGHT:
                character = new DarkKnight(name);
                break;
            case CharacterClass.DARK_WIZARD:
                character = new DarkWizard(name);
                break;
            case 'Elf':                        // ← agregar este case
                character = new Elf(name);
                break;
            default:
                throw new Error(`Class ${characterClass} not implemented yet`);
        }

        this.characters.set(name, character);
        return { message: `Character created!`, character: character.toJSON() };
    }

    findAll(): object[] {
        return Array.from(this.characters.values()).map(c => c.toJSON());
    }

        // ✅ Nuevo método que devuelve la instancia real del personaje
    findOneInstance(name: string): DarkKnight | DarkWizard | Elf {
        const character = this.characters.get(name);
        if (!character) throw new NotFoundException(`Character ${name} not found`);
        return character;
    }

    findOne(name: string): DarkKnight | DarkWizard | Elf {
        const character = this.characters.get(name);
        if (!character) throw new NotFoundException(`Character ${name} not found`);
        return character;
    }

    gainExp(name: string, amount: number): string {
        const character = this.findOne(name);
        return character.gainExperience(amount);
    }
}