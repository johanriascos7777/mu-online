/**
 * ============================================================
 * 📖 CharacterCard — Story TypeScript
 * Molécula: combina ClassLabel + LevelBadge + StatBar +
 *           StatBox + SkillTag en la card del personaje
 * ============================================================
 *
 * 🧠 LO CLAVE DE ESTE COMPONENTE:
 * ---------------------------------------------------------------
 * Esta es la primera MOLÉCULA del proyecto.
 * Una molécula en Atomic Design = átomos trabajando juntos
 * con un propósito específico.
 *
 * CharacterCard NO tiene lógica de negocio:
 *   ❌ No llama a la API
 *   ❌ No tiene useState para el combate
 *   ✅ Solo recibe props y renderiza
 *
 * El organismo CharacterList (próximo) será el SMART component:
 *   → Llama a GET /characters
 *   → Maneja el estado de carga
 *   → Pasa los datos a cada CharacterCard
 *
 * ---------------------------------------------------------------
 * 🗺️ Jerarquía de componentes hasta ahora:
 * ---------------------------------------------------------------
 *
 *   CharacterCard (molécula — este archivo)
 *   ├── ClassLabel  (átomo)
 *   ├── LevelBadge  (átomo)
 *   ├── StatBar × 3 (átomo — HP, MP, EXP)
 *   ├── StatBox × 4 (átomo — STR, AGI, VIT, ENE)
 *   └── SkillTag × N (átomo — habilidades)
 *
 *   CharacterList (organismo — próximo)
 *   └── CharacterCard × N
 * ============================================================
 */
import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, View } from 'react-native';
import { CharacterCard } from './index';

const meta = {
  title: '02-Molecules/CharacterCard',
  component: CharacterCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ScrollView
        style={{ backgroundColor: '#050508' }}
        contentContainerStyle={{ padding: 16 }}
      >
        <Story />
      </ScrollView>
    ),
  ],
} satisfies Meta<typeof CharacterCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Datos reales del backend ───────────────────────────────
// Estos son los datos que vendrán de GET /characters/:name
// cuando conectemos con el backend real

/** Dark Knight Johan — personaje activo */
export const Johan: Story = {
  args: {
    name:           'Johan',
    characterClass: 'DarkKnight',
    level:          12,
    isActive:       true,
    hp:    { current: 390, max: 500 },
    mp:    { current: 90,  max: 200 },
    exp:   { current: 62,  max: 100 },
    stats: { strength: 112, agility: 80, vitality: 109, energy: 22 },
    skills: ['Twisting Slash', 'Impale', 'Death Stab'],
  },
};

/** Dark Wizard Merlin */
export const Merlin: Story = {
  args: {
    name:           'Merlin',
    characterClass: 'DarkWizard',
    level:          8,
    isActive:       false,
    hp:    { current: 165, max: 300 },
    mp:    { current: 528, max: 600 },
    exp:   { current: 35,  max: 100 },
    stats: { strength: 34, agility: 42, vitality: 39, energy: 110 },
    skills: ['Fireball', 'Ice Storm', 'Lightning'],
  },
};

/** Fairy Elf Arwen */
export const Arwen: Story = {
  args: {
    name:           'Arwen',
    characterClass: 'Elf',
    level:          5,
    isActive:       false,
    hp:    { current: 225, max: 250 },
    mp:    { current: 280, max: 400 },
    exp:   { current: 15,  max: 100 },
    stats: { strength: 22, agility: 75, vitality: 20, energy: 55 },
    skills: ['Triple Shot', 'Heal', 'Defense'],
  },
};

/** Las 3 cards juntas — como en el diseño del mockup */
export const AllCharacters: Story = {
  args: {
    name:           'Johan',
    characterClass: 'DarkKnight',
    level:          12,
    isActive:       true,
    hp:    { current: 390, max: 500 },
    mp:    { current: 90,  max: 200 },
    exp:   { current: 62,  max: 100 },
    stats: { strength: 112, agility: 80, vitality: 109, energy: 22 },
    skills: ['Twisting Slash', 'Impale', 'Death Stab'],
  },
  render: () => (
    <View style={{ gap: 16 }}>
      <CharacterCard
        name="Johan" characterClass="DarkKnight" level={12} isActive={true}
        hp={{ current: 390, max: 500 }} mp={{ current: 90, max: 200 }}
        exp={{ current: 62, max: 100 }}
        stats={{ strength: 112, agility: 80, vitality: 109, energy: 22 }}
        skills={['Twisting Slash', 'Impale', 'Death Stab']}
      />
      <CharacterCard
        name="Merlin" characterClass="DarkWizard" level={8} isActive={false}
        hp={{ current: 165, max: 300 }} mp={{ current: 528, max: 600 }}
        exp={{ current: 35, max: 100 }}
        stats={{ strength: 34, agility: 42, vitality: 39, energy: 110 }}
        skills={['Fireball', 'Ice Storm', 'Lightning']}
      />
      <CharacterCard
        name="Arwen" characterClass="Elf" level={5} isActive={false}
        hp={{ current: 225, max: 250 }} mp={{ current: 280, max: 400 }}
        exp={{ current: 15, max: 100 }}
        stats={{ strength: 22, agility: 75, vitality: 20, energy: 55 }}
        skills={['Triple Shot', 'Heal', 'Defense']}
      />
    </View>
  ),
};