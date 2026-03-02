/*
Primer concepto POO: Clases y Encapsulamiento
+ TypeORM Sprint 2: mapeo de clase POO a tabla en PostgreSQL
*/

// src/characters/entities/character.entity.ts

// ─── NUEVOS IMPORTS DE TYPEORM ────────────────────────────────────────────────
// Estos decoradores le dicen a TypeORM cómo mapear esta clase a PostgreSQL.
// Sin ellos, TypeORM ignora la clase completamente.
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    TableInheritance,
} from 'typeorm';

// ============================================================
// 📖 ¿QUÉ HACEN LOS DECORADORES DE TYPEORM?
// ============================================================
//
// @Entity('characters')
//   → "esta clase ES una tabla en la DB llamada 'characters'"
//
// @TableInheritance({ column: { type: 'varchar', name: 'type' } })
//   → Single Table Inheritance: una sola tabla para DarkKnight,
//     DarkWizard y Elf. La columna 'type' discrimina cuál es cuál.
//     Sin este decorador → TypeORM no sabe cómo manejar @ChildEntity()
//
// @PrimaryGeneratedColumn()
//   → ID autoincremental (1, 2, 3...)
//   → Equivalente Django: id = models.AutoField(primary_key=True)
//
// @Column()
//   → Cada propiedad decorada = columna en la tabla
//   → string → VARCHAR, number → INTEGER
//
// @CreateDateColumn() / @UpdateDateColumn()
//   → TypeORM las gestiona automáticamente
//   → Equivalente Django: auto_now_add=True / auto_now=True
// ============================================================

export enum CharacterClass {
    DARK_KNIGHT     = 'DarkKnight',
    DARK_WIZARD     = 'DarkWizard',
    ELF             = 'Elf',
    MAGIC_GLADIATOR = 'MagicGladiator',
    DARK_LORD       = 'DarkLord',
}

@Entity('characters')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Character {

    // ─── ENCAPSULAMIENTO ──────────────────────────────────────────────────
    // 'private'   → solo accesible dentro de esta clase
    // 'protected' → accesible en esta clase Y en las clases hijas
    // 'public'    → accesible desde cualquier lugar
    //
    // Regla práctica:
    //   Usa 'private' cuando NADIE más deba tocar la propiedad directamente
    //   Usa 'protected' cuando las clases hijas necesiten leerla o modificarla
    //   Usa getters públicos para dar acceso controlado desde afuera
    @PrimaryGeneratedColumn()
    id: number;

    // { unique: true } → no puede haber dos personajes con el mismo nombre
    @Column({ unique: true })
    name: string;

    // { type: 'enum' } → TypeORM crea un tipo ENUM en PostgreSQL
    @Column({ type: 'enum', enum: CharacterClass })
    characterClass: CharacterClass;

    @Column({ default: 1 })
    level: number;

    @Column({ default: 0 })
    experience: number;

    @Column({ default: 0 })
    health: number;

    @Column({ default: 0 })
    maxHealth: number;

    @Column({ default: 0 })
    mana: number;

    @Column({ default: 0 })
    maxMana: number;

    @Column({ default: 0 })
    strength: number;

    @Column({ default: 0 })
    agility: number;

    @Column({ default: 0 })
    vitality: number;

    @Column({ default: 0 })
    energy: number;

    // TypeORM gestiona estos timestamps automáticamente
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // ─── CONSTRUCTOR ──────────────────────────────────────────────────────
    // Se ejecuta al crear una instancia: new DarkKnight('Johan')
    // El constructor de Character inicializa lo COMÚN a todos los personajes.
    // Lo específico (stats) lo delega a initializeStats() — método abstracto.
    //
    // 🐛 GOTCHA TYPEORM: parámetros opcionales con '?'
    // TypeORM necesita crear instancias VACÍAS internamente para hidratar
    // objetos desde la DB. Si el constructor exige parámetros obligatorios,
    // TypeORM no puede crear esa instancia vacía y lanza error.
    // Solución: name? y characterClass? con '?' + if guard.
    constructor(name?: string, characterClass?: CharacterClass) {
        if (name && characterClass) {
            this.name           = name;
            this.characterClass = characterClass;
            this.level          = 1;
            this.experience     = 0;
            this.initializeStats(); // cada clase hija lo implementa diferente
        }
    }

    // ─── MÉTODOS ABSTRACTOS ───────────────────────────────────────────────
    // 'abstract' obliga a las clases hijas a implementar estos métodos.
    // TypeScript no te deja crear una clase hija sin implementarlos.
    // Si olvidas uno → error rojo inmediato.
    //
    // Aquí viene el POLIMORFISMO:
    //   DarkKnight.initializeStats() → strength alto, mana bajo
    //   DarkWizard.initializeStats() → energy alto, mana alto
    //   Elf.initializeStats()        → agility alta, vida media
    protected abstract initializeStats(): void;

    // Cada clase hija decide qué stats aumentan al subir de nivel
    protected abstract onLevelUp(): void;

    // ─── GETTERS: acceso controlado a propiedades ─────────────────────────
    getId(): number              { return this.id; }
    getName(): string            { return this.name; }
    getLevel(): number           { return this.level; }
    getHealth(): number          { return this.health; }
    getMana(): number            { return this.mana; }
    getCharacterClass(): CharacterClass { return this.characterClass; }

    // ── Getters adicionales para CombatSession ────────────────────────────
    getMaxHealth(): number { return this.maxHealth; }
    getMaxMana(): number   { return this.maxMana; }
    getStrength(): number  { return this.strength; }
    getAgility(): number   { return this.agility; }
    getVitality(): number  { return this.vitality; }
    getEnergy(): number    { return this.energy; }

    // ─── MÉTODOS COMUNES A TODOS LOS PERSONAJES ───────────────────────────
    gainExperience(amount: number): string {
        this.experience += amount;
        const expToNextLevel = this.calculateExpToNextLevel();
        if (this.experience >= expToNextLevel) {
            return this.levelUp();
        }
        return `${this.name} gained ${amount} EXP. (${this.experience}/${expToNextLevel})`;
    }

    private calculateExpToNextLevel(): number {
        return Math.floor(Math.pow(this.level, 2) * 1000);
    }

    private levelUp(): string {
        this.level++;
        this.experience = 0;
        this.onLevelUp();
        return `🎉 ${this.name} reached Level ${this.level}!`;
    }

    takeDamage(damage: number): string {
        this.health = Math.max(0, this.health - damage);
        if (this.health === 0) {
            return `💀 ${this.name} has been defeated!`;
        }
        return `${this.name} took ${damage} damage. HP: ${this.health}/${this.maxHealth}`;
    }

    heal(amount: number): string {
        const previousHealth = this.health;
        this.health = Math.min(this.maxHealth, this.health + amount);
        const healed = this.health - previousHealth;
        return `💚 ${this.name} recovered ${healed} HP. HP: ${this.health}/${this.maxHealth}`;
    }

    isAlive(): boolean {
        return this.health > 0;
    }

    toJSON() {
        return {
            id:         this.id,
            name:       this.name,
            class:      this.characterClass,
            level:      this.level,
            experience: this.experience,
            stats: {
                hp:       `${this.health}/${this.maxHealth}`,
                mp:       `${this.mana}/${this.maxMana}`,
                strength: this.strength,
                agility:  this.agility,
                vitality: this.vitality,
                energy:   this.energy,
            },
            createdAt: this.createdAt,
        };
    }
}