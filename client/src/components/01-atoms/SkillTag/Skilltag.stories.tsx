/**
 * ============================================================
 * 📖 SkillTag — Story TypeScript
 * Átomo DUMB: muestra el nombre de una habilidad
 * ============================================================
 *
 * 🧠 LO CLAVE DE ESTE COMPONENTE:
 * ---------------------------------------------------------------
 * En CharacterCard aparece una fila de skills:
 *
 *   Dark Knight: [Twisting Slash] [Impale] [Death Stab]
 *   Dark Wizard: [Fireball] [Ice Storm] [Lightning]
 *   Elf:         [Triple Shot] [Heal] [Defense]
 *
 * El color del tag va ligado a la clase del personaje.
 * SkillTag recibe el nombre de la habilidad Y la clase,
 * y sabe solo qué colores usar.
 *
 * ---------------------------------------------------------------
 * 🗺️ Relación con CharacterCard
 * ---------------------------------------------------------------
 * CharacterCard hará esto:
 *
 *   const skills = character.skills; // ['Twisting Slash', 'Impale', ...]
 *
 *   skills.map(skill => (
 *     <SkillTag
 *       key={skill}
 *       skill={skill}
 *       characterClass={character.characterClass}
 *     />
 *   ))
 *
 * Un átomo, múltiples instancias con .map().
 * ============================================================
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { SkillTag } from './index';

const meta = {
  title: '01-Atoms/SkillTag',
  component: SkillTag,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#0e0e1a', padding: 24, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SkillTag>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Habilidad del Dark Knight — borde y texto rojo */
export const KnightSkill: Story = {
  args: { skill: 'Twisting Slash', characterClass: 'DarkKnight' },
};

/** Habilidad del Dark Wizard — azul */
export const WizardSkill: Story = {
  args: { skill: 'Fireball', characterClass: 'DarkWizard' },
};

/** Habilidad del Elf — verde */
export const ElfSkill: Story = {
  args: { skill: 'Triple Shot', characterClass: 'Elf' },
};

/** Las skills del Dark Knight juntas — como en CharacterCard */
export const KnightSkillRow: Story = {
  args: { skill: 'Twisting Slash', characterClass: 'DarkKnight' },
  render: () => (
    <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
      <SkillTag skill="Twisting Slash" characterClass="DarkKnight" />
      <SkillTag skill="Impale"         characterClass="DarkKnight" />
      <SkillTag skill="Death Stab"     characterClass="DarkKnight" />
    </View>
  ),
};

/** Las tres clases comparadas */
export const AllClasses: Story = {
  args: { skill: 'Fireball', characterClass: 'DarkWizard' },
  render: () => (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <SkillTag skill="Twisting Slash" characterClass="DarkKnight" />
        <SkillTag skill="Impale"         characterClass="DarkKnight" />
      </View>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <SkillTag skill="Fireball"  characterClass="DarkWizard" />
        <SkillTag skill="Ice Storm" characterClass="DarkWizard" />
      </View>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <SkillTag skill="Triple Shot" characterClass="Elf" />
        <SkillTag skill="Heal"        characterClass="Elf" />
      </View>
    </View>
  ),
};