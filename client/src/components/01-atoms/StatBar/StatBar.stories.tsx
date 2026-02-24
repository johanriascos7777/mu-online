import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { StatBar } from './index';

/**
 * Se han definido tres variantes principales para abarcar las **Stat Bars** (Barras de Estadísticas) del juego.
 * Estas variaciones corresponden a los atributos vitales de los personajes de MU Online.
 * 
 * Las variantes principales son:
 * * `hp` (Health Points - Rojo Brillante)
 * * `mp` (Mana Points - Azul Mágico)
 * * `exp` (Experience - Dorado)
 * 
 * > **Nota importante:** El ancho de la barra es completamente fluido y se adaptará al contenedor donde se posicione. 
 * > El cálculo del porcentaje se realiza automáticamente basándose en `currentValue` y `maxValue`.
 */
const meta = {
  title: '01-Atoms/StatBar',
  component: StatBar,
  tags: ['autodocs'], // <-- ¡Esto autogenera tu página de documentación estilo YML/Twig!
  decorators: [
    (Story) => (
      <View className="flex-1 bg-mu-bg-card p-6 justify-center max-w-md border border-mu-gold/20">
        <Story />
      </View>
    ),
  ],
  argTypes: {
    type: {
      name: 'type',
      description: 'Se refiere al tipo de barra a renderizar. Modifica el color y el formato del valor numérico.',
      control: 'select',
      options: ['hp', 'mp', 'exp'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'hp' },
      },
    },
    label: {
      name: 'label',
      description: 'Es el texto de la etiqueta a la izquierda de la barra.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'HP' },
      },
    },
    currentValue: {
      name: 'currentValue',
      description: 'El valor actual de la estadística (define el llenado de la barra).',
      control: 'number',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '390' },
      },
    },
    maxValue: {
      name: 'maxValue',
      description: 'El valor máximo posible de la estadística (el 100% de la barra).',
      control: 'number',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '500' },
      },
    },
  },
} satisfies Meta<typeof StatBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Ejemplo de Barra de Vida (Health Points):
 */
export const HealthPoints: Story = {
  args: {
    label: 'HP',
    currentValue: 390,
    maxValue: 500,
    type: 'hp',
  },
};

/**
 * Ejemplo de Barra de Maná (Mana Points):
 */
export const ManaPoints: Story = {
  args: {
    label: 'MP',
    currentValue: 90,
    maxValue: 200,
    type: 'mp',
  },
};

/**
 * Ejemplo de Barra de Experiencia:
 * Nota que cuando el tipo es `exp`, el valor a la derecha cambia a formato porcentaje (%).
 */
export const Experience: Story = {
  args: {
    label: 'EXP',
    currentValue: 62,
    maxValue: 100,
    type: 'exp',
  },
};