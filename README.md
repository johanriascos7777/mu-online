# Encender Servidor
cd /server/mu-online-api
npm run start:dev


# Importante
# Monstruos
curl -X POST http://localhost:3000/monsters/seed

# Mapas
curl -X POST http://localhost:3000/maps/seed

# Conecta monstruos a mapas
curl -X POST http://localhost:3000/maps/seed-monsters

**Verifica en psql**
psql -U postgres -d mu_online -c "SELECT * FROM monsters;"
psql -U postgres -d mu_online -c "SELECT * FROM maps;"
psql -U postgres -d mu_online -c "SELECT * FROM map_monsters;"


**Ahora crea los personajes en Postman:**
POST http://localhost:3000/characters
{ "name": "Johan", "characterClass": "DarkKnight" }

POST http://localhost:3000/characters
{ "name": "Merlin", "characterClass": "DarkWizard" }

POST http://localhost:3000/characters
{ "name": "Arwen", "characterClass": "Elf" }


# 🏰 MU Online API — NestJS + TypeScript

> Backend del proyecto MU Online. Aprende POO, inyección de dependencias e interfaces mientras construyes el servidor del juego.

---

# 🧠 ¿Por qué los Átomos y Moléculas no se conectan al Backend?

## La regla de oro del Atomic Design

En este proyecto seguimos una regla simple pero poderosa:

```
Átomos y Moléculas → DUMB  (no saben que existe el backend)
Organismos         → SMART (aquí vive la conexión a la API)
```

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



