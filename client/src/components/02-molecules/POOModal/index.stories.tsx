/**
 * ============================================================
 * 📖 POOModal — Story TypeScript
 * Molécula SEMI-SMART: Modal educativo de conceptos POO
 * ============================================================
 *
 * 🧠 LO CLAVE DE ESTE COMPONENTE:
 * ---------------------------------------------------------------
 * ¿Por qué es SEMI-SMART?
 *   1. Recibe por props QUÉ mostrar (`concepts`) y CUÁNDO mostrarse (`visible`).
 *   2. PERO es lo suficientemente inteligente para manejar su 
 *      propia PAGINACIÓN interna (`page` en el `useState`).
 * 
 * El padre (HomeScreen o el Hook usePOOModal) no tiene que 
 * preocuparse por saber en qué página del modal va el usuario.
 * El modal se auto-gestiona, el padre solo le dice "Ábrete con 
 * estos 3 conceptos".
 *
 * ---------------------------------------------------------------
 * ⚠️ NOTA PARA STORYBOOK:
 * ---------------------------------------------------------------
 * Como usa el componente `<Modal>` nativo de React Native, 
 * tomará toda la pantalla en el preview. Le pasamos `visible: true`
 * por defecto para que se vea apenas entras a la story.
 * ============================================================
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text } from 'react-native';
import { POOModal } from './index';
// Importamos datos reales para que el modal tenga algo que pintar en la story
import { ATTACK_CONCEPTS, HOME_CONCEPTS } from '../../../data/poo-concepts';

const meta = {
  title: '02-Molecules/POOModal',
  component: POOModal,
  tags: ['autodocs'],
  decorators:[
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#050508', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        {/* Un pequeño texto de fondo para notar que el modal hace overlay oscuro */}
        <Text style={{ color: '#c9a84c', fontFamily: 'Cinzel_700Bold', fontSize: 24 }}>
          Fondo de la App
        </Text>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof POOModal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 
 * Un solo concepto (Sin paginación)
 * Ejemplo: Cuando el usuario presiona "Attack"
 */
export const SingleConcept: Story = {
  args: {
    visible: true,
    title: 'Al presionar Attack...',
    concepts: ATTACK_CONCEPTS, // Suele ser un array de 1 item
    onClose: () => console.log('Cerrar modal presionado'),
  },
};

/** 
 * Múltiples conceptos (Con paginación automática)
 * Ejemplo: El botón del Header que explica todo el proyecto
 */
export const MultipleConcepts: Story = {
  args: {
    visible: true,
    title: 'Conceptos POO en este proyecto',
    concepts: HOME_CONCEPTS, // Array con múltiples items
    onClose: () => console.log('Cerrar modal presionado'),
  },
};

/** 
 * Modal Cerrado (Para probar comportamiento)
 * Cambia visible a 'true' en los controles de Storybook para verlo.
 */
export const Hidden: Story = {
  args: {
    visible: false,
    title: 'No me vas a ver',
    concepts: ATTACK_CONCEPTS,
    onClose: () => console.log('Cerrar modal presionado'),
  },
};