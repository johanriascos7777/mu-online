/**
 * ============================================================
 * 📖 CharacterSilhouette — Story TypeScript
 * Átomo: siluetas SVG de los 3 personajes
 * ============================================================
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { CharacterSilhouette } from './index';

const meta = {
  title: '01-Atoms/CharacterSilhouette',
  component: CharacterSilhouette,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#0a0a12', padding: 24, alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof CharacterSilhouette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DarkKnight: Story = {
  args: { characterClass: 'DarkKnight', size: 'card' },
};

export const DarkWizard: Story = {
  args: { characterClass: 'DarkWizard', size: 'card' },
};

export const Elf: Story = {
  args: { characterClass: 'Elf', size: 'card' },
};

export const CombatSize: Story = {
  args: { characterClass: 'DarkKnight', size: 'combat' },
};

/** Los tres juntos */
export const AllClasses: Story = {
  args: { characterClass: 'DarkKnight' },
  render: () => (
    <View style={{ flexDirection: 'row', gap: 24 }}>
      <CharacterSilhouette characterClass="DarkKnight" />
      <CharacterSilhouette characterClass="DarkWizard" />
      <CharacterSilhouette characterClass="Elf" />
    </View>
  ),
};