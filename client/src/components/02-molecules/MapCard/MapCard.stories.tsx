/**
 * ============================================================
 * 📖 MapCard — Story TypeScript
 * Molécula DUMB: card individual de un mapa
 * ============================================================
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { MapCard } from './index';

const meta = {
  title: '02-Molecules/MapCard',
  component: MapCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#050508', padding: 16, width: 120 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof MapCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lorencia: Story = {
  args: { id: 'lorencia', name: 'Lorencia', levelRange: 'Lv. 1 – 40', isActive: true },
};

export const Dungeon: Story = {
  args: { id: 'dungeon', name: 'Dungeon', levelRange: 'Lv. 40 – 80', isActive: false },
};

export const Devias: Story = {
  args: { id: 'devias', name: 'Devias', levelRange: 'Lv. 80 – 130', isActive: false },
};

export const Atlans: Story = {
  args: { id: 'atlans', name: 'Atlans', levelRange: 'Lv. 130+', isActive: false },
};

/** Los 5 juntos como en el diseño */
export const TodosLosMaps: Story = {
  args: { id: 'lorencia', name: 'Lorencia', levelRange: 'Lv. 1 – 40' },
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#050508', padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <MapCard id="lorencia" name="Lorencia" levelRange="Lv. 1 – 40"   isActive={true}  />
      <MapCard id="dungeon"  name="Dungeon"  levelRange="Lv. 40 – 80"  isActive={false} />
      <MapCard id="devias"   name="Devias"   levelRange="Lv. 80 – 130" isActive={false} />
      <MapCard id="noria"    name="Noria"    levelRange="Lv. 50 – 100" isActive={false} />
      <MapCard id="atlans"   name="Atlans"   levelRange="Lv. 130+"      isActive={false} />
    </View>
  ),
};