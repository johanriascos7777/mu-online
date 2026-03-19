/**
 * ============================================================
 * 📖 CharacterList — Story TypeScript
 * Organismo SMART: llama al backend y renderiza CharacterCards
 * ============================================================
 *
 * 🧠 LO CLAVE DE ESTE COMPONENTE:
 * ---------------------------------------------------------------
 * Hasta ahora todos los componentes eran DUMB — recibían props
 * y solo renderizaban. Este es el primero SMART:
 *
 *   DUMB (átomos y moléculas):
 *     StatBar, LevelBadge, CharacterCard...
 *     → Solo props → Solo renderiza → Testeable en Storybook solo
 *
 *   SMART (organismos):
 *     CharacterList
 *     → Llama a GET /characters
 *     → Maneja loading / error / data
 *     → Pasa datos a CharacterCard
 *
 * ---------------------------------------------------------------
 * 🗺️ El problema con Storybook y fetch real
 * ---------------------------------------------------------------
 * Storybook corre en el browser/emulador SIN el backend activo.
 * Si llamamos fetch() real → error de conexión.
 *
 * Solución: usamos 'apiUrl' para apuntar a datos mock en stories,
 * y al backend real en la app.
 *
 * En estas stories pasamos los personajes directamente como
 * parámetro para simular la respuesta del backend.
 * ============================================================
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { CharacterList } from './index';

const meta = {
  title: '03-Organisms/CharacterList',
  component: CharacterList,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#050508' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof CharacterList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Conectado al backend real — solo funciona con el server corriendo.
 * npm run start:dev en mu-online-api
 */
export const ConBackendReal: Story = {
  args: {
    apiUrl:          'http://localhost:3000',
    activeCharacter: 'Johan',
  },
};

/**
 * Estado de carga — se ve el spinner dorado
 * Simulamos una URL que nunca responde
 */
export const EstadoCargando: Story = {
  args: {
    apiUrl: 'http://localhost:9999', // puerto que no existe → loading infinito
  },
};

/**
 * Estado de error — backend no disponible
 * Simulamos una URL que rechaza la conexión
 */
export const EstadoError: Story = {
  args: {
    apiUrl: 'http://backend-no-existe.local',
  },
};