/**
 * ============================================================
 * 📖 LevelBadge — Story TypeScript
 * Átomo DUMB: muestra el nivel del personaje o monstruo
 * ============================================================
 *
 * 🧠 LO CLAVE DE ESTE COMPONENTE:
 * ---------------------------------------------------------------
 * Es el badge que aparece en dos contextos del diseño:
 *
 *   variant: 'card'   → esquina superior derecha de CharacterCard
 *                        fondo negro semitransparente + borde dorado
 *                        Ejemplo: LV. 12 en la card del Dark Knight
 *
 *   variant: 'combat' → panel de combate junto al nombre
 *                        sin fondo, más limpio
 *                        Ejemplo: LV. 3 junto a "Budge Dragon"
 *
 * Un solo componente cubre ambos contextos con 'variant'.
 * ============================================================
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { LevelBadge } from './index';

const meta = {
  title: '01-Atoms/LevelBadge',
  component: LevelBadge,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#050508', padding: 24, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof LevelBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Badge en CharacterCard — Dark Knight nivel 12 */
export const CardVariant: Story = {
  args: { level: 12, variant: 'card' },
};

/** Badge en panel de combate — Budge Dragon nivel 3 */
export const CombatVariant: Story = {
  args: { level: 3, variant: 'combat' },
};

/** Nivel alto — para verificar que no se corta el número */
export const HighLevel: Story = {
  args: { level: 400, variant: 'card' },
};