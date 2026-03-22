/**
 * ============================================================
 * 📖 MonsterSilhouette — Story TypeScript
 * Átomo DUMB: silueta SVG del monstruo
 * ============================================================
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { MonsterSilhouette } from './index';

const meta = {
  title: '01-Atoms/MonsterSilhouette',
  component: MonsterSilhouette,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#05080f', padding: 24, alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof MonsterSilhouette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BudgeDragon: Story = {
  args: { monsterType: 'BudgeDragon', size: 'combat' },
};

export const Goblin: Story = {
  args: { monsterType: 'Goblin', size: 'combat' },
};

export const AmbosMonstruos: Story = {
  args: { monsterType: 'BudgeDragon' },
  render: () => (
    <View style={{ flexDirection: 'row', gap: 32 }}>
      <MonsterSilhouette monsterType="BudgeDragon" />
      <MonsterSilhouette monsterType="Goblin" />
    </View>
  ),
};