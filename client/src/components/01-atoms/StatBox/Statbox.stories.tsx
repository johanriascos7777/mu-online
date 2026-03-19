/**
 * ============================================================
 * 📖 StatBox — Story TypeScript
 * Átomo DUMB: muestra un stat individual del personaje
 * ============================================================
 *
 * 🧠 LO CLAVE DE ESTE COMPONENTE:
 * ---------------------------------------------------------------
 * En el diseño del CharacterCard hay una grilla 4x1:
 *
 *   ┌─────┬─────┬─────┬─────┐
 *   │ 112 │  80 │ 109 │  22 │
 *   │ STR │ AGI │ VIT │ ENE │
 *   └─────┴─────┴─────┴─────┘
 *
 * Cada celda de esa grilla es un StatBox.
 * La molécula CharacterStats hará el .map() para renderizar los 4.
 *
 * ---------------------------------------------------------------
 * 🗺️ ¿Por qué no un solo componente "StatsGrid"?
 * ---------------------------------------------------------------
 * Atomic Design dice: el átomo es la unidad mínima.
 * StatBox = un solo stat.
 * CharacterStats (molécula) = los 4 juntos con la grilla.
 *
 * Así podemos usar StatBox en otros contextos:
 *   - En el panel de combate para mostrar el stat del personaje activo
 *   - En un tooltip de comparación de items
 *   - En el perfil del personaje con más detalle
 * ============================================================
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { StatBox } from './index';

const meta = {
  title: '01-Atoms/StatBox',
  component: StatBox,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#12121f', padding: 24, width: 80 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof StatBox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** STR del Dark Knight — el más alto */
export const Strength: Story = {
  args: { stat: 'STR', value: 112 },
};

/** AGI */
export const Agility: Story = {
  args: { stat: 'AGI', value: 80 },
};

/** VIT */
export const Vitality: Story = {
  args: { stat: 'VIT', value: 109 },
};

/** ENE del Dark Knight — el más bajo */
export const Energy: Story = {
  args: { stat: 'ENE', value: 22 },
};

/** Los 4 juntos como en CharacterCard */
export const AllStats: Story = {
  args: { stat: 'STR', value: 112 },
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#12121f', padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  render: () => (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      <StatBox stat="STR" value={112} />
      <StatBox stat="AGI" value={80}  />
      <StatBox stat="VIT" value={109} />
      <StatBox stat="ENE" value={22}  />
    </View>
  ),
};