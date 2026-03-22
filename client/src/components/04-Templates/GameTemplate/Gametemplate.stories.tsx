/**
 * ============================================================
 * 📖 GameTemplate — Story TypeScript
 * Template: flujo completo del juego
 * ============================================================
 *
 * 🧠 LO CLAVE DE ESTE COMPONENTE:
 * ---------------------------------------------------------------
 * El Template es el nivel más alto del Atomic Design en este proyecto.
 * Une los tres organismos en un flujo con estado propio:
 *
 *   Fase 1: map       → MapSelector
 *   Fase 2: character → CharacterList
 *   Fase 3: combat    → CombatArena
 *   Fase 4: result    → Pantalla de victoria/derrota
 *
 * El estado del juego vive aquí:
 *   selectedMap, selectedChar, phase, combatResult
 *
 * Los organismos solo reportan hacia arriba con callbacks:
 *   onSelectMap()      → avanza a fase 'character'
 *   onSelectCharacter()→ avanza a fase 'combat'
 *   onCombatEnd()      → avanza a fase 'result'
 * ============================================================
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { GameTemplate } from './index';

const meta = {
  title: '04-Templates/GameTemplate',
  component: GameTemplate,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#050508', height: 800 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof GameTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Flujo completo — backend real corriendo
 * 1. Selecciona un mapa
 * 2. Selecciona un personaje
 * 3. Combate
 * 4. Ver resultado
 */
export const FlujoCompleto: Story = {
  args: {
    apiUrl: 'http://localhost:3000',
  },
};