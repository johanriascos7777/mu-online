/**
 * ============================================================
 * 📖 CombatArena — Story TypeScript
 * Organismo SMART: pantalla completa de combate
 * ============================================================
 *
 * 🧠 LO CLAVE DE ESTE COMPONENTE:
 * ---------------------------------------------------------------
 * CombatArena es el organismo más SMART del proyecto.
 * Conecta con 4 endpoints del backend:
 *
 *   POST /combat/start        → al montar el componente
 *   POST /combat/:id/attack   → al presionar Attack
 *   POST /combat/:id/flee     → al presionar Flee
 *
 * Y usa los átomos más complejos juntos:
 *   CharacterSilhouette → SVG del personaje
 *   MonsterSilhouette   → SVG del monstruo
 *   StatBar × 3         → HP personaje, MP personaje, HP monstruo
 *   ActionBtn × 4       → Attack, Twisting Slash, Impale, Flee
 *   LevelBadge × 2      → nivel personaje y monstruo
 * ============================================================
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { CombatArena } from './index';

const meta = {
  title: '03-Organisms/CombatArena',
  component: CombatArena,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#050508' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof CombatArena>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Johan vs monstruo en Lorencia — backend real
 * Asegúrate de que Johan existe en la DB:
 *   POST /characters { "name": "Johan", "characterClass": "DarkKnight" }
 */
export const JohanVsLorencia: Story = {
  args: {
    apiUrl:        'http://localhost:3000',
    characterName: 'Johan',
    mapName:       'lorencia',
  },
};

/** Dark Wizard en Lorencia */
export const MerlinVsLorencia: Story = {
  args: {
    apiUrl:        'http://localhost:3000',
    characterName: 'Merlin',
    mapName:       'lorencia',
  },
};