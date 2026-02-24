import { Character } from './character.entity';
import { CharacterClass } from './character.entity';

// ============================================================
// 🧝 ELF — Concepto 2: Herencia
// ============================================================
//
// 'extends Character' significa:
//   - Elf ES UN Character (relación "is-a")
//   - Hereda TODO lo que Character tiene: level, health, mana,
//     gainExperience(), takeDamage(), heal(), isAlive(), toJSON()
//   - DEBE implementar los métodos abstract: initializeStats()
//     y onLevelUp() — TypeScript no te deja ignorarlos
//
// Piénsalo así:
//   Character = plantilla general de todos los personajes
//   Elf       = versión específica de esa plantilla
// ============================================================
export class Elf extends Character {

  // ============================================================
  // CONSTRUCTOR
  // ============================================================
  /**
   * 'constructor' es el método que se ejecuta cuando haces:
   *   new Elf('Arwen')
   *
   * Solo recibe 'name' porque el characterClass siempre
   * será ELF — no tiene sentido pedírselo al usuario.
   *
   * 'super()' llama al constructor del PADRE (Character).
   * Es OBLIGATORIO cuando extiendes una clase.
   * Si no llamas super(), TypeScript te da error.
   *
   * Es como decirle al padre: "haz TU parte de la inicialización,
   * yo me encargo del resto específico de la Elf".
   */
  constructor(name: string) {
    super(name, CharacterClass.ELF);
    // Después de super(), Character ya:
    //   ✅ asignó this.name = name
    //   ✅ asignó this.characterClass = 'Elf'
    //   ✅ asignó this.level = 1
    //   ✅ llamó a this.initializeStats() ← nuestra versión de abajo
  }

  // ============================================================
  // initializeStats() — ¿Por qué 'protected'? ¿Por qué 'void'?
  // ============================================================
  /**
   * 'protected' significa:
   *   - Este método es accesible DENTRO de esta clase ✅
   *   - Es accesible en clases hijas que extiendan Elf ✅
   *   - NO es accesible desde afuera: elf.initializeStats() ❌
   *
   * Lo usamos 'protected' porque initializeStats() es un
   * detalle interno — nadie fuera de la jerarquía de clases
   * necesita llamarlo directamente.
   *
   * 'void' significa:
   *   - Este método NO retorna ningún valor
   *   - Solo ejecuta acciones (asigna stats)
   *   - Es como decir "haz esto, pero no me des nada de vuelta"
   *
   * Contraste:
   *   void    → initializeStats()  — solo asigna, no retorna
   *   number  → getAttackPower()   — calcula y retorna un número
   *   string  → toJSON()           — construye y retorna un objeto
   *
   * 'override' significa:
   *   - Estamos REEMPLAZANDO el método abstracto del padre
   *   - TypeScript verifica que el método SÍ existe en Character
   *   - Si escribes mal el nombre (ej: initializeStat sin 's'),
   *     TypeScript te avisa inmediatamente
   *
   * ROL DE LA ELF — Soporte / Arquera:
   *   Alta agilidad → ataques rápidos con arco
   *   Energía media → puede lanzar hechizos de soporte (Heal)
   *   Vida media    → no es tank, pero tampoco es frágil
   *   Poca fuerza   → no usa armas pesadas
   */
  protected override initializeStats(): void {

    // ── Stats base de la Elf (nivel 1) ──────────────────────
    // Comparación con otras clases:
    //   DarkKnight: strength=28 (tank físico)
    //   DarkWizard: energy=30  (mago ofensivo)
    //   Elf:        agility=28  (soporte/arquera)
    this.strength  = 22;   // baja — no es combatiente cuerpo a cuerpo
    this.agility   = 28;   // MUY ALTA — define su velocidad y daño con arco
    this.vitality  = 20;   // media — vida moderada
    this.energy    = 20;   // media — suficiente para Heal y Defense

    // ── HP y MP calculados a partir de los stats base ────────
    // Cada clase usa una fórmula diferente que refleja su rol:
    //
    // DarkKnight: maxHealth = vitality*2 + level*5 + 100 (tank)
    // DarkWizard: maxHealth = vitality*2 + level*3 + 60  (frágil)
    // Elf:        maxHealth = vitality*2 + level*4 + 80  (media)
    this.maxHealth = this.vitality * 2 + this.level * 4 + 80;
    this.health    = this.maxHealth; // empieza con HP completo

    // Elf tiene MP moderado — puede usar Heal pero no es maga pura
    // DarkWizard: maxMana = energy*3 + 100 (altísimo)
    // Elf:        maxMana = energy*2 + 60  (moderado)
    this.maxMana   = this.energy * 2 + 60;
    this.mana      = this.maxMana; // empieza con MP completo
  }

