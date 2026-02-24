/**
 * ============================================================
 * 📖 BITÁCORA STORYBOOK — MUNDO TYPESCRIPT (.tsx)
 * Componente: ActionBtn
 * Archivo: ActionBtn.stories.tsx
 * ============================================================
 *
 * 🎯 PROPÓSITO DE ESTE ARCHIVO:
 * Verás cómo TypeScript ELIMINA trabajo manual y AGREGA seguridad.
 * Compara cada sección con ActionBtn.stories.jsx para sentir
 * la diferencia en carne propia.
 * ============================================================
 */

/**
 * 📦 IMPORTACIONES
 * ---------------------------------------------------------------
 * En JS importábamos solo React y el componente.
 * En TS importamos ADEMÁS los tipos de Storybook:
 *
 * - Meta<T>:     El tipo del objeto de configuración (el 'default export').
 *                El <T> le dice: "esta meta es ESPECÍFICA para ActionBtn".
 *
 * - StoryObj<T>: El tipo de cada historia individual.
 *                Garantiza que los 'args' coincidan con las props reales.
 *
 * ¿Por qué 'import type'? Es una optimización — le dice a TypeScript
 * que estos imports son SOLO para el sistema de tipos, no para
 * el código que se ejecuta. Hace el bundle más liviano.
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { ActionBtn } from './index';

// ============================================================
// 📦 SECCIÓN 1: META — La configuración que se "escribe sola"
// ============================================================

/**
 * 🪄 LA MAGIA DE TYPESCRIPT EMPIEZA AQUÍ:
 * ---------------------------------------------------------------
 * 'satisfies Meta<typeof ActionBtn>'
 *
 * Esto le dice a TypeScript:
 * "Viaja al archivo index.tsx, lee la interfaz ActionBtnProps,
 *  y asegúrate de que esta configuración sea compatible con ella."
 *
 * Resultado:
 *  ✅ Autocompletado inteligente al escribir 'argTypes'
 *  ✅ Error inmediato si escribimos mal una prop
 *  ✅ La pestaña "Docs" se genera SOLA y COMPLETA
 *  ✅ NO necesitamos escribir argTypes (aunque podemos si queremos personalizar)
 *
 * vs. en JavaScript:
 *  ❌ Teníamos que escribir argTypes manualmente (20+ líneas)
 *  ❌ Podíamos equivocarnos y nadie nos avisaba
 *  ❌ Si el componente cambiaba, teníamos que actualizar argTypes a mano
 */
const meta = {
  title: '01-Atoms/ActionBtn--Example',
  component: ActionBtn,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          backgroundColor: '#050508',
          padding: 24,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 12,
        }}
      >
        <Story />
      </View>
    ),
  ],
  /**
   * 👆 ¿Notaste algo?
   * NO hay 'argTypes' aquí.
   * TypeScript lee ActionBtnProps del componente y genera
   * la documentación automáticamente.
   *
   * Si en el futuro agregas una prop 'disabled?: boolean' a ActionBtnProps,
   * aparecerá sola en la pestaña Docs. Cero trabajo extra.
   */
} satisfies Meta<typeof ActionBtn>;

export default meta;

// ============================================================
// 🔒 SECCIÓN 2: El tipo Story — el "guardaespaldas" de las props
// ============================================================

/**
 * 'type Story = StoryObj<typeof meta>'
 * ---------------------------------------------------------------
 * Esto crea un tipo personalizado para TODAS las historias de este archivo.
 * 
 * ¿Qué hace exactamente?
 * Le dice a TypeScript: "Cada historia debe tener args que coincidan
 * EXACTAMENTE con las props de ActionBtn".
 *
 * Prueba práctica (hazlo tú mismo):
 * 1. Ve a la historia 'AttackAction' abajo
 * 2. Cambia 'icon' por 'icono'
 * 3. VSCode se pondrá ROJO inmediatamente diciendo:
 *    "Object literal may only specify known properties,
 *     and 'icono' does not exist in type..."
 *
 * En JavaScript, ese error solo lo descubrías mirando el navegador.
 * En TypeScript, lo descubres SIN salir del editor.
 */
type Story = StoryObj<typeof meta>;

// ============================================================
// 📖 SECCIÓN 3: Las Historias con seguridad de tipos
// ============================================================

// ── HISTORIA 1: Attack ──────────────────────────────────────
/**
 * ✅ SEGURIDAD TS:
 * Si escribo variant: 'magic' → Error rojo inmediato.
 * Las únicas opciones válidas son: 'default' | 'attack' | 'heal'
 * TypeScript lo sabe porque lo leyó de ActionBtnProps.
 *
 * 💡 TIP: Coloca el cursor dentro de las comillas de variant
 * y presiona Ctrl+Espacio para ver el autocompletado.
 */
export const AttackAction: Story = {
  args: {
    icon: '⚔️',
    label: 'Attack',
    cost: 'Basic',
    variant: 'attack',
  },
};

