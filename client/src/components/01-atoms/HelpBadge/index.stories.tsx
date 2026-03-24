/**
 * ============================================================
 * 📖 HelpBadge — Story TypeScript
 * Átomo DUMB: el botón '!' educativo que abre explicaciones POO
 * ============================================================
 *
 * 🧠 LO CLAVE DE ESTE COMPONENTE:
 * ---------------------------------------------------------------
 * Este componente es 100% DUMB (tonto). 
 * NO sabe qué es POO, NO sabe qué modal abrir, NO importa datos.
 * 
 * Su única responsabilidad es:
 *   1. Recibir una variante visual (gold, subtle, combat).
 *   2. Renderizarse bonito.
 *   3. Gritar "¡Me presionaron!" ejecutando el `onPress` que 
 *      le pasó su padre.
 *
 * ---------------------------------------------------------------
 * 🗺️ VARIANT_STYLES y SIZE_STYLES
 * ---------------------------------------------------------------
 * Al igual que ClassLabel, usa objetos de configuración en lugar 
 * de múltiples `if/else`. Si mañana queremos un badge color "veneno"
 * para el pantano, solo agregamos una key al objeto y listo.
 * ============================================================
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { HelpBadge } from './index';

const meta = {
  title: '01-Atoms/HelpBadge',
  component: HelpBadge,
  tags: ['autodocs'],
  decorators:[
    (Story) => (
      <View style={{ backgroundColor: '#0e0e1a', padding: 32, alignItems: 'center', justifyContent: 'center' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof HelpBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Variante Gold — por defecto, usada en fondos oscuros principales */
export const Gold: Story = {
  args: {
    variant: 'gold',
    size: 'sm',
    label: 'Explicación POO Gold',
    onPress: () => console.log('Abre modal POO'),
  },
};

/** Variante Subtle — para lugares donde no queremos distraer mucho */
export const Subtle: Story = {
  args: {
    variant: 'subtle',
    size: 'sm',
    label: 'Explicación POO Subtle',
    onPress: () => console.log('Abre modal POO'),
  },
};

/** Variante Combat — roja y agresiva para la arena de combate */
export const Combat: Story = {
  args: {
    variant: 'combat',
    size: 'sm',
    label: 'Explicación POO Combat',
    onPress: () => console.log('Abre modal POO'),
  },
};

/** Tamaño MD — para el header principal donde hay más espacio */
export const MediumSize: Story = {
  args: {
    variant: 'gold',
    size: 'md',
    label: 'Explicación POO Grande',
    onPress: () => console.log('Abre modal POO'),
  },
};

/** Todas las variantes juntas — ideal para la documentación visual */
export const AllVariants: Story = {
  args: { onPress: () => {} },
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <HelpBadge variant="gold" size="md" onPress={() => {}} />
      <HelpBadge variant="subtle" size="md" onPress={() => {}} />
      <HelpBadge variant="combat" size="md" onPress={() => {}} />
    </View>
  ),
};