  // ============================================================
  // onLevelUp() — Se ejecuta automáticamente al subir de nivel
  // ============================================================
  /**
   * Character.gainExperience() llama a this.onLevelUp()
   * automáticamente cuando el personaje acumula suficiente EXP.
   *
   * Cada clase define CÓMO crecen sus stats al subir nivel.
   * Esto es polimorfismo — el mismo evento (subir nivel)
   * produce resultados diferentes según la clase.
   *
   * La Elf prioriza agilidad y energía al subir nivel
   * porque su rol es soporte/velocidad, no fuerza bruta.
   */
  protected override onLevelUp(): void {
    // Comparación de crecimiento por nivel:
    //   DarkKnight: strength+7, agility+5, vitality+7 (crece como tank)
    //   DarkWizard: strength+2, agility+3, energy+10  (crece en magia)
    //   Elf:        agility+7,  energy+5,  vitality+4 (crece en velocidad)
    this.agility  += 7;  // su stat principal crece más
    this.energy   += 5;  // también crece en soporte mágico
    this.vitality += 4;  // vida crece moderadamente
    this.strength += 2;  // fuerza casi no crece — no es su rol

    // Recalcula HP y MP máximos con los nuevos stats
    // Usamos la misma fórmula de initializeStats()
    this.maxHealth = this.vitality * 2 + this.level * 4 + 80;
    this.maxMana   = this.energy * 2 + 60;

    // Restaura HP y MP al nuevo máximo al subir nivel
    // (como en el juego real de MU Online)
    this.health = this.maxHealth;
    this.mana   = this.maxMana;
  }

  // ============================================================
  // HABILIDADES EXCLUSIVAS DE LA ELF
  // ============================================================
  /**
   * Estos métodos NO existen en Character ni en DarkKnight/DarkWizard.
   * Son únicos de la Elf — definen su identidad como clase.
   *
   * Patrón: cada habilidad retorna 'string' porque
   * el resultado es un mensaje que describe lo que pasó.
   * Esto es lo que el Controller enviará como respuesta JSON.
   */

  // ── Triple Shot ──────────────────────────────────────────
  /**
   * Habilidad de arco — dispara 3 flechas.
   * Daño basado en AGILITY (no en strength como el Knight).
   * No consume mana — es una habilidad física.
   *
   * 'targetName: string' → el nombre del monstruo que recibe el daño
   * ': string'           → este método retorna un string (mensaje)
   */
  useTripleShot(targetName: string): string {
    // Fórmula de daño de la Elf — basada en agilidad
    // DarkKnight usaba: strength*3 + level*10
    // Elf usa:          agility*2 + level*8 (más flechas, menos por flecha)
    const damagePerArrow = Math.floor(this.agility * 2 + this.level * 8);
    const totalDamage    = damagePerArrow * 3; // 3 flechas

    return `${this.name} uses Triple Shot on ${targetName} for ${totalDamage} total damage (${damagePerArrow} x3 arrows)!`;
  }

  // ── Heal ─────────────────────────────────────────────────
  /**
   * Habilidad de soporte — restaura HP.
   * ÚNICA habilidad de curación entre las clases base.
   * Consume mana — verifica que haya suficiente antes de lanzar.
   *
   * ¿Por qué verificamos mana aquí y no en Character?
   * Porque Character no sabe nada de Heal — es específico de la Elf.
   * Cada clase maneja su propio consumo de mana.
   */
  castHeal(): string {
    const manaCost = 40; // costo fijo de mana para Heal

    // Verificación de mana — patrón igual al DarkWizard
    if (this.mana < manaCost) {
      // No hay suficiente mana — retorna mensaje de error
      // 'return' aquí termina la función completamente
      return `${this.name} doesn't have enough mana to cast Heal! (needs ${manaCost} MP)`;
    }

    // Descuenta el mana
    this.mana -= manaCost;

    // Calcula cuánto HP restaura (basado en energy)
    const healAmount = Math.floor(this.energy * 3 + this.level * 10);

    // Aplica la curación — Math.min evita que HP supere el máximo
    // Ejemplo: si maxHealth=300, health=280, healAmount=50
    //   sin Math.min: health = 280 + 50 = 330 (¡imposible!)
    //   con Math.min: health = Math.min(330, 300) = 300 ✅
    this.health = Math.min(this.health + healAmount, this.maxHealth);

    return `${this.name} casts Heal! Restored ${healAmount} HP. HP: ${this.health}/${this.maxHealth}`;
  }

  // ── Defense Up ───────────────────────────────────────────
  /**
   * Habilidad de soporte — aumenta la defensa temporalmente.
   * En este Sprint 1 retorna el mensaje del efecto.
   * En Sprint 2 (con DB) podremos persistir el buff.
   *
   * 'defenseBonus: number' → cuánta defensa extra agrega
   * Tiene valor DEFAULT (10) — si no pasas el argumento, usa 10.
   * Esto en TS se escribe: defenseBonus: number = 10
   */
  useDefenseUp(defenseBonus: number = 10): string {
    const manaCost = 25;

    if (this.mana < manaCost) {
      return `${this.name} doesn't have enough mana to use Defense Up! (needs ${manaCost} MP)`;
    }

    this.mana -= manaCost;

    // En Sprint 2 esto modificará un stat persistido en DB
    return `${this.name} activates Defense Up! +${defenseBonus} defense for 30 seconds. MP: ${this.mana}/${this.maxMana}`;
  }
}