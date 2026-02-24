/**
 * ============================================================
 * 📖 BITÁCORA STORYBOOK — MUNDO JAVASCRIPT (.jsx)
 * Componente: ActionBtn
 * Archivo: ActionBtn.stories.jsx
 * ============================================================
 *
 * 🧠 CONCEPTO CLAVE: COMPONENTE "DUMB" (Tonto / Presentacional)
 * ---------------------------------------------------------------
 * ActionBtn es un componente DUMB porque:
 *   ✅ Solo recibe datos por PROPS
 *   ✅ Solo se encarga de RENDERIZAR (mostrar)
 *   ❌ NO maneja estado interno complejo
 *   ❌ NO llama a APIs
 *   ❌ NO sabe nada de Redux
 *
 * La ventaja de esto es que en Storybook podemos probarlo
 * de forma AISLADA, sin necesitar ningún servidor ni store.
 * Solo le pasamos los datos por 'args' y funciona.
 *
 * Si fuera un componente SMART (inteligente), necesitaríamos
 * configurar cosas adicionales (lo veremos más abajo).
 * ============================================================
 */

import React from 'react';
import { View } from 'react-native';
import { ActionBtn } from './index';

// ============================================================
// 📦 SECCIÓN 1: META (La configuración del componente)
// ============================================================
/**
 * El objeto 'default' es la META de Storybook.
 * Le dice a Storybook:
 *   - Dónde mostrar este componente en el menú (title)
 *   - Cuál es el componente que estamos documentando (component)
 *   - Configuraciones adicionales (decorators, argTypes, etc.)
 */
export default {
  title: '01-Atoms/ActionBtn-JS--Example',
  component: ActionBtn,

  /**
   * 🏷️ tags: ['autodocs']
   * Le dice a Storybook que genere automáticamente una página
   * de documentación (pestaña "Docs") con todas las variantes.
   * PERO en JS, esa página estará INCOMPLETA porque JS no
   * sabe qué props acepta el componente.
   */
  tags: ['autodocs'],

  /**
   * 🎨 decorators
   * Son "envoltorios" que rodean cada historia.
   * Útil para dar contexto visual (fondo oscuro de MU Online).
   * 
   * 🔑 ESCENARIO: ¿Cuándo necesito cambiar el decorator?
   * - Si el componente necesita un fondo específico → decorator
   * - Si el componente necesita estar centrado → decorator
   * - Si el componente necesita un Provider de Redux → decorator ← LO VEREMOS DESPUÉS
   */
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          backgroundColor: '#050508',
          padding: 24,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 12,
        }}
      >
        <Story />
      </View>
    ),
  ],

  /**
   * ⚠️ argTypes — EL "IMPUESTO JAVASCRIPT" ⚠️
   * ---------------------------------------------------------------
   * Como estamos en .jsx, Storybook es "ciego" — no puede leer
   * las props del componente automáticamente.
   * Entonces tenemos que DESCRIBIR manualmente cada prop aquí.
   *
   * Esto significa que si mañana agregas una prop nueva a ActionBtn,
   * tienes que acordarte de venir AQUÍ también a documentarla.
   * Si te olvidas → la prop aparece sin documentar en Storybook.
   *
   * En TypeScript esto DESAPARECE COMPLETAMENTE (lo verás en el .tsx)
   */
  argTypes: {

    // ── PROP: icon ──────────────────────────────────────────────
    icon: {
      control: 'text',
      description: '🎮 El emoji o ícono que representa la habilidad.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '⚔️' },
        // 'table' controla cómo se ve esta prop en la pestaña "Docs"
      },
    },

    // ── PROP: label ─────────────────────────────────────────────
    label: {
      control: 'text',
      description: '📝 El nombre de la habilidad o acción.',
      table: {
        type: { summary: 'string' },
      },
    },

    // ── PROP: cost ──────────────────────────────────────────────
    cost: {
      control: 'text',
      description: '💎 El costo en MP o texto descriptivo inferior.',
      table: {
        type: { summary: 'string' },
      },
    },

    // ── PROP: variant ───────────────────────────────────────────
    /**
     * 'control: select' crea un dropdown en el panel de Storybook.
     * En JS tenemos que escribir las opciones MANUALMENTE aquí.
     * Si en el componente agregas 'disabled' como variante nueva,
     * tienes que venir aquí a agregar 'disabled' en options[].
     *
     * En TypeScript, si agregas 'disabled' al tipo del componente,
     * el dropdown se actualiza SOLO. Cero trabajo extra.
     */
    variant: {
      control: 'select',
      options: ['default', 'attack', 'heal'],
      description:
        '🎨 Cambia el estilo visual (borde y colores) según el tipo de acción.',
      table: {
        type: { summary: "'default' | 'attack' | 'heal'" },
        defaultValue: { summary: 'default' },
      },
    },

    // ── PROP: onPress ───────────────────────────────────────────
    /**
     * 🎬 action: 'pressed'
     * Esto es especial — cuando el usuario hace clic en el botón
     * dentro de Storybook, aparece un log en la pestaña "Actions"
     * que dice "pressed". Muy útil para verificar que los eventos
     * se disparan correctamente sin necesitar un componente padre.
     *
     * 🔑 ESCENARIO DUMB vs SMART:
     * - Componente DUMB: onPress viene de las props (como aquí)
     * - Componente SMART: onPress dispara un dispatch de Redux internamente
     *   → En ese caso NO necesitaríamos esta prop en el story
     */
    onPress: {
      action: 'pressed',
      description: '👆 Función que se ejecuta al presionar el botón.',
    },
  },
};

