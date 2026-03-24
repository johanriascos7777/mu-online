Aquí tienes una versión mejorada, organizada y visualmente atractiva de tu `README.md`. He utilizado iconos, tablas comparativas y bloques de código limpios para que parezca un proyecto profesional de nivel senior.

---

# 🏰 MU Online API — NestJS + TypeScript

> **Backend del proyecto MU Online.** Un reino construido bajo los principios de la Programación Orientada a Objetos (POO), Inyección de Dependencias y Arquitectura Limpia.

---

## 🚀 Inicio Rápido

### 1. Encender el Servidor
```bash
cd server/mu-online-api
npm install
npm run start:dev
```

### 🌱 2. Sembrado de Datos (Seeding)
Para que el mundo de MU cobre vida, necesitas poblar la base de datos en este orden exacto:

```bash
# 1. Crear Monstruos (Budge Dragon, Goblin, etc.)
curl -X POST http://localhost:3000/monsters/seed

# 2. Crear Mapas (Lorencia, Dungeon, Devias)
curl -X POST http://localhost:3000/maps/seed

# 3. Conectar Monstruos a Mapas (Relación Many-to-Many)
curl -X POST http://localhost:3000/maps/seed-monsters
```

### 🔍 3. Verificar en Base de Datos (PSQL)
```sql
-- Verificar que todo se guardó correctamente
psql -U postgres -d mu_online -c "SELECT * FROM monsters;"
psql -U postgres -d mu_online -c "SELECT * FROM maps;"
psql -U postgres -d mu_online -c "SELECT * FROM map_monsters;"
```

---

## 👥 Creación de Personajes (Postman/Insomnia)

Crea tus héroes iniciales enviando un `POST` a `http://localhost:3000/characters`:

| Personaje | Clase | JSON Payload |
| :--- | :--- | :--- |
| **Johan** | Dark Knight | `{ "name": "Johan", "characterClass": "DarkKnight" }` |
| **Merlin** | Dark Wizard | `{ "name": "Merlin", "characterClass": "DarkWizard" }` |
| **Arwen** | Fairy Elf | `{ "name": "Arwen", "characterClass": "Elf" }` |

---

## 📖 Swagger — El Storybook del Backend

Así como usamos **Storybook** para probar componentes visuales, usamos **Swagger** para probar la lógica de negocio.