// ── HISTORIA 2: Twisting Slash ──────────────────────────────
/**
 * ✅ COMPARACIÓN DIRECTA con el .jsx:
 *
 * En JS escribías:
 *   export const MagicSkill = { args: { ... } }
 *   → Sin tipo. Cualquier prop era válida. Peligroso.
 *
 * En TS escribes:
 *   export const MagicSkill: Story = { args: { ... } }
 *   → Con tipo. Solo props válidas. Seguro.
 *
 * El ': Story' es la única diferencia de escritura,
 * pero la diferencia de SEGURIDAD es enorme.
 */
export const MagicSkill: Story = {
  args: {
    icon: '🌪️',
    label: 'Twisting Slash',
    cost: '30 MP',
    variant: 'default',
  },
};

// ── HISTORIA 3: Impale ──────────────────────────────────────
export const ImpaleSkill: Story = {
  args: {
    icon: '🗡️',
    label: 'Impale',
    cost: '50 MP',
    variant: 'default',
  },
};

// ── HISTORIA 4: Use Potion ──────────────────────────────────
export const HealAction: Story = {
  args: {
    icon: '🧪',
    label: 'Use Potion',
    cost: 'Heal HP',
    variant: 'heal',
  },
};

// ── HISTORIA 5: Sin variante (default implícito) ────────────
/**
 * ✅ PROP OPCIONAL EN TS:
 * 'variant' está marcada como opcional (variant?: ...) en ActionBtnProps.
 * TypeScript sabe que NO es obligatoria, así que no nos exige incluirla.
 * Si la dejamos fuera → usa el valor default del componente.
 *
 * En JS también funciona, pero si la prop FUERA obligatoria,
 * JS no te avisaría que la estás olvidando. TS sí.
 */
export const DefaultVariant: Story = {
  args: {
    icon: '✨',
    label: 'Skill',
    cost: '10 MP',
    // variant no incluida → usa 'default' automáticamente
  },
};

// ============================================================
// 🔑 SECCIÓN 4: ESCENARIOS AVANZADOS (Para tu bitácora)
// ============================================================

/**
 * ESCENARIO A: Componente con Props OBLIGATORIAS vs OPCIONALES
 * ---------------------------------------------------------------
 * En ActionBtnProps tenemos:
 *   icon: string      → OBLIGATORIA (sin '?') → TS exige incluirla
 *   label: string     → OBLIGATORIA
 *   cost: string      → OBLIGATORIA
 *   variant?: string  → OPCIONAL (con '?') → puedes omitirla
 *   onPress?: ()=>void → OPCIONAL
 *
 * Si intentas crear una historia SIN 'icon':
 *   export const SinIcono: Story = { args: { label: 'Test' } }
 *   → TypeScript: ERROR ROJO → "Property 'icon' is missing"
 *
 * En JavaScript eso pasaría silenciosamente y el botón
 * se renderizaría con undefined como ícono.
 */

/**
 * ESCENARIO B: Componente SMART con Redux en Storybook (TS)
 * ---------------------------------------------------------------
 * Si ActionBtn fuera un componente SMART que usa useSelector/useDispatch,
 * necesitarías un Provider. En TS se hace así:
 *
 * import { Provider } from 'react-redux';
 * import { store } from '../../../redux/store';
 *
 * const meta = {
 *   ...
 *   decorators: [
 *     (Story) => (
 *       <Provider store={store}>
 *         <View style={{ ... }}>
 *           <Story />
 *         </View>
 *       </Provider>
 *     ),
 *   ],
 * } satisfies Meta<typeof ActionBtn>;
 *
 * ✅ VENTAJA TS AQUÍ:
 * Si el store tiene un tipo definido (RootState), TypeScript
 * verificará que el Provider recibe el store correcto.
 * En JS, podrías pasar cualquier objeto como store sin error.
 *
 * 🎯 PATRÓN RECOMENDADO (DUMB vs SMART):
 * ┌─────────────────────────────────────────────────────────┐
 * │  ActionBtnContainer.tsx (SMART)                         │
 * │  → usa useSelector para obtener el personaje activo     │
 * │  → usa useDispatch para ejecutar habilidades            │
 * │  → renderiza <ActionBtn {...props} />                   │
 * │                                                          │
 * │  ActionBtn/index.tsx (DUMB) ← Este archivo              │
 * │  → Solo recibe props                                     │
 * │  → Solo renderiza                                        │
 * │  → Testeable en Storybook SIN Redux                     │
 * └─────────────────────────────────────────────────────────┘
 *
 * Esto mantiene Storybook simple y el componente reutilizable.
 */

/**
 * ESCENARIO C: Story con estado interno simulado (useState)
 * ---------------------------------------------------------------
 * Si quisieras simular que el botón se "activa" al presionar,
 * puedes usar el render personalizado:
 *
 * import { useState } from 'react';
 *
 * export const Interactive: Story = {
 *   render: (args) => {
 *     // ← 'render' reemplaza el renderizado automático de 'args'
 *     const [pressed, setPressed] = useState(false);
 *     return (
 *       <ActionBtn
 *         {...args}
 *         variant={pressed ? 'attack' : 'default'}
 *         onPress={() => setPressed(!pressed)}
 *       />
 *     );
 *   },
 *   args: {
 *     icon: '⚔️',
 *     label: 'Toggle',
 *     cost: 'Press me',
 *   },
 * };
 *
 * ✅ VENTAJA TS: El tipo 'Story' valida que {...args} dentro de
 * render también tenga las props correctas.
 */