// ============================================================
// 📖 SECCIÓN 2: LAS HISTORIAS (Stories)
// ============================================================
/**
 * Cada export nombrado = una variante del componente en el menú.
 * El nombre del export se convierte en el nombre de la historia.
 * Ejemplo: 'export const AttackAction' → aparece como "Attack Action"
 *
 * 'args' son los datos que le pasamos como props al componente.
 * Es como hacer: <ActionBtn icon="⚔️" label="Attack" ... />
 */

// ── HISTORIA 1: Attack ──────────────────────────────────────
/**
 * El botón de ataque básico — sin costo de MP.
 * variant: 'attack' aplica el borde rojo (mu-knight color).
 *
 * ⚠️ PELIGRO JAVASCRIPT:
 * Si escribo 'icono' en vez de 'icon' aquí abajo,
 * JavaScript NO me avisa. El botón simplemente se ve mal
 * y tengo que ir al navegador a descubrirlo.
 */
export const AttackAction = {
  args: {
    icon: '⚔️',
    label: 'Attack',
    cost: 'Basic',
    variant: 'attack',
  },
};

// ── HISTORIA 2: Twisting Slash ──────────────────────────────
/**
 * Habilidad especial del Dark Knight.
 * variant: 'default' aplica el borde dorado (mu-gold).
 * cost: '30 MP' → se verá en azul (mu-mp color).
 *
 * ⚠️ PELIGRO JAVASCRIPT:
 * Si escribo variant: 'magic' (que no existe),
 * JavaScript me deja hacerlo sin quejarse.
 * El componente recibirá una variante inválida y
 * aplicará el estilo 'default' silenciosamente.
 * En TypeScript esto sería un ERROR ROJO inmediato.
 */
export const MagicSkill = {
  args: {
    icon: '🌪️',
    label: 'Twisting Slash',
    cost: '30 MP',
    variant: 'default',
  },
};

// ── HISTORIA 3: Impale ──────────────────────────────────────
export const ImpaleSkill = {
  args: {
    icon: '🗡️',
    label: 'Impale',
    cost: '50 MP',
    variant: 'default',
  },
};

// ── HISTORIA 4: Use Potion ──────────────────────────────────
/**
 * variant: 'heal' aplica el color verde (mu-elf color) al costo.
 */
export const HealAction = {
  args: {
    icon: '🧪',
    label: 'Use Potion',
    cost: 'Heal HP',
    variant: 'heal',
  },
};

// ============================================================
// 🔑 SECCIÓN 3: ESCENARIOS AVANZADOS (Para tu bitácora)
// ============================================================

/**
 * ESCENARIO A: ¿Qué pasa si el componente recibe un callback complejo?
 * -----------------------------------------------------------------------
 * Ejemplo: onPress que recibe el nombre de la habilidad como parámetro.
 *
 * En el story, lo simulamos así:
 */
export const WithCallback = {
  args: {
    icon: '⚔️',
    label: 'Attack',
    cost: 'Basic',
    variant: 'attack',
    // Storybook capturará este llamado en la pestaña "Actions"
    // mostrando exactamente qué argumentos recibió la función.
  },
};

/**
 * ESCENARIO B: ¿Qué pasa si el componente usa Redux? (SMART component)
 * -----------------------------------------------------------------------
 * Si ActionBtn despachara una acción de Redux internamente,
 * necesitaríamos envolver TODA la historia en un Provider de Redux.
 *
 * Esto se hace en el 'decorator' de la siguiente forma:
 *
 * import { Provider } from 'react-redux';
 * import { store } from '../../../redux/store';
 *
 * decorators: [
 *   (Story) => (
 *     <Provider store={store}>    ← Envolvemos con el store
 *       <View style={{ ... }}>
 *         <Story />
 *       </View>
 *     </Provider>
 *   ),
 * ],
 *
 * IMPORTANTE: Un componente con Redux en Storybook ya NO necesita
 * 'args' para las props que vienen del store — esos datos
 * vienen del store directamente.
 * Solo necesitas 'args' para las props que aún recibe por fuera.
 *
 * 🎯 RECOMENDACIÓN: Intenta mantener ActionBtn como DUMB.
 * Crea un componente SMART (ActionBtnContainer) que use Redux
 * y que renderice <ActionBtn /> pasándole las props.
 * Así ActionBtn siempre es testeable de forma aislada en Storybook.
 */

/**
 * ESCENARIO C: ¿Qué pasa si la prop es opcional y quiero ver el default?
 * -----------------------------------------------------------------------
 * Simplemente no la incluyas en args:
 */
export const DefaultVariant = {
  args: {
    icon: '✨',
    label: 'Skill',
    cost: '10 MP',
    // 'variant' no está → usará el valor default del componente ('default')
  },
};