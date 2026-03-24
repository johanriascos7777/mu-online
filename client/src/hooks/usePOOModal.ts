// src/hooks/usePOOModal.ts
//
// Hook — maneja el estado del modal POO
// Así HomeScreen, BossShowcase y CombatArena no repiten la lógica

import { useState } from 'react';
import type { ConceptId } from '../data/poo-concepts';

export interface POOModalState {
  visible:   boolean;
  concepts:  ConceptId[];
  title:     string;
}

export function usePOOModal() {
  const [modal, setModal] = useState<POOModalState>({
    visible:  false,
    concepts: [],
    title:    '',
  });

  const openModal = (concepts: ConceptId[], title: string) => {
    setModal({ visible: true, concepts, title });
  };

  const closeModal = () => setModal(m => ({ ...m, visible: false }));

  return { modal, openModal, closeModal };
}