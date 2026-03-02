# Encender Servidor
cd /server/mu-online-api
npm run start:dev

# 🏰 MU Online API — NestJS + TypeScript

> Backend del proyecto MU Online. Aprende POO, inyección de dependencias e interfaces mientras construyes el servidor del juego.

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



