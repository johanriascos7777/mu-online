import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { StatGroup } from './index';

const meta = {
  title: '02-Molecules/StatGroup',
  component: StatGroup,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View className="flex-1 bg-mu-bg-deep p-6 justify-center max-w-md">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof StatGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DarkKnight: Story = {
  args: {
    characterClass: 'Dark Knight',
    hp: { current: 390, max: 500 },
    mp: { current: 90, max: 200 },
    exp: { current: 62, max: 100 },
  },
};

export const DarkWizard: Story = {
  args: {
    characterClass: 'Dark Wizard',
    hp: { current: 165, max: 300 },
    mp: { current: 528, max: 600 },
    exp: { current: 35, max: 100 },
  },
};