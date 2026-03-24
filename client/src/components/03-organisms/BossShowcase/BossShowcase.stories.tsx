/**
 * ============================================================
 * 📖 BossShowcase — Story TypeScript
 * Organismo SMART: demo interactiva contra el Ancient Dragon
 * ============================================================
 *
 * Inicia automáticamente un combate con un personaje aleatorio.
 * No requiere que el usuario elija mapa ni personaje.
 * Perfecto como sección de demostración en el home.
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { BossShowcase } from './index';

const meta = {
  title: '03-Organisms/BossShowcase',
  component: BossShowcase,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#050508' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof BossShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Demo interactiva — backend real */
export const DemoInteractiva: Story = {
  args: {
    apiUrl: 'http://localhost:3000',
  },
};