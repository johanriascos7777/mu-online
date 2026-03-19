/**
 * ============================================================
 * 📖 MapSelector — Story TypeScript
 * Organismo SMART: llama a GET /maps y renderiza MapCards
 * ============================================================
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { MapSelector } from './index';

const meta = {
  title: '03-Organisms/MapSelector',
  component: MapSelector,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#050508' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof MapSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Conectado al backend real — los 5 mapas de MU Online */
export const ConBackendReal: Story = {
  args: {
    apiUrl:      'http://localhost:3000',
    activeMapId: 'lorencia',
  },
};

/** Lorencia seleccionada */
export const LorenciaActiva: Story = {
  args: {
    apiUrl:      'http://localhost:3000',
    activeMapId: 'lorencia',
  },
};

/** Atlans seleccionada — el mapa más difícil */
export const AtlansActiva: Story = {
  args: {
    apiUrl:      'http://localhost:3000',
    activeMapId: 'atlans',
  },
};

/** Estado error */
export const EstadoError: Story = {
  args: {
    apiUrl: 'http://backend-no-existe.local',
  },
};