> **Acceso:** [http://localhost:3000/api](http://localhost:3000/api)

| Característica | Storybook (Frontend) | Swagger (Backend) |
| :--- | :--- | :--- |
| **Dirección** | `localhost:6006` | `localhost:3000/api` |
| **Unidad** | Componentes React | Endpoints HTTP |
| **Entradas** | Props de TypeScript | Body / Query Params |
| **Propósito** | Pruebas visuales de UI | Pruebas de lógica real |

---

## 🧠 Mapa de Conceptos POO en la API

Cada acción en el juego dispara un concepto fundamental de objetos:

| Endpoint | Concepto POO | Implementación en Código |
| :--- | :--- | :--- |
| `POST /characters` | **Herencia + Abstracción** | `new DarkKnight()` llama a `super()` e inicializa stats únicos. |
| `GET /characters` | **Encapsulamiento** | Uso de `toJSON()` para ocultar IDs internos de la DB. |
| `POST /items` | **Interfaces** | `Weapon` extiende `Item` e implementa `Equippable`. |
| `POST /combat/start` | **Composición + DI** | Se crea una `CombatSession` inyectando el Service. |
| `POST /combat/attack` | **Polimorfismo** | `onLevelUp()` se comporta distinto según la clase del héroe. |

---

## 📐 Arquitectura del Sistema

<p align="center">
<img src="assets/attack_poo_chain.svg" width="500" alt="Diagrama de Clases POO">
</p>

### El Ciclo de Vida de un Ataque ⚔️
Cuando presionas el botón **"Attack"** en el frontend, ocurre una cadena de eventos POO:

1.  **Inyección de Dependencias (DI):** NestJS entrega el `CombatService` ya instanciado al Controller.
2.  **Encapsulamiento:** El método `getCombat()` es `private`. Solo el servicio puede gestionar el estado de la sesión.
3.  **Composición:** La clase `CombatSession` no hereda de nadie; *tiene* un `Character` y un `Monster`.
4.  **Polimorfismo:** Al calcular el daño, el sistema llama a `character.calculateAttack()`. No le importa si es un mago o un guerrero, cada objeto sabe cómo calcular su propia fuerza.
5.  **Interfaces:** El monstruo contraataca usando el contrato `Attackable`, garantizando que cualquier enemigo pueda participar en el combate.

---

## 🏗️ La Regla de Oro: Atomic Design + API

En este proyecto mantenemos una separación estricta de responsabilidades:

```typescript
// 🔴 Átomos y Moléculas → DUMB
// No conocen el backend. Solo reciben props y pintan.

// 🟢 Organismos → SMART
// Aquí vive el fetch(), los useEffects y la conexión real a la API.
```

Esto permite que nuestra UI sea testeable en Storybook sin necesidad de tener el servidor de NestJS encendido.

---

> ✨ *Proyecto desarrollado para el aprendizaje de patrones avanzados en TypeScript y NestJS.*
---

## ¿Qué significa DUMB?

Un componente **DUMB** (también llamado "presentacional") solo hace una cosa:
**recibir props y renderizar**. No sabe de dónde vienen los datos,
no llama a ninguna API, no tiene `useEffect`, no maneja errores de red.

```tsx
// ✅ StatBar es DUMB — solo recibe props y pinta la barra
<StatBar label="HP" currentValue={390} maxValue={500} type="hp" />

// ✅ CharacterCard es DUMB — solo recibe props y pinta la card
<CharacterCard
  name="Johan"
  characterClass="DarkKnight"
  hp={{ current: 390, max: 500 }}
  // ...
/>
```

`CharacterCard` no sabe si Johan vino de PostgreSQL, de un JSON local,
o de los datos de una historia de Storybook. Solo sabe que recibió
`name="Johan"` y lo pinta.

---

## ¿Qué significa SMART?

Un componente **SMART** (también llamado "contenedor") sí conoce
el mundo exterior. Llama a la API, maneja los estados de carga
y error, y luego pasa los datos a los componentes DUMB.

```tsx
// ✅ CharacterList es SMART — llama al backend y distribuye los datos
function CharacterList() {

  const [characters, setCharacters] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  // Aquí vive el fetch — en ningún átomo ni molécula
  useEffect(() => {
    fetch('http://localhost:3000/characters')
      .then(res => res.json())
      .then(data => setCharacters(data));
  }, []);

  // Pasa los datos a la molécula DUMB
  return characters.map(character => (
    <CharacterCard
      name={character.name}
      characterClass={character.class}
      // ...
    />
  ));
}
```

---

## ¿Por qué esta separación?

### 1. Storybook funciona sin backend

Como los átomos y moléculas son DUMB, puedes diseñarlos y verlos
en Storybook **sin que el backend esté corriendo**. Solo les pasas
props con datos de ejemplo y ya.

```
Storybook abierto    Backend apagado
      ↓                    ↓
CharacterCard ✅      CharacterList ❌ (no puede hacer fetch)
StatBar       ✅
LevelBadge    ✅
```

Si `CharacterCard` hiciera el fetch internamente, Storybook
mostraría un error en cada historia. Así no — Storybook
solo necesita props.

### 2. Reutilización real

Al ser DUMB, `CharacterCard` puede usarse en múltiples contextos
sin cambiar su código:

```
CharacterList    → datos reales de GET /characters
CombatScreen     → datos del personaje activo en combate
CreateCharacter  → preview antes de confirmar la creación
Storybook        → datos de ejemplo para diseñar
```

Si `CharacterCard` hiciera su propio fetch, estaría atada
a un solo endpoint y no podría reutilizarse así.

### 3. Errores fáciles de localizar

Con esta separación, cuando algo falla sabes exactamente dónde buscar:

```
Problema visual (color, tamaño, layout) → átomo o molécula
Problema de datos (fetch, loading, error) → organismo
```

---

## El mapa completo del proyecto

```
01-atoms/
├── StatBar            DUMB — pinta una barra, nada más
├── LevelBadge         DUMB — pinta el nivel, nada más
├── ClassLabel         DUMB — pinta la clase con su color
├── StatBox            DUMB — pinta un stat (STR/AGI/VIT/ENE)
├── SkillTag           DUMB — pinta el nombre de una habilidad
├── ActionBtn          DUMB — pinta un botón de acción
└── CharacterSilhouette DUMB — pinta el SVG del personaje

02-molecules/
├── CharacterCard      DUMB — combina los átomos en una card
└── StatGroup          DUMB — agrupa las tres barras (HP/MP/EXP)

03-organisms/          ← AQUÍ EMPIEZA LA CONEXIÓN AL BACKEND
├── CharacterList      SMART — GET /characters → renderiza CharacterCards
├── MapSelector        SMART — GET /maps → renderiza MapCards
└── CombatArena        SMART — POST /combat/start + POST /combat/:id/attack
```

---

## Analogía con MU Online

Piénsalo así — en el juego real de MU Online:

```
Átomo     = el píxel en pantalla. Solo sabe su color.
Molécula  = el sprite del personaje. Solo sabe cómo verse.
Organismo = el servidor del juego. Sabe quién eres,
            cuántos HP tienes, en qué mapa estás,
            y le dice al sprite cómo pintarse.
```

El servidor (organismo) tiene toda la lógica e información.
El sprite (molécula/átomo) solo recibe instrucciones y las ejecuta.

---

### Lo que ya dominarás al terminar este proyecto:

**POO completo:**
- ✅ Clases y encapsulamiento (`private` / `protected` / `public`)
- ✅ Herencia (`extends`, `super`, `override`)
- ✅ Clases abstractas (`abstract class`, `abstract methods`)
- ✅ Interfaces (`implements`, contracts)
- ✅ Polimorfismo (mismo método, comportamiento diferente)

**Patrones que Java también usa:**
- ✅ Repository pattern (TypeORM → Spring Data JPA)
- ✅ Dependency Injection (NestJS DI → Spring `@Autowired`)
- ✅ Decoradores/Anotaciones (`@Entity` → `@Entity`, `@Column` → `@Column`)
- ✅ Módulos (NestJS modules → Spring `@Component`, `@Service`)

**La transición TypeScript → Java será natural:**

| TypeScript / NestJS | Java / Spring Boot |
| :--- | :--- |
| `@Entity()` | `@Entity` |
| `@Column()` | `@Column` |
| `@Injectable()` | `@Service` |
| `@InjectRepository()` | `@Autowired` |
| `async/await` | `CompletableFuture` |
| `interface` | `interface` |
| `abstract class` | `abstract class` |

## 1. Instalación

```bash
# Instalar NestJS CLI globalmente
npm install -g @nestjs/cli

# Crear el proyecto
nest new mu-online-api

# Seleccionar: npm
cd mu-online-api
```

---

## 2. Estructura del proyecto

```
src/
├── characters/
│   ├── entities/
│   │   ├── character.entity.ts       ← Clase base abstracta (herencia)
│   │   ├── dark-knight.entity.ts     ← extiende Character
│   │   ├── dark-wizard.entity.ts     ← extiende Character
│   │   └── elf.entity.ts             ← extiende Character
│   ├── interfaces/
│   │   └── attackable.interface.ts   ← Contrato (polimorfismo)
│   ├── characters.controller.ts
│   ├── characters.service.ts         ← @Injectable()
│   └── characters.module.ts
├── monsters/
│   ├── entities/
│   │   ├── monster.entity.ts         ← Clase base abstracta + implements Attackable
│   │   ├── budge-dragon.entity.ts    ← extiende Monster
│   │   └── goblin.entity.ts          ← extiende Monster
│   ├── interfaces/
│   │   └── monster.interface.ts
│   ├── monsters.controller.ts
│   ├── monsters.service.ts           ← @Injectable()
│   └── monsters.module.ts
├── items/
│   ├── entities/
│   │   ├── item.entity.ts            ← Clase base items
│   │   ├── weapon.entity.ts          ← extiende Item
│   │   └── armor.entity.ts           ← extiende Item
│   ├── interfaces/
│   │   └── equippable.interface.ts   ← Contrato para items equipables
│   ├── items.controller.ts
│   ├── items.service.ts              ← @Injectable()
│   └── items.module.ts
├── maps/
│   ├── entities/
│   │   └── map.entity.ts
│   ├── maps.controller.ts
│   ├── maps.service.ts               ← @Injectable()
│   └── maps.module.ts
└── app.module.ts                     ← como INSTALLED_APPS en Django
```

---

## 3. Conceptos POO cubiertos

### Concepto 1 — Clases y Encapsulamiento
```
character.entity.ts
```
- `private` → solo accesible dentro de la clase
- `protected` → accesible en la clase Y en las clases hijas
- `public` → accesible desde cualquier lugar
- Getters para acceso controlado a propiedades privadas

---

### Concepto 2 — Herencia
```
character.entity.ts (padre abstracto)
      ↓ extends
dark-knight.entity.ts
dark-wizard.entity.ts
elf.entity.ts
```
- `extends` → DarkKnight ES UN Character
- `super()` → llama al constructor del padre
- `abstract` → obliga a las clases hijas a implementar el método
- `override` → redefine comportamiento del padre

---

### Concepto 3 — Interfaces y Polimorfismo
```
attackable.interface.ts   ← define el CONTRATO
      ↓ implements
monster.entity.ts         ← clase base que cumple el contrato
      ↓ extends
budge-dragon.entity.ts    ← implementación específica
goblin.entity.ts          ← implementación específica
```
- `interface` → define qué métodos DEBE tener una clase
- `implements` → la clase se compromete a cumplir el contrato
- `abstract` → define comportamiento común, delega lo específico
- **Polimorfismo**: mismo método `attack()`, comportamiento diferente en cada monstruo

```typescript
// El mismo método, comportamiento diferente — eso es polimorfismo
const monsters: Monster[] = [
  new BudgeDragon(),  // débil, zona inicial
  new Goblin(),       // rápido, poco daño
];
monsters.forEach(m => m.attack('Johan'));
```

---

### Concepto 4 — Inyección de Dependencias
```
characters.service.ts     ← @Injectable()
      ↓ inyectado en
characters.controller.ts  ← constructor(private service: CharactersService)
      ↓ registrado en
characters.module.ts      ← providers: [CharactersService]
```
- `@Injectable()` → esta clase puede ser inyectada en otras
- `@Controller()` → define la ruta base
- `@Module()` → agrupa Controller + Service (como una `app` de Django)

---

## 4. Comparación con Django

| NestJS | Django | Descripción |
|--------|--------|-------------|
| `@Module()` | `INSTALLED_APPS` | Registra la app |
| `@Controller()` | `urls.py` + `views.py` | Rutas y handlers |
| `@Injectable()` Service | `views.py` | Lógica de negocio |
| `@Entity()` TypeORM | `models.py` | Modelos de base de datos |
| `interface` | No existe nativo | Contrato de tipos |
| `abstract class` | No existe nativo | Clase base no instanciable |
| Guards | `IsAuthenticated` | Protección de rutas |

---

## 5. Endpoints disponibles

```
POST   /characters              ← Crear personaje
GET    /characters              ← Listar todos
GET    /characters/:name        ← Ver uno
POST   /characters/:name/exp    ← Ganar experiencia

GET    /monsters                ← Listar monstruos por mapa
GET    /maps                    ← Listar mapas disponibles
POST /combat/start
  → Busca personaje (CharactersService)
  → Busca mapa y obtiene monstruo aleatorio (MapsService)
  → Inicia el combate turno por turno

POST /combat/:id/attack
  → El personaje ataca al monstruo
  → El monstruo contraataca
  → Retorna el log del turno

POST /combat/:id/skill
  → El personaje usa una habilidad específica
  → Consume MP, calcula daño
  → El monstruo contraataca
```



