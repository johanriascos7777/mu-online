/**
 * ============================================================
 * 📖 ActionBtn — Story TypeScript
 * Componente DUMB: recibe props, solo renderiza
 * * ============================================================
 * 📖 ActionBtn — Story TypeScript
 * Componente DUMB: recibe props, solo renderiza
 * ============================================================
 *
 * 🧠 LO CLAVE DE ESTE COMPONENTE:
 * ---------------------------------------------------------------
 * 'variant' hace DOS cosas a la vez:
 *
 *   'attack' → label grande serif       + cost en ROJO   (Basic)
 *   'skill'  → label uppercase thin     + cost en AZUL   (30 MP)
 *   'heal'   → label uppercase thin     + cost en VERDE  (Heal HP)
 *
 * En el diseño tienes 4 botones distintos visualmente,
 * pero en realidad es UN SOLO componente reutilizable.
 * La prop 'variant' controla todo el estilo.
 *
 * ---------------------------------------------------------------
 * 🗺️ variantStyles — sin ifs anidados
 * ---------------------------------------------------------------
 * En index.tsx verás un objeto 'variantStyles' que mapea
 * cada variante a sus clases de Tailwind:
 *
 *   const variantStyles = {
 *     attack: { border: '...', labelStyle: '...', costColor: '...' },
 *     skill:  { border: '...', labelStyle: '...', costColor: '...' },
 *     heal:   { border: '...', labelStyle: '...', costColor: '...' },
 *   }
 *
 * Luego en el componente solo hacemos:
 *   const styles = variantStyles[variant]
 *
 * Resultado: cero ifs anidados, componente limpio y escalable.
 * Si mañana agregas variant: 'disabled', solo agregas una
 * entrada al objeto. No tocas nada más.
 *
 * ---------------------------------------------------------------
 * 🗺️ ¿Cómo se usará en el organismo?
 * ---------------------------------------------------------------
 * Este ActionBtn es el ÁTOMO. El organismo CombatActions
 * hará un .map() sobre los datos del personaje:
 *
 *   const skills = [
 *     { icon: '⚔️', label: 'Attack',         cost: 'Basic',   variant: 'attack' },
 *     { icon: '🌪️', label: 'Twisting Slash', cost: '30 MP',   variant: 'skill'  },
 *     { icon: '🗡️', label: 'Impale',         cost: '50 MP',   variant: 'skill'  },
 *     { icon: '🧪', label: 'Use Potion',     cost: 'Heal HP', variant: 'heal'   },
 *   ];
 *
 *   skills.map(skill => <ActionBtn key={skill.label} {...skill} />)
 *
 *   CombatActions = componente SMART (conoce el estado del juego)
 *   ActionBtn     = componente DUMB  (solo renderiza lo que recibe)
 *
 * ---------------------------------------------------------------
 * 📖 AllButtons — render: con 4 instancias
 * ---------------------------------------------------------------
 * La historia AllButtons usa 'render:' para mostrar los 4 botones
 * juntos exactamente como en el diseño, antes de crear el organismo.
 * Así verificamos visualmente que se ven bien en fila.
 *
 * NOTA TYPESCRIPT: cuando usas 'render:' con props obligatorias,
 * TS exige 'args' también como fallback. Por eso AllButtons
 * tiene ambos — args como satisfacción del tipo, render como
 * visualización real.
 * ============================================================
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { ActionBtn } from './index';

// ============================================================
// META
// ============================================================
/**
 * 'satisfies Meta<typeof ActionBtn>' hace que TypeScript
 * lea ActionBtnProps automáticamente.
 * NO necesitamos argTypes — Storybook genera la doc solo.
 */
const meta = {
  title: '01-Atoms/ActionBtn',
  component: ActionBtn,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          backgroundColor: '#050508',
          padding: 16,
          flexDirection: 'row',
          gap: 8,
        }}
      >
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ActionBtn>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================
// HISTORIAS — Los 4 botones del diseño
// ============================================================

/**
 * ⚔️ Attack — variant: 'attack'
 * Label: grande, serif, color claro
 * Cost: 'Basic' en rojo
 */
export const Attack: Story = {
  args: {
    icon: '⚔️',
    label: 'Attack',
    cost: 'Basic',
    variant: 'attack',
  },
};

/**
 * 🌪️ Twisting Slash — variant: 'skill'
 * Label: uppercase thin, dorado
 * Cost: '30 MP' en azul
 */
export const TwistingSlash: Story = {
  args: {
    icon: '🌪️',
    label: 'Twisting Slash',
    cost: '30 MP',
    variant: 'skill',
  },
};

/**
 * 🗡️ Impale — variant: 'skill'
 * Cost más alto que Twisting Slash
 */
export const Impale: Story = {
  args: {
    icon: '🗡️',
    label: 'Impale',
    cost: '50 MP',
    variant: 'skill',
  },
};

/**
 * 🧪 Use Potion — variant: 'heal'
 * Label: uppercase thin, dorado
 * Cost: 'Heal HP' en VERDE ← aquí está la diferencia de color
 */
export const UsePotion: Story = {
  args: {
    icon: '🧪',
    label: 'Use Potion',
    cost: 'Heal HP',
    variant: 'heal',
  },
};

/**
 * 🎮 AllButtons — Los 4 juntos como en el diseño
 * Usando render: para mostrar múltiples instancias
 */
export const AllButtons: Story = {
  // ✅ args vacío satisface a TS — render los ignora
  // pero TS necesita ver que conocemos las props obligatorias
  args: {
    icon: '⚔️',
    label: 'Attack',
    cost: 'Basic',
    variant: 'attack',
  },
  // render: sobreescribe el renderizado — args queda como fallback
  render: () => (
    <View style={{ flex: 1, flexDirection: 'row', gap: 8 }}>
      <ActionBtn icon="⚔️"  label="Attack"         cost="Basic"   variant="attack" />
      <ActionBtn icon="🌪️"  label="Twisting Slash" cost="30 MP"   variant="skill"  />
      <ActionBtn icon="🗡️"  label="Impale"         cost="50 MP"   variant="skill"  />
      <ActionBtn icon="🧪"  label="Use Potion"     cost="Heal HP" variant="heal"   />
    </View>
  ),
};