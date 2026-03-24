// src/monsters/entities/monster.entity.ts
// Tercer concepto: Interfaces y Polimorfismo
// + TypeORM Sprint 2: mapeo a tabla monsters en PostgreSQL

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    TableInheritance,
} from 'typeorm';
import { Attackable } from '../../characters/interfaces/attackable.interface';

// 🛡️ LECCIÓN 1 — TypeORM + contratos (imports)
// QUÉ:      Trae decoradores para mapear clases a tablas y columnas, y el tipo Attackable.
// POR QUÉ:  Sin Entity/Column TypeORM no sabe qué objeto persiste ni qué columnas leer/escribir; Attackable une monstruos al mismo “contrato de combate” que otros atacantes.
// BORRARLO: El archivo deja de compilar o pierdes el mapa objeto↔tabla y el implements Attackable.
// 🎮 MU:    Es como tener el manual del servidor del juego: sin él, el cliente no sabe qué campos tiene un mob.

// ============================================================
// 📖 TYPEORM EN MONSTERS — mismo patrón que Character
// ============================================================
//
// Character usó:
//   @Entity('characters')
//   @TableInheritance(...)  ← una tabla, columna 'type'
//   @ChildEntity('DarkKnight') en cada hijo
//
// Monster usa EXACTAMENTE lo mismo:
//   @Entity('monsters')
//   @TableInheritance(...)  ← una tabla, columna 'type'
//   @ChildEntity('BudgeDragon') en BudgeDragon
//   @ChildEntity('Goblin') en Goblin
//
// En la DB quedará:
//   id | type        | name         | level | health | ...
//   1  | BudgeDragon | Budge Dragon | 3     | 50     | ...
//   2  | Goblin      | Goblin       | 5     | 35     | ...
// ============================================================

// 🛡️ LECCIÓN 1 — enum TypeScript ↔ columna enum en PostgreSQL
// QUÉ:      Define tres “categorías” de mob (Normal, Elite, Boss) como valores fijos en código y en DB.
// POR QUÉ:  Evita strings sueltos (“elite”, “ELITE”) y deja que TypeORM genere un tipo enum consistente en la tabla.
// BORRARLO: Pierdes validación en compile-time y en DB; cualquier texto podría colarse en monsterType.
// 🎮 MU:    Es la diferencia entre un mob de campo, un mini-jefe y un boss de mapa: mismas reglas, distinta etiqueta.

export enum MonsterType {
    NORMAL = 'Normal',
    ELITE  = 'Elite',
    BOSS   = 'Boss',
}

// 🛡️ LECCIÓN 1 — @Entity: tabla física `monsters`
// QUÉ:      Dice que esta clase (y sus hijos con herencia de tabla) viven en la tabla llamada `monsters`.
// POR QUÉ:  TypeORM necesita saber el nombre real de la tabla en PostgreSQL para generar SELECT/INSERT/UPDATE.
// BORRARLO: TypeORM no registra la entidad o apunta a otra tabla; los datos no coinciden con el código.
// 🎮 MU:    Es nombrar la “plantilla” de datos donde el servidor guarda todos los mobs del mundo.

@Entity('monsters')
// 🛡️ LECCIÓN 1 — @TableInheritance: una sola tabla, varias clases (discriminador)
// QUÉ:      Guarda BudgeDragon, Goblin, etc. en la misma fila de `monsters` y usa la columna `type` para saber qué clase hidratar.
// POR QUÉ:  Evitas una tabla por cada mob; consultas y joins simples; el patrón es el mismo que en `characters` del proyecto.
// BORRARLO: Los @ChildEntity dejan de encajar; TypeORM no sabría qué subclase instanciar al leer una fila.
// 🎮 MU:    Todos los mobs comparten el mismo “inventario de stats” en una hoja, y el juego mira una etiqueta para saber qué sprite y AI usar.

@TableInheritance({ column: { type: 'varchar', name: 'type' } })
// 🛡️ LECCIÓN 1 — abstract class + implements Attackable
// QUÉ:      Monster no se instancia sola; obliga a hijos a definir stats; cumple el contrato Attackable (atacar, recibir daño, etc.).
// POR QUÉ:  Compartes comportamiento común y garantizas que cualquier monstruo sirva donde el código pida un Attackable.
// BORRARLO: Podrías instanciar un “mob vacío” sin reglas, o romper combate que espera Attackable.
// 🎮 MU:    Es la plantilla “enemigo”: no existe un mob genérico en pantalla, siempre es un tipo concreto (Goblin, Budge Dragon…).

export abstract class Monster implements Attackable {

