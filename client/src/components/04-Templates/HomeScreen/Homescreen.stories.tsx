/**
 * ============================================================
 * 📖 HomeScreen — Story TypeScript
 * Template: pantalla home completa como el diseño HTML
 * ============================================================
 *
 * Muestra todo junto:
 *   1. Header MU Online
 *   2. MapSelector (GET /maps)
 *   3. CharacterList (GET /characters)
 *   4. CombatArena — se activa al elegir mapa + personaje
 *
 * Flujo interactivo:
 *   1. Click en un mapa → se activa
 *   2. Click en "Enter Battle" de un personaje → inicia combate
 *   3. Click en Attack → turno de combate en tiempo real
 * ============================================================
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { HomeScreen } from './index';

const meta = {
  title: '04-Templates/HomeScreen',
  component: HomeScreen,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#050508', height: 900 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof HomeScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Home completa — backend real
 * 1. Selecciona Lorencia
 * 2. Click "Enter Battle" en cualquier personaje
 * 3. Aparece el combate con el monstruo
 * 4. Click Attack para atacar
 */
export const HomeCompleta: Story = {
  args: {
    apiUrl: 'http://localhost:3000',
  },
};