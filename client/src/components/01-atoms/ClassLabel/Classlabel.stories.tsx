/**
 * ============================================================
 * 📖 ClassLabel — Story TypeScript
 * Átomo DUMB: muestra la clase del personaje con su color
 * ============================================================
 *
 * 🧠 LO CLAVE DE ESTE COMPONENTE:
 * ---------------------------------------------------------------
 * En el diseño aparece encima del nombre del personaje:
 *
 *   "DARK KNIGHT"  → rojo   — Johan
 *   "DARK WIZARD"  → azul   — Merlin
 *   "FAIRY ELF"    → verde  — Arwen
 *
 * La lógica de color NO vive en el padre (CharacterCard).
 * Vive aquí dentro del átomo en CLASS_CONFIG.
 * CharacterCard solo pasa characterClass='DarkKnight' y listo.
 *
 * ---------------------------------------------------------------
 * 🗺️ CLASS_CONFIG — el mismo patrón que variantStyles en ActionBtn
 * ---------------------------------------------------------------
 * En lugar de ifs, usamos un objeto de configuración:
 *
 *   const CLASS_CONFIG = {
 *     DarkKnight: { label: 'DARK KNIGHT', color: '#c0392b' },
 *     DarkWizard: { label: 'DARK WIZARD', color: '#4a90d9' },
 *     Elf:        { label: 'FAIRY ELF',   color: '#27ae60' },
 *   }
 *
 * Cuando mañana llegue MagicGladiator, solo agregas una línea.
 * No tocas el componente, no tocas las stories existentes.
 * ============================================================
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { ClassLabel } from './index';

const meta = {
  title: '01-Atoms/ClassLabel',
  component: ClassLabel,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#0e0e1a', padding: 24, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ClassLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Dark Knight — rojo, como en la card de Johan */
export const DarkKnight: Story = {
  args: { characterClass: 'DarkKnight', size: 'sm' },
};

/** Dark Wizard — azul, como en la card de Merlin */
export const DarkWizard: Story = {
  args: { characterClass: 'DarkWizard', size: 'sm' },
};

/** Fairy Elf — verde, como en la card de Arwen */
export const Elf: Story = {
  args: { characterClass: 'Elf', size: 'sm' },
};

/** Tamaño xs — para badges compactos en combate */
export const CompactSize: Story = {
  args: { characterClass: 'DarkKnight', size: 'xs' },
};

/** Las tres clases juntas — para verificar los colores */
export const AllClasses: Story = {
  args: { characterClass: 'DarkKnight' },
  render: () => (
    <View style={{ gap: 8 }}>
      <ClassLabel characterClass="DarkKnight" />
      <ClassLabel characterClass="DarkWizard" />
      <ClassLabel characterClass="Elf" />
    </View>
  ),
};