    // 🛡️ LECCIÓN 1 — @PrimaryGeneratedColumn: identidad en DB
    // QUÉ:      Crea la columna `id` numérica autoincremental; TypeORM la rellena al guardar.
    // POR QUÉ:  Cada fila necesita una clave única estable para UPDATE, relaciones y APIs REST.
    // BORRARLO: No hay clave primaria clara; colisiones, imposible enlazar bien mapas/combate a un mob concreto.
    // 🎮 MU:    Es el “serial” interno del mob en el servidor, aunque en pantalla solo veas nombre y barra de vida.

    @PrimaryGeneratedColumn()
    id: number;

    // 🛡️ LECCIÓN 1 — @Column() nombre y nivel
    // QUÉ:      Persiste el nombre visible del mob y su nivel de amenaza en columnas simples.
    // POR QUÉ:  Son datos que toda subclase comparte y que la API/UI muestran sin lógica extra.
    // BORRARLO: Desaparecen de la tabla o dejan de cargarse; listados y combate pierden contexto.
    // 🎮 MU:    Es lo que lees sobre la cabeza del mob y el número que te hace decidir si entras o corres.

    @Column()
    name: string;

    @Column()
    level: number;

    // 🛡️ LECCIÓN 1 — monsterType (enum) vs columna discriminadora `type` de herencia
    // QUÉ:      Guarda Normal/Elite/Boss en su propia columna; NO confundir con la columna `type` que usa @TableInheritance ('Goblin', 'BudgeDragon'…).
    // POR QUÉ:  Puedes marcar rareza o rol sin mezclarlo con “qué clase de entidad TypeORM instanciar”.
    // BORRARLO: Pierdes la distinción elite/boss a nivel DB o rompes el mapeo enum si lo cambias mal.
    // 🎮 MU:    El discriminador es “qué criatura es”; monsterType es “qué versión del spawn es” (normal campeón, etc.).

    @Column({ type: 'enum', enum: MonsterType, default: MonsterType.NORMAL })
    monsterType: MonsterType;

    // 🛡️ LECCIÓN 1 — mapa como string
    // QUÉ:      Guarda en qué zona del mundo “vive” lógicamente el mob (ej. Lorencia).
    // POR QUÉ:  En esta lección del proyecto el mapa se modela simple; más adelante lo enlazarás con entidades Map y seeds.
    // BORRARLO: Filtros por mapa y semillas dejan de tener sentido; el mob no tiene “hogar” persistido.
    // 🎮 MU:    Es en qué mapa aparecería el mob si abrieras el juego: Noria, Dungeon, etc.

    @Column()
    map: string;

    // 🛡️ LECCIÓN 1 — columnas de combate y recompensa
    // QUÉ:      HP actual/máximo, rango de ataque, defensa y EXP que suelta al morir; defaults en 0 hasta que initializeStats() del hijo las fija.
    // POR QUÉ:  Centralizas la fórmula de daño y mensajes en la clase base; cada hijo solo define números concretos.
    // BORRARLO: takeDamage/attack dejan de tener datos coherentes; combate y drops rotos.
    // 🎮 MU:    Es el panel oculto del mob: vida, daño, armadura y cuánta EXP te da al matarlo.

    @Column({ default: 0 })
    health: number;

    @Column({ default: 0 })
    maxHealth: number;

    @Column({ default: 0 })
    attackMin: number;

    @Column({ default: 0 })
    attackMax: number;

    @Column({ default: 0 })
    defense: number;

    @Column({ default: 0 })
    experienceReward: number;

    // 🛡️ LECCIÓN 1 — constructor opcional para TypeORM + creación en código
    // QUÉ:      Si pasas name/level/map, inicializa campos y llama initializeStats(); si no, deja el objeto vacío para que TypeORM lo rellene desde DB.
    // POR QUÉ:  TypeORM instancia entidades sin pasar por tu constructor “de juego”; sin parámetros opcionales romperías la hidratación.
    // BORRARLO: Seeds y `new Goblin()` dejan de funcionar o la DB no puede cargar filas en entidades.
    // 🎮 MU:    Es como spawnear un mob desde el servidor (con stats) versus “cargar” un mob que ya existía en la partida guardada.

    // ── Constructor con parámetros opcionales ─────────────
    // Mismo GOTCHA que Character: TypeORM necesita instancias
    // vacías para hidratar desde la DB → parámetros con '?'
    constructor(
        name?: string,
        level?: number,
        map?: string,
        monsterType: MonsterType = MonsterType.NORMAL,
    ) {
        if (name && level && map) {
            this.name        = name;
            this.level       = level;
            this.map         = map;
            this.monsterType = monsterType;
            this.initializeStats();
        }
    }

