/*
Primer concepto POO: Clases y Encapsulamiento
Empezamos con la clase base Character:
*/

// src/characters/entities/character.entity.ts

export enum CharacterClass {
    DARK_KNIGHT     = 'DarkKnight',
    DARK_WIZARD     = 'DarkWizard',
    ELF             = 'Elf',
    MAGIC_GLADIATOR = 'MagicGladiator',
    DARK_LORD       = 'DarkLord',
}

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
    private id: number;
    protected name: string;
    protected level: number;
    protected experience: number;
    protected health: number;
    protected maxHealth: number;
    protected mana: number;
    protected maxMana: number;
    protected strength: number;
    protected agility: number;
    protected vitality: number;
    protected energy: number;
    protected characterClass: CharacterClass;

    // ─── CONSTRUCTOR ──────────────────────────────────────────────────────
    // Se ejecuta al crear una instancia: new DarkKnight('Johan')
    // El constructor de Character inicializa lo COMÚN a todos los personajes.
    // Lo específico (stats) lo delega a initializeStats() — método abstracto.
    constructor(name: string, characterClass: CharacterClass) {
        this.name            = name;
        this.characterClass  = characterClass;
        this.level           = 1;
        this.experience      = 0;
        this.initializeStats(); // cada clase hija lo implementa diferente
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
    // ¿Por qué getters y no propiedades public?
    //   Con getters podemos agregar lógica antes de retornar.
    //   Con public la propiedad queda expuesta y cualquiera puede modificarla.
    //   Principio de encapsulamiento: controla el acceso, no lo expongas todo.
    getId(): number              { return this.id; }
    getName(): string            { return this.name; }
    getLevel(): number           { return this.level; }
    getHealth(): number          { return this.health; }
    getMana(): number            { return this.mana; }
    getCharacterClass(): CharacterClass { return this.characterClass; }

    // ── Getters adicionales para CombatSession ────────────────────────────
    // CombatSession NO es hija de Character — no puede acceder a 'protected'.
    // Necesita estos getters públicos para leer los stats durante el combate.
    // Sin ellos → error "Property 'getMaxHealth' does not exist on type Character"
    getMaxHealth(): number { return this.maxHealth; }
    getMaxMana(): number   { return this.maxMana; }
    getStrength(): number  { return this.strength; }
    getAgility(): number   { return this.agility; }
    getVitality(): number  { return this.vitality; }
    getEnergy(): number    { return this.energy; }

    // ─── MÉTODOS COMUNES A TODOS LOS PERSONAJES ───────────────────────────
    // Estos métodos son iguales para DarkKnight, DarkWizard y Elf.
    // Por eso viven en Character — evitamos repetir código en cada clase hija.
    // Principio DRY: Don't Repeat Yourself.

    gainExperience(amount: number): string {
        this.experience += amount;
        const expToNextLevel = this.calculateExpToNextLevel();

        if (this.experience >= expToNextLevel) {
            return this.levelUp();
        }

        return `${this.name} gained ${amount} EXP. (${this.experience}/${expToNextLevel})`;
    }

    // 'private' porque es un detalle interno del cálculo de nivel.
    // Nadie fuera de Character necesita llamar este método directamente.
    private calculateExpToNextLevel(): number {
        // Fórmula clásica de MU Online
        return Math.floor(Math.pow(this.level, 2) * 1000);
    }

    private levelUp(): string {
        this.level++;
        this.experience = 0;
        // Hook para que cada clase hija añada sus propios stats al subir nivel
        // DarkKnight sube strength+7, DarkWizard sube energy+10, etc.
        this.onLevelUp();
        return `🎉 ${this.name} reached Level ${this.level}!`;
    }

    // takeDamage retorna string — el mensaje se usa en el log del combate
    takeDamage(damage: number): string {
        this.health = Math.max(0, this.health - damage);

        if (this.health === 0) {
            return `💀 ${this.name} has been defeated!`;
        }

        return `${this.name} took ${damage} damage. HP: ${this.health}/${this.maxHealth}`;
    }

    heal(amount: number): string {
        const previousHealth = this.health;
        // Math.min evita que HP supere el máximo
        this.health = Math.min(this.maxHealth, this.health + amount);
        const healed = this.health - previousHealth;
        return `💚 ${this.name} recovered ${healed} HP. HP: ${this.health}/${this.maxHealth}`;
    }

    // Usado por CombatSession para verificar si el personaje sigue vivo
    isAlive(): boolean {
        return this.health > 0;
    }

    // ─── toJSON — serialización para respuestas HTTP ──────────────────────
    // Convierte el objeto POO a un objeto plano para retornar como JSON.
    // En Sprint 2 con TypeORM esto se manejará automáticamente.
    toJSON() {
        return {
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
        };
    }
}