    // 🛡️ LECCIÓN 1 — método abstracto initializeStats
    // QUÉ:      Obliga a cada hijo (Goblin, BudgeDragon…) a fijar números concretos de vida, daño, defensa y EXP.
    // POR QUÉ:  La base define el “qué puede hacer un mob” pero no los valores; cada especie es distinta sin if gigantes en el padre.
    // BORRARLO: TypeScript no compila o cada hijo podría olvidar inicializar stats → mobs con 0 HP eternamente.
    // 🎮 MU:    Cada mob tiene su tabla de stats del juego; aquí cada clase hija “rellena” esa tabla al nacer.

    protected abstract initializeStats(): void;

    // 🛡️ LECCIÓN 1 — attack + getAttackPower (contrato Attackable + daño aleatorio en rango)
    // QUÉ:      Genera un daño entre attackMin y attackMax y devuelve un mensaje de ataque; cumple parte del contrato Attackable.
    // POR QUÉ:  El combate puede tratar a monstruos de forma uniforme llamando attack() sin conocer la subclase.
    // BORRARLO: Cualquier flujo que espere Attackable.attack() falla; el combate no puede mostrar el golpe del mob.
    // 🎮 MU:    Es el swing del mob: no siempre pega lo mismo, pero siempre dentro del rango que el diseño le puso.

    // ── Implementación del contrato Attackable ─────────────
    attack(targetName: string): string {
        const damage = this.getAttackPower();
        return `👹 ${this.name} attacks ${targetName} for ${damage} damage!`;
    }

    getAttackPower(): number {
        return Math.floor(
            Math.random() * (this.attackMax - this.attackMin + 1) + this.attackMin
        );
    }

    // 🛡️ LECCIÓN 1 — takeDamage: reglas de mitigación, muerte y EXP
    // QUÉ:      Aplica defensa (mínimo 1 de daño), baja health, y si llega a 0 devuelve mensaje de kill + expReward.
    // POR QUÉ:  Encapsula toda la consecuencia de golpear al mob en un solo lugar; el servicio de combate no duplica fórmulas.
    // BORRARLO: Estado de HP incoherente o lógica duplicada/inconsistente en controllers; exploits o mobs inmortales.
    // 🎮 MU:    Ver la barra roja bajar, el número flotante y el mensaje de muerte + EXP es exactamente este método en acción.

    takeDamage(damage: number): { message: string; isDead: boolean; expReward?: number } {
        const actualDamage = Math.max(1, damage - this.defense);
        this.health        = Math.max(0, this.health - actualDamage);

        if (this.health === 0) {
            return {
                message:   `💀 ${this.name} has been killed! +${this.experienceReward} EXP`,
                isDead:    true,
                expReward: this.experienceReward,
            };
        }

        return {
            message: `${this.name} took ${actualDamage} damage. HP: ${this.health}/${this.maxHealth}`,
            isDead:  false,
        };
    }

    // 🛡️ LECCIÓN 1 — getters e isAlive (encapsulamiento de lectura)
    // QUÉ:      Exponen lectura controlada de nombre, nivel, HP, EXP y si sigue vivo sin obligar a que el resto del código toque propiedades a la brava.
    // POR QUÉ:  Si mañana cambias cómo se calcula “vivo” o qué campo es canónico, el cambio queda acotado a la entidad.
    // BORRARLO: Código externo acoplado a campos internos; refactors dolorosos y violaciones de invariantes.
    // 🎮 MU:    Es el servidor respondiendo “cuánto le queda” sin que el cliente meta mano en variables internas del mob.

    // ── Getters ───────────────────────────────────────────
    getName(): string             { return this.name; }
    getLevel(): number            { return this.level; }
    getHealth(): number           { return this.health; }
    getMaxHealth(): number        { return this.maxHealth; }
    getExperienceReward(): number { return this.experienceReward; }
    isAlive(): boolean            { return this.health > 0; }

    // 🛡️ LECCIÓN 1 — toJSON: forma “segura” para API/cliente
    // QUÉ:      Devuelve un objeto plano con nombres amigables (hp como string "actual/máx", attack como rango) para JSON responses.
    // POR QUÉ:  Ocultas detalles internos o los presentas en formato listo para UI sin que el front conozca cada columna cruda.
    // BORRARLO: Los controladores devuelven la entidad cruda o formatos inconsistentes; el front recibe datos feos o demasiado internos.
    // 🎮 MU:    Es el paquete de datos que el cliente necesita para pintar la tarjeta del mob sin saber cómo está guardado en la DB.

    toJSON() {
        return {
            id:        this.id,
            name:      this.name,
            level:     this.level,
            type:      this.monsterType,
            map:       this.map,
            hp:        `${this.health}/${this.maxHealth}`,
            attack:    `${this.attackMin}-${this.attackMax}`,
            defense:   this.defense,
            expReward: this.experienceReward,
        };
    }
}